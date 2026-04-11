import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";

export const siteConfig: SiteConfig = {
	title: "bajjdy",
	subtitle: "\u4e2a\u4eba\u535a\u5ba2",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 260, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: false,
		src: "assets/images/12.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{
			src: '/favicon/favicon.ico',
			sizes: '32x32',
		}
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		{
			name: "\u9996\u9875",
			url: "/",
			icon: "material-symbols:home-outline-rounded",
		},
		{
			name: "\u5f52\u6863",
			url: "/archive/",
			icon: "material-symbols:archive-outline-rounded",
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/12.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "bajjdy",
	bio: "Free as the wind",
	links: [
		{
			name: "B\u7ad9",
			icon: "fa6-brands:bilibili", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://space.bilibili.com/3494367822088680?spm_id_from=333.1007.0.0",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/bajjdy",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
