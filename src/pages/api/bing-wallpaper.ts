export const prerender = false;

// 缓存图片列表，避免每次都重新获取
let cachedImages: string[] = [];
let cacheTime = 0;
const CACHE_DURATION = 3600000; // 1小时缓存

export async function GET() {
	try {
		// 如果缓存有效，直接返回
		const now = Date.now();
		if (cachedImages.length > 0 && now - cacheTime < CACHE_DURATION) {
			console.log(`使用缓存的 ${cachedImages.length} 张图片`);
			return new Response(JSON.stringify({ images: cachedImages }), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "public, max-age=3600",
				},
			});
		}

		// 增加更多市场
		const markets = [
			"zh-CN",
			"en-US",
			"ja-JP",
			"en-GB",
			"de-DE",
			"fr-FR",
			"es-ES",
			"it-IT",
			"pt-BR",
			"ko-KR",
			"en-CA",
			"en-AU",
			"en-IN",
			"nl-NL",
			"ru-RU",
			"tr-TR",
			"pl-PL",
			"sv-SE",
			"da-DK",
			"fi-FI",
			"nb-NO",
			"cs-CZ",
		];
		const allImages: string[] = [];
		const seenUrls = new Set<string>();

		console.log("开始获取必应壁纸...");

		// 并行获取所有请求
		const promises = [];

		for (const mkt of markets) {
			// 每个市场获取过去72天的图片（分9次，每次8张）
			for (let idx = 0; idx < 72; idx += 8) {
				promises.push(
					fetch(
						`https://www.bing.com/HPImageArchive.aspx?format=js&idx=${idx}&n=8&mkt=${mkt}`,
					)
						.then((res) => res.json())
						.catch(() => ({ images: [] })),
				);
			}
		}

		console.log(`发起 ${promises.length} 个请求...`);

		// 等待所有请求完成
		const results = await Promise.all(promises);

		// 处理所有结果
		results.forEach((data: any) => {
			if (data.images && Array.isArray(data.images)) {
				data.images.forEach((img: any) => {
					if (img?.urlbase) {
						const hdUrl = `${img.urlbase}_1920x1080.jpg`;
						const fullUrl = `https://www.bing.com${hdUrl}`;

						if (!seenUrls.has(fullUrl)) {
							seenUrls.add(fullUrl);
							allImages.push(fullUrl);
						}
					}
				});
			}
		});

		console.log(`总共获取到 ${allImages.length} 张不重复的图片`);

		if (allImages.length === 0) {
			throw new Error("没有获取到任何图片");
		}

		// 更新缓存
		cachedImages = allImages;
		cacheTime = now;

		return new Response(JSON.stringify({ images: allImages }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=3600",
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		return new Response(
			JSON.stringify({
				error: "Failed to fetch Bing wallpaper",
				details: String(error),
				images: [],
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}
