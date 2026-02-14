/**
 * 图片工具函数
 */

/**
 * 检测浏览器是否支持 WebP
 */
export function supportsWebP(): Promise<boolean> {
	if (typeof window === "undefined") return Promise.resolve(false);

	return new Promise((resolve) => {
		const webP = new Image();
		webP.onload = webP.onerror = () => {
			resolve(webP.height === 2);
		};
		webP.src =
			"data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	});
}

/**
 * 检测浏览器是否支持 AVIF
 */
export function supportsAVIF(): Promise<boolean> {
	if (typeof window === "undefined") return Promise.resolve(false);

	return new Promise((resolve) => {
		const avif = new Image();
		avif.onload = avif.onerror = () => {
			resolve(avif.height === 2);
		};
		avif.src =
			"data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
	});
}

/**
 * 获取图片的最佳格式
 */
export async function getBestImageFormat(): Promise<"avif" | "webp" | "jpeg"> {
	if (await supportsAVIF()) return "avif";
	if (await supportsWebP()) return "webp";
	return "jpeg";
}

/**
 * 预加载图片
 * @param src 图片路径
 * @param priority 优先级
 */
export function preloadImage(
	src: string,
	priority: "high" | "low" = "low",
): void {
	if (typeof window === "undefined") return;

	const link = document.createElement("link");
	link.rel = "preload";
	link.as = "image";
	link.href = src;
	if (priority === "high") {
		link.setAttribute("fetchpriority", "high");
	}
	document.head.appendChild(link);
}

/**
 * 图片尺寸建议
 */
export const IMAGE_SIZES = {
	thumbnail: 150,
	small: 320,
	medium: 640,
	large: 1024,
	xlarge: 1536,
	xxlarge: 1920,
} as const;

/**
 * 图片质量建议
 */
export const IMAGE_QUALITY = {
	low: 60,
	medium: 75,
	high: 85,
	max: 95,
} as const;
