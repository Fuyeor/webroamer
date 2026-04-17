// @/components/system/screen.styles.ts
import { css } from 'lit';

export const styles = css`
  :host {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: block;
  }

  /* dedicated glass layer for backdrop-filter effect */
  .glass-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    transition: backdrop-filter 0.3s ease;
  }

  .desktop-content {
    position: absolute;
    top: 0;
    left: 0;
    padding: 24px;
    display: grid;
    gap: 24px;
    z-index: 2;
  }

  /* icon */
  .desktop-icon {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s;
    width: fit-content;
  }

  /* the glass base */
  .icon-wrapper {
    width: var(--icon-size);
    height: var(--icon-size);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    transition: all 0.3s ease;
    align-items: center;
  }

  .desktop-icon:hover .icon-wrapper {
    background: rgba(255, 255, 255, 0.1);
  }

  .icon-wrapper img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .icon-label {
    color: #e3e0f8;
    font-size: 0.8rem;
    font-weight: 500;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;
