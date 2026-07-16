#!/usr/bin/env python3
"""Portable release smoke tests for Now Playing's backend invariants.

The script deliberately avoids Windows-only APIs.  It validates the localhost
streaming contract used by Steam Chromium and the source/session matching logic
that chooses the active media player.
"""

from __future__ import annotations

import importlib.util
import os
import sys
import tempfile
import types
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Decky injects this module at runtime. main.py only needs it to exist while the
# portable tests import the backend.
sys.modules.setdefault("decky_plugin", types.ModuleType("decky_plugin"))

spec = importlib.util.spec_from_file_location("now_playing_backend", ROOT / "main.py")
if spec is None or spec.loader is None:
    raise RuntimeError("Unable to load main.py")
backend = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backend)


def request(url: str, range_header: str | None = None, method: str = "GET"):
    headers = {"Range": range_header} if range_header else {}
    return urllib.request.urlopen(urllib.request.Request(url, headers=headers, method=method), timeout=5)


def test_local_stream_ranges() -> None:
    payload = bytes(range(256)) * 8
    with tempfile.TemporaryDirectory(prefix="now-playing-range-test-") as directory:
        media_path = Path(directory) / "range-test.m4a"
        media_path.write_bytes(payload)
        server = backend.LocalMusicStreamServer(
            lambda resource_id: str(media_path) if resource_id == "track-1" else "",
            lambda _kind, _resource_id: "",
            lambda _message: None,
        )
        server.start()
        try:
            url = f"{server.base_url}/track/track-1"
            with request(url, "bytes=-17") as response:
                body = response.read()
                assert response.status == 206
                assert response.headers["Content-Range"] == f"bytes {len(payload) - 17}-{len(payload) - 1}/{len(payload)}"
                assert body == payload[-17:]
                assert response.headers["Cache-Control"] == "no-store, no-cache, must-revalidate"

            with request(url, "bytes=10-29") as response:
                assert response.status == 206
                assert response.read() == payload[10:30]

            with request(url, "bytes=40-") as response:
                assert response.status == 206
                assert response.read() == payload[40:]

            with request(url, method="HEAD") as response:
                assert response.status == 200
                assert int(response.headers["Content-Length"]) == len(payload)
                assert response.read() == b""

            for invalid_range in ("bytes=", "bytes=12-4", "bytes=99999-", "bytes=0-1,4-5"):
                try:
                    request(url, invalid_range)
                except urllib.error.HTTPError as error:
                    assert error.code == 416
                    assert error.headers["Content-Range"] == f"bytes */{len(payload)}"
                else:
                    raise AssertionError(f"Expected HTTP 416 for {invalid_range}")
        finally:
            server.stop()


def test_active_service_matching() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    examples = {
        "spotify": {"id": "Spotify.exe", "name": "Spotify", "status": "Playing", "title": "Track"},
        "tidal": {"appId": "TIDAL.TIDALDesktop", "processName": "TIDAL.exe", "status": "Playing", "title": "Track"},
        "appleMusic": {"app_id": "AppleInc.AppleMusicWin", "process": "Music.UI.exe", "status": "Paused", "title": "Track"},
        "deezer": {"source": "Deezer Desktop", "processName": "Deezer.exe", "status": "Playing", "title": "Track"},
        "amazonMusic": {"appId": "AmazonMusic", "process": "Amazon Music.exe", "status": "Playing", "title": "Track"},
        "soundCloud": {"name": "SoundCloud PWA", "processName": "msedge.exe", "status": "Playing", "title": "Track"},
    }
    for service, matching_player in examples.items():
        decoy = {"id": "UnrelatedPlayer", "status": "Playing", "title": "Other track"}
        assert plugin._media_player_match_score(matching_player, service) > plugin._media_player_match_score(decoy, service)

        plugin.active_service = service
        plugin.player = ""
        normalized = plugin._normalize_snapshot_for_active_service(
            {"players": [decoy, matching_player], "selected": decoy, "selectedPlayer": "UnrelatedPlayer"}
        )
        selected = normalized.get("selected") or {}
        assert selected.get("title") == "Track", f"Failed to select {service} session"



def test_local_frontend_state_is_authoritative() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    plugin._local_music_frontend_state = {
        "track": {"id": "local-1", "name": "Local track", "artists": [], "album": {}},
        "status": "Playing",
        "position": 1200,
        "length": 5000,
        "volume": 73,
        "canNext": False,
        "canPrevious": False,
        "shuffleActive": False,
        "repeatMode": "None",
    }
    plugin._local_music_player = None
    snapshot = plugin._local_music_snapshot_sync()
    assert snapshot["selected"]["title"] == "Local track"
    assert snapshot["selected"]["position"] == 1200
    assert plugin._local_music_player is None, "Reading local state must not start the legacy COM player"



