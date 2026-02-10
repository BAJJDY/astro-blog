import { siteConfig } from "../config";
import type I18nKey from "./i18nKey";
import { en } from "./languages/en";
import { zh_CN } from "./languages/zh_CN";

export type Translation = {
	[K in I18nKey]: string;
};

const defaultTranslation = en;
// Store loaded translations
const loadedTranslations: { [key: string]: Translation } = {
	en: en,
	en_us: en,
	en_gb: en,
	en_au: en,
	zh_cn: zh_CN,
	zh_tw: zh_CN,
};

// Map language codes to their respective modules
const languageModules: {
	[key: string]: () => Promise<{ default: Translation }>;
} = {
	es: () => import("./languages/es"),
	id: () => import("./languages/id"),
	ja: () => import("./languages/ja"),
	ja_jp: () => import("./languages/ja"),
	ko: () => import("./languages/ko"),
	ko_kr: () => import("./languages/ko"),
	th: () => import("./languages/th"),
	th_th: () => import("./languages/th"),
	vi: () => import("./languages/vi"),
	vi_vn: () => import("./languages/vi"),
	zh_cn: () => Promise.resolve({ default: zh_CN }),
	zh_tw: () => import("./languages/zh_TW"),
	tr: () => import("./languages/tr"),
	tr_tr: () => import("./languages/tr"),
};

export async function getTranslationAsync(lang: string): Promise<Translation> {
	const normalizedLang = lang.toLowerCase();

	// Return from cache if already loaded
	if (loadedTranslations[normalizedLang]) {
		return loadedTranslations[normalizedLang];
	}

	// Try to load the translation module
	const moduleLoader = languageModules[normalizedLang];
	if (moduleLoader) {
		try {
			const module = await moduleLoader();
			loadedTranslations[normalizedLang] = module.default;
			return module.default;
		} catch (error) {
			console.error(`Failed to load translation for ${normalizedLang}:`, error);
			return defaultTranslation;
		}
	}

	return defaultTranslation;
}

// Sync version for initial render
export function getTranslation(lang: string): Translation {
	const normalizedLang = lang.toLowerCase();
	return loadedTranslations[normalizedLang] || defaultTranslation;
}

export function i18n(key: I18nKey): string {
	const lang = siteConfig.lang || "en";
	return getTranslation(lang)[key];
}
