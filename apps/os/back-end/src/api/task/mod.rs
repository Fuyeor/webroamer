// src/api/task/mod.rs
pub mod engine;
pub mod types;

use crate::middleware::ActiveSession;
use crate::state::AppState;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    response::sse::{Event, Sse},
};
use futures::stream::{Stream, StreamExt};
use std::convert::Infallible;
use tokio_stream::wrappers::BroadcastStream;

/// GET /system/task/stream - SSE Real-time Process Stream
#[utoipa::path(
    get,
    path = "/system/task/stream",
    responses(
        (status = 200, description = "SSE stream of TaskManagerData")
    )
)]
pub async fn task_stream(
    _session: ActiveSession,
    State(state): State<AppState>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let rx = state.task_sender.subscribe();

    let stream = BroadcastStream::new(rx).filter_map(|result| async move {
        match result {
            Ok(data) => {
                let json = serde_json::to_string(&data).unwrap();
                Some(Ok(Event::default().data(json)))
            }
            Err(_) => None,
        }
    });

    Sse::new(stream).keep_alive(
        axum::response::sse::KeepAlive::new()
            .interval(std::time::Duration::from_secs(15))
            .text("keep-alive-text"),
    )
}

/// DELETE /system/task/{pid} - kill process
#[utoipa::path(
    delete,
    path = "/system/task/{pid}",
    responses(
        (status = 200, description = "Process killed"),
        (status = 403, description = "Permission denied or critical process"),
        (status = 404, description = "Process not found")
    )
)]
pub async fn kill_process(
    _session: ActiveSession,
    Path(pid_val): Path<u32>,
) -> Result<impl IntoResponse, StatusCode> {
    // Preventing the termination of systemd(1) and own backend processes
    let my_pid = std::process::id();
    if pid_val == 1 || pid_val == my_pid {
        return Err(StatusCode::FORBIDDEN);
    }

    let status = tokio::process::Command::new("kill")
        .arg("-9")
        .arg(pid_val.to_string())
        .status()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if status.success() {
        Ok(StatusCode::OK)
    } else {
        // If it fails, it's usually because there's no permission or the process doesn't exist
        Err(StatusCode::NOT_FOUND)
    }
}
