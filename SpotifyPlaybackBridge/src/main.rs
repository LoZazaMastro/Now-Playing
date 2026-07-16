use std::{
    io::{self, BufRead},
    net::{IpAddr, Ipv4Addr, SocketAddr, TcpListener},
    path::PathBuf,
    sync::{Arc, RwLock},
    time::Duration,
};

use librespot::{
    connect::{ConnectConfig, LoadRequest, LoadRequestOptions, Spirc},
    core::{Session, SessionConfig, authentication::Credentials, cache::Cache},
    metadata::audio::UniqueFields,
    playback::{
        audio_backend,
        config::{AudioFormat, Bitrate, PlayerConfig},
        mixer::{self, MixerConfig},
        player::{Player, PlayerEvent},
    },
};
use serde::Serialize;
use tiny_http::{Header, Method, Request, Response, Server, StatusCode};
use url::form_urlencoded;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct Snapshot {
    ready: bool,
    active: bool,
    status: String,
    title: String,
    artist: String,
    album: String,
    artwork_url: String,
    uri: String,
    media_type: String,
    position: u32,
    length: u32,
    volume: u8,
    shuffle_active: bool,
    repeat_mode: String,
    error: String,
}

impl Default for Snapshot {
    fn default() -> Self {
        Self {
            ready: false,
            active: false,
            status: "Stopped".into(),
            title: String::new(),
            artist: String::new(),
            album: String::new(),
            artwork_url: String::new(),
            uri: String::new(),
            position: 0,
            length: 0,
            volume: 100,
            media_type: String::new(),
            shuffle_active: false,
            repeat_mode: "Off".into(),
            error: String::new(),
        }
    }
}

fn json_response(value: impl Serialize, status: u16) -> Response<std::io::Cursor<Vec<u8>>> {
    let body = serde_json::to_vec(&value).unwrap_or_else(|_| b"{\"ok\":false}".to_vec());
    let mut response = Response::from_data(body).with_status_code(StatusCode(status));
    response
        .add_header(Header::from_bytes("Content-Type", "application/json; charset=utf-8").unwrap());
    response
}

fn authorized(request: &Request, secret: &str) -> bool {
    request
        .headers()
        .iter()
        .find(|header| header.field.equiv("X-Now-Playing-Token"))
        .is_some_and(|header| header.value.as_str() == secret)
}

fn query_value(url: &str, key: &str) -> Option<String> {
    let query = url.split_once('?')?.1;
    form_urlencoded::parse(query.as_bytes())
        .find(|(name, _)| name == key)
        .map(|(_, value)| value.into_owned())
}

