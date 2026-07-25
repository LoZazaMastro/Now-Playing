import { DialogButton, Focusable, GamepadButton, TextField } from "@decky/ui";
import { toaster } from "@decky/api";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  FaArrowLeft,
  FaCog,
  FaExpandArrowsAlt,
  FaHome,
  FaList,
  FaMusic,
  FaPause,
  FaPlay,
  FaRandom,
  FaSearch,
  FaSignOutAlt,
  FaStepBackward,
  FaStepForward,
  FaSyncAlt,
  FaTimes,
  FaTv,
  FaUser,
} from "react-icons/fa";
import { SiYoutubemusic } from "react-icons/si";
import * as python from "./python";
import { RepeatIcon } from "./repeatIcon";
import { ArtistBackgroundPicker } from "./artistBackground";
import { localAudioPlayer, useLocalAudioState } from "./localAudio";
import { getTranslations, localizeRuntimeMessage } from "./i18n";
import type { YouTubeMusicTranslation } from "./i18n";
import { SmoothProgressFill, SmoothProgressTime } from "./smoothProgress";
import { SpotifyArtwork, SpotifyRow, SpotifyTvCard, SpotifyTvTrack } from "./spotify";
import { getSavedSourceVolume, saveSourceVolume, SOURCE_VOLUME_CHANGED_EVENT } from "./sourceVolume";

const YOUTUBE_RED = "#ff0033";
type BrowserTab = "home" | "search" | "library";
type LibrarySection = "tracks" | "albums" | "playlists" | "artists";
type DetailState = { kind: "album" | "playlist" | "artist"; id: string; title: string; data?: any } | null;

const fullButton: CSSProperties = {
  width: "100%",
  minWidth: "100%",
  maxWidth: "100%",
  height: "34px",
  minHeight: "34px",
  padding: 0,
  lineHeight: 1,
};
const sectionLabel: CSSProperties = { padding: "0 4px", margin: "14px 0 6px", fontSize: ".74em", fontWeight: 800, letterSpacing: ".035em", textTransform: "uppercase", opacity: .62 };
const settingsCard: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  border: "1px solid rgba(255,0,51,.28)",
  background: "linear-gradient(145deg,rgba(255,0,51,.12),rgba(0,0,0,.22))",
  padding: "12px",
};

function translations(): YouTubeMusicTranslation {
  return getTranslations("youtubeMusic");
}

function imageUrl(item: any): string {
  const images = Array.isArray(item?.images) && item.images.length
    ? item.images
    : Array.isArray(item?.album?.images) ? item.album.images : [];
  if (!images.length) return "";
  const sorted = [...images].filter((entry: any) => entry?.url).sort((left: any, right: any) => Number(right?.width || 0) * Number(right?.height || 0) - Number(left?.width || 0) * Number(left?.height || 0));
  return String(sorted[0]?.url ?? "");
}

function artistText(item: any): string {
  const artists = Array.isArray(item?.artists) ? item.artists : [];
  return artists.map((artist: any) => String(artist?.name ?? "")).filter(Boolean).join(", ") || String(item?.owner?.display_name ?? "");
}

function itemType(item: any): "track" | "album" | "artist" | "playlist" | "unknown" {
  const type = String(item?.type ?? "").toLowerCase();
  return type === "track" || type === "album" || type === "artist" || type === "playlist" ? type : "unknown";
}

