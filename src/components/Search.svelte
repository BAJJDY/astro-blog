<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";

type LocalSearchItem = {
	url: string;
	title: string;
	description: string;
	content: string;
};

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;
let currentKeyword = "";

let localSearchIndex: LocalSearchItem[] = [];
let localSearchIndexLoaded = false;
let localSearchIndexLoadingPromise: Promise<void> | null = null;

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const closePanel = (): void => {
	const panel = document.getElementById("search-panel");
	panel?.classList.add("float-panel-closed");
};

const clearSearchState = (): void => {
	keywordDesktop = "";
	keywordMobile = "";
	currentKeyword = "";
	result = [];
};

const handleResultClick = (): void => {
	clearSearchState();
	closePanel();
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

const escapeHtml = (value: string): string =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");

const buildExcerpt = (rawText: string, keyword: string): string => {
	const normalizedText = rawText.replace(/\s+/g, " ").trim();
	if (!normalizedText) return "";

	const normalizedKeyword = keyword.trim();
	if (!normalizedKeyword) {
		return escapeHtml(normalizedText.slice(0, 120));
	}

	const textLower = normalizedText.toLowerCase();
	const keywordLower = normalizedKeyword.toLowerCase();
	const matchIndex = textLower.indexOf(keywordLower);

	if (matchIndex === -1) {
		const fallback = normalizedText.slice(0, 120);
		return `${escapeHtml(fallback)}${normalizedText.length > 120 ? "..." : ""}`;
	}

	const start = Math.max(0, matchIndex - 36);
	const end = Math.min(
		normalizedText.length,
		matchIndex + normalizedKeyword.length + 84,
	);
	const snippet = normalizedText.slice(start, end);
	const localMatchIndex = snippet.toLowerCase().indexOf(keywordLower);
	const hasMatch = localMatchIndex >= 0;

	const before = hasMatch ? snippet.slice(0, localMatchIndex) : snippet;
	const match = hasMatch
		? snippet.slice(localMatchIndex, localMatchIndex + normalizedKeyword.length)
		: "";
	const after = hasMatch
		? snippet.slice(localMatchIndex + normalizedKeyword.length)
		: "";

	const prefix = start > 0 ? "..." : "";
	const suffix = end < normalizedText.length ? "..." : "";

	if (!hasMatch) {
		return `${prefix}${escapeHtml(snippet)}${suffix}`;
	}

	return `${prefix}${escapeHtml(before)}<mark>${escapeHtml(match)}</mark>${escapeHtml(after)}${suffix}`;
};

const ensureLocalSearchIndex = async (): Promise<void> => {
	if (localSearchIndexLoaded) return;
	if (localSearchIndexLoadingPromise) {
		await localSearchIndexLoadingPromise;
		return;
	}

	localSearchIndexLoadingPromise = (async () => {
		const response = await fetch(url("/search-index.json"));
		if (!response.ok) {
			throw new Error(`Failed to load local search index: ${response.status}`);
		}

		const data = (await response.json()) as LocalSearchItem[];
		localSearchIndex = Array.isArray(data) ? data : [];
		localSearchIndexLoaded = true;
	})();

	try {
		await localSearchIndexLoadingPromise;
	} finally {
		localSearchIndexLoadingPromise = null;
	}
};

const searchWithLocalIndex = (keyword: string): SearchResult[] => {
	const normalizedKeyword = keyword.trim().toLowerCase();
	if (!normalizedKeyword) return [];

	return localSearchIndex
		.filter((item) => {
			const haystack = `${item.title} ${item.description} ${item.content}`.toLowerCase();
			return haystack.includes(normalizedKeyword);
		})
		.slice(0, 20)
		.map((item) => {
			const excerptSource = `${item.description} ${item.content}`.trim();
			return {
				url: item.url,
				meta: {
					title: item.title,
				},
				excerpt: buildExcerpt(excerptSource, keyword),
			};
		});
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	const normalizedKeyword = keyword.trim();
	currentKeyword = normalizedKeyword;

	if (!normalizedKeyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}

	if (!initialized) {
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(normalizedKeyword);
			searchResults = await Promise.all(response.results.map((item) => item.data()));
		} else {
			await ensureLocalSearchIndex();
			searchResults = searchWithLocalIndex(normalizedKeyword);
		}

		result = searchResults;
		setPanelVisibility(true, isDesktop);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(false, isDesktop);
	} finally {
		isSearching = false;
	}
};

const getSearchingText = (keyword: string): string => `\u6B63\u5728\u641C\u7D22 \"${keyword}\"`;
const getMatchedText = (count: number): string => `\u547D\u4E2D ${count} \u4E2A\u5173\u952E\u5B57`;

onMount(() => {
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";

		if (keywordDesktop) search(keywordDesktop, true);
		if (keywordMobile) search(keywordMobile, false);
	};

	if (import.meta.env.DEV) {
		initializeSearch();
		return;
	}

	const handleReady = () => initializeSearch();
	const handleLoadError = () => initializeSearch();

	document.addEventListener("pagefindready", handleReady);
	document.addEventListener("pagefindloaderror", handleLoadError);

	const fallbackTimer = window.setTimeout(() => {
		if (!initialized) initializeSearch();
	}, 2000);

	return () => {
		document.removeEventListener("pagefindready", handleReady);
		document.removeEventListener("pagefindloaderror", handleLoadError);
		window.clearTimeout(fallbackTimer);
	};
});

$: if (initialized && keywordDesktop) {
	(async () => {
		await search(keywordDesktop, true);
	})();
}

$: if (initialized && keywordMobile) {
	(async () => {
		await search(keywordMobile, false);
	})();
}
</script>

<!-- search bar for desktop view -->
<div id="search-bar" class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
">
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
    <input placeholder="{i18n(I18nKey.search)}" bind:value={keywordDesktop} on:focus={() => search(keywordDesktop, true)}
           class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-black/50 dark:text-white/50"
    >
</div>

<!-- toggle btn for phone/tablet view -->
<button on:click={togglePanel} aria-label="Search Panel" id="search-switch"
        class="btn-plain scale-animation lg:!hidden rounded-lg w-11 h-11 active:scale-90">
    <Icon icon="material-symbols:search" class="text-[1.25rem]"></Icon>
</button>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-2">

    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
      bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
      dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input placeholder="{i18n(I18nKey.search)}" bind:value={keywordMobile}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50"
        >
    </div>

    {#if currentKeyword}
        <div class="px-3 pt-2 text-xs text-black/50 dark:text-white/50">
            {isSearching ? getSearchingText(currentKeyword) : getMatchedText(result.length)}
        </div>
    {/if}

    <!-- search results -->
    {#each result as item}
        <a href={item.url} on:click={handleResultClick}
           class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
       rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
            <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                {item.meta.title}<Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
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
  .search-panel {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
</style>
