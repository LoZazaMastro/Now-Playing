import { DialogButton, Focusable, GamepadButton, NavEntryPositionPreferences, TextField } from "@decky/ui";
import { toaster } from "@decky/api";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  FaArrowLeft,
  FaCheck,
  FaChevronRight,
  FaClock,
  FaCog,
  FaCompactDisc,
  FaExpandArrowsAlt,
  FaExternalLinkAlt,
  FaHome,
  FaList,
  FaMusic,
  FaPlay,
  FaPause,
  FaRandom,
  FaSearch,
  FaStepBackward,
  FaStepForward,
  FaSignOutAlt,
  FaSyncAlt,
  FaTv,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { SiSpotify } from "react-icons/si";
import { RepeatIcon } from "./repeatIcon";
import * as python from "./python";
import { localAudioPlayer } from "./localAudio";
import type { PlayerSnapshot, Snapshot, SpotifyApiStatus, SpotifyPlusSettings } from "./python";
import { formatTranslation, getTranslations, localizeRuntimeMessage } from "./i18n";
import { ArtistBackgroundPicker } from "./artistBackground";
import type { SpotifyTranslation } from "./i18n";
import { getSavedSourceVolume, saveSourceVolume, SOURCE_VOLUME_CHANGED_EVENT } from "./sourceVolume";
import { SmoothProgressFill, SmoothProgressTime } from "./smoothProgress";

const SPOTIFY_GREEN = "#1DB954";
export const SPOTIFY_PLAYBACK_CHANGED_EVENT = "nowPlaying:spotify-playback-changed";

let sharedSpotifyPlayback: PlayerSnapshot | null = null;
let sharedSpotifyPlaybackAt = 0;

export function publishSpotifyPlaybackSnapshot(player: PlayerSnapshot | null) {
  const now = Date.now();
  let next = player ? { ...player } : null;
  if (next && sharedSpotifyPlayback) {
    const sameTrack = String(next.id ?? "") === String(sharedSpotifyPlayback.id ?? "")
      && String(next.title ?? "") === String(sharedSpotifyPlayback.title ?? "")
      && String(next.artist ?? "") === String(sharedSpotifyPlayback.artist ?? "")
      && String(next.album ?? "") === String(sharedSpotifyPlayback.album ?? "");
    if (sameTrack && next.status === "Playing" && sharedSpotifyPlayback.status === "Playing") {
      const elapsed = Math.max(0, now - sharedSpotifyPlaybackAt);
      const duration = Math.max(0, Number(next.length || sharedSpotifyPlayback.length || 0));
      const projected = Math.max(0, Number(sharedSpotifyPlayback.position || 0) + elapsed);
      const incoming = Math.max(0, Number(next.position || 0));
      next.position = Math.min(duration || Number.MAX_SAFE_INTEGER, Math.max(incoming, projected - 250));
    }
  }
  sharedSpotifyPlayback = next;
  sharedSpotifyPlaybackAt = now;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SPOTIFY_PLAYBACK_CHANGED_EVENT, { detail: sharedSpotifyPlayback }));
  }
}

function getSharedSpotifyPlaybackSnapshot() {
  return sharedSpotifyPlayback ? { ...sharedSpotifyPlayback } : null;
}

export function getSharedSpotifyPlaybackTimestamp() {
  return sharedSpotifyPlaybackAt;
}

function notifySpotifyPlaybackChanged() {
  window.dispatchEvent(new CustomEvent(SPOTIFY_PLAYBACK_CHANGED_EVENT));
}
const controlHeight = 34;

const fullButtonStyle: CSSProperties = {
  width: "100%",
  minWidth: "100%",
  maxWidth: "100%",
  minHeight: `${controlHeight}px`,
  padding: 0,
  lineHeight: 1,
};

const iconButtonStyle: CSSProperties = {
  width: `${controlHeight}px`,
  minWidth: `${controlHeight}px`,
  maxWidth: `${controlHeight}px`,
  height: `${controlHeight}px`,
  minHeight: `${controlHeight}px`,
  padding: 0,
};

const sectionLabelStyle: CSSProperties = {
  padding: "0 4px",
  margin: "14px 0 6px",
  fontSize: "0.74em",
  fontWeight: 800,
  letterSpacing: "0.035em",
  textTransform: "uppercase",
  opacity: 0.62,
};

const settingsCardStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  border: "1px solid rgba(29,185,84,0.28)",
  background: "linear-gradient(145deg, rgba(29,185,84,0.12), rgba(0,0,0,0.22))",
  padding: "12px",
};


function resolveSpotifyTranslations(): SpotifyTranslation {
  return getTranslations("spotify");
}

function useSpotifyTranslations(): SpotifyTranslation {
  return useMemo(resolveSpotifyTranslations, []);
}

function formatSpotifyText(template: string, values: Record<string, string | number>): string {
  return formatTranslation(template, values);
}

function isSpotifyRateLimitMessage(message: unknown): boolean {
  return /rate limit|too many requests/i.test(String(message ?? ""));
}

function formatCountdown(totalSeconds: number): string {
  const value = Math.max(0, Math.floor(Number(totalSeconds || 0)));
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function spotifyPausedPlayer(t: SpotifyTranslation): PlayerSnapshot {
  return {
    id: "spotify-api-paused",
    name: "Spotify API",
    title: t.apiPausedTitle,
    artist: t.apiPausedWait,
    album: "",
    status: "Paused",
    length: 0,
    position: 0,
    volume: 0,
    canNext: false,
    canPrevious: false,
    canPlay: false,
    canPause: false,
    canTogglePlayPause: false,
    canShuffle: false,
    canRepeat: false,
    shuffleActive: false,
    repeatMode: "Off",
    isSelected: true,
    isCurrent: true,
  };
}

function imageUrl(item: any): string {
  const images = item?.images ?? item?.album?.images ?? [];
  if (!Array.isArray(images) || !images.length) return "";
  const medium = images.find((entry: any) => Number(entry?.width || 0) >= 160) ?? images[0];
  return String(medium?.url ?? "");
}

function highestResolutionImageUrl(item: any): string {
  const images = item?.images ?? item?.album?.images ?? [];
  if (!Array.isArray(images) || !images.length) return "";
  const sorted = [...images].filter((entry: any) => entry?.url).sort((left: any, right: any) => {
    const leftSize = Number(left?.width || 0) * Number(left?.height || 0);
    const rightSize = Number(right?.width || 0) * Number(right?.height || 0);
    return rightSize - leftSize;
  });
  return String(sorted[0]?.url ?? "");
}

function spotifyPlaybackToSnapshot(payload: any): PlayerSnapshot | null {
  const item = payload?.item;
  if (!item || !item?.name) return null;
  const artists = Array.isArray(item?.artists)
    ? item.artists.map((artist: any) => artist?.name).filter(Boolean).join(", ")
    : String(item?.show?.name ?? "");
  const repeat = String(payload?.repeat_state ?? "off");
  return {
    id: "spotify-api",
    name: "Spotify",
    title: String(item?.name ?? ""),
    artist: artists,
    album: String(item?.album?.name ?? item?.show?.name ?? ""),
    status: payload?.is_playing ? "Playing" : "Paused",
    length: Number(item?.duration_ms ?? 0),
    position: Number(payload?.progress_ms ?? 0),
    canNext: true,
    canPrevious: true,
    canPlay: true,
    canPause: true,
    canTogglePlayPause: true,
    isSelected: true,
    isCurrent: true,
    canShuffle: true,
    canRepeat: true,
    shuffleActive: Boolean(payload?.shuffle_state),
    repeatMode: repeat === "context" ? "List" : repeat === "track" ? "Track" : "Off",
    artworkUrl: highestResolutionImageUrl(item),
  };
}

function artistText(item: any): string {
  const artists = item?.artists;
  if (Array.isArray(artists) && artists.length) {
    return artists.map((artist: any) => artist?.name).filter(Boolean).join(", ");
  }
  const singleArtist = typeof item?.artist === "string"
    ? item.artist
    : String(item?.artist?.name ?? "");
  if (singleArtist.trim()) return singleArtist.trim();
  if (String(item?.type ?? "").toLowerCase() === "album") return "";
  return String(item?.owner?.display_name ?? item?.publisher ?? "Spotify");
}

function normalizeTrack(entry: any): any {
  return entry?.track ?? entry?.item ?? entry;
}

function normalizeAlbum(entry: any): any {
  return entry?.album ?? entry;
}

// Build a now-playing snapshot straight from the track the user just started, so
// QAM/Big Picture show the cover and metadata INSTANTLY (like local music)
// instead of waiting several seconds for the bridge to report the new track.
function optimisticSpotifySnapshotFromTrack(entry: any): PlayerSnapshot | null {
  const track = normalizeTrack(entry);
  if (!track || !track.name) return null;
  const images = Array.isArray(track?.album?.images) ? track.album.images : Array.isArray(track?.images) ? track.images : [];
  const artworkUrl = Array.isArray(images) && images.length
    ? String([...images].filter((image: any) => image?.url).sort((left: any, right: any) => (Number(right?.width || 0) * Number(right?.height || 0)) - (Number(left?.width || 0) * Number(left?.height || 0)))[0]?.url ?? "")
    : "";
  const artist = Array.isArray(track?.artists) ? track.artists.map((value: any) => value?.name).filter(Boolean).join(", ") : String(track?.artist ?? "");
  return {
    id: "spotify-api", name: "Spotify",
    title: String(track?.name ?? ""), artist, album: String(track?.album?.name ?? ""),
    status: "Playing", length: Number(track?.duration_ms ?? 0), position: 0,
    canNext: true, canPrevious: true, canPlay: true, canPause: true, canTogglePlayPause: true,
    isSelected: true, isCurrent: true, canShuffle: true, canRepeat: true,
    shuffleActive: false, repeatMode: "Off", artworkUrl, volume: 100,
  };
}

function itemType(item: any): "track" | "album" | "artist" | "playlist" | "unknown" {
  const type = String(item?.type ?? "").toLowerCase();
  if (type === "track" || type === "album" || type === "artist" || type === "playlist") return type;
  const uri = String(item?.uri ?? "");
  if (uri.startsWith("spotify:track:")) return "track";
  if (uri.startsWith("spotify:album:")) return "album";
  if (uri.startsWith("spotify:artist:")) return "artist";
  if (uri.startsWith("spotify:playlist:")) return "playlist";
  return "unknown";
}

function showError(message: string) {
  const t = resolveSpotifyTranslations();
  toaster.toast({ title: "Spotify", body: localizeRuntimeMessage(message, t.genericError), duration: 4500 });
}

function SpotifyLogoTitle({ subtitle }: { subtitle?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
      <SiSpotify size={24} color="#fff" style={{ flexShrink: 0 }} />
      <span style={{ minWidth: 0 }}>
        <strong style={{ display: "block", fontSize: "1em", lineHeight: 1.1, fontWeight: 620 }}>Spotify</strong>
        {subtitle ? <span style={{ display: "block", fontSize: "0.72em", opacity: 0.62, marginTop: "2px" }}>{subtitle}</span> : null}
      </span>
    </div>
  );
}

export function SpotifyArtwork({ url, size = 42, round = false }: { url?: string; size?: number; round?: boolean }) {
  const radius = round ? "50%" : "5px";
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: radius,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.42)",
      }}
    >
      {url ? (
        <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <FaMusic size={Math.max(14, Math.round(size * 0.38))} />
      )}
    </div>
  );
}

export function SpotifyRow({
  item,
  subtitle,
  onActivate,
  leadingImage,
  roundImage,
  sideAction,
  buttonRef,
  preferredFocus,
  onFocus,
}: {
  item: any;
  subtitle?: string;
  onActivate: () => void;
  leadingImage?: string;
  roundImage?: boolean;
  sideAction?: { icon: React.ReactNode; label: string; onActivate: () => void };
  buttonRef?: any;
  preferredFocus?: boolean;
  onFocus?: () => void;
}) {
  const t = resolveSpotifyTranslations();
  const mainButton = (
    <DialogButton
      ref={buttonRef}
      preferredFocus={preferredFocus}
      className="npSpotifyResultButton"
      {...({ onFocus: (event: any) => {
        event?.currentTarget?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" });
        onFocus?.();
      } } as any)}
      style={{
        ...fullButtonStyle,
        width: sideAction ? "auto" : "100%",
        minWidth: 0,
        maxWidth: sideAction ? "none" : "100%",
        flex: sideAction ? 1 : undefined,
        height: "54px",
        minHeight: "54px",
        marginBottom: sideAction ? 0 : "6px",
        overflow: "hidden",
      }}
      onClick={onActivate}
    >
      <span
        style={{
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "5px 8px",
          textAlign: "left",
        }}
      >
        <SpotifyArtwork url={leadingImage ?? imageUrl(item)} size={42} round={roundImage} />
        <span style={{ minWidth: 0, flex: 1 }}>
          <strong
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.88em",
              lineHeight: 1.15,
            }}
          >
            {String(item?.name ?? t.untitled)}
          </strong>
          <span
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.72em",
              lineHeight: 1.25,
              minHeight: "1.25em",
              paddingBottom: "2px",
              opacity: 0.62,
              marginTop: "3px",
            }}
          >
            {subtitle ?? artistText(item)}
          </span>
        </span>
        {!sideAction ? <span style={{ display: "inline-flex", alignItems: "center", opacity: 0.68 }}><FaChevronRight size={12} /></span> : null}
      </span>
    </DialogButton>
  );

  if (!sideAction) return mainButton;

  return (
    <Focusable style={{ display: "flex", alignItems: "stretch", gap: "6px", width: "100%", marginBottom: "6px" }} flow-children="horizontal">
      {mainButton}
      <DialogButton
        style={{ ...iconButtonStyle, height: "54px", minHeight: "54px", width: "38px", minWidth: "38px", maxWidth: "38px" }}
        aria-label={sideAction.label}
        onClick={sideAction.onActivate}
      >
        {sideAction.icon}
      </DialogButton>
    </Focusable>
  );
}

