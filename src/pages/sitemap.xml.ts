import type { APIRoute } from "astro";
import { getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";

const formatDate = (value: Date | string): string => {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString();
};

export const GET: APIRoute = async ({ site }) => {
	const posts = await getSortedPosts();
	const baseUrl = site ?? import.meta.env.SITE ?? "http://localhost:4321";

	const staticUrls = [url("/"), url("/archive/")];
	const postUrls = posts.map((post) => ({
		path: url(`/posts/${post.slug}/`),
		lastmod: formatDate(post.data.updated ?? post.data.published),
	}));

	const allItems = [
		...staticUrls.map((path) => ({ path, lastmod: "" })),
		...postUrls,
	];

	const uniqueItems = Array.from(
		new Map(allItems.map((item) => [item.path, item])).values(),
	);

	const xmlItems = uniqueItems
		.map((item) => {
			const loc = new URL(item.path, baseUrl).href;
			const lastmodTag = item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : "";
			return `<url><loc>${loc}</loc>${lastmodTag}</url>`;
		})
		.join("\n");

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlItems}\n</urlset>`;

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
