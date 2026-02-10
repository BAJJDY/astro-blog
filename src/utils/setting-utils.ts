import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

// Check if we're in a browser environment
export function isBrowser(): boolean {
	return (
		typeof window !== "undefined" &&
		typeof localStorage !== "undefined" &&
		typeof document !== "undefined"
	);
}

export function getDefaultHue(): number {
	const fallback = "250";
	if (isBrowser()) {
		const configCarrier = document.getElementById("config-carrier");
		return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
	}
	return Number.parseInt(fallback, 10);
}

export function getHue(): number {
	if (isBrowser()) {
		const stored = localStorage.getItem("hue");
		if (stored) {
			return Number.parseInt(stored, 10);
		}
	}
	return getDefaultHue();
}

export function setHue(hue: number): void {
	if (isBrowser()) {
		localStorage.setItem("hue", String(hue));
		const r = document.querySelector(":root") as HTMLElement;
		if (r) {
			r.style.setProperty("--hue", String(hue));
		}
	}
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	if (isBrowser()) {
		// 直接操作DOM，使用最快的方法切换主题
		const htmlElement = document.documentElement;
		
		// 立即执行主题切换，不使用任何动画或过渡
		const isDarkMode = theme === DARK_MODE || (theme === AUTO_MODE && window.matchMedia("(prefers-color-scheme: dark)").matches);
		
		// 使用classList的toggle方法，这是DOM API中最快的方法之一
		// 第二个参数为true表示添加类，false表示移除类
		htmlElement.classList.toggle('dark', isDarkMode);

		// Set the theme for Expressive Code
		htmlElement.setAttribute(
			"data-theme",
			expressiveCodeConfig.theme,
		);
		
		// 强制浏览器立即重绘
		htmlElement.offsetHeight; // 触发重排
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	if (isBrowser()) {
		localStorage.setItem("theme", theme);
		applyThemeToDocument(theme);
	}
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	if (isBrowser()) {
		const stored = localStorage.getItem("theme") as LIGHT_DARK_MODE;
		if (stored) {
			return stored;
		}
	}
	return DEFAULT_THEME;
}
