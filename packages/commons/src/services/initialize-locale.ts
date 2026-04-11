// @webroamer/commons/src/services/initialize-locale.ts
import { Locale } from '@fuyeor/locale';
import { getInitialLocale } from '@/utils/get-initial-locale';

declare const __BUILD_TIMESTAMP__: string;

// 构建时间
const VERSION = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : Date.now();

const fetchLocale = async (locale: string) => {
  // JSON fetcher
  const fetchJson = (url: string) =>
    window
      .fetch(`${url}?v=${VERSION}`)
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));

  if (import.meta.env.DEV) {
    const [common, site] = await Promise.all([
      fetchJson(`/assets/locale/${locale}.common.json`),
      fetchJson(`/assets/locale/${locale}.site.json`),
    ]);
    return { ...common, ...site };
  }

  return fetchJson(`/assets/locale/${locale}.json`);
};

export const LocaleManager = {
  get currentLocale() {
    return Locale.current;
  },

  async setLocale(newLocale: string) {
    if (!newLocale) throw new Error('[LocaleManager] newLocale is required');
    if (Locale.current === newLocale) return;

    // 只有当翻译包不存在时，才发起网络请求
    if (!Locale.getAvailableLocales().includes(newLocale)) {
      const messages = await fetchLocale(newLocale);
      Locale.setLocaleMessage(newLocale, messages);
    }

    // 更新核心信号
    Locale.current = newLocale;

    // 同步到持久化存储和 DOM
    window.localStorage.setItem('locale', newLocale);
    window.document.documentElement.lang = newLocale;
  },
};

/**
 * 初始化语言环境系统。在 OS 的 main.ts 里调用的唯一函数
 */
export async function initializeLocale(): Promise<void> {
  const initialLocale =
    window.localStorage.getItem('locale')?.toLowerCase() || getInitialLocale(navigator.language);

  // 同步设置 DOM 属性，防止早期渲染闪烁
  window.document.documentElement.lang = initialLocale;

  // 发起网络请求获取当前语言包
  const firstLoadMessages = await fetchLocale(initialLocale);

  // 注入数据并激活
  Locale.setLocaleMessage(initialLocale, firstLoadMessages);
  Locale.current = initialLocale;
}
