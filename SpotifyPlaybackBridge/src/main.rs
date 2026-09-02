use std::{
    io::{self, BufRead},
    net::{IpAddr, Ipv4Addr, SocketAddr, TcpListener},
    path::PathBuf,
    sync::{
        Arc, RwLock,
        atomic::{AtomicBool, AtomicU64, Ordering},
    },
    thread,
    time::{Duration, Instant},
};

use librespot::{
    connect::{ConnectConfig, LoadRequest, LoadRequestOptions, PlayingTrack, Spirc},
    core::{Session, SessionConfig, authentication::Credentials, cache::Cache},
    metadata::audio::UniqueFields,
    playback::{
        audio_backend::{Sink, SinkError, SinkResult},
        config::{Bitrate, PlayerConfig},
        convert::Converter,
        decoder::AudioPacket,
        mixer::{self, MixerConfig},
        player::{Player, PlayerEvent},
    },
};
use serde::{Deserialize, Serialize};
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
    audio_level: f32,
    audio_ready: bool,
    audio_packets: u64,
    audio_recoveries: u32,
    shuffle_active: bool,
    repeat_mode: String,
    surround_mode: String,
    output_channels: u16,
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
            audio_level: 0.0,
            audio_ready: false,
            audio_packets: 0,
            audio_recoveries: 0,
            media_type: String::new(),
            shuffle_active: false,
            repeat_mode: "Off".into(),
            surround_mode: "off".into(),
            output_channels: 2,
            error: String::new(),
        }
    }
}

struct MeteredSink {
    inner: Box<dyn Sink>,
    state: Arc<RwLock<Snapshot>>,
    last_sample: Instant,
}

struct DynamicRodioSink {
    sink: Option<rodio::Sink>,
    stream: Option<rodio::OutputStream>,
    channels: u16,
    config: Arc<RwLock<SurroundConfig>>,
    state: Arc<RwLock<Snapshot>>,
    stream_failed: Arc<AtomicBool>,
    stream_generation: Arc<AtomicU64>,
    lfe_state: f32,
}

#[derive(Clone)]
struct SurroundConfig {
    mode: String,
    gains: [f32; 8],
}

impl DynamicRodioSink {
    fn new(config: Arc<RwLock<SurroundConfig>>, state: Arc<RwLock<Snapshot>>) -> Self {
        Self {
            sink: None,
            stream: None,
            channels: 0,
            config,
            state,
            stream_failed: Arc::new(AtomicBool::new(false)),
            stream_generation: Arc::new(AtomicU64::new(0)),
            lfe_state: 0.0,
        }
    }

    fn open_default_output(&mut self, recovering: bool) -> Result<(), String> {
        let generation = self.stream_generation.fetch_add(1, Ordering::AcqRel) + 1;
        let callback_generation = self.stream_generation.clone();
        let stream_failed = Arc::new(AtomicBool::new(false));
        let callback_failed = stream_failed.clone();
        let callback_state = self.state.clone();
        let mut stream = rodio::OutputStreamBuilder::from_default_device()
            .map_err(|error| error.to_string())?
            .with_error_callback(move |error| {
                if callback_generation.load(Ordering::Acquire) != generation {
                    return;
                }
                callback_failed.store(true, Ordering::Release);
                if let Ok(mut snapshot) = callback_state.write() {
                    snapshot.audio_ready = false;
                    snapshot.error = format!("Audio output unavailable: {error}");
                }
                eprintln!("audio stream error: {error}");
            })
            .open_stream_or_fallback()
            .map_err(|error| error.to_string())?;
        stream.log_on_drop(false);
        let channels = stream.config().channel_count();
        if channels == 0 {
            return Err("default output exposes no audio channels".into());
        }
        let sink = rodio::Sink::connect_new(stream.mixer());
        sink.play();
        self.channels = channels;
        self.sink = Some(sink);
        self.stream = Some(stream);
        self.stream_failed = stream_failed;
        self.lfe_state = 0.0;

        if let Ok(mut snapshot) = self.state.write() {
            let configured_mode = self.config.read().unwrap().mode.clone();
            snapshot.audio_ready = true;
            snapshot.output_channels = channels;
            snapshot.surround_mode = if channels >= 6 {
                configured_mode
            } else {
                "off".into()
            };
            if recovering {
                snapshot.audio_recoveries = snapshot.audio_recoveries.saturating_add(1);
            }
            if snapshot.error.starts_with("Audio output") {
                snapshot.error.clear();
            }
        }
        Ok(())
    }

