// src/api/task/types.rs
use serde::Serialize;
use utoipa::ToSchema;

#[derive(Serialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ProcessInfo {
    pub pid: u32,
    pub name: String,
    pub cpu_usage: f32,
    /// bytes
    pub memory_usage: u64,
    pub status: String,
    /// seconds
    pub run_time: u64,
}

#[derive(Serialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TaskManagerData {
    pub total_processes: usize,
    pub top_processes: Vec<ProcessInfo>,
}
