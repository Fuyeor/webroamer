// @/shared/services/font-loader.ts
import { Signal } from 'signal-polyfill';
import { Locale } from '@fuyeor/locale';
import { loadStyleSheet } from '@fuyeor/commons';

interface FontConfig {
  family: string;
  weight: string;
}

/**
 * font mapping strategy
 * only list languages that differ from the default font (Poppins)
 */
const SPECIAL_FONTS: Record<string, FontConfig> = {
  // arabic
  ar: { family: 'Cairo', weight: '300..700' },
  fa: { family: 'Cairo', weight: '300..700' },
  ur: { family: 'Cairo', weight: '300..700' },
  // hebrew
  he: { family: 'Lunasima', weight: '400;700' },
  // asian (CJK)
  ko: { family: 'Noto Sans KR', weight: '300..700' },
  ja: { family: 'Noto Sans JP', weight: '300..700' },
  'zh-hans': { family: 'Noto Sans SC', weight: '300..700' },
  'zh-hant': { family: 'Noto Sans TC', weight: '300..700' },
  // other special scripts
  vi: { family: 'Noto Sans', weight: '300..700' },
  ka: { family: 'Noto Sans Georgian', weight: '300..700' },
};

const DEFAULT_FONT: FontConfig = {
  family: 'Poppins',
  weight: '300;400;500;600',
};

export class FontLoaderService {
  #currentUrl = '';

  /**
   * get Google Fonts URL based on the language code
   */
  #buildUrl(lang: string): string {
    const config = SPECIAL_FONTS[lang] || SPECIAL_FONTS[lang.split('-')[0]] || DEFAULT_FONT;
    return `https://fonts.googleapis.com/css2?display=swap&family=${encodeURIComponent(
      `${config.family}:wght@${config.weight}`,
    )}`;
  }

  /**
   * init should be called once during app startup
   */
  init() {
    // create a computed signal that reacts to changes in Locale.current
    const fontUrlSignal = new Signal.Computed(() => this.#buildUrl(Locale.current));

    const watcher = new Signal.subtle.Watcher(() => {
      const newUrl = fontUrlSignal.get();
      if (newUrl !== this.#currentUrl) {
        this.#currentUrl = newUrl;
        loadStyleSheet(newUrl);
      }
      watcher.watch(fontUrlSignal);
    });

    watcher.watch(fontUrlSignal);
    // first load
    const initialUrl = fontUrlSignal.get();
    this.#currentUrl = initialUrl;
    loadStyleSheet(initialUrl);
  }
}

export const fontLoader = new FontLoaderService();
