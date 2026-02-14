// 增强的图片懒加载
export function initLazyLoadImages() {
	// 检查浏览器是否支持 Intersection Observer
	if (!("IntersectionObserver" in window)) {
		console.log(
			"IntersectionObserver not supported, using native lazy loading",
		);
		return;
	}

	const imageObserver = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;

					// 添加加载动画
					img.classList.add("image-loading");

					// 如果有 data-src，则加载图片
					if (img.dataset.src) {
						img.src = img.dataset.src;
						img.removeAttribute("data-src");
					}

					// 图片加载完成后的处理
					img.addEventListener("load", () => {
						img.classList.remove("image-loading");
						img.classList.add("image-loaded");
					});

					// 停止观察已加载的图片
					observer.unobserve(img);
				}
			});
		},
		{
			// 提前 50px 开始加载
			rootMargin: "50px 0px",
			threshold: 0.01,
		},
	);

	// 观察所有懒加载图片
	const lazyImages = document.querySelectorAll('img[loading="lazy"]');
	lazyImages.forEach((img) => {
		imageObserver.observe(img);
	});
}

// 预加载关键图片
export function preloadCriticalImages() {
	const criticalImages = document.querySelectorAll('img[loading="eager"]');

	criticalImages.forEach((img) => {
		if (img.dataset.src) {
			const link = document.createElement("link");
			link.rel = "preload";
			link.as = "image";
			link.href = img.dataset.src;
			document.head.appendChild(link);
		}
	});
}

// 图片加载失败处理
export function handleImageErrors() {
	document.addEventListener(
		"error",
		(e) => {
			if (e.target.tagName === "IMG") {
				const img = e.target;
				img.classList.add("image-error");

				// 可以设置一个默认的占位图
				// img.src = '/placeholder.png';

				console.warn("Image failed to load:", img.src);
			}
		},
		true,
	);
}