    fn ensure_output(&mut self) -> SinkResult<()> {
        let failed = self.stream_failed.swap(false, Ordering::AcqRel);
        if self.sink.is_some() && self.stream.is_some() && !failed {
            return Ok(());
        }

        let recovering = failed || self.sink.is_some() || self.stream.is_some();
        self.sink = None;
        self.stream = None;
        let mut last_error = "audio output is not ready".to_owned();
        for attempt in 0..24 {
            match self.open_default_output(recovering) {
                Ok(()) => return Ok(()),
                Err(error) => last_error = error,
            }
            if attempt < 23 {
                thread::sleep(Duration::from_millis(125));
            }
        }
        if let Ok(mut snapshot) = self.state.write() {
            snapshot.audio_ready = false;
            snapshot.error = format!("Audio output unavailable: {last_error}");
        }
        Err(SinkError::ConnectionRefused(last_error))
    }
}

impl Sink for DynamicRodioSink {
    fn start(&mut self) -> SinkResult<()> {
        self.ensure_output()?;
        if let Some(sink) = self.sink.as_ref() {
            sink.play();
        }
        Ok(())
    }

    fn stop(&mut self) -> SinkResult<()> {
        self.stream_generation.fetch_add(1, Ordering::AcqRel);
        if let Some(sink) = self.sink.take() {
            sink.stop();
        }
        self.stream = None;
        self.channels = 0;
        self.stream_failed.store(false, Ordering::Release);
        if let Ok(mut snapshot) = self.state.write() {
            snapshot.audio_ready = false;
            snapshot.audio_level = 0.0;
        }
        Ok(())
    }

    fn write(&mut self, packet: AudioPacket, converter: &mut Converter) -> SinkResult<()> {
        self.ensure_output()?;
        let samples = packet
            .samples()
            .map_err(|error| SinkError::OnWrite(error.to_string()))?;
        let stereo = converter.f64_to_f32(samples);
        let channels = self.channels as usize;
        let config = self.config.read().unwrap().clone();
        let mut output = Vec::with_capacity(stereo.len() / 2 * channels);
        // One-pole 120 Hz low-pass at Spotify's native 44.1 kHz sample rate.
        // LFE stays deliberately restrained; overall headroom prevents clipping.
        const LFE_ALPHA: f32 = 0.01681;
        const HEADROOM: f32 = 0.70;
        for frame in stereo.chunks_exact(2) {
            let left = frame[0];
            let right = frame[1];
            if channels == 1 {
                output.push(((left + right) * 0.5 * HEADROOM).clamp(-1.0, 1.0));
                continue;
            }
            if config.mode == "off" {
                // Keep perceived loudness consistent when switching surround modes.
                // Speaker trims remain exclusive to upmix, but the shared headroom
                // avoids a large level jump when returning to direct stereo.
                output.push((left * HEADROOM).clamp(-1.0, 1.0));
                output.push((right * HEADROOM).clamp(-1.0, 1.0));
                output.extend(std::iter::repeat_n(0.0, channels.saturating_sub(2)));
                continue;
            }
            let mono = (left + right) * 0.5;
            self.lfe_state += LFE_ALPHA * (mono - self.lfe_state);
            let side_left = (left - right) * 0.48;
            let side_right = (right - left) * 0.48;
            let mut mixed = [0.0f32; 8];
            mixed[0] = left;
            mixed[1] = right;
            mixed[2] = mono * 0.72;
            mixed[3] = self.lfe_state * 0.30;
            if channels >= 8 {
                mixed[6] = side_left;
                mixed[7] = side_right;
                if config.mode == "7.1" {
                    mixed[4] = side_left * 0.72;
                    mixed[5] = side_right * 0.72;
                }
            } else {
                mixed[4] = side_left;
                mixed[5] = side_right;
            }
            for channel in 0..channels {
                output.push(
                    (mixed[channel.min(7)] * config.gains[channel.min(7)] * HEADROOM)
                        .clamp(-1.0, 1.0),
                );
            }
        }
        let sink = self
            .sink
            .as_ref()
            .ok_or_else(|| SinkError::NotConnected("audio output is not ready".into()))?;
        sink.append(rodio::buffer::SamplesBuffer::new(
            self.channels,
            44_100,
            output,
        ));
        while sink.len() > 26 {
            // A failed endpoint no longer drains Rodio's queue. Leave this write
            // promptly so the next decoded packet can reopen the current default
            // device instead of waiting forever on the abandoned stream.
            if self.stream_failed.load(Ordering::Acquire) {
                break;
            }
            thread::sleep(Duration::from_millis(10));
        }
        if let Ok(mut snapshot) = self.state.write() {
            let output_live = !self.stream_failed.load(Ordering::Acquire);
            snapshot.audio_ready = output_live;
            if output_live {
                snapshot.audio_packets = snapshot.audio_packets.saturating_add(1);
            }
        }
        Ok(())
    }
}

