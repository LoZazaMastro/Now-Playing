import { DialogButton, Focusable, GamepadButton, ModalRoot, NavEntryPositionPreferences, TextField, showModal } from "@decky/ui";
import { toaster } from "@decky/api";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  FaArrowLeft,
  FaCheck,
  FaCompactDisc,
  FaCog,
  FaExpandArrowsAlt,
  FaExternalLinkAlt,
  FaFileAudio,
  FaFolder,
  FaHome,
  FaList,
  FaListOl,
  FaMusic,
  FaPause,
  FaPlay,
  FaRandom,
  FaRedoAlt,
  FaSearch,
  FaStepBackward,
  FaStepForward,
  FaSyncAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import * as python from "./python";
import { localAudioPlayer, useLocalAudioState } from "./localAudio";
import { ArtistBackgroundPicker } from "./artistBackground";
import { getSavedSourceVolume, saveSourceVolume, SOURCE_VOLUME_CHANGED_EVENT } from "./sourceVolume";
import type { LocalMusicCacheProgress, LocalMusicSettings } from "./python";
import { formatTranslation, getTranslations, localizeRuntimeMessage } from "./i18n";
import type { LocalMusicTranslation } from "./i18n";

const LOCAL_ACCENT = "#D9A337";
const COVER_CACHE = new Map<string, string>();
const ARTIST_PROFILE_CACHE = new Map<string, string>();

function setBoundedImageCache(cache: Map<string, string>, key: string, value: string, limit: number) {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, value);
  while (cache.size > limit) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}

function resolveLocalTranslations(): LocalMusicTranslation {
  return getTranslations("localMusic");
}

function useLocalTranslations(): LocalMusicTranslation {
  return useMemo(resolveLocalTranslations, []);
}

function artistText(item: any): string {
  const artists = item?.artists ?? item?.album?.artists;
  if (Array.isArray(artists) && artists.length) return artists.map((artist: any) => artist?.name).filter(Boolean).join(", ");
  return "";
}

function normalizeTrack(entry: any) {
  return entry?.track ?? entry?.item ?? entry;
}

function itemType(item: any): "track" | "album" | "artist" | "unknown" {
  const type = String(item?.type ?? "").toLowerCase();
  if (type === "track" || type === "album" || type === "artist") return type;
  const uri = String(item?.uri ?? "");
  if (uri.startsWith("local:track:")) return "track";
  if (uri.startsWith("local:album:")) return "album";
  if (uri.startsWith("local:artist:")) return "artist";
  return "unknown";
}

function formatDuration(ms: number) {
  const seconds = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function showError(message: string) {
  const t = resolveLocalTranslations();
  toaster.toast({ title: t.yourMusic, body: localizeRuntimeMessage(message, t.playerError), duration: 4200 });
}

function directionFromKey(key: string) {
  if (key === "ArrowLeft" || key === "Left") return -1;
  if (key === "ArrowRight" || key === "Right") return 1;
  return 0;
}

function directionFromGamepad(button: unknown) {
  if (button === GamepadButton.DIR_LEFT) return -1;
  if (button === GamepadButton.DIR_RIGHT) return 1;
  return 0;
}

function gridDirectionFromKey(key: string) {
  if (key === "ArrowLeft" || key === "Left") return -1;
  if (key === "ArrowRight" || key === "Right") return 1;
  if (key === "ArrowUp" || key === "Up") return -6;
  if (key === "ArrowDown" || key === "Down") return 6;
  return 0;
}

function gridDirectionFromGamepad(button: unknown) {
  if (button === GamepadButton.DIR_LEFT) return -1;
  if (button === GamepadButton.DIR_RIGHT) return 1;
  if (button === GamepadButton.DIR_UP) return -6;
  if (button === GamepadButton.DIR_DOWN) return 6;
  return 0;
}

const localGridFocusMoveState = new WeakMap<HTMLElement, { at: number; delta: number }>();

function stopDirectionalEvent(event: any) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
  event?.nativeEvent?.stopImmediatePropagation?.();
}

function moveSixColumnGridFocus(event: any, delta: number) {
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
  const previousMove = localGridFocusMoveState.get(grid);
  if (previousMove && previousMove.delta === delta && now - previousMove.at < 220) {
    stopDirectionalEvent(event);
    return true;
  }
  const nextIndex = currentIndex + delta;
  const next = grid.querySelector<HTMLElement>(`[data-np-grid-index="${nextIndex}"]`);
  if (!next) return false;
  localGridFocusMoveState.set(grid, { at: now, delta });
  stopDirectionalEvent(event);
  next.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  next.focus?.();
  return true;
}

function useLocalCover(coverId?: string) {
  const key = String(coverId ?? "");
  const [url, setUrl] = useState(() => COVER_CACHE.get(key) ?? "");
  useEffect(() => {
    let cancelled = false;
    if (!key) {
      setUrl("");
      return;
    }
    const cached = COVER_CACHE.get(key);
    if (cached) {
      setUrl(cached);
      return;
    }
    void python.getLocalMusicCover(key).then((value) => {
      if (cancelled) return;
      if (value) setBoundedImageCache(COVER_CACHE, key, value, 600);
      setUrl(value || "");
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [key]);
  return url;
}

function useLocalArtistProfile(item: any) {
  const id = String(item?.id ?? item?.artists?.[0]?.id ?? "");
  const name = String(item?.name ?? item?.artists?.[0]?.name ?? "");
  const key = `${id}|${name}`;
  const [url, setUrl] = useState(() => ARTIST_PROFILE_CACHE.get(key) ?? "");
  useEffect(() => {
    let cancelled = false;
    if (!id || !name) { setUrl(""); return; }
    const cached = ARTIST_PROFILE_CACHE.get(key);
    if (cached) { setUrl(cached); return; }
    void python.getLocalMusicArtistProfile(id, name).then((value) => {
      if (cancelled) return;
      if (value) setBoundedImageCache(ARTIST_PROFILE_CACHE, key, value, 300);
      setUrl(value || "");
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [id, key, name]);
  return url;
}

function LocalArtwork({ item, size = 52, round = false }: { item: any; size?: number; round?: boolean }) {
  const coverId = String(item?.coverId ?? item?.album?.coverId ?? "");
  const coverUrl = useLocalCover(coverId);
  const profileUrl = useLocalArtistProfile(round || itemType(item) === "artist" ? item : null);
  const url = profileUrl || coverUrl;
  return (
    <span style={{ width: size, minWidth: size, height: size, borderRadius: round ? "50%" : "7px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.08)" }}>
      {url ? <img loading="lazy" src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FaMusic style={{ opacity: .42 }} />}
    </span>
  );
}

type LocalDirectoryListing = { ok: boolean; path: string; dirs: string[]; files: string[]; error?: string };

function joinWindowsPath(base: string, name: string) {
  return `${base.replace(/[\\/]$/, "")}\\${name}`;
}

function parentWindowsPath(path: string) {
  const normalized = path.replace(/[\\/]+$/, "");
  const slash = Math.max(normalized.lastIndexOf("\\"), normalized.lastIndexOf("/"));
  if (slash <= 2) return normalized.slice(0, 3) || "C:\\";
  return normalized.slice(0, slash);
}

function LocalMusicPickerModal({ initialPath, closeModal, onAdd }: {
  initialPath: string;
  closeModal: () => void;
  onAdd: (kind: "folder" | "file", path: string) => Promise<boolean>;
}) {
  const t = useLocalTranslations();
  const [listing, setListing] = useState<LocalDirectoryListing>({ ok: true, path: initialPath, dirs: [], files: [] });
  const [manualPath, setManualPath] = useState(initialPath);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async (path: string) => {
    setLoading(true);
    try {
      const result = await python.listLocalMusicDirectory(path);
      if (!result.ok) throw new Error(result.error || t.openFolderError);
      setListing(result);
      setManualPath(result.path);
    } catch (error: any) {
      showError(String(error?.message ?? error ?? t.openFolderError));
    } finally {
      setLoading(false);
    }
  }, [t.openFolderError]);

  useEffect(() => { void load(initialPath); }, [initialPath, load]);

  async function add(kind: "folder" | "file", path: string) {
    if (adding) return;
    setAdding(true);
    try {
      if (await onAdd(kind, path)) closeModal();
    } finally {
      setAdding(false);
    }
  }

  return (
    <ModalRoot closeModal={closeModal} onCancel={closeModal} onEscKeypress={closeModal}>
      <style>{`
        .npLocalPicker button{text-align:left!important}
        .npLocalPicker button>span{justify-content:flex-start!important}
        .npLocalPicker button.npLocalPickerBack>span{width:100%!important;height:100%!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important}
        .npLocalPicker button.npLocalPickerGo{position:relative!important;width:84px!important;min-width:84px!important;max-width:84px!important;padding:0!important}
        .npLocalPicker button.npLocalPickerGo>span{position:static!important;width:100%!important;height:100%!important;padding:0!important}
        .npLocalPicker button.npLocalPickerGo span.npLocalPickerGoLabel{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;pointer-events:none!important}
        .npLocalPicker button.npLocalPickerConfirm{color:#fff!important;background:linear-gradient(135deg,rgba(217,163,55,.96),rgba(179,124,22,.96))!important;border:1px solid rgba(255,226,159,.42)!important;box-shadow:0 8px 24px rgba(128,82,7,.24)!important}
        .npLocalPicker button.npLocalPickerConfirm:hover,.npLocalPicker button.npLocalPickerConfirm:focus,.npLocalPicker button.npLocalPickerConfirm.gpfocus{background:linear-gradient(135deg,#e1ad43,#c18a24)!important;border-color:rgba(255,244,211,.78)!important;box-shadow:0 0 0 2px rgba(255,255,255,.72),0 0 24px rgba(217,163,55,.38)!important}
      `}</style>
      <div className="npLocalPicker" style={{ width: "min(46rem, 86vw)", maxWidth: "100%" }}>
        <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 12 }}>{t.pickerTitle}</div>
        <Focusable flow-children="horizontal" style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 8 }}>
          <DialogButton className="npLocalPickerBack" style={{ width: 46, minWidth: 46, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }} disabled={loading || adding} onClick={() => void load(parentWindowsPath(listing.path))}><span><FaArrowLeft /></span></DialogButton>
          <TextField value={manualPath} onChange={(event) => setManualPath(event.target.value)} style={{ width: "100%" }} />
          <DialogButton className="npLocalPickerGo" style={{ width: 84, minWidth: 84, maxWidth: 84, padding: 0 }} disabled={loading || adding} onClick={() => void load(manualPath)}><span className="npLocalPickerGoLabel">{t.openPath}</span></DialogButton>
        </Focusable>
        <DialogButton className="npLocalPickerConfirm" style={{ width: "100%", marginTop: 10 }} disabled={loading || adding} onClick={() => void add("folder", listing.path)}>
          <span style={{ display: "flex", alignItems: "center", gap: 9 }}><FaCheck />{t.addCurrentFolder}</span>
        </DialogButton>
        <Focusable style={{ marginTop: 10, maxHeight: "52vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, paddingRight: 5 }}>
          {listing.dirs.map((dir) => (
            <DialogButton key={`dir:${dir}`} disabled={loading || adding} onClick={() => void load(joinWindowsPath(listing.path, dir))}>
              <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}><FaFolder /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dir}</span></span>
            </DialogButton>
          ))}
          {listing.files.map((file) => (
            <DialogButton key={`file:${file}`} disabled={loading || adding} onClick={() => void add("file", joinWindowsPath(listing.path, file))}>
              <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}><FaFileAudio /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file}</span></span>
            </DialogButton>
          ))}
          {!loading && !listing.dirs.length && !listing.files.length ? <div style={{ padding: 14, opacity: .62 }}>{t.noAudioFiles}</div> : null}
        </Focusable>
      </div>
    </ModalRoot>
  );
}

