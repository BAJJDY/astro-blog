<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import type { SearchResult } from "../global.d";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import { url } from "../utils/url-utils";

type SearchIndexItem = {
	url: string;
	title: string;
	excerpt: string;
	content: string;
};

type RankedSearchResult = SearchResult & { score: number };

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;
let lastKeyword = "";
let keywordHintCount = 0;

let fallbackIndex: SearchIndexItem[] = [];
let fallbackLoaded = false;

let desktopTimer: ReturnType<typeof setTimeout> | undefined;
let mobileTimer: ReturnType<typeof setTimeout> | undefined;

const searchingLabel = (keyword: string): string =>
	`\u6b63\u5728\u641c\u7d22\u201c${keyword}\u201d...`;
const matchedLabel = (
	keyword: string,
	hintCount: number,
	postCount: number,
): string =>
	`\u5173\u952e\u8bcd\u201c${keyword}\u201d\u547d\u4e2d ${hintCount} \u4e2a\u63d0\u793a\u8bcd\uff0c${postCount} \u7bc7\u6587\u7ae0`;
const noRelatedPostsLabel =
	"\u672a\u627e\u5230\u76f8\u5173\u6587\u7ae0\uff0c\u8bf7\u5c1d\u8bd5\u5176\u4ed6\u5173\u952e\u8bcd\u3002";
const relatedPostsLabel = "\u76f8\u5173\u6587\u7ae0";

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel || !isDesktop) return;

	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const countKeywordHints = (items: SearchResult[], keyword: string): number => {
	const hints = new Set<string>();
	const keywordParts = keyword
		.split(/\s+/)
		.map((part) => part.trim())
		.filter(Boolean);

	for (const part of keywordParts) {
		hints.add(part.toLowerCase());
	}

	for (const item of items) {
		const matches = (item.excerpt || "").matchAll(/<mark>(.*?)<\/mark>/gi);
		for (const match of matches) {
			const markedText = (match[1] || "").trim().toLowerCase();
			if (markedText) {
				hints.add(markedText);
			}
		}
	}

	return hints.size;
};

const escapeHtml = (value: string): string =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");

const escapeRegExp = (value: string): string =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSearchTerms = (keyword: string): string[] =>
	Array.from(
		new Set(
			keyword
				.toLowerCase()
				.split(/\s+/)
				.map((part) => part.trim())
				.filter(Boolean),
		),
	);

const highlightText = (text: string, terms: string[]): string => {
	let highlighted = escapeHtml(text);

	for (const term of terms) {
		const safeTerm = escapeRegExp(term);
		if (!safeTerm) continue;
		const reg = new RegExp(`(${safeTerm})`, "gi");
		highlighted = highlighted.replace(reg, "<mark>$1</mark>");
	}

	return highlighted;
};

const buildExcerpt = (item: SearchIndexItem, terms: string[]): string => {
	const source = (item.excerpt || item.content || "").trim();
	if (!source) return "";
	const preview = source.length > 180 ? `${source.slice(0, 180)}...` : source;
	return highlightText(preview, terms);
};

const searchByFallbackIndex = (keyword: string): SearchResult[] => {
	const terms = getSearchTerms(keyword);
	if (terms.length === 0) return [];

	const ranked: RankedSearchResult[] = [];

	for (const item of fallbackIndex) {
		const haystack = `${item.title} ${item.excerpt} ${item.content}`.toLowerCase();
		const titleText = item.title.toLowerCase();
		const matchedTerms = terms.filter((term) => haystack.includes(term));

		if (matchedTerms.length === 0) continue;

		const titleMatches = matchedTerms.filter((term) =>
			titleText.includes(term),
		).length;
		const score = matchedTerms.length * 8 + titleMatches * 5;

		ranked.push({
			url: item.url,
			meta: { title: item.title },
			excerpt: buildExcerpt(item, matchedTerms),
			score,
		});
	}

	return ranked
		.sort((a, b) => b.score - a.score)
		.map(({ score: _score, ...item }) => item);
};

const ensureFallbackIndex = async (): Promise<void> => {
	if (fallbackLoaded) return;

	try {
		const response = await fetch(url("/api/search-index.json"), {
			cache: "force-cache",
		});
		if (!response.ok) {
			throw new Error(`Fallback search index load failed: ${response.status}`);
		}

		const data = (await response.json()) as SearchIndexItem[];
		fallbackIndex = Array.isArray(data) ? data : [];
	} catch (error) {
		console.error("Failed to load fallback search index:", error);
		fallbackIndex = [];
	} finally {
		fallbackLoaded = true;
	}
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	const normalizedKeyword = keyword.trim();

	if (!normalizedKeyword) {
		if (isDesktop) {
			setPanelVisibility(false, true);
		}
		result = [];
		lastKeyword = "";
		keywordHintCount = 0;
		isSearching = false;
		return;
	}

	if (!initialized) {
		// 等待初始化完成后再搜索
		setTimeout(() => {
			void search(keyword, isDesktop);
		}, 100);
		return;
	}

	lastKeyword = normalizedKeyword;
	if (isDesktop) {
		setPanelVisibility(true, true);
	}
	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(normalizedKeyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else {
			await ensureFallbackIndex();
			searchResults = searchByFallbackIndex(normalizedKeyword);
		}

		result = searchResults;
		keywordHintCount = countKeywordHints(searchResults, normalizedKeyword);
		if (isDesktop) {
			setPanelVisibility(true, true);
		}
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		keywordHintCount = 0;
		if (isDesktop) {
			setPanelVisibility(true, true);
		}
	} finally {
		isSearching = false;
	}
};

