import { AUTO_MODE, DARK_MODE, DEFAULT_THEME } from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

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
	if (!isBrowser()) return;
	localStorage.setItem("hue", String(hue));
	document.documentElement.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE): void {
	if (!isBrowser()) return;

	const htmlElement = document.documentElement;
	const isDarkMode =
		theme === DARK_MODE ||
		(theme === AUTO_MODE &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);

	htmlElement.classList.toggle("dark", isDarkMode);
	htmlElement.setAttribute("data-theme", expressiveCodeConfig.theme);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	if (!isBrowser()) return;
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
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