export function FanartSettingsPanel() {
  const t = useLocalTranslations();
  const [fanartApiKey, setFanartApiKey] = useState("");
  const [fanartSaved, setFanartSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void python.getArtistBackgroundProviderSettings().then((value) => {
      if (!cancelled) setFanartApiKey(value.fanartApiKey || "");
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  async function saveFanartKey() {
    setBusy(true);
    setFanartSaved(false);
    try {
      const value = await python.setFanartApiKey(fanartApiKey.trim());
      setFanartApiKey(value.fanartApiKey || "");
      setFanartSaved(true);
      window.setTimeout(() => setFanartSaved(false), 2400);
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="npFanartSettingsPanel" style={{ width: "100%" }}>
      <style>{`
        .npFanartSettingsPanel button,.npFanartSettingsPanel button *{color:#fff!important;text-align:left!important}
        .npFanartSettingsPanel button{font-size:.82em!important}
        .npFanartSettingsPanel button>span{justify-content:flex-start!important;font-size:1em!important}
        .npFanartSettingsPanel button:hover,.npFanartSettingsPanel button:focus,.npFanartSettingsPanel button.gpfocus{background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 0 0 1px rgba(255,255,255,.22),0 0 18px rgba(255,255,255,.10)!important}
      `}</style>
      <div style={{ marginTop: 14, padding: "0 4px", fontSize: ".72em", fontWeight: 700, opacity: .64 }}>{t.fanartProvider}</div>
      <div style={{ marginTop: 6, padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.045)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <DialogButton
            style={{ width: "auto", minWidth: 0, height: 30, minHeight: 30, padding: "0 9px" }}
            onClick={() => void python.openExternalUrl("https://fanart.tv/get-an-api-key/")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".68em", whiteSpace: "nowrap" }}><FaExternalLinkAlt /> {t.fanartApiPage}</span>
          </DialogButton>
        </div>
        <p style={{ margin: "7px 0 8px", fontSize: ".65em", lineHeight: 1.4, opacity: .56 }}>{t.fanartProviderDescription}</p>
        <input
          type="password"
          value={fanartApiKey}
          spellCheck={false}
          autoComplete="off"
          placeholder={t.fanartApiKey}
          onChange={(event) => { setFanartApiKey(event.currentTarget.value); setFanartSaved(false); }}
          style={{ width: "100%", boxSizing: "border-box", height: 36, padding: "0 10px", borderRadius: 7, background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.12)", color: "#fff", fontFamily: "monospace", fontSize: ".68em" }}
        />
        <DialogButton style={{ width: "100%", minWidth: "100%", height: 38, marginTop: 6, padding: 0 }} disabled={busy} onClick={() => void saveFanartKey()}>
          <span style={{ width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }}>{fanartSaved ? <FaCheck /> : <FaSyncAlt />} {fanartSaved ? t.saved : t.saveFanartApiKey}</span>
        </DialogButton>
      </div>
    </div>
  );
}

export function LocalMusicSettingsPanel({ selectedService: _selectedService }: { selectedService: string }) {
  const t = useLocalTranslations();
  const [settings, setSettings] = useState<LocalMusicSettings>({ folders: [], files: [], lastScan: 0, stats: { tracks: 0, albums: 0, artists: 0, playlists: 0, scannedAt: 0 } });
  const [busy, setBusy] = useState(false);
  const [cacheBusy, setCacheBusy] = useState(false);
  const [cacheProgress, setCacheProgress] = useState<LocalMusicCacheProgress>({
    active: false,
    phase: "idle",
    current: "",
    completed: 0,
    total: 0,
  });
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const reload = useCallback(async () => setSettings(await python.getLocalMusicSettings()), []);

  useEffect(() => { void reload(); }, [reload]);
  useEffect(() => {
    if (!cacheBusy) return;
    let cancelled = false;
    let timer = 0;
    const poll = async () => {
      try {
        const progress = await python.getLocalMusicCacheProgress();
        if (!cancelled) setCacheProgress(progress);
      } catch {
        // The cache build itself reports any final error. A missed progress poll
        // must not interrupt the operation or create a second toast.
      }
      if (!cancelled) timer = window.setTimeout(() => void poll(), 350);
    };
    void poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [cacheBusy]);

  async function addSelection(kind: "folder" | "file", path: string) {
    setBusy(true);
    try {
      const result = kind === "file" ? await python.addLocalMusicFile(path) : await python.addLocalMusicFolder(path);
      if (!result.ok) throw new Error(result.error || t.openFolderError);
      if (result.settings) setSettings(result.settings);

      setCacheBusy(true);
      const cacheResult = await python.buildLocalMusicCache();
      if (!cacheResult.ok) throw new Error(cacheResult.error || t.playerError);
      COVER_CACHE.clear();
      ARTIST_PROFILE_CACHE.clear();
      if (cacheResult.settings) setSettings(cacheResult.settings);
      else await reload();
      setCacheProgress((previous) => ({ ...previous, active: false, phase: "complete", current: "", completed: previous.total || previous.completed, total: previous.total || previous.completed }));
      window.setTimeout(() => setCacheProgress((previous) => previous.phase === "complete" ? { active: false, phase: "idle", current: "", completed: 0, total: 0 } : previous), 2600);
      toaster.toast({ title: t.yourMusic, body: t.scanComplete, duration: 2400 });
      return true;
    } catch (error: any) {
      const message = String(error?.message ?? error ?? "");
      if (message && !/cancel/i.test(message)) showError(message || t.openFolderError);
      return false;
    } finally {
      setCacheBusy(false);
      setBusy(false);
      window.setTimeout(() => settingsPanelRef.current?.scrollIntoView?.({ block: "nearest", inline: "nearest" }), 0);
    }
  }

  function chooseFolder() {
    let modal: ReturnType<typeof showModal> | null = null;
    const closeModal = () => modal?.Close?.();
    modal = showModal(
      <LocalMusicPickerModal
        initialPath={settings.folders[0] || settings.files?.[0]?.replace(/[\\/][^\\/]+$/, "") || "C:\\"}
        closeModal={closeModal}
        onAdd={addSelection}
      />,
    );
  }

  async function removeFolder(folder: string) {
    setBusy(true);
    try {
      const result = await python.removeLocalMusicFolder(folder);
      if (!result.ok) throw new Error(result.error || t.playerError);
      COVER_CACHE.clear();
      ARTIST_PROFILE_CACHE.clear();
      if (result.settings) setSettings(result.settings);
    } finally {
      setBusy(false);
    }
  }

  async function removeFile(path: string) {
    setBusy(true);
    try {
      const result = await python.removeLocalMusicFile(path);
      if (!result.ok) throw new Error(result.error || t.playerError);
      COVER_CACHE.clear();
      ARTIST_PROFILE_CACHE.clear();
      if (result.settings) setSettings(result.settings);
      else await reload();
    } catch (error: any) {
      showError(String(error?.message ?? error ?? t.playerError));
    } finally {
      setBusy(false);
    }
  }

  async function clearCache() {
    setBusy(true);
    setCacheBusy(true);
    try {
      const result = await python.clearLocalMusicCache();
      if (!result.ok) throw new Error(result.error || t.playerError);
      COVER_CACHE.clear();
      ARTIST_PROFILE_CACHE.clear();
      if (result.settings) setSettings(result.settings);
      else await reload();
      setCacheProgress((previous) => ({ ...previous, active: false, phase: "cleared", current: "", completed: previous.total || previous.completed, total: previous.total || previous.completed }));
      window.setTimeout(() => setCacheProgress((previous) => previous.phase === "cleared" ? { active: false, phase: "idle", current: "", completed: 0, total: 0 } : previous), 2600);
      toaster.toast({ title: t.yourMusic, body: t.cacheCleared, duration: 2200 });
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setCacheBusy(false);
      setBusy(false);
    }
  }

  async function clearManualBackgrounds() {
    setBusy(true);
    setCacheBusy(true);
    try {
      const result = await python.clearManualArtistBackgrounds("local");
      if (!result.ok) throw new Error(result.error || t.playerError);
      COVER_CACHE.clear();
      ARTIST_PROFILE_CACHE.clear();
      await reload();
      setCacheProgress({ active: false, phase: "manual_cleared", current: "", completed: Number(result.data?.files || 0), total: Number(result.data?.files || 0) });
      window.setTimeout(() => setCacheProgress((previous) => previous.phase === "manual_cleared" ? { active: false, phase: "idle", current: "", completed: 0, total: 0 } : previous), 2800);
      toaster.toast({ title: t.yourMusic, body: t.manualBackgroundsRemoved, duration: 2400 });
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setCacheBusy(false);
      setBusy(false);
    }
  }

  async function createCache() {
    setBusy(true);
    setCacheBusy(true);
    try {
      const result = await python.buildLocalMusicCache();
      if (!result.ok) throw new Error(result.error || t.playerError);
      COVER_CACHE.clear();
      ARTIST_PROFILE_CACHE.clear();
      if (result.settings) setSettings(result.settings);
      else await reload();
      setCacheProgress((previous) => ({ ...previous, active: false, phase: "complete", current: "", completed: previous.total || previous.completed, total: previous.total || previous.completed }));
      window.setTimeout(() => setCacheProgress((previous) => previous.phase === "complete" ? { active: false, phase: "idle", current: "", completed: 0, total: 0 } : previous), 2600);
      toaster.toast({ title: t.yourMusic, body: t.cacheCreated, duration: 2400 });
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setCacheBusy(false);
      setBusy(false);
    }
  }

  async function scan() {
    setBusy(true);
    try {
      const result = await python.scanLocalMusic();
      if (!result.ok) throw new Error(result.error || t.playerError);
      await reload();
      toaster.toast({ title: t.yourMusic, body: t.scanComplete, duration: 2400 });
    } catch (error: any) {
      showError(error?.message ?? String(error));
    } finally {
      setBusy(false);
    }
  }

  const cacheProgressLabel = (() => {
    const name = String(cacheProgress.current || "").trim();
    if (cacheProgress.phase === "clearing") return cacheProgress.current ? formatTranslation(t.cacheProgressRemoving, { name: cacheProgress.current }) : t.cacheClearing;
    if (cacheProgress.phase === "cleared") return t.cacheCleared;
    if (cacheProgress.phase === "clearing_manual") return cacheProgress.current ? `${t.manualBackgroundsRemoving} ${cacheProgress.current}` : t.manualBackgroundsRemoving;
    if (cacheProgress.phase === "manual_cleared") return t.manualBackgroundsRemoved;
    if (cacheProgress.phase === "complete") return t.cacheCreated;
    if (cacheProgress.phase === "scanning") return t.cacheProgressScanning;
    if (cacheProgress.phase === "profile" && name) return formatTranslation(t.cacheProgressProfile, { name });
    if (cacheProgress.phase === "background" && name) return formatTranslation(t.cacheProgressBackground, { name });
    return t.cacheBuilding;
  })();
  const cacheProgressPercent = cacheProgress.total > 0
    ? Math.max(0, Math.min(100, (cacheProgress.completed / cacheProgress.total) * 100))
    : 0;

  const stats = settings.stats;
  const cacheSizeMb = Math.max(0, Number(settings.cacheBytes || 0)) / (1024 * 1024);
  const cacheSizeLabel = cacheSizeMb < 0.01 ? "0.00" : cacheSizeMb.toFixed(2);
  const manualBackgroundSizeMb = Math.max(0, Number(settings.manualBackgroundBytes || 0)) / (1024 * 1024);
  const manualBackgroundSizeLabel = manualBackgroundSizeMb < 0.01 ? "0.00" : manualBackgroundSizeMb.toFixed(2);
  return (
    <div ref={settingsPanelRef} className="npLocalSettingsPanel" style={{ width: "100%" }}>
      <style>{`
        .npLocalSettingsPanel button,.npLocalSettingsPanel button *{color:#fff!important;text-align:left!important}
        .npLocalSettingsPanel button{font-size:.82em!important}
        .npLocalSettingsPanel button>span{justify-content:flex-start!important;font-size:1em!important}
        .npLocalSettingsPanel button.npLocalRemoveFolderButton>span{display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important}
        .npLocalSettingsPanel button.npLocalRemoveFolderButton svg{margin:0!important}
        .npLocalSettingsPanel button:hover,.npLocalSettingsPanel button:focus,.npLocalSettingsPanel button.gpfocus{background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 0 0 1px rgba(217,163,55,.28),0 0 18px rgba(217,163,55,.15)!important}
      `}</style>
      <div style={{ marginTop: 14, padding: "0 4px", fontSize: ".72em", fontWeight: 700, opacity: .64 }}>{t.yourMusic}</div>
      <div style={{ marginTop: 6, padding: 12, borderRadius: 10, border: "1px solid rgba(217,163,55,.28)", background: "linear-gradient(145deg, rgba(217,163,55,.13), rgba(0,0,0,.22))" }}>
        <p style={{ margin: "0 0 8px", fontSize: ".72em", lineHeight: 1.42, opacity: .74 }}>{t.settingsDescription}</p>
        <p style={{ margin: "0 0 10px", fontSize: ".66em", lineHeight: 1.38, opacity: .54 }}>{t.formats}</p>
        <DialogButton className="npLocalSettingsButton" style={{ width: "100%", minWidth: "100%", height: 38, padding: 0 }} disabled={busy} onClick={() => void chooseFolder()}>
          <span style={{ width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }}><FaMusic /> {t.chooseFolder}</span>
        </DialogButton>
        <div style={{ marginTop: 10 }}>
          {settings.folders.length ? settings.folders.map((folder) => (
            <Focusable key={folder} flow-children="horizontal" style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <div style={{ flex: 1, minWidth: 0, padding: "8px 9px", borderRadius: 7, background: "rgba(0,0,0,.24)", fontSize: ".67em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{folder}</div>
              <DialogButton className="npLocalRemoveFolderButton" style={{ width: 38, minWidth: 38, height: 34, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }} disabled={busy} onClick={() => void removeFolder(folder)} aria-label={t.remove}><span style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><FaTimes /></span></DialogButton>
            </Focusable>
          )) : <div style={{ fontSize: ".68em", opacity: .55, padding: "6px 2px" }}>{t.noFolders}</div>}
          {(settings.files || []).map((path) => (
            <Focusable key={path} flow-children="horizontal" style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <div style={{ flex: 1, minWidth: 0, padding: "8px 9px", borderRadius: 7, background: "rgba(0,0,0,.24)", fontSize: ".67em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}><FaFileAudio style={{ marginRight: 7 }} />{path}</div>
              <DialogButton className="npLocalRemoveFolderButton" style={{ width: 38, minWidth: 38, height: 34, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }} disabled={busy} onClick={() => void removeFile(path)} aria-label={t.remove}><span style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><FaTimes /></span></DialogButton>
            </Focusable>
          ))}
        </div>
        <DialogButton className="npLocalSettingsButton" style={{ width: "100%", minWidth: "100%", height: 38, marginTop: 5, padding: 0 }} disabled={busy || (!settings.folders.length && !(settings.files || []).length)} onClick={() => void scan()}>
          <span style={{ width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }}><FaSyncAlt className={busy ? "npLocalSpin" : ""} /> {busy ? t.scanning : t.scan}</span>
        </DialogButton>
        <DialogButton className="npLocalSettingsButton" style={{ width: "100%", minWidth: "100%", height: 38, marginTop: 6, padding: 0 }} disabled={busy || cacheBusy || (!settings.folders.length && !(settings.files || []).length)} onClick={() => void createCache()}>
          <span style={{ width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }}><FaCompactDisc className={cacheBusy ? "npLocalSpin" : ""} /> {cacheBusy ? t.cacheBuilding : t.createCache}</span>
        </DialogButton>
        {(cacheBusy || ["complete", "cleared", "manual_cleared", "error"].includes(cacheProgress.phase)) ? (
          <div style={{ marginTop: 7, padding: "8px 9px", borderRadius: 7, background: "rgba(255,255,255,.045)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: ".66em", lineHeight: 1.3 }}>
              <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: .76 }}>{cacheProgressLabel}</span>
              {cacheProgress.total > 0 ? <span style={{ flex: "0 0 auto", opacity: .5 }}>{cacheProgress.completed}/{cacheProgress.total}</span> : null}
            </div>
            <div style={{ height: 3, marginTop: 6, borderRadius: 999, background: "rgba(255,255,255,.10)", overflow: "hidden" }}>
              <div style={{ width: cacheProgress.total > 0 ? `${cacheProgressPercent}%` : "32%", height: "100%", borderRadius: 999, background: LOCAL_ACCENT, transition: "width 180ms ease" }} />
            </div>
          </div>
        ) : null}
        <DialogButton className="npLocalSettingsButton" style={{ width: "100%", minWidth: "100%", height: 38, marginTop: 6, padding: 0 }} disabled={busy || cacheBusy} onClick={() => void clearCache()}>
          <span style={{ width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", textAlign: "left" }}><FaTimes /> {cacheProgress.phase === "clearing" ? t.cacheClearing : t.clearCache}</span>
        </DialogButton>
        <div style={{ marginTop: 7, padding: "7px 9px", borderRadius: 7, background: "rgba(255,255,255,.035)", display: "flex", justifyContent: "space-between", gap: 8, fontSize: ".66em" }}>
          <span style={{ opacity: .58 }}>{t.cacheSize}</span><strong>{cacheSizeLabel} MB</strong>
        </div>
        <div style={{ marginTop: 7, padding: "8px 9px", borderRadius: 7, background: "rgba(255,255,255,.035)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: ".66em" }}><span style={{ opacity: .58 }}>{t.manualBackgrounds}</span><strong>{manualBackgroundSizeLabel} MB</strong></div>
          <div style={{ marginTop: 5, fontSize: ".63em", lineHeight: 1.35, opacity: .5 }}>{t.manualBackgroundsDescription}</div>
        </div>
        <DialogButton className="npLocalSettingsButton" style={{ width: "100%", minWidth: "100%", minHeight: 42, marginTop: 6, padding: 0 }} disabled={busy || cacheBusy || Number(settings.manualBackgroundFiles || 0) <= 0} onClick={() => void clearManualBackgrounds()}>
          <span style={{ width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-start", padding: "0 10px", boxSizing: "border-box", fontSize: ".82em", lineHeight: 1.18, textAlign: "left" }}><FaTimes /> {cacheProgress.phase === "clearing_manual" ? t.manualBackgroundsRemoving : t.removeManualBackgrounds}</span>
        </DialogButton>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 10, fontSize: ".67em" }}>
          {[[t.tracksCount, stats.tracks], [t.albumsCount, stats.albums], [t.artistsCount, stats.artists]].map(([label, value]) => (
            <div key={String(label)} style={{ padding: "7px 8px", borderRadius: 7, background: "rgba(255,255,255,.045)", display: "flex", justifyContent: "space-between", gap: 6 }}><span style={{ opacity: .62 }}>{label}</span><strong>{value}</strong></div>
          ))}
        </div>
      </div>
    </div>
  );
}

type BrowserTab = "home" | "search" | "library" | "queue";
type LibrarySection = "tracks" | "albums" | "artists";
type Detail = { kind: "album" | "artist"; id: string; title: string };
type LocalAlbumRequest = { id: string; title: string; nonce: number };

const qamButton: CSSProperties = { width: "100%", minWidth: "100%", height: 38, minHeight: 38, padding: 0 };

function LocalTrackRow({ track, onActivate }: { track: any; onActivate: () => void }) {
  return (
    <DialogButton style={{ ...qamButton, height: 54, minHeight: 54, marginBottom: 6 }} onClick={onActivate}>
      <span style={{ display: "flex", width: "100%", alignItems: "center", gap: 9, padding: "5px 8px", boxSizing: "border-box", textAlign: "left" }}>
        <LocalArtwork item={track} size={42} />
        <span style={{ minWidth: 0, flex: 1 }}><strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: ".86em" }}>{track?.name}</strong><span style={{ display: "block", marginTop: 3, fontSize: ".7em", opacity: .6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artistText(track)}</span></span>
        <span style={{ fontSize: ".67em", opacity: .45 }}>{formatDuration(track?.duration_ms)}</span>
      </span>
    </DialogButton>
  );
}

function LocalItemRow({ item, onActivate }: { item: any; onActivate: () => void }) {
  return (
    <DialogButton style={{ ...qamButton, height: 54, minHeight: 54, marginBottom: 6 }} onClick={onActivate}>
      <span style={{ display: "flex", width: "100%", alignItems: "center", gap: 9, padding: "5px 8px", boxSizing: "border-box", textAlign: "left" }}>
        <LocalArtwork item={item} size={42} round={itemType(item) === "artist"} />
        <span style={{ minWidth: 0, flex: 1 }}><strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: ".86em" }}>{item?.name}</strong><span style={{ display: "block", marginTop: 3, minHeight: "1.25em", paddingBottom: 2, fontSize: ".7em", lineHeight: 1.25, opacity: .6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artistText(item)}</span></span>
      </span>
    </DialogButton>
  );
}

export const LocalMusicBrowser = memo(function LocalMusicBrowser({ openAlbumRequest, onOpenBigPicture }: { openAlbumRequest?: LocalAlbumRequest | null; onOpenBigPicture: () => void }) {
  const t = useLocalTranslations();
  const [tab, setTab] = useState<BrowserTab>("home");
  const [section, setSection] = useState<LibrarySection>("tracks");
  const [home, setHome] = useState<any>({ albums: [], artists: [] });
  const [library, setLibrary] = useState<any>({ items: [] });
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [history, setHistory] = useState<Detail[]>([]);
  const [loading, setLoading] = useState(false);
  const audioState = useLocalAudioState();
  const lastAlbumRequestRef = useRef(0);
  const previousTabRef = useRef<Exclude<BrowserTab, "queue">>("home");

  const loadHome = useCallback(async () => {
    setLoading(true);
    try { setHome(await python.getLocalMusicHome()); } finally { setLoading(false); }
  }, []);
  const loadLibrary = useCallback(async (next: LibrarySection) => {
    setSection(next);
    setLoading(true);
    try { setLibrary(await python.getLocalMusicLibrary(next)); } finally { setLoading(false); }
  }, []);

  const loadDetail = useCallback(async (next: Detail) => {
    const data = await python.getLocalMusicDetail(next.kind, next.id);
    setDetailData(data);
    if (next.kind === "artist") {
      const artistName = String(data?.item?.name ?? next.title ?? "");
      if (artistName) {
        void python.getArtistBackground(artistName).then((url) => {
          if (!url) return;
          setDetailData((current: any) => current?.item?.id === next.id ? { ...current, backgroundImage: url } : current);
        }).catch(() => {});
      }
    }
    return data;
  }, []);

  useEffect(() => { void loadHome(); }, [loadHome]);

  useEffect(() => {
    if (!openAlbumRequest?.id || openAlbumRequest.nonce === lastAlbumRequestRef.current) return;
    lastAlbumRequestRef.current = openAlbumRequest.nonce;
    setHistory([]);
    setDetail({ kind: "album", id: openAlbumRequest.id, title: openAlbumRequest.title });
    setLoading(true);
    const next = { kind: "album", id: openAlbumRequest.id, title: openAlbumRequest.title } as Detail;
    void loadDetail(next).finally(() => setLoading(false));
  }, [loadDetail, openAlbumRequest?.id, openAlbumRequest?.nonce, openAlbumRequest?.title]);

  async function openDetail(item: any) {
    const kind = itemType(item);
    if (kind !== "album" && kind !== "artist") return;
    if (detail) setHistory((value) => [...value, detail]);
    const next = { kind, id: String(item.id), title: String(item.name ?? "") } as Detail;
    setDetail(next);
    setDetailData(null);
    setLoading(true);
    try { await loadDetail(next); } finally { setLoading(false); }
  }

  async function playTracks(entries: any[], index = 0) {
    try {
      await python.pauseExternalPlayback().catch(() => false);
      await localAudioPlayer.playItems(entries.map(normalizeTrack), index);
    } catch (error: any) {
      showError(error?.message ?? String(error));
    }
  }

  function goBack(event?: any) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const previous = history[history.length - 1];
    if (previous) {
      setHistory((value) => value.slice(0, -1));
      setDetail(previous);
      setDetailData(null);
      setLoading(true);
      void loadDetail(previous).finally(() => setLoading(false));
    } else {
      setDetail(null);
      setDetailData(null);
    }
    return true;
  }

  function renderDetail() {
    if (loading || !detailData) return <div style={{ padding: "18px 8px", opacity: .62 }}>{t.scanning}</div>;
    const item = detailData?.item;
    if (!item) return <div style={{ padding: "18px 8px", opacity: .62 }}>{t.nothingHere}</div>;
    const tracks = detailData?.tracks ?? [];
    const albums = detailData?.albums ?? [];
    const albumArtist = item?.artists?.[0];
    return <>
      <DialogButton className="npLocalMinimalButton" style={{ ...qamButton, marginTop: 18 }} onClick={goBack}><span style={{ display: "flex", gap: 7, alignItems: "center", justifyContent: "center", fontSize: ".8em" }}><FaArrowLeft /> {t.back}</span></DialogButton>
      <div style={{ height: 8 }} />
      <div style={{ display: "flex", gap: 10, padding: 10, borderRadius: 10, background: "rgba(217,163,55,.10)", border: "1px solid rgba(217,163,55,.20)" }}><LocalArtwork item={item} size={70} round={detail?.kind === "artist"} /><div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}><strong>{item?.name}</strong><span style={{ marginTop: 4, fontSize: ".7em", opacity: .58 }}>{artistText(item)}</span></div></div>
      {detail?.kind === "album" && albumArtist?.id ? <><div style={{ height: 7 }} /><DialogButton style={qamButton} onClick={() => void openDetail({ ...albumArtist, type: "artist" })}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><FaUser /> {t.artist}</span></DialogButton></> : null}
      {detail?.kind === "artist" && albums.length ? <><div style={{ margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }}>{t.albums}</div>{albums.map((album: any) => <LocalItemRow key={album.id} item={album} onActivate={() => void openDetail(album)} />)}</> : null}
      <div style={{ margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }}>{t.tracks}</div>
      {tracks.map((track: any, index: number) => <LocalTrackRow key={track.id} track={track} onActivate={() => void playTracks(tracks, index)} />)}
    </>;
  }

  function renderHome() {
    return <>
      {home.albums?.length ? <><div style={{ margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }}>{t.recentAlbums}</div>{home.albums.map((item: any) => <LocalItemRow key={item.id} item={item} onActivate={() => void openDetail(item)} />)}</> : null}
      {home.artists?.length ? <><div style={{ margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }}>{t.artists}</div>{home.artists.map((item: any) => <LocalItemRow key={item.id} item={item} onActivate={() => void openDetail(item)} />)}</> : null}
      {!home.albums?.length && !home.artists?.length && !loading ? <div style={{ padding: 12, fontSize: ".72em", opacity: .56 }}>{t.nothingHere}</div> : null}
    </>;
  }

  async function executeSearch() {
    if (search.trim().length < 2) return;
    setLoading(true);
    try { setResults(await python.searchLocalMusic(search)); } finally { setLoading(false); }
  }

  function renderSearch() {
    const groups: [string, any[]][] = [[t.tracks, results?.tracks ?? []], [t.albums, results?.albums ?? []], [t.artists, results?.artists ?? []]];
    return <>
      <div style={{ height: 8 }} />
      <TextField label={t.searchMusic} value={search} onChange={(value: any) => setSearch(typeof value === "string" ? value : String(value?.target?.value ?? ""))} onKeyDown={(event: any) => { if (event.key === "Enter") { event.preventDefault(); void executeSearch(); } }} />
      <div style={{ height: 6 }} />
      <DialogButton style={qamButton} onClick={() => void executeSearch()} disabled={search.trim().length < 2}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}><FaSearch /> {t.search}</span></DialogButton>
      {groups.map(([label, items]) => items.length ? <div key={label}><div style={{ margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }}>{label}</div>{items.map((item: any, index: number) => itemType(item) === "track" ? <LocalTrackRow key={item.id} track={item} onActivate={() => void playTracks(items, index)} /> : <LocalItemRow key={item.id} item={item} onActivate={() => void openDetail(item)} />)}</div> : null)}
      {results && !groups.some(([, items]) => items.length) ? <div style={{ padding: 12, fontSize: ".72em", opacity: .56 }}>{t.noResults}</div> : null}
    </>;
  }

  function renderLibrary() {
    const labels: Record<LibrarySection, string> = { tracks: t.tracks, albums: t.albums, artists: t.artists };
    const items = library?.items ?? [];
    return <>
      <div style={{ height: 8 }} />
      <Focusable flow-children="grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 6, width: "100%" }}>
        {(Object.keys(labels) as LibrarySection[]).map((key) => (
          <DialogButton key={key} style={{ ...qamButton, minWidth: 0, padding: 0, opacity: section === key ? 1 : .58 }} onClick={() => void loadLibrary(key)}>
            <span style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: 0, fontSize: ".74em", lineHeight: 1, textAlign: "center", whiteSpace: "nowrap" }}>
              {key === "tracks" ? <FaMusic size={12} /> : key === "albums" ? <FaCompactDisc size={12} /> : <FaUser size={12} />}
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>{labels[key]}</span>
            </span>
          </DialogButton>
        ))}
      </Focusable>
      <div style={{ margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }}>{labels[section]}</div>
      {section === "tracks" && items.length ? <Focusable flow-children="horizontal" style={{ display: "flex", gap: 6, marginBottom: 7 }}>
        <DialogButton style={{ ...qamButton, flex: 1, minWidth: 0 }} onClick={() => void playTracks(items, 0)}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: ".74em", lineHeight: 1 }}><FaPlay size={12} /> {t.play}</span></DialogButton>
        <DialogButton style={{ ...qamButton, flex: 1, minWidth: 0 }} onClick={() => { const shuffled = [...items].sort(() => Math.random() - .5); void playTracks(shuffled, 0); }}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: ".74em", lineHeight: 1 }}><FaRandom size={12} /> {t.shuffle}</span></DialogButton>
      </Focusable> : null}
      {items.map((item: any, index: number) => section === "tracks" ? <LocalTrackRow key={item.id} track={item} onActivate={() => void playTracks(items, index)} /> : <LocalItemRow key={item.id} item={item} onActivate={() => void openDetail(item)} />)}
      {!items.length && !loading ? <div style={{ padding: 12, fontSize: ".72em", opacity: .56 }}>{t.nothingHere}</div> : null}
    </>;
  }

  function renderQueue() {
    const upcoming = audioState.index >= 0 ? audioState.queue.slice(audioState.index + 1, audioState.index + 11) : [];
    return <>
      <div style={{ margin: "12px 4px 6px", fontSize: ".7em", fontWeight: 700, opacity: .62 }}>{t.queue}</div>
      {upcoming.map((track: any, index: number) => (
        <LocalTrackRow
          key={`${track?.id ?? index}-${index}`}
          track={track}
          onActivate={() => void localAudioPlayer.playIndex(audioState.index + index + 1).catch((error: any) => showError(error?.message ?? String(error)))}
        />
      ))}
      {!upcoming.length ? <div style={{ padding: 12, fontSize: ".72em", opacity: .56 }}>{t.queueEmpty}</div> : null}
    </>;
  }

  return <div style={{ width: "100%" }}>
    <style>{`
      .npLocalSpin{animation:npLocalSpin 1s linear infinite}@keyframes npLocalSpin{to{transform:rotate(360deg)}}
      .npLocalMinimalButton,.npLocalMinimalButton *{color:#fff!important}
      .npLocalMinimalButton:focus,.npLocalMinimalButton.gpfocus{background:rgba(255,255,255,.11)!important;border-color:rgba(255,255,255,.19)!important;box-shadow:0 0 0 1px rgba(217,163,55,.24),0 0 18px rgba(217,163,55,.14)!important}
      .npLocalSettingsButton,.npLocalSettingsButton *{text-align:left!important}
    `}</style>
    <div aria-hidden="true" style={{ height: 2, margin: "2px 4px 4px", borderRadius: 999, background: "linear-gradient(90deg,transparent,rgba(217,163,55,.68),transparent)", boxShadow: "0 0 14px rgba(217,163,55,.24)" }} />
    <DialogButton className="npLocalMinimalButton" style={{ ...qamButton, border: "1px solid rgba(255,255,255,.075)", background: "rgba(255,255,255,.025)" }} onClick={onOpenBigPicture}><span style={{ width: "100%", display: "flex", gap: 8, alignItems: "center", justifyContent: "center", fontSize: ".76em", fontWeight: 430 }}><FaExpandArrowsAlt size={12} /> {t.bigPicture}</span></DialogButton>
    <div style={{ height: 7 }} />
    <Focusable flow-children="grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 6 }}>
      {(["home", "library", "search", "queue"] as BrowserTab[]).map((key) => <DialogButton key={key} style={{ width: "100%", minWidth: 0, height: 32, minHeight: 32, padding: 0, opacity: tab === key && !detail ? 1 : .58 }} onClick={() => {
        setDetail(null); setDetailData(null); setHistory([]);
        if (key === "queue") {
          setTab((current) => current === "queue" ? previousTabRef.current : "queue");
          return;
        }
        previousTabRef.current = key;
        setTab(key);
        if (key === "home" && !home.albums?.length) void loadHome();
        if (key === "library" && !library.items?.length) void loadLibrary(section);
      }}><span style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, fontSize: ".68em", lineHeight: 1, whiteSpace: "nowrap" }}>{key === "home" ? <FaHome /> : key === "search" ? <FaSearch /> : key === "library" ? <FaList /> : <FaListOl />}{key === "home" ? t.home : key === "search" ? t.search : key === "library" ? t.library : t.queue}</span></DialogButton>)}
    </Focusable>
    {detail ? <Focusable flow-children="vertical" onCancel={goBack} onCancelButton={goBack}>{renderDetail()}</Focusable> : tab === "home" ? renderHome() : tab === "search" ? renderSearch() : tab === "library" ? renderLibrary() : renderQueue()}
  </div>;
});

function TvCard({ item, onActivate, round = false, focusKey, gridIndex, preferredFocus = false }: { item: any; onActivate: () => void; round?: boolean; focusKey?: string; gridIndex?: number; preferredFocus?: boolean }) {
  return (
    <DialogButton preferredFocus={preferredFocus} className="npLocalTvCard" {...({ "data-np-focus-key": focusKey || undefined, "data-np-grid-index": Number.isFinite(gridIndex) ? gridIndex : undefined } as any)} onClick={onActivate} style={{ width: "100%", minWidth: 0, height: "auto", minHeight: 0, padding: 10, borderRadius: 12, overflow: "hidden", textAlign: "left" }}>
      <span style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", minWidth: 0 }}>
        <span style={{ width: "100%", aspectRatio: "1/1", borderRadius: round ? "50%" : 8, overflow: "hidden", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LocalCardImage item={item} round={round} />
        </span>
        <strong style={{ marginTop: 11, fontSize: 16, lineHeight: 1.15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 650 }}>{item?.name}</strong>
        <span style={{ marginTop: 5, fontSize: 13, opacity: .58, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artistText(item) || String(item?.year ?? "")}</span>
      </span>
    </DialogButton>
  );
}

function LocalCardImage({ item, round = false }: { item: any; round?: boolean }) {
  const coverId = String(item?.coverId ?? item?.album?.coverId ?? "");
  const coverUrl = useLocalCover(coverId);
  const profileUrl = useLocalArtistProfile(round || itemType(item) === "artist" ? item : null);
  const url = profileUrl || coverUrl;
  return url ? <img loading="lazy" src={url} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: round ? "50%" : 0 }} /> : <FaMusic size={44} style={{ opacity: .36 }} />;
}

function TvTrack({ track, index, onActivate, showArtwork = true }: { track: any; index: number; onActivate: () => void; showArtwork?: boolean }) {
  return (
    <DialogButton className="npLocalTvTrack" onClick={onActivate} style={{ width: "100%", minWidth: "100%", height: 66, minHeight: 66, padding: "0 16px", borderRadius: 10, marginBottom: 6, textAlign: "left" }}>
      <span style={{ display: "grid", gridTemplateColumns: showArtwork ? "32px 48px minmax(0,1fr) auto" : "32px minmax(0,1fr) auto", alignItems: "center", gap: showArtwork ? 13 : 16, width: "100%" }}>
        <span style={{ opacity: .45, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{index + 1}</span>
        {showArtwork ? <LocalArtwork item={track} size={44} /> : null}
        <span style={{ minWidth: 0 }}><strong style={{ display: "block", fontSize: 16, fontWeight: 620, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track?.name}</strong><span style={{ display: "block", marginTop: 4, opacity: .56, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artistText(track)}</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 14, opacity: .62 }}><span style={{ fontVariantNumeric: "tabular-nums", fontSize: 13 }}>{formatDuration(track?.duration_ms)}</span><FaPlay size={13} /></span>
      </span>
    </DialogButton>
  );
}

export function LocalMusicBigPicture({ onExit, onOpenVisualizer, onOpenSettings }: { onExit: () => void; onOpenVisualizer: () => void; onOpenSettings: () => void }) {
  const t = useLocalTranslations();
  const coreT = useMemo(() => getTranslations("core"), []);
  const [tab, setTab] = useState<BrowserTab>("home");
  const [section, setSection] = useState<LibrarySection>("tracks");
  const [home, setHome] = useState<any>({ albums: [], artists: [] });
  const [library, setLibrary] = useState<any>({ items: [] });
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [history, setHistory] = useState<Detail[]>([]);
  const [queueExpanded, setQueueExpanded] = useState(false);
  const state = useLocalAudioState();
  const [volume, setVolume] = useState(() => state.volume);
  const [loading, setLoading] = useState(false);
  const volumeRef = useRef(100);
  const volumeTimer = useRef<number>(0);
  const volumeInteractionAtRef = useRef(0);
  const playerCoverRef = useRef<any>(null);
  const rootDetailFocusKeyRef = useRef("");
  const restoringTabRef = useRef<BrowserTab | null>(null);
  const restoringTabUntilRef = useRef(0);
  const restoreFocusTimersRef = useRef<number[]>([]);
  const [restoreFocusKey, setRestoreFocusKey] = useState("");
  const [backgroundSettingsOpen, setBackgroundSettingsOpen] = useState(false);

  const loadHome = useCallback(async () => setHome(await python.getLocalMusicHome()), []);
  const loadLibrary = useCallback(async (next: LibrarySection) => { setSection(next); setLibrary(await python.getLocalMusicLibrary(next, 0, 100000)); }, []);

  const clearRestoreFocusTimers = useCallback(() => {
    restoreFocusTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    restoreFocusTimersRef.current = [];
  }, []);

  const restoreRootCardFocus = useCallback(() => {
    const key = rootDetailFocusKeyRef.current;
    if (!key) return;
    restoringTabRef.current = tab;
    restoringTabUntilRef.current = Date.now() + 900;
    clearRestoreFocusTimers();
    setRestoreFocusKey(key);
    const delays = [40, 120, 260, 520, 900, 1400];
    const attempt = () => {
      if (rootDetailFocusKeyRef.current !== key) return;
      const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(key) : key.replace(/["\\]/g, "\\$&");
      const root = document.querySelector<HTMLElement>(".npLocalBig");
      const element = root?.querySelector<HTMLElement>(`[data-np-focus-key="${escaped}"]`) ?? document.querySelector<HTMLElement>(`[data-np-focus-key="${escaped}"]`);
      if (!element) return;
      element.scrollIntoView?.({ block: "nearest", inline: "nearest" });
      element.focus?.({ preventScroll: true });
      if (document.activeElement === element) {
        restoringTabRef.current = null;
        restoringTabUntilRef.current = 0;
      }
    };
    restoreFocusTimersRef.current = delays.map((delay) => window.setTimeout(attempt, delay));
    restoreFocusTimersRef.current.push(window.setTimeout(() => {
      restoringTabRef.current = null;
      restoringTabUntilRef.current = 0;
    }, 1600));
  }, [clearRestoreFocusTimers, tab]);


  const loadBigPictureDetail = useCallback(async (next: Detail) => {
    const data = await python.getLocalMusicDetail(next.kind, next.id);
    setDetailData(data);
    if (next.kind === "artist") {
      const artistName = String(data?.item?.name ?? next.title ?? "");
      if (artistName) {
        void python.getArtistBackground(artistName).then((url) => {
          if (!url) return;
          setDetailData((current: any) => current?.item?.id === next.id ? { ...current, backgroundImage: url } : current);
        }).catch(() => {});
      }
    }
    return data;
  }, []);

  useEffect(() => {
    const saved = getSavedSourceVolume("localMusic", state.volume);
    volumeRef.current = saved;
    setVolume(saved);
    void localAudioPlayer.initialize().then(() => localAudioPlayer.setVolume(saved));
    void loadHome();
    const syncVolume = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null;
      if (detail?.source !== "localMusic") return;
      const next = Math.max(0, Math.min(100, Number(detail.volume ?? saved)));
      volumeRef.current = next;
      setVolume(next);
      localAudioPlayer.setVolume(next);
    };
    window.addEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
    return () => window.removeEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
  }, [loadHome]);
  useEffect(() => () => {
    if (volumeTimer.current) window.clearTimeout(volumeTimer.current);
    volumeTimer.current = 0;
    clearRestoreFocusTimers();
  }, [clearRestoreFocusTimers]);
  useEffect(() => {
    if (Date.now() - volumeInteractionAtRef.current <= 250) return;
    volumeRef.current = state.volume;
    setVolume(state.volume);
  }, [state.volume]);

  const navigateBack = useCallback((event?: any) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (backgroundSettingsOpen) {
      setBackgroundSettingsOpen(false);
      return true;
    }
    const previous = history[history.length - 1];
    if (previous) {
      setHistory((value) => value.slice(0, -1));
      setDetail(previous);
      setDetailData(null);
      setLoading(true);
      void loadBigPictureDetail(previous).finally(() => setLoading(false));
      return true;
    }
    if (detail) {
      setDetail(null);
      setDetailData(null);
      restoreRootCardFocus();
      return true;
    }
    onExit();
    return true;
  }, [backgroundSettingsOpen, detail, history, loadBigPictureDetail, onExit, restoreRootCardFocus]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if (event.key === "Escape") navigateBack(event); };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [navigateBack]);

  async function openDetail(item: any, focusKey = "") {
    const kind = itemType(item);
    if (kind !== "album" && kind !== "artist") return;
    setBackgroundSettingsOpen(false);
    if (detail) setHistory((value) => [...value, detail]);
    else {
      const active = document.activeElement as HTMLElement | null;
      rootDetailFocusKeyRef.current = focusKey || active?.closest?.("[data-np-focus-key]")?.getAttribute("data-np-focus-key") || "";
      setRestoreFocusKey(rootDetailFocusKeyRef.current);
    }
    const next = { kind, id: String(item.id), title: String(item.name) } as Detail;
    setDetail(next);
    setDetailData(null);
    setLoading(true);
    try { await loadBigPictureDetail(next); } finally { setLoading(false); }
  }

  async function playTracks(entries: any[], index = 0) {
    try {
      await python.pauseExternalPlayback().catch(() => false);
      await localAudioPlayer.playItems(entries.map(normalizeTrack), index);
    } catch (error: any) {
      showError(error?.message ?? String(error));
    }
  }

  async function command(value: "play_pause" | "next" | "previous") {
    try {
      await localAudioPlayer.command(value);
    } catch (error: any) {
      showError(error?.message ?? String(error));
    }
  }

  function changeVolume(next: number) {
    const value = Math.max(0, Math.min(100, Math.round(next)));
    volumeInteractionAtRef.current = Date.now();
    volumeRef.current = value;
    setVolume(value);
    saveSourceVolume("localMusic", value);
    if (volumeTimer.current) window.clearTimeout(volumeTimer.current);
    volumeTimer.current = window.setTimeout(() => localAudioPlayer.setVolume(volumeRef.current), 24);
  }

  function volumeKey(event: React.KeyboardEvent<HTMLElement>) {
    const direction = directionFromKey(event.key);
    if (!direction) return;
    event.preventDefault();
    event.stopPropagation();
    changeVolume(volumeRef.current + direction);
  }

  function volumeButton(event: any) {
    const direction = directionFromGamepad(event?.detail?.button);
    if (!direction) return;
    event.preventDefault?.();
    event.stopPropagation?.();
    changeVolume(volumeRef.current + direction);
  }

  const current = state?.track;
  const hasCurrent = Boolean(current?.name);
  const currentCover = useLocalCover(current?.coverId);
  const detailCover = useLocalCover(detail?.kind === "album" ? detailData?.item?.coverId : "");
  const backgroundCover = detail?.kind === "artist" ? "" : (detail?.kind === "album" ? detailCover : currentCover);
  const currentAlbum = current?.album;
  const length = Number(state?.length ?? current?.duration_ms ?? 0);
  const position = Number(state?.position ?? 0);
  const ratio = length ? Math.max(0, Math.min(1, position / length)) : 0;
  const upcomingQueue = state.index >= 0 ? state.queue.slice(state.index + 1, state.index + 11) : [];

  const cardRow = (title: string, items: any[], round = false) => items?.length ? (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ margin: "0 0 13px", fontSize: 25, fontWeight: 650 }}>{title}</h2>
      <Focusable className="npLocalTvRow" flow-children="horizontal" style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "calc((100% - 60px) / 6)", gap: 12, overflowX: "auto", overflowY: "hidden", width: "100%", padding: "8px 0 22px", scrollPaddingInline: 0 }}>
        {items.slice(0, 60).map((item: any, index: number) => { const focusKey = `shelf:${title}:${itemType(item)}:${String(item?.id ?? index)}`; return <TvCard key={item.id} item={item} round={round} focusKey={focusKey} onActivate={() => void openDetail(item, focusKey)} />; })}
      </Focusable>
    </section>
  ) : null;

  function playerCard() {
    return (
      <Focusable className="npLocalPlayerCard" flow-children="grid" style={{ position: "relative", width: "100%", display: "grid", gridTemplateColumns: "320px minmax(0,1fr) minmax(330px,24vw)", gap: "clamp(22px,3vw,44px)", alignItems: "stretch", minHeight: 368, padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,.09)", background: "linear-gradient(135deg,rgba(255,255,255,.10),rgba(255,255,255,.045) 48%,rgba(0,0,0,.16))", backdropFilter: "blur(28px)", boxShadow: "0 24px 80px rgba(0,0,0,.30)", overflow: "hidden" }}>
        {currentCover ? <div className="npLocalPlayerGlow" aria-hidden="true" style={{ position: "absolute", inset: "-50% -15% -70% -15%", background: `url(${currentCover}) center/cover no-repeat`, filter: "blur(110px) saturate(1.5)", opacity: .34, pointerEvents: "none" }} /> : null}
        <DialogButton ref={playerCoverRef} className="npLocalCoverButton" disabled={!currentAlbum?.id} onClick={() => currentAlbum?.id ? void openDetail(currentAlbum) : undefined} style={{ position: "relative", width: 320, minWidth: 320, height: 320, minHeight: 320, padding: 0, borderRadius: 14, overflow: "hidden", alignSelf: "center", background: "rgba(255,255,255,.06)", boxShadow: "0 24px 70px rgba(0,0,0,.42)" }}>
          {currentCover ? <img src={currentCover} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <span style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><FaMusic size={76} style={{ opacity: .3 }} /></span>}
        </DialogButton>
        <div style={{ position: "relative", minWidth: 0, alignSelf: "center" }}>
          {hasCurrent ? <>
            <span style={{ textTransform: "uppercase", letterSpacing: ".14em", fontSize: 12, opacity: .58, fontWeight: 620 }}>{t.nowPlaying}</span>
            <h1 style={{ margin: "9px 0 0", fontSize: "clamp(38px,4vw,68px)", lineHeight: 1.08, letterSpacing: "-.045em", fontWeight: 610, paddingBottom: ".12em" }}>{current?.name}</h1>
            <div style={{ marginTop: 12, fontSize: "clamp(18px,1.7vw,27px)", opacity: .72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{artistText(current)}</div>
            {currentAlbum?.name ? <div style={{ marginTop: 7, fontSize: 16, opacity: .45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentAlbum.name}</div> : null}
            <div style={{ marginTop: 28 }}><div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,.16)", overflow: "hidden" }}><div style={{ width: `${ratio * 100}%`, height: "100%", background: LOCAL_ACCENT, borderRadius: 999 }} /></div><div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, opacity: .48, fontVariantNumeric: "tabular-nums" }}><span>{formatDuration(position)}</span><span>{formatDuration(length)}</span></div></div>
          </> : <h1 style={{ margin: 0, fontSize: "clamp(34px,3.4vw,58px)", lineHeight: 1.08, letterSpacing: "-.04em", fontWeight: 610 }}>{t.chooseSomething}</h1>}
        </div>
        <div style={{ position: "relative", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Focusable flow-children="vertical" style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
            <Focusable flow-children="horizontal" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10 }}>
            <DialogButton disabled={!hasCurrent} style={{ width: "100%", minWidth: 0, height: 58, padding: 0 }} onClick={() => void command("previous")}><FaStepBackward size={18} /></DialogButton>
            <DialogButton disabled={!hasCurrent} style={{ width: "100%", minWidth: 0, height: 58, padding: 0 }} onClick={() => void command("play_pause")}>{state?.status === "Playing" ? <FaPause size={21} /> : <FaPlay size={21} />}</DialogButton>
            <DialogButton disabled={!hasCurrent} style={{ width: "100%", minWidth: 0, height: 58, padding: 0 }} onClick={() => void command("next")}><FaStepForward size={18} /></DialogButton>
            </Focusable>

            <Focusable flow-children="horizontal" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
            <DialogButton disabled={!hasCurrent} aria-label={t.shuffle} onClick={() => void localAudioPlayer.command("shuffle")} style={{ position: "relative", width: "100%", minWidth: 0, height: 46, padding: 0, opacity: state.shuffleActive ? 1 : .62 }}><FaRandom size={16} />{state.shuffleActive ? <span aria-hidden="true" style={{ position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: LOCAL_ACCENT, boxShadow: `0 0 8px ${LOCAL_ACCENT}` }} /> : null}</DialogButton>
            <DialogButton disabled={!hasCurrent} aria-label={t.repeat} onClick={() => void localAudioPlayer.command("repeat")} style={{ position: "relative", width: "100%", minWidth: 0, height: 46, padding: 0, opacity: state.repeatMode !== "None" ? 1 : .62 }}><FaRedoAlt size={16} />{state.repeatMode !== "None" ? <span aria-hidden="true" style={{ position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: LOCAL_ACCENT, boxShadow: `0 0 8px ${LOCAL_ACCENT}` }} /> : null}</DialogButton>
            </Focusable>

            <DialogButton className="npLocalMinimalButton" aria-label={t.fullscreen} onClick={onOpenVisualizer} style={{ width: "100%", minWidth: 0, height: 46, minHeight: 46, border: "1px solid rgba(255,255,255,.075)", background: "rgba(255,255,255,.025)" }}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".82em", fontWeight: 430 }}><FaExpandArrowsAlt size={13} /> {t.fullscreen}</span></DialogButton>

            <DialogButton className="npLocalMinimalButton" onClick={() => setQueueExpanded((value) => !value)} style={{ gridColumn: "1 / -1", width: "100%", minWidth: 0, height: 46, border: "1px solid rgba(255,255,255,.075)", background: queueExpanded ? "rgba(217,163,55,.16)" : "rgba(255,255,255,.025)" }}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".82em", fontWeight: 430 }}><FaListOl size={12} /> {t.queue}</span></DialogButton>
            <Focusable className="npLocalAppVolume" focusClassName="npLocalAppVolumeFocused" noFocusRing onActivate={() => undefined} onButtonDown={volumeButton} onKeyDown={volumeKey} role="slider" tabIndex={0} {...({ focusable: true } as any)} aria-label={t.volume} aria-valuemin={0} aria-valuemax={100} aria-valuenow={volume} style={{ gridColumn: "1 / -1", marginTop: 0 }}>
              <span>{t.volume}</span><input type="range" min={0} max={100} step={1} value={volume} tabIndex={-1} onChange={(event) => changeVolume(Number(event.currentTarget.value))} /><strong>{volume}%</strong>
            </Focusable>
          </Focusable>
        </div>
      </Focusable>
    );
  }

  function renderQueuePanel() {
    return (
      <section style={{ marginTop: 18, padding: 18, borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.035)" }}>
        <h2 style={{ margin: "0 0 13px", fontSize: 25, fontWeight: 650 }}>{t.queue}</h2>
        <Focusable flow-children="vertical">
          {upcomingQueue.map((track: any, index: number) => (
            <TvTrack key={`${track?.id ?? index}-${index}`} track={track} index={index} onActivate={() => void localAudioPlayer.playIndex(state.index + index + 1)} />
          ))}
        </Focusable>
        {!upcomingQueue.length ? <div style={{ fontSize: 18, opacity: .55 }}>{t.queueEmpty}</div> : null}
      </section>
    );
  }

  function renderHome() {
    return <>
      {playerCard()}
      {queueExpanded ? renderQueuePanel() : null}
      {cardRow(t.recentAlbums, home.albums)}
      {cardRow(t.artists, home.artists, true)}
    </>;
  }

  async function executeSearch() { if (search.trim().length >= 2) setResults(await python.searchLocalMusic(search)); }
  function renderSearch() {
    return <>
      <TextField label={t.searchMusic} value={search} style={{ width: "100%", minWidth: "100%" } as any} onChange={(value: any) => setSearch(typeof value === "string" ? value : String(value?.target?.value ?? ""))} onKeyDown={(event: any) => { if (event.key === "Enter") { event.preventDefault(); void executeSearch(); } }} />
      <DialogButton style={{ width: 180, minWidth: 180, height: 46, marginTop: 10 }} onClick={() => void executeSearch()}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><FaSearch /> {t.search}</span></DialogButton>
      {cardRow(t.artists, results?.artists ?? [], true)}
      {cardRow(t.albums, results?.albums ?? [])}
      {results?.tracks?.length ? <section style={{ marginTop: 28 }}><h2>{t.tracks}</h2>{results.tracks.map((track: any, index: number) => <TvTrack key={track.id} track={track} index={index} onActivate={() => void playTracks(results.tracks, index)} />)}</section> : null}
      {results && !results.tracks?.length && !results.albums?.length && !results.artists?.length ? <div style={{ marginTop: 30, opacity: .56 }}>{t.noResults}</div> : null}
    </>;
  }

  function renderLibrary() {
    const labels: Record<LibrarySection, string> = { tracks: t.tracks, albums: t.albums, artists: t.artists };
    const items = library.items ?? [];
    const visibleItems = items;
    return <>
      <Focusable flow-children="horizontal" style={{ display: "flex", gap: 9 }}>
        {(Object.keys(labels) as LibrarySection[]).map((key) => <DialogButton key={key} style={{ width: 180, minWidth: 180, height: 46, borderRadius: 999, opacity: section === key ? 1 : .58 }} onClick={() => void loadLibrary(key)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>{key === "tracks" ? <FaMusic /> : key === "albums" ? <FaCompactDisc /> : <FaUser />}{labels[key]}</span></DialogButton>)}
      </Focusable>
      <h2 style={{ marginTop: 26 }}>{labels[section]}</h2>
      {section === "tracks" ? <>{items.length ? <Focusable flow-children="horizontal" style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <DialogButton style={{ width: 190, minWidth: 190, height: 46 }} onClick={() => void playTracks(items, 0)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><FaPlay /> {t.play}</span></DialogButton>
        <DialogButton style={{ width: 190, minWidth: 190, height: 46 }} onClick={() => { const shuffled = [...items].sort(() => Math.random() - .5); void playTracks(shuffled, 0); }}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><FaRandom /> {t.shuffle}</span></DialogButton>
      </Focusable> : null}{visibleItems.map((track: any, index: number) => <TvTrack key={track.id} track={track} index={index} onActivate={() => void playTracks(items, index)} />)}</> : <Focusable {...({ "data-np-six-grid": section } as any)} flow-children="grid" navEntryPreferPosition={restoreFocusKey ? NavEntryPositionPreferences.PREFERRED_CHILD : NavEntryPositionPreferences.MAINTAIN_X} onKeyDownCapture={(event: any) => moveSixColumnGridFocus(event, gridDirectionFromKey(event?.key))} onGamepadDirection={(event: any) => moveSixColumnGridFocus(event, gridDirectionFromGamepad(event?.detail?.button))} style={{ display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: 14 }}>{visibleItems.map((item: any, index: number) => { const focusKey = `library:${section}:${itemType(item)}:${String(item?.id ?? index)}`; return <TvCard key={item.id} item={item} round={section === "artists"} gridIndex={index} focusKey={focusKey} preferredFocus={restoreFocusKey === focusKey} onActivate={() => void openDetail(item, focusKey)} />; })}</Focusable>}
      {!items.length && !loading ? <div style={{ opacity: .56 }}>{t.nothingHere}</div> : null}
    </>;
  }

  function renderDetail() {
    if (loading || !detailData) return <div style={{ padding: "18px 8px", opacity: .62 }}>{t.scanning}</div>;
    const item = detailData?.item;
    if (!item) return <div style={{ padding: "18px 8px", opacity: .62 }}>{t.nothingHere}</div>;
    const tracks = detailData?.tracks ?? [];
    const albums = detailData?.albums ?? [];
    const isArtist = detail?.kind === "artist";
    if (backgroundSettingsOpen && isArtist) {
      return <ArtistBackgroundPicker
        provider="local"
        artistId={String(item?.id ?? detail?.id ?? "")}
        artistName={String(item?.name ?? detail?.title ?? "")}
        onBack={() => setBackgroundSettingsOpen(false)}
        onApplied={(url) => setDetailData((current: any) => current ? { ...current, backgroundImage: url } : current)}
      />;
    }
    const background = String(detailData?.backgroundImage ?? item?.backgroundImage ?? "");
    const albumArtist = item?.artists?.[0];
    return <>
      {isArtist && background ? <div className="npLocalArtistHero" aria-hidden="true" style={{ backgroundImage: `url(${background})` }}><div /></div> : null}
      <DialogButton className="npLocalBackButton npLocalMinimalButton" onClick={navigateBack} style={{ width: 108, minWidth: 108, height: 34, minHeight: 34, padding: 0, border: "1px solid rgba(255,255,255,.075)", background: "rgba(255,255,255,.025)" }}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: ".72em", fontWeight: 430 }}><FaArrowLeft size={11} /> {t.back}</span></DialogButton>
      <div style={{ display: "grid", gridTemplateColumns: isArtist ? "1fr" : "250px minmax(0,1fr)", gap: 30, marginTop: isArtist ? 220 : 20, alignItems: "end", position: "relative" }}>
        {!isArtist ? <LocalArtwork item={item} size={250} /> : null}
        <div style={{ minWidth: 0 }}><h1 style={{ fontSize: isArtist ? "clamp(62px,7vw,104px)" : 54, lineHeight: 1, margin: 0, letterSpacing: "-.045em" }}>{item?.name}</h1>{!isArtist ? <div style={{ marginTop: 12, opacity: .62 }}>{artistText(item)}{item?.year ? ` · ${item.year}` : ""}</div> : null}<Focusable flow-children="horizontal" style={{ display: "flex", gap: 10, marginTop: 20 }}><DialogButton style={{ width: 170, minWidth: 170, height: 48 }} onClick={() => void playTracks(tracks, 0)}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><FaPlay /> {t.play}</span></DialogButton>{!isArtist && albumArtist?.id ? <DialogButton style={{ width: 160, minWidth: 160, height: 48 }} onClick={() => void openDetail({ ...albumArtist, type: "artist" })}><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><FaUser /> {t.artist}</span></DialogButton> : null}</Focusable></div>
      </div>
      {isArtist && albums.length ? cardRow(t.albums, albums) : null}
      <section style={{ marginTop: 30 }}><h2>{t.tracks}</h2>{tracks.map((track: any, index: number) => <TvTrack key={track.id} track={track} index={index} showArtwork={!isArtist} onActivate={() => void playTracks(tracks, index)} />)}</section>
      {isArtist ? <DialogButton className="npLocalMinimalButton" style={{ width: 250, minWidth: 250, height: 48, marginTop: 26 }} onClick={() => setBackgroundSettingsOpen(true)}><span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><FaCog /> {coreT.artistBackgroundSettings}</span></DialogButton> : null}
    </>;
  }

  const switchRootTab = useCallback((nextTab: BrowserTab) => {
    if (restoringTabRef.current && Date.now() < restoringTabUntilRef.current) {
      if (nextTab === "home" && restoringTabRef.current !== "home") return;
      if (nextTab !== tab) {
        restoringTabRef.current = null;
        restoringTabUntilRef.current = 0;
      }
    }
    if (nextTab === tab && !detail) return;
    clearRestoreFocusTimers();
    rootDetailFocusKeyRef.current = "";
    restoringTabRef.current = null;
    restoringTabUntilRef.current = 0;
    setRestoreFocusKey("");
    setTab(nextTab);
    setDetail(null);
    setDetailData(null);
    setHistory([]);
    if (nextTab === "home" && !home.albums?.length) void loadHome();
    if (nextTab === "library" && !library.items?.length) void loadLibrary(section);
  }, [clearRestoreFocusTimers, detail, home.albums?.length, library.items?.length, loadHome, loadLibrary, section, tab]);

  const handleRootButtonDown = useCallback((event: any) => {
    if (detail) return;
    const button = event?.detail?.button;
    if (button !== GamepadButton.BUMPER_LEFT && button !== GamepadButton.BUMPER_RIGHT) return;
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const tabs = ["home", "search", "library", "settings"] as const;
    const currentRootTab = tab === "queue" ? "home" : tab;
    const index = Math.max(0, tabs.indexOf(currentRootTab));
    const delta = button === GamepadButton.BUMPER_RIGHT ? 1 : -1;
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    if (next === "settings") onOpenSettings();
    else switchRootTab(next);
    window.setTimeout(() => {
      const root = document.querySelector<HTMLElement>(".npLocalBig");
      const content = root?.querySelector<HTMLElement>(".npLocalTabContent");
      if (content) {
        content.style.transform = "none";
        content.style.left = "0";
        content.style.width = "100%";
      }
      root?.querySelector<HTMLElement>(".npLocalTvScroll")?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
    }, 0);
  }, [detail, onOpenSettings, switchRootTab, tab]);

  const page = (content: React.ReactNode) => <main className="npLocalTvScroll" style={{ position: "absolute", inset: 0, height: "auto", overflowY: "auto", overflowX: "hidden", padding: "112px 56px 300px", scrollPaddingTop: 112, scrollPaddingBottom: 250, zIndex: 10 }}><div className="npLocalTabContent" style={{ position: "relative", zIndex: 1 }}>{content}</div></main>;
  const activeTabContent = tab === "home"
    ? renderHome()
    : tab === "search"
      ? renderSearch()
      : renderLibrary();

  return (
    <Focusable className="npLocalBig npFullscreenRoot" flow-children="vertical" onCancel={navigateBack} onCancelButton={navigateBack} onButtonDown={handleRootButtonDown} style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 10, background: "#090806", color: "#fff", overflow: "hidden" }}>
      <style>{`
        .npLocalBig,.npLocalBig *{box-sizing:border-box}
        .npLocalBig button{transition:background 120ms ease,border-color 120ms ease,box-shadow 120ms ease,opacity 120ms ease!important}
        .npLocalBig button:focus,.npLocalBig button.gpfocus{transform:none!important;z-index:12}
        .npLocalBig button,.npLocalBig [tabindex]{scroll-margin-top:112px}
        .npLocalCustomTabs{z-index:200!important;isolation:isolate;transform:none!important}
        .npLocalTvScroll{z-index:10!important}
        .npLocalTabContent{left:0!important;right:auto!important;width:100%!important;max-width:100%!important;transform-origin:center top!important}
        body > [class*="virtualkeyboard"],body > [class*="VirtualKeyboard"],body [class*="virtualkeyboard_Keyboard"],body [class*="VirtualKeyboard_Keyboard"]{z-index:2147483647!important}
        .npLocalTvCard:focus,.npLocalTvCard.gpfocus,.npLocalTvTrack:focus,.npLocalTvTrack.gpfocus{transform:none!important}
        .npLocalTvCard{width:100%!important;min-width:0!important;max-width:100%!important;margin:0!important}
        .npLocalCoverButton:focus,.npLocalCoverButton.gpfocus{box-shadow:0 0 0 3px rgba(255,255,255,.88),0 0 0 6px rgba(217,163,55,.58),0 24px 70px rgba(0,0,0,.42)!important}
        .npLocalMinimalButton,.npLocalMinimalButton *{color:#fff!important}
        .npLocalMinimalButton:hover,.npLocalMinimalButton:focus,.npLocalMinimalButton.gpfocus{background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.25)!important;box-shadow:0 0 0 1px rgba(217,163,55,.34),0 0 20px rgba(217,163,55,.20)!important}
        .npLocalAppVolume{display:grid;grid-template-columns:84px minmax(0,1fr) 52px;align-items:center;gap:10px;width:100%;margin-top:14px;padding:8px 10px;border-radius:7px;border:1px solid transparent;background:rgba(255,255,255,.045);outline:none;overflow:hidden}
        .npLocalAppVolumeFocused,.npLocalAppVolume:focus-visible{border-color:rgba(217,163,55,.66);box-shadow:0 0 0 1px rgba(217,163,55,.22),0 0 18px rgba(217,163,55,.18)}
        .npLocalAppVolume input[type=range]{min-width:0;width:100%;height:18px;margin:0;padding:0;accent-color:${LOCAL_ACCENT}}
        .npLocalAppVolume input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:rgba(255,255,255,.18)}
        .npLocalAppVolume input[type=range]::-webkit-slider-thumb{width:14px;height:14px;margin-top:-4px;border-radius:999px}
        .npLocalTvRow{scroll-padding-inline:0;overscroll-behavior-inline:contain}
        .npLocalTvRow::-webkit-scrollbar{display:none}
        .npLocalTvScroll::-webkit-scrollbar{width:7px;height:7px}
        .npLocalTvScroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.16);border-radius:999px}
        .npLocalCustomTab,.npLocalCustomTab *{color:#fff!important}
        .npLocalCustomTab{border:1px solid rgba(255,255,255,.075)!important;background:rgba(255,255,255,.025)!important}
        .npLocalCustomTab:hover,.npLocalCustomTab:focus,.npLocalCustomTab.gpfocus{background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.25)!important;box-shadow:0 0 0 1px rgba(217,163,55,.34),0 0 20px rgba(217,163,55,.20)!important}
        .npLocalCustomTabActive{background:rgba(217,163,55,.18)!important;border-color:rgba(217,163,55,.48)!important}
        .npLocalTvScroll{position:absolute!important;inset:0!important;height:auto!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain}
        .npLocalArtistHero{position:absolute;top:-18px;left:-56px;width:100vw;aspect-ratio:16/9;background-position:center top;background-size:cover;background-repeat:no-repeat;pointer-events:none;z-index:-1}
        .npLocalArtistHero>div{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.66),rgba(0,0,0,.04) 68%,rgba(0,0,0,.14)),linear-gradient(180deg,rgba(0,0,0,.02) 42%,rgba(0,0,0,.18) 62%,rgba(0,0,0,.78) 82%,#000 100%)}
        .npLocalPlayerGlow{animation:npLocalPlayerGlow 5.6s ease-in-out infinite alternate;transform-origin:50% 50%}@keyframes npLocalPlayerGlow{from{transform:scale(1.02);opacity:.28}to{transform:scale(1.12);opacity:.42}}
        .npLocalTabContent{animation:npLocalTabEnter 150ms ease both}@keyframes npLocalTabEnter{from{opacity:.78}to{opacity:1}}
      `}</style>
      {backgroundCover ? <div aria-hidden="true" style={{ position: "absolute", inset: "-28%", background: `url(${backgroundCover}) center/cover`, filter: "blur(130px) saturate(1.42)", opacity: detail?.kind === "album" ? .46 : .34, zIndex: 0 }} /> : null}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: detail?.kind === "artist" ? "#000" : "linear-gradient(180deg,rgba(9,8,6,.30),#090806 86%)" }} />
      {detail ? <main className="npLocalTvScroll" style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", padding: "18px 56px 300px", scrollPaddingBottom: 250, zIndex: 2 }}><div style={{ position: "relative", zIndex: 1 }}>{renderDetail()}</div></main> : <>
        <Focusable className="npLocalCustomTabs" flow-children="horizontal" style={{ position: "absolute", top: 24, left: 56, zIndex: 200, display: "flex", alignItems: "center", gap: 8 }}>
          {([["home", t.home, FaHome], ["search", t.search, FaSearch], ["library", t.library, FaList], ["settings", t.settings, FaCog]] as const).map(([id, label, Icon]) => (
            <DialogButton key={id} className={`npLocalCustomTab${id !== "settings" && tab === id ? " npLocalCustomTabActive" : ""}`} onClick={() => id === "settings" ? onOpenSettings() : switchRootTab(id)} style={{ width: 138, minWidth: 138, height: 38, minHeight: 38, padding: 0 }}>
              <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: ".76em", fontWeight: 540 }}><Icon size={13} /> {label}</span>
            </DialogButton>
          ))}
        </Focusable>
        {page(activeTabContent)}
      </>}
    </Focusable>
  );
}
