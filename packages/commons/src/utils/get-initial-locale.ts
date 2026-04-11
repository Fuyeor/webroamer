// @webroamer/commons/src/utils/get-initial-locale.ts

/**
 * Get initial locale from browser language tag
 * @param browserLocale - MUST be a single language tag (e.g. navigator.language)
 *                        NOT Accept-Language header with commas
 */
export function getInitialLocale(browserLocale: string): string {
  // 获取浏览器主要语言，转为小写 e.g., 'zh-cn'
  const rawLocale = browserLocale.toLowerCase();

  // 处理中文的特殊情况
  if (['zh-cn', 'zh-sg', 'zh-my'].includes(rawLocale)) return 'zh-hans';
  if (['zh-mo', 'zh-hk', 'zh-tw'].includes(rawLocale)) return 'zh-hant';

  // 获取语言的前两个字母 e.g., 'fr-ca' -> 'fr'
  return rawLocale.slice(0, 2);
}
