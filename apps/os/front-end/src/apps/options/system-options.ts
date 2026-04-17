// @/apps/options/system-options.ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/signals';
import { Locale } from '@fuyeor/locale';
import { AppearanceAPI, appearanceSignal } from '@/shared/signals/settings';
import { ToastAPI } from '@/shared/signals/toast';
import { isImageUrl } from '@/shared/utils/is-image';
import { styles } from './system-options.styles';
import '@fuyeor/locale';

import './components/appearance-selector';
import './components/font-size-selector';

@customElement('system-options')
export class SystemOptions extends SignalWatcher(LitElement) {
  static styles = styles;

  #presets = [
    'linear-gradient(315deg, rgb(133, 108, 255) 0%, rgb(133, 108, 255) 10%, rgb(133, 104, 255) calc(10% + 1px), rgb(133, 104, 255) 20%, rgb(132, 110, 255) calc(20% + 1px), rgb(132, 110, 255) 30%, rgb(132, 122, 255) calc(30% + 1px), rgb(132, 122, 255) 40%, rgb(132, 135, 255) calc(40% + 1px), rgb(132, 135, 255) 50%, rgb(131, 143, 255) calc(50% + 1px), rgb(131, 143, 255) 60%, rgb(131, 144, 255) calc(60% + 1px), rgb(131, 144, 255) 70%, rgb(131, 135, 255) calc(70% + 1px), rgb(131, 135, 255) 80%, rgb(130, 122, 255) calc(80% + 1px), rgb(130, 122, 255) 90%, rgb(130, 110, 255) calc(90% + 1px), rgb(130, 110, 255) 100%)',
    '#16a085',
    '#aea4e4',
    '#73a3d3',
  ];

  #onCustomColorChange(e: Event) {
    AppearanceAPI.update({
      screenWallpaper: (e.target as HTMLInputElement).value,
    });
  }

  // 处理图片 URL 改变
  #onUrlChange(e: Event) {
    const url = (e.target as HTMLInputElement).value.trim();
    if (!url) return;

    const img = new Image();
    img.onload = () => {
      // 成功加载，才更新壁纸
      AppearanceAPI.update({ screenWallpaper: url });
    };
    img.onerror = () => {
      // 加载失败，弹出 Toast 错误！
      ToastAPI.show('图片加载失败，请检查链接是否正确或存在跨域问题。', {
        type: 'error',
        duration: 5000,
      });
    };
    img.src = url; // 触发加载
  }

  render() {
    const { screenBlur } = appearanceSignal.get();

    const currentBg = appearanceSignal.get().screenWallpaper;
    const isImage = isImageUrl(currentBg);
    const isBlurEnabled = screenBlur !== null;

    return html`
      <!-- 外观与字体设置区 -->
      <div class="section">
        <h2><locale-template keypath="settings.theme.mode"></locale-template></h2>
        <appearance-selector></appearance-selector>

        <h2 style="margin-top: 32px;">
          <locale-template keypath="settings.theme.fontsize"></locale-template>
        </h2>
        <font-size-selector></font-size-selector>
      </div>

      <!-- 壁纸设置区 -->
      <div class="section">
        <h2><locale-template keypath="settings.wallpaper.screen"></locale-template></h2>
        <div class="color-grid">
          ${this.#presets.map(
            (color) => html`
              <div
                class="color-btn ${currentBg === color ? 'active' : ''}"
                style="background: ${color}"
                @click=${() => AppearanceAPI.update({ screenWallpaper: color })}
              ></div>
            `,
          )}
        </div>

        <div class="custom-color">
          <span>自定义纯色：</span>
          <input
            type="color"
            .value=${!isImage && currentBg.startsWith('#') ? currentBg : '#000000'}
            @input=${this.#onCustomColorChange}
          />
        </div>

        <div class="url-input-container" style="margin-top: 16px;">
          <input
            type="text"
            placeholder="输入网络图片地址..."
            .value=${isImage ? currentBg : ''}
            @change=${this.#onUrlChange}
          />
        </div>
      </div>

      <div class="section">
        <div class="setting-row">
          <span><locale-template keypath="settings.wallpaper.blur"></locale-template></span>
          <input
            type="checkbox"
            .checked=${isBlurEnabled}
            @change=${(e: any) => {
              // 勾选启用默认给 12px，取消勾选直接置 null
              AppearanceAPI.update({ screenBlur: e.target.checked ? 12 : null });
            }}
          />
        </div>

        ${isBlurEnabled
          ? html`
              <div class="setting-row" style="margin-top: 16px;">
                <span>${Locale.t('settings.wallpaper.blur.px', { count: screenBlur })}</span>
                <input
                  type="range"
                  min="0"
                  max="24"
                  .value=${screenBlur}
                  @input=${(e: any) =>
                    AppearanceAPI.update({ screenBlur: parseInt(e.target.value) })}
                />
              </div>
            `
          : ''}
      </div>
    `;
  }
}
