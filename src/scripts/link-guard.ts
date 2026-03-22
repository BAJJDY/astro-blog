const overlay = document.getElementById("link-confirm-overlay");
const allowBtn = document.getElementById("link-confirm-allow");
const cancelBtn = document.getElementById("link-confirm-cancel");
const message = document.getElementById("link-confirm-message");

let pendingHref: string | null = null;

const shouldInterceptLink = (
	anchor: HTMLAnchorElement,
	event: MouseEvent,
): boolean => {
	const inArticleContent = !!anchor.closest(".custom-md, .markdown-content");
	if (!inArticleContent) return false;

	if (event.button !== 0) return false;
	if (event.defaultPrevented) return false;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
		return false;
	}
	if (anchor.dataset.noConfirmLink === "true") return false;
	if (anchor.hasAttribute("download")) return false;

	const rawHref = anchor.getAttribute("href");
	if (!rawHref) return false;
	const href = rawHref.trim().toLowerCase();

	if (!href || href.startsWith("#")) return false;
	if (href.startsWith("javascript:")) return false;
	if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;

	return true;
};

const resolveHref = (anchor: HTMLAnchorElement): string => {
	try {
		return new URL(anchor.getAttribute("href") || "", window.location.href).toString();
	} catch {
		return anchor.href;
	}
};

if (
	overlay instanceof HTMLElement &&
	allowBtn instanceof HTMLButtonElement &&
	cancelBtn instanceof HTMLButtonElement &&
	message instanceof HTMLElement
) {
	const closeModal = () => {
		overlay.classList.add("hidden");
		overlay.classList.remove("flex");
		document.body.classList.remove("overflow-hidden");
		pendingHref = null;
	};

	const openModal = (href: string) => {
		pendingHref = href;
		message.textContent = `\u8be5\u94fe\u63a5\u5c06\u4ee5\u65b0\u9875\u9762\u6253\u5f00\uff1a${href}`;
		overlay.classList.remove("hidden");
		overlay.classList.add("flex");
		document.body.classList.add("overflow-hidden");
	};

	document.addEventListener(
		"click",
		(event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;

			if (target.closest("#link-confirm-overlay")) return;

			const anchor = target.closest("a[href]");
			if (!(anchor instanceof HTMLAnchorElement)) return;
			if (!shouldInterceptLink(anchor, event)) return;

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			openModal(resolveHref(anchor));
		},
		true,
	);

	allowBtn.addEventListener("click", () => {
		if (pendingHref) {
			window.open(pendingHref, "_blank", "noopener,noreferrer");
		}
		closeModal();
	});

	cancelBtn.addEventListener("click", () => {
		closeModal();
	});

	overlay.addEventListener("click", (event) => {
		if (event.target === overlay) {
			closeModal();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && !overlay.classList.contains("hidden")) {
			closeModal();
		}
	});
}