function formatTime(value: number) {
  const seconds = Math.max(0, Math.floor(Number(value || 0) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function notifyError(error: unknown) {
  const t = translations();
  toaster.toast({ title: "YouTube Music", body: localizeRuntimeMessage(error, t.genericError), duration: 4500 });
}

function libraryItems(payload: any, section: LibrarySection): any[] {
  const value = section === "artists" ? payload?.artists?.items : payload?.items;
  return Array.isArray(value) ? value : [];
}

function shuffledCopy<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

let streamPrefetchTimer = 0;
const prefetchedStreams = new Set<string>();

function prefetchTrack(item: any) {
  if (itemType(item) !== "track") return;
  const videoId = String(item?.videoId ?? item?.id ?? "").trim();
  if (!videoId || prefetchedStreams.has(videoId) || typeof window === "undefined") return;
  if (streamPrefetchTimer) window.clearTimeout(streamPrefetchTimer);
  streamPrefetchTimer = window.setTimeout(() => {
    streamPrefetchTimer = 0;
    prefetchedStreams.add(videoId);
    while (prefetchedStreams.size > 80) {
      const oldest = prefetchedStreams.values().next().value;
      if (!oldest) break;
      prefetchedStreams.delete(oldest);
    }
    void python.youtubeMusicPrepareStream(videoId).then((result) => {
      if (!result?.ok) prefetchedStreams.delete(videoId);
    }).catch(() => prefetchedStreams.delete(videoId));
  }, 90);
}

async function playItems(items: any[], index = 0) {
  const tracks = items.filter((item) => itemType(item) === "track" && String(item?.videoId ?? item?.id ?? "").trim());
  if (!tracks.length) return;
  const selectedIndex = Math.max(0, Math.min(index, tracks.length - 1));
  const selected = tracks[selectedIndex];
  const videoId = String(selected?.videoId ?? selected?.id ?? "").trim();
  try {
    // Resolve the new stream while the current source is still audible. Once the
    // URL is cached, the source switch and HTMLAudio handoff happen back-to-back
    // instead of leaving one or two seconds of silence after the title changes.
    if (videoId) {
      const prepared = await python.youtubeMusicPrepareStream(videoId);
      if (!prepared?.ok || !prepared.data?.url) throw new Error(String(prepared?.error ?? "YouTube Music stream is unavailable"));
    }
    await python.pauseExternalPlayback().catch(() => false);
    await localAudioPlayer.playItems(tracks, selectedIndex);
  } catch (error) {
    notifyError(error);
  }
}

export function YouTubeMusicSettingsPanel({ selectedService = "youtubeMusic" }: { selectedService?: string }) {
  const t = useMemo(translations, []);
  const [settings, setSettings] = useState<python.YouTubeMusicSettings>({ authenticated: false, audioQuality: "high" });
  const [headers, setHeaders] = useState("");
  const [busy, setBusy] = useState(false);
  const [authRunning, setAuthRunning] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showManualAuth, setShowManualAuth] = useState(false);

  const reload = useCallback(() => { void python.getYouTubeMusicSettings().then(setSettings).catch(notifyError); }, []);
  useEffect(reload, [reload]);

  useEffect(() => {
    void python.getYouTubeMusicBrowserAuthStatus().then((result) => {
      if (!result.ok || !result.data) return;
      setAuthRunning(Boolean(result.data.running));
      if (result.data.running) setBusy(true);
      if (result.data.error) setAuthError(result.data.error);
      if (result.data.settings?.authenticated) setSettings(result.data.settings);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!authRunning) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const result = await python.getYouTubeMusicBrowserAuthStatus();
        if (cancelled || !result.ok || !result.data) return;
        const status = result.data;
        if (status.settings?.authenticated) setSettings(status.settings);
        if (!status.running) {
          setAuthRunning(false);
          setBusy(false);
          if (status.phase === "connected" && status.settings) {
            setSettings(status.settings);
            toaster.toast({ title: "YouTube Music", body: t.connected, duration: 2400 });
          } else if (status.error) {
            setAuthError(status.error);
          }
        }
      } catch {
        // A later poll can recover while the browser sign-in remains active.
      }
    };
    void poll();
    const timer = window.setInterval(() => void poll(), 750);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [authRunning, t.connected]);

  const startAutomaticAuth = async () => {
    if (busy) return;
    setBusy(true);
    setAuthError("");
    setShowManualAuth(false);
    try {
      const result = await python.startYouTubeMusicBrowserAuth();
      if (!result.ok || !result.data) throw new Error(result.error || t.requestFailed);
      setAuthRunning(Boolean(result.data.running));
      if (!result.data.running) setBusy(false);
    } catch (error) {
      setBusy(false);
      setAuthRunning(false);
      const message = localizeRuntimeMessage(error, t.genericError);
      setAuthError(message);
      notifyError(error);
    }
  };

  const run = async (operation: () => Promise<python.SpotifyApiResult<python.YouTubeMusicSettings>>, message?: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await operation();
      if (!result.ok || !result.data) throw new Error(result.error || t.requestFailed);
      setSettings(result.data);
      if (message) toaster.toast({ title: "YouTube Music", body: message, duration: 2400 });
    } catch (error) {
      notifyError(error);
    } finally {
      setBusy(false);
    }
  };

  // Artist-background cache — independent YouTube Music store (mirrors Spotify's
  // section, red accent). Shared cache-UI strings come from the Spotify catalog.
  const st = useMemo(() => getTranslations("spotify"), []);
  const [artistCacheBusy, setArtistCacheBusy] = useState(false);
  const [artistCacheProgress, setArtistCacheProgress] = useState<python.SpotifyArtistCacheProgress>({ active: false, phase: "idle", current: "", completed: 0, total: 0 });
  const [artistCacheStats, setArtistCacheStats] = useState<python.AssetCacheStats>({ bytes: 0, files: 0 });
  const artistCachePollRef = useRef<number>(0);

  const reloadArtistCacheStats = useCallback(async () => {
    try { setArtistCacheStats(await python.getYouTubeMusicArtistCacheStats()); } catch { /* keep last known */ }
  }, []);
  useEffect(() => {
    void reloadArtistCacheStats();
    return () => { if (artistCachePollRef.current) window.clearInterval(artistCachePollRef.current); };
  }, [reloadArtistCacheStats]);
  const refreshArtistCacheProgress = useCallback(async () => {
    try {
      const progress = await python.getYouTubeMusicArtistCacheProgress();
      setArtistCacheProgress(progress);
      setArtistCacheBusy(Boolean(progress.active));
      if (!progress.active && artistCachePollRef.current) {
        window.clearInterval(artistCachePollRef.current);
        artistCachePollRef.current = 0;
        void reloadArtistCacheStats();
      }
    } catch { /* a later poll can recover */ }
  }, [reloadArtistCacheStats]);
  const beginArtistCachePolling = () => {
    if (artistCachePollRef.current) window.clearInterval(artistCachePollRef.current);
    void refreshArtistCacheProgress();
    artistCachePollRef.current = window.setInterval(() => void refreshArtistCacheProgress(), 400);
  };
  const createArtistCache = async () => {
    if (artistCacheBusy || !settings.authenticated) return;
    setArtistCacheBusy(true);
    setArtistCacheProgress({ active: true, phase: "loading", current: "", completed: 0, total: 0 });
    beginArtistCachePolling();
    try {
      const result = await python.buildYouTubeMusicArtistCache();
      if (!result?.ok) throw new Error(result?.error || t.requestFailed);
      const artists = Number(result.data?.artists || 0);
      toaster.toast({ title: "YouTube Music", body: artists > 0 ? st.artistCacheCreated : st.artistCacheNoFavorites, duration: 3000 });
    } catch (error) { notifyError(error); } finally { void refreshArtistCacheProgress(); }
  };
  const clearArtistCache = async () => {
    if (artistCacheBusy) return;
    setArtistCacheBusy(true);
    setArtistCacheProgress({ active: true, phase: "clearing", current: "", completed: 0, total: 0 });
    beginArtistCachePolling();
    try {
      const result = await python.clearYouTubeMusicArtistCache();
      if (!result?.ok) throw new Error(result?.error || t.requestFailed);
      toaster.toast({ title: "YouTube Music", body: st.artistCacheCleared, duration: 2600 });
    } catch (error) { notifyError(error); } finally { void refreshArtistCacheProgress(); void reloadArtistCacheStats(); }
  };
  const clearManualBackgrounds = async () => {
    if (artistCacheBusy || Number(artistCacheStats.manualFiles || 0) <= 0) return;
    setArtistCacheBusy(true);
    setArtistCacheProgress({ active: true, phase: "clearing_manual", current: "", completed: 0, total: Number(artistCacheStats.manualFiles || 0) });
    beginArtistCachePolling();
    try {
      const result = await python.clearManualArtistBackgrounds("youtubeMusic");
      if (!result?.ok) throw new Error(result?.error || t.requestFailed);
      toaster.toast({ title: "YouTube Music", body: st.manualBackgroundsRemoved, duration: 2600 });
    } catch (error) { notifyError(error); } finally { void refreshArtistCacheProgress(); void reloadArtistCacheStats(); }
  };

  return (
    <>
    <div style={{ padding: "0 4px", margin: "14px 0 6px", fontSize: "0.74em", fontWeight: 800, letterSpacing: "0.035em", textTransform: "uppercase", opacity: 0.62 }}>YouTube Music</div>
    <div className="npYtmSettings" style={{ ...settingsCard, opacity: selectedService === "youtubeMusic" ? 1 : .86 }}>
      <style>{`.npYtmSettings button,.npYtmSettings button *{color:#fff!important;text-align:left!important}.npYtmSettings button{font-size:.82em!important;transition:background 120ms ease,border-color 120ms ease,box-shadow 120ms ease!important}.npYtmSettings button span{font-size:1em!important}.npYtmSettings button>span{width:100%!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;text-align:left!important;padding:0 10px!important;gap:7px!important;line-height:1.15!important}.npYtmSettings button:hover,.npYtmSettings button:focus,.npYtmSettings button.gpfocus{color:#fff!important;background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 0 0 1px rgba(255,0,51,.28),0 0 18px rgba(255,0,51,.15)!important}.npYtmSettings input{box-sizing:border-box!important}`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <SiYoutubemusic size={24} color="#fff" style={{ flexShrink: 0 }} />
        <span style={{ minWidth: 0 }}><strong style={{ display: "block", fontSize: "1em", lineHeight: 1.1, fontWeight: 620 }}>YouTube Music</strong><span style={{ display: "block", fontSize: ".72em", opacity: .62, marginTop: "2px" }}>{settings.authenticated ? String(settings.displayName || t.connected) : t.yourMusicInsideSteam}</span></span>
      </div>
      {!settings.authenticated ? <>
        <p style={{ fontSize: ".72em", lineHeight: 1.42, opacity: .72, margin: "10px 2px 7px" }}>{authRunning ? t.completeSignIn : t.automaticSignInDescription}</p>
        <DialogButton style={{ ...fullButton, marginTop: "7px" }} disabled={busy} onClick={() => void startAutomaticAuth()}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{authRunning ? t.loadingSpotify : t.connect}</span></DialogButton>
        {authError ? <>
          <div style={{ marginTop: "7px", fontSize: ".7em", lineHeight: 1.35, color: "#ff9aaa" }}>{authError}</div>
          <DialogButton style={{ ...fullButton, marginTop: "7px" }} onClick={() => setShowManualAuth((value) => !value)}><span style={{ width: "100%", display: "flex", justifyContent: "center", textAlign: "center" }}>{showManualAuth ? t.hideDetails : t.showDetails}</span></DialogButton>
        </> : null}
        {showManualAuth ? <div style={{ marginTop: "9px" }}>
          <p style={{ fontSize: ".72em", lineHeight: 1.42, opacity: .72, margin: "0 0 7px" }}>{t.browserHeadersDescription}</p>
          <TextField value={headers} label={t.browserHeaders} onChange={(value: any) => setHeaders(typeof value === "string" ? value : String(value?.target?.value ?? ""))} />
          <DialogButton style={{ ...fullButton, marginTop: "7px" }} disabled={busy || !headers.trim()} onClick={() => void run(() => python.connectYouTubeMusic(headers), t.connected)}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{t.connect}</span></DialogButton>
        </div> : null}
      </> : <DialogButton style={{ ...fullButton, marginTop: "7px" }} disabled={busy} onClick={() => void run(() => python.disconnectYouTubeMusic(), t.disconnect)}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textAlign: "center" }}><FaSignOutAlt />{t.disconnect}</span></DialogButton>}
      <div style={{ marginTop: "12px", fontSize: ".76em", fontWeight: 700, opacity: .72 }}>{t.audioQuality}</div>
      {(["low", "medium", "high"] as const).map((quality) => <DialogButton key={quality} style={{ ...fullButton, marginTop: "6px", border: settings.audioQuality === quality ? `1px solid ${YOUTUBE_RED}` : undefined }} disabled={busy} onClick={() => void run(() => python.setYouTubeMusicAudioQuality(quality))}><span style={{ width: "100%", padding: "0 10px", boxSizing: "border-box", display: "flex", justifyContent: "space-between" }}><span>{{ low: t.qualityLow, medium: t.qualityMedium, high: t.qualityHigh }[quality]}</span>{settings.audioQuality === quality ? <span style={{ color: YOUTUBE_RED }}>{"\u25cf"}</span> : null}</span></DialogButton>)}
      <DialogButton style={{ ...fullButton, marginTop: "10px" }} onClick={() => void python.refreshYouTubeMusicCache().then((result) => { if (!result.ok) throw new Error(result.error); toaster.toast({ title: "YouTube Music", body: t.refresh, duration: 2000 }); }).catch(notifyError)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><FaSyncAlt />{t.refresh}</span></DialogButton>
      <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: "0.8em", fontWeight: 700, marginBottom: "5px" }}>{st.artistCacheTitle}</div>
        <p style={{ margin: "0 2px 9px", fontSize: "0.72em", lineHeight: 1.42, opacity: 0.56 }}>{t.artistCacheDescription}</p>
        <DialogButton style={{ ...fullButton, opacity: settings.authenticated ? 1 : .5 }} disabled={!settings.authenticated || artistCacheBusy} onClick={() => void createArtistCache()}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><FaSyncAlt /> {artistCacheBusy && artistCacheProgress.phase !== "clearing" && artistCacheProgress.phase !== "clearing_manual" ? st.artistCacheBuilding : st.createArtistCache}</span></DialogButton>
        <DialogButton style={{ ...fullButton, marginTop: "6px", opacity: artistCacheStats.files > 0 ? 1 : .58 }} disabled={artistCacheBusy || artistCacheStats.files <= 0} onClick={() => void clearArtistCache()}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><FaTimes /> {artistCacheProgress.phase === "clearing" ? st.artistCacheClearing : st.clearArtistCache}</span></DialogButton>
        <DialogButton style={{ ...fullButton, marginTop: "6px", opacity: Number(artistCacheStats.manualFiles || 0) > 0 ? 1 : .58 }} disabled={artistCacheBusy || Number(artistCacheStats.manualFiles || 0) <= 0} onClick={() => void clearManualBackgrounds()}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><FaTimes /> {artistCacheProgress.phase === "clearing_manual" ? st.manualBackgroundsRemoving : st.removeManualBackgrounds}</span></DialogButton>
        <p style={{ margin: "7px 2px 0", fontSize: "0.66em", lineHeight: 1.4, opacity: 0.52 }}>{st.manualBackgroundsDescription}</p>
        {(artistCacheBusy && artistCacheProgress.total > 0) ? (
          <div style={{ marginTop: "9px" }}>
            <div style={{ fontSize: "0.66em", opacity: .7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artistCacheProgress.current || `${artistCacheProgress.completed}/${artistCacheProgress.total}`}</div>
            <div style={{ height: "4px", marginTop: "6px", borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,.1)" }}>
              <div style={{ width: `${Math.min(100, (artistCacheProgress.completed / Math.max(1, artistCacheProgress.total)) * 100)}%`, height: "100%", background: YOUTUBE_RED, transition: "width 180ms ease" }} />
            </div>
          </div>
        ) : null}
        <div style={{ marginTop: 7, padding: "7px 9px", borderRadius: 7, background: "rgba(255,255,255,.035)", display: "grid", gap: 5, fontSize: ".72em" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ opacity: .58 }}>{st.cacheSize}</span><strong>{(Math.max(0, Number(artistCacheStats.bytes || 0)) / (1024 * 1024)).toFixed(2)} MB</strong></div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ opacity: .58 }}>{st.manualBackgrounds}</span><strong>{(Math.max(0, Number(artistCacheStats.manualBytes || 0)) / (1024 * 1024)).toFixed(2)} MB</strong></div>
        </div>
      </div>
    </div>
    </>
  );
}

