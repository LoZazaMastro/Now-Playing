import csv
import ctypes
import hashlib
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import urllib.parse
import urllib.request
from typing import Any, Dict, Optional, Set

import decky_plugin


class Plugin:
    def __init__(self) -> None:
        self.plugin_dir = os.path.dirname(os.path.abspath(__file__))
        self.runtime_dir = self._resolve_runtime_dir()
        self.bundled_helper_dir = os.path.join(self.plugin_dir, "bin")
        self.bundled_helper_path = os.path.join(self.bundled_helper_dir, "MediaBridge.exe")
        self.helper_cache_root = os.path.join(tempfile.gettempdir(), "NowPlaying-MediaBridge")
        self.helper_dir = self.bundled_helper_dir
        self.helper_path = self.bundled_helper_path
        self.port = 38947
        self.base_url = f"http://127.0.0.1:{self.port}"
        self.player = ""
        self.log_path = os.path.join(tempfile.gettempdir(), "NowPlaying.log")
        self.cover_cache_path = os.path.join(tempfile.gettempdir(), "NowPlaying-cover-cache.json")
        self._cover_cache: Optional[Dict[str, str]] = None

    def _resolve_runtime_dir(self) -> str:
        runtime_dir = getattr(decky_plugin, "DECKY_PLUGIN_RUNTIME_DIR", None)
        if isinstance(runtime_dir, str) and runtime_dir.strip():
            return runtime_dir

        runtime_dir = os.getenv("DECKY_PLUGIN_RUNTIME_DIR", "").strip()
        if runtime_dir:
            return runtime_dir

        return self.plugin_dir

    def _log(self, message: str) -> None:
        line = f"[Now playing] {message}"
        try:
            stdout = getattr(sys, "stdout", None)
            if stdout is not None:
                stdout.write(line + "\n")
                stdout.flush()
        except Exception:
            pass
        try:
            with open(self.log_path, "a", encoding="utf-8") as handle:
                handle.write(line + "\n")
        except Exception:
            pass

    def _is_windows(self) -> bool:
        return os.name == "nt"

    def _task_creationflags(self) -> int:
        flags = 0
        if self._is_windows() and hasattr(subprocess, "CREATE_NO_WINDOW"):
            flags |= subprocess.CREATE_NO_WINDOW
        return flags

    def _same_path(self, left: str, right: str) -> bool:
        try:
            return os.path.normcase(os.path.abspath(left)) == os.path.normcase(os.path.abspath(right))
        except Exception:
            return False

    def _file_digest(self, path: str) -> str:
        digest = hashlib.sha256()
        with open(path, "rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
        return digest.hexdigest()[:16]

    def _prepare_helper_runtime(self) -> None:
        if not os.path.exists(self.bundled_helper_path):
            raise RuntimeError(f"Helper non trovato: {self.bundled_helper_path}")

        digest = self._file_digest(self.bundled_helper_path)
        runtime_dir = os.path.join(self.helper_cache_root, digest)
        os.makedirs(runtime_dir, exist_ok=True)

        for filename in os.listdir(self.bundled_helper_dir):
            source = os.path.join(self.bundled_helper_dir, filename)
            target = os.path.join(runtime_dir, filename)
            if not os.path.isfile(source):
                continue

            if os.path.exists(target) and os.path.getsize(source) == os.path.getsize(target):
                continue

            shutil.copy2(source, target)

        self.helper_dir = runtime_dir
        self.helper_path = os.path.join(runtime_dir, "MediaBridge.exe")

    def _is_process_running(self, image_name: str) -> bool:
        if not self._is_windows():
            return False

        try:
            completed = subprocess.run(
                ["tasklist", "/FI", f"IMAGENAME eq {image_name}", "/FO", "CSV", "/NH"],
                capture_output=True,
                text=True,
                timeout=1.5,
                creationflags=self._task_creationflags(),
            )
            output = f"{completed.stdout}\n{completed.stderr}".lower()
            return image_name.lower() in output
        except Exception as exc:
            self._log(f"process check error for {image_name}: {exc}")
            return False

    def _music_app_launchers(self) -> Dict[str, Dict[str, Any]]:
        return {
            "spotify": {
                "processes": ["Spotify.exe"],
                "paths": [
                    r"%APPDATA%\Spotify\Spotify.exe",
                    r"%LOCALAPPDATA%\Microsoft\WindowsApps\Spotify.exe",
                ],
                "args": ["--minimized"],
                "minimizeAfterLaunch": True,
                "protocols": ["spotify:"],
            },
            "tidal": {
                "processes": ["TIDAL.exe", "Tidal.exe"],
                "paths": [
                    r"%LOCALAPPDATA%\Programs\TIDAL\TIDAL.exe",
                    r"%LOCALAPPDATA%\TIDAL\TIDAL.exe",
                    r"%LOCALAPPDATA%\Microsoft\WindowsApps\TIDAL.exe",
                ],
                "protocols": ["tidal:"],
            },
            "apple_music": {
                "processes": ["AppleMusic.exe"],
                "paths": [
                    r"%LOCALAPPDATA%\Microsoft\WindowsApps\AppleMusic.exe",
                    r"%PROGRAMFILES%\Apple Music\AppleMusic.exe",
                ],
                "protocols": ["music:", "applemusic:"],
            },
            "deezer": {
                "processes": ["Deezer.exe"],
                "paths": [
                    r"%LOCALAPPDATA%\Programs\Deezer\Deezer.exe",
                    r"%LOCALAPPDATA%\Programs\deezer-desktop\Deezer.exe",
                    r"%LOCALAPPDATA%\Deezer\Deezer.exe",
                    r"%LOCALAPPDATA%\Microsoft\WindowsApps\Deezer.exe",
                ],
                "protocols": ["deezer:"],
            },
            "amazon_music": {
                "processes": ["Amazon Music.exe", "AmazonMusic.exe"],
                "paths": [
                    r"%LOCALAPPDATA%\Amazon Music\Amazon Music.exe",
                    r"%LOCALAPPDATA%\Programs\Amazon Music\Amazon Music.exe",
                    r"%APPDATA%\Amazon Music\Amazon Music.exe",
                    r"%LOCALAPPDATA%\Microsoft\WindowsApps\AmazonMusic.exe",
                ],
                "protocols": ["amazonmusic:"],
            },
            "soundcloud": {
                "processes": ["SoundCloud.exe"],
                "paths": [
                    r"%LOCALAPPDATA%\Programs\SoundCloud\SoundCloud.exe",
                    r"%LOCALAPPDATA%\Microsoft\WindowsApps\SoundCloud.exe",
                ],
                "protocols": ["soundcloud:", "https://soundcloud.com"],
            },
        }

    def _expand_candidate_paths(self, paths):
        expanded = []
        for path in paths:
            candidate = os.path.expandvars(path).strip()
            if candidate and candidate not in expanded:
                expanded.append(candidate)
        return expanded

    def _is_any_process_running(self, image_names) -> bool:
        for image_name in image_names:
            if self._is_process_running(image_name):
                return True
        return False

    def _process_ids_for_images(self, image_names) -> Set[int]:
        process_ids: Set[int] = set()

        if not self._is_windows():
            return process_ids

        for image_name in image_names:
            try:
                completed = subprocess.run(
                    ["tasklist", "/FI", f"IMAGENAME eq {image_name}", "/FO", "CSV", "/NH"],
                    capture_output=True,
                    text=True,
                    timeout=1.5,
                    creationflags=self._task_creationflags(),
                )

                for row in csv.reader(io.StringIO(completed.stdout)):
                    if len(row) < 2:
                        continue
                    if row[0].strip().lower() != str(image_name).lower():
                        continue
                    try:
                        process_ids.add(int(row[1]))
                    except ValueError:
                        continue
            except Exception as exc:
                self._log(f"pid lookup error for {image_name}: {exc}")

        return process_ids

    def _minimize_windows_for_pids(self, process_ids: Set[int]) -> None:
        if not process_ids or not self._is_windows():
            return

        try:
            user32 = ctypes.windll.user32
            enum_windows_proc = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.c_void_p, ctypes.c_void_p)
            sw_minimize = 6

            @enum_windows_proc
            def enum_window(window_handle, _lparam):
                process_id = ctypes.c_ulong()
                user32.GetWindowThreadProcessId(window_handle, ctypes.byref(process_id))

                if process_id.value in process_ids and user32.IsWindowVisible(window_handle):
                    user32.ShowWindow(window_handle, sw_minimize)

                return True

            user32.EnumWindows(enum_window, 0)
        except Exception as exc:
            self._log(f"window minimize error: {exc}")

    def _schedule_minimize_process_windows(self, image_names, attempts: int = 16, delay: float = 0.18) -> None:
        if not self._is_windows():
            return

        def worker() -> None:
            for _ in range(attempts):
                process_ids = self._process_ids_for_images(image_names)
                if process_ids:
                    self._minimize_windows_for_pids(process_ids)
                time.sleep(delay)

        try:
            threading.Thread(target=worker, daemon=True).start()
        except Exception as exc:
            self._log(f"minimize scheduler error: {exc}")

    def _launch_process_minimized(self, executable: str, args=None, minimize_processes=None) -> None:
        startupinfo = None
        if self._is_windows() and hasattr(subprocess, "STARTUPINFO"):
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            startupinfo.wShowWindow = 7

        subprocess.Popen(
            [executable, *(args or [])],
            cwd=os.path.dirname(executable) or None,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            stdin=subprocess.DEVNULL,
            startupinfo=startupinfo,
            creationflags=self._task_creationflags(),
        )

        if minimize_processes:
            self._schedule_minimize_process_windows(minimize_processes)

    def _open_music_app_best_effort(self, app_key: str) -> str:
        if not self._is_windows():
            return "unsupported"

        config = self._music_app_launchers().get(app_key)
        if not config:
            return "unsupported"

        if self._is_any_process_running(config.get("processes", [])):
            return "already_running"

        for candidate in self._expand_candidate_paths(config.get("paths", [])):
            if not candidate or not os.path.exists(candidate):
                continue

            try:
                self._launch_process_minimized(
                    candidate,
                    args=config.get("args", []),
                    minimize_processes=config.get("processes", []) if config.get("minimizeAfterLaunch") else None,
                )
                return "launched"
            except Exception as exc:
                self._log(f"{app_key} launch failed for {candidate}: {exc}")

        for protocol in config.get("protocols", []):
            try:
                os.startfile(protocol)  # type: ignore[attr-defined]
                if config.get("minimizeAfterLaunch"):
                    self._schedule_minimize_process_windows(config.get("processes", []))
                return "launched"
            except Exception as exc:
                self._log(f"{app_key} protocol launch failed for {protocol}: {exc}")

        return "false"

    def _helper_health(self) -> Optional[Dict[str, Any]]:
        try:
            with urllib.request.urlopen(f"{self.base_url}/health", timeout=0.6) as response:
                payload = json.loads(response.read().decode("utf-8"))
                return payload if bool(payload.get("ok", False)) else None
        except Exception:
            return None

    def _healthcheck(self) -> bool:
        return self._helper_health() is not None

    def _wait_helper_down(self, timeout: float = 2.0) -> bool:
        deadline = time.time() + timeout
        while time.time() < deadline:
            if not self._healthcheck():
                return True
            time.sleep(0.1)
        return not self._healthcheck()

    def _kill_helper_processes(self) -> None:
        if not self._is_windows():
            return

        try:
            subprocess.run(
                ["taskkill", "/IM", "MediaBridge.exe", "/T", "/F"],
                capture_output=True,
                text=True,
                timeout=2.5,
                creationflags=self._task_creationflags(),
            )
        except Exception as exc:
            self._log(f"taskkill MediaBridge.exe non riuscito: {exc}")

    def _ensure_helper(self) -> None:
        if not self._is_windows():
            raise RuntimeError("Questo plugin funziona solo su Windows")

        self._prepare_helper_runtime()

        health = self._helper_health()
        if health is not None:
            running_path = str(health.get("processPath", "")).strip()
            if running_path and self._same_path(running_path, self.helper_path):
                return

            self._log(f"helper gia attivo da {running_path or 'origine sconosciuta'}, riavvio copia runtime")
            self._shutdown_helper()
            if not self._wait_helper_down():
                self._log("helper esistente non terminato, uso taskkill automatico")
                self._kill_helper_processes()
                self._wait_helper_down()
            health = self._helper_health()

        if health is not None:
            self._log("helper esistente ancora attivo, lo riuso senza avviarne un secondo")
            return

        creationflags = 0
        if hasattr(subprocess, "CREATE_NO_WINDOW"):
            creationflags = subprocess.CREATE_NO_WINDOW
        if hasattr(subprocess, "DETACHED_PROCESS"):
            creationflags |= subprocess.DETACHED_PROCESS

        subprocess.Popen(
            [self.helper_path, "--server", "--port", str(self.port)],
            cwd=self.helper_dir,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            stdin=subprocess.DEVNULL,
            creationflags=creationflags,
        )

        for _ in range(25):
            if self._healthcheck():
                return
            time.sleep(0.15)

        raise RuntimeError("Helper C# non avviato correttamente")

    def _request_json(self, path: str, method: str = "GET") -> Dict[str, Any]:
        self._ensure_helper()
        req = urllib.request.Request(f"{self.base_url}{path}", method=method)
        with urllib.request.urlopen(req, timeout=1.5) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    def _request_json_no_helper(self, path: str, method: str = "GET", timeout: float = 0.8) -> Dict[str, Any]:
        req = urllib.request.Request(f"{self.base_url}{path}", method=method)
        with urllib.request.urlopen(req, timeout=timeout) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else {}

    def _shutdown_helper(self) -> None:
        if not self._is_windows():
            return

        try:
            self._request_json_no_helper("/shutdown", "POST", timeout=0.8)
            self._log("helper shutdown richiesto")
        except Exception as exc:
            self._log(f"helper shutdown non riuscito: {exc}")

    def _sanitize_text(self, value: str) -> str:
        value = (value or "").strip().lower()
        value = re.sub(r"\s+", " ", value)
        return value

    def _cover_key(self, title: str, artist: str, album: str) -> str:
        return " | ".join([
            self._sanitize_text(title),
            self._sanitize_text(artist),
            self._sanitize_text(album),
        ]).strip()

    def _load_cover_cache(self) -> Dict[str, str]:
        if self._cover_cache is not None:
            return self._cover_cache

        try:
            with open(self.cover_cache_path, "r", encoding="utf-8") as handle:
                data = json.load(handle)
                if isinstance(data, dict):
                    self._cover_cache = {str(k): str(v) for k, v in data.items()}
                    return self._cover_cache
        except Exception:
            pass

        self._cover_cache = {}
        return self._cover_cache

    def _save_cover_cache(self) -> None:
        if self._cover_cache is None:
            return

        try:
            with open(self.cover_cache_path, "w", encoding="utf-8") as handle:
                json.dump(self._cover_cache, handle, ensure_ascii=False, indent=2)
        except Exception:
            pass

    def _http_json(self, url: str, timeout: float = 4.0) -> Dict[str, Any]:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Now-playing/0.2",
                "Accept": "application/json"
            }
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))

    def _cover_search_terms(self, title: str, artist: str, album: str) -> list:
        def clean_variant(value: str) -> str:
            value = (value or "").strip()
            value = re.sub(r"\s*[\(\[].*?[\)\]]", " ", value)
            value = re.sub(
                r"\s+-\s+.*\b(remaster|remastered|radio edit|single version|album version|deluxe|explicit|clean)\b.*$",
                " ",
                value,
                flags=re.IGNORECASE,
            )
            value = re.sub(r"\b(feat\.?|ft\.?)\b.*$", " ", value, flags=re.IGNORECASE)
            value = re.sub(r"\s+", " ", value)
            return value.strip()

        def push(parts) -> None:
            term = " ".join(part for part in parts if part and part.strip()).strip()
            if term and term not in search_terms:
                search_terms.append(term)

        search_terms = []
        clean_title = clean_variant(title)
        clean_album = clean_variant(album)

        push([artist, title, album])
        push([artist, title])
        push([title, artist])

        if clean_title != title or clean_album != album:
            push([artist, clean_title, clean_album])
            push([artist, clean_title])
            push([clean_title, artist])

        return search_terms[:6]

    def _best_itunes_cover(self, title: str, artist: str, album: str) -> str:
        normalized_title = self._sanitize_text(title)
        normalized_artist = self._sanitize_text(artist)

        def score(item: Dict[str, Any]) -> int:
            points = 0
            track_name = self._sanitize_text(str(item.get("trackName", "")))
            artist_name = self._sanitize_text(str(item.get("artistName", "")))
            collection_name = self._sanitize_text(str(item.get("collectionName", "")))

            if normalized_title and track_name == normalized_title:
                points += 8
            elif normalized_title and normalized_title in track_name:
                points += 4

            if normalized_artist and artist_name == normalized_artist:
                points += 8
            elif normalized_artist and normalized_artist in artist_name:
                points += 4

            if album and self._sanitize_text(album) == collection_name:
                points += 3

            if item.get("artworkUrl100"):
                points += 2

            return points

        for term in self._cover_search_terms(title, artist, album):
            url = "https://itunes.apple.com/search?media=music&entity=song&limit=8&term=" + urllib.parse.quote(term)
            payload = self._http_json(url, timeout=3.0)
            results = payload.get("results", [])
            if not isinstance(results, list) or not results:
                continue

            ranked = sorted(
                [item for item in results if isinstance(item, dict)],
                key=score,
                reverse=True
            )

            for item in ranked:
                art = str(item.get("artworkUrl100", "")).strip()
                if art:
                    return art.replace("100x100bb", "600x600bb").replace("100x100", "600x600")

        return ""

    def _best_deezer_cover(self, title: str, artist: str, album: str) -> str:
        normalized_title = self._sanitize_text(title)
        normalized_artist = self._sanitize_text(artist)
        normalized_album = self._sanitize_text(album)

        def score(item: Dict[str, Any]) -> int:
            points = 0
            track_name = self._sanitize_text(str(item.get("title", "")))
            artist_payload = item.get("artist", {})
            album_payload = item.get("album", {})
            artist_name = ""
            album_name = ""

            if isinstance(artist_payload, dict):
                artist_name = self._sanitize_text(str(artist_payload.get("name", "")))
            if isinstance(album_payload, dict):
                album_name = self._sanitize_text(str(album_payload.get("title", "")))

            if normalized_title and track_name == normalized_title:
                points += 8
            elif normalized_title and (normalized_title in track_name or track_name in normalized_title):
                points += 4

            if normalized_artist and artist_name == normalized_artist:
                points += 8
            elif normalized_artist and (normalized_artist in artist_name or artist_name in normalized_artist):
                points += 4

            if normalized_album and album_name == normalized_album:
                points += 5
            elif normalized_album and (normalized_album in album_name or album_name in normalized_album):
                points += 2

            if isinstance(album_payload, dict) and (
                album_payload.get("cover_xl")
                or album_payload.get("cover_big")
                or album_payload.get("cover_medium")
                or album_payload.get("cover")
            ):
                points += 2

            return points

        for term in self._cover_search_terms(title, artist, album):
            url = "https://api.deezer.com/search?limit=8&q=" + urllib.parse.quote(term)
            payload = self._http_json(url, timeout=3.0)
            results = payload.get("data", [])
            if not isinstance(results, list) or not results:
                continue

            ranked = sorted(
                [item for item in results if isinstance(item, dict)],
                key=score,
                reverse=True
            )

            for item in ranked:
                album_payload = item.get("album", {})
                if not isinstance(album_payload, dict):
                    continue

                for key in ("cover_xl", "cover_big", "cover_medium", "cover"):
                    art = str(album_payload.get(key, "")).strip()
                    if art:
                        return art

        return ""

    def _best_cover(self, title: str, artist: str, album: str) -> str:
        for provider in (self._best_itunes_cover, self._best_deezer_cover):
            try:
                cover_url = provider(title, artist, album)
                if cover_url:
                    return cover_url
            except Exception as exc:
                self._log(f"{provider.__name__} error: {exc}")

        return ""

    async def get_snapshot(self) -> Dict[str, Any]:
        try:
            data = self._request_json("/snapshot")
            if isinstance(data.get("selectedPlayer"), str) and data.get("selectedPlayer"):
                self.player = data["selectedPlayer"]
            return data
        except Exception as exc:
            self._log(f"get_snapshot error: {exc}")
            return {"selectedPlayer": "", "currentPlayer": "", "selected": None, "players": []}

    async def set_media_player(self, player: str) -> str:
        try:
            self.player = player or ""
            encoded = urllib.parse.quote(self.player, safe="")
            self._request_json(f"/select?player={encoded}", "POST")
            return self.player
        except Exception as exc:
            self._log(f"set_media_player error: {exc}")
            return ""

    async def get_cover(self, title: str, artist: str, album: str) -> str:
        try:
            title = (title or "").strip()
            artist = (artist or "").strip()
            album = (album or "").strip()

            if not title or title == "Non in riproduzione":
                return ""

            key = self._cover_key(title, artist, album)
            if not key:
                return ""

            cache = self._load_cover_cache()
            cached = cache.get(key, "")
            if cached:
                return cached

            cover_url = self._best_cover(title, artist, album)
            if cover_url:
                cache[key] = cover_url
                self._save_cover_cache()
                return cover_url

            return ""
        except Exception as exc:
            self._log(f"get_cover error: {exc}")
            return ""

    async def play_pause(self) -> str:
        try:
            result = self._request_json("/playpause", "POST")
            return "true" if result.get("ok", False) else "false"
        except Exception as exc:
            self._log(f"play_pause error: {exc}")
            return "false"

    async def next(self) -> str:
        try:
            result = self._request_json("/next", "POST")
            return "true" if result.get("ok", False) else "false"
        except Exception as exc:
            self._log(f"next error: {exc}")
            return "false"

    async def previous(self) -> str:
        try:
            result = self._request_json("/previous", "POST")
            return "true" if result.get("ok", False) else "false"
        except Exception as exc:
            self._log(f"previous error: {exc}")
            return "false"

    async def _open_music_app(self, app_key: str) -> str:
        try:
            return self._open_music_app_best_effort(app_key)
        except Exception as exc:
            self._log(f"open_{app_key} error: {exc}")
            return "false"

    async def open_spotify(self) -> str:
        return await self._open_music_app("spotify")

    async def open_tidal(self) -> str:
        return await self._open_music_app("tidal")

    async def open_apple_music(self) -> str:
        return await self._open_music_app("apple_music")

    async def open_deezer(self) -> str:
        return await self._open_music_app("deezer")

    async def open_amazon_music(self) -> str:
        return await self._open_music_app("amazon_music")

    async def open_soundcloud(self) -> str:
        return await self._open_music_app("soundcloud")

    async def shuffle(self) -> str:
        try:
            result = self._request_json("/shuffle", "POST")
            return "true" if result.get("ok", False) else "false"
        except Exception as exc:
            self._log(f"shuffle error: {exc}")
            return "false"

    async def repeat(self) -> str:
        try:
            result = self._request_json("/repeat", "POST")
            return "true" if result.get("ok", False) else "false"
        except Exception as exc:
            self._log(f"repeat error: {exc}")
            return "false"

    async def _main(self) -> None:
        self.plugin_dir = os.path.dirname(os.path.abspath(__file__))
        self.runtime_dir = self._resolve_runtime_dir()
        self.bundled_helper_dir = os.path.join(self.plugin_dir, "bin")
        self.bundled_helper_path = os.path.join(self.bundled_helper_dir, "MediaBridge.exe")
        self.helper_dir = self.bundled_helper_dir
        self.helper_path = self.bundled_helper_path
        self._log(f"plugin_dir={self.plugin_dir}")
        self._log(f"bundled_helper_path={self.bundled_helper_path}")
        try:
            self._ensure_helper()
            self._log(f"helper pronto: {self.helper_path}")
        except Exception as exc:
            self._log(f"startup error: {exc}")
    async def _unload(self) -> None:
        self._shutdown_helper()
