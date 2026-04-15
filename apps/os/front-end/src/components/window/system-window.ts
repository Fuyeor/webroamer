// @/components/window/system-window.ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Locale } from '@fuyeor/locale';
import { WindowManagerAPI, type WindowState } from '@/shared/signals/wm';
import { tooltip } from '@/shared/directives/tooltip';
import { styles } from './system-window.styles';

@customElement('system-window')
export class SystemWindow extends LitElement {
  @property({ type: Object }) state!: WindowState;

  static styles = styles;

  #currentX = 0;
  #currentY = 0;
  #currentW = 0;
  #currentH = 0;

  // 拖拽
  #onDragStart = (e: MouseEvent) => {
    if (this.state.isMaximized) return;
    WindowManagerAPI.restoreAndFocus(this.state.id);

    const startX = e.clientX - this.state.x;
    const startY = e.clientY - this.state.y;

    const onMove = (me: MouseEvent) => {
      this.#currentX = me.clientX - startX;
      this.#currentY = me.clientY - startY;
      // 直接操作 DOM 样式，绕过信号系统的高频重绘，实现 0 延迟
      this.style.transform = `translate(${this.#currentX}px, ${this.#currentY}px)`;
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      // 结束后一次性同步回信号系统
      WindowManagerAPI.updateBounds(this.state.id, { x: this.#currentX, y: this.#currentY });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // 调整大小
  #onResizeStart = (e: MouseEvent, type: string) => {
    e.stopPropagation();
    WindowManagerAPI.restoreAndFocus(this.state.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = this.state.width;
    const startH = this.state.height;

    const onMove = (me: MouseEvent) => {
      if (type.includes('right')) {
        this.#currentW = Math.max(300, startW + (me.clientX - startX));
        this.style.width = `${this.#currentW}px`;
      }
      if (type.includes('bottom')) {
        this.#currentH = Math.max(200, startH + (me.clientY - startY));
        this.style.height = `${this.#currentH}px`;
      }
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      WindowManagerAPI.updateBounds(this.state.id, {
        width: this.#currentW || startW,
        height: this.#currentH || startH,
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  render() {
    this.toggleAttribute('focused', this.state.isFocused);
    this.toggleAttribute('maximized', this.state.isMaximized);
    this.toggleAttribute('minimized', this.state.isMinimized);

    // 初始定位
    if (!this.state.isMaximized) {
      this.style.transform = `translate(${this.state.x}px, ${this.state.y}px)`;
      this.style.width = `${this.state.width}px`;
      this.style.height = `${this.state.height}px`;
    }
    this.style.zIndex = `${this.state.zIndex}`;

    return html`
      <header
        class="title-bar"
        @mousedown=${this.#onDragStart}
        @dblclick=${() => WindowManagerAPI.toggleMaximize(this.state.id)}
      >
        <div class="window-title">${this.state.title}</div>
        <div class="window-controls" @mousedown=${(e: Event) => e.stopPropagation()}>
          <button
            class="control-btn btn-minimize"
            ${tooltip({ text: Locale.t(`system.window.minimize`), placement: 'bottom' })}
            @click=${() => WindowManagerAPI.minimizeApp(this.state.id)}
          ></button>
          <button
            class="control-btn btn-maximize"
            ${tooltip({ text: Locale.t(`system.window.maximize`), placement: 'bottom' })}
            @click=${() => WindowManagerAPI.toggleMaximize(this.state.id)}
          ></button>
          <button
            class="control-btn btn-close"
            ${tooltip({ text: Locale.t(`system.window.close`), placement: 'bottom' })}
            @click=${() => WindowManagerAPI.closeApp(this.state.id)}
          ></button>
        </div>
      </header>
      <div
        class="window-content"
        @mousedown=${() => WindowManagerAPI.restoreAndFocus(this.state.id)}
      >
        <slot></slot>
      </div>
      <div
        class="resize-handle right"
        @mousedown=${(e: MouseEvent) => this.#onResizeStart(e, 'right')}
      ></div>
      <div
        class="resize-handle bottom"
        @mousedown=${(e: MouseEvent) => this.#onResizeStart(e, 'bottom')}
      ></div>
      <div
        class="resize-handle corner"
        @mousedown=${(e: MouseEvent) => this.#onResizeStart(e, 'right-bottom')}
      ></div>
    `;
  }
}