type BrowserProps = { onOpenBigPicture?: () => void; onOpenSettings?: () => void };

function YouTubeMusicBrowserContent({ onOpenBigPicture }: BrowserProps) {
  const t = useMemo(translations, []);
  const [tab, setTab] = useState<BrowserTab>("home");
  const [home, setHome] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [librarySection, setLibrarySection] = useState<LibrarySection>("tracks");
  const [library, setLibrary] = useState<any>(null);
  const [detail, setDetail] = useState<DetailState>(null);
  const [loading, setLoading] = useState(false);
  const requestSerial = useRef(0);

  const run = useCallback(async (operation: () => Promise<python.SpotifyApiResult>, apply: (value: any) => void) => {
    const serial = ++requestSerial.current;
    setLoading(true);
    try {
      const result = await operation();
      if (serial !== requestSerial.current) return;
      if (!result.ok) throw new Error(result.error || t.requestFailed);
      apply(result.data ?? {});
    } catch (error) {
      if (serial === requestSerial.current) notifyError(error);
    } finally {
      if (serial === requestSerial.current) setLoading(false);
    }
  }, [t.requestFailed]);

  const loadHome = useCallback(() => { void run(python.youtubeMusicGetHome, setHome); }, [run]);
  useEffect(() => { if (!home) loadHome(); }, [home, loadHome]);

  const openDetail = (item: any) => {
    const kind = itemType(item);
    if (kind === "track") {
      void playItems([item]);
      return;
    }
    if (kind !== "album" && kind !== "playlist" && kind !== "artist") return;
    const next = { kind, id: String(item.id), title: String(item.name ?? t.untitled) };
    void run(() => python.youtubeMusicGetDetail(kind, next.id), (data) => setDetail({ ...next, data }));
  };

  const renderRows = (items: any[], tracksAsQueue = false) => items.map((item, index) => <SpotifyRow key={`${item?.type}-${item?.id}-${index}`} item={item} subtitle={artistText(item)} roundImage={itemType(item) === "artist"} onFocus={() => prefetchTrack(item)} onActivate={() => tracksAsQueue && itemType(item) === "track" ? void playItems(items, index) : openDetail(item)} />);

  const renderDetail = () => {
    if (!detail) return null;
    if (!detail.data) return <div style={{ padding: "20px", textAlign: "center", opacity: .68 }}>{t.loadingSpotify}</div>;
    const item = detail.data.item;
    const tracks = Array.isArray(detail.data.tracks) ? detail.data.tracks : [];
    const albums = Array.isArray(detail.data.albums) ? detail.data.albums : [];
    const primaryArtist = Array.isArray(item?.artists) ? item.artists.find((a: any) => a?.id) : null;
    return <>
      <DialogButton style={fullButton} onClick={() => setDetail(null)}><span style={{ display: "flex", gap: "7px", alignItems: "center", justifyContent: "center", fontSize: ".8em" }}><FaArrowLeft /> {t.back}</span></DialogButton>
      <div style={{ height: "10px" }} />
      <div style={{ display: "flex", gap: "10px", padding: "10px", borderRadius: "10px", background: "linear-gradient(145deg,rgba(255,0,51,.18),rgba(0,0,0,.24))", border: "1px solid rgba(255,0,51,.25)" }}>
        <SpotifyArtwork url={imageUrl(item)} size={72} round={detail.kind === "artist"} />
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}><span style={{ fontSize: ".68em", opacity: .55, textTransform: "uppercase", fontWeight: 700 }}>{String((t as any)[detail.kind] ?? detail.kind)}</span><strong style={{ marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(item?.name ?? detail.title)}</strong><span style={{ marginTop: "4px", fontSize: ".72em", opacity: .62 }}>{detail.kind === "artist" ? t.artist : artistText(item)}</span></div>
      </div>
      <div style={{ height: "8px" }} />
      <DialogButton style={{ ...fullButton, background: YOUTUBE_RED, color: "#fff" }} disabled={!tracks.length} onClick={() => void playItems(tracks)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 800, fontSize: ".8em" }}><FaPlay /> {t.play}</span></DialogButton>
      {detail.kind === "album" && primaryArtist ? <><div style={{ height: "6px" }} /><DialogButton style={fullButton} onClick={() => openDetail({ id: primaryArtist.id, name: primaryArtist.name, type: "artist" })}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: ".8em", fontWeight: 700 }}><FaUser /> {t.artist}</span></DialogButton></> : null}
      {tracks.length ? <><div style={sectionLabel}>{detail.kind === "artist" ? t.popularTracks : t.tracks}</div>{renderRows(tracks, true)}</> : null}
      {albums.length ? <><div style={sectionLabel}>{t.albumsAndSingles}</div>{renderRows(albums)}</> : null}
      {!tracks.length && !albums.length && !loading ? <div style={{ padding: "12px 8px", textAlign: "center", opacity: .58, fontSize: ".74em" }}>{t.nothingHere}</div> : null}
    </>;
  };

  const tabButton = (key: BrowserTab, label: string, icon: React.ReactNode) => <DialogButton style={{ flex: 1, minWidth: 0, height: "32px", minHeight: "32px", padding: 0, opacity: tab === key ? 1 : .58 }} onClick={() => { requestSerial.current += 1; setLoading(false); setDetail(null); setTab(key); if (key === "home" && !home) loadHome(); if (key === "library" && !library) void run(() => python.youtubeMusicGetLibrary(librarySection, 0), setLibrary); }}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: ".72em" }}>{icon}{label}</span></DialogButton>;

  const renderHome = () => <>
    <div style={sectionLabel}>{t.yourPlaylists}</div>{renderRows(home?.playlists?.items ?? [])}
    <div style={sectionLabel}>{t.newReleases}</div>{renderRows(home?.newReleases?.items ?? home?.newForYou?.items ?? [])}
    {!home?.playlists?.items?.length && !home?.newForYou?.items?.length && !loading ? <div style={{ padding: "12px 8px", textAlign: "center", opacity: .58, fontSize: ".74em" }}>{t.nothingHere}</div> : null}
  </>;

  const renderSearch = () => <>
    <div style={{ width: "100%", marginTop: "8px" }}>
      <TextField value={query} label={t.searchSpotify} onChange={(value: any) => setQuery(typeof value === "string" ? value : String(value?.target?.value ?? ""))} onKeyDown={(event: any) => { if (event?.key === "Enter") void run(() => python.youtubeMusicSearch(query), setSearchResults); }} />
      <div style={{ height: "6px" }} />
      <DialogButton style={{ ...fullButton, background: YOUTUBE_RED, color: "#fff" }} disabled={query.trim().length < 2 || loading} onClick={() => void run(() => python.youtubeMusicSearch(query), setSearchResults)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 800, fontSize: "0.8em" }}><FaSearch /> {t.search}</span></DialogButton>
    </div>
    {(["artists", "albums", "tracks", "playlists"] as const).map((key) => { const items = searchResults?.[key]?.items ?? []; return items.length ? <div key={key}><div style={sectionLabel}>{String((t as any)[key])}</div>{renderRows(items, key === "tracks")}</div> : null; })}
    {searchResults && !(["artists", "albums", "tracks", "playlists"] as const).some((key) => searchResults?.[key]?.items?.length) && !loading ? <div style={{ padding: "14px 8px", textAlign: "center", opacity: .58, fontSize: ".74em" }}>{t.noResults}</div> : null}
  </>;

  const renderLibrary = () => {
    const items = libraryItems(library, librarySection);
    return <>
      <div style={{ height: "8px" }} />
      <Focusable flow-children="grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", width: "100%" }}>{(["tracks", "albums", "playlists", "artists"] as LibrarySection[]).map((section) => <DialogButton key={section} style={{ ...fullButton, minWidth: 0, opacity: librarySection === section ? 1 : .58 }} onClick={() => { setLibrarySection(section); void run(() => python.youtubeMusicGetLibrary(section, 0), setLibrary); }}><span style={{ fontSize: ".74em", textTransform: "capitalize" }}>{String((t as any)[section])}</span></DialogButton>)}</Focusable>
      <div style={sectionLabel}>{String((t as any)[librarySection])}</div>
      {librarySection === "tracks" && items.length ? <Focusable flow-children="horizontal" style={{ display: "flex", gap: "6px", marginBottom: "7px" }}><DialogButton style={{ ...fullButton, flex: 1, minWidth: 0, background: YOUTUBE_RED }} onClick={() => void playItems(items)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 800, fontSize: ".8em" }}><FaPlay />{t.play}</span></DialogButton><DialogButton style={{ ...fullButton, flex: 1, minWidth: 0 }} onClick={() => void playItems(shuffledCopy(items))}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: 700, fontSize: ".8em" }}><FaRandom />{t.shuffle}</span></DialogButton></Focusable> : null}
      {renderRows(items, librarySection === "tracks")}
      {!items.length && !loading ? <div style={{ padding: "12px 8px", textAlign: "center", opacity: .58, fontSize: ".74em" }}>{t.nothingHere}</div> : null}
    </>;
  };

  return <>
    <style>{`.npYtmBrowser button:focus,.npYtmBrowser button.gpfocus{box-shadow:0 0 0 1px rgba(255,0,51,.55),0 0 18px rgba(255,0,51,.2)!important}.npYtmBrowser input:focus{border-color:${YOUTUBE_RED}!important}.npYtmBrowser .npSpotifyResultButton{scroll-margin-top:64px}.npYtmNavDock{position:sticky;top:-1px;z-index:4;width:calc(100% + 8px);box-sizing:border-box;margin:-2px -4px 0;padding:6px 4px 8px;background:transparent}.npYtmBigPictureButton,.npYtmBigPictureButton:hover,.npYtmBigPictureButton:focus,.npYtmBigPictureButton.gpfocus,.npYtmBigPictureButton *{color:#fff!important}`}</style>
    <Focusable className="npYtmBrowser" flow-children="vertical" onCancel={detail ? () => { setDetail(null); return true; } : undefined} onCancelButton={detail ? () => { setDetail(null); return true; } : undefined} style={{ width: "100%", boxSizing: "border-box" }}>
      <div aria-hidden="true" style={{ height: "2px", margin: "2px 4px 4px", borderRadius: "999px", background: "linear-gradient(90deg,transparent,rgba(255,0,51,.62),transparent)", boxShadow: "0 0 14px rgba(255,0,51,.24)" }} />
      {!detail ? <div className="npYtmNavDock">{onOpenBigPicture ? <DialogButton className="npYtmBigPictureButton" style={{ ...fullButton, marginBottom: "6px", border: "1px solid rgba(255,255,255,.075)", background: "rgba(255,255,255,.025)" }} onClick={onOpenBigPicture}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: ".76em", fontWeight: 430, color: "#fff" }}><FaTv size={12} />{t.spotifyBigPicture}</span></DialogButton> : null}<Focusable flow-children="grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "6px", width: "100%" }}>{tabButton("home", t.home, <FaHome />)}{tabButton("search", t.search, <FaSearch />)}<div style={{ gridColumn: "1 / -1", minWidth: 0 }}>{tabButton("library", t.library, <FaList />)}</div></Focusable></div> : null}
      {loading ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", padding: "10px", fontSize: ".72em", opacity: .62 }}><FaSyncAlt className="npYtmSpin" />{t.loadingSpotify}</div> : null}
      {detail ? renderDetail() : tab === "home" ? renderHome() : tab === "search" ? renderSearch() : renderLibrary()}
    </Focusable>
  </>;
}