def test_spotify_api_snapshot_is_authoritative() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    payload = {
        "is_playing": True,
        "progress_ms": 42000,
        "shuffle_state": True,
        "repeat_state": "context",
        "device": {"volume_percent": 64},
        "item": {
            "name": "API track",
            "duration_ms": 180000,
            "artists": [{"name": "API artist"}],
            "album": {
                "name": "API album",
                "images": [
                    {"url": "https://example.invalid/small.jpg", "width": 64, "height": 64},
                    {"url": "https://example.invalid/large.jpg", "width": 640, "height": 640},
                ],
            },
        },
    }
    snapshot = plugin._spotify_snapshot_from_playback(payload)
    selected = snapshot.get("selected") or {}
    assert selected.get("id") == "spotify-api"
    assert selected.get("title") == "API track"
    assert selected.get("artist") == "API artist"
    assert selected.get("artworkUrl") == "https://example.invalid/large.jpg"
    assert selected.get("position") == 42000
    assert selected.get("shuffleActive") is True
    assert selected.get("repeatMode") == "List"
    assert selected.get("volume") == 64

    plugin.active_service = "spotify"
    assert plugin._normalized_active_service() == "spotify"
    plugin.active_service = "spotifyPlayer"
    assert plugin._normalized_active_service() == "spotify"


def test_empty_snapshots_are_canonical() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    for value in (None, {}, {"players": None}, {"players": [], "selected": None}):
        snapshot = plugin._canonical_snapshot(value)
        assert snapshot["players"] == []
        assert snapshot["selected"] is None
        assert isinstance(snapshot["selectedPlayer"], str)
        assert isinstance(snapshot["currentPlayer"], str)


def test_fanart_relative_asset_urls() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    mbid = "12345678-1234-1234-1234-123456789abc"
    expected = f"https://assets.fanart.tv/fanart/music/{mbid}/artistbackground/sample.jpg"
    assert plugin._fanart_asset_url("sample.jpg", mbid, "artistbackground") == expected
    assert plugin._fanart_asset_url("//assets.fanart.tv/example.jpg", mbid, "artistbackground") == "https://assets.fanart.tv/example.jpg"
    assert plugin._fanart_asset_url("https://assets.fanart.tv/example.jpg", mbid, "artistbackground") == "https://assets.fanart.tv/example.jpg"


def test_fanart_filename_payload_candidates() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    plugin._artist_background_provider_settings = {"fanart_api_key": "test-key"}
    mbid = "12345678-1234-1234-1234-123456789abc"
    calls: list[str] = []
    plugin._musicbrainz_artist_mbids = lambda _name, _limit=6: [mbid]

    def payload(requested_mbid: str):
        calls.append(requested_mbid)
        return {"artistbackground": [{"url": "hero.jpg", "width": 1920, "height": 1080}]}

    plugin._fanart_artist_payload = payload
    plugin._probe_remote_image = lambda _url, _referer="": (0, 0, "")
    candidates = plugin._fanart_artist_background_candidates("Test Artist", 24)
    assert len(candidates) == 1
    assert calls == [mbid], "One artist MBID must produce one fanart.tv API request"
    assert candidates[0]["source"] == "fanart.tv"
    assert candidates[0]["url"] == f"https://assets.fanart.tv/fanart/music/{mbid}/artistbackground/hero.jpg"



def test_generic_running_player_fallback() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    plugin.active_service = "spotifyPlayer"
    plugin.player = ""
    plugin._is_music_app_running_sync = lambda _key, max_age=0.0: True
    plugin._log = lambda _message: None
    plugin._diagnostic_lock = __import__("threading").Lock()
    plugin._diagnostic_snapshot_signature = ""
    plugin._diagnostic_snapshot_at = 0.0
    snapshot = plugin._normalize_snapshot_for_active_service({
        "players": [{"id": "generic-session", "name": "Media Session", "status": "Playing", "title": "Track"}]
    })
    assert (snapshot.get("selected") or {}).get("id") == "generic-session"


