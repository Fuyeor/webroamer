// @fuyeor/locale/src/locale-template.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/signals';
import { Locale } from './locale';

@customElement('locale-template')
export class LocaleTemplate extends SignalWatcher(LitElement) {
  @property({ type: String }) keypath = '';

  @property({ type: String }) tag = 'span';

  // 禁用 Shadow DOM，让它表现得像一个普通的纯 HTML 节点
  protected createRenderRoot() {
    return this;
  }

  render() {
    if (!this.keypath) return html``;

    const template = Locale.t(this.keypath);
    // 过滤空字符串，保持 DOM 节点最简
    const parts = template.split(/(\{.*?\})/g).filter(Boolean);

    const content = parts.map((part) => {
      // 匹配 {slot} 并将其渲染为原生 <slot> 标签
      if (part.startsWith('{') && part.endsWith('}')) {
        const slotName = part.slice(1, -1);
        return html`<slot name=${slotName}>${part}</slot>`;
      }
      return html`${part}`;
    });

    return html`${content}`;
  }
}
