// @/apps/about/about.ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/signals';
import { QueryController } from '@fuyeor/query';
import { formatBytes } from '@webroamer/commons';
import { OsPropertyItem } from '@webroamer/ui';
import { fetchSystemInfo, systemKeys } from '@/api/system';
import { styles } from './about.styles';

@customElement('app-about')
export class AppAbout extends SignalWatcher(LitElement) {
  static {
    [OsPropertyItem];
  }

  #infoQuery = new QueryController(this, {
    queryKey: systemKeys.info,
    queryFn: ({ signal }) => fetchSystemInfo(signal),
    staleTime: 1000 * 60 * 5,
  });

  static styles = styles;

  render() {
    const data = this.#infoQuery.data;

    if (this.#infoQuery.isLoading) return html`<div>Loading system specs...</div>`;
    if (!this.#infoQuery.isRetrieved || !data) return html`<empty-state></empty-state>`;

    const { os, kernel, resources } = data;

    return html`
      <div class="main-layout">
        <!-- brand section -->
        <div class="brand-section">
          <img class="logo" src="/favicon.svg" alt="logo" />
          <div class="title">${os.name}</div>
        </div>

        <!-- information table -->
        <div class="info-container">
          <os-property-item label="system.about.osVersion" .value=${os.version}></os-property-item>
          <os-property-item
            label="system.about.kernel"
            .value="${kernel.type} (${kernel.version})"
          ></os-property-item>
          <os-property-item
            label="system.about.distribution"
            .value=${kernel.distro}
          ></os-property-item>
          <os-property-item
            label="system.about.memory"
            .value=${formatBytes(resources.totalMemory)}
          ></os-property-item>
          <os-property-item
            label="system.about.cpu"
            .value=${resources.cpuModel}
          ></os-property-item>
          <os-property-item
            label="system.about.disk"
            .value=${formatBytes(resources.totalDisk)}
          ></os-property-item>
        </div>
      </div>
    `;
  }
}
