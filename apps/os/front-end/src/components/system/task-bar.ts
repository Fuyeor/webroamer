// @/components/system/task-bar.ts
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { toggleStartMenu } from '@/shared/signals/ui';

@customElement('system-task-bar')
export class SystemTaskBar extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 1001;
    }

    .task-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      height: var(--task-bar-height, 48px);
      padding: 0 16px;
      background: var(--fuyeor-purple-light, rgba(147, 112, 219, 0.2));
      backdrop-filter: var(--glass-blur, blur(20px));
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      box-sizing: border-box;
    }

    .start-button {
      width: 32px;
      height: 32px;
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .start-button:hover {
      transform: scale(1.15);
    }

    .start-button img {
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html`
      <nav class="task-bar">
        <div class="start-button" @click=${toggleStartMenu}>
          <img src="/favicon.svg" alt="Start" />
        </div>
        <!-- 未来这里放正在运行的应用图标 -->
      </nav>
    `;
  }
}