export function SpotifyPlusSettingsPanel({
  selectedService,
  onSettingsChanged,
}: {
  selectedService: string;
  onSettingsChanged?: (settings: SpotifyPlusSettings) => void;
}) {
  const t = useSpotifyTranslations();
  const [settings, setSettings] = useState<SpotifyPlusSettings>({
    enabled: false,
    clientId: "",
    redirectUri: "http://127.0.0.1:43821/callback",
    authenticated: false,
    playbackAuthenticated: false,
    compactSavedTracks: true,
    audioQuality: 320,
  });
  const [clientId, setClientId] = useState("");
  const [authState, setAuthState] = useState("idle");
  const [statusText, setStatusText] = useState("");
  const [busy, setBusy] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);
  const [setupDetailsOpen, setSetupDetailsOpen] = useState(false);
  const [audioCacheBusy, setAudioCacheBusy] = useState(false);
  const [artistCacheBusy, setArtistCacheBusy] = useState(false);
  const [refreshBusy, setRefreshBusy] = useState(false);
  const [artistCacheProgress, setArtistCacheProgress] = useState<python.SpotifyArtistCacheProgress>({ active: false, phase: "idle", current: "", completed: 0, total: 0 });
  const [artistCacheStats, setArtistCacheStats] = useState<python.AssetCacheStats>({ bytes: 0, files: 0 });
  const [audioCacheStats, setAudioCacheStats] = useState<{ bytes: number; limitBytes: number }>({ bytes: 0, limitBytes: 5 * 1024 * 1024 * 1024 });
  const [apiUsage, setApiUsage] = useState<{ total: number; perMinute: number; rateLimited: boolean; remainingSeconds: number }>({ total: 0, perMinute: 0, rateLimited: false, remainingSeconds: 0 });
  const pollRef = useRef<number>(0);
  const artistCachePollRef = useRef<number>(0);

  const applySettings = useCallback((next: SpotifyPlusSettings) => {
    setSettings(next);
    setClientId(next.clientId ?? "");
    onSettingsChanged?.(next);
  }, [onSettingsChanged]);

  const reload = useCallback(async () => {
    try {
      applySettings(await python.getSpotifySettings());
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setSettingsReady(true);
    }
  }, [applySettings]);

  const reloadArtistCacheStats = useCallback(async () => {
    try {
      setArtistCacheStats(await python.getSpotifyArtistCacheStats());
    } catch {
      // Keep the last known size if the filesystem is momentarily unavailable.
    }
  }, []);

  const reloadAudioCacheStats = useCallback(async () => {
    try {
      const result = await python.getSpotifyAudioCacheStats();
      if (result?.ok && result.data) setAudioCacheStats({ bytes: Number(result.data.bytes || 0), limitBytes: Number(result.data.limitBytes || 5 * 1024 * 1024 * 1024) });
    } catch {
      // Keep the last known size if the filesystem is momentarily unavailable.
    }
  }, []);

  useEffect(() => {
    void reload();
    void reloadArtistCacheStats();
    void reloadAudioCacheStats();
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      if (artistCachePollRef.current) window.clearInterval(artistCachePollRef.current);
    };
  }, [reload, reloadArtistCacheStats, reloadAudioCacheStats]);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const result = await python.getSpotifyApiUsage();
        if (!cancelled && result?.ok && result.data) setApiUsage(result.data);
      } catch {
        // Reading usage never makes a Spotify request; ignore transient errors.
      }
    };
    void tick();
    const id = window.setInterval(() => void tick(), 3000);
    return () => { cancelled = true; window.clearInterval(id); };
  }, []);

  useEffect(() => {
    if (settings.authenticated) setSetupDetailsOpen(false);
  }, [settings.authenticated]);

  const beginPolling = useCallback(() => {
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = window.setInterval(async () => {
      try {
        const status = await python.getSpotifyAuthStatus();
        setAuthState(status.state);
        setStatusText(localizeRuntimeMessage(status.message ?? ""));
        if (status.state === "authenticated" || status.state === "error") {
          if (pollRef.current) window.clearInterval(pollRef.current);
          pollRef.current = 0;
          if (status.state === "authenticated") clearSpotifyLibrarySessionCaches();
          applySettings(status);
          setBusy(false);
        }
      } catch {
        // Keep waiting; the callback may still be in progress.
      }
    }, 900);
  }, [applySettings]);

  async function toggleCompactSavedTracks() {
    try {
      setBusy(true);
      const next = await python.setSpotifyCompactSavedTracks(!settings.compactSavedTracks);
      applySettings(next);
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setBusy(false);
    }
  }

  async function setAudioQuality(quality: 96 | 160 | 320) {
    if ((settings.audioQuality ?? 320) === quality) return;
    try {
      setBusy(true);
      applySettings(await python.setSpotifyAudioQuality(quality));
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setBusy(false);
    }
  }

  async function clearAudioCache() {
    try {
      setAudioCacheBusy(true);
      const result = await python.clearSpotifyAudioCache();
      if (!result.ok) showError(result.error ?? t.genericError);
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setAudioCacheBusy(false);
      void reloadAudioCacheStats();
    }
  }


  async function saveClientId() {
    try {
      setBusy(true);
      const changed = clientId.trim() !== settings.clientId;
      const next = await python.setSpotifyClientId(clientId);
      if (changed) clearSpotifyLibrarySessionCaches();
      applySettings(next);
      toaster.toast({ title: "Spotify", body: t.clientIdSaved, duration: 2200 });
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setBusy(false);
    }
  }

  async function connect() {
    try {
      setBusy(true);
      if (clientId.trim() !== settings.clientId) {
        const next = await python.setSpotifyClientId(clientId);
        clearSpotifyLibrarySessionCaches();
        applySettings(next);
      }
      const result = await python.beginSpotifyAuth();
      if (!result.ok) throw new Error(result.error || t.unableStartAuthorization);
      setAuthState("waiting");
      setStatusText(t.completeSignIn);
      beginPolling();
    } catch (error: any) {
      setBusy(false);
      showError(error?.message ?? String(error));
    }
  }

  async function connectPlayback() {
    try {
      setBusy(true);
      const result = await python.beginSpotifyPlaybackAuth();
      if (!result.ok) throw new Error(result.error || t.unableStartAuthorization);
      setAuthState("waiting");
      setStatusText(t.completeSignIn);
      beginPolling();
    } catch (error: any) {
      setBusy(false);
      showError(error?.message ?? String(error));
    }
  }

  async function disconnect() {
    try {
      setBusy(true);
      applySettings(await python.disconnectSpotify());
      clearSpotifyLibrarySessionCaches();
      setAuthState("idle");
      setStatusText("");
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setBusy(false);
    }
  }

  const refreshArtistCacheProgress = useCallback(async () => {
    try {
      const progress = await python.getSpotifyArtistCacheProgress();
      setArtistCacheProgress(progress);
      setArtistCacheBusy(Boolean(progress.active));
      if (!progress.active && artistCachePollRef.current) {
        window.clearInterval(artistCachePollRef.current);
        artistCachePollRef.current = 0;
        void reloadArtistCacheStats();
      }
    } catch {
      // Keep the last visible progress during a transient Decky call failure.
    }
  }, [reloadArtistCacheStats]);

  useEffect(() => {
    let mounted = true;
    void python.getSpotifyArtistCacheProgress().then((progress) => {
      if (!mounted) return;
      setArtistCacheProgress(progress);
      setArtistCacheBusy(Boolean(progress.active));
      if (progress.active) beginArtistCachePolling();
    }).catch(() => {});
    return () => { mounted = false; };
  }, [refreshArtistCacheProgress]);

  function beginArtistCachePolling() {
    if (artistCachePollRef.current) window.clearInterval(artistCachePollRef.current);
    void refreshArtistCacheProgress();
    artistCachePollRef.current = window.setInterval(() => void refreshArtistCacheProgress(), 400);
  }

  async function createArtistCache() {
    if (artistCacheBusy || !settings.authenticated) return;
    setArtistCacheBusy(true);
    setArtistCacheProgress({ active: true, phase: "loading", current: "", completed: 0, total: 0 });
    beginArtistCachePolling();
    try {
      const result = await python.buildSpotifyArtistCache();
      if (!result?.ok) throw new Error(result?.error || t.requestFailed);
      const artists = Number(result.data?.artists || 0);
      toaster.toast({
        title: "Spotify",
        body: artists > 0 ? t.artistCacheCreated : t.artistCacheNoFavorites,
        duration: 3000,
      });
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      void refreshArtistCacheProgress();
    }
  }

  async function clearArtistCache() {
    if (artistCacheBusy) return;
    setArtistCacheBusy(true);
    setArtistCacheProgress({ active: true, phase: "clearing", current: "", completed: 0, total: 0 });
    beginArtistCachePolling();
    try {
      const result = await python.clearSpotifyArtistCache();
      if (!result?.ok) throw new Error(result?.error || t.requestFailed);
      toaster.toast({ title: "Spotify", body: t.artistCacheCleared, duration: 2600 });
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      void refreshArtistCacheProgress();
      void reloadArtistCacheStats();
    }
  }

  async function clearManualBackgrounds() {
    if (artistCacheBusy || Number(artistCacheStats.manualFiles || 0) <= 0) return;
    setArtistCacheBusy(true);
    setArtistCacheProgress({ active: true, phase: "clearing_manual", current: "", completed: 0, total: Number(artistCacheStats.manualFiles || 0) });
    beginArtistCachePolling();
    try {
      const result = await python.clearManualArtistBackgrounds("spotify");
      if (!result?.ok) throw new Error(result?.error || t.requestFailed);
      toaster.toast({ title: "Spotify", body: t.manualBackgroundsRemoved, duration: 2600 });
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      void refreshArtistCacheProgress();
      void reloadArtistCacheStats();
    }
  }

  async function copyText(value: string): Promise<boolean> {
    const text = String(value ?? "");
    if (!text) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Steam CEF may expose Clipboard without granting write permission.
    }
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      return copied;
    } catch {
      return false;
    }
  }


  async function copySetupValue(value: string, successMessage: string) {
    const copied = await copyText(value);
    toaster.toast({
      title: "Spotify",
      body: copied ? successMessage : value,
      duration: copied ? 2000 : 5000,
    });
  }

  function setupValueField(label: string, value: string, copyLabel: string, successMessage: string, multiline = false) {
    return (
      <div style={{ marginTop: "7px", marginBottom: "10px" }}>
        <label style={{ display: "block", fontSize: "0.68em", opacity: 0.62, marginBottom: "4px" }}>{label}</label>
        {multiline ? (
          <textarea
            readOnly
            value={value}
            onFocus={(event) => event.currentTarget.select()}
            onClick={(event) => event.currentTarget.select()}
            style={{
              width: "100%", minHeight: "58px", boxSizing: "border-box", resize: "none", padding: "8px",
              borderRadius: "7px", background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.1)",
              color: "inherit", fontFamily: "inherit", fontSize: "0.68em", lineHeight: 1.35, userSelect: "text",
              WebkitUserSelect: "text", cursor: "text",
            }}
          />
        ) : (
          <input
            readOnly
            type="text"
            value={value}
            onFocus={(event) => event.currentTarget.select()}
            onClick={(event) => event.currentTarget.select()}
            style={{
              width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "7px",
              background: "rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.1)", color: "inherit",
              fontFamily: label === t.redirectUri ? "monospace" : "inherit", fontSize: "0.68em", userSelect: "text",
              WebkitUserSelect: "text", cursor: "text",
            }}
          />
        )}
        <div style={{ height: "6px" }} />
        <DialogButton style={fullButtonStyle} onClick={() => void copySetupValue(value, successMessage)}>
          <span>{copyLabel}</span>
        </DialogButton>
      </div>
    );
  }

  return (
    <>
      <div style={sectionLabelStyle}>Spotify</div>
      <div className="npSpotifySettingsCard" style={settingsCardStyle}>
        <style>{`
          .npSpotifySettingsCard button,.npSpotifySettingsCard button *{color:#fff!important;text-align:left!important}
          .npSpotifySettingsCard button{font-size:.82em!important;transition:background 120ms ease,border-color 120ms ease,box-shadow 120ms ease!important}
          .npSpotifySettingsCard button span{font-size:1em!important}
          .npSpotifySettingsCard button>span{width:100%!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;text-align:left!important;padding:0 10px!important;gap:7px!important;line-height:1.15!important}
          .npSpotifySettingsCard button:hover,.npSpotifySettingsCard button:focus,.npSpotifySettingsCard button.gpfocus{color:#fff!important;background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 0 0 1px rgba(29,185,84,.28),0 0 18px rgba(29,185,84,.15)!important}
          .npSpotifySettingsCard .npSpotifyConnectButton{color:#fff!important;background:rgba(29,185,84,.72)!important}
          .npSpotifySettingsCard .npSpotifyConnectButton:hover,.npSpotifySettingsCard .npSpotifyConnectButton:focus,.npSpotifySettingsCard .npSpotifyConnectButton.gpfocus{background:#27d260!important;color:#fff!important;border-color:rgba(255,255,255,.34)!important;box-shadow:0 0 0 2px rgba(255,255,255,.62),0 0 22px rgba(29,185,84,.34)!important}
        `}</style>
        <SpotifyLogoTitle subtitle={t.personalMode} />
        <p style={{ fontSize: "0.74em", lineHeight: 1.42, opacity: 0.74, margin: "10px 0" }}>
          {t.settingsDescription}
        </p>
        {selectedService !== "spotify" ? (
          <div style={{ fontSize: "0.72em", opacity: 0.64, marginBottom: "9px" }}>
            {t.selectSpotifyHint}
          </div>
        ) : null}
        {settingsReady && settings.authenticated ? (
          <DialogButton
            style={{ ...fullButtonStyle, marginTop: "12px" }}
            onClick={() => setSetupDetailsOpen((open) => !open)}
          >
            <span style={{ justifyContent: "center", textAlign: "center" }}>{setupDetailsOpen ? t.hideDetails : t.showDetails}</span>
          </DialogButton>
        ) : null}
        {settingsReady && settings.authenticated && !settings.playbackAuthenticated ? (
          <div style={{ marginTop: "10px" }}>
            <p style={{ margin: "0 2px 8px", fontSize: "0.7em", lineHeight: 1.42, opacity: 0.7 }}>
              {t.finishPlaybackSetup}
            </p>
            <DialogButton className="npSpotifyConnectButton" style={{ ...fullButtonStyle, background: SPOTIFY_GREEN, color: "#fff" }} disabled={busy} onClick={() => void connectPlayback()}>
              <span style={{ fontWeight: 800 }}><SiSpotify /> {t.connectPlayback}</span>
            </DialogButton>
          </div>
        ) : null}
        {settingsReady && (!settings.authenticated || setupDetailsOpen) ? (
          <div style={{ marginTop: "12px" }}>
            <div style={{ fontSize: "0.72em", fontWeight: 800, marginBottom: "8px" }}>{t.setupGuide}</div>
            <ol style={{ margin: 0, padding: "0 0 0 20px", fontSize: "0.71em", lineHeight: 1.45 }}>
              {t.setupSteps.map((step, index) => (
                <li key={`${index}-${step}`} style={{ marginBottom: "10px", opacity: 0.82 }}>
                  <span>{step}</span>
                  {index === 0 ? (
                    <div style={{ marginTop: "7px" }}>
                      <DialogButton style={fullButtonStyle} onClick={() => void python.openSpotifyDashboard()}>
                        <span><FaExternalLinkAlt /> {t.openDashboard}</span>
                      </DialogButton>
                    </div>
                  ) : null}
                  {index === 2 ? setupValueField(t.appNameLabel, t.appNameValue, t.copyAppName, t.appNameCopied) : null}
                  {index === 3 ? setupValueField(t.appDescriptionLabel, t.appDescriptionValue, t.copyAppDescription, t.appDescriptionCopied, true) : null}
                  {index === 4 ? (
                    <div style={{ marginTop: "6px", padding: "7px 8px", borderRadius: "7px", background: "rgba(255,255,255,0.045)", fontSize: "0.96em", opacity: 0.78 }}>
                      {t.websiteOptional}
                    </div>
                  ) : null}
                  {index === 5 ? setupValueField(t.redirectUri, settings.redirectUri, t.copyRedirectUri, t.redirectCopied) : null}
                  {index === 6 ? (
                    <div style={{ marginTop: "6px", padding: "7px 8px", borderRadius: "7px", background: "rgba(29,185,84,0.10)", border: "1px solid rgba(29,185,84,0.2)", fontSize: "0.96em", fontWeight: 700 }}>
                      {t.webApiOnly}
                    </div>
                  ) : null}
                  {index === 7 ? (
                    <div style={{ marginTop: "6px", padding: "7px 8px", borderRadius: "7px", background: "rgba(255,255,255,0.045)", fontSize: "0.96em", opacity: 0.78 }}>
                      {t.developerTerms}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>

            <label style={{ display: "block", fontSize: "0.68em", opacity: 0.58, marginBottom: "4px" }}>
              {t.clientId}
            </label>
            <input
              type="text"
              value={clientId}
              spellCheck={false}
              autoComplete="off"
              onChange={(event) => setClientId(event.currentTarget.value)}
              onFocus={(event) => event.currentTarget.select()}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 10px",
                borderRadius: "7px",
                background: "rgba(0,0,0,0.28)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "inherit",
                fontFamily: "monospace",
                fontSize: "0.72em",
                userSelect: "text",
                WebkitUserSelect: "text",
                cursor: "text",
              }}
            />
            <div style={{ height: "6px" }} />
            <DialogButton style={fullButtonStyle} disabled={busy || !clientId.trim()} onClick={() => void saveClientId()}>
              <span>{t.saveClientId}</span>
            </DialogButton>

            <div style={{ height: "8px" }} />
            {settings.authenticated ? (
              <DialogButton style={fullButtonStyle} disabled={busy} onClick={() => void disconnect()}>
                <span><FaSignOutAlt /> {t.disconnect}</span>
              </DialogButton>
            ) : (
              <DialogButton className="npSpotifyConnectButton" style={{ ...fullButtonStyle, background: SPOTIFY_GREEN, color: "#fff" }} disabled={busy || !clientId.trim()} onClick={() => void connect()}>
                <span style={{ fontWeight: 800 }}><SiSpotify /> {t.connect}</span>
              </DialogButton>
            )}

            {authState === "waiting" || statusText ? (
              <div style={{ marginTop: "8px", fontSize: "0.7em", opacity: authState === "error" ? 1 : 0.68, color: authState === "error" ? "#ff7777" : "inherit" }}>
                {statusText}
              </div>
            ) : null}
            <p style={{ margin: "10px 0 0", fontSize: "0.67em", lineHeight: 1.42, opacity: 0.54 }}>
              {t.premiumNote}
            </p>
          </div>
        ) : null}

        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ margin: "0 2px 9px", fontSize: "0.67em", lineHeight: 1.42, opacity: 0.56 }}>{t.cacheExplanation}</p>
          <DialogButton
            style={fullButtonStyle}
            disabled={refreshBusy}
            onClick={() => {
              setRefreshBusy(true);
              void python.refreshSpotifyCache()
                .then((result) => { if (result?.ok) clearSpotifyLibrarySessionCaches(); })
                .finally(() => setRefreshBusy(false));
            }}
          >
            <span><FaSyncAlt className={refreshBusy ? "npRestartSpin" : undefined} /> {t.refresh}</span>
          </DialogButton>
          <div style={{ height: "12px" }} />
          <div style={{ fontSize: "0.76em", fontWeight: 700, marginBottom: "7px" }}>{t.audioQuality}</div>
          <Focusable style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }} flow-children="vertical">
            {([96, 160, 320] as const).map((quality) => {
              const active = (settings.audioQuality ?? 320) === quality;
              return (
                <DialogButton
                  key={quality}
                  disabled={busy}
                  style={{
                    ...fullButtonStyle,
                    minWidth: "100%",
                    maxWidth: "100%",
                    background: active ? "rgba(29,185,84,.72)" : undefined,
                    color: "#fff",
                  }}
                  onClick={() => void setAudioQuality(quality)}
                >
                  <span style={{ justifyContent: "center", textAlign: "center", width: "100%" }}>{quality} kbps</span>
                </DialogButton>
              );
            })}
          </Focusable>
          <p style={{ margin: "7px 2px 10px", fontSize: "0.67em", lineHeight: 1.4, opacity: 0.56 }}>{t.musicCacheDescription}</p>
          <div style={{ margin: "0 2px 8px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: "0.72em", opacity: 0.82 }}>
              <span>{t.musicCacheUsage}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{(audioCacheStats.bytes / 1073741824).toFixed(2)} GB / {Math.round(audioCacheStats.limitBytes / 1073741824)} GB</span>
            </div>
            <div style={{ position: "relative", height: "6px", borderRadius: "999px", background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, width: `${Math.max(0, Math.min(100, (audioCacheStats.bytes / Math.max(1, audioCacheStats.limitBytes)) * 100))}%`, background: SPOTIFY_GREEN, borderRadius: "999px" }} />
            </div>
          </div>
          <DialogButton style={fullButtonStyle} disabled={audioCacheBusy} onClick={() => void clearAudioCache()}>
            <span><FaTimes /> {audioCacheBusy ? t.clearingMusicCache : t.clearMusicCache}</span>
          </DialogButton>
          <DialogButton
            style={{ ...fullButtonStyle, marginTop: "8px", opacity: settings.compactSavedTracks !== false ? 1 : 0.66 }}
            disabled={busy}
            onClick={() => void toggleCompactSavedTracks()}
          >
            <span style={{ width: "100%", display: "flex", alignItems: "center", padding: "0 10px", boxSizing: "border-box", gap: "8px" }}>
              <FaList />
              <span>{t.compactSavedTracks}</span>
              <span style={{ marginLeft: "auto", color: settings.compactSavedTracks !== false ? SPOTIFY_GREEN : "inherit" }}>{settings.compactSavedTracks !== false ? <FaCheck /> : null}</span>
            </span>
          </DialogButton>
          <p style={{ margin: "7px 2px 10px", fontSize: "0.67em", lineHeight: 1.4, opacity: 0.56 }}>{t.compactSavedTracksDescription}</p>
          <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.76em", fontWeight: 700, marginBottom: "5px" }}>{t.artistCacheTitle}</div>
            <p style={{ margin: "0 2px 9px", fontSize: "0.67em", lineHeight: 1.42, opacity: 0.56 }}>{t.artistCacheDescription}</p>
            <DialogButton style={{ ...fullButtonStyle, opacity: settings.authenticated ? 1 : .5 }} disabled={!settings.authenticated || artistCacheBusy} onClick={() => void createArtistCache()}>
              <span><FaSyncAlt className={artistCacheBusy && artistCacheProgress.phase !== "clearing" ? "npRestartSpin" : undefined} /> {artistCacheBusy && artistCacheProgress.phase !== "clearing" ? t.artistCacheBuilding : t.createArtistCache}</span>
            </DialogButton>
            <DialogButton style={{ ...fullButtonStyle, marginTop: "6px", opacity: artistCacheStats.files > 0 ? 1 : .58 }} disabled={artistCacheBusy || artistCacheStats.files <= 0} onClick={() => void clearArtistCache()}>
              <span><FaTimes /> {artistCacheProgress.phase === "clearing" ? t.artistCacheClearing : t.clearArtistCache}</span>
            </DialogButton>
            <DialogButton style={{ ...fullButtonStyle, marginTop: "6px", opacity: Number(artistCacheStats.manualFiles || 0) > 0 ? 1 : .58 }} disabled={artistCacheBusy || Number(artistCacheStats.manualFiles || 0) <= 0} onClick={() => void clearManualBackgrounds()}>
              <span><FaTimes /> {artistCacheProgress.phase === "clearing_manual" ? t.manualBackgroundsRemoving : t.removeManualBackgrounds}</span>
            </DialogButton>
            <p style={{ margin: "7px 2px 0", fontSize: "0.65em", lineHeight: 1.4, opacity: 0.52 }}>{t.manualBackgroundsDescription}</p>
            {(artistCacheBusy || ["complete", "cleared", "manual_cleared", "error"].includes(artistCacheProgress.phase)) ? (
              <div style={{ marginTop: "9px", padding: "8px 9px", borderRadius: 7, background: "rgba(255,255,255,.045)", overflow: "hidden" }}>
                <div style={{ fontSize: "0.67em", lineHeight: 1.35, opacity: artistCacheProgress.phase === "error" ? 1 : .68, color: artistCacheProgress.phase === "error" ? "#ff7777" : "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {artistCacheProgress.phase === "error"
                    ? localizeRuntimeMessage(artistCacheProgress.error || t.requestFailed)
                    : artistCacheProgress.phase === "cleared"
                      ? t.artistCacheCleared
                      : artistCacheProgress.phase === "manual_cleared"
                        ? t.manualBackgroundsRemoved
                        : artistCacheProgress.current
                          ? `${artistCacheProgress.phase === "clearing" ? t.artistCacheClearing : artistCacheProgress.phase === "clearing_manual" ? t.manualBackgroundsRemoving : t.artistCacheProgress}: ${artistCacheProgress.current}`
                          : `${artistCacheProgress.phase === "clearing" ? t.artistCacheClearing : artistCacheProgress.phase === "clearing_manual" ? t.manualBackgroundsRemoving : t.artistCacheProgress}: ${artistCacheProgress.completed}/${artistCacheProgress.total}`}
                </div>
                <div style={{ height: "4px", marginTop: "6px", borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,.1)" }}>
                  <div style={{ width: `${artistCacheProgress.total > 0 ? Math.min(100, (artistCacheProgress.completed / artistCacheProgress.total) * 100) : (artistCacheBusy ? 18 : 100)}%`, height: "100%", background: SPOTIFY_GREEN, transition: "width 180ms ease" }} />
                </div>
              </div>
            ) : null}
            <div style={{ marginTop: 7, padding: "7px 9px", borderRadius: 7, background: "rgba(255,255,255,.035)", display: "grid", gap: 5, fontSize: ".66em" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ opacity: .58 }}>{t.cacheSize}</span><strong>{(Math.max(0, Number(artistCacheStats.bytes || 0)) / (1024 * 1024)).toFixed(2)} MB</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ opacity: .58 }}>{t.manualBackgrounds}</span><strong>{(Math.max(0, Number(artistCacheStats.manualBytes || 0)) / (1024 * 1024)).toFixed(2)} MB</strong></div>
            </div>
          </div>
          <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.76em", fontWeight: 700 }}>{t.apiUsageTitle}</span>
              <span style={{ fontSize: "0.66em", opacity: 0.6, fontVariantNumeric: "tabular-nums" }}>{apiUsage.total} {t.apiUsageTotal}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ position: "relative", flex: 1, height: "6px", borderRadius: "999px", background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${Math.max(0, Math.min(100, (apiUsage.perMinute / 60) * 100))}%`, background: apiUsage.rateLimited ? "#ff7777" : SPOTIFY_GREEN, borderRadius: "999px", transition: "width 240ms ease" }} />
              </div>
              <span style={{ fontSize: "0.68em", fontVariantNumeric: "tabular-nums", minWidth: "76px", textAlign: "right" }}>{apiUsage.perMinute} {t.apiUsagePerMinute}</span>
            </div>
            {apiUsage.rateLimited ? <div style={{ marginTop: "6px", fontSize: "0.64em", color: "#ff9a9a" }}>{t.apiUsagePaused}{apiUsage.remainingSeconds > 0 ? ` · ${apiUsage.remainingSeconds}s` : ""}</div> : null}
          </div>
        </div>
      </div>
    </>
  );
}

type BrowserTab = "home" | "search" | "library";
type LibrarySection = "tracks" | "albums" | "playlists" | "artists";
type DetailState = { kind: "album" | "playlist" | "artist"; id: string; title: string };

const spotifyLibrarySessionCache = new Map<LibrarySection, any>();
const spotifyLibraryHydrations = new Map<LibrarySection, Promise<any | null>>();
let spotifyLibraryCacheRevision = 0;

function spotifyLibraryEntries(payload: any, section: LibrarySection): any[] {
  const items = section === "artists" ? payload?.artists?.items : payload?.items;
  return Array.isArray(items) ? items : [];
}

function spotifyLibraryNeedsHydration(payload: any, section: LibrarySection): boolean {
  const container = section === "artists" ? payload?.artists : payload;
  const items = spotifyLibraryEntries(payload, section);
  const total = Math.max(0, Number(container?.total ?? items.length));
  return Boolean(container?.next) || total > items.length;
}

function hydrateSpotifyLibrary(section: LibrarySection, onReady: (value: any) => void) {
  const revision = spotifyLibraryCacheRevision;
  let request = spotifyLibraryHydrations.get(section);
  if (!request) {
    request = python.spotifyGetLibrary(section, 0, 0)
      .then((result) => result?.ok ? (result.data ?? null) : null)
      .catch(() => null);
    spotifyLibraryHydrations.set(section, request);
    void request.finally(() => {
      if (spotifyLibraryHydrations.get(section) === request) spotifyLibraryHydrations.delete(section);
    });
  }
  void request.then((value) => {
    if (!value || revision !== spotifyLibraryCacheRevision) return;
    spotifyLibrarySessionCache.set(section, value);
    onReady(value);
  });
}

function clearSpotifyLibrarySessionCaches() {
  spotifyLibraryCacheRevision += 1;
  spotifyLibrarySessionCache.clear();
  spotifyLibraryHydrations.clear();
}

export type SpotifyAlbumRequest = {
  id: string;
  title: string;
  nonce: number;
};

type SpotifyBrowserProps = {
  openAlbumRequest?: SpotifyAlbumRequest | null;
  onOpenBigPicture?: () => void;
  onOpenSettings?: () => void;
};

function SpotifyBrowserContent({ openAlbumRequest, onOpenBigPicture, onOpenSettings }: SpotifyBrowserProps) {
  const t = useSpotifyTranslations();
  const [tab, setTab] = useState<BrowserTab>("home");
  const [home, setHome] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [librarySection, setLibrarySection] = useState<LibrarySection>("tracks");
  const librarySectionRef = useRef<LibrarySection>("tracks");
  const [library, setLibrary] = useState<any>(null);
  const [detail, setDetail] = useState<DetailState | null>(null);
  const [detailHistory, setDetailHistory] = useState<DetailState[]>([]);
  const [detailData, setDetailData] = useState<any>(null);
  const [showAllArtistAlbums, setShowAllArtistAlbums] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState<SpotifyApiStatus>({ active: false, remainingSeconds: 0, until: 0 });
  const [settingsReady, setSettingsReady] = useState(false);
  const [compactSavedTracks, setCompactSavedTracks] = useState(true);
  const requestSerial = useRef(0);
  const browserRootRef = useRef<HTMLDivElement>(null);
  const firstTrackRef = useRef<HTMLDivElement>(null);
  const firstResultRef = useRef<HTMLDivElement>(null);
  const pendingFocusKeyRef = useRef("");
  const pendingListFocusRef = useRef(false);
  const lastExternalAlbumNonceRef = useRef(0);

  const requestListFocus = useCallback(() => {
    // Keep focus on the control the user activated.
  }, []);

  const run = useCallback(async <T,>(work: () => Promise<python.SpotifyApiResult<T>>, onSuccess: (data: T) => void) => {
    const serial = requestSerial.current + 1;
    requestSerial.current = serial;
    setLoading(true);
    try {
      const result = await work();
      if (serial !== requestSerial.current) return;
      if (!result?.ok) throw new Error(result?.error || t.requestFailed);
      onSuccess(result.data as T);
    } catch (error: any) {
      if (serial === requestSerial.current) {
        const message = error?.message ?? String(error);
        if (isSpotifyRateLimitMessage(message)) {
          void python.getSpotifyApiStatus().then(setRateLimitStatus).catch(() => {});
        } else {
          showError(message);
        }
      }
    } finally {
      if (serial === requestSerial.current) setLoading(false);
    }
  }, [t.requestFailed]);

  const requestDetail = useCallback((next: DetailState) => {
    setDetail(next);
    setDetailData(null);
    setShowAllArtistAlbums(false);
    void run(() => python.spotifyGetDetail(next.kind, next.id), setDetailData);
  }, [run]);

  const loadHome = useCallback(() => {
    void run(() => python.spotifyGetHome(), setHome);
  }, [run]);


  const loadLibrary = useCallback((section: LibrarySection, focusItems = true, force = false) => {
    if (focusItems) requestListFocus();
    librarySectionRef.current = section;
    setLibrarySection(section);
    setDetail(null);
    setDetailHistory([]);
    setShowAllArtistAlbums(false);
    const cached = spotifyLibrarySessionCache.get(section);
    if (!force && cached) {
      setLibrary(cached);
      setLoading(false);
      if (!(section === "tracks" && compactSavedTracks) && spotifyLibraryNeedsHydration(cached, section)) {
        hydrateSpotifyLibrary(section, (complete) => {
          if (librarySectionRef.current === section) setLibrary(complete);
        });
      }
      return;
    }
    void run(
      () => python.spotifyGetLibrary(section, 0, section === "tracks" && compactSavedTracks ? 50 : 120),
      (value) => {
        spotifyLibrarySessionCache.set(section, value);
        setLibrary(value);
        if (!(section === "tracks" && compactSavedTracks) && spotifyLibraryNeedsHydration(value, section)) {
          hydrateSpotifyLibrary(section, (complete) => {
            if (librarySectionRef.current === section) setLibrary(complete);
          });
        }
      },
    );
  }, [requestListFocus, run, compactSavedTracks]);

  const compactInitRef = useRef(true);
  useEffect(() => {
    // When the saved-tracks compaction setting changes, drop the cached page and
    // re-fetch so the list reflects the new limit (50 vs the whole library).
    if (compactInitRef.current) { compactInitRef.current = false; return; }
    clearSpotifyLibrarySessionCaches();
    if (librarySection === "tracks") loadLibrary("tracks", false, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compactSavedTracks]);

  const executeSearch = useCallback(() => {
    const query = searchTerm.trim();
    if (query.length < 2 || loading) return;
    setDetail(null);
    setDetailHistory([]);
    setShowAllArtistAlbums(false);
    requestListFocus();
    void run(() => python.spotifySearch(query), setSearchResults);
  }, [loading, requestListFocus, run, searchTerm]);

  useEffect(() => {
    let cancelled = false;
    void python.getSpotifySettings().then((value) => {
      if (cancelled) return;
      setCompactSavedTracks(value.compactSavedTracks !== false);
      setSettingsReady(true);
    }).catch(() => {
      if (!cancelled) setSettingsReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    loadHome();
  }, [loadHome, settingsReady]);


  useEffect(() => {
    if (!settingsReady) {
      setRateLimitStatus({ active: false, remainingSeconds: 0, until: 0 });
      return;
    }
    let cancelled = false;
    const refreshRateLimit = async () => {
      try {
        const status = await python.getSpotifyApiStatus();
        if (!cancelled) setRateLimitStatus(status);
      } catch {
        // Local status lookup only; keep the previous value on a transient Decky call failure.
      }
    };
    void refreshRateLimit();
    const timer = window.setInterval(() => void refreshRateLimit(), 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [settingsReady]);

  useEffect(() => {
    if (!openAlbumRequest?.id || openAlbumRequest.nonce === lastExternalAlbumNonceRef.current) return;
    lastExternalAlbumNonceRef.current = openAlbumRequest.nonce;
    setDetailHistory([]);
    requestDetail({ kind: "album", id: openAlbumRequest.id, title: openAlbumRequest.title || t.album });
  }, [openAlbumRequest?.id, openAlbumRequest?.nonce, openAlbumRequest?.title, requestDetail, t.album]);

  const navigateBack = useCallback((event?: any) => {
    if (!detail) return false;
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const previous = detailHistory[detailHistory.length - 1];
    if (previous) {
      setDetailHistory((history) => history.slice(0, -1));
      requestDetail(previous);
    } else {
      requestSerial.current += 1;
      setLoading(false);
      setDetail(null);
      setDetailData(null);
      setShowAllArtistAlbums(false);
      pendingFocusKeyRef.current = "";
      requestListFocus();
    }
    return true;
  }, [detail, detailHistory, requestDetail, requestListFocus]);

  useEffect(() => {
    if (!detail) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      navigateBack(event);
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [detail, navigateBack]);

  async function play(uri: string, contextUri = "", offsetUri = "") {
    if (rateLimitStatus.active) {
      toaster.toast({ title: "Spotify API", body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }), duration: 5000 });
      return;
    }
    localAudioPlayer.stop();
    try {
      const result = await python.spotifyPlay(uri, contextUri, offsetUri);
      if (!result.ok) throw new Error(result.error || t.unableStartPlayback);
      notifySpotifyPlaybackChanged();
    } catch (error: any) {
      showError(error?.message ?? String(error));
    }
  }

  async function playTrackList(entries: any[], startIndex = 0) {
    if (rateLimitStatus.active) {
      toaster.toast({ title: "Spotify API", body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }), duration: 5000 });
      return;
    }
    localAudioPlayer.stop();
    const uris = entries
      .map(normalizeTrack)
      .map((track: any) => String(track?.uri ?? ""))
      .filter((uri: string) => uri.startsWith("spotify:track:") || uri.startsWith("spotify:episode:"));
    if (!uris.length) return;
    try {
      const result = await python.spotifyPlayItems(uris, Math.max(0, Math.min(startIndex, uris.length - 1)));
      if (!result.ok) throw new Error(result.error || t.unableStartPlayback);
      const optimistic = optimisticSpotifySnapshotFromTrack(entries[Math.max(0, Math.min(startIndex, entries.length - 1))]);
      if (optimistic) publishSpotifyPlaybackSnapshot(optimistic);
      notifySpotifyPlaybackChanged();
    } catch (error: any) {
      showError(error?.message ?? String(error));
    }
  }

  function toDetail(item: any): DetailState | null {
    const type = itemType(item);
    if (type !== "album" && type !== "playlist" && type !== "artist") return null;
    const id = String(item?.id ?? "");
    if (!id) return null;
    return { kind: type, id, title: String(item?.name ?? type) };
  }

  function openDetail(item: any) {
    const next = toDetail(item);
    if (!next) return;
    if (detail) setDetailHistory((history) => [...history, detail]);
    else setDetailHistory([]);
    requestDetail(next);
  }

  function activateItem(item: any) {
    const type = itemType(item);
    if (type === "track") {
      void play(String(item?.uri ?? ""));
    } else if (type === "album" || type === "playlist" || type === "artist") {
      openDetail(item);
    }
  }

  function renderTrackRows(
    entries: any[],
    contextUri = "",
    albumImage = "",
    playAsList = false,
    focusFirst = false,
    focusRef: any = firstTrackRef,
  ) {
    const playableEntries = entries.filter((entry: any) => Boolean(normalizeTrack(entry)?.uri));
    return playableEntries.map((entry: any, index: number) => {
      const track = normalizeTrack(entry);
      const art = imageUrl(track) || albumImage;
      return (
        <SpotifyRow
          key={`${track.id ?? track.uri}-${index}`}
          item={track}
          buttonRef={focusFirst && index === 0 ? focusRef : undefined}
          preferredFocus={focusFirst && index === 0 && pendingListFocusRef.current}
          leadingImage={art}
          subtitle={artistText(track)}
          onActivate={() => {
            if (playAsList) void playTrackList(playableEntries, index);
            else void play(String(track.uri), contextUri, String(track.uri));
          }}
        />
      );
    });
  }

  const homePlaylists = useMemo(() => home?.playlists?.items ?? [], [home]);

  function tabButton(key: BrowserTab, label: string, icon: React.ReactNode) {
    const selected = tab === key && !detail;
    return (
      <DialogButton
        style={{ flex: 1, minWidth: 0, height: "32px", minHeight: "32px", padding: 0, opacity: selected ? 1 : 0.58 }}
        onClick={() => {
          requestSerial.current += 1;
          requestListFocus();
          setDetail(null);
          setDetailData(null);
          setDetailHistory([]);
          setShowAllArtistAlbums(false);
          setTab(key);
          if (key === "home" && !home) loadHome();
          if (key === "library" && !library) loadLibrary(librarySection);
        }}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "0.72em" }}>
          {icon}{label}
        </span>
      </DialogButton>
    );
  }

  function renderDetail() {
    if (!detail) return null;
    const payload = detailData;
    const item = payload?.item;
    const kind = detail.kind;
    const contextUri = String(item?.uri ?? `spotify:${kind}:${detail.id}`);
    const art = imageUrl(item);
    const trackEntries = payload?.tracks?.items ?? [];
    const popularTracks = payload?.topTracks?.tracks ?? [];
    const albums = payload?.albums?.items ?? [];
    const visibleAlbums = showAllArtistAlbums ? albums : albums.slice(0, 8);
    const primaryArtist = Array.isArray(item?.artists) ? item.artists.find((artist: any) => artist?.id) : null;

    return (
      <>
        <DialogButton style={fullButtonStyle} onClick={(event: any) => navigateBack(event)}>
          <span style={{ display: "flex", alignItems: "center", gap: "7px", justifyContent: "center", fontSize: "0.8em" }}>
            <FaArrowLeft /> {t.back}
          </span>
        </DialogButton>
        <div style={{ height: "10px" }} />
        <div
          style={{
            display: "flex",
            gap: "10px",
            padding: "10px",
            borderRadius: "10px",
            background: "linear-gradient(145deg, rgba(29,185,84,0.18), rgba(0,0,0,0.24))",
            border: "1px solid rgba(29,185,84,0.25)",
          }}
        >
          <SpotifyArtwork url={art} size={72} round={kind === "artist"} />
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: "0.68em", opacity: 0.55, textTransform: "uppercase", fontWeight: 800 }}>
              {kind === "artist" ? t.artist : kind === "album" ? t.album : t.playlist}
            </span>
            <strong style={{ fontSize: "1em", lineHeight: 1.16, marginTop: "4px" }}>{String(item?.name ?? detail.title)}</strong>
            <span style={{ fontSize: "0.7em", opacity: 0.62, marginTop: "4px" }}>{kind === "artist" ? t.artist : artistText(item)}</span>
          </div>
        </div>
        <div style={{ height: "8px" }} />
        <DialogButton
          style={{ ...fullButtonStyle, background: SPOTIFY_GREEN, color: "#fff" }}
          onClick={() => void play(contextUri)}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 800, fontSize: "0.8em" }}>
            <FaPlay /> {t.play}
          </span>
        </DialogButton>

        {kind === "album" && primaryArtist ? (
          <>
            <div style={{ height: "6px" }} />
            <DialogButton style={fullButtonStyle} onClick={() => openDetail(primaryArtist)}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8em", fontWeight: 700 }}>
                <FaUser /> {t.artist}
              </span>
            </DialogButton>
          </>
        ) : null}

        {kind === "artist" ? (
          <>
            <div style={sectionLabelStyle}>{t.popularTracks}</div>
            {popularTracks.length ? renderTrackRows(popularTracks, "", art, true, true) : !loading ? (
              <div style={{ fontSize: "0.74em", opacity: 0.58, padding: "8px" }}>{t.noTracks}</div>
            ) : null}

            <div style={sectionLabelStyle}>{t.albumsAndSingles}</div>
            {visibleAlbums.length ? visibleAlbums.map((album: any, index: number) => (
              <SpotifyRow key={`${album.id}-${index}`} item={album} onActivate={() => openDetail(album)} />
            )) : !loading ? <div style={{ fontSize: "0.74em", opacity: 0.58, padding: "8px" }}>{t.noAlbums}</div> : null}
            {albums.length > 8 ? (
              <DialogButton style={fullButtonStyle} onClick={() => setShowAllArtistAlbums((value) => !value)}>
                <span style={{ fontSize: "0.78em", fontWeight: 700 }}>{showAllArtistAlbums ? t.showLess : t.seeAll}</span>
              </DialogButton>
            ) : null}
          </>
        ) : (
          <>
            <div style={sectionLabelStyle}>{t.tracks}</div>
            {trackEntries.length ? renderTrackRows(trackEntries, contextUri, art, false, true) : !loading ? (
              <div style={{ fontSize: "0.72em", lineHeight: 1.4, opacity: 0.58, padding: "8px" }}>
                {payload?.limited ? t.limitedPlaylist : t.noTracks}
              </div>
            ) : null}
          </>
        )}
      </>
    );
  }

  function renderHome() {
    return (
      <>
        {homePlaylists.length ? (
          <>
            <div style={sectionLabelStyle}>{t.yourPlaylists}</div>
            {homePlaylists.map((item: any, index: number) => (
              <SpotifyRow
                key={`${item.id}-${index}`}
                item={item}
                buttonRef={index === 0 ? firstResultRef : undefined}
                preferredFocus={index === 0 && pendingListFocusRef.current}
                onActivate={() => activateItem(item)}
                sideAction={{ icon: <FaPlay size={12} />, label: t.play, onActivate: () => void play(String(item?.uri ?? "")) }}
              />
            ))}
          </>
        ) : null}
      </>
    );
  }

  function renderSearch() {
    const tracks = (searchResults?.tracks?.items ?? []).slice(0, 10);
    const albums = (searchResults?.albums?.items ?? []).slice(0, 10);
    const artists = (searchResults?.artists?.items ?? []).slice(0, 10);
    const playlists = (searchResults?.playlists?.items ?? []).slice(0, 10);
    const firstCategory = artists.length ? "artists" : albums.length ? "albums" : tracks.length ? "tracks" : playlists.length ? "playlists" : "";
    return (
      <>
        <div style={{ height: "8px" }} />
        <TextField
          label={t.searchSpotify}
          value={searchTerm}
          onChange={(value: any) => setSearchTerm(typeof value === "string" ? value : String(value?.target?.value ?? ""))}
          onKeyDown={(event: any) => {
            if (event?.key === "Enter" || event?.keyCode === 13) {
              event?.preventDefault?.();
              executeSearch();
            }
          }}
        />
        <div style={{ height: "6px" }} />
        <DialogButton
          style={{ ...fullButtonStyle, background: SPOTIFY_GREEN, color: "#fff" }}
          disabled={loading || searchTerm.trim().length < 2}
          onClick={executeSearch}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 800, fontSize: "0.8em" }}>
            <FaSearch /> {t.search}
          </span>
        </DialogButton>
        {artists.length ? <><div style={sectionLabelStyle}>{t.artists}</div>{artists.map((item: any, index: number) => <SpotifyRow key={`${item.id}-${index}`} item={item} buttonRef={firstCategory === "artists" && index === 0 ? firstResultRef : undefined} preferredFocus={firstCategory === "artists" && index === 0 && pendingListFocusRef.current} roundImage onActivate={() => openDetail(item)} />)}</> : null}
        {albums.length ? <><div style={sectionLabelStyle}>{t.albums}</div>{albums.map((item: any, index: number) => <SpotifyRow key={`${item.id}-${index}`} item={item} buttonRef={firstCategory === "albums" && index === 0 ? firstResultRef : undefined} preferredFocus={firstCategory === "albums" && index === 0 && pendingListFocusRef.current} onActivate={() => openDetail(item)} />)}</> : null}
        {tracks.length ? <><div style={sectionLabelStyle}>{t.tracks}</div>{renderTrackRows(tracks, "", "", false, firstCategory === "tracks", firstResultRef)}</> : null}
        {playlists.length ? <><div style={sectionLabelStyle}>{t.playlists}</div>{playlists.filter(Boolean).map((item: any, index: number) => <SpotifyRow key={`${item.id}-${index}`} item={item} buttonRef={firstCategory === "playlists" && index === 0 ? firstResultRef : undefined} preferredFocus={firstCategory === "playlists" && index === 0 && pendingListFocusRef.current} onActivate={() => openDetail(item)} sideAction={{ icon: <FaPlay size={12} />, label: t.play, onActivate: () => void play(String(item?.uri ?? "")) }} />)}</> : null}
        {searchResults && !tracks.length && !albums.length && !artists.length && !playlists.length && !loading ? (
          <div style={{ fontSize: "0.74em", opacity: 0.58, padding: "14px 8px", textAlign: "center" }}>{t.noResults}</div>
        ) : null}
      </>
    );
  }


  function renderLibrary() {
    const sectionIcons: Record<LibrarySection, React.ReactNode> = {
      tracks: <FaMusic />,
      albums: <FaCompactDisc />,
      playlists: <FaList />,
      artists: <FaUser />,
    };
    const sectionLabels: Record<LibrarySection, string> = {
      tracks: t.savedTracks,
      albums: t.savedAlbums,
      playlists: t.playlists,
      artists: t.followedArtists,
    };
    const items = librarySection === "artists"
      ? (library?.artists?.items ?? [])
      : (library?.items ?? []);
    return (
      <>
        <div style={{ height: "8px" }} />
        <Focusable style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", width: "100%" }} flow-children="grid">
          {(["tracks", "albums", "playlists", "artists"] as LibrarySection[]).map((section) => (
            <DialogButton
              key={section}
              style={{ ...fullButtonStyle, minWidth: 0, opacity: librarySection === section ? 1 : 0.58 }}
              onClick={() => loadLibrary(section, false)}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.74em", textTransform: "capitalize" }}>
                {sectionIcons[section]} {sectionLabels[section]}
              </span>
            </DialogButton>
          ))}
        </Focusable>
        <div style={sectionLabelStyle}>{sectionLabels[librarySection]}</div>
        {librarySection === "tracks" && items.length ? (
          <Focusable flow-children="horizontal" style={{ display: "flex", gap: "6px", marginBottom: "7px" }}>
            <DialogButton style={{ ...fullButtonStyle, flex: 1, minWidth: 0, background: SPOTIFY_GREEN, color: "#050505" }} onClick={() => void playTrackList(items, 0)}>
              <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 800, fontSize: "0.8em" }}><FaPlay /> {t.play}</span>
            </DialogButton>
            <DialogButton style={{ ...fullButtonStyle, flex: 1, minWidth: 0 }} onClick={() => { const shuffled = [...items].sort(() => Math.random() - .5); void playTrackList(shuffled, 0); }}>
              <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 700, fontSize: "0.8em" }}><FaRandom /> {t.shuffle}</span>
            </DialogButton>
          </Focusable>
        ) : null}
        {librarySection === "tracks" && compactSavedTracks ? (
          <div style={{ ...settingsCardStyle, marginTop: "8px", padding: "10px", fontSize: "0.7em", lineHeight: 1.42, opacity: 0.82 }}>
            <div>{t.compactSavedTracksCard}</div>
            {onOpenSettings ? <DialogButton style={{ ...fullButtonStyle, marginTop: "8px" }} onClick={onOpenSettings}><span style={{ fontSize: "0.82em" }}>{t.changeInSettings}</span></DialogButton> : null}
          </div>
        ) : null}
        {librarySection === "tracks" ? (compactSavedTracks ? null : renderTrackRows(items.slice(0, 100), "", "", true, true, firstResultRef)) : items.map((entry: any, index: number) => {
          const item = librarySection === "albums" ? normalizeAlbum(entry) : entry;
          return (
            <SpotifyRow
              key={`${item?.id ?? index}-${index}`}
              item={item}
              buttonRef={index === 0 ? firstResultRef : undefined}
              preferredFocus={index === 0 && pendingListFocusRef.current}
              roundImage={librarySection === "artists"}
              onActivate={() => activateItem(item)}
              sideAction={librarySection === "playlists" ? { icon: <FaPlay size={12} />, label: t.play, onActivate: () => void play(String(item?.uri ?? "")) } : undefined}
            />
          );
        })}
        {!items.length && !loading ? <div style={{ fontSize: "0.74em", opacity: 0.58, padding: "12px 8px", textAlign: "center" }}>{t.nothingHere}</div> : null}
      </>
    );
  }

  return (
    <>
      <style>{`
        .npSpotifyBrowser button:focus,
        .npSpotifyBrowser button.gpfocus {
          box-shadow: 0 0 0 1px rgba(29,185,84,0.55), 0 0 18px rgba(29,185,84,0.2) !important;
        }
        .npSpotifyBrowser input:focus {
          border-color: ${SPOTIFY_GREEN} !important;
        }
        .npSpotifyResultButton {
          scroll-margin-top: 64px;
        }
        .npSpotifyNavDock {
          position: sticky;
          top: -1px;
          z-index: 4;
          width: calc(100% + 8px);
          box-sizing: border-box;
          margin: -2px -4px 0;
          padding: 6px 4px 8px;
          background: transparent;
        }
        .npSpotifyBigPictureButton,
        .npSpotifyBigPictureButton:hover,
        .npSpotifyBigPictureButton:focus,
        .npSpotifyBigPictureButton.gpfocus,
        .npSpotifyBigPictureButton * {
          color: #fff !important;
        }
      `}</style>
      <Focusable
        ref={browserRootRef as any}
        className="npSpotifyBrowser"
        flow-children="vertical"
        onCancel={detail ? navigateBack : undefined}
        onCancelButton={detail ? navigateBack : undefined}
        style={{ width: "100%", boxSizing: "border-box" }}
      >
        <div
          aria-hidden="true"
          style={{
            height: "2px",
            margin: "2px 4px 4px",
            borderRadius: "999px",
            background: "linear-gradient(90deg, transparent, rgba(29,185,84,0.62), transparent)",
            boxShadow: "0 0 14px rgba(29,185,84,0.24)",
          }}
        />
        {!detail ? (
          <div className="npSpotifyNavDock">
            {onOpenBigPicture ? (
              <DialogButton
                className="npSpotifyBigPictureButton"
                style={{
                  ...fullButtonStyle,
                  marginBottom: "6px",
                  border: "1px solid rgba(255,255,255,0.075)",
                  background: "rgba(255,255,255,0.025)",
                }}
                onClick={onOpenBigPicture}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "0.76em", fontWeight: 430, letterSpacing: "0.012em", color: "#fff" }}>
                  <FaTv size={12} /> {t.spotifyBigPicture}
                </span>
              </DialogButton>
            ) : null}
            {rateLimitStatus.active ? (
              <DialogButton
                style={{
                  ...fullButtonStyle,
                  minHeight: "28px",
                  margin: "-2px 0 6px",
                  background: "transparent",
                  opacity: 0.78,
                }}
                onClick={() => toaster.toast({
                  title: "Spotify API",
                  body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }),
                  duration: 5000,
                })}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.68em", fontWeight: 500, color: "rgba(255,215,125,0.95)" }}>
                  <FaClock size={10} /> {formatSpotifyText(t.apiPaused, { time: formatCountdown(rateLimitStatus.remainingSeconds) })}
                </span>
              </DialogButton>
            ) : null}
            <Focusable style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "6px", width: "100%" }} flow-children="grid">
              {tabButton("home", t.home, <FaHome />)}
              {tabButton("search", t.search, <FaSearch />)}
              <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>{tabButton("library", t.library, <FaList />)}</div>
            </Focusable>
          </div>
        ) : null}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "10px", fontSize: "0.72em", opacity: 0.62 }}>
            <FaClock /> {t.loadingSpotify}
          </div>
        ) : null}
        {detail ? renderDetail() : tab === "home" ? renderHome() : tab === "search" ? renderSearch() : renderLibrary()}
      </Focusable>
    </>
  );
}



type SpotifyTvLocation =
  | { kind: "tab"; tab: BrowserTab; librarySection?: LibrarySection; focusKey?: string }
  | { kind: "detail"; detail: DetailState; focusKey?: string };

type SpotifyBigPictureProps = {
  onExit: () => void;
  onOpenVisualizer?: () => void;
  onOpenSettings?: () => void;
};

function formatTrackDuration(value: any): string {
  const totalSeconds = Math.max(0, Math.floor(Number(value || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function releaseYear(item: any): string {
  const value = String(item?.release_date ?? "").trim();
  const match = value.match(/^\d{4}/);
  return match?.[0] ?? "";
}

function spotifyDirectionFromKey(key: string) {
  if (key === "ArrowLeft" || key === "Left") return -1;
  if (key === "ArrowRight" || key === "Right") return 1;
  return 0;
}

function spotifyDirectionFromGamepadButton(button: unknown) {
  if (button === GamepadButton.DIR_LEFT) return -1;
  if (button === GamepadButton.DIR_RIGHT) return 1;
  return 0;
}

function spotifyGridDirectionFromKey(key: string) {
  if (key === "ArrowLeft" || key === "Left") return -1;
  if (key === "ArrowRight" || key === "Right") return 1;
  if (key === "ArrowUp" || key === "Up") return -6;
  if (key === "ArrowDown" || key === "Down") return 6;
  return 0;
}

function spotifyGridDirectionFromGamepad(button: unknown) {
  if (button === GamepadButton.DIR_LEFT) return -1;
  if (button === GamepadButton.DIR_RIGHT) return 1;
  if (button === GamepadButton.DIR_UP) return -6;
  if (button === GamepadButton.DIR_DOWN) return 6;
  return 0;
}

const spotifyGridFocusMoveState = new WeakMap<HTMLElement, { at: number; delta: number }>();

function stopSpotifyDirectionalEvent(event: any) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
  event?.nativeEvent?.stopImmediatePropagation?.();
}

function moveSpotifySixColumnGridFocus(event: any, delta: number) {
  if (!delta) return false;
  const eventTarget = event?.target as HTMLElement | null;
  const activeTarget = typeof document !== "undefined" ? document.activeElement as HTMLElement | null : null;
  const current = eventTarget?.closest?.<HTMLElement>("[data-np-grid-index]")
    ?? activeTarget?.closest?.<HTMLElement>("[data-np-grid-index]");
  const grid = current?.closest?.<HTMLElement>("[data-np-six-grid]");
  if (!current || !grid) return false;
  const currentIndex = Number(current.getAttribute("data-np-grid-index"));
  if (!Number.isFinite(currentIndex)) return false;
  const column = currentIndex % 6;
  if ((delta === -1 && column === 0) || (delta === 1 && column === 5)) return false;
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  const previousMove = spotifyGridFocusMoveState.get(grid);
  if (previousMove && previousMove.delta === delta && now - previousMove.at < 220) {
    stopSpotifyDirectionalEvent(event);
    return true;
  }
  const next = grid.querySelector<HTMLElement>(`[data-np-grid-index="${currentIndex + delta}"]`);
  if (!next) return false;
  spotifyGridFocusMoveState.set(grid, { at: now, delta });
  stopSpotifyDirectionalEvent(event);
  next.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  next.focus?.({ preventScroll: true });
  return true;
}


export function SpotifyTvCard({
  item,
  onActivate,
  round = false,
  preferredFocus = false,
  buttonRef,
  focusKey,
  gridIndex,
}: {
  item: any;
  onActivate: () => void;
  round?: boolean;
  preferredFocus?: boolean;
  buttonRef?: any;
  focusKey?: string;
  gridIndex?: number;
}) {
  const t = resolveSpotifyTranslations();
  const title = String(item?.name ?? t.untitled);
  const subtitle = itemType(item) === "album" && releaseYear(item)
    ? `${artistText(item)} · ${releaseYear(item)}`
    : artistText(item);
  return (
    <DialogButton
      ref={buttonRef}
      preferredFocus={preferredFocus}
      className="npSpotifyTvCard"
      {...({
        "data-np-focus-key": focusKey || undefined,
        "data-np-grid-index": Number.isFinite(gridIndex) ? gridIndex : undefined,
        onFocus: (event: any) => event?.currentTarget?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" }),
      } as any)}
      onClick={onActivate}
      style={{
        width: "100%",
        minWidth: 0,
        height: "auto",
        minHeight: 0,
        padding: "10px",
        borderRadius: "12px",
        overflow: "hidden",
        textAlign: "left",
      }}
    >
      <span style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", minWidth: 0 }}>
        <span
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: round ? "50%" : "8px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 18px 42px rgba(0,0,0,0.3)",
          }}
        >
          {imageUrl(item) ? (
            <img src={imageUrl(item)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <FaMusic size={42} style={{ opacity: 0.45 }} />
          )}
        </span>
        <strong style={{ marginTop: "12px", fontSize: "16px", lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 650 }}>
          {title}
        </strong>
        <span style={{ marginTop: "5px", fontSize: "13px", opacity: 0.58, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {subtitle}
        </span>
      </span>
    </DialogButton>
  );
}

export function SpotifyTvTrack({
  track,
  index,
  onActivate,
  preferredFocus = false,
  buttonRef,
  showArtwork = true,
  onFocus,
}: {
  track: any;
  index: number;
  onActivate: () => void;
  preferredFocus?: boolean;
  buttonRef?: any;
  showArtwork?: boolean;
  onFocus?: () => void;
}) {
  const normalized = normalizeTrack(track);
  return (
    <DialogButton
      ref={buttonRef}
      preferredFocus={preferredFocus}
      className="npSpotifyTvTrack"
      {...({ onFocus: (event: any) => {
        event?.currentTarget?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" });
        onFocus?.();
      } } as any)}
      onClick={onActivate}
      style={{
        width: "100%",
        minWidth: "100%",
        height: "66px",
        minHeight: "66px",
        padding: "0 16px",
        borderRadius: "10px",
        marginBottom: "6px",
        textAlign: "left",
      }}
    >
      <span
        style={{
          display: "grid",
          gridTemplateColumns: showArtwork ? "32px 48px minmax(0,1fr) auto" : "32px minmax(0,1fr) auto",
          alignItems: "center",
          gap: showArtwork ? "13px" : "16px",
          width: "100%",
        }}
      >
        <span style={{ opacity: 0.45, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{index + 1}</span>
        {showArtwork ? <SpotifyArtwork url={imageUrl(normalized)} size={44} /> : null}
        <span style={{ minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: "16px", fontWeight: 620, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {String(normalized?.name ?? "")}
          </strong>
          <span style={{ display: "block", marginTop: "4px", opacity: 0.56, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {artistText(normalized)}
          </span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "14px", opacity: 0.62 }}>
          {normalized?.duration_ms ? <span style={{ fontVariantNumeric: "tabular-nums", fontSize: "13px" }}>{formatTrackDuration(normalized.duration_ms)}</span> : null}
          <FaPlay size={13} />
        </span>
      </span>
    </DialogButton>
  );
}

export function SpotifyBigPicture({ onExit, onOpenVisualizer, onOpenSettings }: SpotifyBigPictureProps) {
  const t = useSpotifyTranslations();
  const coreT = useMemo(() => getTranslations("core"), []);
  const [tab, setTab] = useState<BrowserTab>("home");
  const [librarySection, setLibrarySection] = useState<LibrarySection>("tracks");
  const librarySectionRef = useRef<LibrarySection>("tracks");
  const [history, setHistory] = useState<SpotifyTvLocation[]>([]);
  const [detail, setDetail] = useState<DetailState | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [home, setHome] = useState<any>(null);
  const [library, setLibrary] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot>(() => {
    const player = getSharedSpotifyPlaybackSnapshot();
    return { selectedPlayer: player?.id ?? "", currentPlayer: player?.id ?? "", selected: player, players: player ? [player] : [] };
  });
  const [snapshotAt, setSnapshotAt] = useState(Date.now());
  const [coverUrl, setCoverUrl] = useState("");
  const [appVolume, setAppVolume] = useState(100);
  const [volumeReady, setVolumeReady] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState<SpotifyApiStatus>({ active: false, remainingSeconds: 0, until: 0 });
  const [settingsReady, setSettingsReady] = useState(false);
  const [compactSavedTracks, setCompactSavedTracks] = useState(true);
  const [libraryTrackVisibleCount, setLibraryTrackVisibleCount] = useState(120);
  const [detailTrackVisibleCount, setDetailTrackVisibleCount] = useState(120);
  const [restoreFocusKey, setRestoreFocusKey] = useState("");
  const [backgroundSettingsOpen, setBackgroundSettingsOpen] = useState(false);
  const requestSerial = useRef(0);
  const firstContentRef = useRef<any>(null);
  const playerCoverRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const homeTabRef = useRef<any>(null);
  const snapshotBusyRef = useRef(false);
  const coverRequestRef = useRef(0);
  const coverClearTimerRef = useRef<number>(0);
  const volumeTimerRef = useRef<number>(0);
  const volumeValueRef = useRef(100);
  const volumeInteractionAtRef = useRef(0);
  const volumeCommitInFlightRef = useRef(false);
  const volumeCommitQueuedRef = useRef(false);
  const volumeCommitRetryRef = useRef(0);
  const volumeObservedRef = useRef<{ value: number; count: number }>({ value: -1, count: 0 });
  const pendingRestoreFocusKeyRef = useRef("");
  const restoreFocusTimersRef = useRef<number[]>([]);
  const restoringTabRef = useRef<BrowserTab | null>(null);
  const restoringTabUntilRef = useRef(0);
  const spotifyPlaybackCacheRef = useRef<{ at: number; player: PlayerSnapshot | null; lastValidAt: number }>({ at: 0, player: null, lastValidAt: 0 });
  const rateLimitActiveRef = useRef(false);

  const current: PlayerSnapshot | null = useMemo(
    () => snapshot.selected ?? snapshot.players?.[0] ?? null,
    [snapshot],
  );
  const hasCurrent = Boolean(current?.title);
  const mediaKey = `${current?.id ?? ""}|${current?.title ?? ""}|${current?.artist ?? ""}|${current?.album ?? ""}`;
  const isPlaying = current?.status === "Playing";
  const durationMs = Math.max(0, Number(current?.length || 0));
  const basePositionMs = Math.max(0, Number(current?.position || 0));
  const stablePlayerArtwork = coverUrl || String(current?.artworkUrl ?? "");
  const albumGlowImage = detail?.kind === "artist"
    ? ""
    : detail?.kind === "album"
      ? imageUrl(detailData?.item)
      : (stablePlayerArtwork || imageUrl(home?.playlists?.items?.[0]));
  const artistBackgroundImage = detail?.kind === "artist" ? String(detailData?.backgroundImage ?? "") : "";
  const artistBackgroundFallback = detail?.kind === "artist" ? String(detailData?.backgroundFallbackImage ?? "") : "";
  const artistHeroImage = artistBackgroundImage || artistBackgroundFallback;
  const artistHeroIsFallback = Boolean(!artistBackgroundImage && artistBackgroundFallback);

  const refreshRateLimitStatus = useCallback(async () => {
    try {
      const status = await python.getSpotifyApiStatus();
      rateLimitActiveRef.current = Boolean(status.active);
      setRateLimitStatus((previous) => (
        previous.active === status.active
        && previous.remainingSeconds === status.remainingSeconds
        && previous.until === status.until
          ? previous
          : status
      ));
    } catch {
      // This is a local backend status call. Preserve the last value on failure.
    }
  }, []);

  const currentLocation = useCallback((): SpotifyTvLocation => {
    const active = document.activeElement as HTMLElement | null;
    const focusKey = active?.closest?.("[data-np-focus-key]")?.getAttribute("data-np-focus-key") ?? "";
    if (detail) return { kind: "detail", detail, focusKey };
    return { kind: "tab", tab, librarySection, focusKey };
  }, [detail, librarySection, tab]);

  const clearRestoreFocusTimers = useCallback(() => {
    restoreFocusTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    restoreFocusTimersRef.current = [];
  }, []);

  const restoreCardFocus = useCallback((focusKey?: string) => {
    const key = String(focusKey ?? "");
    clearRestoreFocusTimers();
    if (!key) {
      restoreFocusTimersRef.current = [window.setTimeout(() => firstContentRef.current?.focus?.(), 80)];
      return;
    }
    pendingRestoreFocusKeyRef.current = key;
    setRestoreFocusKey(key);
    const delays = [40, 120, 260, 520, 900, 1400];
    const attempt = () => {
      if (pendingRestoreFocusKeyRef.current !== key) return;
      const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(key) : key.replace(/["\\]/g, "\\$&");
      const root = document.querySelector<HTMLElement>(".npSpotifyBig");
      const element = root?.querySelector<HTMLElement>(`[data-np-focus-key="${escaped}"]`) ?? document.querySelector<HTMLElement>(`[data-np-focus-key="${escaped}"]`);
      if (!element) return;
      element.scrollIntoView?.({ block: "nearest", inline: "nearest" });
      element.focus?.({ preventScroll: true });
      if (document.activeElement === element) {
        setRestoreFocusKey(key);
        restoringTabRef.current = null;
        restoringTabUntilRef.current = 0;
      }
    };
    restoreFocusTimersRef.current = delays.map((delay) => window.setTimeout(attempt, delay));
    restoreFocusTimersRef.current.push(window.setTimeout(() => {
      restoringTabRef.current = null;
      restoringTabUntilRef.current = 0;
    }, 1600));
  }, [clearRestoreFocusTimers]);


  const handleApiError = useCallback((message: unknown) => {
    if (isSpotifyRateLimitMessage(message)) {
      void refreshRateLimitStatus();
      return;
    }
    showError(String(message ?? t.requestFailed));
  }, [refreshRateLimitStatus, t.requestFailed]);

  const run = useCallback(async <T,>(work: () => Promise<python.SpotifyApiResult<T>>, onSuccess: (data: T) => void, minimumVisibleMs = 0) => {
    const serial = ++requestSerial.current;
    const startedAt = Date.now();
    setLoading(true);
    try {
      const result = await work();
      if (serial !== requestSerial.current) return;
      if (!result?.ok) throw new Error(result?.error || t.requestFailed);
      onSuccess(result.data as T);
    } catch (error: any) {
      if (serial === requestSerial.current) handleApiError(error?.message ?? String(error));
    } finally {
      const remaining = minimumVisibleMs - (Date.now() - startedAt);
      if (remaining > 0) await new Promise<void>((resolve) => window.setTimeout(resolve, remaining));
      if (serial === requestSerial.current) setLoading(false);
    }
  }, [handleApiError, t.requestFailed]);

  const scrollPageTop = useCallback(() => {
    scrollRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
  }, []);

  const focusFirst = useCallback(() => {
    // Do not redirect focus away from tabs, category buttons, or the control used to navigate.
  }, []);

  const refreshSnapshot = useCallback(async (force = false) => {
    if (snapshotBusyRef.current || rateLimitActiveRef.current) return;
    const now = Date.now();
    // Poll roughly once a second: while the integrated bridge is ready the backend
    // serves its snapshot with no Web API call, so a track change (including an
    // automatic advance) shows within ~1 s instead of lagging 3-4 s behind audio.
    if (!force && now - spotifyPlaybackCacheRef.current.at < 1000) return;

    snapshotBusyRef.current = true;
    try {
      try {
        const result = await python.spotifyGetPlaybackState();
        const apiPlayer = result?.ok ? spotifyPlaybackToSnapshot(result.data) : null;
        const previous = spotifyPlaybackCacheRef.current;
        spotifyPlaybackCacheRef.current = apiPlayer
          ? { at: now, player: apiPlayer, lastValidAt: now }
          : { at: now, player: now - previous.lastValidAt <= 12000 ? previous.player : null, lastValidAt: previous.lastValidAt };

        if (apiPlayer) {
          // Publish title, artwork, timing and controls as one complete payload.
          // Between API polls the clock interpolates progress locally; the same
          // stale API position is never re-published every few hundred ms.
          publishSpotifyPlaybackSnapshot(apiPlayer);
        } else if (!spotifyPlaybackCacheRef.current.player) {
          publishSpotifyPlaybackSnapshot(null);
        }
      } catch {
        // Preserve the latest complete Spotify API payload through a transient
        // Spotify Connect handoff or a short network failure.
      }
    } finally {
      snapshotBusyRef.current = false;
    }
  }, []);

  useEffect(() => {
    let tries = 0;
    const focusHome = () => {
      const element = homeTabRef.current as HTMLElement | null;
      if (element && typeof element.focus === "function") { try { element.focus(); return; } catch { /* retry */ } }
      if (tries++ < 20) window.requestAnimationFrame(focusHome);
    };
    focusHome();
  }, []);

  useEffect(() => {
    const syncSharedPlayback = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : undefined;
      const player = detail && typeof detail === "object" ? detail as PlayerSnapshot : getSharedSpotifyPlaybackSnapshot();
      const now = getSharedSpotifyPlaybackTimestamp() || Date.now();
      if (!player) {
        spotifyPlaybackCacheRef.current = { at: now, player: null, lastValidAt: spotifyPlaybackCacheRef.current.lastValidAt };
        setSnapshot({ selectedPlayer: "", currentPlayer: "", selected: null, players: [] });
        setSnapshotAt(now);
        return;
      }
      spotifyPlaybackCacheRef.current = { at: now, player, lastValidAt: now };
      setSnapshot({ selectedPlayer: player.id, currentPlayer: player.id, selected: player, players: [player] });
      setSnapshotAt(now);
    };
    window.addEventListener(SPOTIFY_PLAYBACK_CHANGED_EVENT, syncSharedPlayback);
    return () => window.removeEventListener(SPOTIFY_PLAYBACK_CHANGED_EVENT, syncSharedPlayback);
  }, []);

  const loadHome = useCallback(() => {
    focusFirst();
    void run(() => python.spotifyGetHome(), setHome);
  }, [focusFirst, run]);

  const loadLibrary = useCallback((section: LibrarySection, force = false) => {
    librarySectionRef.current = section;
    setLibrarySection(section);
    focusFirst();
    const cached = spotifyLibrarySessionCache.get(section);
    if (!force && cached) {
      setLibrary(cached);
      setLoading(false);
      if (!(section === "tracks" && compactSavedTracks) && spotifyLibraryNeedsHydration(cached, section)) {
        hydrateSpotifyLibrary(section, (complete) => {
          if (librarySectionRef.current === section) setLibrary(complete);
        });
      }
      return;
    }
    void run(
      () => python.spotifyGetLibrary(section, 0, section === "tracks" && compactSavedTracks ? 50 : 120),
      (value) => {
        spotifyLibrarySessionCache.set(section, value);
        setLibrary(value);
        if (!(section === "tracks" && compactSavedTracks) && spotifyLibraryNeedsHydration(value, section)) {
          hydrateSpotifyLibrary(section, (complete) => {
            if (librarySectionRef.current === section) setLibrary(complete);
          });
        }
      },
    );
  }, [focusFirst, run, compactSavedTracks]);

  const compactInitBpRef = useRef(true);
  useEffect(() => {
    if (compactInitBpRef.current) { compactInitBpRef.current = false; return; }
    clearSpotifyLibrarySessionCaches();
    if (librarySection === "tracks") loadLibrary("tracks", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compactSavedTracks]);


  const requestDetail = useCallback((next: DetailState) => {
    setBackgroundSettingsOpen(false);
    setDetail(next);
    setDetailData(null);
    setDetailTrackVisibleCount(120);
    focusFirst();
    void run(() => python.spotifyGetDetail(next.kind, next.id), setDetailData, 900);
  }, [focusFirst, run]);

  useEffect(() => {
    setLibraryTrackVisibleCount(120);
  }, [librarySection, library]);

  const openDetail = useCallback((item: any, focusKey = "") => {
    const type = itemType(item);
    if (type !== "album" && type !== "playlist" && type !== "artist") return;
    const id = String(item?.id ?? "");
    if (!id) return;
    const location = currentLocation();
    setHistory((items) => [...items, focusKey ? { ...location, focusKey } : location]);
    requestDetail({ kind: type, id, title: String(item?.name ?? type) });
  }, [currentLocation, requestDetail]);

  const switchTab = useCallback((next: BrowserTab) => {
    // Ignore a stale Home selection only during the brief restore window after a
    // detail page. Deliberate tab changes remain available immediately.
    if (restoringTabRef.current && Date.now() < restoringTabUntilRef.current) {
      // Ignore only a transient Home request while the saved parent page is being
      // restored. Any deliberate change to another tab cancels the guard.
      if (next === "home" && restoringTabRef.current !== "home") return;
      if (next !== tab) {
        restoringTabRef.current = null;
        restoringTabUntilRef.current = 0;
      }
    }
    if (next === tab && !detail) return;
    clearRestoreFocusTimers();
    requestSerial.current += 1;
    setLoading(false);
    pendingRestoreFocusKeyRef.current = "";
    setRestoreFocusKey("");
    setDetail(null);
    setDetailData(null);
    setHistory([]);
    setTab(next);
    focusFirst();
    if (next === "home" && !home) loadHome();
    if (next === "library") loadLibrary(librarySection);
  }, [clearRestoreFocusTimers, detail, focusFirst, home, librarySection, loadHome, loadLibrary, tab]);

  const handleRootButtonDown = useCallback((event: any) => {
    if (detail) return;
    const button = event?.detail?.button;
    if (button !== GamepadButton.BUMPER_LEFT && button !== GamepadButton.BUMPER_RIGHT) return;
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const tabs = ["home", "search", "library", "settings"] as const;
    const index = Math.max(0, tabs.indexOf(tab));
    const delta = button === GamepadButton.BUMPER_RIGHT ? 1 : -1;
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    if (next === "settings") onOpenSettings?.();
    else switchTab(next);
    window.setTimeout(() => {
      const root = document.querySelector<HTMLElement>(".npSpotifyTvRoot");
      const content = root?.querySelector<HTMLElement>(".npSpotifyTabContent");
      if (content) {
        content.style.transform = "none";
        content.style.left = "0";
        content.style.width = "100%";
      }
      scrollRef.current?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
    }, 0);
  }, [detail, onOpenSettings, switchTab, tab]);

  const restoreLocation = useCallback((location: SpotifyTvLocation) => {
    requestSerial.current += 1;
    setLoading(false);
    if (location.kind === "detail") {
      requestDetail(location.detail);
      restoreCardFocus(location.focusKey);
      return;
    }
    restoringTabRef.current = location.tab;
    restoringTabUntilRef.current = Date.now() + 900;
    setDetail(null);
    setDetailData(null);
    setTab(location.tab);
    setLibrarySection(location.librarySection ?? "tracks");
    if (location.tab === "home" && !home) loadHome();
    if (location.tab === "library") loadLibrary(location.librarySection ?? "tracks");
    restoreCardFocus(location.focusKey);
  }, [home, library, loadHome, loadLibrary, requestDetail, restoreCardFocus]);

  const navigateBack = useCallback((event?: any) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (backgroundSettingsOpen) {
      setBackgroundSettingsOpen(false);
      return true;
    }
    const previous = history[history.length - 1];
    if (previous) {
      setHistory((items) => items.slice(0, -1));
      restoreLocation(previous);
      return true;
    }
    onExit();
    return true;
  }, [backgroundSettingsOpen, history, onExit, restoreLocation]);

  useEffect(() => {
    let cancelled = false;
    void python.getSpotifySettings().then((value) => {
      if (cancelled) return;
      setCompactSavedTracks(value.compactSavedTracks !== false);
      setSettingsReady(true);
    }).catch(() => {
      if (!cancelled) setSettingsReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    loadHome();
  }, [loadHome, settingsReady]);

  useEffect(() => () => clearRestoreFocusTimers(), [clearRestoreFocusTimers]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      navigateBack(event);
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [navigateBack]);

  useEffect(() => {
    rateLimitActiveRef.current = rateLimitStatus.active;
    if (rateLimitStatus.active) {
      const paused = spotifyPausedPlayer(t);
      setSnapshot({ selectedPlayer: paused.id, currentPlayer: paused.id, selected: paused, players: [paused] });
      setSnapshotAt(Date.now());
      publishSpotifyPlaybackSnapshot(paused);
      return;
    }
    spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
    void refreshSnapshot(true);
  }, [rateLimitStatus.active, refreshSnapshot, t]);

  useEffect(() => {
    void refreshSnapshot();
    const timer = window.setInterval(() => void refreshSnapshot(), 1000);
    return () => window.clearInterval(timer);
  }, [refreshSnapshot]);


  useEffect(() => {
    void refreshRateLimitStatus();
    const timer = window.setInterval(() => void refreshRateLimitStatus(), 1000);
    return () => window.clearInterval(timer);
  }, [refreshRateLimitStatus]);

  useEffect(() => {
    const requestId = ++coverRequestRef.current;
    if (!current?.title) {
      if (!coverClearTimerRef.current) {
        coverClearTimerRef.current = window.setTimeout(() => {
          coverClearTimerRef.current = 0;
          setCoverUrl("");
        }, 1200);
      }
      return;
    }
    if (coverClearTimerRef.current) {
      window.clearTimeout(coverClearTimerRef.current);
      coverClearTimerRef.current = 0;
    }
    let cancelled = false;
    const commitPreloadedCover = (url: string) => {
      if (!url || url === coverUrl) return;
      const image = new Image();
      image.onload = () => {
        if (!cancelled && requestId === coverRequestRef.current) setCoverUrl(url);
      };
      image.src = url;
    };
    const immediateArtwork = String(current.artworkUrl ?? "");
    if (immediateArtwork) {
      commitPreloadedCover(immediateArtwork);
      return () => { cancelled = true; };
    }
    void python.getCoverForService("spotify", current.title ?? "", current.artist ?? "", current.album ?? "")
      .then((url) => {
        if (url) commitPreloadedCover(url);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [current?.artworkUrl, mediaKey]);

  useEffect(() => () => {
    if (coverClearTimerRef.current) window.clearTimeout(coverClearTimerRef.current);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const saved = getSavedSourceVolume("spotify", 100);
    volumeValueRef.current = saved;
    setAppVolume(saved);
    setVolumeReady(false);

    const initialize = async () => {
      if (cancelled) return;
      try {
        const startedAt = Date.now();
        const result = await python.getAppVolume("spotify");
        if (cancelled || volumeInteractionAtRef.current > startedAt) return;
        if (result?.ok) {
          const actual = Math.max(0, Math.min(100, Number(result.volume ?? saved)));
          volumeValueRef.current = actual;
          setAppVolume(actual);
          saveSourceVolume("spotify", actual, "observed");
          setVolumeReady(true);
          return;
        }
      } catch {
        // The background player may still be creating its Windows audio session.
      }
      try {
        const applied = await python.setAppVolume(volumeValueRef.current, "spotify");
        if (!cancelled) setVolumeReady(Boolean(applied?.ok && !applied.stale));
      } catch {
        if (!cancelled) setVolumeReady(false);
      }
    };
    [0, 1400, 4200].forEach((delay) => timers.push(window.setTimeout(() => void initialize(), delay)));

    const syncVolume = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null;
      if (detail?.source !== "spotify") return;
      const next = Math.max(0, Math.min(100, Number(detail.volume ?? saved)));
      if (detail.origin !== "observed") volumeInteractionAtRef.current = Date.now();
      volumeValueRef.current = next;
      volumeObservedRef.current = { value: next, count: 0 };
      setAppVolume(next);
      setVolumeReady(true);
    };
    window.addEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let reading = false;
    const refreshVolume = async () => {
      if (reading || volumeCommitInFlightRef.current || volumeTimerRef.current) return;
      if (Date.now() - volumeInteractionAtRef.current < 800) return;
      reading = true;
      const startedAt = Date.now();
      try {
        const result = await python.getAppVolume("spotify");
        if (cancelled || !result?.ok || volumeInteractionAtRef.current > startedAt) return;
        const next = Math.max(0, Math.min(100, Number(result.volume ?? volumeValueRef.current)));
        const displayed = volumeValueRef.current;
        const differs = Math.abs(next - displayed) > 2;
        if (result.origin !== "spotify-connect" && differs && Date.now() - volumeInteractionAtRef.current < 15000) {
          if (!volumeCommitInFlightRef.current && !volumeTimerRef.current) {
            volumeCommitRetryRef.current = 0;
            volumeTimerRef.current = window.setTimeout(() => {
              volumeTimerRef.current = 0;
              flushVolumeCommit();
            }, 80);
          }
          return;
        }
        if (differs && result.origin !== "spotify-connect") {
          const observed = volumeObservedRef.current;
          volumeObservedRef.current = observed.value === next
            ? { value: next, count: observed.count + 1 }
            : { value: next, count: 1 };
          if (volumeObservedRef.current.count < 2) return;
        } else {
          volumeObservedRef.current = { value: next, count: 0 };
        }
        volumeValueRef.current = next;
        setAppVolume(next);
        setVolumeReady(true);
        saveSourceVolume("spotify", next, "observed");
      } catch {
        if (!cancelled) setVolumeReady(false);
      } finally {
        reading = false;
      }
    };
    const initialTimer = window.setTimeout(() => void refreshVolume(), 1600);
    const timer = window.setInterval(() => void refreshVolume(), 2500);
    return () => {
      cancelled = true;
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.(".npSpotifyCustomTab")) scrollPageTop();
    };
    document.addEventListener("focusin", onFocusIn, true);
    return () => document.removeEventListener("focusin", onFocusIn, true);
  }, [scrollPageTop]);

  async function executeSearch() {
    const query = searchTerm.trim();
    if (query.length < 2 || loading) return;
    focusFirst();
    void run(() => python.spotifySearch(query), setSearchResults);
  }

  async function play(uri: string, contextUri = "", offsetUri = "") {
    if (rateLimitStatus.active) {
      toaster.toast({ title: "Spotify API", body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }), duration: 5000 });
      return;
    }
    localAudioPlayer.stop();
    spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
    try {
      const result = await python.spotifyPlay(uri, contextUri, offsetUri);
      if (!result?.ok) throw new Error(result?.error || t.unableStartPlayback);
      notifySpotifyPlaybackChanged();
      window.setTimeout(() => void refreshSnapshot(), 260);
    } catch (error: any) {
      handleApiError(error?.message ?? String(error));
    }
  }

  async function playTrackList(entries: any[], startIndex = 0) {
    if (rateLimitStatus.active) {
      toaster.toast({ title: "Spotify API", body: formatSpotifyText(t.apiPausedDetail, { time: formatCountdown(rateLimitStatus.remainingSeconds) }), duration: 5000 });
      return;
    }
    localAudioPlayer.stop();
    const normalizedEntries = entries.map(normalizeTrack).filter(Boolean);
    spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
    const uris = normalizedEntries
      .map((track: any) => String(track?.uri ?? ""))
      .filter((uri: string) => uri.startsWith("spotify:track:") || uri.startsWith("spotify:episode:"));
    if (!uris.length) return;
    try {
      const result = await python.spotifyPlayItems(uris, Math.max(0, Math.min(startIndex, uris.length - 1)));
      if (!result?.ok) throw new Error(result?.error || t.unableStartPlayback);
      const optimistic = optimisticSpotifySnapshotFromTrack(entries[Math.max(0, Math.min(startIndex, entries.length - 1))]);
      if (optimistic) publishSpotifyPlaybackSnapshot(optimistic);
      notifySpotifyPlaybackChanged();
      window.setTimeout(() => void refreshSnapshot(), 260);
    } catch (error: any) {
      handleApiError(error?.message ?? String(error));
    }
  }

  function patchSpotifyPlayer(update: (player: PlayerSnapshot) => PlayerSnapshot) {
    const cached = spotifyPlaybackCacheRef.current;
    if (cached.player) spotifyPlaybackCacheRef.current = { ...cached, player: update(cached.player) };
    setSnapshot((previous) => {
      const player = previous.selected ?? previous.players?.[0];
      if (!player) return previous;
      const next = update(player);
      return { selectedPlayer: next.id, currentPlayer: next.id, selected: next, players: [next] };
    });
    setSnapshotAt(Date.now());
    const player = spotifyPlaybackCacheRef.current.player;
    if (player) publishSpotifyPlaybackSnapshot(player);
  }

  function runSpotifyPlayerAction(action: () => Promise<unknown>, optimistic?: () => void) {
    optimistic?.();
    void action().then(() => {
      notifySpotifyPlaybackChanged();
      spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
    }).catch(() => {});
    window.setTimeout(() => void refreshSnapshot(false), 260);
  }

  function changeVolume(value: number) {
    const next = Math.max(0, Math.min(100, Math.round(Number(value || 0))));
    volumeInteractionAtRef.current = Date.now();
    volumeValueRef.current = next;
    volumeObservedRef.current = { value: next, count: 0 };
    volumeCommitRetryRef.current = 0;
    setAppVolume(next);
    setVolumeReady(true);
    saveSourceVolume("spotify", next);
    if (volumeCommitInFlightRef.current) {
      volumeCommitQueuedRef.current = true;
      return;
    }
    if (volumeTimerRef.current) window.clearTimeout(volumeTimerRef.current);
    volumeTimerRef.current = window.setTimeout(() => {
      volumeTimerRef.current = 0;
      flushVolumeCommit();
    }, 45);
  }

  function flushVolumeCommit() {
    if (volumeCommitInFlightRef.current) {
      volumeCommitQueuedRef.current = true;
      return;
    }
    const requested = volumeValueRef.current;
    volumeCommitQueuedRef.current = false;
    volumeCommitInFlightRef.current = true;
    void python.setAppVolume(requested, "spotify")
      .then((result) => {
        if (!result?.ok) {
          setVolumeReady(false);
          return;
        }
        if (result.stale) return;
        setVolumeReady(true);
        if (volumeValueRef.current !== requested) return;
        const confirmed = Math.max(0, Math.min(100, Number(result.volume ?? requested)));
        if (Math.abs(confirmed - requested) <= 2) {
          volumeCommitRetryRef.current = 0;
          volumeValueRef.current = confirmed;
          setAppVolume(confirmed);
        } else if (volumeCommitRetryRef.current < 3) {
          volumeCommitRetryRef.current += 1;
          volumeCommitQueuedRef.current = true;
        }
      })
      .catch(() => setVolumeReady(false))
      .finally(() => {
        volumeCommitInFlightRef.current = false;
        if (volumeCommitQueuedRef.current || volumeValueRef.current !== requested) {
          volumeCommitQueuedRef.current = false;
          volumeTimerRef.current = window.setTimeout(() => {
            volumeTimerRef.current = 0;
            flushVolumeCommit();
          }, 80);
        }
      });
  }

  function nudgeVolume(delta: number) {
    changeVolume(volumeValueRef.current + delta);
  }

  function handleVolumeKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    const direction = spotifyDirectionFromKey(event.key);
    if (!direction) return;
    event.preventDefault();
    event.stopPropagation();
    nudgeVolume(direction);
  }

  function handleVolumeButtonDown(event: any) {
    const direction = spotifyDirectionFromGamepadButton(event?.detail?.button);
    if (!direction) return;
    event.preventDefault?.();
    event.stopPropagation?.();
    nudgeVolume(direction);
  }


  async function openCurrentAlbum() {
    if (!current?.title) return;
    try {
      const result = await python.spotifyGetCurrentAlbum(current.title ?? "", current.artist ?? "", current.album ?? "");
      if (!result?.ok) throw new Error(result?.error || t.requestFailed);
      const album = result.data?.album;
      if (album?.id) openDetail(album);
    } catch (error: any) {
      handleApiError(error?.message ?? String(error));
    }
  }

  const renderCardRow = (title: string, items: any[], round = false, firstRow = false) => {
    if (!items.length) return null;
    return (
      <section className="npSpotifyTvShelf" style={{ marginTop: "28px" }}>
        <h2 style={{ margin: "0 0 13px", fontSize: "25px", letterSpacing: "-0.02em", fontWeight: 650 }}>{title}</h2>
        <Focusable
          className="npSpotifyTvRow"
          flow-children="horizontal"
          style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "calc((100% - 60px) / 6)", gap: "12px", overflowX: "auto", overflowY: "hidden", width: "100%", padding: "8px 0 24px", scrollPaddingInline: "0px" as any }}
        >
          {items.slice(0, 20).map((item: any, index: number) => (
            <SpotifyTvCard
              key={`${item?.id ?? index}-${index}`}
              item={normalizeAlbum(item)}
              round={round}
              buttonRef={firstRow && index === 0 ? firstContentRef : undefined}
              focusKey={`shelf:${title}:${itemType(normalizeAlbum(item))}:${String(normalizeAlbum(item)?.id ?? index)}`}
              onActivate={() => openDetail(normalizeAlbum(item))}
            />
          ))}
        </Focusable>
      </section>
    );
  };

  function renderPlayerCard() {
    return (
      <Focusable
        className="npSpotifyNowPlayingCard"
        flow-children="grid"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "320px minmax(0, 1fr) minmax(330px, 24vw)",
          gap: "clamp(22px, 3vw, 44px)",
          alignItems: "stretch",
          width: "100%",
          minHeight: "368px",
          padding: "24px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.09)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.045) 48%, rgba(0,0,0,0.16))",
          backdropFilter: "blur(28px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
          overflow: "hidden",
        }}
      >
        {stablePlayerArtwork ? (
          <div
            className="npSpotifyPlayerGlow"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-40% -16% -70% -16%",
              background: `url(${stablePlayerArtwork}) center/cover no-repeat`,
              filter: "blur(110px) saturate(1.55)",
              opacity: 0.34,
              transform: "scale(1.1)",
              pointerEvents: "none",
            }}
          />
        ) : null}

        <DialogButton
          ref={playerCoverRef}
          className="npSpotifyCoverButton"
          disabled={!current?.title || rateLimitStatus.active}
          {...({ onFocus: scrollPageTop } as any)}
          onClick={() => { if (!rateLimitStatus.active) void openCurrentAlbum(); }}
          style={{
            position: "relative",
            width: "320px",
            minWidth: "320px",
            height: "320px",
            minHeight: "320px",
            padding: 0,
            borderRadius: "14px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.06)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.42)",
          }}
        >
          {stablePlayerArtwork ? (
            <img src={stablePlayerArtwork} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
              {rateLimitStatus.active ? <FaClock size={64} style={{ opacity: 0.42 }} /> : <FaMusic size={64} style={{ opacity: 0.3 }} />}
            </span>
          )}
        </DialogButton>

        <div style={{ position: "relative", minWidth: 0, alignSelf: "center" }}>
          {hasCurrent ? <>
            <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.58, fontWeight: 620 }}>{t.nowPlaying}</span>
            <h1 style={{ margin: "9px 0 0", fontSize: "clamp(38px, 4vw, 68px)", lineHeight: 1.08, letterSpacing: "-0.045em", fontWeight: 610, paddingBottom: "0.12em" }}>{String(current?.title ?? "")}</h1>
            <div style={{ marginTop: "12px", fontSize: "clamp(18px, 1.7vw, 27px)", opacity: 0.72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current?.artist}</div>
            {rateLimitStatus.active ? <div style={{ marginTop: "7px", fontSize: "16px", opacity: 0.58, fontVariantNumeric: "tabular-nums" }}>{formatCountdown(rateLimitStatus.remainingSeconds)}</div> : current?.album ? <div style={{ marginTop: "7px", fontSize: "16px", opacity: 0.45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current.album}</div> : null}
            {!rateLimitStatus.active ? <div style={{ marginTop: "28px" }}>
              <div style={{ height: "5px", borderRadius: "999px", background: "rgba(255,255,255,0.16)", overflow: "hidden" }}>
                <SmoothProgressFill position={basePositionMs} duration={durationMs} playing={isPlaying} sampledAt={snapshotAt} style={{ height: "100%", background: "#fff", borderRadius: "999px" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "13px", opacity: 0.48, fontVariantNumeric: "tabular-nums" }}><SmoothProgressTime position={basePositionMs} duration={durationMs} playing={isPlaying} sampledAt={snapshotAt} format={formatTrackDuration} /><span>{formatTrackDuration(durationMs)}</span></div>
            </div> : null}
          </> : <h1 style={{ margin: 0, fontSize: "clamp(34px, 3.4vw, 58px)", lineHeight: 1.08, letterSpacing: "-0.04em", fontWeight: 610 }}>{t.noPlayback}</h1>}
        </div>

        <div style={{ position: "relative", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Focusable flow-children="vertical" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch" }}>
            <Focusable flow-children="horizontal" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
            <DialogButton
              disabled={!hasCurrent || !current?.canPrevious}
              {...({ onFocus: scrollPageTop } as any)}
              onClick={() => runSpotifyPlayerAction(() => python.spotifyPlayerCommand("previous"))}
              style={{ width: "100%", minWidth: 0, height: "58px", minHeight: "58px", padding: 0 }}
            ><FaStepBackward size={18} /></DialogButton>
            <DialogButton
              disabled={!hasCurrent || (!current?.canTogglePlayPause && !(current?.canPlay || current?.canPause))}
              {...({ onFocus: scrollPageTop } as any)}
              onClick={() => runSpotifyPlayerAction(
                () => python.spotifyPlayerCommand(isPlaying ? "pause" : "play"),
                () => patchSpotifyPlayer((player) => ({ ...player, status: isPlaying ? "Paused" : "Playing" })),
              )}
              style={{ width: "100%", minWidth: 0, height: "58px", minHeight: "58px", padding: 0 }}
            >{isPlaying ? <FaPause size={21} /> : <FaPlay size={21} />}</DialogButton>
            <DialogButton
              disabled={!hasCurrent || !current?.canNext}
              {...({ onFocus: scrollPageTop } as any)}
              onClick={() => runSpotifyPlayerAction(() => python.spotifyPlayerCommand("next"))}
              style={{ width: "100%", minWidth: 0, height: "58px", minHeight: "58px", padding: 0 }}
            ><FaStepForward size={18} /></DialogButton>
            </Focusable>

            <Focusable flow-children="horizontal" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
            <DialogButton
              disabled={!hasCurrent || !current?.canShuffle}
              aria-label={t.shuffle}
              onClick={() => runSpotifyPlayerAction(
                () => python.spotifyPlayerCommand("shuffle", current?.shuffleActive ? 0 : 1),
                () => patchSpotifyPlayer((player) => ({ ...player, shuffleActive: !player.shuffleActive })),
              )}
              style={{ position: "relative", width: "100%", minWidth: 0, height: "46px", minHeight: "46px", padding: 0, opacity: current?.shuffleActive ? 1 : .62 }}
            >
              <FaRandom size={16} />
              {current?.shuffleActive ? <span aria-hidden="true" style={{ position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: SPOTIFY_GREEN, boxShadow: `0 0 8px ${SPOTIFY_GREEN}` }} /> : null}
            </DialogButton>
            <DialogButton
              disabled={!hasCurrent || !current?.canRepeat}
              aria-label={t.repeat}
              onClick={() => runSpotifyPlayerAction(
                () => python.spotifyPlayerCommand("repeat", current?.repeatMode === "Off" ? 1 : current?.repeatMode === "List" ? 2 : 0),
                () => patchSpotifyPlayer((player) => ({ ...player, repeatMode: player.repeatMode === "Off" ? "List" : player.repeatMode === "List" ? "Track" : "Off" })),
              )}
              style={{ position: "relative", width: "100%", minWidth: 0, height: "46px", minHeight: "46px", padding: 0, opacity: current?.repeatMode && !["None", "Off"].includes(current.repeatMode) ? 1 : .62 }}
            >
              <RepeatIcon one={current?.repeatMode === "Track"} size={17} />
              {current?.repeatMode && !["None", "Off"].includes(current.repeatMode) ? <span aria-hidden="true" style={{ position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: SPOTIFY_GREEN, boxShadow: `0 0 8px ${SPOTIFY_GREEN}` }} /> : null}
            </DialogButton>
            </Focusable>

            {onOpenVisualizer ? (
              <DialogButton
                className="npSpotifyBigPictureButton"
                disabled={rateLimitStatus.active}
                aria-label={t.fullscreen}
                {...({ onFocus: scrollPageTop } as any)}
                onClick={onOpenVisualizer}
                style={{ width: "100%", minWidth: 0, height: "46px", minHeight: "46px", border: "1px solid rgba(255,255,255,0.075)", background: "rgba(255,255,255,0.025)" }}
              ><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: ".82em", fontWeight: 430 }}><FaExpandArrowsAlt size={13} /> {t.fullscreen}</span></DialogButton>
            ) : null}

            <Focusable
              className="npSpotifyAppVolume"
              focusClassName="npSpotifyAppVolumeFocused"
              noFocusRing
              onActivate={() => undefined}
              onButtonDown={handleVolumeButtonDown}
              onKeyDown={handleVolumeKeyDown}
              role="slider"
              tabIndex={0}
              {...({ focusable: true } as any)}
              aria-label={t.volume}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(appVolume)}
              style={{ gridColumn: "1 / -1", opacity: volumeReady && !rateLimitStatus.active ? 1 : 0.46 }}
            >
              <span>{t.volume}</span>
              <input type="range" value={Math.round(appVolume)} min={0} max={100} step={1} disabled={!volumeReady || rateLimitStatus.active} tabIndex={-1} onChange={(event) => changeVolume(Number(event.currentTarget.value))} />
              <strong>{Math.round(appVolume)}%</strong>
            </Focusable>
          </Focusable>
        </div>
      </Focusable>
    );
  }



  function renderHomeTv() {
    const playlists = (home?.playlists?.items ?? []).filter(Boolean);
    return (
      <>
        {renderPlayerCard()}
        {renderCardRow(t.yourPlaylists, playlists)}
        {renderCardRow(t.newForYou, (home?.newForYou?.items ?? []).map(normalizeAlbum).filter(Boolean))}
      </>
    );
  }

  function renderSearchTv() {
    const tracks = (searchResults?.tracks?.items ?? []).slice(0, 10);
    const albums = (searchResults?.albums?.items ?? []).slice(0, 10);
    const artists = (searchResults?.artists?.items ?? []).slice(0, 10);
    const playlists = (searchResults?.playlists?.items ?? []).filter(Boolean).slice(0, 10);
    const firstType = artists.length ? "artist" : albums.length ? "album" : tracks.length ? "track" : playlists.length ? "playlist" : "input";
    return (
      <>
        <div style={{ width: "100%" }} onFocusCapture={scrollPageTop as any}>
          <TextField
            label={t.searchSpotify}
            value={searchTerm}
            style={{ width: "100%", minWidth: "100%" } as any}
            onChange={(value: any) => setSearchTerm(typeof value === "string" ? value : String(value?.target?.value ?? ""))}
            onKeyDown={(event: any) => {
              if (event?.key === "Enter" || event?.keyCode === 13) {
                event?.preventDefault?.();
                void executeSearch();
              }
            }}
          />
          <DialogButton
            ref={firstType === "input" ? firstContentRef : undefined}
            style={{ width: "180px", minWidth: "180px", height: "46px", marginTop: "10px" }}
            disabled={searchTerm.trim().length < 2 || loading}
            {...({ onFocus: scrollPageTop } as any)}
            onClick={() => void executeSearch()}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 550 }}><FaSearch /> {t.search}</span>
          </DialogButton>
        </div>
        {renderCardRow(t.artists, artists, true, firstType === "artist")}
        {renderCardRow(t.albums, albums, false, firstType === "album")}
        {tracks.length ? (
          <section style={{ marginTop: "28px" }}>
            <h2 style={{ fontSize: "25px", marginBottom: "13px", fontWeight: 650 }}>{t.tracks}</h2>
            <Focusable flow-children="vertical">
              {tracks.map((track: any, index: number) => (
                <SpotifyTvTrack
                  key={`${track?.id ?? index}-${index}`}
                  track={track}
                  index={index}
                  onActivate={() => void playTrackList(tracks, index)}
                />
              ))}
            </Focusable>
          </section>
        ) : null}
        {renderCardRow(t.playlists, playlists, false, firstType === "playlist")}
        {searchResults && !tracks.length && !albums.length && !artists.length && !playlists.length && !loading ? (
          <div style={{ marginTop: "38px", fontSize: "19px", opacity: 0.55 }}>{t.noResults}</div>
        ) : null}
      </>
    );
  }

  function switchLibrarySection(next: LibrarySection) {
    if (librarySection === next && library) {
      focusFirst();
      return;
    }
    loadLibrary(next);
  }

  function renderLibraryTv() {
    const labels: Record<LibrarySection, string> = {
      tracks: t.savedTracks,
      albums: t.albums,
      playlists: t.playlists,
      artists: t.artists,
    };
    const entries = librarySection === "artists" ? (library?.artists?.items ?? []) : (library?.items ?? []);
    const visible = librarySection === "tracks" ? entries.slice(0, libraryTrackVisibleCount) : entries;
    return (
      <>
        <Focusable flow-children="horizontal" style={{ display: "flex", gap: "9px", marginTop: "4px" }}>
          {(["tracks", "albums", "playlists", "artists"] as LibrarySection[]).map((section) => (
            <DialogButton
              key={section}
              {...({ onFocus: scrollPageTop } as any)}
              onClick={() => switchLibrarySection(section)}
              style={{ width: "166px", minWidth: "166px", height: "44px", borderRadius: "999px", opacity: librarySection === section ? 1 : 0.58 }}
            >
              <span style={{ fontWeight: librarySection === section ? 650 : 500 }}>{labels[section]}</span>
            </DialogButton>
          ))}
        </Focusable>
        <h2 style={{ margin: "26px 0 13px", fontSize: "27px", fontWeight: 650 }}>{labels[librarySection]}</h2>
        {librarySection === "tracks" ? (
          <>
            {entries.length ? (
              <Focusable flow-children="horizontal" style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <DialogButton style={{ width: "190px", minWidth: "190px", height: "46px" }} onClick={() => void playTrackList(entries, 0)}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 550 }}><FaPlay /> {t.play}</span>
                </DialogButton>
                <DialogButton style={{ width: "190px", minWidth: "190px", height: "46px" }} onClick={() => {
                  const shuffled = [...entries];
                  for (let index = shuffled.length - 1; index > 0; index -= 1) {
                    const swap = Math.floor(Math.random() * (index + 1));
                    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
                  }
                  void playTrackList(shuffled, 0);
                }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 550 }}><FaRandom /> {t.shuffle}</span>
                </DialogButton>
              </Focusable>
            ) : null}
            {compactSavedTracks ? (
              <div style={{ width: "390px", maxWidth: "100%", padding: "18px", borderRadius: "14px", border: "1px solid rgba(29,185,84,.24)", background: "rgba(29,185,84,.08)", lineHeight: 1.48, opacity: .84 }}>
                <div>{t.compactSavedTracksCard}</div>
                {onOpenSettings ? <DialogButton className="npSpotifyBigPictureButton" style={{ width: "100%", minWidth: "100%", height: "44px", marginTop: "12px", whiteSpace: "nowrap" }} onClick={onOpenSettings}><span style={{ fontSize: ".82em", whiteSpace: "nowrap" }}>{t.changeInSettings}</span></DialogButton> : null}
              </div>
            ) : (
              <Focusable flow-children="vertical">
                {visible.map((track: any, index: number) => (
                  <SpotifyTvTrack
                    key={`${normalizeTrack(track)?.id ?? index}-${index}`}
                    track={track}
                    index={index}
                    onFocus={() => {
                      if (index >= visible.length - 18 && visible.length < entries.length) {
                        setLibraryTrackVisibleCount((current) => Math.min(entries.length, current + 120));
                      }
                    }}
                    onActivate={() => void playTrackList(entries, index)}
                  />
                ))}
              </Focusable>
            )}
          </>
        ) : (
          <Focusable
            {...({ "data-np-six-grid": `spotify-library-${librarySection}` } as any)}
            flow-children="grid"
            navEntryPreferPosition={restoreFocusKey ? NavEntryPositionPreferences.PREFERRED_CHILD : NavEntryPositionPreferences.MAINTAIN_X}
            onKeyDownCapture={(event: any) => moveSpotifySixColumnGridFocus(event, spotifyGridDirectionFromKey(event?.key))}
            onGamepadDirection={(event: any) => moveSpotifySixColumnGridFocus(event, spotifyGridDirectionFromGamepad(event?.detail?.button))}
            style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "14px", alignItems: "start" }}
          >
            {visible.map((entry: any, index: number) => {
              const item = librarySection === "albums" ? normalizeAlbum(entry) : entry;
              const focusKey = `library:${librarySection}:${itemType(item)}:${String(item?.id ?? index)}`;
              return (
                <SpotifyTvCard
                  key={`${item?.id ?? index}-${index}`}
                  item={item}
                  round={librarySection === "artists"}
                  gridIndex={index}
                  focusKey={focusKey}
                  preferredFocus={restoreFocusKey === focusKey}
                  onActivate={() => openDetail(item, focusKey)}
                />
              );
            })}
          </Focusable>
        )}
        {!entries.length && !loading ? <div style={{ fontSize: "19px", opacity: 0.55 }}>{t.nothingHere}</div> : null}
      </>
    );
  }

  const backButton = (overlay = false) => (
    <DialogButton
      className="npSpotifyBackButton npSpotifyBigPictureButton"
      onClick={navigateBack}
      style={{
        position: overlay ? "absolute" : "relative",
        top: overlay ? "20px" : undefined,
        left: overlay ? "28px" : undefined,
        zIndex: 5,
        width: "108px",
        minWidth: "108px",
        height: "34px",
        minHeight: "34px",
        padding: 0,
        border: "1px solid rgba(255,255,255,0.075)",
        background: "rgba(255,255,255,0.035)",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.72em", fontWeight: 430, color: "#fff" }}>
        <FaArrowLeft size={11} /> {t.back}
      </span>
    </DialogButton>
  );

  function renderDetailTv() {
    if (!detail) return null;
    const item = detailData?.item;
    const tracks = detail.kind === "artist" ? (detailData?.topTracks?.tracks ?? []) : (detailData?.tracks?.items ?? []);
    const albums = detailData?.albums?.items ?? [];
    const visibleTracks = tracks.slice(0, detailTrackVisibleCount);
    const contextUri = String(item?.uri ?? `spotify:${detail.kind}:${detail.id}`);
    const albumArtist = item?.artists?.[0];
    const albumYear = detail.kind === "album" ? releaseYear(item) : "";
    const isArtist = detail.kind === "artist";
    const isAlbum = detail.kind === "album";

    if (backgroundSettingsOpen && isArtist) {
      return <ArtistBackgroundPicker
        provider="spotify"
        artistId={String(item?.id ?? detail.id ?? "")}
        artistName={String(item?.name ?? detail.title ?? "")}
        onBack={() => setBackgroundSettingsOpen(false)}
        onApplied={(url) => setDetailData((currentData: any) => currentData ? { ...currentData, backgroundImage: url } : currentData)}
      />;
    }

    if (isArtist) {
      return (
        <>
          <section
            className="npSpotifyArtistHero"
            style={{
              position: "relative",
              width: "100vw",
              height: "min(56.25vw, 720px)",
              minHeight: "430px",
              margin: "-18px -56px 0",
              overflow: "hidden",
              background: "#090909",
            }}
          >
            {artistHeroImage ? (
              <img
                src={artistHeroImage}
                onError={() => {
                  setDetailData((currentData: any) => currentData ? (currentData.backgroundImage
                    ? { ...currentData, backgroundImage: "" }
                    : { ...currentData, backgroundFallbackImage: "" }) : currentData);
                }}
                style={{
                  position: "absolute",
                  inset: artistHeroIsFallback ? "-8%" : 0,
                  width: artistHeroIsFallback ? "116%" : "100%",
                  height: artistHeroIsFallback ? "116%" : "100%",
                  objectFit: "cover",
                  objectPosition: "center center",
                  filter: artistHeroIsFallback ? "blur(30px) saturate(1.35) brightness(.72)" : "none",
                  transform: artistHeroIsFallback ? "scale(1.06)" : "none",
                }}
              />
            ) : null}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.04) 62%, rgba(0,0,0,0.14) 100%), linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 52%, rgba(0,0,0,0.72) 80%, #000 100%)",
              }}
            />
            {backButton(true)}
            <div style={{ position: "absolute", left: "46px", right: "46px", bottom: "46px", zIndex: 2 }}>
              <h1 style={{ margin: 0, fontSize: "clamp(58px, 7vw, 102px)", lineHeight: 1, letterSpacing: "-0.052em", fontWeight: 610 }}>
                {String(item?.name ?? detail.title)}
              </h1>
              <DialogButton
                ref={!tracks.length ? firstContentRef : undefined}
                style={{ width: "156px", minWidth: "156px", height: "48px", marginTop: "22px" }}
                onClick={() => void play(contextUri)}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 560 }}><FaPlay /> {t.play}</span>
              </DialogButton>
            </div>
          </section>

          <section style={{ marginTop: "22px" }}>
            <h2 style={{ margin: "0 0 13px", fontSize: "27px", fontWeight: 650 }}>{t.popularTracks}</h2>
            <Focusable flow-children="vertical">
              {visibleTracks.map((track: any, index: number) => (
                <SpotifyTvTrack
                  key={`${normalizeTrack(track)?.id ?? index}-${index}`}
                  track={track}
                  index={index}
                  onActivate={() => void playTrackList(tracks, index)}
                />
              ))}
            </Focusable>
            {!tracks.length && !loading ? <div style={{ fontSize: "19px", opacity: 0.55 }}>{t.noTracks}</div> : null}
          </section>
          {albums.length ? renderCardRow(t.albumsAndSingles, albums) : null}
          <DialogButton className="npSpotifyBigPictureButton" style={{ width: "250px", minWidth: "250px", height: "48px", marginTop: "26px" }} onClick={() => setBackgroundSettingsOpen(true)}>
            <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><FaCog /> {coreT.artistBackgroundSettings}</span>
          </DialogButton>
        </>
      );
    }

    return (
      <>
        {backButton(false)}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "250px minmax(0,1fr)",
            alignItems: "end",
            gap: "32px",
            marginTop: "20px",
            minHeight: "250px",
          }}
        >
          <div style={{ width: "250px", height: "250px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 30px 86px rgba(0,0,0,0.48)", background: "rgba(255,255,255,0.08)" }}>
            {imageUrl(item) ? <img src={imageUrl(item)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FaMusic size={68} style={{ margin: "91px", opacity: 0.4 }} />}
          </div>
          <div style={{ minWidth: 0, paddingBottom: "8px" }}>
            <div style={{ textTransform: "uppercase", letterSpacing: "0.13em", fontSize: "12px", fontWeight: 650, opacity: 0.58 }}>
              {isAlbum ? t.album : t.playlist}
            </div>
            <h1 style={{ margin: "10px 0 0", fontSize: "56px", lineHeight: 1.02, letterSpacing: "-0.052em", fontWeight: 610 }}>
              {String(item?.name ?? detail.title)}
            </h1>
            <div style={{ marginTop: "15px", fontSize: "17px", opacity: 0.64 }}>
              {artistText(item)}{albumYear ? ` · ${albumYear}` : ""}
            </div>
            <Focusable flow-children="horizontal" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "22px" }}>
              <DialogButton
                ref={!tracks.length ? firstContentRef : undefined}
                style={{ width: "156px", minWidth: "156px", height: "48px" }}
                onClick={() => void play(contextUri)}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 560 }}><FaPlay /> {t.play}</span>
              </DialogButton>
              {isAlbum && albumArtist?.id ? (
                <DialogButton style={{ width: "156px", minWidth: "156px", height: "48px" }} onClick={() => openDetail({ ...albumArtist, type: "artist" })}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 520 }}><FaUser /> {t.artist}</span>
                </DialogButton>
              ) : null}
            </Focusable>
          </div>
        </div>

        <section style={{ marginTop: "30px" }}>
          <h2 style={{ margin: "0 0 13px", fontSize: "27px", fontWeight: 650 }}>{t.tracks}</h2>
          <Focusable flow-children="vertical">
            {visibleTracks.map((track: any, index: number) => (
              <SpotifyTvTrack
                key={`${normalizeTrack(track)?.id ?? index}-${index}`}
                track={track}
                index={index}
                showArtwork={!isAlbum}
                onFocus={() => {
                  if (index >= visibleTracks.length - 18 && visibleTracks.length < tracks.length) {
                    setDetailTrackVisibleCount((current) => Math.min(tracks.length, current + 120));
                  }
                }}
                onActivate={() => isAlbum
                  ? void play(String(normalizeTrack(track)?.uri ?? ""), contextUri, String(normalizeTrack(track)?.uri ?? ""))
                  : void playTrackList(tracks, index)}
              />
            ))}
          </Focusable>
          {!tracks.length && !loading ? <div style={{ fontSize: "19px", opacity: 0.55 }}>{t.noTracks}</div> : null}
        </section>
      </>
    );
  }

  const renderTabPage = (page: BrowserTab, content: React.ReactNode) => (
    <main
      key={page}
      ref={tab === page ? scrollRef : undefined}
      className="npSpotifyTvScroll"
      style={{ position: "absolute", inset: 0, height: "auto", overflowY: "auto", overflowX: "hidden", padding: "112px 56px 300px", scrollPaddingTop: 112, scrollPaddingBottom: 250, zIndex: 10 }}
    >
      <div className="npSpotifyTabContent" style={{ position: "relative", zIndex: 1, width: "100%" }}>{content}</div>
    </main>
  );

  const activeTabContent = tab === "home"
    ? renderHomeTv()
    : tab === "search"
      ? renderSearchTv()
      : renderLibraryTv();

  return (
    <Focusable
      className="npSpotifyTvRoot npFullscreenRoot"
      flow-children="vertical"
      onCancel={navigateBack}
      onCancelButton={navigateBack}
      onButtonDown={handleRootButtonDown}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 10, background: "#070707", color: "#fff", overflow: "hidden", outline: "none" }}
    >
      <style>{`
        .npSpotifyTvRoot, .npSpotifyTvRoot * { box-sizing: border-box; }
        .npSpotifyTvRoot button { transition: background 120ms ease, box-shadow 120ms ease, opacity 120ms ease !important; }
        .npSpotifyTvRoot button:focus, .npSpotifyTvRoot button.gpfocus { transform: none !important; z-index: 12; }
        .npSpotifyTvRoot button, .npSpotifyTvRoot [tabindex] { scroll-margin-top: 112px; }
        .npSpotifyCustomTabs { z-index: 200 !important; isolation: isolate; transform: none !important; }
        .npSpotifyTvScroll { z-index: 10 !important; }
        .npSpotifyTabContent { left: 0 !important; right: auto !important; width: 100% !important; max-width: 100% !important; transform-origin: center top !important; }
        body > [class*="virtualkeyboard"], body > [class*="VirtualKeyboard"], body [class*="virtualkeyboard_Keyboard"], body [class*="VirtualKeyboard_Keyboard"] { z-index: 2147483647 !important; }
        .npSpotifyTvCard:focus, .npSpotifyTvCard.gpfocus, .npSpotifyTvTrack:focus, .npSpotifyTvTrack.gpfocus { transform: none !important; }
        .npSpotifyTvCard { width:100% !important; min-width:0 !important; max-width:100% !important; margin:0 !important; }
        .npSpotifyCoverButton:focus, .npSpotifyCoverButton.gpfocus { box-shadow: 0 0 0 3px rgba(255,255,255,0.88), 0 0 0 6px rgba(29,185,84,0.48), 0 24px 70px rgba(0,0,0,0.42) !important; }
        .npSpotifyTvRow { scroll-padding-inline: 0; overscroll-behavior-inline: contain; }
        .npSpotifyTvRow::-webkit-scrollbar { display:none; }
        .npSpotifyTvScroll::-webkit-scrollbar { width:7px; height:7px; }
        .npSpotifyTvScroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,.16); border-radius:999px; }
        .npSpotifyTvRoot input { font-size: 21px !important; }
        .npSpotifyBigPictureButton, .npSpotifyBigPictureButton * { color: #fff !important; }
        .npSpotifyBigPictureButton:hover, .npSpotifyBigPictureButton:focus, .npSpotifyBigPictureButton.gpfocus { color:#fff!important;background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.25)!important;box-shadow:0 0 0 1px rgba(29,185,84,.30),0 0 20px rgba(29,185,84,.17)!important; }
        .npSpotifyAppVolume {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 84px minmax(0, 1fr) 52px;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 8px 10px;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.075);
          background: rgba(255,255,255,0.025);
          color: rgba(255,255,255,0.84);
          font-size: 15px;
          line-height: 1.15;
          outline: none;
          overflow: hidden;
        }
        .npSpotifyAppVolume.npSpotifyAppVolumeFocused, .npSpotifyAppVolume:focus-visible {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.13);
          box-shadow: 0 0 0 1px rgba(29,185,84,0.30), 0 0 20px rgba(29,185,84,0.17);
        }
        .npSpotifyAppVolume span, .npSpotifyAppVolume strong { min-width: 0; font-size: 1em; line-height: 1.15; font-weight: 500; }
        .npSpotifyAppVolume strong { text-align: right; font-weight: 700; }
        .npSpotifyAppVolume input[type="range"] { min-width: 0; width: 100%; height: 18px; margin: 0; padding: 0; accent-color: #1DB954; }
        .npSpotifyAppVolume input[type="range"]::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: rgba(255,255,255,0.18); }
        .npSpotifyAppVolume input[type="range"]::-webkit-slider-thumb { width: 14px; height: 14px; margin-top: -4px; border-radius: 999px; }
        .npSpotifyCustomTab, .npSpotifyCustomTab * { color:#fff!important; }
        .npSpotifyCustomTab { border:1px solid rgba(255,255,255,.075)!important; background:rgba(255,255,255,.025)!important; }
        .npSpotifyCustomTab:hover, .npSpotifyCustomTab:focus, .npSpotifyCustomTab.gpfocus { background:rgba(255,255,255,.13)!important; border-color:rgba(255,255,255,.25)!important; box-shadow:0 0 0 1px rgba(29,185,84,.30),0 0 20px rgba(29,185,84,.17)!important; }
        .npSpotifyCustomTabActive { background:rgba(29,185,84,.18)!important; border-color:rgba(29,185,84,.46)!important; }
        .npSpotifyTvScroll { position:absolute!important; inset:0!important; height:auto!important; min-height:0!important; overflow-y:auto!important; overflow-x:hidden!important; overscroll-behavior:contain; }
        .npSpotifyPlayerGlow { animation: npSpotifyPlayerGlow 5.6s ease-in-out infinite alternate; transform-origin:50% 50%; }
        @keyframes npSpotifyPlayerGlow { from { transform:scale(1.02); opacity:.28; } to { transform:scale(1.12); opacity:.42; } }
        .npSpotifyTabContent { animation: npSpotifyTabEnter 150ms ease both; }
        @keyframes npSpotifyTabEnter { from { opacity: 0.78; } to { opacity: 1; } }
        .npSpotifyArtistLoading { position:absolute; inset:0; z-index:260; display:flex; align-items:center; justify-content:center; background:#000; pointer-events:auto; }
        .npSpotifyArtistLoadingLogo { color:#fff; animation:npSpotifyArtistLoadingPulse 2.4s ease-in-out infinite; }
        .npSpotifyArtistPageReady { animation:npSpotifyArtistPageReveal 480ms ease both; }
        @keyframes npSpotifyArtistLoadingPulse { 0%,100% { opacity:.18; transform:scale(.94); } 50% { opacity:1; transform:scale(1); } }
        @keyframes npSpotifyArtistPageReveal { from { opacity:0; } to { opacity:1; } }
      `}</style>

      {albumGlowImage ? (
        <div aria-hidden="true" style={{ position: "absolute", inset: "-34% -22% -30% -10%", background: `url(${albumGlowImage}) center/cover no-repeat`, filter: "blur(138px) saturate(1.58)", opacity: 0.52, transform: "scale(1.34)", pointerEvents: "none", zIndex: 0 }} />
      ) : null}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: detail?.kind === "artist" ? "#000" : "linear-gradient(90deg, rgba(7,7,7,0.66) 0%, rgba(7,7,7,0.26) 46%, rgba(7,7,7,0.20) 100%), linear-gradient(180deg, rgba(7,7,7,0.03), rgba(7,7,7,0.50) 76%, #070707 100%)", pointerEvents: "none" }} />

      {loading && detail && ["artist", "album", "playlist"].includes(detail.kind) ? (
        <div className="npSpotifyArtistLoading" role="status" aria-label={t.loadingSpotify}>
          <SiSpotify className="npSpotifyArtistLoadingLogo" size={112} />
        </div>
      ) : null}

      {rateLimitStatus.active ? (
        <div
          aria-live="polite"
          style={{ position: "absolute", top: "20px", right: "28px", zIndex: 90, width: "210px", minWidth: "210px", height: "34px", minHeight: "34px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "7px", background: "rgba(35,26,10,0.48)", border: "1px solid rgba(255,211,120,0.18)", pointerEvents: "none", textAlign: "center" }}
        >
          <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", fontSize: "0.72em", color: "rgba(255,220,145,0.96)", textAlign: "center" }}><FaClock /> {formatSpotifyText(t.apiPaused, { time: formatCountdown(rateLimitStatus.remainingSeconds) })}</span>
        </div>
      ) : loading && !detail ? (
        <div style={{ position: "absolute", top: "28px", right: "32px", display: "flex", alignItems: "center", gap: "8px", opacity: 0.58, zIndex: 24 }}>
          <FaSyncAlt className="npSpotifyTvLoadingIcon" /> {t.loadingSpotify}
        </div>
      ) : null}

      {!detail ? (
        <>
          <Focusable className="npSpotifyCustomTabs" flow-children="horizontal" onButtonDown={(event: any) => { if (event?.detail?.button === GamepadButton.DIR_UP) { event?.preventDefault?.(); event?.stopPropagation?.(); } }} style={{ position: "absolute", top: 24, left: 56, zIndex: 200, display: "flex", alignItems: "center", gap: 8 }}>
            {([[
              "home", t.home, FaHome,
            ], [
              "search", t.search, FaSearch,
            ], [
              "library", t.library, FaList,
            ], [
              "settings", t.settings, FaCog,
            ]] as const).map(([id, label, Icon]) => (
              <DialogButton key={id} ref={id === "home" ? homeTabRef : undefined} className={`npSpotifyCustomTab${id !== "settings" && tab === id ? " npSpotifyCustomTabActive" : ""}`} onClick={() => id === "settings" ? onOpenSettings?.() : switchTab(id)} style={{ width: 138, minWidth: 138, height: 38, minHeight: 38, padding: 0 }}>
                <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".76em", fontWeight: 540 }}><Icon size={13} /> {label}</span>
              </DialogButton>
            ))}
          </Focusable>
          {renderTabPage(tab, activeTabContent)}
        </>
      ) : (
        <main ref={scrollRef} className="npSpotifyTvScroll" style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", padding: "18px 56px 300px", scrollPaddingBottom: 250, zIndex: 2 }}>
          <div className={detailData && !loading ? "npSpotifyArtistPageReady" : undefined} style={{ position: "relative", zIndex: 1, width: "100%" }}>{renderDetailTv()}</div>
        </main>
      )}
    </Focusable>
  );
}

export const SpotifyBrowser = memo(SpotifyBrowserContent);
