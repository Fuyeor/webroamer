// @webroamer/ui/src/os-property-item.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@fuyeor/locale';

@customElement('os-property-item')
export class OsPropertyItem extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: String }) value = '';

  static styles = css`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    :host(:last-child) {
      border-bottom: none;
    }
    .label {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .value {
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 500;
    }
  `;

  render() {
    return html`
      <locale-template class="label" .keypath=${this.label}></locale-template>
      <span class="value">${this.value}</span>
    `;
  }
}
