// @/apps/options/system-options.styles.ts
import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    padding: 24px;
    overflow-y: auto;
    scroll-behavior: smooth;
  }

  /* 滚动条 */
  :host::-webkit-scrollbar {
    width: 8px;
  }
  :host::-webkit-scrollbar-track {
    background: transparent;
  }
  :host::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  :host::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  h2 {
    font-size: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 12px;
    margin-top: 0;
    font-weight: 500;
  }
  .section {
    margin-bottom: 32px;
  }
  .color-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  .color-btn {
    width: 54px;
    height: 54px;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid transparent;
    transition:
      transform 0.2s,
      border-color 0.2s;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  .color-btn:hover {
    transform: scale(1.05);
  }
  .color-btn.active {
    border-color: white;
    transform: scale(1.05);
  }
  .custom-color {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    padding: 12px;
    background: var(--surface-raised);
    border-radius: 8px;
    width: fit-content;
  }
  input[type='color'] {
    border: var(--border-default);
    width: 32px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    background: transparent;
  }
  input[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type='color']::-webkit-color-swatch {
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  .url-input-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .url-input-container input[type='text'] {
    width: 100%;
    max-width: 400px;
    padding: 14px;
    background: var(--surface-raised);
    border: var(--border-subtle);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .url-input-container input[type='text']:focus {
    border-color: var(--fuyeor-purple, #9370db);
  }
`;
