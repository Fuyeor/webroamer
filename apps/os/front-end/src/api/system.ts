// @/api/system.ts
import apiClient from '@/api';

/**
 * get system info
 * @returns SystemInfoResponse
 */
export const fetchSystemInfo = (signal?: AbortSignal) => {
  return apiClient.get('/system/info', { signal });
};

export const systemKeys = {
  info: () => ['system', 'info'] as const,
};

/**
 * get real-time system task stream (SSE)
 */
export const streamTaskStatus = (signal: AbortSignal) => {
  return apiClient.sse('/system/task/stream', { signal });
};
/**
 * kill a process by pid
 * @param pid Process ID
 */
export const killProcess = (pid: number) => {
  return apiClient.delete(`/system/task/${pid}`);
};
