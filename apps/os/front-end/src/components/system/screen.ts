// @/components/system/screen.ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/signals';
import { Locale } from '@fuyeor/locale';
import { WindowManagerAPI } from '@/shared/signals/wm';
import { appearanceSignal } from '@/shared/signals/settings';
import { styles } from './screen.styles';

import '@/components/window/window-manager';

@customElement('system-screen')
export class SystemScreen extends SignalWatcher(LitElement) {
  static styles = styles;

  #openSettings() {
    WindowManagerAPI.openApp('settings', Locale.t('system.settings'), 'system-options');
  }

  render() {
    const { screenBlur } = appearanceSignal.get();

    const glassStyle = screenBlur !== null ? `backdrop-filter: blur(${screenBlur}px); ` : '';

    return html`
      <!-- frosted glass layer -->
      <div class="glass-layer" style=${glassStyle}></div>

      <div class="desktop-content">
        <div class="desktop-icon" @dblclick=${this.#openSettings}>
          <div class="icon-wrapper">
            <img src="/favicon.svg" alt="Settings" />
          </div>
          <span class="icon-label">
            <locale-template keypath="system.settings"></locale-template>
          </span>
        </div>

        <slot></slot>
      </div>

      <window-manager></window-manager>
    `;
  }
}
