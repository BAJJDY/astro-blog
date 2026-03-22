import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbars } from "overlayscrollbars";
import { siteConfig } from "../config";
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	BANNER_HEIGHT_HOME,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from "../constants/constants";
import {
	getHue,
	getStoredTheme,
	setHue,
	setTheme,
} from "../utils/setting-utils";
import { pathsEqual, url } from "../utils/url-utils";

const bannerEnabled = !!document.getElementById("banner-wrapper");

function setClickOutsideToClose(panel: string, ignores: string[]) {
	document.addEventListener("click", (event) => {
		const panelDom = document.getElementById(panel);
		const tDom = event.target;
		if (!(tDom instanceof Node)) return;
		for (const ig of ignores) {
			const ie = document.getElementById(ig);
			if (ie === tDom || ie?.contains(tDom)) {
				return;
			}
		}
		if (panelDom) {
			panelDom.classList.add("float-panel-closed");
		}
	});
}

setClickOutsideToClose("display-setting", [
	"display-setting",
	"display-settings-switch",
]);
setClickOutsideToClose("nav-menu-panel", ["nav-menu-panel", "nav-menu-switch"]);
setClickOutsideToClose("search-panel", [
	"search-panel",
	"search-bar",
	"search-switch",
]);

function loadTheme() {
	const theme = getStoredTheme();
	setTheme(theme);
}

function loadHue() {
	setHue(getHue());
}

function initCustomScrollbar() {
	const bodyElement = document.querySelector("body");
	if (!bodyElement) return;
	OverlayScrollbars(
		{
			target: bodyElement,
			cancel: {
				nativeScrollbarsOverlaid: true,
			},
		},
		{
			scrollbars: {
				theme: "scrollbar-base scrollbar-auto py-1",
				visibility: "hidden",
				autoHide: "never",
			},
		},
	);

	const katexElements = document.querySelectorAll(".katex-display");

	const katexObserverOptions = {
		root: null,
		rootMargin: "100px",
		threshold: 0.1,
	};

	const processKatexElement = (element: Element) => {
		if (!element.parentNode) return;
		if (element.hasAttribute("data-scrollbar-initialized")) return;

		const container = document.createElement("div");
		container.className = "katex-display-container";
		container.setAttribute("aria-label", "scrollable container for formulas");

		element.parentNode.insertBefore(container, element);
		container.appendChild(element);

		OverlayScrollbars(container, {
			scrollbars: {
				theme: "scrollbar-base scrollbar-auto",
				autoHide: "leave",
				autoHideDelay: 500,
				autoHideSuspend: false,
			},
		});

		element.setAttribute("data-scrollbar-initialized", "true");
	};

	const katexObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				processKatexElement(entry.target);
				observer.unobserve(entry.target);
			}
		});
	}, katexObserverOptions);

	katexElements.forEach((element) => {
		katexObserver.observe(element);
	});
}

function showBanner() {
	if (!siteConfig.banner.enable) return;

	const banner = document.getElementById("banner");
	if (!banner) {
		console.error("Banner element not found");
		return;
	}

	banner.classList.remove("opacity-0", "scale-105");
}

function init() {
	loadTheme();
	loadHue();
	initCustomScrollbar();
	showBanner();
}

init();

const setup = () => {
	(window as any).swup.hooks.on("link:click", () => {
		document.documentElement.style.setProperty("--content-delay", "0ms");

		if (!bannerEnabled) {
			return;
		}
		const threshold = window.innerHeight * (BANNER_HEIGHT / 100) - 72 - 16;
		const navbar = document.getElementById("navbar-wrapper");
		if (!navbar || !document.body.classList.contains("lg:is-home")) {
			return;
		}
		if (
			document.body.scrollTop >= threshold ||
			document.documentElement.scrollTop >= threshold
		) {
			navbar.classList.add("navbar-hidden");
		}
	});

	(window as any).swup.hooks.on("content:replace", initCustomScrollbar);

	(window as any).swup.hooks.on("visit:start", (visit: any) => {
		const bodyElement = document.querySelector("body");
		if (bodyElement && pathsEqual(visit.to.url, url("/"))) {
			bodyElement.classList.add("lg:is-home");
		} else if (bodyElement) {
			bodyElement.classList.remove("lg:is-home");
		}

		const heightExtend = document.getElementById("page-height-extend");
		if (heightExtend) {
			heightExtend.classList.remove("hidden");
		}

		const toc = document.getElementById("toc-wrapper");
		if (toc) {
			toc.classList.add("toc-not-ready");
		}
	});

	(window as any).swup.hooks.on("page:view", () => {
		const heightExtend = document.getElementById("page-height-extend");
		if (heightExtend) {
			heightExtend.classList.remove("hidden");
		}
	});

	(window as any).swup.hooks.on("visit:end", (_visit: any) => {
		setTimeout(() => {
			const heightExtend = document.getElementById("page-height-extend");
			if (heightExtend) {
				heightExtend.classList.add("hidden");
			}

			const toc = document.getElementById("toc-wrapper");
			if (toc) {
				toc.classList.remove("toc-not-ready");
			}
		}, 200);
	});
};

if ((window as any)?.swup?.hooks) {
	setup();
} else {
	document.addEventListener("swup:enable", setup);
}

const backToTopBtn = document.getElementById("back-to-top-btn");
const toc = document.getElementById("toc-wrapper");
const navbar = document.getElementById("navbar-wrapper");

function scrollFunction() {
	const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);

	if (backToTopBtn) {
		if (
			document.body.scrollTop > bannerHeight ||
			document.documentElement.scrollTop > bannerHeight
		) {
			backToTopBtn.classList.remove("hide");
		} else {
			backToTopBtn.classList.add("hide");
		}
	}

	if (bannerEnabled && toc) {
		if (
			document.body.scrollTop > bannerHeight ||
			document.documentElement.scrollTop > bannerHeight
		) {
			toc.classList.remove("toc-hide");
		} else {
			toc.classList.add("toc-hide");
		}
	}

	if (!bannerEnabled) return;
	if (navbar) {
		const NAVBAR_HEIGHT = 72;
		const MAIN_PANEL_EXCESS_HEIGHT = MAIN_PANEL_OVERLAPS_BANNER_HEIGHT * 16;

		let bannerHeight = BANNER_HEIGHT;
		if (
			document.body.classList.contains("lg:is-home") &&
			window.innerWidth >= 1024
		) {
			bannerHeight = BANNER_HEIGHT_HOME;
		}
		const threshold =
			window.innerHeight * (bannerHeight / 100) -
			NAVBAR_HEIGHT -
			MAIN_PANEL_EXCESS_HEIGHT -
			16;
		if (
			document.body.scrollTop >= threshold ||
			document.documentElement.scrollTop >= threshold
		) {
			navbar.classList.add("navbar-hidden");
		} else {
			navbar.classList.remove("navbar-hidden");
		}
	}
}

window.onscroll = scrollFunction;

window.onresize = () => {
	let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
	offset = offset - (offset % 4);
	document.documentElement.style.setProperty(
		"--banner-height-extend",
		`${offset}px`,
	);
};

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("animate");
			}
		});
	},
	{ threshold: 0.5 },
);

function observeMarkTags() {
	document.querySelectorAll("mark").forEach((m) => observer.observe(m));
}

observeMarkTags();

if ((window as any)?.swup?.hooks) {
	(window as any).swup.hooks.on("page:view", observeMarkTags);
} else {
	document.addEventListener("swup:enable", () => {
		(window as any).swup.hooks.on("page:view", observeMarkTags);
	});
}
