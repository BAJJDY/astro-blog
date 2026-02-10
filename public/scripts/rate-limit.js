// 加密混淆的访问限制脚本
(function() {
    // 安全的类型检查函数
    function isNumber(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }

    function isArray(value) {
        return Array.isArray(value);
    }

    function isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    // 安全的localStorage操作
    function safeLocalStorageGet(key) {
        try {
            // 验证key参数
            if (typeof key !== 'string' || key.length === 0) {
                return null;
            }
            return localStorage.getItem(key);
        } catch (e) {
            console.error('localStorage读取失败:', e);
            return null;
        }
    }

    function safeLocalStorageSet(key, value) {
        try {
            // 验证key参数
            if (typeof key !== 'string' || key.length === 0) {
                return false;
            }
            // 验证value参数
            if (value === undefined || value === null) {
                return false;
            }
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error('localStorage存储失败:', e);
            return false;
        }
    }

    // 加密函数
    function encrypt(data) {
        try {
            // 验证数据类型
            if (!isObject(data) && !isArray(data) && typeof data !== 'string' && !isNumber(data)) {
                return null;
            }
            return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        } catch (e) {
            console.error('加密失败:', e);
            return null;
        }
    }

    // 解密函数
    function decrypt(encryptedData) {
        try {
            // 验证输入
            if (typeof encryptedData !== 'string' || encryptedData.length === 0) {
                return null;
            }
            return JSON.parse(decodeURIComponent(escape(atob(encryptedData))));
        } catch (e) {
            console.error('解密失败:', e);
            return null;
        }
    }

    // 获取存储的数据
    function getData(key) {
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
            decrypted.requests = decrypted.requests.filter(item => isNumber(item));
            
            return decrypted;
        } catch (e) {
            console.error('获取数据失败:', e);
            return null;
        }
    }

    // 存储数据
    function setData(key, data) {
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
        } catch (e) {
            console.error('存储数据失败:', e);
            return false;
        }
    }

    // 安全的路径比较函数
    function comparePaths(path1, path2) {
        try {
            // 验证输入
            if (typeof path1 !== 'string' || typeof path2 !== 'string') {
                return false;
            }
            // 标准化路径（去除尾部斜杠，确保一致性）
            const normalizedPath1 = path1.replace(/\/$/, '');
            const normalizedPath2 = path2.replace(/\/$/, '');
            return normalizedPath1 === normalizedPath2;
        } catch (e) {
            console.error('路径比较失败:', e);
            return false;
        }
    }

    // 安全的重定向函数
    function safeRedirect(url) {
        try {
            // 验证URL
            if (typeof url !== 'string' || url.length === 0) {
                return false;
            }
            // 验证URL格式（简单验证，确保是相对路径或有效的绝对路径）
            if (!url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
                return false;
            }
            window.location.replace(url);
            return true;
        } catch (e) {
            console.error('重定向失败:', e);
            return false;
        }
    }

    // 访问限制配置
    const CONFIG = {
        MAX_REQUESTS: 5, // 10秒内最大请求次数
        WINDOW_SECONDS: 10, // 时间窗口（秒）
        BLOCK_SECONDS: 15, // 封锁时间（秒）
        STORAGE_KEY: 'r4t3_l1m1t', // 存储键名
        BLOCK_PAGE: '/lj/' // 封锁页面
    };

    // 主函数
  function rateLimit() {
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
          ips: {}
        };
      }

      // 检查是否被封锁
      if (isNumber(accessData.blockedUntil) && nowSeconds < accessData.blockedUntil) {
        // 被封锁，无论当前在哪个页面，都强制重定向到封锁页面
        if (!isBlockPage) {
          safeRedirect(CONFIG.BLOCK_PAGE);
        }
        return;
      }

      // 解除封锁状态
      if (isNumber(accessData.blockedUntil) && accessData.blockedUntil > 0 && nowSeconds >= accessData.blockedUntil) {
        accessData.blockedUntil = 0;
        accessData.requests = [];
        accessData.ips = {};
        // 如果当前在封锁页面，则跳转到首页
        if (isBlockPage) {
          safeRedirect('/');
        }
      }

      // 如果当前在封锁页面，但用户没有被封锁，说明是故意输入的路径，重定向到首页
      if (isBlockPage && (!isNumber(accessData.blockedUntil) || accessData.blockedUntil <= nowSeconds)) {
        safeRedirect('/');
        return;
      }

      // 清理过期的请求记录
      accessData.requests = accessData.requests.filter(timestamp => {
        return isNumber(timestamp) && nowSeconds - timestamp < CONFIG.WINDOW_SECONDS;
      });

      // 处理IP访问记录
      if (!accessData.ips) {
        accessData.ips = {};
      }

      // 尝试获取当前IP信息
      let currentIP = 'unknown';
      try {
        const ipInfoData = localStorage.getItem('current_ip_info');
        if (ipInfoData) {
          const ipInfo = JSON.parse(ipInfoData);
          currentIP = ipInfo.ip || 'unknown';
        }
      } catch (e) {
        console.error('获取IP信息失败:', e);
      }

      // 更新当前IP的访问记录
      if (!accessData.ips[currentIP]) {
        accessData.ips[currentIP] = [];
      }

      // 清理当前IP的过期记录
      accessData.ips[currentIP] = accessData.ips[currentIP].filter(timestamp => {
        return isNumber(timestamp) && nowSeconds - timestamp < CONFIG.WINDOW_SECONDS;
      });

      // 添加当前请求记录
      accessData.requests.push(nowSeconds);
      accessData.ips[currentIP].push(nowSeconds);

      // 检查是否超过最大请求次数
      // 检查同一IP的请求次数
      const ipRequestCount = accessData.ips[currentIP].length;
      // 检查同一时间不同IP的请求次数（IP数量）
      const uniqueIPs = Object.keys(accessData.ips).length;

      // 如果同一IP请求过多或同一时间不同IP请求过多，触发封禁
      if (accessData.requests.length > CONFIG.MAX_REQUESTS || ipRequestCount > CONFIG.MAX_REQUESTS || uniqueIPs > 3) {
        // 超过限制，设置封锁
        accessData.blockedUntil = nowSeconds + CONFIG.BLOCK_SECONDS;
        // 存储更新后的数据
        setData(CONFIG.STORAGE_KEY, accessData);
        // 立即执行重定向，防止用户打断
        safeRedirect(CONFIG.BLOCK_PAGE);
      } else {
        // 存储更新后的数据
        setData(CONFIG.STORAGE_KEY, accessData);
      }
    } catch (e) {
      console.error('rateLimit函数执行失败:', e);
      // 即使出错，也确保系统不会崩溃
    }
  }

    // 定期检查是否应该解除封锁
    setInterval(function() {
        try {
            const now = Date.now();
            const nowSeconds = Math.floor(now / 1000);
            const accessData = getData(CONFIG.STORAGE_KEY);
            
            if (!accessData) return;
            
            const currentPath = window.location.pathname;
            const isBlockPage = comparePaths(currentPath, CONFIG.BLOCK_PAGE);
            
            if (isNumber(accessData.blockedUntil) && accessData.blockedUntil > 0 && nowSeconds >= accessData.blockedUntil) {
                // 解除封锁
                accessData.blockedUntil = 0;
                accessData.requests = [];
                setData(CONFIG.STORAGE_KEY, accessData);
                
                // 如果当前在封锁页面，跳转到首页
                if (isBlockPage) {
                    safeRedirect('/');
                }
            } else if (isNumber(accessData.blockedUntil) && accessData.blockedUntil > 0 && nowSeconds < accessData.blockedUntil) {
                // 仍然在封锁期间，确保用户在封锁页面
                if (!isBlockPage) {
                    safeRedirect(CONFIG.BLOCK_PAGE);
                }
            } else if (isBlockPage && (!isNumber(accessData.blockedUntil) || accessData.blockedUntil === 0)) {
                // 用户故意输入封锁页面路径，但没有被封锁，重定向到首页
                safeRedirect('/');
            }
        } catch (e) {
            console.error('定期检查执行失败:', e);
            // 即使出错，也确保系统不会崩溃
        }
    }, 300); // 每300毫秒检查一次，平衡响应速度和性能

    // 初始化
    rateLimit();
})();