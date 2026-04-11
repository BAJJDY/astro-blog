import type { APIRoute } from "astro";
import { getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";

type SearchIndexItem = {
	url: string;
	title: string;
	description: string;
	content: string;
};

const normalizeText = (value: string): string =>
	value
		.replace(/<[^>]*>/g, " ")
		.replace(/[\r\n\t]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();

export const GET: APIRoute = async () => {
	const posts = await getSortedPosts();

	const payload: SearchIndexItem[] = posts.map((post) => {
		const body = typeof post.body === "string" ? post.body : String(post.body ?? "");
		return {
			url: url(`/posts/${post.slug}/`),
			title: post.data.title,
			description: post.data.description ?? "",
			content: normalizeText(body),
		};
	});

	return new Response(JSON.stringify(payload), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=300",
		},
	});
};
