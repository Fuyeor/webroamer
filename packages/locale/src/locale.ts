// @fuyeor/locale/src/locale.ts
import { Signal } from 'signal-polyfill';

export type LocaleMessages = Record<string, string>;

const GLOBAL_LOCALE_KEY = Symbol.for('fuyeor.locale.instance');

class LocaleSystem {
  #locale = new Signal.State('en');
  #messages = new Signal.State<LocaleMessages>({});
  #cache = new Map<string, LocaleMessages>();

  setLocaleMessage(locale: string, messages: LocaleMessages): void {
    if (!locale || !messages) throw new Error('[locale] locale and messages are required');

    this.#cache.set(locale, messages);
    if (this.#locale.get() === locale) {
      this.#messages.set(messages);
    }
  }

  get current(): string {
    return this.#locale.get();
  }

  set current(val: string) {
    if (this.#locale.get() === val) return;
    this.#locale.set(val);
    if (this.#cache.has(val)) {
      this.#messages.set(this.#cache.get(val)!);
    }
  }

  t = (key: string, values?: Record<string, string | number>): string => {
    const template = this.#messages.get()[key] || key;
    if (!values) return template;

    return template.replace(/\{(\w+)\}/g, (_, k) =>
      values[k] !== undefined ? String(values[k]) : `{${k}}`,
    );
  };

  getAvailableLocales = (): string[] => Array.from(this.#cache.keys());
}

// 如果 window 上已经挂载了系统，直接复用；否则新建
if (!window[GLOBAL_LOCALE_KEY]) {
  window[GLOBAL_LOCALE_KEY] = new LocaleSystem();
}

export const Locale = window[GLOBAL_LOCALE_KEY] as LocaleSystem;