fn handle_request(
    request: Request,
    secret: &str,
    state: &Arc<RwLock<Snapshot>>,
    spirc: &Arc<Spirc>,
) -> bool {
    if !authorized(&request, secret) {
        let _ = request.respond(json_response(
            serde_json::json!({"ok": false, "error": "unauthorized"}),
            401,
        ));
        return true;
    }
    let path = request.url().split('?').next().unwrap_or("");
    if request.method() == &Method::Get && path == "/health" {
        let snapshot = state.read().unwrap().clone();
        let _ = request.respond(json_response(serde_json::json!({"ok": snapshot.ready, "active": snapshot.active, "error": snapshot.error}), 200));
        return true;
    }
    if request.method() == &Method::Get && path == "/snapshot" {
        let _ = request.respond(json_response(state.read().unwrap().clone(), 200));
        return true;
    }
    if path == "/shutdown" {
        let ok = spirc.shutdown().is_ok();
        let _ = request.respond(json_response(serde_json::json!({"ok": ok}), 200));
        return false;
    }

    let current = state.read().unwrap().clone();
    let mut optimistic_status: Option<(&str, bool)> = None;
    let mut optimistic_shuffle: Option<bool> = None;
    let mut optimistic_repeat: Option<String> = None;
    let result = match path {
        "/action/play" => {
            optimistic_status = Some(("Playing", true));
            spirc.play()
        }
        "/action/pause" => {
            optimistic_status = Some(("Paused", true));
            spirc.pause()
        }
        "/action/playpause" => {
            optimistic_status = Some((
                if current.status == "Playing" {
                    "Paused"
                } else {
                    "Playing"
                },
                true,
            ));
            spirc.play_pause()
        }
        "/action/previous" => spirc.prev(),
        "/action/next" => spirc.next(),
        "/action/shuffle" => {
            let enabled = query_value(request.url(), "value")
                .map(|value| value == "1" || value.eq_ignore_ascii_case("true"))
                .unwrap_or(!current.shuffle_active);
            optimistic_shuffle = Some(enabled);
            spirc.shuffle(enabled)
        }
        "/action/repeat" => {
            let requested = query_value(request.url(), "mode");
            let mode = requested
                .as_deref()
                .unwrap_or_else(|| match current.repeat_mode.as_str() {
                    "Off" => "List",
                    "List" => "Track",
                    _ => "Off",
                });
            optimistic_repeat = Some(
                match mode {
                    "List" | "list" | "context" => "List",
                    "Track" | "track" => "Track",
                    _ => "Off",
                }
                .into(),
            );
            match mode {
                "List" | "list" | "context" => spirc.repeat(true),
                "Track" | "track" => spirc.repeat(true).and_then(|_| spirc.repeat_track(true)),
                _ => spirc.repeat_track(false).and_then(|_| spirc.repeat(false)),
            }
        }
        "/action/volume" => {
            let volume = query_value(request.url(), "value")
                .and_then(|value| value.parse::<u8>().ok())
                .unwrap_or(current.volume)
                .min(100);
            spirc.set_volume(((volume as u32 * u16::MAX as u32) / 100) as u16)
        }
        "/action/seek" => {
            let position = query_value(request.url(), "position")
                .and_then(|value| value.parse::<u32>().ok())
                .unwrap_or(current.position);
            spirc.set_position_ms(position)
        }
        "/action/load" => {
            let uri = query_value(request.url(), "uri").unwrap_or_default();
            if uri.is_empty() {
                Err(librespot::core::Error::invalid_argument("uri"))
            } else {
                spirc.activate().and_then(|_| {
                    spirc.load(LoadRequest::from_context_uri(
                        uri,
                        LoadRequestOptions {
                            start_playing: true,
                            ..Default::default()
                        },
                    ))
                })
            }
        }
        _ => {
            let _ = request.respond(json_response(
                serde_json::json!({"ok": false, "error": "not-found"}),
                404,
            ));
            return true;
        }
    };
    if result.is_ok() {
        let mut snapshot = state.write().unwrap();
        if let Some((status, active)) = optimistic_status {
            snapshot.status = status.into();
            snapshot.active = active;
        }
        if let Some(shuffle) = optimistic_shuffle {
            snapshot.shuffle_active = shuffle;
        }
        if let Some(mode) = optimistic_repeat {
            snapshot.repeat_mode = mode;
        }
    }
    let _ = request.respond(json_response(
        if let Err(error) = result {
            serde_json::json!({"ok": false, "error": error.to_string()})
        } else {
            serde_json::json!({"ok": true})
        },
        200,
    ));
    true
}

