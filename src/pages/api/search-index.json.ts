import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostUrlBySlug } from "../../utils/url-utils";

type SearchIndexItem = {
	url: string;
	title: string;
	excerpt: string;
	content: string;
};

const normalizeWhitespace = (value: string): string =>
	value.replace(/\r?\n|\r/g, " ").replace(/\s+/g, " ").trim();

const stripMarkdown = (value: string): string =>
	normalizeWhitespace(
		value
			.replace(/```[\s\S]*?```/g, " ")
			.replace(/`[^`]*`/g, " ")
			.replace(/!\[[^\]]*]\([^)]+\)/g, " ")
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			.replace(/<[^>]*>/g, " ")
			.replace(/[#>*_\-|~]/g, " "),
	);

const trimExcerpt = (value: string): string => {
	if (value.length <= 180) return value;
	return `${value.slice(0, 180).trimEnd()}...`;
};

export const GET: APIRoute = async () => {
	const posts = await getCollection("posts", ({ data }) =>
		import.meta.env.PROD ? data.draft !== true : true,
	);

	const payload: SearchIndexItem[] = posts.map((post) => {
		const description = normalizeWhitespace(post.data.description || "");
		const content = stripMarkdown(post.body || "");
		const excerptSource = description || content;

		return {
			url: getPostUrlBySlug(post.slug),
			title: post.data.title,
			excerpt: trimExcerpt(excerptSource),
			content,
		};
	});

	return new Response(JSON.stringify(payload), {
		status: 200,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=600",
		},
	});
};

