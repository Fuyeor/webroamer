// @/apps/task-manager/task-manager.styles.ts
import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    padding: 16px;
    border-bottom: var(--border-subtle);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  .header-stats {
    font-size: 13px;
    color: #a6adc8;
  }

  .table-container {
    flex: 1;
    overflow-y: auto;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  /* sticky table head */
  .th {
    position: sticky;
    top: 0;
    padding: 10px 16px;
    font-size: 12px;
    font-weight: 600;
    border-bottom: var(--border-subtle);
    background: var(--surface);
    z-index: 10;
  }

  .tr {
    border-bottom: var(--border-subtle);
    transition: background 0.1s;
  }
  .tr:hover {
    background: var(--surface-hover);
  }
  .td {
    padding: 10px 16px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* high CPU/memory */
  .td-warn {
    color: var(--color-warn);
    font-weight: 600;
  }
  .td-danger {
    color: #f2cdcd;
  }

  .btn-kill {
    background: transparent;
    border: 1px solid #f38ba8;
    color: #f38ba8;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.2s;
  }
  .btn-kill:hover {
    background: #f38ba8;
    color: #11111b;
  }
  .btn-kill:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: #585b70;
    color: #585b70;
  }

  /* 滚动条美化 */
  .table-container::-webkit-scrollbar {
    width: 8px;
  }
  .table-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .table-container::-webkit-scrollbar-thumb {
    background: #313244;
    border-radius: 4px;
  }
  .table-container::-webkit-scrollbar-thumb:hover {
    background: #45475a;
  }
`;
