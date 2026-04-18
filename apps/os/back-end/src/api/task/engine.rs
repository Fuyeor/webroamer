// src/api/task/engine.rs
use super::types::{ProcessInfo, TaskManagerData};
use std::time::Duration;
use sysinfo::{ProcessRefreshKind, ProcessesToUpdate, RefreshKind, System};
use tokio::sync::broadcast;

/// Start a background process monitor and return a subscribed channel for use by SSE routing
pub fn spawn_task_monitor() -> broadcast::Sender<TaskManagerData> {
    let (tx, _rx) = broadcast::channel(16);
    let tx_internal = tx.clone();

    tokio::spawn(async move {
        // Monitor only processes now

        let mut sys = System::new_with_specifics(
            RefreshKind::nothing().with_processes(ProcessRefreshKind::everything()),
        );

        loop {
            // Parameter 1 = Refresh all processes
            // Parameter 2 = Do not force deletion
            // Parameter 3 = Refresh type
            sys.refresh_processes_specifics(
                ProcessesToUpdate::All,
                false,
                ProcessRefreshKind::everything(),
            );

            let mut process_list: Vec<ProcessInfo> = sys
                .processes()
                .iter()
                .map(|(pid, p)| ProcessInfo {
                    pid: pid.as_u32(),
                    name: p.name().to_string_lossy().to_string(),
                    cpu_usage: p.cpu_usage(),
                    memory_usage: p.memory(),
                    status: p.status().to_string(),
                    run_time: p.run_time(),
                })
                .collect();

            // sort by CPU utilization in descending order
            process_list.sort_by(|a, b| {
                b.cpu_usage
                    .partial_cmp(&a.cpu_usage)
                    .unwrap_or(std::cmp::Ordering::Equal)
            });

            let data = TaskManagerData {
                total_processes: process_list.len(),
                top_processes: process_list.into_iter().take(100).collect(),
            };

            // refreshes every 1 second
            let _ = tx_internal.send(data);
            tokio::time::sleep(Duration::from_secs(1)).await;
        }
    });

    tx
}
