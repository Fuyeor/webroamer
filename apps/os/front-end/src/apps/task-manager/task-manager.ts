// @/apps/task-manager/task-manager.ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/signals';
import { Signal } from 'signal-polyfill';
import { repeat } from 'lit/directives/repeat.js';
import { formatBytes } from '@webroamer/commons';
import { ToastAPI } from '@/shared/signals/toast';
import { streamTaskStatus, killProcess } from '@/api/system';
import { styles } from './task-manager.styles';
import '@fuyeor/locale';

interface ProcessData {
  pid: number;
  name: string;
  cpuUsage: number;
  memoryUsage: number;
  status: string;
  runTime: number;
}

interface TaskManagerData {
  totalProcesses: number;
  topProcesses: ProcessData[];
}

@customElement('app-task-manager')
export class AppTaskManager extends SignalWatcher(LitElement) {
  #taskData = new Signal.State<TaskManagerData | null>(null);
  #killingPids = new Signal.State(new Set<number>());
  #abortController: AbortController | null = null;

  static styles = styles;

  async connectedCallback() {
    super.connectedCallback();
    this.#abortController = new AbortController();

    try {
      // 从后端生成器中持续拉取数据
      const stream = streamTaskStatus(this.#abortController.signal);

      for await (const data of stream) {
        this.#taskData.set(data as TaskManagerData);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[SSE] Stream error:', err);
        ToastAPI.show('Connection lost', { type: 'error' });
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#abortController) {
      this.#abortController.abort();
      this.#abortController = null;
    }
  }

  async #handleKill(pid: number) {
    const current = this.#killingPids.get();
    if (current.has(pid)) return;

    this.#killingPids.set(new Set([...current, pid]));

    try {
      await killProcess(pid);
      ToastAPI.show(`Task ${pid} terminated`, { type: 'success' });
    } catch (err: any) {
      ToastAPI.show(err.message, { type: 'error' });
    } finally {
      const updated = new Set(this.#killingPids.get());
      updated.delete(pid);
      this.#killingPids.set(updated);
    }
  }

  #formatRunTime(seconds: number) {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  render() {
    const data = this.#taskData.get();
    const killing = this.#killingPids.get();

    if (!data) return html`<div style="padding:20px;">Establishing secure stream...</div>`;

    return html`
      <div class="header">
        <div class="header-title">Process Explorer</div>
        <div class="header-stats">Total Processes: ${data.totalProcesses}</div>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th class="th">PID</th>
              <th class="th">Name</th>
              <th class="th">CPU</th>
              <th class="th">Memory</th>
              <th class="th">Status</th>
              <th class="th">Time</th>
              <th class="th">Action</th>
            </tr>
          </thead>
          <tbody>
            ${repeat(
              data.topProcesses,
              (p) => p.pid,
              (p) => html`
                <tr class="tr">
                  <td class="td" style="color:#6c7086;">${p.pid}</td>
                  <td class="td" style="font-weight:600;">${p.name}</td>
                  <td class="td ${p.cpuUsage > 50 ? 'td-warn' : ''}">${p.cpuUsage.toFixed(1)}%</td>
                  <td class="td ${p.memoryUsage > 1024 * 1024 * 500 ? 'td-danger' : ''}">
                    ${formatBytes(p.memoryUsage)}
                  </td>
                  <td class="td">${p.status}</td>
                  <td class="td">${this.#formatRunTime(p.runTime)}</td>
                  <td class="td">
                    <button
                      class="btn-kill"
                      ?disabled=${killing.has(p.pid)}
                      @click=${() => this.#handleKill(p.pid)}
                    >
                      End
                    </button>
                  </td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}
