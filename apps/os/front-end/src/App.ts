// @/App.ts
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@fuyeor/locale';
import './components/system/status-bar';
import './components/system/task-bar';
import './components/system/start-menu';

@customElement('system-view')
export class SystemView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      background-image: radial-gradient(circle at center, #1a1a2e 0%, #000 100%);
    }

    .os-viewport {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
  `;

  constructor() {
    super();
    // useFontLoader();
  }

  render() {
    return html`
      <!-- 顶部状态栏 -->
      <system-status-bar></system-status-bar>

      <!-- 系统主视口（桌面与窗口） -->
      <div class="os-viewport">
        <system-start-menu></system-start-menu>
      </div>

      <!-- 底部任务栏/Dock -->
      <system-task-bar> </system-task-bar>
    `;
  }
}