export const YouTubeMusicBrowser = memo(YouTubeMusicBrowserContent);

export function YouTubeMusicBigPicture({ onExit, onOpenVisualizer, onOpenSettings }: { onExit: () => void; onOpenVisualizer: () => void; onOpenSettings?: () => void }) {
  const t = useMemo(translations, []);
  const coreT = useMemo(() => getTranslations("core"), []);
  const audio = useLocalAudioState();
  const [tab, setTab] = useState<BrowserTab>("home");
  const [home, setHome] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [librarySection, setLibrarySection] = useState<LibrarySection>("tracks");
  const [library, setLibrary] = useState<any>(null);
  const [detail, setDetail] = useState<DetailState>(null);
  const [artistHero, setArtistHero] = useState("");
  const [backgroundSettingsOpen, setBackgroundSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [libraryTrackVisibleCount, setLibraryTrackVisibleCount] = useState(120);
  const [detailTrackVisibleCount, setDetailTrackVisibleCount] = useState(120);
  const [volume, setVolume] = useState(() => getSavedSourceVolume("youtubeMusic", audio.volume));
  const requestSerial = useRef(0);
  const volumeRef = useRef(volume);
  const volumeTimer = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const homeTabRef = useRef<any>(null);

  useEffect(() => {
    setLibraryTrackVisibleCount(120);
  }, [librarySection, library]);

  const run = useCallback(async (operation: () => Promise<python.SpotifyApiResult>, apply: (value: any) => void) => {
    const serial = ++requestSerial.current;
    setLoading(true);
    try {
      const result = await operation();
      if (serial !== requestSerial.current) return;
      if (!result.ok) throw new Error(result.error || t.requestFailed);
      apply(result.data ?? {});
    } catch (error) {
      if (serial === requestSerial.current) notifyError(error);
    } finally {
      if (serial === requestSerial.current) setLoading(false);
    }
  }, [t.requestFailed]);

  const loadHome = useCallback(() => { void run(python.youtubeMusicGetHome, setHome); }, [run]);
  useEffect(() => { if (!home) loadHome(); }, [home, loadHome]);
  // Focus the Home tab on entry so the user never lands on the search bar or
  // elements hidden behind the Big Picture overlay.
  useEffect(() => {
    let tries = 0;
    const focusHome = () => {
      const element = homeTabRef.current as HTMLElement | null;
      if (element && typeof element.focus === "function") { try { element.focus(); return; } catch { /* retry */ } }
      if (tries++ < 20) window.requestAnimationFrame(focusHome);
    };
    focusHome();
  }, []);
  // Artist hero background with the same cached scraping used by Spotify/local.
  useEffect(() => {
    if (detail?.kind !== "artist") { setArtistHero(""); return; }
    const name = String(detail?.data?.item?.name ?? detail?.title ?? "").trim();
    if (!name) { setArtistHero(""); return; }
    let cancelled = false;
    setArtistHero("");
    void python.getYouTubeMusicArtistBackground(name).then((url) => { if (!cancelled) setArtistHero(String(url || "")); }).catch(() => {});
    return () => { cancelled = true; };
  }, [detail?.kind, detail?.id, detail?.data?.item?.name]);

  useEffect(() => {
    const saved = getSavedSourceVolume("youtubeMusic", audio.volume);
    volumeRef.current = saved;
    setVolume(saved);
    void localAudioPlayer.initialize().then(() => localAudioPlayer.setVolume(saved));
    const sync = (event: Event) => {
      const value = event instanceof CustomEvent ? event.detail : null;
      if (value?.source !== "youtubeMusic") return;
      const next = Math.max(0, Math.min(100, Number(value.volume ?? saved)));
      volumeRef.current = next;
      setVolume(next);
      localAudioPlayer.setVolume(next);
    };
    window.addEventListener(SOURCE_VOLUME_CHANGED_EVENT, sync);
    return () => window.removeEventListener(SOURCE_VOLUME_CHANGED_EVENT, sync);
  }, []);
  useEffect(() => () => { if (volumeTimer.current) window.clearTimeout(volumeTimer.current); }, []);

  const changeVolume = (next: number) => {
    const value = Math.max(0, Math.min(100, Math.round(next)));
    volumeRef.current = value;
    setVolume(value);
    saveSourceVolume("youtubeMusic", value);
    if (volumeTimer.current) window.clearTimeout(volumeTimer.current);
    volumeTimer.current = window.setTimeout(() => localAudioPlayer.setVolume(volumeRef.current), 24);
  };
  const nudgeVolume = (event: any) => {
    const key = String(event?.key ?? "");
    const button = event?.detail?.button;
    const direction = key === "ArrowLeft" || key === "Left" || button === GamepadButton.DIR_LEFT
      ? -1
      : key === "ArrowRight" || key === "Right" || button === GamepadButton.DIR_RIGHT ? 1 : 0;
    if (!direction) return;
    event.preventDefault?.();
    event.stopPropagation?.();
    changeVolume(volumeRef.current + direction);
  };

  const switchTab = (next: BrowserTab) => {
    requestSerial.current += 1;
    setLoading(false);
    setDetail(null);
    setBackgroundSettingsOpen(false);
    setTab(next);
    scrollRef.current?.scrollTo?.({ top: 0 });
    if (next === "home" && !home) loadHome();
    if (next === "library" && !library) void run(() => python.youtubeMusicGetLibrary(librarySection, 0), setLibrary);
  };

  const openDetail = (item: any) => {
    const kind = itemType(item);
    if (kind === "track") { void playItems([item]); return; }
    if (kind !== "album" && kind !== "playlist" && kind !== "artist") return;
    const next = { kind, id: String(item.id), title: String(item.name ?? t.untitled) };
    void run(() => python.youtubeMusicGetDetail(kind, next.id), (data) => {
      setDetail({ ...next, data });
      window.requestAnimationFrame(() => scrollRef.current?.scrollTo?.({ top: 0 }));
    });
  };

  const cardRow = (title: string, items: any[], round = false) => items.length ? <section className="npYtmTvShelf" style={{ marginTop: "28px" }}><h2 style={{ margin: "0 0 13px", fontSize: "25px", fontWeight: 650 }}>{title}</h2><Focusable className="npYtmTvRow" flow-children="horizontal" style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "calc((100% - 60px) / 6)", gap: "12px", overflowX: "auto", overflowY: "hidden", width: "100%", padding: "8px 0 24px", scrollPaddingInline: 0 }}>{items.slice(0, 60).map((item, index) => <SpotifyTvCard key={`${item?.type}-${item?.id}-${index}`} item={item} round={round} onActivate={() => openDetail(item)} />)}</Focusable></section> : null;

  const current = audio.track;
  const hasCurrent = Boolean(current?.name);
  const currentCover = imageUrl(current);
  const currentAlbum = current?.album;

  const playerCard = () => <Focusable className="npYtmPlayerCard" flow-children="grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "320px minmax(0,1fr) minmax(330px,24vw)", gap: "clamp(22px,3vw,44px)", alignItems: "stretch", width: "100%", minHeight: "368px", padding: "24px", borderRadius: "20px", border: "1px solid rgba(255,255,255,.09)", background: "linear-gradient(135deg,rgba(255,255,255,.10),rgba(255,255,255,.045) 48%,rgba(0,0,0,.16))", backdropFilter: "blur(28px)", boxShadow: "0 24px 80px rgba(0,0,0,.28)", overflow: "hidden" }}>
    {currentCover ? <div className="npYtmPlayerGlow" aria-hidden="true" style={{ position: "absolute", inset: "-40% -16% -70% -16%", background: `url(${currentCover}) center/cover no-repeat`, filter: "blur(110px) saturate(1.55)", opacity: .34, pointerEvents: "none" }} /> : null}
    <DialogButton className="npYtmCoverButton" disabled={!currentAlbum?.id} onClick={() => currentAlbum?.id ? openDetail({ ...currentAlbum, type: "album" }) : undefined} style={{ position: "relative", width: "320px", minWidth: "320px", height: "320px", minHeight: "320px", padding: 0, borderRadius: "14px", overflow: "hidden", background: "rgba(255,255,255,.06)", boxShadow: "0 24px 70px rgba(0,0,0,.42)" }}>{currentCover ? <img src={currentCover} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <span style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><FaMusic size={64} style={{ opacity: .3 }} /></span>}</DialogButton>
    <div style={{ position: "relative", minWidth: 0, alignSelf: "center" }}>{hasCurrent ? <><span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: ".14em", opacity: .58, fontWeight: 620 }}>{t.nowPlaying}</span><h1 style={{ margin: "9px 0 0", fontSize: "clamp(38px,4vw,68px)", lineHeight: 1.08, letterSpacing: "-.045em", fontWeight: 610, paddingBottom: ".12em" }}>{String(current?.name ?? "")}</h1><div style={{ marginTop: "12px", fontSize: "clamp(18px,1.7vw,27px)", opacity: .72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artistText(current)}</div>{currentAlbum?.name ? <div style={{ marginTop: "7px", fontSize: "16px", opacity: .45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentAlbum.name}</div> : null}<div style={{ marginTop: "28px" }}><div style={{ height: "5px", borderRadius: "999px", background: "rgba(255,255,255,.16)", overflow: "hidden" }}><SmoothProgressFill position={audio.position} duration={audio.length} playing={audio.status === "Playing"} sampledAt={Date.now()} style={{ height: "100%", background: YOUTUBE_RED, borderRadius: "999px" }} /></div><div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "13px", opacity: .48, fontVariantNumeric: "tabular-nums" }}><SmoothProgressTime position={audio.position} duration={audio.length} playing={audio.status === "Playing"} sampledAt={Date.now()} format={formatTime} /><span>{formatTime(audio.length)}</span></div></div></> : <h1 style={{ margin: 0, fontSize: "clamp(34px,3.4vw,58px)", lineHeight: 1.08, letterSpacing: "-.04em", fontWeight: 610 }}>{t.noPlayback}</h1>}</div>
    <div style={{ position: "relative", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}><Focusable flow-children="vertical" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch" }}><Focusable flow-children="horizontal" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "10px" }}><DialogButton disabled={!hasCurrent} style={{ width: "100%", minWidth: 0, height: "58px", padding: 0 }} onClick={() => void localAudioPlayer.command("previous")}><FaStepBackward size={18} /></DialogButton><DialogButton disabled={!hasCurrent} style={{ width: "100%", minWidth: 0, height: "58px", padding: 0 }} onClick={() => void localAudioPlayer.command("play_pause")}>{audio.status === "Playing" ? <FaPause size={21} /> : <FaPlay size={21} />}</DialogButton><DialogButton disabled={!hasCurrent} style={{ width: "100%", minWidth: 0, height: "58px", padding: 0 }} onClick={() => void localAudioPlayer.command("next")}><FaStepForward size={18} /></DialogButton></Focusable><Focusable flow-children="horizontal" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "10px" }}><DialogButton disabled={!hasCurrent} aria-label={t.shuffle} onClick={() => void localAudioPlayer.command("shuffle")} style={{ position: "relative", width: "100%", minWidth: 0, height: "46px", padding: 0, opacity: audio.shuffleActive ? 1 : .62 }}><FaRandom size={16} />{audio.shuffleActive ? <span className="npYtmActiveDot" /> : null}</DialogButton><DialogButton disabled={!hasCurrent} aria-label={t.repeat} onClick={() => void localAudioPlayer.command("repeat")} style={{ position: "relative", width: "100%", minWidth: 0, height: "46px", padding: 0, opacity: audio.repeatMode !== "None" ? 1 : .62 }}><RepeatIcon one={audio.repeatMode === "One"} size={17} />{audio.repeatMode !== "None" ? <span className="npYtmActiveDot" /> : null}</DialogButton></Focusable><DialogButton className="npYtmMinimalButton" onClick={onOpenVisualizer} style={{ width: "100%", minWidth: 0, height: "46px", border: "1px solid rgba(255,255,255,.075)", background: "rgba(255,255,255,.025)" }}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: ".82em", fontWeight: 430 }}><FaExpandArrowsAlt size={13} />{t.fullscreen}</span></DialogButton><Focusable className="npYtmAppVolume" focusClassName="npYtmAppVolumeFocused" noFocusRing onActivate={() => undefined} onButtonDown={nudgeVolume} onKeyDown={nudgeVolume} role="slider" tabIndex={0} {...({ focusable: true } as any)} aria-label={t.volume} aria-valuemin={0} aria-valuemax={100} aria-valuenow={volume}><span>{t.volume}</span><input type="range" min={0} max={100} step={1} value={volume} tabIndex={-1} onChange={(event) => changeVolume(Number(event.currentTarget.value))} /><strong>{volume}%</strong></Focusable></Focusable></div>
  </Focusable>;

  const renderHome = () => <>{playerCard()}{cardRow(t.yourPlaylists, home?.playlists?.items ?? [])}{cardRow(t.newReleases, home?.newReleases?.items ?? home?.newForYou?.items ?? [])}</>;
  const renderSearch = () => { const tracks = searchResults?.tracks?.items ?? []; const albums = searchResults?.albums?.items ?? []; const artists = searchResults?.artists?.items ?? []; const playlists = searchResults?.playlists?.items ?? []; return <><TextField label={t.searchSpotify} value={query} style={{ width: "100%", minWidth: "100%" } as any} onChange={(value: any) => setQuery(typeof value === "string" ? value : String(value?.target?.value ?? ""))} onKeyDown={(event: any) => { if (event?.key === "Enter") void run(() => python.youtubeMusicSearch(query), setSearchResults); }} /><DialogButton style={{ width: "180px", minWidth: "180px", height: "46px", marginTop: "10px" }} disabled={query.trim().length < 2 || loading} onClick={() => void run(() => python.youtubeMusicSearch(query), setSearchResults)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 550 }}><FaSearch />{t.search}</span></DialogButton>{cardRow(t.artists, artists, true)}{cardRow(t.albums, albums)}{tracks.length ? <section style={{ marginTop: "28px" }}><h2 style={{ margin: "0 0 13px", fontSize: "25px", fontWeight: 650 }}>{t.tracks}</h2><Focusable flow-children="vertical">{tracks.map((track: any, index: number) => <SpotifyTvTrack key={`${track?.id}-${index}`} track={track} index={index} onFocus={() => prefetchTrack(track)} onActivate={() => void playItems(tracks, index)} />)}</Focusable></section> : null}{cardRow(t.playlists, playlists)}{searchResults && !tracks.length && !albums.length && !artists.length && !playlists.length && !loading ? <div style={{ marginTop: "38px", fontSize: "19px", opacity: .55 }}>{t.noResults}</div> : null}</>; };
  const renderLibrary = () => {
    const items = libraryItems(library, librarySection);
    const visibleItems = librarySection === "tracks" ? items.slice(0, libraryTrackVisibleCount) : items;
    const loadSection = (section: LibrarySection) => {
      setLibrarySection(section);
      setLibraryTrackVisibleCount(120);
      void run(() => python.youtubeMusicGetLibrary(section, 0), setLibrary);
    };
    return <>
      <Focusable flow-children="horizontal" style={{ display: "flex", gap: "9px", marginTop: "4px" }}>
        {(["tracks", "albums", "playlists", "artists"] as LibrarySection[]).map((section) => (
          <DialogButton key={section} onClick={() => loadSection(section)} style={{ width: "166px", minWidth: "166px", height: "44px", borderRadius: "999px", opacity: librarySection === section ? 1 : .58 }}>
            <span style={{ fontWeight: librarySection === section ? 650 : 500 }}>{String((t as any)[section])}</span>
          </DialogButton>
        ))}
      </Focusable>
      <h2 style={{ margin: "26px 0 13px", fontSize: "27px", fontWeight: 650 }}>{String((t as any)[librarySection])}</h2>
      {librarySection === "tracks" ? <>
        <Focusable flow-children="horizontal" style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <DialogButton style={{ width: "190px", minWidth: "190px", height: "46px" }} disabled={!items.length} onClick={() => void playItems(items)}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 550 }}><FaPlay />{t.play}</span>
          </DialogButton>
          <DialogButton style={{ width: "190px", minWidth: "190px", height: "46px" }} disabled={!items.length} onClick={() => void playItems(shuffledCopy(items))}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 550 }}><FaRandom />{t.shuffle}</span>
          </DialogButton>
        </Focusable>
        <Focusable flow-children="vertical">
          {visibleItems.map((track, index) => (
            <SpotifyTvTrack
              key={`${track?.id}-${index}`}
              track={track}
              index={index}
              onFocus={() => {
                prefetchTrack(track);
                if (index >= visibleItems.length - 18 && visibleItems.length < items.length) {
                  setLibraryTrackVisibleCount((current) => Math.min(items.length, current + 120));
                }
              }}
              onActivate={() => void playItems(items, index)}
            />
          ))}
        </Focusable>
      </> : (
        <Focusable flow-children="grid" style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: "14px", alignItems: "start" }}>
          {visibleItems.map((item, index) => <SpotifyTvCard key={`${item?.id}-${index}`} item={item} round={librarySection === "artists"} onActivate={() => openDetail(item)} />)}
        </Focusable>
      )}
      {!items.length && !loading ? <div style={{ fontSize: "19px", opacity: .55 }}>{t.nothingHere}</div> : null}
    </>;
  };

  const backButton = (overlay = false) => (
    <DialogButton
      className="npYtmBackButton npYtmMinimalButton"
      onClick={() => setDetail(null)}
      style={{ position: overlay ? "absolute" : "relative", top: overlay ? "20px" : undefined, left: overlay ? "28px" : undefined, zIndex: 5, width: "108px", minWidth: "108px", height: "34px", minHeight: "34px", padding: 0, border: "1px solid rgba(255,255,255,0.075)", background: "rgba(255,255,255,0.035)" }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.72em", fontWeight: 430, color: "#fff" }}><FaArrowLeft size={11} /> {t.back}</span>
    </DialogButton>
  );

  const renderDetail = () => {
    if (!detail) return null;
    if (!detail.data) return null;
    const item = detail.data.item;
    const tracks = Array.isArray(detail.data.tracks) ? detail.data.tracks : [];
    const albums = Array.isArray(detail.data.albums) ? detail.data.albums : [];
    const isArtist = detail.kind === "artist";
    const primaryArtist = Array.isArray(item?.artists) ? item.artists.find((a: any) => a?.id) : null;
    if (backgroundSettingsOpen && isArtist) {
      return <ArtistBackgroundPicker
        provider="youtubeMusic"
        artistId={String(item?.id ?? detail?.id ?? "")}
        artistName={String(item?.name ?? detail?.title ?? "")}
        onBack={() => setBackgroundSettingsOpen(false)}
        onApplied={(url) => setArtistHero(url)}
      />;
    }
    return <>
      {isArtist ? <section style={{ position: "relative", width: "100vw", height: "min(56.25vw,720px)", minHeight: "430px", margin: "-18px -56px 0", overflow: "hidden", background: "#090909" }}>{(artistHero || imageUrl(item)) ? <img src={artistHero || imageUrl(item)} style={{ position: "absolute", inset: "-8%", width: "116%", height: "116%", objectFit: "cover", filter: artistHero ? "saturate(1.1) brightness(.82)" : "blur(24px) saturate(1.25) brightness(.68)", transform: "scale(1.05)" }} /> : null}<div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,0,0,.66),rgba(0,0,0,.04) 62%),linear-gradient(180deg,transparent,rgba(0,0,0,.72) 80%,#000)" }} />{backButton(true)}<div style={{ position: "absolute", left: "46px", right: "46px", bottom: "46px", zIndex: 2 }}><h1 style={{ margin: 0, fontSize: "clamp(58px,7vw,102px)", lineHeight: 1, letterSpacing: "-.052em", fontWeight: 610 }}>{String(item?.name ?? detail.title)}</h1>{tracks.length ? <DialogButton style={{ width: "156px", minWidth: "156px", height: "48px", marginTop: "22px" }} onClick={() => void playItems(tracks)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><FaPlay />{t.play}</span></DialogButton> : null}</div></section> : <>{backButton()}<div style={{ display: "grid", gridTemplateColumns: "250px minmax(0,1fr)", alignItems: "end", gap: "32px", marginTop: "20px", minHeight: "250px" }}><div style={{ width: "250px", height: "250px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 30px 86px rgba(0,0,0,.48)", background: "rgba(255,255,255,.08)" }}>{imageUrl(item) ? <img src={imageUrl(item)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FaMusic size={68} style={{ margin: "91px", opacity: .4 }} />}</div><div style={{ minWidth: 0, paddingBottom: "8px" }}><div style={{ textTransform: "uppercase", letterSpacing: ".13em", fontSize: "12px", fontWeight: 650, opacity: .58 }}>{String((t as any)[detail.kind])}</div><h1 style={{ margin: "10px 0 0", fontSize: "56px", lineHeight: 1.02, letterSpacing: "-.052em", fontWeight: 610 }}>{String(item?.name ?? detail.title)}</h1><div style={{ marginTop: "15px", fontSize: "17px", opacity: .64 }}>{artistText(item)}</div><Focusable flow-children="horizontal" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "22px" }}>{tracks.length ? <DialogButton style={{ width: "156px", minWidth: "156px", height: "48px" }} onClick={() => void playItems(tracks)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 560 }}><FaPlay /> {t.play}</span></DialogButton> : null}{detail.kind === "album" && primaryArtist ? <DialogButton style={{ width: "156px", minWidth: "156px", height: "48px" }} onClick={() => openDetail({ id: primaryArtist.id, name: primaryArtist.name, type: "artist" })}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 520 }}><FaUser /> {t.artist}</span></DialogButton> : null}</Focusable></div></div></>}
      <section style={{ marginTop: "30px" }}><h2 style={{ margin: "0 0 13px", fontSize: "27px", fontWeight: 650 }}>{isArtist ? t.popularTracks : t.tracks}</h2><Focusable flow-children="vertical">{tracks.slice(0, detailTrackVisibleCount).map((track, index) => <SpotifyTvTrack key={`${track?.id}-${index}`} track={track} index={index} showArtwork={detail.kind !== "album"} onFocus={() => { prefetchTrack(track); const visible = Math.min(tracks.length, detailTrackVisibleCount); if (index >= visible - 18 && visible < tracks.length) setDetailTrackVisibleCount((current) => Math.min(tracks.length, current + 120)); }} onActivate={() => void playItems(tracks, index)} />)}</Focusable>{!tracks.length && !loading ? <div style={{ fontSize: "19px", opacity: .55 }}>{t.noTracks}</div> : null}</section>
      {cardRow(t.albumsAndSingles, albums)}
      {isArtist ? <DialogButton className="npYtmMinimalButton" style={{ width: 250, minWidth: 250, height: 48, marginTop: 26, border: "1px solid rgba(255,255,255,.075)", background: "rgba(255,255,255,.025)" }} onClick={() => setBackgroundSettingsOpen(true)}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".82em", fontWeight: 430 }}><FaCog /> {coreT.artistBackgroundSettings}</span></DialogButton> : null}
    </>;
  };

  const handleRootButtonDown = useCallback((event: any) => {
    const button = event?.detail?.button;
    if (button !== GamepadButton.BUMPER_LEFT && button !== GamepadButton.BUMPER_RIGHT) return;
    const tabs = ["home", "search", "library", "settings"] as const;
    const currentIndex = backgroundSettingsOpen ? -1 : Math.max(0, tabs.indexOf(tab as any));
    const delta = button === GamepadButton.BUMPER_RIGHT ? 1 : -1;
    const next = tabs[(currentIndex + delta + tabs.length) % tabs.length];
    event?.preventDefault?.();
    event?.stopPropagation?.();
    setBackgroundSettingsOpen(false);
    if (next === "settings") onOpenSettings?.();
    else switchTab(next);
  }, [tab, backgroundSettingsOpen, onOpenSettings]);
  const handleRootCancel = () => {
    if (backgroundSettingsOpen) { setBackgroundSettingsOpen(false); return true; }
    if (detail) { setDetail(null); return true; }
    onExit();
    return true;
  };
  const backgroundImage = detail?.kind === "artist" ? (artistHero || imageUrl(detail?.data?.item)) : (imageUrl(detail?.data?.item) || currentCover);
  return <Focusable className="npYtmTvRoot npFullscreenRoot" flow-children="vertical" onButtonDown={handleRootButtonDown} onCancel={handleRootCancel} onCancelButton={handleRootCancel} style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 10, background: "#070707", color: "#fff", overflow: "hidden", outline: "none" }}>
    <style>{`.npYtmTvRoot,.npYtmTvRoot *{box-sizing:border-box}.npYtmTvRoot button{transition:background 120ms ease,box-shadow 120ms ease,opacity 120ms ease!important}.npYtmTvRoot button:focus,.npYtmTvRoot button.gpfocus{transform:none!important;z-index:12}.npYtmTvRoot .npYtmCoverButton:focus,.npYtmTvRoot .npYtmCoverButton.gpfocus{box-shadow:0 0 0 3px rgba(255,255,255,.88),0 0 0 6px rgba(255,0,51,.48),0 24px 70px rgba(0,0,0,.42)!important}.npYtmTabs{z-index:200!important;isolation:isolate}.npYtmTvScroll{z-index:10!important;position:absolute!important;inset:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain}.npYtmTvScroll::-webkit-scrollbar{width:7px}.npYtmTvScroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:999px}.npYtmTvRow::-webkit-scrollbar{display:none}.npYtmTvRoot .npSpotifyTvCard:focus,.npYtmTvRoot .npSpotifyTvCard.gpfocus,.npYtmTvRoot .npSpotifyTvTrack:focus,.npYtmTvRoot .npSpotifyTvTrack.gpfocus{transform:none!important}.npYtmTab,.npYtmTab *,.npYtmMinimalButton,.npYtmMinimalButton *{color:#fff!important}.npYtmTab{border:1px solid rgba(255,255,255,.075)!important;background:rgba(255,255,255,.025)!important}.npYtmTab:hover,.npYtmTab:focus,.npYtmTab.gpfocus,.npYtmMinimalButton:hover,.npYtmMinimalButton:focus,.npYtmMinimalButton.gpfocus{background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.25)!important;box-shadow:0 0 0 1px rgba(255,0,51,.3),0 0 20px rgba(255,0,51,.17)!important}.npYtmTabActive{background:rgba(255,0,51,.18)!important;border-color:rgba(255,0,51,.46)!important}.npYtmPlayerGlow{animation:npYtmGlow 5.6s ease-in-out infinite alternate}.npYtmActiveDot{position:absolute;top:7px;right:8px;width:6px;height:6px;border-radius:999px;background:${YOUTUBE_RED};box-shadow:0 0 8px ${YOUTUBE_RED}}.npYtmAppVolume{display:grid;grid-template-columns:84px minmax(0,1fr) 52px;align-items:center;gap:10px;width:100%;padding:8px 10px;border-radius:7px;border:1px solid rgba(255,255,255,.075);background:rgba(255,255,255,.025);font-size:15px;overflow:hidden}.npYtmAppVolumeFocused,.npYtmAppVolume:focus-visible{border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.13);box-shadow:0 0 0 1px rgba(255,0,51,.3),0 0 20px rgba(255,0,51,.17)}.npYtmAppVolume input{min-width:0;width:100%;accent-color:${YOUTUBE_RED}}.npYtmAppVolume strong{text-align:right}@keyframes npYtmGlow{from{transform:scale(1.02);opacity:.28}to{transform:scale(1.12);opacity:.42}}`}</style>
    {backgroundImage ? <div aria-hidden="true" style={{ position: "absolute", inset: "-34% -22% -30% -10%", background: `url(${backgroundImage}) center/cover no-repeat`, filter: "blur(138px) saturate(1.58)", opacity: .52, transform: "scale(1.34)", pointerEvents: "none", zIndex: 0 }} /> : null}<div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: detail?.kind === "artist" ? "#000" : "linear-gradient(90deg,rgba(7,7,7,.66),rgba(7,7,7,.26) 46%,rgba(7,7,7,.2)),linear-gradient(180deg,rgba(7,7,7,.03),rgba(7,7,7,.5) 76%,#070707)", pointerEvents: "none" }} />
    {!detail ? <><Focusable className="npYtmTabs" flow-children="horizontal" onButtonDown={(event: any) => { if (event?.detail?.button === GamepadButton.DIR_UP) { event?.preventDefault?.(); event?.stopPropagation?.(); } }} style={{ position: "absolute", top: 24, left: 56, zIndex: 200, display: "flex", alignItems: "center", gap: 8 }}>{([["home", t.home, FaHome], ["search", t.search, FaSearch], ["library", t.library, FaList], ["settings", t.settings, FaCog]] as const).map(([id, label, Icon]) => <DialogButton key={id} ref={id === "home" ? homeTabRef : undefined} className={`npYtmTab${id !== "settings" && tab === id ? " npYtmTabActive" : ""}`} onClick={() => id === "settings" ? onOpenSettings?.() : switchTab(id as BrowserTab)} style={{ width: 138, minWidth: 138, height: 38, minHeight: 38, padding: 0 }}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".76em", fontWeight: 540 }}><Icon size={13} />{label}</span></DialogButton>)}</Focusable><main ref={scrollRef} className="npYtmTvScroll" style={{ padding: "112px 56px 300px", scrollPaddingTop: 112, scrollPaddingBottom: 250 }}><div style={{ position: "relative", zIndex: 1, width: "100%" }}>{tab === "home" ? renderHome() : tab === "search" ? renderSearch() : renderLibrary()}</div></main></> : <main ref={scrollRef} className="npYtmTvScroll" style={{ padding: "18px 56px 300px", scrollPaddingBottom: 250 }}><div style={{ position: "relative", zIndex: 1, width: "100%" }}>{renderDetail()}</div></main>}
  </Focusable>;
}
