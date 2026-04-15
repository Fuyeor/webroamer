// @/components/window/system-window..styles.ts
import { css } from 'lit';

export const styles = css`
  :host {
    position: absolute;
    display: flex;
    flex-direction: column;
    background: var(--surface-raised);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    overflow: clip;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    /* 只给必要的属性加动画，且避开 transform 以免拖拽抖动 */
    transition:
      opacity 0.2s,
      box-shadow 0.2s,
      border-color 0.2s;
    will-change: transform, width, height;
  }

  /* 占满父级 screen 的全部空间 */
  :host([maximized]) {
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    transform: none !important;
    border-radius: 0;
    border: none;
  }

  :host([minimized]) {
    display: none !important;
  }
  :host([focused]) {
    border-color: rgba(255, 255, 255, 0.3);
    z-index: 999;
  }

  .title-bar {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    user-select: none;
    cursor: grab;
  }
  .window-title {
    font-size: 13px;
    font-weight: 600;
    pointer-events: none;
  }
  .window-controls {
    display: flex;
    gap: 8px;
    z-index: 20;
  }
  .control-btn {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
  }
  .btn-close {
    background: #ff5f56;
  }
  .btn-minimize {
    background: #ffbd2e;
  }
  .btn-maximize {
    background: #27c93f;
  }

  .window-content {
    flex: 1;
    position: relative;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .resize-handle {
    position: absolute;
    z-index: 10;
  }
  .resize-handle.right {
    top: 0;
    right: -4px;
    width: 8px;
    height: 100%;
    cursor: e-resize;
  }
  .resize-handle.bottom {
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 8px;
    cursor: s-resize;
  }
  .resize-handle.corner {
    bottom: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    cursor: se-resize;
  }
`;
