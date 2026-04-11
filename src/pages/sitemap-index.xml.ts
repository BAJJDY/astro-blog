import type { APIRoute } from "astro";

const formatDate = (date: Date): string => date.toISOString();

export const GET: APIRoute = async ({ site }) => {
	const baseUrl = site ?? import.meta.env.SITE ?? "http://localhost:4321";
	const sitemapUrl = new URL("sitemap.xml", baseUrl).href;

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${sitemapUrl}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
  </sitemap>
</sitemapindex>`;

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