async fn track_events(
    mut events: librespot::playback::player::PlayerEventChannel,
    state: Arc<RwLock<Snapshot>>,
) {
    while let Some(event) = events.recv().await {
        let mut snapshot = state.write().unwrap();
        match event {
            PlayerEvent::TrackChanged { audio_item } => {
                snapshot.title = audio_item.name.clone();
                snapshot.uri = audio_item.uri.clone();
                snapshot.length = audio_item.duration_ms;
                snapshot.position = 0;
                snapshot.artwork_url = audio_item
                    .covers
                    .first()
                    .map(|cover| cover.url.clone())
                    .unwrap_or_default();
                match &audio_item.unique_fields {
                    UniqueFields::Track { artists, album, .. } => {
                        snapshot.media_type = "Track".into();
                        snapshot.artist = artists
                            .iter()
                            .map(|artist| artist.name.as_str())
                            .collect::<Vec<_>>()
                            .join(", ");
                        snapshot.album = album.clone();
                    }
                    UniqueFields::Episode { show_name, .. } => {
                        snapshot.media_type = "Episode".into();
                        snapshot.artist = show_name.clone();
                        snapshot.album = show_name.clone();
                    }
                    UniqueFields::Local { artists, album, .. } => {
                        snapshot.media_type = "Local".into();
                        snapshot.artist = artists.clone().unwrap_or_default();
                        snapshot.album = album.clone().unwrap_or_default();
                    }
                }
            }
            PlayerEvent::Playing { position_ms, .. } => {
                snapshot.status = "Playing".into();
                snapshot.position = position_ms;
                snapshot.active = true;
            }
            PlayerEvent::Paused { position_ms, .. } => {
                snapshot.status = "Paused".into();
                snapshot.position = position_ms;
                snapshot.active = true;
            }
            PlayerEvent::Stopped { .. } => {
                snapshot.status = "Stopped".into();
                snapshot.position = 0;
                snapshot.active = false;
            }
            PlayerEvent::PositionChanged { position_ms, .. }
            | PlayerEvent::PositionCorrection { position_ms, .. }
            | PlayerEvent::Seeked { position_ms, .. } => snapshot.position = position_ms,
            PlayerEvent::VolumeChanged { volume } => {
                snapshot.volume =
                    ((volume as u32 * 100 + (u16::MAX as u32 / 2)) / u16::MAX as u32) as u8;
            }
            PlayerEvent::ShuffleChanged { shuffle } => snapshot.shuffle_active = shuffle,
            PlayerEvent::RepeatChanged { context, track } => {
                snapshot.repeat_mode = if track {
                    "Track"
                } else if context {
                    "List"
                } else {
                    "Off"
                }
                .into()
            }
            PlayerEvent::SessionConnected { .. } => {
                snapshot.ready = true;
                snapshot.error.clear();
            }
            PlayerEvent::SessionDisconnected { .. } => {
                snapshot.ready = false;
                snapshot.active = false;
                snapshot.status = "Stopped".into();
                snapshot.error = "Spotify Connect session disconnected".into();
            }
            PlayerEvent::Unavailable { track_id, .. } => {
                snapshot.active = false;
                snapshot.status = "Stopped".into();
                snapshot.error = format!("Spotify item unavailable: {track_id:?}");
            }
            _ => {}
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let mut input = String::new();
    io::stdin().lock().read_line(&mut input)?;
    let startup: serde_json::Value = serde_json::from_str(input.trim())?;
    let access_token = startup
        .get("accessToken")
        .and_then(|value| value.as_str())
        .unwrap_or("");
    let secret = startup
        .get("secret")
        .and_then(|value| value.as_str())
        .unwrap_or("")
        .to_owned();
    let requested_port = startup
        .get("port")
        .and_then(|value| value.as_u64())
        .unwrap_or(0) as u16;
    let initial_volume = startup
        .get("initialVolume")
        .and_then(|value| value.as_u64())
        .unwrap_or(100)
        .min(100) as u8;
    let audio_quality = startup
        .get("audioQuality")
        .and_then(|value| value.as_u64())
        .unwrap_or(320);
    let audio_cache_path = startup
        .get("audioCachePath")
        .and_then(|value| value.as_str())
        .unwrap_or("");
    if access_token.is_empty() || secret.is_empty() {
        return Err("missing startup credentials".into());
    }

    let state = Arc::new(RwLock::new(Snapshot {
        volume: initial_volume,
        ..Snapshot::default()
    }));
    let cache = if audio_cache_path.is_empty() {
        None
    } else {
        Some(Cache::new(
            None::<PathBuf>,
            None::<PathBuf>,
            Some(PathBuf::from(audio_cache_path)),
            Some(1024 * 1024 * 1024),
        )?)
    };
    let session = Session::new(SessionConfig::default(), cache);
    let backend = audio_backend::find(None).ok_or("audio backend unavailable")?;
    let mixer_builder = mixer::find(None).ok_or("audio mixer unavailable")?;
    let mixer = mixer_builder(MixerConfig::default())?;
    let soft_volume = mixer.get_soft_volume();
    let player = Player::new(
        PlayerConfig {
            bitrate: match audio_quality {
                96 => Bitrate::Bitrate96,
                160 => Bitrate::Bitrate160,
                _ => Bitrate::Bitrate320,
            },
            position_update_interval: Some(Duration::from_millis(250)),
            ..Default::default()
        },
        session.clone(),
        soft_volume,
        move || backend(None, AudioFormat::default()),
    );
    let events = player.get_player_event_channel();
    let config = ConnectConfig {
        name: "Playhub Now Playing".into(),
        initial_volume: ((initial_volume as u32 * u16::MAX as u32) / 100) as u16,
        ..Default::default()
    };
    let credentials = Credentials::with_access_token(access_token);
    let (spirc, spirc_task) = Spirc::new(config, session, credentials, player, mixer).await?;
    let spirc = Arc::new(spirc);
    let task_state = state.clone();
    tokio::spawn(async move {
        spirc_task.await;
        let mut snapshot = task_state.write().unwrap();
        snapshot.ready = false;
        snapshot.active = false;
        snapshot.status = "Stopped".into();
        if snapshot.error.is_empty() {
            snapshot.error = "Spotify Connect task ended".into();
        }
    });
    tokio::spawn(track_events(events, state.clone()));
    state.write().unwrap().ready = true;

    let listener = TcpListener::bind(SocketAddr::new(
        IpAddr::V4(Ipv4Addr::LOCALHOST),
        requested_port,
    ))?;
    let port = listener.local_addr()?.port();
    let server = Server::from_listener(listener, None)?;
    println!(
        "{}",
        serde_json::json!({"ok": true, "port": port, "pid": std::process::id()})
    );

    let server_state = state.clone();
    let server_spirc = spirc.clone();
    tokio::task::spawn_blocking(move || {
        for request in server.incoming_requests() {
            if !handle_request(request, &secret, &server_state, &server_spirc) {
                break;
            }
        }
    })
    .await?;
    Ok(())
}
