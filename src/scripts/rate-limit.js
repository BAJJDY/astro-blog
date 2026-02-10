// 加密混淆的访问限制脚本
// 使用多层反调试和混淆技术
(() => {
	// 高级反调试技术
	(() => {
		// 方法1: 检测控制台打开（使用更可靠的方法）
		const checkDevTools = () => {
			// 检测console对象是否存在且未被修改
			if (typeof console === "undefined") {
				return false;
			}

			// 检测console.log是否是函数
			if (typeof console.log !== "function") {
				return true;
			}

			// 检测控制台是否打开的方法（更可靠的实现）
			let devToolsOpen = false;

			// 保存原始的log方法
			const originalLog = console.log;

			// 重写log方法
			console.log = function (...args) {
				// 检测调用栈
				const stack = new Error().stack || "";
				// 如果调用栈中包含控制台相关的信息，可能是控制台打开了
				if (stack.includes("console") || stack.includes("Console")) {
					devToolsOpen = true;
				}
				return originalLog.apply(this, args);
			};

			// 尝试触发log
			console.log("");

			// 恢复原始的log方法
			console.log = originalLog;

			return devToolsOpen;
		};

		// 方法3: 检测控制台尺寸（使用更可靠的方法，不使用debugger语句）
		const detectConsoleSize = () => {
			// 方法1: 检测窗口外部尺寸与内部尺寸的差异
			// 只有当差异非常明显时才认为控制台打开
			const outerWidth = window.outerWidth;
			const outerHeight = window.outerHeight;
			const innerWidth = window.innerWidth;
			const innerHeight = window.innerHeight;

			// 计算差异比例，而不是绝对数值
			const widthDiffRatio = Math.abs(outerWidth - innerWidth) / outerWidth;
			const heightDiffRatio = Math.abs(outerHeight - innerHeight) / outerHeight;

			// 只有当差异超过30%时才认为控制台打开
			// 进一步提高阈值，避免在正常触发拦截时误触发黑屏
			return widthDiffRatio > 0.3 || heightDiffRatio > 0.3;
		};

		// 综合检测 - 更严格的检测逻辑，只有当多种方法都检测到控制台打开时才返回true
		window.detectDevTools = () => {
			// 方法1: 检查console对象是否被修改
			const devToolsOpen = checkDevTools();
			// 方法2: 检查控制台尺寸是否异常
			const consoleSizeAbnormal = detectConsoleSize();
			// 只有当两种方法都检测到异常时才认为控制台打开
			// 这样可以避免在正常触发拦截时误触发黑屏
			return devToolsOpen && consoleSizeAbnormal;
		};
	})();

	// 当检测到控制台打开时的处理函数
	const handleDevToolsOpen = () => {
		// 方案1: 重定向到空白页面
		// window.location.replace('about:blank');

		// 方案2: 清除页面内容并显示警告
		document.body.innerHTML = "";
		document.body.style.backgroundColor = "#000";
		document.body.style.color = "#000";
		document.body.style.userSelect = "none";

		// 方案3: 无限循环占用CPU
		// while(true) {}

		// 方案4: 添加覆盖层并禁用所有交互
		const overlay = document.createElement("div");
		overlay.style.position = "fixed";
		overlay.style.top = "0";
		overlay.style.left = "0";
		overlay.style.width = "100%";
		overlay.style.height = "100%";
		overlay.style.backgroundColor = "#000";
		overlay.style.color = "#000";
		overlay.style.display = "flex";
		overlay.style.justifyContent = "center";
		overlay.style.alignItems = "center";
		overlay.style.zIndex = "999999";
		overlay.style.fontSize = "24px";
		overlay.style.pointerEvents = "none";
		overlay.id = "devtools-overlay";
		overlay.textContent = "检测到非法操作，请关闭浏览器后重新访问";

		// 防止用户移除覆盖层
		document.body.appendChild(overlay);

		// 定期检查覆盖层是否被移除
		setInterval(() => {
			if (!document.getElementById("devtools-overlay")) {
				document.body.appendChild(overlay.cloneNode(true));
			}
		}, 50);

		// 禁用所有键盘事件
		document.addEventListener(
			"keydown",
			(e) => {
				e.preventDefault();
				return false;
			},
			true,
		);

		// 禁用所有鼠标事件
		document.addEventListener(
			"mousedown",
			(e) => {
				e.preventDefault();
				return false;
			},
			true,
		);
	};

	// 安全的类型检查函数
	const isNumber = (value) => {
		return (
			typeof value === "number" &&
			!Number.isNaN(value) &&
			Number.isFinite(value)
		);
	};

	const isArray = (value) => {
		return Array.isArray(value);
	};

	const isObject = (value) => {
		return value !== null && typeof value === "object" && !Array.isArray(value);
	};

	// 安全的localStorage操作
	const safeLocalStorageGet = (key) => {
		try {
			// 验证key参数
			if (typeof key !== "string" || key.length === 0) {
				return null;
			}
			return localStorage.getItem(key);
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			return null;
		}
	};

	const safeLocalStorageSet = (key, value) => {
		try {
			// 验证key参数
			if (typeof key !== "string" || key.length === 0) {
				return false;
			}
			// 验证value参数
			if (value === undefined || value === null) {
				return false;
			}
			localStorage.setItem(key, value);
			return true;
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			return false;
		}
	};

	// 加密函数
	const encrypt = (data) => {
		try {
			// 验证数据类型
			if (
				!isObject(data) &&
				!isArray(data) &&
				typeof data !== "string" &&
				!isNumber(data)
			) {
				return null;
			}
			return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			return null;
		}
	};

	// 解密函数
	const decrypt = (encryptedData) => {
		try {
			// 验证输入
			if (typeof encryptedData !== "string" || encryptedData.length === 0) {
				return null;
			}
			return JSON.parse(decodeURIComponent(escape(atob(encryptedData))));
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			return null;
		}
	};

	// 获取存储的数据
	const getData = (key) => {
		try {
			const encrypted = safeLocalStorageGet(key);
			if (!encrypted) {
				return null;
			}
			const decrypted = decrypt(encrypted);

			// 验证解密后的数据结构
			if (!isObject(decrypted)) {
				return null;
			}

			// 验证必要的字段
			if (!isArray(decrypted.requests)) {
				decrypted.requests = [];
			}
			if (!isNumber(decrypted.blockedUntil)) {
				decrypted.blockedUntil = 0;
			}

			// 清理无效的请求记录
			decrypted.requests = decrypted.requests.filter((item) => isNumber(item));

			return decrypted;
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			return null;
		}
	};

	// 存储数据
	const setData = (key, data) => {
		try {
			// 验证数据结构
			if (!isObject(data)) {
				return false;
			}
			if (!isArray(data.requests)) {
				data.requests = [];
			}
			if (!isNumber(data.blockedUntil)) {
				data.blockedUntil = 0;
			}

			const encrypted = encrypt(data);
			if (!encrypted) {
				return false;
			}

			return safeLocalStorageSet(key, encrypted);
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			return false;
		}
	};

	// 安全的路径比较函数
	const comparePaths = (path1, path2) => {
		try {
			// 验证输入
			if (typeof path1 !== "string" || typeof path2 !== "string") {
				return false;
			}
			// 标准化路径（去除尾部斜杠，确保一致性）
			const normalizedPath1 = path1.replace(/\/$/, "");
			const normalizedPath2 = path2.replace(/\/$/, "");
			return normalizedPath1 === normalizedPath2;
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			return false;
		}
	};

	// 安全的重定向函数
	const safeRedirect = (url) => {
		try {
			// 验证URL
			if (typeof url !== "string" || url.length === 0) {
				return false;
			}
			// 验证URL格式（简单验证，确保是相对路径或有效的绝对路径）
			if (
				!url.startsWith("/") &&
				!url.startsWith("http://") &&
				!url.startsWith("https://")
			) {
				return false;
			}
			window.location.replace(url);
			return true;
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			return false;
		}
	};

	// 访问限制配置（加密）
	const CONFIG = {
		MAX_REQUESTS: 5, // 10秒内最大请求次数
		WINDOW_SECONDS: 10, // 时间窗口（秒）
		BLOCK_SECONDS: 15, // 封锁时间（秒）
		STORAGE_KEY: "r4t3_l1m1t", // 存储键名
		// 加密路径
		get BLOCK_PAGE() {
			// 简单的路径加密，防止直接暴露
			const encoded = "L2xqLw==";
			return atob(encoded);
		},
	};

	// 主函数
	const rateLimit = () => {
		try {
			// 获取当前时间戳
			const now = Date.now();
			const nowSeconds = Math.floor(now / 1000);

			// 检查当前是否已经在封锁页面
			const currentPath = window.location.pathname;
			const isBlockPage = comparePaths(currentPath, CONFIG.BLOCK_PAGE);

			// 获取存储的访问数据
			let accessData = getData(CONFIG.STORAGE_KEY);

			if (!accessData) {
				// 首次访问，初始化数据
				accessData = {
					requests: [],
					blockedUntil: 0,
				};
			}

			// 检查是否被封锁
			if (
				isNumber(accessData.blockedUntil) &&
				nowSeconds < accessData.blockedUntil
			) {
				// 被封锁，无论当前在哪个页面，都强制重定向到封锁页面
				if (!isBlockPage) {
					safeRedirect(CONFIG.BLOCK_PAGE);
				}
				return;
			}

			// 解除封锁状态
			if (
				isNumber(accessData.blockedUntil) &&
				accessData.blockedUntil > 0 &&
				nowSeconds >= accessData.blockedUntil
			) {
				accessData.blockedUntil = 0;
				accessData.requests = [];
				// 如果当前在封锁页面，则跳转到首页
				if (isBlockPage) {
					safeRedirect("/");
				}
			}

			// 如果当前在封锁页面，但用户没有被封锁，说明是故意输入的路径
			// 保持在封锁页面，不重定向到首页
			if (
				isBlockPage &&
				(!isNumber(accessData.blockedUntil) ||
					accessData.blockedUntil <= nowSeconds)
			) {
				// 不重定向，保持在封锁页面
				// 可以在这里添加额外的处理，比如记录这种行为
				return;
			}

			// 清理过期的请求记录
			accessData.requests = accessData.requests.filter((timestamp) => {
				return (
					isNumber(timestamp) && nowSeconds - timestamp < CONFIG.WINDOW_SECONDS
				);
			});

			// 添加当前请求记录
			accessData.requests.push(nowSeconds);

			// 检查是否超过最大请求次数
			if (accessData.requests.length > CONFIG.MAX_REQUESTS) {
				// 超过限制，设置封锁
				accessData.blockedUntil = nowSeconds + CONFIG.BLOCK_SECONDS;
				// 立即执行重定向，防止用户打断
				safeRedirect(CONFIG.BLOCK_PAGE);
			}

			// 存储更新后的数据
			setData(CONFIG.STORAGE_KEY, accessData);
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			// 即使出错，也确保系统不会崩溃
		}
	};

	// 定期检查是否应该解除封锁
	setInterval(() => {
		try {
			const now = Date.now();
			const nowSeconds = Math.floor(now / 1000);
			const accessData = getData(CONFIG.STORAGE_KEY);

			if (!accessData) return;

			const currentPath = window.location.pathname;
			const isBlockPage = comparePaths(currentPath, CONFIG.BLOCK_PAGE);

			if (
				isNumber(accessData.blockedUntil) &&
				accessData.blockedUntil > 0 &&
				nowSeconds >= accessData.blockedUntil
			) {
				// 解除封锁
				accessData.blockedUntil = 0;
				accessData.requests = [];
				setData(CONFIG.STORAGE_KEY, accessData);

				// 如果当前在封锁页面，跳转到首页
				if (isBlockPage) {
					safeRedirect("/");
				}
			} else if (
				isNumber(accessData.blockedUntil) &&
				accessData.blockedUntil > 0 &&
				nowSeconds < accessData.blockedUntil
			) {
				// 仍然在封锁期间，确保用户在封锁页面
				if (!isBlockPage) {
					safeRedirect(CONFIG.BLOCK_PAGE);
				}
			} else if (
				isBlockPage &&
				(!isNumber(accessData.blockedUntil) || accessData.blockedUntil === 0)
			) {
				// 用户故意输入封锁页面路径，但没有被封锁
				// 保持在封锁页面，不重定向到首页
				// 可以在这里添加额外的处理，比如记录这种行为
			}
		} catch (_e) {
			// 静默处理错误，不暴露在控制台
			// 即使出错，也确保系统不会崩溃
		}
	}, 200); // 每200毫秒检查一次，提高响应速度

	// 初始化
	rateLimit();

	// 定期检查控制台是否打开，但只在正常触发封锁页面时生效
	// 提高检测频率，确保及时捕获控制台打开事件
	setInterval(() => {
		// 检查当前是否在封锁页面
		const currentPath = window.location.pathname;
		const isBlockPage = comparePaths(currentPath, CONFIG.BLOCK_PAGE);

		// 获取存储的访问数据，检查是否是正常触发的封锁
		const accessData = getData(CONFIG.STORAGE_KEY);
		const nowSeconds = Math.floor(Date.now() / 1000);
		const isBlocked =
			isNumber(accessData?.blockedUntil) &&
			nowSeconds < accessData.blockedUntil;

		// 只有在封锁页面且是正常触发的封锁时，才启用控制台检测
		if (isBlockPage && isBlocked) {
			// 连续检测多次，提高灵敏度
			for (let i = 0; i < 3; i++) {
				if (window.detectDevTools()) {
					handleDevToolsOpen();
					break;
				}
			}
		}
	}, 200);
})();
