from __future__ import annotations

import json
import os
import tempfile
import re
import shutil
import socket
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from typing import Any, Callable, Dict, List, Optional, Tuple


class YouTubeMusicService:
    """Small ytmusicapi adapter with Now Playing-shaped responses."""

    def __init__(
        self,
        settings_dir: str,
        vendor_dir: str,
        logger,
        browser_launcher: Optional[Callable[[str, List[str], str], Dict[str, Any]]] = None,
        process_terminator: Optional[Callable[[int], bool]] = None,
    ) -> None:
        self.settings_dir = settings_dir
        self.vendor_dir = vendor_dir
        self.settings_path = os.path.join(settings_dir, "youtube-music.json")
        self.library_cache_path = os.path.join(settings_dir, "youtube-music-library-cache.json")
        self.browser_profile_dir = os.path.join(settings_dir, "youtube-music-browser-profile")
        self._logger = logger
        self._lock = threading.RLock()
        self._client: Any = None
        self._client_signature = ""
        self._cache: Dict[str, Tuple[float, Any]] = {}
        self._stream_cache: Dict[str, Dict[str, Any]] = {}
        self._stream_inflight: Dict[str, threading.Event] = {}
        self._browser_launcher = browser_launcher
        self._process_terminator = process_terminator
        self._browser_auth_lock = threading.RLock()
        self._browser_auth_cancel = threading.Event()
        self._browser_auth_thread: Optional[threading.Thread] = None
        self._browser_auth_pid = 0
        self._browser_auth_state: Dict[str, Any] = {
            "running": False,
            "phase": "idle",
            "error": "",
        }
        self.settings = self._load_settings()

    def _log(self, message: str) -> None:
        try:
            self._logger(message)
        except Exception:
            pass

    @staticmethod
    def _defaults() -> Dict[str, Any]:
        return {
            "auth": {},
            "profile": {},
            "audio_quality": "high",
            "compact_saved_tracks": False,
        }

    def _load_settings(self) -> Dict[str, Any]:
        result = self._defaults()
        try:
            if os.path.isfile(self.settings_path):
                with open(self.settings_path, "r", encoding="utf-8") as handle:
                    value = json.load(handle)
                if isinstance(value, dict):
                    result.update(value)
        except Exception as exc:
            self._log(f"YouTube Music settings load error: {exc}")
        if not isinstance(result.get("auth"), dict):
            result["auth"] = {}
        if not isinstance(result.get("profile"), dict):
            result["profile"] = {}
        quality = str(result.get("audio_quality") or "high").lower()
        result["audio_quality"] = quality if quality in {"low", "medium", "high"} else "high"
        result["compact_saved_tracks"] = bool(result.get("compact_saved_tracks", False))
        return result

    def _save_settings(self) -> None:
        os.makedirs(self.settings_dir, exist_ok=True)
        temporary = self.settings_path + ".tmp"
        with open(temporary, "w", encoding="utf-8") as handle:
            json.dump(self.settings, handle, ensure_ascii=False, indent=2)
        os.replace(temporary, self.settings_path)
        try:
            os.chmod(self.settings_path, 0o600)
        except Exception:
            pass

    def public_settings(self) -> Dict[str, Any]:
        profile = self.settings.get("profile") if isinstance(self.settings.get("profile"), dict) else {}
        return {
            "authenticated": bool(self.settings.get("auth")),
            "displayName": str(profile.get("accountName") or ""),
            "userId": str(profile.get("channelHandle") or ""),
            "avatar": str(profile.get("accountPhotoUrl") or ""),
            "audioQuality": str(self.settings.get("audio_quality") or "high"),
            "compactSavedTracks": bool(self.settings.get("compact_saved_tracks", False)),
        }

    @staticmethod
    def _normalize_browser_headers(headers_raw: str) -> str:
        lines = str(headers_raw or "").replace("\r\n", "\n").replace("\r", "\n").split("\n")
        normalized: List[str] = []
        skip_pseudo_value = False
        for line in lines:
            if skip_pseudo_value:
                skip_pseudo_value = False
                continue
            stripped = line.strip()
            if re.fullmatch(r":[a-z0-9-]+", stripped, flags=re.IGNORECASE):
                skip_pseudo_value = True
                continue
            normalized.append(line)
        return "\n".join(normalized).strip()

    @staticmethod
    def _browser_executable() -> str:
        candidates = [
            os.path.join(os.environ.get("PROGRAMFILES", ""), "Google", "Chrome", "Application", "chrome.exe"),
            os.path.join(os.environ.get("PROGRAMFILES(X86)", ""), "Google", "Chrome", "Application", "chrome.exe"),
            os.path.join(os.environ.get("LOCALAPPDATA", ""), "Google", "Chrome", "Application", "chrome.exe"),
            os.path.join(os.environ.get("PROGRAMFILES(X86)", ""), "Microsoft", "Edge", "Application", "msedge.exe"),
            os.path.join(os.environ.get("PROGRAMFILES", ""), "Microsoft", "Edge", "Application", "msedge.exe"),
        ]
        return next((path for path in candidates if path and os.path.isfile(path)), "")

    def _set_browser_auth_state(self, **changes: Any) -> None:
        with self._browser_auth_lock:
            self._browser_auth_state.update(changes)

    def browser_auth_status(self) -> Dict[str, Any]:
        with self._browser_auth_lock:
            state = dict(self._browser_auth_state)
        state["settings"] = self.public_settings()
        return state

    def start_browser_auth(self) -> Dict[str, Any]:
        with self._browser_auth_lock:
            if self._browser_auth_thread is not None and self._browser_auth_thread.is_alive():
                return self.browser_auth_status()
            browser = self._browser_executable()
            if not browser:
                raise RuntimeError("A supported browser was not found")
            self._browser_auth_cancel.clear()
            self._browser_auth_state = {"running": True, "phase": "opening", "error": ""}
            thread = threading.Thread(
                target=self._browser_auth_worker,
                args=(browser,),
                name="NowPlaying-YouTubeMusicAuth",
                daemon=True,
            )
            self._browser_auth_thread = thread
            thread.start()
        return self.browser_auth_status()

    def cancel_browser_auth(self) -> Dict[str, Any]:
        self._browser_auth_cancel.set()
        self._set_browser_auth_state(running=False, phase="cancelled")
        return self.browser_auth_status()

    def _browser_auth_worker(self, browser: str) -> None:
        profile_dir = self.browser_profile_dir
        profile_preexisting = os.path.isdir(profile_dir)
        os.makedirs(profile_dir, exist_ok=True)
        browser_process: Optional[subprocess.Popen] = None
        websocket_connection: Any = None
        launched_pid = 0
        authenticated = False
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
                probe.bind(("127.0.0.1", 0))
                port = int(probe.getsockname()[1])
            arguments = [
                f"--remote-debugging-port={port}",
                "--remote-debugging-address=127.0.0.1",
                "--remote-allow-origins=*",
                f"--user-data-dir={profile_dir}",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-background-mode",
                "--new-window",
                "https://accounts.google.com/ServiceLogin?service=youtube&continue=https%3A%2F%2Fmusic.youtube.com%2F",
            ]
            if self._browser_launcher is not None:
                launched = self._browser_launcher(browser, arguments, os.path.dirname(browser))
                if not launched.get("ok"):
                    raise RuntimeError(str(launched.get("error") or "Unable to open the browser"))
                launched_pid = int(launched.get("pid") or 0)
            else:
                browser_process = subprocess.Popen(
                    [browser, *arguments],
                    cwd=os.path.dirname(browser),
                    stdin=subprocess.DEVNULL,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                )
                launched_pid = int(browser_process.pid or 0)
            self._browser_auth_pid = launched_pid
            self._set_browser_auth_state(phase="waitingForLogin")
            self._ensure_imports()
            import websocket
            from ytmusicapi.helpers import get_authorization

            command_id = 0
            current_target_id = ""
            current_target_url = ""
            pending_cookie_commands: set[int] = set()
            last_target_check = 0.0
            last_cookie_check = 0.0
            last_connect_attempt = 0.0
            last_targets_seen = 0.0
            last_connection_error = ""

            def load_targets() -> List[Dict[str, Any]]:
                try:
                    with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list", timeout=0.6) as response:
                        loaded = json.loads(response.read().decode("utf-8", errors="replace"))
                    return [item for item in loaded if isinstance(item, dict) and item.get("type") == "page"] if isinstance(loaded, list) else []
                except Exception:
                    return []

            def preferred_target(targets: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
                usable = [item for item in targets if item.get("webSocketDebuggerUrl")]
                if not usable:
                    return None
                return next((item for item in usable if "music.youtube.com" in str(item.get("url") or "")), None) or next(
                    (item for item in usable if "google.com" in str(item.get("url") or "")), None
                ) or usable[0]

            def close_connection() -> None:
                nonlocal websocket_connection, current_target_id, current_target_url
                if websocket_connection is not None:
                    try:
                        websocket_connection.close()
                    except Exception:
                        pass
                websocket_connection = None
                current_target_id = ""
                current_target_url = ""
                pending_cookie_commands.clear()

            def send(method: str, params: Optional[Dict[str, Any]] = None) -> int:
                nonlocal command_id
                command_id += 1
                websocket_connection.send(json.dumps({"id": command_id, "method": method, "params": params or {}}))
                return command_id

            auth_deadline = time.monotonic() + 180.0
            while time.monotonic() < auth_deadline and not self._browser_auth_cancel.is_set():
                if browser_process is not None and browser_process.poll() is not None:
                    raise RuntimeError("The YouTube Music sign-in window was closed")

                now = time.monotonic()
                if now - last_target_check >= 0.5:
                    targets = load_targets()
                    last_target_check = now
                    if targets:
                        last_targets_seen = now
                    target = preferred_target(targets)
                    target_id = str(target.get("id") or "") if target else ""
                    target_url = str(target.get("url") or "") if target else ""
                    should_switch = bool(
                        target
                        and target_id != current_target_id
                        and (websocket_connection is None or "music.youtube.com" in target_url or not current_target_id)
                    )
                    if should_switch:
                        close_connection()
                        try:
                            websocket_connection = websocket.create_connection(
                                str(target["webSocketDebuggerUrl"]),
                                timeout=0.45,
                                origin=f"http://127.0.0.1:{port}",
                            )
                            current_target_id = target_id
                            current_target_url = target_url
                            send("Network.enable", {"maxTotalBufferSize": 0, "maxResourceBufferSize": 0})
                            send("Page.enable")
                            last_connection_error = ""
                        except Exception as exc:
                            last_connection_error = f"{type(exc).__name__}: {exc}"
                            close_connection()

                if websocket_connection is None:
                    if last_targets_seen and now - last_targets_seen > 3.0:
                        raise RuntimeError("The YouTube Music sign-in window was closed")
                    time.sleep(0.12)
                    continue

                if now - last_cookie_check >= 0.75:
                    try:
                        cookie_command = send(
                            "Network.getCookies",
                            {"urls": ["https://music.youtube.com/", "https://www.youtube.com/"]},
                        )
                        pending_cookie_commands.add(cookie_command)
                        last_cookie_check = now
                    except Exception as exc:
                        last_connection_error = f"{type(exc).__name__}: {exc}"
                        close_connection()
                        continue

                try:
                    message = json.loads(websocket_connection.recv())
                except websocket.WebSocketTimeoutException:
                    continue
                except (websocket.WebSocketConnectionClosedException, ConnectionError, OSError) as exc:
                    last_connection_error = f"{type(exc).__name__}: {exc}"
                    close_connection()
                    continue

                response_id = int(message.get("id") or 0)
                if response_id not in pending_cookie_commands:
                    continue
                pending_cookie_commands.discard(response_id)
                result = message.get("result") if isinstance(message.get("result"), dict) else {}
                cookies = result.get("cookies") if isinstance(result.get("cookies"), list) else []
                cookie_values: Dict[str, str] = {}
                for cookie in cookies:
                    if not isinstance(cookie, dict):
                        continue
                    name = str(cookie.get("name") or "")
                    value = str(cookie.get("value") or "")
                    domain = str(cookie.get("domain") or "").lstrip(".").lower()
                    if name and value and (domain.endswith("youtube.com") or domain.endswith("google.com")):
                        cookie_values[name] = value
                sapisid = cookie_values.get("__Secure-3PAPISID", "")
                if not sapisid or time.monotonic() - last_connect_attempt < 1.5:
                    continue
                last_connect_attempt = time.monotonic()
                cookie_header = "; ".join(f"{name}={value}" for name, value in sorted(cookie_values.items()))
                origin = "https://music.youtube.com"
                authorization = get_authorization(f"{sapisid} {origin}")
                headers = {
                    "authorization": authorization,
                    "cookie": cookie_header,
                    "origin": origin,
                    "x-goog-authuser": "0",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                }
                try:
                    self.connect("\n".join(f"{key}: {value}" for key, value in headers.items()))
                    authenticated = True
                    break
                except Exception as exc:
                    last_connection_error = f"{type(exc).__name__}: {exc}"

            if self._browser_auth_cancel.is_set():
                self._set_browser_auth_state(running=False, phase="cancelled")
                return
            if not authenticated:
                suffix = f" ({last_connection_error})" if last_connection_error else ""
                raise RuntimeError(f"YouTube Music sign-in timed out{suffix}")
            self._set_browser_auth_state(running=False, phase="connected", error="")
        except Exception as exc:
            if not self._browser_auth_cancel.is_set():
                self._log(f"YouTube Music automatic authentication error: {type(exc).__name__}: {exc}")
                self._set_browser_auth_state(running=False, phase="error", error=str(exc))
        finally:
            if websocket_connection is not None:
                try:
                    websocket_connection.send(json.dumps({"id": 999999, "method": "Browser.close"}))
                except Exception:
                    pass
                try:
                    websocket_connection.close()
                except Exception:
                    pass
            if browser_process is not None:
                try:
                    browser_process.wait(timeout=3.0)
                except Exception:
                    try:
                        browser_process.terminate()
                    except Exception:
                        pass
            elif launched_pid and self._process_terminator is not None:
                time.sleep(0.4)
                self._process_terminator(launched_pid)
            self._browser_auth_pid = 0
            if not authenticated and not profile_preexisting:
                for _ in range(8):
                    try:
                        shutil.rmtree(profile_dir)
                        break
                    except Exception:
                        time.sleep(0.25)


    def _ensure_imports(self) -> None:
        if self.vendor_dir and self.vendor_dir not in sys.path:
            sys.path.insert(0, self.vendor_dir)
        # Minimal embedded runtimes (Decky) ship a partial standard library.
        # yt-dlp and ytmusicapi need a few pure-Python packages that may be
        # missing submodules; activate the vendored copies for each.
        self._ensure_stdlib_package("xml", "xml.etree.ElementTree")
        self._ensure_stdlib_package("html", "html.parser")

    def _ensure_stdlib_package(self, package_name: str, probe_module: str) -> None:
        """Make a vendored pure-Python stdlib package importable.

        Some Decky Python runtimes expose a partial package (e.g. ``xml`` or
        ``html``) that exists but misses submodules such as ``xml.etree`` or
        ``html.parser``. Because the partial package is resolved first, simply
        placing a vendored copy on ``sys.path`` never helps. Two strategies are
        tried: first extend the existing package's ``__path__`` (keeps whatever
        stdlib parts exist); if that still fails — for example because the
        partial ``__init__`` also misses attributes such as ``html.unescape`` —
        fully replace the package with the complete vendored copy.
        """
        try:
            __import__(probe_module)
            return
        except Exception:
            pass
        vendor_pkg = os.path.join(self.vendor_dir, package_name) if self.vendor_dir else ""
        if not vendor_pkg or not os.path.isdir(vendor_pkg):
            return
        import importlib

        # Attempt 1: extend the partial package's search path.
        try:
            package = sys.modules.get(package_name) or importlib.import_module(package_name)
            package_paths = getattr(package, "__path__", None)
            if package_paths is not None and vendor_pkg not in list(package_paths):
                try:
                    package_paths.append(vendor_pkg)
                except Exception:
                    package.__path__ = [*list(package_paths), vendor_pkg]  # type: ignore[attr-defined]
            importlib.invalidate_caches()
            __import__(probe_module)
            self._log(f"YouTube Music: vendored {probe_module} activated (path extension)")
            return
        except Exception:
            pass

        # Attempt 2: fully replace the partial package with the vendored copy.
        try:
            if self.vendor_dir in sys.path:
                sys.path.remove(self.vendor_dir)
            sys.path.insert(0, self.vendor_dir)
            for module_name in [name for name in list(sys.modules) if name == package_name or name.startswith(f"{package_name}.")]:
                sys.modules.pop(module_name, None)
            importlib.invalidate_caches()
            __import__(probe_module)
            self._log(f"YouTube Music: vendored {probe_module} activated (full replacement)")
        except Exception as exc:
            self._log(f"YouTube Music: unable to activate vendored {probe_module}: {type(exc).__name__}: {exc}")

    def _client_for_request(self, authenticated: Optional[bool] = None):
        self._ensure_imports()
        from ytmusicapi import YTMusic

        auth = self.settings.get("auth") if isinstance(self.settings.get("auth"), dict) else {}
        use_auth = bool(auth) if authenticated is None else bool(auth) and authenticated
        signature = json.dumps(auth, sort_keys=True, ensure_ascii=False) if use_auth else "public"
        with self._lock:
            if self._client is None or self._client_signature != signature:
                self._client = YTMusic(auth if use_auth else None, language="en", location="IT")
                self._client_signature = signature
            return self._client


    def _is_oauth(self) -> bool:
        return bool(self.settings.get("oauth"))

    def _has_auth(self) -> bool:
        return bool(self.settings.get("auth")) or bool(self.settings.get("oauth"))

    def _request_context(self, client):
        """Context manager for authenticated browse requests.

        YouTube's WEB_REMIX client only accepts SAPISID-cookie auth and rejects
        OAuth bearer tokens on browse/search/home with a 400 "Request contains
        an invalid argument". The ANDROID_MUSIC client (ytmusicapi's
        ``as_mobile``) accepts the OAuth bearer, so all OAuth-authenticated
        requests run in that context. Public and cookie (browser) auth keep the
        default web client.
        """
        import contextlib

        if self._is_oauth() and hasattr(client, "as_mobile"):
            return client.as_mobile()
        return contextlib.nullcontext()

    def connect(self, headers_raw: str) -> Dict[str, Any]:
        # Chromium uses CRLF, separate name/value lines and HTTP/2 pseudo-header
        # pairs. ytmusicapi accepts the first two but misreads pseudo values.
        value = self._normalize_browser_headers(headers_raw)
        if not value:
            raise RuntimeError("Paste the YouTube Music request headers first")
        self._ensure_imports()
        from ytmusicapi import setup

        auth_text = setup(headers_raw=value)
        auth = json.loads(auth_text) if isinstance(auth_text, str) else auth_text
        if not isinstance(auth, dict) or not auth:
            raise RuntimeError("YouTube Music returned invalid authentication data")
        with self._lock:
            self.settings["auth"] = auth
            self._client = None
            self._client_signature = ""
            profile = self._client_for_request(True).get_account_info()
            self.settings["profile"] = profile if isinstance(profile, dict) else {}
            self._cache.clear()
            self._save_settings()
        return self.public_settings()

    def disconnect(self) -> Dict[str, Any]:
        self.cancel_browser_auth()
        with self._lock:
            self.settings["auth"] = {}
            self.settings["profile"] = {}
            self._client = None
            self._client_signature = ""
            self._cache.clear()
            self._stream_cache.clear()
            self._save_settings()
        try:
            if os.path.isdir(self.browser_profile_dir):
                shutil.rmtree(self.browser_profile_dir)
        except Exception as exc:
            self._log(f"YouTube Music browser profile cleanup error: {exc}")
        return self.public_settings()


    def set_audio_quality(self, quality: str) -> Dict[str, Any]:
        normalized = str(quality or "high").lower()
        if normalized not in {"low", "medium", "high"}:
            normalized = "high"
        with self._lock:
            self.settings["audio_quality"] = normalized
            self._stream_cache.clear()
            self._save_settings()
        return self.public_settings()

    def set_compact_saved_tracks(self, enabled: bool) -> Dict[str, Any]:
        self.settings["compact_saved_tracks"] = bool(enabled)
        self._save_settings()
        return self.public_settings()

    def clear_cache(self) -> Dict[str, int]:
        with self._lock:
            entries = len(self._cache) + len(self._stream_cache)
            self._cache.clear()
            self._stream_cache.clear()
            try:
                if os.path.isfile(self.library_cache_path):
                    os.remove(self.library_cache_path)
                    entries += 1
            except Exception as exc:
                self._log(f"YouTube Music library cache cleanup error: {exc}")
        return {"entries": entries}

    def _read_library_cache(self) -> Dict[str, Any]:
        try:
            if os.path.isfile(self.library_cache_path):
                with open(self.library_cache_path, "r", encoding="utf-8") as handle:
                    value = json.load(handle)
                return value if isinstance(value, dict) else {}
        except Exception as exc:
            self._log(f"YouTube Music library cache read error: {exc}")
        return {}

    def _write_library_cache(self, section: str, payload: Dict[str, Any], complete: bool) -> None:
        try:
            cache = self._read_library_cache()
            cache[str(section)] = {
                "complete": bool(complete),
                "updatedAt": time.time(),
                "payload": payload,
            }
            os.makedirs(os.path.dirname(self.library_cache_path), exist_ok=True)
            temporary = self.library_cache_path + f".{os.getpid()}.tmp"
            with open(temporary, "w", encoding="utf-8") as handle:
                json.dump(cache, handle, ensure_ascii=False, separators=(",", ":"))
            os.replace(temporary, self.library_cache_path)
        except Exception as exc:
            self._log(f"YouTube Music library cache write error: {exc}")

    def _cached(self, key: str, ttl: float, producer):
        now = time.monotonic()
        with self._lock:
            cached = self._cache.get(key)
            if cached and now - cached[0] <= ttl:
                return cached[1]
        value = producer()
        with self._lock:
            if len(self._cache) >= 180:
                oldest = sorted(self._cache.items(), key=lambda item: item[1][0])[:40]
                for cache_key, _ in oldest:
                    self._cache.pop(cache_key, None)
            self._cache[key] = (now, value)
        return value

    @staticmethod
    def _images(value: Any) -> List[Dict[str, Any]]:
        thumbnails: Any = value if isinstance(value, list) else []
        if isinstance(value, dict):
            thumbnails = value.get("thumbnails") or value.get("thumbnail") or []
            if isinstance(thumbnails, dict):
                thumbnails = thumbnails.get("thumbnails") or []
        if not isinstance(thumbnails, list):
            return []
        result: List[Dict[str, Any]] = []
        seen: set[str] = set()
        for image in thumbnails:
            if not isinstance(image, dict) or not str(image.get("url") or "").strip():
                continue
            original_url = str(image.get("url") or "").strip()
            try:
                width = max(0, int(image.get("width") or 0))
                height = max(0, int(image.get("height") or 0))
            except Exception:
                width = 0
                height = 0
            target_width = 1200
            target_height = 1200
            if width > 0 and height > 0:
                scale = 1200.0 / max(width, height)
                target_width = max(1, int(round(width * scale)))
                target_height = max(1, int(round(height * scale)))
            url = original_url
            if any(host in original_url.lower() for host in ("googleusercontent.com", "ggpht.com")):
                size = f"w{target_width}-h{target_height}"
                if re.search(r"=w\d+(?:-c)?-h\d+", url):
                    url = re.sub(r"=w\d+(?:-c)?-h\d+", f"={size}", url, count=1)
                elif re.search(r"=s\d+", url):
                    url = re.sub(r"=s\d+", "=s1200", url, count=1)
                    target_width = 1200
                    target_height = 1200
                elif "=" not in url.rsplit("/", 1)[-1]:
                    url = f"{url}={size}-l90-rj"
                else:
                    url = re.sub(r"w\d+-h\d+", size, url, count=1)
            if url in seen:
                continue
            seen.add(url)
            result.append({
                "url": url,
                "width": target_width if url != original_url else width,
                "height": target_height if url != original_url else height,
            })
        return result

    @staticmethod
    def _artists(value: Any) -> List[Dict[str, str]]:
        artists = value.get("artists") if isinstance(value, dict) else []
        if not isinstance(artists, list):
            artists = []
        result = [
            {"name": str(artist.get("name") or "").strip(), "id": str(artist.get("id") or "").strip()}
            for artist in artists
            if isinstance(artist, dict) and str(artist.get("name") or "").strip()
        ]
        if result:
            return result
        artist = value.get("artist") if isinstance(value, dict) else None
        if isinstance(artist, dict):
            name = str(artist.get("name") or artist.get("title") or "").strip()
            return [{"name": name, "id": str(artist.get("id") or "").strip()}] if name else []
        name = str(artist or "").strip()
        return [{"name": name, "id": ""}] if name else []

    @staticmethod
    def _display_text(value: Any) -> str:
        if isinstance(value, dict):
            return str(value.get("name") or value.get("title") or value.get("text") or "").strip()
        if isinstance(value, list):
            parts = [YouTubeMusicService._display_text(item) for item in value]
            return ", ".join(part for part in parts if part)
        return str(value or "").strip()

    @staticmethod
    def _duration_ms(value: Any) -> int:
        if not isinstance(value, dict):
            return 0
        try:
            if value.get("duration_seconds") is not None:
                return max(0, int(float(value.get("duration_seconds") or 0) * 1000))
        except Exception:
            pass
        text = str(value.get("duration") or "")
        if re.fullmatch(r"\d+(?::\d+){1,2}", text):
            total = 0
            for part in text.split(":"):
                total = total * 60 + int(part)
            return total * 1000
        return 0

    def normalize_item(self, value: Any, forced_type: str = "") -> Optional[Dict[str, Any]]:
        if not isinstance(value, dict):
            return None
        result_type = str(forced_type or value.get("resultType") or value.get("type") or "").lower()
        video_id = str(value.get("videoId") or "").strip()
        browse_id = str(value.get("browseId") or value.get("playlistId") or value.get("id") or "").strip()
        artists = self._artists(value)
        title = self._display_text(value.get("title") or value.get("name") or value.get("artist"))
        if result_type in {"artist", "profile"} and not title and artists:
            title = str(artists[0].get("name") or "").strip()
        if result_type in {"artist", "profile"} and not browse_id and artists:
            browse_id = str(artists[0].get("id") or "").strip()
        if video_id or result_type in {"song", "video", "track"}:
            if not video_id or not title:
                return None
            album_value = value.get("album") if isinstance(value.get("album"), dict) else {}
            album = {
                "id": str(album_value.get("id") or ""),
                "name": str(album_value.get("name") or ""),
                "images": self._images(value),
            }
            return {
                "id": video_id,
                "uri": f"ytmusic:track:{video_id}",
                "type": "track",
                "name": title,
                "duration_ms": self._duration_ms(value),
                "artists": artists,
                "album": album,
                "images": self._images(value),
                "sourceKey": "youtubeMusic",
                "videoId": video_id,
                "is_saved": bool(value.get("inLibrary")),
            }
        if result_type in {"album", "single"} or browse_id.startswith("MPRE"):
            kind = "album"
        elif result_type in {"artist", "profile"} or browse_id.startswith("UC"):
            kind = "artist"
        else:
            kind = "playlist"
        if not browse_id or not title:
            return None
        return {
            "id": browse_id,
            "uri": f"ytmusic:{kind}:{browse_id}",
            "type": kind,
            "name": title,
            "description": self._display_text(value.get("description")),
            "artists": artists,
            "images": self._images(value),
            "release_date": str(value.get("year") or ""),
            "owner": {"display_name": self._display_text(value.get("author") or value.get("owner"))},
        }

    def _normalize_many(self, values: Any, forced_type: str = "") -> List[Dict[str, Any]]:
        if not isinstance(values, list):
            return []
        return [item for item in (self.normalize_item(value, forced_type) for value in values) if item]

    def _collect_new_releases(self, client: Any, max_total: int = 40) -> List[Dict[str, Any]]:
        """Public 'New albums & singles' shelf — no authentication required."""
        try:
            with self._request_context(client):
                explore = client.get_explore()
            releases = explore.get("new_releases", []) if isinstance(explore, dict) else []
            return self._normalize_many(releases, "album")[:max_total]
        except Exception as exc:
            self._log(f"YouTube Music new releases unavailable: {exc}")
            return []

    def get_home(self) -> Dict[str, Any]:
        client = self._client_for_request()

        def produce() -> Dict[str, Any]:
            with self._request_context(client):
                shelves = client.get_home(limit=8)
            normalized_shelves = []
            for shelf in shelves if isinstance(shelves, list) else []:
                if not isinstance(shelf, dict):
                    continue
                items = self._normalize_many(shelf.get("contents"))
                if items:
                    normalized_shelves.append({"title": str(shelf.get("title") or ""), "items": items})
            playlists: List[Dict[str, Any]] = []
            if self._has_auth():
                try:
                    with self._request_context(client):
                        library_playlists = client.get_library_playlists(limit=30)
                    playlists = self._normalize_many(library_playlists, "playlist")
                except Exception as exc:
                    self._log(f"YouTube Music playlists unavailable: {exc}")
            if not playlists:
                playlists = [item for shelf in normalized_shelves for item in shelf["items"] if item.get("type") == "playlist"][:30]
            new_releases = self._collect_new_releases(client)
            return {
                "playlists": {"items": playlists},
                # Both fields intentionally point at the official new-albums shelf.
                # Older frontends read `newForYou`; newer ones use `newReleases`.
                "newForYou": {"items": new_releases},
                "newReleases": {"items": new_releases},
                "sections": normalized_shelves,
            }

        return self._cached("home", 300.0, produce)

    def search(self, query: str) -> Dict[str, Any]:
        cleaned = str(query or "").strip()[:180]
        if len(cleaned) < 2:
            return {"tracks": {"items": []}, "albums": {"items": []}, "artists": {"items": []}, "playlists": {"items": []}}
        client = self._client_for_request()

        def produce() -> Dict[str, Any]:
            # Unfiltered search shelves label the first flex column with the
            # result type ("Song", "Video"), which ytmusicapi surfaces as a fake
            # artist. Filtered searches return clean per-category metadata.
            searches = {
                "tracks": ("songs", "track"),
                "albums": ("albums", "album"),
                "artists": ("artists", "artist"),
                "playlists": ("playlists", "playlist"),
            }
            groups: Dict[str, List[Dict[str, Any]]] = {}
            for key, (search_filter, forced_type) in searches.items():
                try:
                    with self._request_context(client):
                        values = client.search(cleaned, filter=search_filter, limit=20)
                except Exception as exc:
                    self._log(f"YouTube Music search ({search_filter}) error: {type(exc).__name__}: {exc}")
                    values = []
                groups[key] = self._normalize_many(values, forced_type)[:20]
            return {key: {"items": items} for key, items in groups.items()}

        return self._cached(f"search:{cleaned.casefold()}", 180.0, produce)

    def get_library(self, section: str, max_items: int = 100) -> Dict[str, Any]:
        if not self._has_auth():
            return {"artists": {"items": []}} if section == "artists" else {"items": []}
        client = self._client_for_request(True)
        requested = int(max_items if max_items is not None else 100)
        load_all = requested <= 0
        limit: Optional[int] = None if load_all else max(1, min(requested or 100, 300))
        section = str(section or "tracks")

        def produce() -> Dict[str, Any]:
            cached = self._read_library_cache().get(section)
            if isinstance(cached, dict) and isinstance(cached.get("payload"), dict):
                payload = json.loads(json.dumps(cached.get("payload")))
                if load_all and cached.get("complete"):
                    return payload
                if not load_all:
                    container = payload.get("artists") if section == "artists" else payload
                    if isinstance(container, dict) and isinstance(container.get("items"), list):
                        container["items"] = container["items"][:int(limit or 100)]
                        return payload
            with self._request_context(client):
                if section == "tracks":
                    raw = client.get_library_songs(limit=limit)
                    forced = "track"
                elif section == "albums":
                    raw = client.get_library_albums(limit=limit)
                    forced = "album"
                elif section == "artists":
                    raw = client.get_library_artists(limit=limit)
                    forced = "artist"
                elif section == "playlists":
                    raw = client.get_library_playlists(limit=limit)
                    forced = "playlist"
                else:
                    raw = []
                    forced = "track"
            items = self._normalize_many(raw, forced)
            payload = {"artists": {"items": items}} if section == "artists" else {"items": items}
            self._write_library_cache(section, payload, load_all)
            return payload

        return self._cached(f"library:{section}:{'all' if load_all else limit}", 360.0, produce)

    def get_detail(self, kind: str, item_id: str) -> Dict[str, Any]:
        kind = str(kind or "").lower()
        item_id = str(item_id or "").strip()
        if kind not in {"album", "playlist", "artist"} or not item_id:
            raise RuntimeError("Invalid YouTube Music item")
        client = self._client_for_request()

        def backfill_cover(tracks: List[Dict[str, Any]], cover_images: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
            # Album and playlist tracks usually carry no per-track thumbnail;
            # they share the album/playlist art. Without this the fullscreen and
            # top-bar cover for the playing track fell back to a low-resolution
            # lookup. Give every track the high-resolution parent artwork.
            if not cover_images:
                return tracks
            for track in tracks:
                if not track.get("images"):
                    track["images"] = list(cover_images)
                album = track.get("album") if isinstance(track.get("album"), dict) else None
                if isinstance(album, dict) and not album.get("images"):
                    album["images"] = list(cover_images)
            return tracks

        def produce() -> Dict[str, Any]:
            if kind == "album":
                with self._request_context(client):
                    value = client.get_album(item_id)
                item = self.normalize_item({**value, "browseId": item_id, "resultType": "album"})
                cover = item.get("images") if isinstance(item, dict) else []
                tracks = backfill_cover(self._normalize_many(value.get("tracks") if isinstance(value, dict) else [], "track"), cover or [])
                return {"kind": kind, "item": item, "tracks": tracks, "albums": []}
            if kind == "playlist":
                stripped = item_id[2:] if item_id.startswith("VL") else item_id
                is_podcast = stripped.startswith("MPSP") or item_id.startswith("MPSP")
                if not is_podcast:
                    try:
                        with self._request_context(client):
                            value = client.get_playlist(item_id, limit=200)
                        item = self.normalize_item({**value, "playlistId": item_id, "resultType": "playlist"})
                        cover = item.get("images") if isinstance(item, dict) else []
                        tracks = backfill_cover(self._normalize_many(value.get("tracks") if isinstance(value, dict) else [], "track"), cover or [])
                        return {"kind": kind, "item": item, "tracks": tracks, "albums": []}
                    except Exception as exc:
                        # Podcast shows are returned by the playlist endpoint but use a
                        # different renderer that get_playlist cannot parse; retry as a
                        # podcast before giving up.
                        self._log(f"YouTube Music playlist {item_id} not a standard playlist, trying podcast: {exc}")
                        is_podcast = True
                if is_podcast:
                    with self._request_context(client):
                        value = client.get_podcast(stripped, limit=200)
                    item = self.normalize_item({**value, "playlistId": item_id, "resultType": "playlist"})
                    cover = item.get("images") if isinstance(item, dict) else []
                    episodes = value.get("episodes") if isinstance(value, dict) else []
                    tracks = backfill_cover(self._normalize_many(episodes, "track"), cover or [])
                    podcast_title = str(value.get("title") or "") if isinstance(value, dict) else ""
                    for episode in tracks:
                        episode["isPodcast"] = True
                        album = episode.get("album") if isinstance(episode.get("album"), dict) else {}
                        if podcast_title and not album.get("name"):
                            episode.setdefault("album", {})["name"] = podcast_title
                    return {"kind": kind, "item": item, "tracks": tracks, "albums": []}
            with self._request_context(client):
                value = client.get_artist(item_id)
            item = self.normalize_item({**value, "browseId": item_id, "resultType": "artist"})
            tracks = self._normalize_many(value.get("songs", {}).get("results", []) if isinstance(value.get("songs"), dict) else [], "track")
            album_values = value.get("albums", {}).get("results", []) if isinstance(value.get("albums"), dict) else []
            single_values = value.get("singles", {}).get("results", []) if isinstance(value.get("singles"), dict) else []
            albums = self._normalize_many([*album_values, *single_values], "album")
            return {
                "kind": kind,
                "item": item,
                "tracks": tracks,
                "albums": albums,
                "backgroundImage": (self._images(value) or [{"url": ""}])[-1]["url"],
                "backgroundFallbackImage": (self._images(value) or [{"url": ""}])[-1]["url"],
            }

        return self._cached(f"detail:{kind}:{item_id}", 600.0, produce)

    def _cookie_header(self) -> str:
        auth = self.settings.get("auth") if isinstance(self.settings.get("auth"), dict) else {}
        for key in ("Cookie", "cookie"):
            if str(auth.get(key) or "").strip():
                return str(auth.get(key) or "").strip()
        return ""

    @staticmethod
    def _best_stream_thumbnail(info: Dict[str, Any]) -> str:
        """Pick the sharpest square cover from yt-dlp's thumbnail list.

        YouTube Music search thumbnails are tiny (60 px) and upscaling them for
        the fullscreen cover looks pixelated. yt-dlp exposes the full-resolution
        square album art, which is preferred here for the playing track.
        """
        thumbnails = info.get("thumbnails") if isinstance(info.get("thumbnails"), list) else []
        best_url = ""
        best_score = -1.0
        for thumb in thumbnails:
            if not isinstance(thumb, dict):
                continue
            url = str(thumb.get("url") or "").strip()
            if not url.startswith("http"):
                continue
            try:
                width = float(thumb.get("width") or 0)
                height = float(thumb.get("height") or 0)
            except Exception:
                width = height = 0.0
            area = width * height
            # Strongly prefer square art (album covers) over 16:9 video frames.
            squareness = 1.0 if width > 0 and height > 0 and abs(width - height) <= max(width, height) * 0.06 else 0.35
            score = area * squareness
            if score > best_score:
                best_score = score
                best_url = url
        if not best_url:
            best_url = str(info.get("thumbnail") or "").strip()
        # Google-hosted square art can be requested at a crisp higher resolution.
        if any(host in best_url.lower() for host in ("googleusercontent.com", "ggpht.com", "ytimg.com")):
            best_url = re.sub(r"=w\d+-h\d+(?:-[a-z0-9-]+)?", "=w1200-h1200-l90-rj", best_url, count=1)
            best_url = re.sub(r"=s\d+", "=s1200", best_url, count=1)
        return best_url

    @staticmethod
    def _song_thumbnail(song: Dict[str, Any]) -> str:
        details = song.get("videoDetails") if isinstance(song.get("videoDetails"), dict) else {}
        thumbnail = details.get("thumbnail") if isinstance(details.get("thumbnail"), dict) else {}
        values = thumbnail.get("thumbnails") if isinstance(thumbnail.get("thumbnails"), list) else []
        best = ""
        best_area = -1
        for value in values:
            if not isinstance(value, dict):
                continue
            url = str(value.get("url") or "").strip()
            if not url.startswith("http"):
                continue
            try:
                area = int(value.get("width") or 0) * int(value.get("height") or 0)
            except Exception:
                area = 0
            if area >= best_area:
                best_area = area
                best = url
        if any(host in best.lower() for host in ("googleusercontent.com", "ggpht.com", "ytimg.com")):
            best = re.sub(r"=w\d+-h\d+(?:-[a-z0-9-]+)?", "=w1200-h1200-l90-rj", best, count=1)
            best = re.sub(r"=s\d+", "=s1200", best, count=1)
        return best

    def _resolve_stream_from_song_api(
        self,
        clean_id: str,
        quality: str,
        request_headers: Dict[str, str],
        now: float,
    ) -> Dict[str, Any]:
        """Resolve a playable URL through YouTube Music's player response.

        This is much faster than starting yt-dlp for every selection and avoids
        the visible metadata/audio gap. Some videos expose only ciphered formats;
        those are intentionally rejected so the yt-dlp fallback can decipher them.
        """
        client = self._client_for_request()
        with self._request_context(client):
            song = client.get_song(clean_id)
        if not isinstance(song, dict):
            raise RuntimeError("empty player response")
        playability = song.get("playabilityStatus") if isinstance(song.get("playabilityStatus"), dict) else {}
        status = str(playability.get("status") or "").upper()
        if status and status != "OK":
            reason = str(playability.get("reason") or status)
            raise RuntimeError(reason)

        streaming = song.get("streamingData") if isinstance(song.get("streamingData"), dict) else {}
        raw_formats: List[Dict[str, Any]] = []
        for key in ("adaptiveFormats", "formats"):
            values = streaming.get(key)
            if isinstance(values, list):
                raw_formats.extend(value for value in values if isinstance(value, dict))

        candidates: List[Dict[str, Any]] = []
        for value in raw_formats:
            url = str(value.get("url") or "").strip()
            mime = str(value.get("mimeType") or "").lower()
            if not url.startswith("http") or not mime.startswith("audio/"):
                continue
            if value.get("drmFamilies") or value.get("drmTrackType"):
                continue
            try:
                bitrate = int(value.get("averageBitrate") or value.get("bitrate") or 0)
            except Exception:
                bitrate = 0
            candidate = dict(value)
            candidate["_bitrate"] = bitrate
            candidates.append(candidate)
        if not candidates:
            raise RuntimeError("player response contained no direct audio URL")

        candidates.sort(key=lambda value: int(value.get("_bitrate") or 0))
        if quality == "low":
            eligible = [value for value in candidates if int(value.get("_bitrate") or 0) <= 112000]
            selected = eligible[-1] if eligible else candidates[0]
        elif quality == "medium":
            eligible = [value for value in candidates if int(value.get("_bitrate") or 0) <= 192000]
            selected = eligible[-1] if eligible else candidates[min(len(candidates) - 1, len(candidates) // 2)]
        else:
            selected = candidates[-1]

        details = song.get("videoDetails") if isinstance(song.get("videoDetails"), dict) else {}
        microformat = song.get("microformat") if isinstance(song.get("microformat"), dict) else {}
        player_microformat = microformat.get("playerMicroformatRenderer") if isinstance(microformat.get("playerMicroformatRenderer"), dict) else {}
        try:
            duration_ms = int(selected.get("approxDurationMs") or 0)
        except Exception:
            duration_ms = 0
        if duration_ms <= 0:
            try:
                duration_ms = int(float(details.get("lengthSeconds") or 0) * 1000)
            except Exception:
                duration_ms = 0
        try:
            expires_seconds = int(streaming.get("expiresInSeconds") or 14400)
        except Exception:
            expires_seconds = 14400
        expires_seconds = max(300, min(expires_seconds, 21600))
        mime_type = str(selected.get("mimeType") or "audio/mp4").split(";", 1)[0].strip()
        return {
            "url": str(selected.get("url") or ""),
            "headers": {
                **request_headers,
                "Referer": "https://music.youtube.com/",
                "Origin": "https://music.youtube.com",
            },
            "contentType": mime_type or "audio/mp4",
            "expiresAt": now + expires_seconds,
            "durationMs": duration_ms,
            "title": str(details.get("title") or ""),
            "artist": str(details.get("author") or ""),
            "album": str(player_microformat.get("album") or ""),
            "thumbnail": self._song_thumbnail(song),
            "resolver": "ytmusic-player",
        }

    def invalidate_stream(self, video_id: str) -> int:
        clean_id = re.sub(r"[^A-Za-z0-9_-]", "", str(video_id or ""))[:32]
        if not clean_id:
            return 0
        removed = 0
        with self._lock:
            for key in [value for value in self._stream_cache if value.startswith(f"{clean_id}:")]:
                self._stream_cache.pop(key, None)
                removed += 1
        return removed

    def resolve_stream(self, video_id: str) -> Dict[str, Any]:
        """Resolve once per track/quality, sharing in-flight work with prefetch.

        Focus prefetch and an immediate Play press used to occupy both YouTube
        Music worker threads with the same yt-dlp request. The second caller now
        waits for the first result and reuses it, which removes a common source
        of the visible one-to-two-second handoff delay.
        """
        clean_id = re.sub(r"[^A-Za-z0-9_-]", "", str(video_id or ""))[:32]
        if not clean_id:
            raise RuntimeError("Invalid YouTube Music track")
        quality = str(self.settings.get("audio_quality") or "high")
        cache_key = f"{clean_id}:{quality}"
        now = time.time()
        with self._lock:
            cached = self._stream_cache.get(cache_key)
            if cached and float(cached.get("expiresAt") or 0) > now + 180:
                return dict(cached)
            event = self._stream_inflight.get(cache_key)
            owner = event is None
            if owner:
                event = threading.Event()
                self._stream_inflight[cache_key] = event
        if not owner:
            assert event is not None
            event.wait(24.0)
            with self._lock:
                cached = self._stream_cache.get(cache_key)
                if cached and float(cached.get("expiresAt") or 0) > time.time() + 60:
                    return dict(cached)
            # The first attempt failed or timed out. Retry once as the new owner
            # rather than returning a stale generic error to the player.
        try:
            return self._resolve_stream_uncached(clean_id)
        finally:
            if owner:
                with self._lock:
                    completed = self._stream_inflight.pop(cache_key, None)
                if completed is not None:
                    completed.set()

    def _probe_direct_stream(self, stream: Dict[str, Any]) -> bool:
        url = str(stream.get("url") or "")
        if not url.startswith("http"):
            return False
        headers = {
            str(key): str(value)
            for key, value in (stream.get("headers") or {}).items()
            if str(key).lower() not in {"host", "content-length", "connection", "accept-encoding"}
        }
        headers["Range"] = "bytes=0-1"
        headers["Connection"] = "close"
        request = urllib.request.Request(url, headers=headers, method="GET")
        response = None
        try:
            response = urllib.request.urlopen(request, timeout=4.0)
            status = int(getattr(response, "status", 200) or 200)
            if status not in {200, 206}:
                return False
            response.read(2)
            return True
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, OSError):
            return False
        finally:
            if response is not None:
                try:
                    response.close()
                except Exception:
                    pass

    def _resolve_stream_uncached(self, video_id: str) -> Dict[str, Any]:
        clean_id = re.sub(r"[^A-Za-z0-9_-]", "", str(video_id or ""))[:32]
        if not clean_id:
            raise RuntimeError("Invalid YouTube Music track")
        now = time.time()
        quality = str(self.settings.get("audio_quality") or "high")
        cache_key = f"{clean_id}:{quality}"
        with self._lock:
            cached = self._stream_cache.get(cache_key)
            if cached and float(cached.get("expiresAt") or 0) > now + 180:
                return dict(cached)

        self._ensure_imports()
        import yt_dlp

        format_selector = {
            "low": "bestaudio[abr<=96]/bestaudio/best",
            "medium": "bestaudio[abr<=180]/bestaudio/best",
            "high": "bestaudio/best",
        }[quality]
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        cookie = self._cookie_header()
        if cookie:
            headers["Cookie"] = cookie

        # Fast path: ytmusicapi already has the authenticated InnerTube context
        # and often returns a ready-to-play adaptive audio URL in one request.
        # This removes most of the 1–2 second delay when selecting a new track.
        try:
            direct = self._resolve_stream_from_song_api(clean_id, quality, headers, now)
            if str(direct.get("url") or "").startswith("http") and self._probe_direct_stream(direct):
                with self._lock:
                    if len(self._stream_cache) >= 80:
                        self._stream_cache.clear()
                    self._stream_cache[cache_key] = dict(direct)
                return direct
        except Exception as direct_exc:
            self._log(f"YouTube Music direct stream unavailable for {clean_id}: {direct_exc}")

        base_options = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
            "noplaylist": True,
            "format": format_selector,
            "http_headers": headers,
            "socket_timeout": 12,
            "retries": 1,
            "extractor_retries": 1,
        }
        # Pass the browser cookies to yt-dlp as a real Netscape cookie file (not
        # just an HTTP header). This is what clears the "Sign in to confirm you're
        # not a bot" challenge on protected videos.
        cookie_path = ""
        if cookie:
            try:
                cookie_handle = tempfile.NamedTemporaryFile(
                    mode="w",
                    encoding="utf-8",
                    prefix="nowplaying-ytm-cookies-",
                    suffix=".txt",
                    delete=False,
                )
                cookie_path = cookie_handle.name
                with cookie_handle:
                    cookie_handle.write("# Netscape HTTP Cookie File\n")
                    for part in cookie.split(";"):
                        if "=" not in part:
                            continue
                        name, value = part.strip().split("=", 1)
                        if name:
                            cookie_handle.write(f".youtube.com\tTRUE\t/\tTRUE\t2147483647\t{name}\t{value}\n")
            except Exception as cookie_exc:
                self._log(f"YouTube Music cookie file unavailable: {cookie_exc}")

        # Claude's previous build forced the non-existent yt-dlp clients
        # `android_music`/`ios_music`, which yields metadata but no playable
        # formats. Try only clients supported by the bundled yt-dlp version and
        # fall back from the Music URL to the normal watch URL when necessary.
        # Speed + reliability: the android_vr/ios/android clients need NO GVS PO
        # token and NO cookie, and are the ones that actually resolved in the
        # previous (working) build. Try them FIRST, merged into one yt-dlp call,
        # so a non-Premium account no longer waits on the PO-token-gated web
        # clients (which also fail with "The page needs to be reloaded"). The web
        # clients stay only as a last-resort Premium fallback.
        attempts: List[Tuple[str, List[str], bool]] = [
            (f"https://www.youtube.com/watch?v={clean_id}", ["android_vr", "ios", "android"], False),
            (f"https://music.youtube.com/watch?v={clean_id}", ["web_music", "web_safari"], True),
        ]
        info: Dict[str, Any] = {}
        errors: List[str] = []
        try:
            for source_url, player_clients, use_cookie in attempts:
                options = dict(base_options)
                options["extractor_args"] = {"youtube": {"player_client": player_clients}}
                if use_cookie and cookie_path:
                    options["cookiefile"] = cookie_path
                elif not use_cookie:
                    public_headers = dict(headers)
                    public_headers.pop("Cookie", None)
                    options["http_headers"] = public_headers
                try:
                    with yt_dlp.YoutubeDL(options) as downloader:
                        candidate = downloader.extract_info(source_url, download=False)
                    if isinstance(candidate, dict):
                        selected_url = str(candidate.get("url") or "")
                        if not selected_url.startswith("http"):
                            requested = candidate.get("requested_downloads")
                            if isinstance(requested, list):
                                for download in requested:
                                    if isinstance(download, dict) and str(download.get("url") or "").startswith("http"):
                                        selected_url = str(download.get("url"))
                                        candidate.update({key: value for key, value in download.items() if key not in candidate or not candidate.get(key)})
                                        candidate["url"] = selected_url
                                        break
                        if selected_url.startswith("http"):
                            info = candidate
                            break
                    errors.append(f"{','.join(player_clients)}: no audio URL")
                except Exception as attempt_exc:
                    errors.append(f"{','.join(player_clients)}: {attempt_exc}")
                    self._log(f"YouTube Music stream attempt failed ({','.join(player_clients)}): {attempt_exc}")
        finally:
            if cookie_path:
                try:
                    os.remove(cookie_path)
                except OSError:
                    pass

        if not info or not str(info.get("url") or "").startswith("http"):
            detail = errors[-1] if errors else "no playable formats"
            raise RuntimeError(f"YouTube Music did not return a playable audio stream ({detail})")
        remote_headers = dict(info.get("http_headers") or {})
        if cookie:
            remote_headers["Cookie"] = cookie
        extension = str(info.get("ext") or "").lower()
        content_type = str(info.get("mime_type") or info.get("http_headers", {}).get("Content-Type") or "").strip()
        if not content_type:
            content_type = {
                "webm": "audio/webm",
                "m4a": "audio/mp4",
                "mp4": "audio/mp4",
                "opus": "audio/ogg",
            }.get(extension, "audio/mp4")
        result = {
            "url": str(info.get("url") or ""),
            "headers": remote_headers,
            "contentType": content_type,
            "expiresAt": now + 14400,
            "durationMs": int(float(info.get("duration") or 0) * 1000),
            "title": str(info.get("track") or info.get("title") or ""),
            "artist": str(info.get("artist") or info.get("uploader") or ""),
            "album": str(info.get("album") or ""),
            "thumbnail": self._best_stream_thumbnail(info),
            "resolver": "yt-dlp",
        }
        with self._lock:
            if len(self._stream_cache) >= 40:
                self._stream_cache.clear()
            self._stream_cache[cache_key] = dict(result)
        return result

    def stream_info(self, video_id: str) -> Dict[str, Any]:
        return self.resolve_stream(video_id)