impl MeteredSink {
    fn new(inner: Box<dyn Sink>, state: Arc<RwLock<Snapshot>>) -> Self {
        Self {
            inner,
            state,
            last_sample: Instant::now() - Duration::from_millis(50),
        }
    }
}

impl Sink for MeteredSink {
    fn start(&mut self) -> SinkResult<()> {
        self.inner.start()
    }

    fn stop(&mut self) -> SinkResult<()> {
        self.state.write().unwrap().audio_level = 0.0;
        self.inner.stop()
    }

    fn write(&mut self, packet: AudioPacket, converter: &mut Converter) -> SinkResult<()> {
        if self.last_sample.elapsed() >= Duration::from_millis(32) {
            if let Ok(samples) = packet.samples() {
                let mut sum = 0.0;
                let mut count = 0usize;
                for sample in samples.iter().step_by(4) {
                    sum += sample * sample;
                    count += 1;
                }
                if count > 0 {
                    let measured = ((sum / count as f64).sqrt() * 3.2).clamp(0.0, 1.0) as f32;
                    let mut snapshot = self.state.write().unwrap();
                    snapshot.audio_level = snapshot.audio_level * 0.55 + measured * 0.45;
                }
            }
            self.last_sample = Instant::now();
        }
        self.inner.write(packet, converter)
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

#[derive(Deserialize)]
struct LoadTracksBody {
    uris: Vec<String>,
    #[serde(default)]
    start_index: usize,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SurroundBody {
    mode: String,
    speaker_volumes: Vec<u8>,
}

fn handle_request(
    mut request: Request,
    secret: &str,
    state: &Arc<RwLock<Snapshot>>,
    spirc: &Arc<Spirc>,
    surround: &Arc<RwLock<SurroundConfig>>,
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
    if request.method() == &Method::Post && path == "/action/surround" {
        let mut body = String::new();
        let payload = request
            .as_reader()
            .read_to_string(&mut body)
            .ok()
            .and_then(|_| serde_json::from_str::<SurroundBody>(&body).ok());
        let Some(payload) = payload else {
            let _ = request.respond(json_response(
                serde_json::json!({"ok": false, "error": "invalid-body"}),
                400,
            ));
            return true;
        };
        let mode = match payload.mode.as_str() {
            "5.1" | "7.1" => payload.mode,
            _ => "off".into(),
        };
        let mut gains = [1.0f32; 8];
        for (index, value) in payload.speaker_volumes.iter().take(8).enumerate() {
            gains[index] = (*value as f32 / 100.0).clamp(0.0, 1.0);
        }
        *surround.write().unwrap() = SurroundConfig {
            mode: mode.clone(),
            gains,
        };
        let mut snapshot = state.write().unwrap();
        snapshot.surround_mode = if snapshot.output_channels >= 6 {
            mode
        } else {
            "off".into()
        };
        drop(snapshot);
        let _ = request.respond(json_response(serde_json::json!({"ok": true}), 200));
        return true;
    }

    let current = state.read().unwrap().clone();
    let mut optimistic_status: Option<(&str, bool)> = None;
    let mut optimistic_shuffle: Option<bool> = None;
    let mut optimistic_repeat: Option<String> = None;
    let mut optimistic_volume: Option<u8> = None;
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
            optimistic_volume = Some(volume);
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
            let context_uri = query_value(request.url(), "context").unwrap_or_default();
            let offset_uri = query_value(request.url(), "offset").unwrap_or_default();
            if uri.is_empty() {
                Err(librespot::core::Error::invalid_argument("uri"))
            } else {
                spirc.activate().and_then(|_| {
                    if context_uri.is_empty()
                        && (uri.starts_with("spotify:track:")
                            || uri.starts_with("spotify:episode:"))
                    {
                        spirc.load(LoadRequest::from_tracks(
                            vec![uri],
                            LoadRequestOptions {
                                start_playing: true,
                                playing_track: Some(PlayingTrack::Index(0)),
                                ..Default::default()
                            },
                        ))
                    } else {
                        spirc.load(LoadRequest::from_context_uri(
                            if context_uri.is_empty() {
                                uri.clone()
                            } else {
                                context_uri
                            },
                            LoadRequestOptions {
                                start_playing: true,
                                playing_track: if offset_uri.is_empty() {
                                    None
                                } else {
                                    Some(PlayingTrack::Uri(offset_uri))
                                },
                                ..Default::default()
                            },
                        ))
                    }
                })
            }
        }
        "/action/load-tracks" => {
            let mut body = String::new();
            let parsed = request
                .as_reader()
                .read_to_string(&mut body)
                .ok()
                .and_then(|_| serde_json::from_str::<LoadTracksBody>(&body).ok());
            if let Some(payload) = parsed {
                let tracks: Vec<String> = payload
                    .uris
                    .into_iter()
                    .filter(|uri| {
                        uri.starts_with("spotify:track:") || uri.starts_with("spotify:episode:")
                    })
                    .take(300)
                    .collect();
                if tracks.is_empty() {
                    Err(librespot::core::Error::invalid_argument("uris"))
                } else {
                    let start_index =
                        payload.start_index.min(tracks.len().saturating_sub(1)) as u32;
                    spirc.activate().and_then(|_| {
                        spirc.load(LoadRequest::from_tracks(
                            tracks,
                            LoadRequestOptions {
                                start_playing: true,
                                playing_track: Some(PlayingTrack::Index(start_index)),
                                ..Default::default()
                            },
                        ))
                    })
                }
            } else {
                Err(librespot::core::Error::invalid_argument("body"))
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
        if let Some(volume) = optimistic_volume {
            snapshot.volume = volume;
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
                snapshot.audio_packets = 0;
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
    let surround_mode = startup
        .get("surroundMode")
        .and_then(|value| value.as_str())
        .unwrap_or("off")
        .to_owned();
    let mut speaker_gains = [1.0f32; 8];
    if let Some(values) = startup
        .get("speakerVolumes")
        .and_then(|value| value.as_array())
    {
        for (index, value) in values.iter().take(8).enumerate() {
            speaker_gains[index] = (value.as_f64().unwrap_or(100.0) as f32 / 100.0).clamp(0.0, 1.0);
        }
    }
    let surround_config = Arc::new(RwLock::new(SurroundConfig {
        mode: surround_mode,
        gains: speaker_gains,
    }));
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
    let audio_cache_size_bytes = startup
        .get("audioCacheSizeBytes")
        .and_then(|value| value.as_u64())
        .unwrap_or(5 * 1024 * 1024 * 1024);
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
            Some(audio_cache_size_bytes),
        )?)
    };
    let session = Session::new(SessionConfig::default(), cache);
    let mixer_builder = mixer::find(None).ok_or("audio mixer unavailable")?;
    let mixer = mixer_builder(MixerConfig::default())?;
    let soft_volume = mixer.get_soft_volume();
    let meter_state = state.clone();
    let sink_surround_config = surround_config.clone();
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
        move || {
            // Constructing the Spotify session must not bind to the current Windows
            // endpoint. Steam can finish switching its audio route after Decky has
            // started; the sink opens lazily on the first Play and again after every
            // pause or device-loss callback.
            let output: Box<dyn Sink> = Box::new(DynamicRodioSink::new(
                sink_surround_config.clone(),
                meter_state.clone(),
            ));
            Box::new(MeteredSink::new(output, meter_state))
        },
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
            if !handle_request(
                request,
                &secret,
                &server_state,
                &server_spirc,
                &surround_config,
            ) {
                break;
            }
        }
    })
    .await?;
    Ok(())
}
