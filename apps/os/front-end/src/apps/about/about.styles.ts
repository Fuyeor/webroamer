// @/apps/about/about.styles.ts
import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    padding: 40px;
    container-type: inline-size;
    container-name: about-container;
  }

  /* 默认布局：大容器下的水平排列 [LOGO+文字] | [表格] */
  .main-layout {
    display: flex;
    flex-direction: row;
    gap: 60px;
    max-width: 900px;
    margin: 0 auto;
  }

  .brand-section {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 16px;
  }

  .logo {
    width: 120px;
    height: 120px;
  }

  .title {
    font-size: 1.4rem;
    font-weight: 600;
    max-width: 180px;
  }

  .info-container {
    flex: 1;
    min-width: 320px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 8px 20px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* 当容器宽度小于 650px 时切换布局 */
  @container about-container (width <= 650px) {
    .main-layout {
      flex-direction: column; /* 变为垂直排列 */
      gap: 32px;
      text-align: center;
    }

    .brand-section {
      margin-bottom: 0;
      align-items: center;
    }

    .logo {
      width: 80px;
      height: 80px;
    }

    .info-container {
      width: 100%;
      max-width: 100%;
      align-items: center;
      justify-content: center;
    }
  }
`;