function queueSearchDesktop() {
	if (desktopTimer) {
		clearTimeout(desktopTimer);
	}
	desktopTimer = setTimeout(() => {
		void search(keywordDesktop, true);
	}, 180);
}

function queueSearchMobile() {
	if (mobileTimer) {
		clearTimeout(mobileTimer);
	}
	mobileTimer = setTimeout(() => {
		void search(keywordMobile, false);
	}, 180);
}

onMount(() => {
	const initializeSearch = async () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";

		if (!pagefindLoaded) {
			await ensureFallbackIndex();
		}

		if (keywordDesktop) {
			queueSearchDesktop();
		}
		if (keywordMobile) {
			queueSearchMobile();
		}
	};

	const onPagefindReady = () => {
		pagefindLoaded = true;
	};

	const onPagefindError = () => {
		console.warn(
			"Pagefind load error event received. Falling back to local search index.",
		);
		pagefindLoaded = false;
	};

	void initializeSearch();
	document.addEventListener("pagefindready", onPagefindReady);
	document.addEventListener("pagefindloaderror", onPagefindError);

	return () => {
		document.removeEventListener("pagefindready", onPagefindReady);
		document.removeEventListener("pagefindloaderror", onPagefindError);
		if (desktopTimer) {
			clearTimeout(desktopTimer);
		}
		if (mobileTimer) {
			clearTimeout(mobileTimer);
		}
	};
});
</script>

<div
	id="search-bar"
	class="hidden md:flex shrink-0 transition-all items-center h-11 mr-2 rounded-lg
	      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
	      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
>
	<Icon
		icon="material-symbols:search"
		class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"
	></Icon>
	<input
		placeholder={i18n(I18nKey.search)}
		bind:value={keywordDesktop}
		on:focus={queueSearchDesktop}
		on:input={queueSearchDesktop}
		class="transition-all pl-10 text-sm bg-transparent border-none outline-0
		h-full w-40 active:w-52 focus:w-52 text-black/60 dark:text-white/65"
	>
</div>

<button
	on:click={togglePanel}
	aria-label="Search Panel"
	id="search-switch"
	class="btn-plain scale-animation md:hidden rounded-lg w-11 h-11 active:scale-90 shrink-0"
>
	<Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<div
	id="search-panel"
	class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2"
>
	<div
		id="search-bar-inside"
		class="flex relative md:hidden transition-all items-center h-11 rounded-xl
	      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
	      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
	>
		<Icon
			icon="material-symbols:search"
			class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"
		></Icon>
		<input
			placeholder={i18n(I18nKey.search)}
			bind:value={keywordMobile}
			on:input={queueSearchMobile}
			class="pl-10 absolute inset-0 text-sm bg-transparent border-none outline-0
               text-black/60 dark:text-white/65"
		>
	</div>

	{#if lastKeyword}
		<div class="mt-2 px-3 py-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] text-sm text-75">
			{#if isSearching}
				{searchingLabel(lastKeyword)}
			{:else}
				{matchedLabel(lastKeyword, keywordHintCount, result.length)}
			{/if}
		</div>
	{/if}

	{#if !isSearching && lastKeyword && result.length === 0}
		<div class="px-3 py-3 text-sm text-50">{noRelatedPostsLabel}</div>
	{/if}

	{#if !isSearching && result.length > 0}
		<div class="px-3 pt-2 text-xs text-50">{relatedPostsLabel}</div>
	{/if}

	{#each result as item}
		<a
			href={item.url}
			class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
       rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]"
		>
			<div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
				{item.meta.title}
				<Icon
					icon="fa6-solid:chevron-right"
					class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"
				></Icon>
			</div>
			<div class="transition text-sm text-50">
				{@html item.excerpt}
			</div>
		</a>
	{/each}
</div>

<style>
  input:focus {
    outline: 0;
  }

  #search-bar,
  #search-bar-inside {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  #search-bar input,
  #search-bar-inside input {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    -webkit-appearance: none;
    appearance: none;
  }

  .search-panel {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
</style>