def test_fanart_preview_url_and_no_external_curl() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    full = "https://assets.fanart.tv/fanart/music/artist/artistbackground/hero.jpg"
    preview = "https://assets.fanart.tv/preview/music/artist/artistbackground/hero.jpg"
    assert plugin._fanart_preview_url(full) == preview
    variants = plugin._remote_image_url_variants(preview)
    assert preview in variants
    assert any("static.fanart.tv" in value for value in variants)
    assert any("/fanart/" in value for value in variants)
    backend_source = (ROOT / "main.py").read_text(encoding="utf-8")
    assert 'shutil.which("curl' not in backend_source
    assert 'curl.exe"' not in backend_source
    assert "_download_remote_image_bytes_winhttp" in backend_source
    assert "_download_remote_image_bytes_ipv4" in backend_source


def test_helper_recovery_architecture() -> None:
    backend_source = (ROOT / "main.py").read_text(encoding="utf-8")
    assert "self.port = 0" in backend_source
    assert "NowPlaying-MediaBridge-state.json" in backend_source
    assert "_snapshot_refresh_lock" in backend_source
    assert "_recovery_executor" in backend_source
    assert "_stop_helper_unlocked(force=True" in backend_source
    assert "--port" in backend_source
    assert "CreateProcessWithTokenW" in backend_source
    assert "interactive-token" in backend_source
    assert "_direct_media_snapshot_async" in backend_source
    assert "winrt.windows.media.control" in backend_source


def test_spotify_playback_helper_is_owned_by_plugin() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    with tempfile.TemporaryDirectory(prefix="now-playing-helper-roots-") as directory:
        plugin.helper_cache_root = os.path.join(directory, "NowPlaying-MediaBridge")
        plugin.spotify_playback_bridge_cache_root = os.path.join(directory, "NowPlaying-SpotifyPlaybackBridge")
        plugin.bundled_helper_dir = os.path.join(directory, "plugin", "bin")
        plugin._is_windows = lambda: True
        plugin._native_process_entries = lambda: [
            {"pid": 11, "name": "MediaBridge.exe", "path": os.path.join(plugin.helper_cache_root, "hash", "MediaBridge.exe")},
            {"pid": 12, "name": "SpotifyPlaybackBridge.exe", "path": os.path.join(plugin.spotify_playback_bridge_cache_root, "hash", "SpotifyPlaybackBridge.exe")},
            {"pid": 13, "name": "SpotifyPlaybackBridge.exe", "path": os.path.join(directory, "unrelated", "SpotifyPlaybackBridge.exe")},
        ]
        assert plugin._plugin_helper_process_ids(["SpotifyPlaybackBridge.exe"]) == {12}


def test_spotify_playback_requires_streaming_scope_without_spawning() -> None:
    plugin = backend.Plugin.__new__(backend.Plugin)
    plugin._spotify_playback_bridge_lock = __import__("threading").RLock()
    plugin._spotify_playback_bridge_process = None
    plugin._spotify_playback_bridge_port = 0
    plugin._spotify_playback_bridge_secret = ""
    plugin._spotify_playback_bridge_error = ""
    plugin._spotify_playback_bridge_retry_at = 0.0
    plugin.spotify_playback_bridge_path = str(ROOT / "bin" / "SpotifyPlaybackBridge.exe")
    plugin.spotify_playback_bridge_cache_root = os.path.join(tempfile.gettempdir(), "NowPlaying-SpotifyPlaybackBridge-test")
    plugin.spotify_settings = {"scope": "user-read-playback-state user-modify-playback-state"}
    assert plugin._spotify_playback_bridge_start_sync() is False
    assert plugin._spotify_playback_bridge_process is None
    assert "Reconnect Spotify" in plugin._spotify_playback_bridge_error
    assert plugin._spotify_playback_bridge_retry_at > 0

def main() -> None:
    test_local_stream_ranges()
    test_active_service_matching()
    test_local_frontend_state_is_authoritative()
    test_spotify_api_snapshot_is_authoritative()
    test_empty_snapshots_are_canonical()
    test_fanart_relative_asset_urls()
    test_fanart_filename_payload_candidates()
    test_generic_running_player_fallback()
    test_fanart_preview_url_and_no_external_curl()
    test_helper_recovery_architecture()
    test_spotify_playback_helper_is_owned_by_plugin()
    test_spotify_playback_requires_streaming_scope_without_spawning()
    print("Runtime smoke tests OK: ranges, 6 external sources, generic and direct WinRT SMTC fallbacks, canonical empty snapshots, local state, Spotify authority, Spotify playback scope guard, Spotify helper ownership, interactive-session MediaBridge recovery, and in-process fanart.tv transports without external curl.")


if __name__ == "__main__":
    main()
