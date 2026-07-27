import { definePlugin, routerHook, toaster } from "@decky/api";
import { DialogButton, Focusable, GamepadButton, Navigation, PanelSection, PanelSectionRow, Router } from "@decky/ui";
import { Component, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaAmazon, FaArrowLeft, FaCheck, FaClock, FaCog, FaDeezer, FaExpandAlt, FaFileAlt, FaMusic, FaPause, FaPlay, FaRandom, FaRedoAlt, FaStepBackward, FaStepForward, FaSyncAlt } from "react-icons/fa";
import { SiApplemusic, SiSoundcloud, SiSpotify, SiTidal, SiYoutubemusic } from "react-icons/si";
import * as python from "./python";
import type { PlayerSnapshot, Snapshot, SourceBehaviorSettings, SpotifyPlusSettings } from "./python";
import { getSharedSpotifyPlaybackTimestamp, publishSpotifyPlaybackSnapshot, SPOTIFY_PLAYBACK_CHANGED_EVENT, SpotifyBigPicture, SpotifyBrowser, SpotifyPlusSettingsPanel } from "./spotify";
import { FanartSettingsPanel, LocalMusicBigPicture, LocalMusicBrowser, LocalMusicSettingsPanel } from "./localMusic";
import { SurroundUpmixControls } from "./surroundControls";
import { localAudioPlayer } from "./localAudio";
import { YouTubeMusicBigPicture, YouTubeMusicBrowser, YouTubeMusicSettingsPanel } from "./youtubeMusic";
import { formatTranslation, getTranslations, localizeRuntimeMessage } from "./i18n";
import type { CoreTranslation, SpotifyTranslation } from "./i18n";
import { getSavedSourceVolume, saveSourceVolume, SOURCE_VOLUME_CHANGED_EVENT } from "./sourceVolume";
import { SmoothProgressFill, SmoothProgressTime } from "./smoothProgress";
import { ReactiveParticlesLayer, PARTICLE_RESOLUTION_KEY, PARTICLE_RESOLUTION_EVENT, particlePixelRatio } from "./reactiveParticles";
import { readVisualizerLevels, retainVisualizerAudio } from "./visualizerAudio";
import { nudgeManualRotation, retainVisualizerControl } from "./visualizerControl";

const emptySnapshot: Snapshot = {
  selectedPlayer: "",
  currentPlayer: "",
  selected: null,
  players: [],
};

function playerSnapshotNeedsRender(
  previous: PlayerSnapshot | null,
  next: PlayerSnapshot | null,
  previousSampleAt: number,
  nextSampleAt: number,
) {
  if (!previous || !next) return previous !== next;
  const stableFields: (keyof PlayerSnapshot)[] = [
    "id", "name", "title", "artist", "album", "status", "length",
    "canNext", "canPrevious", "canPlay", "canPause", "canTogglePlayPause",
    "canShuffle", "canRepeat", "shuffleActive", "repeatMode", "artworkUrl",
  ];
  if (stableFields.some((key) => previous[key] !== next[key])) return true;

  const elapsed = previous.status === "Playing" ? Math.max(0, nextSampleAt - previousSampleAt) : 0;
  const projected = Math.min(Number(previous.length || Number.MAX_SAFE_INTEGER), Number(previous.position || 0) + elapsed);
  const tolerance = previous.status === "Playing" ? 1600 : 300;
  return Math.abs(Number(next.position || 0) - projected) > tolerance;
}

function snapshotNeedsRender(previous: Snapshot, next: Snapshot, previousSampleAt: number, nextSampleAt: number) {
  if (previous.selectedPlayer !== next.selectedPlayer || previous.currentPlayer !== next.currentPlayer) return true;
  const previousPlayer = previous.selected ?? previous.players?.[0] ?? null;
  const nextPlayer = next.selected ?? next.players?.[0] ?? null;
  return playerSnapshotNeedsRender(previousPlayer, nextPlayer, previousSampleAt, nextSampleAt);
}

const CONTROL_GAP = 8;
const BUTTON_HEIGHT = 28;
const APP_SETTINGS_KEY = "nowPlaying.enabledApps";
const APP_SETTINGS_CHANGED_EVENT = "nowPlaying:source-changed";
const FULLSCREEN_EFFECT_SETTINGS_KEY = "nowPlaying.fullscreenEffect";
const FULLSCREEN_ROUTE = "/now-playing/fullscreen";
const SPOTIFY_BIG_PICTURE_ROUTE = "/now-playing/spotify-big-picture";
const LOCAL_MUSIC_BIG_PICTURE_ROUTE = "/now-playing/local-music-big-picture";
const YOUTUBE_MUSIC_BIG_PICTURE_ROUTE = "/now-playing/youtube-music-big-picture";
const FULLSCREEN_SETTINGS_ROUTE = "/now-playing/settings-fullscreen";
const FULLSCREEN_CHROME_STYLE_ID = "np-fullscreen-chrome-style";
const PLAYBACK_ACTIVITY_EVENT = "playhub:now-playing-activity";
const PLAYBACK_ACTIVITY_GLOBAL = "__playhubNowPlayingActivity";
let playbackActivitySequence = 0;

function publishPlaybackActivity(
  active: boolean,
  status: string,
  source: string,
  player: string,
  trackId: string,
) {
  const detail = {
    active: active && status.toLowerCase() === "playing",
    status,
    source,
    player,
    trackId,
    updatedAt: Date.now(),
    sequence: ++playbackActivitySequence,
  };
  (window as any)[PLAYBACK_ACTIVITY_GLOBAL] = detail;
  window.dispatchEvent(new CustomEvent(PLAYBACK_ACTIVITY_EVENT, { detail }));
}

const qamCenterRowStyle: CSSProperties = {
  width: "calc(100% - 12px)",
  margin: "0 auto",
  boxSizing: "border-box",
  position: "relative",
  isolation: "isolate",
  overflow: "visible",
};

const centeredColumnStyle: CSSProperties = {
  width: "100%",
  minWidth: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  overflow: "visible",
};

const controlsWrapStyle: CSSProperties = {
  width: "100%",
  minWidth: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: `${CONTROL_GAP}px`,
};

const compactButtonStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: `${BUTTON_HEIGHT}px`,
  minHeight: `${BUTTON_HEIGHT}px`,
  padding: 0,
  lineHeight: 1,
};

const wideButtonStyle: CSSProperties = {
  width: "100%",
  minWidth: "100%",
  maxWidth: "100%",
  height: `${BUTTON_HEIGHT}px`,
  minHeight: `${BUTTON_HEIGHT}px`,
  padding: 0,
  lineHeight: 1,
};

const splitWideButtonStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: `${BUTTON_HEIGHT}px`,
  minHeight: `${BUTTON_HEIGHT}px`,
  padding: 0,
  lineHeight: 1,
};

const buttonContentStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontSize: "0.86em",
  lineHeight: 1,
};

const settingsButtonContentStyle: CSSProperties = {
  ...buttonContentStyle,
  width: "100%",
  justifyContent: "flex-start",
  padding: "0 10px",
  boxSizing: "border-box",
};

const settingsCheckStyle: CSSProperties = {
  marginLeft: "auto",
  width: "16px",
  display: "inline-flex",
  justifyContent: "center",
};

const settingsGroupLabelStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0 4px",
  fontSize: "0.72em",
  fontWeight: 700,
  lineHeight: 1.2,
  opacity: 0.64,
};

const legendChipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "20px",
  padding: "1px 6px",
  borderRadius: "5px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.18)",
  fontFamily: "monospace",
  fontSize: "0.9em",
  fontWeight: 700,
};

const subtleRowTextStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.72em",
  opacity: 0.66,
  marginTop: "3px",
};


const meterBoxStyle: CSSProperties = {
  width: "100%",
  minWidth: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
};

const meterTrackStyle: CSSProperties = {
  width: "100%",
  minWidth: "100%",
  maxWidth: "100%",
  height: "6px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.18)",
  overflow: "hidden",
  boxSizing: "border-box",
};

const meterFillBaseStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "var(--np-accent, #66c0f4)",
  transition: "width 160ms linear",
};

const marqueeShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
};

function resolveTranslations(): CoreTranslation {
  return getTranslations("core");
}

function useTranslations(): CoreTranslation {
  return useMemo(resolveTranslations, []);
}

function formatOpenAppLabel(template: string, app: string) {
  return formatTranslation(template, { app });
}

function appDisplayLabel(app: MusicAppButton, t: CoreTranslation) {
  if (app.key === "localMusic") return t.localMusicLabel;
  return app.label;
}

function appProgramLabel(app: MusicAppButton) {
  return app.label;
}

function sourceVolumeStorageKey(key: MusicAppKey | string) {
  return key === "spotify" ? "spotify" : String(key || "");
}

function formatEffectLabel(t: CoreTranslation, effect: FullscreenEffectKey) {
  switch (effect) {
    case "glow":
      return t.effectGlow;
    case "ocean":
      return t.effectOcean;
    case "energySaver":
      return t.effectEnergySaver;
    case "coverBlur":
      return t.effectCoverBlur;
    case "flower":
      return t.effectFlower;
    case "circle":
      return t.effectCircle;
    case "particleField":
      return t.effectParticleField;
    case "particleTunnel":
      return t.effectParticleTunnel;
    case "particleSphere":
      return t.effectParticleSphere;
    case "particleWave":
      return t.effectParticleWave;
    case "particleRing":
      return t.effectParticleRing;
    case "particleKnot":
      return t.effectParticleKnot;
    case "particleCone":
      return t.effectParticleCone;
  }
}

type MusicAppButton = {
  key: MusicAppKey;
  label: string;
  Icon: IconType;
  open: () => Promise<string>;
};

type MusicAppKey =
  | "spotify"
  | "youtubeMusic"
  | "tidal"
  | "appleMusic"
  | "deezer"
  | "amazonMusic"
  | "soundCloud"
  | "localMusic";

const musicApps: MusicAppButton[] = [
  { key: "localMusic", label: "Your Music", Icon: FaMusic, open: python.openLocalMusic },
  { key: "spotify", label: "Spotify", Icon: SiSpotify, open: python.openSpotify },
  { key: "youtubeMusic", label: "YouTube Music", Icon: SiYoutubemusic, open: python.openYouTubeMusic },
  { key: "tidal", label: "Tidal", Icon: SiTidal, open: python.openTidal },
  { key: "appleMusic", label: "Apple Music", Icon: SiApplemusic, open: python.openAppleMusic },
  { key: "deezer", label: "Deezer", Icon: FaDeezer, open: python.openDeezer },
  { key: "amazonMusic", label: "Amazon Music", Icon: FaAmazon, open: python.openAmazonMusic },
  { key: "soundCloud", label: "SoundCloud", Icon: SiSoundcloud, open: python.openSoundCloud },
];

const SERVICE_ACCENTS: Record<string, string> = {
  spotify: "#1DB954",
  youtubeMusic: "#FF0033",
  tidal: "#ffffff",
  appleMusic: "#FA243C",
  deezer: "#A238FF",
  amazonMusic: "#25D1DA",
  soundCloud: "#FF5500",
  localMusic: "#D9A337",
};
function accentForKey(key?: string): string {
  return (key && SERVICE_ACCENTS[key]) || "#66c0f4";
}
const defaultEnabledAppKeys: MusicAppKey[] = ["localMusic"];
const defaultSourceBehaviorSettings: SourceBehaviorSettings = { autoLaunch: true, closeOnSwitch: true };
type CoverSource = python.CoverSource;

type FullscreenEffectKey =
  | "glow"
  | "ocean"
  | "energySaver"
  | "coverBlur"
  | "flower"
  | "circle"
  | "particleField"
  | "particleTunnel"
  | "particleSphere"
  | "particleWave"
  | "particleRing"
  | "particleKnot"
  | "particleCone";

const fullscreenEffects: { key: FullscreenEffectKey }[] = [
  { key: "particleField" },
  { key: "particleTunnel" },
  { key: "particleSphere" },
  { key: "particleWave" },
  { key: "particleRing" },
  { key: "particleKnot" },
  { key: "particleCone" },
  { key: "flower" },
  { key: "circle" },
  { key: "coverBlur" },
  { key: "glow" },
  { key: "ocean" },
  { key: "energySaver" },
];

const defaultFullscreenEffect: FullscreenEffectKey = "glow";

type FullscreenViewMode = "standard" | "noClock" | "clockOnly" | "effectOnly";

// X-button order: everything → drop clock+weather (keep cover/info/controls)
// → the opposite (only clock+weather) → only the effect → back to everything.
const fullscreenViewModes: FullscreenViewMode[] = ["standard", "noClock", "clockOnly", "effectOnly"];

// Y-button order: full cover → small cover aligned with the title → no cover
// (metadata slides left into the cover's place) → back to full.
type FullscreenCoverMode = "default" | "small" | "hidden";
const fullscreenCoverModes: FullscreenCoverMode[] = ["default", "small", "hidden"];

function normalizeEnabledAppKeys(keys: unknown): MusicAppKey[] {
  const knownKeys = new Set(musicApps.map((app) => app.key));
  const arr = (Array.isArray(keys) ? keys : [keys]) as unknown[];
  const found = arr.find((key): key is MusicAppKey => typeof key === "string" && knownKeys.has(key as MusicAppKey));
  return [found ?? defaultEnabledAppKeys[0]];
}

function loadEnabledAppKeys(): MusicAppKey[] {
  if (typeof window === "undefined") return defaultEnabledAppKeys;

  try {
    const stored = window.localStorage.getItem(APP_SETTINGS_KEY);
    if (!stored) return defaultEnabledAppKeys;
    return normalizeEnabledAppKeys(JSON.parse(stored));
  } catch {
    return defaultEnabledAppKeys;
  }
}

function saveEnabledAppKeys(keys: MusicAppKey[]) {
  if (typeof window === "undefined") return;

  const normalized = normalizeEnabledAppKeys(keys);
  try {
    window.localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(normalized));
  } catch {
    // Local storage can be unavailable in some embedded contexts; the session state still works.
  }

  window.dispatchEvent(new CustomEvent(APP_SETTINGS_CHANGED_EVENT, { detail: normalized }));
}

function normalizeFullscreenEffect(effect: unknown): FullscreenEffectKey {
  return fullscreenEffects.some((option) => option.key === effect)
    ? (effect as FullscreenEffectKey)
    : defaultFullscreenEffect;
}

function loadFullscreenEffect(): FullscreenEffectKey {
  if (typeof window === "undefined") return defaultFullscreenEffect;

  try {
    return normalizeFullscreenEffect(window.localStorage.getItem(FULLSCREEN_EFFECT_SETTINGS_KEY));
  } catch {
    return defaultFullscreenEffect;
  }
}

function saveFullscreenEffect(effect: FullscreenEffectKey) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(FULLSCREEN_EFFECT_SETTINGS_KEY, effect);
  } catch {
    // Local storage can be unavailable in some embedded contexts; the session state still works.
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function directionFromKey(key: string) {
  if (key === "ArrowLeft" || key === "Left") return "left";
  if (key === "ArrowRight" || key === "Right") return "right";
  return null;
}

function directionFromGamepadButton(button: unknown) {
  if (button === GamepadButton.DIR_LEFT) return "left";
  if (button === GamepadButton.DIR_RIGHT) return "right";
  return null;
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function ScrollingText(props: { text: string; style?: CSSProperties }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const measure = () => {
      const element = textRef.current;
      const parent = element?.parentElement;
      if (!element || !parent) return;
      const overflow = element.scrollWidth - parent.clientWidth;
      setShouldScroll(overflow > 2);
      element.style.setProperty("--np-marq", (overflow > 2 ? -(overflow + 8) : 0) + "px");
    };

    measure();
    const timer = window.setTimeout(measure, 120);
    window.addEventListener("resize", measure);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [props.text]);

  const duration = `${clamp(5 + props.text.length * 0.08, 7, 14)}s`;

  return (
    <div
      style={{
        ...marqueeShellStyle,
        WebkitMaskImage: shouldScroll
          ? "linear-gradient(90deg, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)"
          : undefined,
        maskImage: shouldScroll
          ? "linear-gradient(90deg, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)"
          : undefined,
      }}
    >
      <div
        ref={textRef}
        style={{
          ...props.style,
          display: "inline-block",
          whiteSpace: "nowrap",
          animation: shouldScroll ? `inRiproduzioneMarquee ${duration} ease-in-out infinite alternate` : undefined,
          willChange: shouldScroll ? "transform" : undefined,
        }}
      >
        {props.text}
      </div>
    </div>
  );
}

function QamGlowLayer(props: { artUrl?: string; playing?: boolean; bottomFadeTop: number }) {
  const { artUrl, playing, bottomFadeTop } = props;
  if (!artUrl || !artUrl.trim()) return null;

  return (
    <div className="npQamGlowLayer" aria-hidden="true">
      <div className="npQamGlowAnchor">
        <div className="npQamCoverHalo" style={{ opacity: playing ? 0.5 : 0 }}>
          <img src={artUrl} alt="" />
        </div>
      </div>
      <div className="npQamGlowVeil npQamGlowVeilTop" />
      <div
        className="npQamGlowVeil npQamGlowVeilBottom"
        style={{ top: `${Math.max(0, bottomFadeTop)}px` }}
      />
    </div>
  );
}

function CoverBox(props: { artUrl?: string; onActivate?: () => void; ariaLabel?: string; placeholderIcon?: React.ReactNode; showPlaceholder?: boolean }) {
  const { artUrl, onActivate, ariaLabel, placeholderIcon, showPlaceholder = true } = props;
  const outerStyle: CSSProperties = {
    position: "relative",
    zIndex: 2,
    width: "80%",
    margin: "6px auto 4px",
  };
  const squareStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: 0,
    paddingBottom: "100%",
    borderRadius: "4px",
    overflow: "hidden",
    background: artUrl && artUrl.trim() ? undefined : "rgba(255,255,255,0.08)",
    boxShadow: artUrl && artUrl.trim()
      ? "0 14px 38px rgba(0,0,0,0.55)"
      : "0 14px 38px rgba(0,0,0,0.45)",
  };
  const artwork = (
    <div className="npAlbumCoverArtwork" style={squareStyle}>
      {artUrl && artUrl.trim() ? (
        <img src={artUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : showPlaceholder ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {placeholderIcon ?? <FaMusic size={96} />}
        </div>
      ) : null}
    </div>
  );

  if (!onActivate) return <div style={outerStyle}>{artwork}</div>;

  return (
    <DialogButton
      className="npAlbumCoverButton"
      noFocusRing
      aria-label={ariaLabel}
      style={{
        ...outerStyle,
        display: "block",
        minWidth: 0,
        maxWidth: "80%",
        minHeight: 0,
        height: "auto",
        padding: 0,
        border: 0,
        background: "transparent",
        lineHeight: 1,
      }}
      onClick={onActivate}
    >
      {artwork}
    </DialogButton>
  );
}
function ProgressView(props: { current: PlayerSnapshot | null; snapshotAt: number }) {
  const { current, snapshotAt } = props;
  const length = Math.max(1, current?.length ?? 1);
  const basePosition = current?.position ?? 0;

  return (
    <div style={{ ...meterBoxStyle, marginTop: "12px" }}>
      <div style={meterTrackStyle}>
        <SmoothProgressFill
          position={basePosition}
          duration={length}
          playing={current?.status === "Playing"}
          sampledAt={snapshotAt}
          style={meterFillBaseStyle}
        />
      </div>
      <div style={subtleRowTextStyle}>
        <SmoothProgressTime position={basePosition} duration={length} playing={current?.status === "Playing"} sampledAt={snapshotAt} format={formatTime} />
        <span>{formatTime(length)}</span>
      </div>
    </div>
  );
}

let fullscreenChromeObservers: MutationObserver[] = [];
let fullscreenChromeFrame = 0;
let fullscreenSuppressionLeaseCount = 0;
let fullscreenSuppressionReleaseTimer = 0;
const fullscreenChromeRefreshTimers = new Set<number>();
const fullscreenTransitionLeaseTimers = new Set<number>();

const fullscreenChromeSelectors = [
  "#header",
  '[class*="BasicFooter"]',
  '[class*="FooterLegend"]',
  '[class*="QuickAccessFooter"]',
  '[class*="GamepadFooter"]',
  '[class*="GamepadHeader"]',
  '[class*="HeaderStatus"]',
  '[class*="StatusIcons"]',
  '[class*="TopBar"]',
  '[data-np-fullscreen-chrome="true"]',
];

function fullscreenSuppressionDocuments(): Document[] {
  if (typeof document === "undefined") return [];

  const docs: Document[] = [];
  const addDocument = (candidate: unknown) => {
    try {
      const next = candidate as Document | null | undefined;
      if (next?.documentElement && !docs.includes(next)) docs.push(next);
    } catch {
      // Ignore inaccessible Steam windows.
    }
  };
  const addWindowDocument = (candidate: any) => {
    if (!candidate) return;
    try { addDocument(candidate.document); } catch {}
    try { addDocument(candidate.window?.document); } catch {}
    try { addDocument(candidate.m_Window?.document); } catch {}
    try { addDocument(candidate.m_popup?.document); } catch {}
    try { addDocument(candidate.BrowserWindow?.document); } catch {}
    try { addDocument(candidate.GetWindow?.()?.document); } catch {}
  };

  addDocument(document);
  try { addDocument(window.top?.document); } catch {}
  try { addDocument(window.parent?.document); } catch {}
  try { addDocument(window.opener?.document); } catch {}

  const store = (Router as any)?.WindowStore;
  addWindowDocument(store?.GamepadUIMainWindowInstance);
  if (Array.isArray(store?.SteamUIWindows)) {
    store.SteamUIWindows.forEach(addWindowDocument);
  }

  return docs;
}

function ensureFullscreenChromeStyle(targetDocument: Document = document) {
  const style = targetDocument.getElementById(FULLSCREEN_CHROME_STYLE_ID) as HTMLStyleElement | null;
  const css = `
    html.npFullscreenActive #header,
    html.npFullscreenActive [class*="BasicFooter"],
    html.npFullscreenActive [class*="FooterLegend"],
    html.npFullscreenActive [class*="QuickAccessFooter"],
    html.npFullscreenActive [class*="GamepadFooter"],
    html.npFullscreenActive [class*="GamepadHeader"],
    html.npFullscreenActive [class*="HeaderStatus"],
    html.npFullscreenActive [class*="StatusIcons"],
    html.npFullscreenActive [class*="TopBar"],
    html.npFullscreenActive [data-np-fullscreen-chrome="true"],
    body.npFullscreenActive #header,
    body.npFullscreenActive [class*="BasicFooter"],
    body.npFullscreenActive [class*="FooterLegend"],
    body.npFullscreenActive [class*="QuickAccessFooter"],
    body.npFullscreenActive [class*="GamepadFooter"],
    body.npFullscreenActive [class*="GamepadHeader"],
    body.npFullscreenActive [class*="HeaderStatus"],
    body.npFullscreenActive [class*="StatusIcons"],
    body.npFullscreenActive [class*="TopBar"],
    body.npFullscreenActive [data-np-fullscreen-chrome="true"] {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transition: none !important;
      animation: none !important;
    }
  `;

  if (style) {
    style.textContent = css;
    return;
  }

  const nextStyle = targetDocument.createElement("style");
  nextStyle.id = FULLSCREEN_CHROME_STYLE_ID;
  nextStyle.textContent = css;
  targetDocument.head.appendChild(nextStyle);
}

function isSteamVirtualKeyboardElement(element: HTMLElement | null): boolean {
  let current = element;
  for (let depth = 0; current && depth < 10; depth += 1, current = current.parentElement) {
    const className = typeof current.className === "string" ? current.className : "";
    const identity = `${current.id || ""} ${className} ${current.getAttribute("data-featuretarget") || ""} ${current.getAttribute("aria-label") || ""}`.toLowerCase();
    if (
      identity.includes("virtualkeyboard")
      || identity.includes("virtual-keyboard")
      || identity.includes("onscreenkeyboard")
      || identity.includes("on-screen keyboard")
      || identity.includes("keyboardmodal")
      || identity.includes("keyboard_modal")
    ) return true;
  }
  return false;
}

function hideElementImmediately(element: HTMLElement) {
  element.dataset.npFullscreenChrome = "true";
  element.style.setProperty("display", "none", "important");
  element.style.setProperty("opacity", "0", "important");
  element.style.setProperty("visibility", "hidden", "important");
  element.style.setProperty("pointer-events", "none", "important");
  element.style.setProperty("transition", "none", "important");
  element.style.setProperty("animation", "none", "important");
}

function markFullscreenChrome(targetDocument: Document = document) {
  if (!targetDocument.documentElement.classList.contains("npFullscreenActive")) return;

  targetDocument.querySelectorAll<HTMLElement>(fullscreenChromeSelectors.join(",")).forEach((element) => {
    if (!element.closest(".npFullscreenRoot") && !isSteamVirtualKeyboardElement(element)) hideElementImmediately(element);
  });

  const targetWindow = targetDocument.defaultView ?? window;
  const viewportWidth = targetWindow.innerWidth;
  const viewportHeight = targetWindow.innerHeight;
  targetDocument.querySelectorAll<HTMLElement>("body *").forEach((element) => {
    if (element.closest(".npFullscreenRoot") || element.dataset.npFullscreenChrome === "true" || isSteamVirtualKeyboardElement(element)) return;

    const rect = element.getBoundingClientRect();
    if (rect.width < viewportWidth * 0.45 || rect.height <= 0 || rect.height > 190) return;

    const computed = targetWindow.getComputedStyle(element);
    if (!/^(fixed|absolute|sticky)$/.test(computed.position)) return;

    const touchesTop = rect.top <= 12 && rect.bottom <= 194;
    const touchesBottom = rect.bottom >= viewportHeight - 12 && rect.top >= viewportHeight - 194;
    if (touchesTop || touchesBottom) hideElementImmediately(element);
  });
}

function markAllFullscreenChrome() {
  fullscreenSuppressionDocuments().forEach((targetDocument) => {
    ensureFullscreenChromeStyle(targetDocument);
    targetDocument.documentElement.classList.add("npFullscreenActive");
    targetDocument.body?.classList.add("npFullscreenActive");
    markFullscreenChrome(targetDocument);
  });
}

function scheduleFullscreenChromeMark() {
  if (fullscreenChromeFrame) window.cancelAnimationFrame(fullscreenChromeFrame);
  fullscreenChromeFrame = window.requestAnimationFrame(() => {
    fullscreenChromeFrame = 0;
    markAllFullscreenChrome();
  });
}

function scheduleFullscreenChromeBurst() {
  fullscreenChromeRefreshTimers.forEach((timer) => window.clearTimeout(timer));
  fullscreenChromeRefreshTimers.clear();
  [50, 140, 320, 650, 1100].forEach((delay) => {
    const timer = window.setTimeout(() => {
      fullscreenChromeRefreshTimers.delete(timer);
      markAllFullscreenChrome();
    }, delay);
    fullscreenChromeRefreshTimers.add(timer);
  });
}

function activateFullscreenChromeSuppression() {
  if (typeof document === "undefined") return;
  markAllFullscreenChrome();

  fullscreenChromeObservers.forEach((observer) => observer.disconnect());
  fullscreenChromeObservers = [];
  fullscreenSuppressionDocuments().forEach((targetDocument) => {
    if (!targetDocument.body) return;
    const observer = new MutationObserver(scheduleFullscreenChromeMark);
    observer.observe(targetDocument.body, { childList: true, subtree: true });
    fullscreenChromeObservers.push(observer);
  });
  scheduleFullscreenChromeBurst();
}

function deactivateFullscreenChromeSuppression() {
  if (typeof document === "undefined") return;
  fullscreenChromeRefreshTimers.forEach((timer) => window.clearTimeout(timer));
  fullscreenChromeRefreshTimers.clear();
  fullscreenChromeObservers.forEach((observer) => observer.disconnect());
  fullscreenChromeObservers = [];
  if (fullscreenChromeFrame) window.cancelAnimationFrame(fullscreenChromeFrame);
  fullscreenChromeFrame = 0;

  fullscreenSuppressionDocuments().forEach((targetDocument) => {
    targetDocument.documentElement.classList.remove("npFullscreenActive");
    targetDocument.body?.classList.remove("npFullscreenActive");
    targetDocument.querySelectorAll<HTMLElement>('[data-np-fullscreen-chrome="true"]').forEach((element) => {
      delete element.dataset.npFullscreenChrome;
      element.style.removeProperty("display");
      element.style.removeProperty("opacity");
      element.style.removeProperty("visibility");
      element.style.removeProperty("pointer-events");
      element.style.removeProperty("transition");
      element.style.removeProperty("animation");
    });
  });
}

function retainFullscreenChromeSuppression() {
  fullscreenSuppressionLeaseCount += 1;
  if (fullscreenSuppressionReleaseTimer) {
    window.clearTimeout(fullscreenSuppressionReleaseTimer);
    fullscreenSuppressionReleaseTimer = 0;
  }
  activateFullscreenChromeSuppression();
}

function releaseFullscreenChromeSuppression() {
  fullscreenSuppressionLeaseCount = Math.max(0, fullscreenSuppressionLeaseCount - 1);
  if (fullscreenSuppressionLeaseCount > 0) return;
  if (fullscreenSuppressionReleaseTimer) window.clearTimeout(fullscreenSuppressionReleaseTimer);
  fullscreenSuppressionReleaseTimer = window.setTimeout(() => {
    fullscreenSuppressionReleaseTimer = 0;
    if (fullscreenSuppressionLeaseCount > 0) return;
    const stillMounted = fullscreenSuppressionDocuments().some((targetDocument) =>
      Boolean(targetDocument.querySelector(".npFullscreenRoot"))
    );
    if (!stillMounted) deactivateFullscreenChromeSuppression();
  }, 700);
}

function holdFullscreenChromeSuppressionForTransition(duration = 1800) {
  retainFullscreenChromeSuppression();
  const timer = window.setTimeout(() => {
    fullscreenTransitionLeaseTimers.delete(timer);
    releaseFullscreenChromeSuppression();
  }, duration);
  fullscreenTransitionLeaseTimers.add(timer);
}

function forceRestoreFullscreenChrome() {
  fullscreenTransitionLeaseTimers.forEach((timer) => window.clearTimeout(timer));
  fullscreenTransitionLeaseTimers.clear();
  if (fullscreenSuppressionReleaseTimer) window.clearTimeout(fullscreenSuppressionReleaseTimer);
  fullscreenSuppressionReleaseTimer = 0;
  fullscreenSuppressionLeaseCount = 0;
  deactivateFullscreenChromeSuppression();
}

function navigateBackFromBigPicture() {
  const mainWindow =
    Router.WindowStore?.GamepadUIMainWindowInstance ??
    Router.WindowStore?.SteamUIWindows?.[0];

  if (mainWindow?.NavigateBack) mainWindow.NavigateBack();
  else Navigation.NavigateBack();

  // Big Picture is the outermost plugin route. Restore Steam chrome immediately,
  // then repeat while Steam rebuilds its header/footer during the route transition.
  [0, 60, 180, 420, 900].forEach((delay) => window.setTimeout(forceRestoreFullscreenChrome, delay));
}

function navigateBackToQamFromSettings() {
  const mainWindow =
    Router.WindowStore?.GamepadUIMainWindowInstance ??
    Router.WindowStore?.SteamUIWindows?.[0];
  const back = () => {
    if (mainWindow?.NavigateBack) mainWindow.NavigateBack();
    else Navigation.NavigateBack();
  };
  back();
  window.setTimeout(back, 120);
  [0, 80, 220, 520, 1000].forEach((delay) => window.setTimeout(forceRestoreFullscreenChrome, delay));
}

function navigateToFullscreen() {
  // Keep suppression leased across the whole Steam route transition.
  holdFullscreenChromeSuppressionForTransition();
  markAllFullscreenChrome();

  try {
    Navigation.CloseSideMenus();
  } catch {
    // Older Decky/Steam builds can throw here; navigation below still works in most cases.
  }

  const mainWindow =
    Router.WindowStore?.GamepadUIMainWindowInstance ??
    Router.WindowStore?.SteamUIWindows?.[0];

  if (mainWindow?.Navigate) {
    mainWindow.Navigate(FULLSCREEN_ROUTE);
  } else {
    Navigation.Navigate(FULLSCREEN_ROUTE);
  }

  // Steam can rebuild the top/footer in the same task as navigation; suppress again immediately.
  markAllFullscreenChrome();
  queueMicrotask(markAllFullscreenChrome);
  window.requestAnimationFrame(markAllFullscreenChrome);
}

function navigateToSpotifyBigPicture() {
  holdFullscreenChromeSuppressionForTransition();
  markAllFullscreenChrome();

  try {
    Navigation.CloseSideMenus();
  } catch {
    // Navigation still works on Steam builds where side-menu closing is unavailable.
  }

  const mainWindow =
    Router.WindowStore?.GamepadUIMainWindowInstance ??
    Router.WindowStore?.SteamUIWindows?.[0];

  if (mainWindow?.Navigate) {
    mainWindow.Navigate(SPOTIFY_BIG_PICTURE_ROUTE);
  } else {
    Navigation.Navigate(SPOTIFY_BIG_PICTURE_ROUTE);
  }

  markAllFullscreenChrome();
  queueMicrotask(markAllFullscreenChrome);
  window.requestAnimationFrame(markAllFullscreenChrome);
}

function navigateToLocalMusicBigPicture() {
  holdFullscreenChromeSuppressionForTransition();
  markAllFullscreenChrome();
  try { Navigation.CloseSideMenus(); } catch {}
  const mainWindow = Router.WindowStore?.GamepadUIMainWindowInstance ?? Router.WindowStore?.SteamUIWindows?.[0];
  if (mainWindow?.Navigate) mainWindow.Navigate(LOCAL_MUSIC_BIG_PICTURE_ROUTE);
  else Navigation.Navigate(LOCAL_MUSIC_BIG_PICTURE_ROUTE);
  markAllFullscreenChrome();
  queueMicrotask(markAllFullscreenChrome);
  window.requestAnimationFrame(markAllFullscreenChrome);
}

function navigateToYouTubeMusicBigPicture() {
  holdFullscreenChromeSuppressionForTransition();
  markAllFullscreenChrome();
  try { Navigation.CloseSideMenus(); } catch {}
  const mainWindow = Router.WindowStore?.GamepadUIMainWindowInstance ?? Router.WindowStore?.SteamUIWindows?.[0];
  if (mainWindow?.Navigate) mainWindow.Navigate(YOUTUBE_MUSIC_BIG_PICTURE_ROUTE);
  else Navigation.Navigate(YOUTUBE_MUSIC_BIG_PICTURE_ROUTE);
  markAllFullscreenChrome();
  queueMicrotask(markAllFullscreenChrome);
  window.requestAnimationFrame(markAllFullscreenChrome);
}

function navigateToFullscreenSettings() {
  holdFullscreenChromeSuppressionForTransition();
  markAllFullscreenChrome();
  try { Navigation.CloseSideMenus(); } catch {}
  const mainWindow = Router.WindowStore?.GamepadUIMainWindowInstance ?? Router.WindowStore?.SteamUIWindows?.[0];
  if (mainWindow?.Navigate) mainWindow.Navigate(FULLSCREEN_SETTINGS_ROUTE);
  else Navigation.Navigate(FULLSCREEN_SETTINGS_ROUTE);
  markAllFullscreenChrome();
  queueMicrotask(markAllFullscreenChrome);
  window.requestAnimationFrame(markAllFullscreenChrome);
}

function navigateBackFromFullscreen() {
  holdFullscreenChromeSuppressionForTransition();
  markAllFullscreenChrome();
  const mainWindow =
    Router.WindowStore?.GamepadUIMainWindowInstance ??
    Router.WindowStore?.SteamUIWindows?.[0];

  if (mainWindow?.NavigateBack) {
    mainWindow.NavigateBack();
    return;
  }

  Navigation.NavigateBack();
}

function OceanLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvasElement = canvasRef.current;
    const canvasContext = canvasElement?.getContext("2d");
    if (!canvasElement || !canvasContext) return;

    const canvas = canvasElement;
    const context = canvasContext;

    let animationFrame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let wave = 0;
    let width = 420;
    let height = 420;
    const lineCount = 40;
    const offset = Math.PI * 3.5;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = false;
    }

    function drawLine(position: number) {
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const minWidth = halfWidth * 0.25;
      const lineWidth = minWidth + halfWidth * 0.75 * position;
      const lineHeight = Math.cos(wave + position * offset) * 4;
      const range = halfHeight * 0.9;
      const x = (width - minWidth) * (1 - position);
      const y =
        Math.sin(wave + position * offset) *
          (range / 2 + (range / 2) * position) +
        halfHeight;

      context.globalAlpha = 0.3 + 0.65 * (1 - position);
      context.fillRect(x, y, lineWidth, lineHeight);
    }

    function render(time: number) {
      if (!lastTime) lastTime = time;
      const delta = Math.min(48, time - lastTime) / 1000;
      lastTime = time;
      elapsed += delta;
      wave += delta * 1.02;

      const hue = (11 + elapsed * 5) % 360;
      const color = `hsl(${hue}, 100%, 63%)`;

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, width, height);
      context.save();
      context.shadowBlur = 10;
      context.shadowColor = color;
      context.fillStyle = color;

      for (let index = 0; index < lineCount; index += 1) {
        drawLine(index / lineCount);
      }

      context.restore();
      animationFrame = window.requestAnimationFrame(render);
    }

    resizeCanvas();
    animationFrame = window.requestAnimationFrame(render);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="npFullscreenEffectLayer npOceanLayer" aria-hidden="true">
      <canvas ref={canvasRef} className="npOceanCanvas" />
    </div>
  );
}

type CoverPaletteColor = { red: number; green: number; blue: number };

function coverPaletteCss(color: CoverPaletteColor, alpha = 1) {
  return `rgba(${color.red},${color.green},${color.blue},${alpha})`;
}

function fallbackCoverPalette(accent: string): CoverPaletteColor[] {
  const value = accent.replace("#", "");
  const parsed = value.length === 6 ? Number.parseInt(value, 16) : 0x66c0f4;
  const base = { red: (parsed >> 16) & 255, green: (parsed >> 8) & 255, blue: parsed & 255 };
  const lift = (channel: number, amount: number) => Math.round(channel + (255 - channel) * amount);
  return [
    base,
    { red: lift(base.red, .34), green: lift(base.green, .34), blue: lift(base.blue, .34) },
    { red: lift(base.red, .62), green: lift(base.green, .62), blue: lift(base.blue, .62) },
  ];
}

function extractCoverPalette(url: string, fallback: CoverPaletteColor[]): Promise<CoverPaletteColor[]> {
  if (!url.trim()) return Promise.resolve(fallback);
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const sample = document.createElement("canvas");
        sample.width = 40;
        sample.height = 40;
        const context = sample.getContext("2d", { willReadFrequently: true });
        if (!context) return resolve(fallback);
        context.drawImage(image, 0, 0, sample.width, sample.height);
        const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
        const candidates: { color: CoverPaletteColor; score: number }[] = [];
        for (let index = 0; index < pixels.length; index += 16) {
          if (pixels[index + 3] < 180) continue;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const maximum = Math.max(red, green, blue);
          const minimum = Math.min(red, green, blue);
          const chroma = maximum - minimum;
          const luminance = (red * .2126 + green * .7152 + blue * .0722) / 255;
          if (maximum < 34 || minimum > 238 || chroma < 24) continue;
          candidates.push({ color: { red, green, blue }, score: chroma * (1 - Math.abs(luminance - .58) * .72) });
        }
        candidates.sort((left, right) => right.score - left.score);
        const palette: CoverPaletteColor[] = [];
        for (const candidate of candidates) {
          const distinct = palette.every((color) => Math.hypot(
            color.red - candidate.color.red,
            color.green - candidate.color.green,
            color.blue - candidate.color.blue,
          ) > 76);
          if (distinct) palette.push(candidate.color);
          if (palette.length === 3) break;
        }
        resolve(palette.length >= 2 ? palette : fallback);
      } catch {
        resolve(fallback);
      }
    };
    image.onerror = () => resolve(fallback);
    image.src = url;
  });
}

function coverNeedsDarkMetadata(url: string): Promise<boolean> {
  if (!url.trim()) return Promise.resolve(false);
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const sample = document.createElement("canvas");
        sample.width = 36;
        sample.height = 36;
        const context = sample.getContext("2d", { willReadFrequently: true });
        if (!context) return resolve(false);
        context.drawImage(image, 0, 0, sample.width, sample.height);
        const pixels = context.getImageData(0, 0, sample.width, sample.height).data;
        let count = 0;
        let luminanceTotal = 0;
        let lightPixels = 0;
        for (let index = 0; index < pixels.length; index += 4) {
          if (pixels[index + 3] < 160) continue;
          const red = pixels[index] / 255;
          const green = pixels[index + 1] / 255;
          const blue = pixels[index + 2] / 255;
          const luminance = red * .2126 + green * .7152 + blue * .0722;
          luminanceTotal += luminance;
          const minChannel = Math.min(red, green, blue);
          const maxChannel = Math.max(red, green, blue);
          // A pixel is "light" if it is bright overall OR a light pastel — light
          // yellow, cyan (azzurro), green or pink washed toward white have all
          // channels fairly high, so white metadata text is hard to read on them.
          if (luminance >= .72 || (minChannel >= .55 && maxChannel >= .82)) lightPixels += 1;
          count += 1;
        }
        if (!count) return resolve(false);
        const average = luminanceTotal / count;
        const lightShare = lightPixels / count;
        resolve(average >= .68 || lightShare >= .5);
      } catch {
        resolve(false);
      }
    };
    image.onerror = () => resolve(false);
    image.src = url;
  });
}

function ParticleVisualizerLayer(props: {
  mode: "flower" | "circle";
  coverUrl?: string;
  isPlaying: boolean;
  useLocalAudio: boolean;
}) {
  const { mode, coverUrl, isPlaying, useLocalAudio } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paletteRef = useRef<CoverPaletteColor[]>(fallbackCoverPalette(accentForKey(loadEnabledAppKeys()[0])));
  const playingRef = useRef(isPlaying);
  const localAudioRef = useRef(useLocalAudio);
  playingRef.current = isPlaying;
  localAudioRef.current = useLocalAudio;

  useEffect(() => retainVisualizerAudio(useLocalAudio), [useLocalAudio]);

  useEffect(() => {
    let cancelled = false;
    const fallback = fallbackCoverPalette(accentForKey(loadEnabledAppKeys()[0]));
    void extractCoverPalette(String(coverUrl || ""), fallback).then((palette) => {
      if (!cancelled) paletteRef.current = palette;
    });
    return () => { cancelled = true; };
  }, [coverUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    let width = 1;
    let height = 1;
    let frame = 0;
    let start = performance.now();
    const count = 560;
    let smoothedEnergy = 0;
    let smoothedBass = 0;
    let smoothedMid = 0;
    let smoothedTreble = 0;

    const resize = () => {
      const ratio = Math.min(1.35, window.devicePixelRatio || 1);
      const host = canvas.parentElement;
      const fullscreenRoot = canvas.closest<HTMLElement>(".npFullscreenRoot");
      const hostRect = host?.getBoundingClientRect();
      const rootRect = fullscreenRoot?.getBoundingClientRect();
      width = Math.max(1, Math.round(Math.max(
        Number(hostRect?.width || 0),
        Number(rootRect?.width || 0),
        Number(document.documentElement.clientWidth || 0),
        Number(window.innerWidth || 0),
      ) || 1920));
      height = Math.max(1, Math.round(Math.max(
        Number(hostRect?.height || 0),
        Number(rootRect?.height || 0),
        Number(document.documentElement.clientHeight || 0),
        Number(window.innerHeight || 0),
      ) || 1080));
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = (now: number) => {
      const time = Math.max(0, (now - start) / 1000);
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
      const scale = Math.min(width, height) / 116;
      const centerX = width * .5;
      const centerY = height * .5;
      const measured = readVisualizerLevels(localAudioRef.current, playingRef.current, time);
      const targetEnergy = clamp(measured.energy, 0, 1);
      const response = targetEnergy > smoothedEnergy ? .28 : .075;
      smoothedEnergy += (targetEnergy - smoothedEnergy) * response;
      smoothedBass += (clamp(measured.bass, 0, 1) - smoothedBass) * response;
      smoothedMid += (clamp(measured.mid, 0, 1) - smoothedMid) * response;
      smoothedTreble += (clamp(measured.treble, 0, 1) - smoothedTreble) * response;
      const palette = paletteRef.current;
      const background = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * .62);
      background.addColorStop(0, coverPaletteCss(palette[0], .1 + smoothedEnergy * .14));
      background.addColorStop(.5, coverPaletteCss(palette[1] || palette[0], .035 + smoothedEnergy * .06));
      background.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (let index = 1; index <= count; index += 1) {
        const phase = index / count;
        let x = 0;
        let y = 0;
        if (mode === "flower") {
          const step = .0286 + Math.sin(time * .16) * .0016;
          const angle = step * index;
          const centerRadius = 23 + smoothedBass * 10;
          const petalRadius = 14 + smoothedMid * 14;
          x = centerRadius * Math.cos(angle) + Math.sin(index / step) * petalRadius;
          y = centerRadius * Math.sin(angle) + Math.cos(index / step) * petalRadius;
        } else {
          const angle = index * .115 + time * (.12 + smoothedTreble * .18);
          const radius = 39 + smoothedBass * 12 + Math.sin(index * .13 + time * 1.35) * (6 + smoothedMid * 13);
          x = Math.sin(angle) * radius;
          y = Math.cos(angle) * radius;
        }

        const rotation = time * (.045 + smoothedTreble * .08);
        const rotatedX = x * Math.cos(rotation) - y * Math.sin(rotation);
        const rotatedY = x * Math.sin(rotation) + y * Math.cos(rotation);
        const depth = Math.sin(index * .19 + time * (1.7 + smoothedTreble * 2.2));
        const pointSize = Math.max(.55, .9 + depth * .38 + phase * .32 + smoothedEnergy * 1.35);
        context.globalAlpha = Math.max(.12, .3 + depth * .18 + smoothedEnergy * .34);
        context.fillStyle = coverPaletteCss(palette[index % palette.length]);
        context.beginPath();
        context.arc(centerX + rotatedX * scale, centerY + rotatedY * scale, pointSize, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      frame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (observer && canvas.parentElement) observer.observe(canvas.parentElement);
    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      observer?.disconnect();
      start = 0;
    };
  }, [mode]);

  return <div className="npFullscreenEffectLayer npParticleLayer" aria-hidden="true"><canvas ref={canvasRef} className="npParticleCanvas" /></div>;
}

class EffectLayerBoundary extends Component<{ children?: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Now Playing fullscreen effect failed to render", error);
  }

  render() {
    // A failed effect renders as a plain black background instead of taking
    // down the whole fullscreen route with the Decky error screen.
    return this.state.failed ? null : this.props.children;
  }
}

function FullscreenEffectLayer(props: { effect: FullscreenEffectKey; coverUrl?: string; isPlaying: boolean; useLocalAudio: boolean }) {
  if (props.effect === "energySaver") return null;

  if (props.effect === "ocean") {
    return <OceanLayer />;
  }

  if (props.effect === "flower" || props.effect === "circle") {
    return <ParticleVisualizerLayer mode={props.effect} coverUrl={props.coverUrl} isPlaying={props.isPlaying} useLocalAudio={props.useLocalAudio} />;
  }

  if (
    props.effect === "particleField" || props.effect === "particleTunnel" || props.effect === "particleSphere"
    || props.effect === "particleWave" || props.effect === "particleRing" || props.effect === "particleKnot" || props.effect === "particleCone"
  ) {
    const particleMode = props.effect === "particleTunnel" ? "tunnel"
      : props.effect === "particleSphere" ? "sphere"
      : props.effect === "particleWave" ? "wave"
      : props.effect === "particleRing" ? "ring"
      : props.effect === "particleKnot" ? "knot"
      : props.effect === "particleCone" ? "cone"
      : "field";
    return <ReactiveParticlesLayer mode={particleMode} coverUrl={props.coverUrl} accent={accentForKey(loadEnabledAppKeys()[0])} isPlaying={props.isPlaying} useLocalAudio={props.useLocalAudio} />;
  }

  if (props.effect === "coverBlur") {
    return (
      <div className="npFullscreenEffectLayer npCoverBlurLayer" aria-hidden="true">
        {props.coverUrl && props.coverUrl.trim() ? (
          <img src={props.coverUrl} className="npCoverBlurImage" />
        ) : null}
      </div>
    );
  }

  return (
    <div className="npFullscreenEffectLayer npGlowLayer" aria-hidden="true">
      <span className="npFullscreenGlow" />
      <span className="npFullscreenGlow" />
    </div>
  );
}

function FullscreenRoute() {
  const t = useTranslations();
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot);
  const [fullscreenEffect, setFullscreenEffect] = useState<FullscreenEffectKey>(loadFullscreenEffect);
  const [effectToastLabel, setEffectToastLabel] = useState<string>("");
  const [effectToastVisible, setEffectToastVisible] = useState<boolean>(false);
  const effectToastTimerRef = useRef<number>(0);
  const [viewMode, setViewMode] = useState<FullscreenViewMode>("standard");
  const [coverMode, setCoverMode] = useState<FullscreenCoverMode>("default");
  const [smallCoverPx, setSmallCoverPx] = useState<number>(0);
  const [controlsHidden, setControlsHidden] = useState<boolean>(false);
  const [metaShift, setMetaShift] = useState<number>(0);
  const idleTimerRef = useRef<number>(0);
  const playPauseRef = useRef<any>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);
  const [fullscreenNow, setFullscreenNow] = useState<Date>(() => new Date());
  const [fullscreenWeather, setFullscreenWeather] = useState<string>("");
  const refreshingRef = useRef<boolean>(false);
  const fullscreenService = loadEnabledAppKeys()[0];
  const localMusicFullscreen = fullscreenService === "localMusic" || fullscreenService === "youtubeMusic";

  const current: PlayerSnapshot | null = useMemo(
    () => snapshot.selected ?? snapshot.players?.[0] ?? null,
    [snapshot]
  );

  const title = current?.title?.trim() ? current.title : t.notPlaying;
  const artist = current?.artist?.trim() ? current.artist : " ";
  const album = current?.album?.trim() ? current.album : " ";
  const isPlaying = current?.status === "Playing";
  const canUsePrevious = !busy && !!current?.canPrevious;
  const canUsePlayPause = !busy && !!current;
  const canUseNext = !busy && !!current?.canNext;
  const fullscreenTime = fullscreenNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  async function refresh(_force = false) {
    if (refreshingRef.current) return;

    refreshingRef.current = true;
    try {
      if (localMusicFullscreen) {
        const local = localAudioPlayer.getSnapshot();
        const track = local.track;
        const artist = Array.isArray(track?.artists) ? track.artists.map((value: any) => value?.name).filter(Boolean).join(", ") : "";
        const player: PlayerSnapshot | null = track ? {
          id: fullscreenService, name: fullscreenService === "youtubeMusic" ? "YouTube Music" : t.localMusicLabel, title: String(track?.name ?? ""), artist, album: String(track?.album?.name ?? ""),
          status: local.status, length: Number(local.length || track?.duration_ms || 0), position: Number(local.position || 0), canNext: local.canNext, canPrevious: local.canPrevious,
          canPlay: true, canPause: true, canTogglePlayPause: true, isSelected: true, isCurrent: true, canShuffle: true, canRepeat: true, shuffleActive: local.shuffleActive, repeatMode: local.repeatMode === "All" ? "List" : local.repeatMode === "One" ? "Track" : "Off",
        } : null;
        setSnapshot({ selectedPlayer: player?.id ?? "", currentPlayer: player?.id ?? "", selected: player, players: player ? [player] : [] });
      } else {
        setSnapshot(await python.getSnapshot());
      }
    } catch (error) {
      console.warn(t.refreshFailed, error);
    } finally {
      refreshingRef.current = false;
    }
  }

  const cycleFullscreenEffect = (step: number) => {
    setFullscreenEffect((currentEffect) => {
      const index = fullscreenEffects.findIndex((option) => option.key === currentEffect);
      const nextIndex = (index + step + fullscreenEffects.length) % fullscreenEffects.length;
      const nextEffect = fullscreenEffects[nextIndex].key;
      saveFullscreenEffect(nextEffect);
      setEffectToastLabel(formatEffectLabel(t, nextEffect));
      setEffectToastVisible(true);
      if (effectToastTimerRef.current) window.clearTimeout(effectToastTimerRef.current);
      effectToastTimerRef.current = window.setTimeout(() => {
        effectToastTimerRef.current = 0;
        setEffectToastVisible(false);
      }, 2000);
      return nextEffect;
    });
  };

  useEffect(() => () => {
    if (effectToastTimerRef.current) window.clearTimeout(effectToastTimerRef.current);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
  }, []);

  const wakeControls = useCallback(() => {
    // Any directional input brings the full standard layout back — cover,
    // track info and playback controls — regardless of the current view/cover mode.
    setViewMode("standard");
    setCoverMode("default");
    setControlsHidden(false);
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      idleTimerRef.current = 0;
      setControlsHidden(true);
    }, 5000);
  }, []);

  // Hide the controls after 5s from opening fullscreen. Play/pause, previous and
  // next (LT/RT/R3) intentionally do NOT re-show them; only a D-pad press does.
  useEffect(() => {
    idleTimerRef.current = window.setTimeout(() => {
      idleTimerRef.current = 0;
      setControlsHidden(true);
    }, 5000);
    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Start with the play/pause button focused so the user never lands on the
  // search bar or other elements hidden behind the fullscreen overlay.
  useEffect(() => {
    let tries = 0;
    const focusPlayPause = () => {
      const element = playPauseRef.current as HTMLElement | null;
      if (element && typeof element.focus === "function") {
        try { element.focus(); return; } catch { /* retry below */ }
      }
      if (tries++ < 20) window.requestAnimationFrame(focusPlayPause);
    };
    focusPlayPause();
  }, []);

  const cycleViewMode = () => {
    setViewMode((currentMode) => {
      const index = fullscreenViewModes.indexOf(currentMode);
      return fullscreenViewModes[(index + 1) % fullscreenViewModes.length];
    });
  };

  const cycleCoverMode = () => {
    setCoverMode((currentMode) => {
      const index = fullscreenCoverModes.indexOf(currentMode);
      return fullscreenCoverModes[(index + 1) % fullscreenCoverModes.length];
    });
  };

  // Playback controls fade after the 5s idle timeout in every fullscreen view
  // (and are always hidden in the clock-only and effect-only views).
  const controlsFadedOut = controlsHidden || viewMode === "clockOnly" || viewMode === "effectOnly";

  // In the "small" cover mode the cover is a fixed size whose top edge lines up
  // with the song title in the no-controls layout (metadata dropped down). It is
  // only (re)measured while the controls are hidden, so showing the controls
  // just moves the metadata text and never resizes the cover.
  useLayoutEffect(() => {
    if (coverMode !== "small") return;
    if (!controlsFadedOut && smallCoverPx > 0) return;
    const cover = coverRef.current;
    const title = titleRef.current;
    if (!cover || !title) return;
    const coverBottom = cover.getBoundingClientRect().bottom;
    const titleTop = title.getBoundingClientRect().top;
    const size = Math.round(coverBottom - titleTop);
    if (size > 48 && Math.abs(size - smallCoverPx) > 1) setSmallCoverPx(size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverMode, controlsFadedOut, metaShift, viewMode, title, artist, album]);

  // The right stick lets the user freely spin the current fullscreen effect.
  useEffect(() => retainVisualizerControl(), []);

  useLayoutEffect(() => {
    if (!controlsFadedOut || viewMode === "clockOnly" || viewMode === "effectOnly") {
      setMetaShift(0);
      return;
    }
    const meta = metaRef.current;
    const controls = controlsRef.current;
    if (!meta || !controls) return;
    const metaRect = meta.getBoundingClientRect();
    const controlsRect = controls.getBoundingClientRect();
    // metaRect already includes any currently applied shift, so remove it
    // before computing the total translation that bottom-aligns the metadata
    // with the (now hidden) playback controls.
    const shift = Math.max(0, Math.round(controlsRect.bottom - (metaRect.bottom - metaShift)));
    setMetaShift(shift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlsFadedOut, viewMode]);

  async function runAction(action: () => Promise<unknown>) {
    try {
      setBusy(true);
      await action();
    } finally {
      window.setTimeout(() => setBusy(false), 180);
    }

    void refresh(true);
    window.setTimeout(() => void refresh(true), 80);
    window.setTimeout(() => void refresh(true), 220);
  }

  useEffect(() => {
    void refresh(true);
    const timer = window.setInterval(() => void refresh(false), 600);
    return () => window.clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    retainFullscreenChromeSuppression();
    return () => releaseFullscreenChromeSuppression();
  }, []);

  useEffect(() => {
    const readWeather = () => {
      const state = (window as any).__deckyWeatherTopbarState;
      const stateLabel = typeof state?.label === "string" ? state.label.trim() : "";
      if (stateLabel) return stateLabel;

      const badge = document.getElementById("decky-weather-topbar-badge");
      const badgeLabel = badge?.textContent?.replace(/\s+/g, " ").trim() ?? "";
      return badgeLabel;
    };

    const update = () => {
      setFullscreenNow(new Date());
      setFullscreenWeather(readWeather());
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const trackTitle = current?.title?.trim() ?? "";
    const trackArtist = current?.artist?.trim() ?? "";
    const trackAlbum = current?.album?.trim() ?? "";

    if (!trackTitle) {
      setCoverUrl("");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const localTrack = localMusicFullscreen ? localAudioPlayer.getSnapshot().track : null;
        const localImages = Array.isArray(localTrack?.images) && localTrack.images.length ? localTrack.images : localTrack?.album?.images;
        const directImage = Array.isArray(localImages) ? String(localImages[localImages.length - 1]?.url ?? "") : "";
        const url = directImage || (localTrack?.coverId
          ? await python.getLocalMusicCover(String(localTrack.coverId))
          : await python.getCover(trackTitle, trackArtist, trackAlbum));
        if (!cancelled) setCoverUrl(url || "");
      } catch (error) {
        if (!cancelled) console.warn(t.coverFailed, error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [current?.title, current?.artist, current?.album, localMusicFullscreen, t.coverFailed]);

  return (
    <Focusable
      className="npFullscreenRoot"
      onCancel={navigateBackFromFullscreen}
      onCancelButton={navigateBackFromFullscreen}
      onButtonDown={(event: any) => {
        const button = event?.detail?.button;
        if (button === GamepadButton.BUMPER_LEFT) cycleFullscreenEffect(-1);
        else if (button === GamepadButton.BUMPER_RIGHT) cycleFullscreenEffect(1);
        else if (button === GamepadButton.SECONDARY) cycleViewMode();
        else if (button === GamepadButton.OPTIONS) cycleCoverMode();
        else if (button === GamepadButton.TRIGGER_LEFT) {
          if (canUsePrevious) void runAction(() => localMusicFullscreen ? localAudioPlayer.command("previous") : python.previousTrack());
        }
        else if (button === GamepadButton.TRIGGER_RIGHT) {
          if (canUseNext) void runAction(() => localMusicFullscreen ? localAudioPlayer.command("next") : python.nextTrack());
        }
        else if (button === GamepadButton.RSTICK_CLICK) {
          if (canUsePlayPause) void runAction(() => localMusicFullscreen ? localAudioPlayer.command("play_pause") : python.playPause());
        }
        // Up/down rotate the 3D effect and never touch the playback controls.
        else if (button === GamepadButton.DIR_UP) nudgeManualRotation(-1);
        else if (button === GamepadButton.DIR_DOWN) nudgeManualRotation(1);
        else if (button === GamepadButton.DIR_LEFT || button === GamepadButton.DIR_RIGHT) wakeControls();
      }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 2147483647,
        background: "#000",
        color: "#fff",
        overflow: "hidden",
        outline: "none",
      }}
    >
      <style>{`
        .npFullscreenRoot,
        .npFullscreenRoot * {
          box-sizing: border-box;
        }

        .npFullscreenRoot {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 2147483647;
          background: #000;
          overflow: hidden;
          font-family: inherit;
        }

        html:has(.npFullscreenRoot) [class*="BasicFooter"],
        html:has(.npFullscreenRoot) [class*="FooterLegend"],
        html:has(.npFullscreenRoot) [class*="QuickAccessFooter"],
        html:has(.npFullscreenRoot) [class*="GamepadFooter"],
        html:has(.npFullscreenRoot) [class*="GamepadHeader"],
        html:has(.npFullscreenRoot) [class*="HeaderStatus"],
        html:has(.npFullscreenRoot) [class*="StatusIcons"],
        html:has(.npFullscreenRoot) [class*="TopBar"],
        html.npFullscreenActive [class*="BasicFooter"],
        html.npFullscreenActive [class*="FooterLegend"],
        html.npFullscreenActive [class*="QuickAccessFooter"],
        html.npFullscreenActive [class*="GamepadFooter"],
        html.npFullscreenActive [class*="GamepadHeader"],
        html.npFullscreenActive [class*="HeaderStatus"],
        html.npFullscreenActive [class*="StatusIcons"],
        html.npFullscreenActive [class*="TopBar"] {
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
          transition: none !important;
        }

        .npFullscreenEffectLayer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .npFullscreenGlow {
          position: absolute;
          width: 58.8vw;
          height: 58.8vw;
          min-width: 588px;
          min-height: 588px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(185,119,0,0.36) 0%, rgba(185,119,0,0.16) 28%, rgba(185,119,0,0) 67%);
          filter: blur(40px);
          opacity: 0.94;
          animation:
            npFullscreenGlowDrift 18.5s ease-in-out infinite alternate,
            npFullscreenGlowHueWarm 58s linear infinite alternate;
          will-change: transform, filter;
        }

        .npFullscreenGlow:nth-child(1) {
          left: 7vw;
          top: -4vh;
        }

        .npFullscreenGlow:nth-child(2) {
          right: 3vw;
          top: 13vh;
          width: 49vw;
          height: 49vw;
          background: radial-gradient(circle, rgba(25,119,202,0.36) 0%, rgba(25,119,202,0.16) 28%, rgba(25,119,202,0) 67%);
          animation:
            npFullscreenGlowDrift 23.8s ease-in-out infinite alternate-reverse,
            npFullscreenGlowHueCool 64s linear infinite alternate;
          opacity: 0.74;
        }

        .npOceanLayer {
          background: #000;
        }

        .npOceanCanvas {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(42.5vw, 476px);
          height: min(42.5vw, 476px);
          transform: translate3d(10%, -50%, 0);
        }

        .npParticleLayer {
          background: #000;
        }

        .npParticleCanvas {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
        }

        .npReactiveParticlesLayer {
          background: #000;
        }

        .npReactiveParticlesCanvas {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
        }

        .npFullscreenNoise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.24;
          mix-blend-mode: screen;
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 0.11px, transparent 0.23px),
            radial-gradient(circle, rgba(255,214,124,0.12) 0, rgba(255,214,124,0.12) 0.1px, transparent 0.22px),
            radial-gradient(circle, rgba(65,159,244,0.1) 0, rgba(65,159,244,0.1) 0.1px, transparent 0.22px);
          background-position: 0 0, 0.45px 0.65px, 0.9px 0.25px;
          background-size: 1px 1px, 1.25px 1.25px, 1.55px 1.55px;
        }

        .npCoverBlurLayer {
          background: #000;
        }

        .npCoverBlurImage {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 126vmax;
          height: 126vmax;
          max-width: none;
          object-fit: cover;
          border-radius: 999px;
          opacity: 0.78;
          filter: blur(70px) saturate(1.68) brightness(0.72);
          transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(1.13);
          animation: npCoverBlurSpin 118s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform-origin: 50% 50%;
          -webkit-transform-style: preserve-3d;
          -webkit-mask-image: radial-gradient(circle, black 0%, black 48%, rgba(0,0,0,0.74) 62%, transparent 78%);
          mask-image: radial-gradient(circle, black 0%, black 48%, rgba(0,0,0,0.74) 62%, transparent 78%);
        }

        .npFullscreenStatus {
          transition: opacity .55s ease;
        }

        .npFullscreenControls {
          transition: opacity .55s ease, left .5s ease;
        }

        .npFullscreenMeta {
          transition: transform .65s ease, opacity .55s ease, left .5s ease;
        }

        .npFullscreenControlsHidden .npFullscreenControls {
          opacity: 0 !important;
          pointer-events: none;
        }

        .npFullscreenView-noClock .npFullscreenStatus,
        .npFullscreenView-clockOnly .npFullscreenCover,
        .npFullscreenView-clockOnly .npFullscreenMeta,
        .npFullscreenView-effectOnly .npFullscreenStatus,
        .npFullscreenView-effectOnly .npFullscreenCover,
        .npFullscreenView-effectOnly .npFullscreenMeta {
          opacity: 0 !important;
          pointer-events: none;
        }

        .npFullscreenEffectToast {
          position: absolute;
          right: clamp(64px, 5vw, 108px);
          top: clamp(42px, 5vh, 74px);
          z-index: 8;
          max-width: 42vw;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: right;
          font-size: clamp(22px, 1.75vw, 34px);
          line-height: 1.1;
          font-weight: 700;
          color: rgba(255,255,255,.94);
          text-shadow: 0 2px 18px rgba(0,0,0,0.58);
          opacity: 0;
          transition: opacity .45s ease;
          pointer-events: none;
        }

        .npFullscreenEffectToastVisible {
          opacity: 1;
          transition: opacity .1s ease;
        }

        .npFullscreenStatus {
          position: absolute;
          left: clamp(64px, 5vw, 108px);
          top: clamp(42px, 5vh, 74px);
          z-index: 2;
          display: flex;
          align-items: baseline;
          gap: 0.55em;
          max-width: calc(100vw - 128px);
          font-size: clamp(22px, 1.75vw, 34px);
          line-height: 1.1;
          font-weight: 700;
          color: rgba(255,255,255,1);
          opacity: 1;
          text-shadow: 0 2px 18px rgba(0,0,0,0.58);
          mix-blend-mode: normal;
          white-space: nowrap;
        }

        .npFullscreenStatusWeather {
          font-weight: 400;
          opacity: 1;
        }

        .npFullscreenCover {
          position: absolute;
          left: var(--np-cover-left, clamp(64px, 5vw, 108px));
          bottom: clamp(76px, 8.4vh, 118px);
          width: var(--np-cover-w, clamp(170px, 13.6vw, 278px));
          height: var(--np-cover-w, clamp(170px, 13.6vw, 278px));
          border-radius: clamp(7px, 0.65vw, 12px);
          overflow: hidden;
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
          opacity: 1;
          transform-origin: left bottom;
          transition: width .5s ease, height .5s ease, opacity .5s ease;
          z-index: 2;
        }

        .npFullscreenCover {
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 18px 70px 26px rgba(0,0,0,0.5);
        }

        .npFullscreenCoverMode-hidden .npFullscreenCover {
          opacity: 0;
          pointer-events: none;
        }

        .npFullscreenMeta::before {
          content: "";
          position: absolute;
          inset: -14% -10% -18% -8%;
          background: radial-gradient(ellipse at 30% 55%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.34) 42%, transparent 74%);
          filter: blur(26px);
          z-index: -1;
          pointer-events: none;
        }

        .npFullscreenMeta {
          position: absolute;
          left: calc(var(--np-cover-left, clamp(64px, 5vw, 108px)) + var(--np-cover-reserve, clamp(170px, 13.6vw, 278px)) + var(--np-cover-gap, clamp(28px, 2.2vw, 48px)));
          right: clamp(64px, 7vw, 144px);
          top: calc(100vh - clamp(76px, 8.4vh, 118px) - clamp(170px, 13.6vw, 278px));
          transform: translateY(clamp(4px, 0.32vw, 7px));
          min-width: 0;
          z-index: 2;
        }

        .npFullscreenTitle {
          margin: 0 0 16px;
          font-size: clamp(34px, 3.1vw, 58px);
          line-height: 1.02;
          font-weight: 700;
          letter-spacing: 0;
          overflow-wrap: anywhere;
          color: rgba(255,255,255,1);
          opacity: 1;
          text-shadow: 0 2px 18px rgba(0,0,0,0.58);
          mix-blend-mode: normal;
        }

        .npFullscreenText {
          margin: 0;
          font-size: clamp(23px, 2vw, 38px);
          line-height: 1.2;
          letter-spacing: 0;
          color: #B8B8B8;
          opacity: 1;
          overflow-wrap: anywhere;
          text-shadow: 0 2px 16px rgba(0,0,0,0.54);
          mix-blend-mode: normal;
        }

        .npFullscreenAlbum {
          color: #808080;
          opacity: 1;
          font-size: clamp(20px, 1.8vw, 34px);
        }

        .npFullscreenControls {
          position: absolute;
          left: calc(var(--np-cover-left, clamp(64px, 5vw, 108px)) + var(--np-cover-reserve, clamp(170px, 13.6vw, 278px)) + var(--np-cover-gap, clamp(28px, 2.2vw, 48px)));
          bottom: clamp(76px, 8.4vh, 118px);
          display: flex;
          align-items: center;
          gap: clamp(12px, 1vw, 18px);
          opacity: 0.72;
          z-index: 2;
        }

        .npFullscreenControlButton {
          width: clamp(44px, 3.4vw, 68px) !important;
          min-width: clamp(44px, 3.4vw, 68px) !important;
          max-width: clamp(44px, 3.4vw, 68px) !important;
          height: clamp(38px, 2.75vw, 48px) !important;
          min-height: clamp(38px, 2.75vw, 48px) !important;
          max-height: clamp(38px, 2.75vw, 48px) !important;
          padding: 0 !important;
          line-height: 1;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 0 0 clamp(44px, 3.4vw, 68px) !important;
        }

        .npFullscreenControlButton svg {
          width: clamp(13px, 1.1vw, 20px);
          height: clamp(13px, 1.1vw, 20px);
          display: block;
          margin: 0;
        }

        @keyframes npFullscreenGlowDrift {
          from { transform: translate3d(-6vw, -3vh, 0) rotate(0deg) scale(0.92); }
          to { transform: translate3d(7vw, 5vh, 0) rotate(22deg) scale(1.08); }
        }

        @keyframes npFullscreenGlowHueWarm {
          from { filter: blur(40px) hue-rotate(0deg) saturate(1); }
          50% { filter: blur(40px) hue-rotate(34deg) saturate(1.12); }
          to { filter: blur(40px) hue-rotate(-18deg) saturate(1.08); }
        }

        @keyframes npFullscreenGlowHueCool {
          from { filter: blur(40px) hue-rotate(0deg) saturate(1); }
          50% { filter: blur(40px) hue-rotate(-58deg) saturate(1.18); }
          to { filter: blur(40px) hue-rotate(38deg) saturate(1.1); }
        }

        @keyframes npCoverBlurSpin {
          from { transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(1.13); }
          to { transform: translate3d(-50%, -50%, 0) rotate(360deg) scale(1.13); }
        }

        @media (max-width: 980px), (max-height: 720px) {
          .npFullscreenGlow {
            min-width: 448px;
            min-height: 448px;
          }

          .npFullscreenCover {
            left: 42px;
            bottom: 74px;
            width: 154px;
            height: 154px;
          }

          .npFullscreenMeta {
            left: 226px;
            right: 42px;
            top: calc(100vh - 74px - 154px);
            transform: translateY(4px);
          }

          .npFullscreenTitle {
            margin-bottom: 10px;
            font-size: 30px;
          }

          .npFullscreenText {
            font-size: 21px;
          }

          .npFullscreenStatus {
            left: 42px;
            top: 34px;
            max-width: calc(100vw - 84px);
            font-size: 22px;
          }

          .npFullscreenControls {
            left: 226px;
            bottom: 74px;
            gap: 14px;
          }

          .npFullscreenControlButton {
            width: 44px !important;
            min-width: 44px !important;
            max-width: 44px !important;
            height: 35px !important;
            min-height: 35px !important;
            max-height: 35px !important;
            flex-basis: 44px !important;
          }
        }
      `}</style>

      <div
        className={`npFullscreenRoot npFullscreenView-${viewMode} npFullscreenCoverMode-${coverMode}${controlsFadedOut ? " npFullscreenControlsHidden" : ""}`}
        style={(() => {
          const left = "clamp(64px, 5vw, 108px)";
          const gap = "clamp(28px, 2.2vw, 48px)";
          const full = "clamp(170px, 13.6vw, 278px)";
          const small = smallCoverPx > 0 ? `${smallCoverPx}px` : "clamp(110px, 8.6vw, 172px)";
          const coverW = coverMode === "default" ? full : small;
          const reserve = coverMode === "hidden" ? `calc(-1 * ${gap})` : coverW;
          return { "--np-cover-left": left, "--np-cover-gap": gap, "--np-cover-w": coverW, "--np-cover-reserve": reserve } as CSSProperties;
        })()}
      >
        <EffectLayerBoundary key={fullscreenEffect}>
          <FullscreenEffectLayer
            effect={fullscreenEffect}
            coverUrl={coverUrl}
            isPlaying={isPlaying}
            useLocalAudio={localMusicFullscreen}
          />
        </EffectLayerBoundary>
        {fullscreenEffect === "glow" || fullscreenEffect === "coverBlur" ? (
          <div className="npFullscreenNoise" aria-hidden="true" />
        ) : null}

        <div className="npFullscreenStatus">
          <span>{fullscreenTime}</span>
          {fullscreenWeather ? <span className="npFullscreenStatusWeather">{fullscreenWeather}</span> : null}
        </div>

        <div className={`npFullscreenEffectToast${effectToastVisible ? " npFullscreenEffectToastVisible" : ""}`} aria-hidden="true">
          {effectToastLabel}
        </div>

        <div className="npFullscreenCover" ref={coverRef}>
          {coverUrl && coverUrl.trim() ? (
            <img
              src={coverUrl}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.07)",
              }}
            >
              <FaMusic size={92} />
            </div>
          )}
        </div>

        <div
          className="npFullscreenMeta"
          ref={metaRef}
          style={metaShift > 0 ? { transform: `translateY(calc(clamp(4px, 0.32vw, 7px) + ${metaShift}px))` } : undefined}
        >
          <h1 className="npFullscreenTitle" ref={titleRef}>{title}</h1>
          <p className="npFullscreenText">{artist}</p>
          <p className="npFullscreenText npFullscreenAlbum">{album}</p>
        </div>

        <Focusable
          className="npFullscreenControls"
          flow-children="horizontal"
          ref={controlsRef as any}
          onButtonDown={(event: any) => {
            // Block up/down navigation so focus can never leave the playback row
            // for the search bar or elements hidden behind the fullscreen overlay.
            // Up/down instead rotate the 3D effect and never re-show the controls.
            const button = event?.detail?.button;
            if (button === GamepadButton.DIR_UP || button === GamepadButton.DIR_DOWN) {
              event?.preventDefault?.();
              event?.stopPropagation?.();
              nudgeManualRotation(button === GamepadButton.DIR_DOWN ? 1 : -1);
            }
          }}
        >
          <DialogButton
            className="npFullscreenControlButton"
            style={{ opacity: canUsePrevious ? 1 : 0.38 }}
            disabled={!canUsePrevious}
            onClick={() => {
              if (canUsePrevious) void runAction(() => localMusicFullscreen ? localAudioPlayer.command("previous") : python.previousTrack());
            }}
          >
            <FaStepBackward />
          </DialogButton>

          <DialogButton
            className="npFullscreenControlButton"
            ref={playPauseRef}
            style={{ opacity: canUsePlayPause ? 1 : 0.38 }}
            disabled={!canUsePlayPause}
            onClick={() => {
              if (canUsePlayPause) void runAction(() => localMusicFullscreen ? localAudioPlayer.command("play_pause") : python.playPause());
            }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </DialogButton>

          <DialogButton
            className="npFullscreenControlButton"
            style={{ opacity: canUseNext ? 1 : 0.38 }}
            disabled={!canUseNext}
            onClick={() => {
              if (canUseNext) void runAction(() => localMusicFullscreen ? localAudioPlayer.command("next") : python.nextTrack());
            }}
          >
            <FaStepForward />
          </DialogButton>
        </Focusable>
      </div>
    </Focusable>
  );
}

function SpotifyBigPictureRoute() {
  useLayoutEffect(() => {
    retainFullscreenChromeSuppression();
    return () => releaseFullscreenChromeSuppression();
  }, []);

  return <SpotifyBigPicture onExit={navigateBackFromBigPicture} onOpenVisualizer={navigateToFullscreen} onOpenSettings={navigateToFullscreenSettings} />;
}

function LocalMusicBigPictureRoute() {
  useLayoutEffect(() => {
    retainFullscreenChromeSuppression();
    return () => releaseFullscreenChromeSuppression();
  }, []);
  return <LocalMusicBigPicture onExit={navigateBackFromBigPicture} onOpenVisualizer={navigateToFullscreen} onOpenSettings={navigateToFullscreenSettings} />;
}

function YouTubeMusicBigPictureRoute() {
  useLayoutEffect(() => {
    retainFullscreenChromeSuppression();
    return () => releaseFullscreenChromeSuppression();
  }, []);
  return <YouTubeMusicBigPicture onExit={navigateBackFromBigPicture} onOpenVisualizer={navigateToFullscreen} onOpenSettings={navigateToFullscreenSettings} />;
}

// Plain stacked option buttons (one under another) with a check on the active
// one. We deliberately avoid a Steam modal/dropdown: in the QAM it could pop the
// route back to the plugin start and in Big Picture the reopened modal was
// invisible. A simple focusable list is reliable everywhere and gamepad-friendly.
function SettingsChoiceButton(props: {
  options: { key: string; label: string }[];
  current: string;
  onSelect: (key: string) => void;
}) {
  return (
    <Focusable style={{ ...centeredColumnStyle, gap: "6px" }} flow-children="vertical">
      {props.options.map((option) => (
        <DialogButton
          key={option.key}
          style={{ ...wideButtonStyle, opacity: props.current === option.key ? 1 : 0.58 }}
          onClick={() => props.onSelect(option.key)}
        >
          <span style={settingsButtonContentStyle}>
            <span>{option.label}</span>
            <span style={settingsCheckStyle}>{props.current === option.key ? <FaCheck /> : null}</span>
          </span>
        </DialogButton>
      ))}
    </Focusable>
  );
}

function ParticleResolutionSelector() {
  const t = useTranslations();
  const options = [
    { data: "1", label: "1×" },
    { data: "1.5", label: "1.5×" },
    { data: "2", label: "2×" },
    { data: "3", label: "3×" },
  ];
  const [current, setCurrent] = useState<string>(() => {
    try { return window.localStorage.getItem(PARTICLE_RESOLUTION_KEY) || "2"; } catch { return "2"; }
  });
  const choose = (value: string) => {
    setCurrent(value);
    try { window.localStorage.setItem(PARTICLE_RESOLUTION_KEY, value); } catch { /* storage unavailable */ }
    if (typeof window !== "undefined") window.dispatchEvent(new Event(PARTICLE_RESOLUTION_EVENT));
    void particlePixelRatio();
  };
  return (
    <>
      <div style={{ height: "12px" }} />
      <div style={{ ...settingsGroupLabelStyle, marginBottom: "6px" }}>{t.settingsParticleResolution}</div>
      <SettingsChoiceButton options={options.map((option) => ({ key: option.data, label: option.label }))} current={current} onSelect={choose} />
    </>
  );
}

// Fullscreen-effect chooser shared by the QAM and fullscreen settings menus.
// A Steam modal is used instead of a context menu: context-menu teardown can
// pop the QAM route or strand focus in Big Picture after closing the selector.
function FullscreenEffectDropdown(props: { value: FullscreenEffectKey; onChange: (key: FullscreenEffectKey) => void }) {
  const t = useTranslations();
  return (
    <SettingsChoiceButton
      options={fullscreenEffects.map((effect) => ({ key: effect.key, label: formatEffectLabel(t, effect.key) }))}
      current={props.value}
      onSelect={(key) => props.onChange(key as FullscreenEffectKey)}
    />
  );
}

// The fullscreen controller-command legend, shared by the QAM and fullscreen
// settings menus so both list the same mappings.
function FullscreenControlsLegend() {
  const t = useTranslations();
  return (
    <div style={{ width: "100%", padding: "10px 12px", boxSizing: "border-box", borderRadius: "8px", background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.78em", lineHeight: 1.5 }}>
      {([
        [["LB", "RB"], t.fsLegendEffect],
        [["X"], t.fsLegendView],
        [["Y"], t.fsLegendCover],
        [["LT"], t.fsLegendPrev],
        [["RT"], t.fsLegendNext],
        [["R3"], t.fsLegendPlayPause],
        [["↑", "↓"], t.fsLegendRotate],
        [["←", "→"], t.fsLegendWake],
      ] as [string[], string][]).map(([buttons, label], index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0", borderTop: index === 0 ? undefined : "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ display: "flex", gap: "4px", flexWrap: "wrap", minWidth: "92px" }}>
            {buttons.map((b) => <span key={b} style={legendChipStyle}>{b}</span>)}
          </span>
          <span style={{ flex: 1, opacity: 0.86 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function FullscreenSettingsRoute() {
  const t = useTranslations();
  const [enabledAppKeys, setEnabledAppKeys] = useState<MusicAppKey[]>(loadEnabledAppKeys);
  const [coverSource, setCoverSourceState] = useState<CoverSource>("online");
  const [fullscreenEffect, setFullscreenEffectState] = useState<FullscreenEffectKey>(loadFullscreenEffect);
  const [topbar, setTopbar] = useState(false);
  const [topbarLeft, setTopbarLeft] = useState(false);
  const [restartingServices, setRestartingServices] = useState(false);
  const [exportingDiagnostics, setExportingDiagnostics] = useState(false);
  const [sourceBehavior, setSourceBehavior] = useState<SourceBehaviorSettings>(defaultSourceBehaviorSettings);
  const initialServiceRef = useRef<MusicAppKey>(loadEnabledAppKeys()[0]);
  const sourceChangedRef = useRef(false);
  const backLabel = t.back;
  const settingsLabel = t.settingsLabel;
  const topbarTrackLabel = t.topbarTrack;
  const topbarLeftLabel = t.topbarLeft;
  const leaveSettings = useCallback(() => {
    if (sourceChangedRef.current) navigateBackToQamFromSettings();
    else navigateBackFromFullscreen();
  }, []);

  useLayoutEffect(() => {
    retainFullscreenChromeSuppression();
    return () => releaseFullscreenChromeSuppression();
  }, []);

  useEffect(() => {
    void python.getCoverSource().then((source) => setCoverSourceState(source === "windows" ? "windows" : "online")).catch(() => {});
    void python.getTopbarEnabled().then((value) => setTopbar(Boolean(value))).catch(() => {});
    void python.getTopbarLeft().then((value) => setTopbarLeft(Boolean(value))).catch(() => {});
    void python.getSourceBehaviorSettings().then(setSourceBehavior).catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      leaveSettings();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [leaveSettings]);

  const toggleApp = (key: MusicAppKey) => {
    if (key === "localMusic" || key === "youtubeMusic") {
      const playingSource = String(localAudioPlayer.getSnapshot().track?.sourceKey ?? "localMusic");
      if (playingSource !== key) localAudioPlayer.stop();
      void python.pauseExternalPlayback().catch(() => false);
    } else localAudioPlayer.stop();
    const next: MusicAppKey[] = [key];
    sourceChangedRef.current = key !== initialServiceRef.current;
    setEnabledAppKeys(next);
    saveEnabledAppKeys(next);
    void python.reportDiagnosticEvent("settings", "source_selected", { source: key, surface: "big-picture-settings" }).catch(() => {});
    void python.setActiveService(key).catch((error) => {
      void python.reportDiagnosticEvent("settings", "source_select_failed", { source: key, error: String(error?.message ?? error) }).catch(() => {});
    });
  };
  const selectCover = (source: CoverSource) => {
    setCoverSourceState(source);
    void python.setCoverSource(source).catch(() => {});
  };
  const selectEffect = (effect: FullscreenEffectKey) => {
    setFullscreenEffectState(effect);
    saveFullscreenEffect(effect);
  };
  const restartServices = async () => {
    if (restartingServices) return;
    setRestartingServices(true);
    toaster.toast({ title: "Now Playing", body: t.restartServicesInProgress, duration: 1800 });
    try {
      const result = await python.restartPluginServices();
      toaster.toast({
        title: "Now Playing",
        body: result?.ok
          ? t.restartServicesSuccess
          : `${t.restartServicesFailed}${result?.message ? `: ${localizeRuntimeMessage(result.message)}` : ""}`,
        duration: 3400,
      });
    } catch (error: any) {
      toaster.toast({
        title: "Now Playing",
        body: `${t.restartServicesFailed}: ${localizeRuntimeMessage(error?.message ?? String(error))}`,
        duration: 3600,
      });
    } finally {
      setRestartingServices(false);
    }
  };

  const exportDiagnostics = async () => {
    if (exportingDiagnostics) return;
    setExportingDiagnostics(true);
    try {
      const result = await python.exportDiagnosticLog();
      toaster.toast({
        title: "Now Playing",
        body: result?.ok
          ? formatTranslation(t.diagnosticLogExported, { path: result.path || "Downloads" })
          : `${t.diagnosticLogExportFailed}${result?.error ? `: ${result.error}` : ""}`,
        duration: result?.ok ? 5200 : 3800,
      });
    } catch (error: any) {
      toaster.toast({ title: "Now Playing", body: `${t.diagnosticLogExportFailed}: ${error?.message ?? String(error)}`, duration: 3800 });
    } finally {
      setExportingDiagnostics(false);
    }
  };

  const updateSourceBehavior = async (next: python.SourceBehaviorSettings) => {
    setSourceBehavior(next);
    try {
      setSourceBehavior(await python.setSourceBehaviorSettings(next.autoLaunch, next.closeOnSwitch));
    } catch {
      void python.getSourceBehaviorSettings().then(setSourceBehavior).catch(() => {});
    }
  };

  const card: CSSProperties = {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,.10)",
    background: "linear-gradient(145deg,rgba(255,255,255,.085),rgba(255,255,255,.035))",
    backdropFilter: "blur(24px)",
    padding: "20px",
    boxShadow: "0 22px 70px rgba(0,0,0,.28)",
    overflow: "hidden",
  };
  const heading: CSSProperties = { margin: "0 0 14px", fontSize: "20px", fontWeight: 650 };
  const optionButton: CSSProperties = { width: "100%", minWidth: "100%", height: "46px", minHeight: "46px", marginBottom: "8px", padding: 0 };
  const optionContent: CSSProperties = { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0 12px", boxSizing: "border-box", textAlign: "left" };

  return (
    <Focusable
      className="npFullscreenRoot npFullscreenSettings"
      flow-children="vertical"
      onCancel={leaveSettings}
      onCancelButton={leaveSettings}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 2147483647, overflowY: "auto", overflowX: "hidden", background: "radial-gradient(circle at 10% 0%, rgba(217,163,55,.18), transparent 34%), radial-gradient(circle at 92% 0%, rgba(29,185,84,.13), transparent 30%), #090909", color: "#fff", padding: "28px 48px 120px", scrollPaddingBottom: 100 }}
    >
      <style>{`
        .npFullscreenSettings,.npFullscreenSettings *{box-sizing:border-box}
        .npFullscreenSettings button{transition:background 120ms ease,border-color 120ms ease,box-shadow 120ms ease!important}
        .npFullscreenSettings button:focus,.npFullscreenSettings button.gpfocus{transform:none!important;background:rgba(255,255,255,.13)!important;border-color:rgba(255,255,255,.26)!important;box-shadow:0 0 0 2px rgba(255,255,255,.72),0 0 22px rgba(255,255,255,.12)!important}
        .npFullscreenSettings .npSettingsShell{width:min(1680px,100%);margin:0 auto}
        .npFullscreenSettings .npSettingsGrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;align-items:start;width:100%}
        .npFullscreenSettings .npSettingsColumn{display:flex;flex-direction:column;gap:18px;min-width:0;width:100%}
        .npFullscreenSettings .npSettingsCard button,.npFullscreenSettings .npSettingsCard button *{color:#fff!important;text-align:left!important}
        .npFullscreenSettings .npSettingsCard button{font-size:16px!important}
        .npFullscreenSettings .npSettingsCard button>span{width:100%!important;box-sizing:border-box!important;justify-content:flex-start!important;text-align:left!important;font-size:1em!important;padding-left:12px!important;padding-right:12px!important}
        .npFullscreenSettings button.npLocalRemoveFolderButton>span{justify-content:center!important;padding:0!important}
        @media(max-width:1180px){.npFullscreenSettings .npSettingsGrid{grid-template-columns:1fr}}
      `}</style>
      <div className="npSettingsShell">
        <DialogButton className="npLocalMinimalButton" style={{ width: "112px", minWidth: "112px", height: "38px", marginBottom: "18px" }} onClick={leaveSettings}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}><FaArrowLeft size={12} /> {backLabel}</span>
        </DialogButton>
        <div style={{ marginBottom: "26px" }}>
          <h1 style={{ margin: 0, fontSize: "42px", letterSpacing: "-.035em" }}>{settingsLabel}</h1>
          <div style={{ marginTop: 4, opacity: .52 }}>Now Playing 2.2.0</div>
        </div>

        <Focusable className="npSettingsGrid" flow-children="grid">
          <Focusable className="npSettingsColumn" flow-children="vertical">
            <section className="npSettingsCard" style={card}>
              <h2 style={heading}>{t.settingsApps}</h2>
              {musicApps.map((app) => {
                const Icon = app.Icon;
                const active = enabledAppKeys[0] === app.key;
                return <DialogButton key={app.key} style={{ ...optionButton, opacity: active ? 1 : .58 }} onClick={() => toggleApp(app.key)}><span style={optionContent}><Icon /><span>{appDisplayLabel(app, t)}</span><span style={{ marginLeft: "auto" }}>{active ? <FaCheck /> : null}</span></span></DialogButton>;
              })}
              <div style={{ marginTop: "14px" }}><SurroundUpmixControls /></div>
              <div style={{ margin: "14px 2px 7px", opacity: .62, lineHeight: 1.4 }}>{t.autoLaunchSourcesDescription}</div>
              <DialogButton style={{ ...optionButton, opacity: sourceBehavior.autoLaunch ? 1 : .58 }} onClick={() => void updateSourceBehavior({ ...sourceBehavior, autoLaunch: !sourceBehavior.autoLaunch })}><span style={optionContent}><span>{t.autoLaunchSources}</span><span style={{ marginLeft: "auto" }}>{sourceBehavior.autoLaunch ? <FaCheck /> : null}</span></span></DialogButton>
              <div style={{ margin: "8px 2px 7px", opacity: .62, lineHeight: 1.4 }}>{t.closeSourcesOnSwitchDescription}</div>
              <DialogButton style={{ ...optionButton, opacity: sourceBehavior.closeOnSwitch ? 1 : .58 }} onClick={() => void updateSourceBehavior({ ...sourceBehavior, closeOnSwitch: !sourceBehavior.closeOnSwitch })}><span style={optionContent}><span>{t.closeSourcesOnSwitch}</span><span style={{ marginLeft: "auto" }}>{sourceBehavior.closeOnSwitch ? <FaCheck /> : null}</span></span></DialogButton>
            </section>

            <section className="npSettingsCard" style={card}>
              <h2 style={heading}>{t.settingsCoverSource}</h2>
              {(["online", "windows"] as CoverSource[]).map((source) => {
                const active = coverSource === source;
                const label = source === "online" ? (t.coverSourceOnline) : (t.coverSourceWindows);
                return <DialogButton key={source} style={{ ...optionButton, opacity: active ? 1 : .58 }} onClick={() => selectCover(source)}><span style={optionContent}><span>{label}</span><span style={{ marginLeft: "auto" }}>{active ? <FaCheck /> : null}</span></span></DialogButton>;
              })}
            </section>

            <section className="npSettingsCard" style={card}>
              <h2 style={heading}>{t.settingsFullscreenEffect}</h2>
              <FullscreenEffectDropdown value={fullscreenEffect} onChange={selectEffect} />
              <ParticleResolutionSelector />
            </section>

            <section className="npSettingsCard" style={card}>
              <h2 style={heading}>{t.settingsFullscreenControls}</h2>
              <FullscreenControlsLegend />
            </section>

            <section className="npSettingsCard" style={card}>
              <h2 style={heading}>{t.topbarSection}</h2>
              <DialogButton style={{ ...optionButton, opacity: topbar ? 1 : .58 }} onClick={() => { const next = !topbar; setTopbar(next); void python.setTopbarEnabled(next); }}><span style={optionContent}><span>{topbarTrackLabel}</span><span style={{ marginLeft: "auto" }}>{topbar ? <FaCheck /> : null}</span></span></DialogButton>
              <DialogButton style={{ ...optionButton, opacity: topbar && topbarLeft ? 1 : .58 }} disabled={!topbar} onClick={() => { const next = !topbarLeft; setTopbarLeft(next); void python.setTopbarLeft(next); }}><span style={optionContent}><span>{topbarLeftLabel}</span><span style={{ marginLeft: "auto" }}>{topbar && topbarLeft ? <FaCheck /> : null}</span></span></DialogButton>
              <div style={{ margin: "12px 0 8px", opacity: .58, lineHeight: 1.4 }}>{t.restartServicesDescription}</div>
              <DialogButton style={optionButton} disabled={restartingServices} onClick={() => void restartServices()}><span style={optionContent}><FaSyncAlt className={restartingServices ? "npRestartSpin" : undefined} /> {t.restartServices}</span></DialogButton>
              <div style={{ margin: "14px 0 8px", opacity: .58, lineHeight: 1.4 }}>{t.diagnosticLogDescription}</div>
              <DialogButton style={optionButton} disabled={exportingDiagnostics} onClick={() => void exportDiagnostics()}><span style={optionContent}><FaFileAlt /> {t.exportDiagnosticLog}</span></DialogButton>
            </section>
          </Focusable>

          <Focusable className="npSettingsColumn" flow-children="vertical">
            <section className="npSettingsCard" style={card}><LocalMusicSettingsPanel selectedService={enabledAppKeys[0] ?? "localMusic"} /></section>
            <section className="npSettingsCard" style={card}><SpotifyPlusSettingsPanel selectedService={enabledAppKeys[0] ?? "localMusic"} onSettingsChanged={() => {}} /></section>
            <section className="npSettingsCard" style={card}><YouTubeMusicSettingsPanel selectedService={enabledAppKeys[0] ?? "localMusic"} /></section>
            <section className="npSettingsCard" style={card}><FanartSettingsPanel /></section>
          </Focusable>
        </Focusable>
      </div>
    </Focusable>
  );
}

function RepeatIcon(props: { repeatMode?: string }) {
  const isTrack = props.repeatMode === "Track";

  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <FaRedoAlt />
      {isTrack ? (
        <span
          style={{
            position: "absolute",
            right: "-6px",
            bottom: "-6px",
            fontSize: "0.64em",
            fontWeight: 700,
          }}
        >
          1
        </span>
      ) : null}
    </span>
  );
}

function SettingsView(props: {
  enabledAppKeys: MusicAppKey[];
  coverSource: CoverSource;
  fullscreenEffect: FullscreenEffectKey;
  onBack: () => void;
  onSelectCoverSource: (source: CoverSource) => void;
  onSelectFullscreenEffect: (effect: FullscreenEffectKey) => void;
  onToggleApp: (key: MusicAppKey) => void;
  onSpotifySettingsChanged: (settings: SpotifyPlusSettings) => void;
}) {
  const t = useTranslations();
  const enabled = new Set(props.enabledAppKeys);
  const [topbar, setTopbar] = useState(false);
  const [topbarLeft, setTopbarLeft] = useState(false);
  const [restartingServices, setRestartingServices] = useState(false);
  const [exportingDiagnostics, setExportingDiagnostics] = useState(false);
  const [sourceBehavior, setSourceBehavior] = useState<SourceBehaviorSettings>(defaultSourceBehaviorSettings);
  useEffect(() => {
    let ok = true;
    python.getTopbarEnabled().then((v) => { if (ok) setTopbar(!!v); }).catch(() => {});
    python.getTopbarLeft().then((v) => { if (ok) setTopbarLeft(!!v); }).catch(() => {});
    python.getSourceBehaviorSettings().then((v) => { if (ok) setSourceBehavior(v); }).catch(() => {});
    return () => { ok = false; };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      props.onBack();
    };
    document.addEventListener("keydown", handleEscape, true);
    return () => document.removeEventListener("keydown", handleEscape, true);
  }, [props.onBack]);

  async function updateSourceBehavior(next: python.SourceBehaviorSettings) {
    setSourceBehavior(next);
    try {
      setSourceBehavior(await python.setSourceBehaviorSettings(next.autoLaunch, next.closeOnSwitch));
    } catch {
      void python.getSourceBehaviorSettings().then(setSourceBehavior).catch(() => {});
    }
  }

  async function restartPluginServices() {
    if (restartingServices) return;
    setRestartingServices(true);
    toaster.toast({ title: "Now Playing", body: t.restartServicesInProgress, duration: 1800 });
    try {
      const result = await python.restartPluginServices();
      toaster.toast({
        title: "Now Playing",
        body: result?.ok
          ? (t.restartServicesSuccess)
          : `${t.restartServicesFailed}${result?.message ? `: ${localizeRuntimeMessage(result.message)}` : ""}`,
        duration: 3200,
      });
    } catch (error: any) {
      toaster.toast({
        title: "Now Playing",
        body: `${t.restartServicesFailed}: ${localizeRuntimeMessage(error?.message ?? String(error))}`,
        duration: 3500,
      });
    } finally {
      setRestartingServices(false);
    }
  }

  async function exportDiagnostics() {
    if (exportingDiagnostics) return;
    setExportingDiagnostics(true);
    try {
      const result = await python.exportDiagnosticLog();
      toaster.toast({
        title: "Now Playing",
        body: result?.ok
          ? formatTranslation(t.diagnosticLogExported, { path: result.path || "Downloads" })
          : `${t.diagnosticLogExportFailed}${result?.error ? `: ${result.error}` : ""}`,
        duration: result?.ok ? 5200 : 3800,
      });
    } catch (error: any) {
      toaster.toast({ title: "Now Playing", body: `${t.diagnosticLogExportFailed}: ${error?.message ?? String(error)}`, duration: 3800 });
    } finally {
      setExportingDiagnostics(false);
    }
  }

  return (
    <Focusable
      className="npSettingsViewRoot"
      flow-children="vertical"
      onCancel={props.onBack}
      onCancelButton={props.onBack}
      style={{ width: "100%" }}
    >
      <style>{`
        .npSettingsViewRoot button,.npSettingsViewRoot button *{color:#fff!important;text-align:left!important}
        .npSettingsViewRoot button{font-size:.82em!important}
        .npSettingsViewRoot button>span{width:100%!important;box-sizing:border-box!important;justify-content:flex-start!important;font-size:1em!important;padding-left:10px!important;padding-right:10px!important}
        .npSettingsViewRoot button.npSettingsBackButton>span{justify-content:center!important;padding:0!important}
        .npSettingsViewRoot button:hover,.npSettingsViewRoot button:focus,.npSettingsViewRoot button.gpfocus{color:#fff!important;background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.24)!important;box-shadow:0 0 0 1px rgba(255,255,255,.22),0 0 18px rgba(255,255,255,.10)!important}
      `}</style>
      <PanelSection>
      <PanelSectionRow>
        <div style={qamCenterRowStyle}>
          <div style={{ ...centeredColumnStyle, overflow: "visible" }}>
            <DialogButton className="npSettingsBackButton" style={{ ...wideButtonStyle, marginBottom: "10px" }} onClick={props.onBack}>
              <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><FaArrowLeft /> {t.back}</span>
            </DialogButton>

            <div style={{ ...settingsGroupLabelStyle, marginBottom: "6px" }}>
              {t.settingsApps}
            </div>

            <Focusable style={{ ...centeredColumnStyle, gap: "6px" }} flow-children="vertical">
              {musicApps.map((app) => {
                const Icon = app.Icon;
                const isEnabled = enabled.has(app.key);

                return (
                  <DialogButton
                    key={app.key}
                    style={{ ...wideButtonStyle, opacity: isEnabled ? 1 : 0.58 }}
                    onClick={() => props.onToggleApp(app.key)}
                  >
                    <span style={settingsButtonContentStyle}>
                      <Icon />
                      <span>{appDisplayLabel(app, t)}</span>
                      <span style={settingsCheckStyle}>{isEnabled ? <FaCheck /> : null}</span>
                    </span>
                  </DialogButton>
                );
              })}
            </Focusable>

            <div style={{ height: "12px" }} />
            <div style={{ ...settingsGroupLabelStyle, marginBottom: "6px" }}>
              {t.settingsCoverSource}
            </div>

            <Focusable style={{ ...centeredColumnStyle, gap: "6px" }} flow-children="vertical">
              {(["online", "windows"] as CoverSource[]).map((source) => {
                const isSelected = props.coverSource === source;
                const label = source === "online"
                  ? (t.coverSourceOnline)
                  : (t.coverSourceWindows);

                return (
                  <DialogButton
                    key={source}
                    style={{ ...wideButtonStyle, opacity: isSelected ? 1 : 0.58 }}
                    onClick={() => props.onSelectCoverSource(source)}
                  >
                    <span style={settingsButtonContentStyle}>
                      <span>{label}</span>
                      <span style={settingsCheckStyle}>{isSelected ? <FaCheck /> : null}</span>
                    </span>
                  </DialogButton>
                );
              })}
            </Focusable>

            <div style={{ height: "12px" }} />
            <div style={{ ...settingsGroupLabelStyle, marginBottom: "6px" }}>
              {t.settingsFullscreenEffect}
            </div>
            <FullscreenEffectDropdown value={props.fullscreenEffect} onChange={props.onSelectFullscreenEffect} />

            <ParticleResolutionSelector />

            <div style={{ height: "12px" }} />
            <div style={{ ...settingsGroupLabelStyle, marginBottom: "6px" }}>{t.settingsFullscreenControls}</div>
            <FullscreenControlsLegend />

            <div style={{ height: "12px" }} />
            <div style={{ ...settingsGroupLabelStyle, marginBottom: "6px" }}>{t.topbarSection}</div>
            <Focusable style={{ ...centeredColumnStyle, gap: "6px" }} flow-children="vertical">
              <DialogButton
                style={{ ...wideButtonStyle, opacity: topbar ? 1 : 0.58 }}
                onClick={() => { const nv = !topbar; setTopbar(nv); void python.setTopbarEnabled(nv); }}
              >
                <span style={settingsButtonContentStyle}>
                  <span>{t.topbarTrack}</span>
                  <span style={settingsCheckStyle}>{topbar ? <FaCheck /> : null}</span>
                </span>
              </DialogButton>
              <DialogButton
                style={{ ...wideButtonStyle, opacity: topbar && topbarLeft ? 1 : 0.58 }}
                disabled={!topbar}
                onClick={() => {
                  const nv = !topbarLeft;
                  setTopbarLeft(nv);
                  void python.setTopbarLeft(nv);
                }}
              >
                <span style={settingsButtonContentStyle}>
                  <span>{t.topbarLeft}</span>
                  <span style={settingsCheckStyle}>{topbar && topbarLeft ? <FaCheck /> : null}</span>
                </span>
              </DialogButton>
            </Focusable>

            <div style={{ height: "12px" }} />
            <div style={{ height: "12px" }} />
            <SurroundUpmixControls />
            <div style={{ height: "12px" }} />
            <div style={{ margin: "12px 3px 6px", fontSize: ".72em", lineHeight: 1.4, opacity: .58 }}>{t.autoLaunchSourcesDescription}</div>
            <DialogButton style={{ ...wideButtonStyle, height: "54px", minHeight: "54px", lineHeight: 1.25, opacity: sourceBehavior.autoLaunch ? 1 : .58 }} onClick={() => void updateSourceBehavior({ ...sourceBehavior, autoLaunch: !sourceBehavior.autoLaunch })}>
              <span style={{ ...settingsButtonContentStyle, minHeight: "54px", whiteSpace: "normal", lineHeight: 1.25 }}><span>{t.autoLaunchSources}</span><span style={settingsCheckStyle}>{sourceBehavior.autoLaunch ? <FaCheck /> : null}</span></span>
            </DialogButton>
            <div style={{ margin: "8px 3px 6px", fontSize: ".72em", lineHeight: 1.4, opacity: .58 }}>{t.closeSourcesOnSwitchDescription}</div>
            <DialogButton style={{ ...wideButtonStyle, height: "54px", minHeight: "54px", lineHeight: 1.25, opacity: sourceBehavior.closeOnSwitch ? 1 : .58 }} onClick={() => void updateSourceBehavior({ ...sourceBehavior, closeOnSwitch: !sourceBehavior.closeOnSwitch })}>
              <span style={{ ...settingsButtonContentStyle, minHeight: "54px", whiteSpace: "normal", lineHeight: 1.25 }}><span>{t.closeSourcesOnSwitch}</span><span style={settingsCheckStyle}>{sourceBehavior.closeOnSwitch ? <FaCheck /> : null}</span></span>
            </DialogButton>

            <div style={{ height: "12px" }} />
            <LocalMusicSettingsPanel selectedService={props.enabledAppKeys[0] ?? "localMusic"} />
            <SpotifyPlusSettingsPanel
              selectedService={props.enabledAppKeys[0] ?? "localMusic"}
              onSettingsChanged={props.onSpotifySettingsChanged}
            />
            <YouTubeMusicSettingsPanel selectedService={props.enabledAppKeys[0] ?? "localMusic"} />
            <FanartSettingsPanel />

            <div style={{ height: "12px" }} />
            <div style={{ ...settingsGroupLabelStyle, marginBottom: "6px" }}>
              {t.settingsRecovery}
            </div>
            <div
              style={{
                width: "100%",
                marginBottom: "6px",
                color: "rgba(255,255,255,0.62)",
                fontSize: "0.82em",
                lineHeight: 1.35,
              }}
            >
              {t.restartServicesDescription}
            </div>
            <DialogButton
              style={wideButtonStyle}
              disabled={restartingServices}
              onClick={() => void restartPluginServices()}
            >
              <span style={settingsButtonContentStyle}>
                <FaSyncAlt className={restartingServices ? "npRestartSpin" : undefined} />
                <span>{restartingServices ? t.restartServicesInProgress : t.restartServices}</span>
              </span>
            </DialogButton>
            <div style={{ width: "100%", margin: "12px 0 6px", color: "rgba(255,255,255,0.62)", fontSize: "0.82em", lineHeight: 1.35 }}>
              {t.diagnosticLogDescription}
            </div>
            <DialogButton style={wideButtonStyle} disabled={exportingDiagnostics} onClick={() => void exportDiagnostics()}>
              <span style={settingsButtonContentStyle}><FaFileAlt /><span>{t.exportDiagnosticLog}</span></span>
            </DialogButton>
            <style>{`
              @keyframes npRestartSpin { to { transform: rotate(360deg); } }
              .npRestartSpin { animation: npRestartSpin .8s linear infinite; }
            `}</style>
          </div>
        </div>
      </PanelSectionRow>
      </PanelSection>
    </Focusable>
  );
}

function spotifyPlaybackToPlayer(payload: any): PlayerSnapshot | null {
  const item = payload?.item;
  if (!item || !item?.name) return null;
  const artists = Array.isArray(item?.artists)
    ? item.artists.map((artist: any) => artist?.name).filter(Boolean).join(", ")
    : String(item?.show?.name ?? "");
  const repeat = String(payload?.repeat_state ?? "off");
  const images = item?.album?.images ?? item?.images ?? [];
  const artworkUrl = Array.isArray(images)
    ? String([...images].filter((entry: any) => entry?.url).sort((left: any, right: any) => {
        const leftSize = Number(left?.width || 0) * Number(left?.height || 0);
        const rightSize = Number(right?.width || 0) * Number(right?.height || 0);
        return rightSize - leftSize;
      })[0]?.url ?? "")
    : "";
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
    artworkUrl,
    volume: Number(payload?.device?.volume_percent ?? 100),
  };
}

function spotifyPausedPlayer(t: SpotifyTranslation): PlayerSnapshot {
  return {
    id: "spotify-api-paused",
    name: "Spotify",
    title: t.apiPausedTitle,
    artist: t.apiPausedWait,
    album: "",
    status: "Paused",
    length: 0,
    position: 0,
    canNext: false,
    canPrevious: false,
    canPlay: false,
    canPause: false,
    canTogglePlayPause: false,
    isSelected: true,
    isCurrent: true,
    canShuffle: false,
    canRepeat: false,
    shuffleActive: false,
    repeatMode: "Off",
    artworkUrl: "",
    volume: getSavedSourceVolume("spotify", 100),
  };
}

function Content() {
  const t = useTranslations();
  const spotifyT = useMemo(() => getTranslations("spotify"), []);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [spotifyPlus, setSpotifyPlus] = useState<SpotifyPlusSettings>({
    enabled: false,
    clientId: "",
    redirectUri: "http://127.0.0.1:43821/callback",
    authenticated: false,
  });
  const [spotifySettingsReady, setSpotifySettingsReady] = useState(false);
  const [spotifyApiStatus, setSpotifyApiStatus] = useState<python.SpotifyApiStatus>({ active: false, remainingSeconds: 0, until: 0 });
  const [spotifyAlbumRequest, setSpotifyAlbumRequest] = useState<{ id: string; title: string; nonce: number } | null>(null);
  const [localAlbumRequest, setLocalAlbumRequest] = useState<{ id: string; title: string; nonce: number } | null>(null);
  const [enabledAppKeys, setEnabledAppKeys] = useState<MusicAppKey[]>(loadEnabledAppKeys);
  const [activeServiceReady, setActiveServiceReady] = useState(false);
  const [coverSource, setCoverSource] = useState<CoverSource>("online");
  const [fullscreenEffect, setFullscreenEffect] = useState<FullscreenEffectKey>(loadFullscreenEffect);
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot);
  const [snapshotAt, setSnapshotAt] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [useDarkCoverMetadata, setUseDarkCoverMetadata] = useState<boolean>(false);
  const [coverResolving, setCoverResolving] = useState<boolean>(false);
  const [appVolume, setAppVolume] = useState<number>(100);
  const [volumeReady, setVolumeReady] = useState<boolean>(false);
  const [activeAppRunning, setActiveAppRunning] = useState<boolean>(false);
  const [mediaVisible, setMediaVisible] = useState<boolean>(true);
  const [bottomGlowFadeTop, setBottomGlowFadeTop] = useState<number>(520);
  const qamRootRef = useRef<HTMLDivElement>(null);
  const volumeWrapperRef = useRef<HTMLDivElement>(null);
  const refreshingRef = useRef<boolean>(false);
  const mediaKeyRef = useRef<string>("");
  const volumeCommitTimerRef = useRef<number>(0);
  const volumeValueRef = useRef<number>(100);
  const volumeInteractionAtRef = useRef<number>(0);
  const volumeCommitInFlightRef = useRef<boolean>(false);
  const volumeCommitQueuedRef = useRef<boolean>(false);
  const volumeCommitRetryRef = useRef<number>(0);
  const coverRequestRef = useRef<number>(0);
  const coverClearTimerRef = useRef<number>(0);
  const coverCacheRef = useRef<Map<string, string>>(new Map());
  const coverUrlRef = useRef<string>("");
  const coverIdentityRef = useRef<string>("");
  const volumeObservedRef = useRef<{ value: number; count: number }>({ value: -1, count: 0 });
  const spotifyPlaybackCacheRef = useRef<{ at: number; player: PlayerSnapshot | null; lastValidAt: number }>({ at: 0, player: null, lastValidAt: 0 });
  const spotifyApiPausedRef = useRef(false);
  const sourceRefreshTimersRef = useRef<number[]>([]);
  const volumeApplyTimersRef = useRef<number[]>([]);
  const volumeAppliedRef = useRef(false);
  const stableCurrentRef = useRef<{ service: string; at: number; player: PlayerSnapshot } | null>(null);
  const sourceInteractionAtRef = useRef(0);
  const snapshotRef = useRef<Snapshot>(emptySnapshot);
  const snapshotAtRef = useRef<number>(Date.now());

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    const syncSource = (event?: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : undefined;
      const next = detail ? normalizeEnabledAppKeys(detail) : loadEnabledAppKeys();
      setEnabledAppKeys((previous) => previous[0] === next[0] ? previous : next);
    };
    window.addEventListener(APP_SETTINGS_CHANGED_EVENT, syncSource);
    window.addEventListener("focus", syncSource);
    return () => {
      window.removeEventListener(APP_SETTINGS_CHANGED_EVENT, syncSource);
      window.removeEventListener("focus", syncSource);
    };
  }, []);

  const activeServiceKey = enabledAppKeys[0] ?? "localMusic";

  useEffect(() => {
    let cancelled = false;
    setUseDarkCoverMetadata(false);
    void coverNeedsDarkMetadata(coverUrl).then((needsDark) => {
      if (!cancelled) setUseDarkCoverMetadata(needsDark);
    });
    return () => { cancelled = true; };
  }, [coverUrl]);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const syncBackendSource = async () => {
      try {
        const service = await python.getActiveService();
        if (cancelled || !musicApps.some((app) => app.key === service)) return;
        if (Date.now() - sourceInteractionAtRef.current < 3000) return;
        const next = service as MusicAppKey;
        setEnabledAppKeys((previous) => {
          if (previous[0] === next) return previous;
          saveEnabledAppKeys([next]);
          return [next];
        });
      } catch {
        // The saved frontend choice remains usable if the backend is reloading.
      } finally {
        if (!cancelled) {
          setActiveServiceReady(true);
          timer = window.setTimeout(() => void syncBackendSource(), 1800);
        }
      }
    };
    void syncBackendSource();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (activeServiceKey === "localMusic" || activeServiceKey === "youtubeMusic") {
      setActiveAppRunning(false);
      return;
    }
    let cancelled = false;
    const update = async () => {
      try {
        const running = await python.isMusicAppRunning(activeServiceKey);
        if (!cancelled) setActiveAppRunning(Boolean(running));
      } catch {
        if (!cancelled) setActiveAppRunning(false);
      }
    };
    void update();
    const timer = window.setInterval(() => void update(), 1600);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [activeServiceKey]);

  const rawCurrent: PlayerSnapshot | null = useMemo(
    () => snapshot.selected ?? snapshot.players?.[0] ?? null,
    [snapshot]
  );
  const current: PlayerSnapshot | null = useMemo(() => {
    const now = Date.now();
    const previous = stableCurrentRef.current;
    const hasIdentity = Boolean(rawCurrent?.title?.trim());
    if (rawCurrent && hasIdentity) {
      const sameTrack = previous?.service === activeServiceKey
        && previous.player.id === rawCurrent.id
        && previous.player.title === rawCurrent.title
        && previous.player.artist === rawCurrent.artist;
      const player = sameTrack
        ? {
            ...previous.player,
            ...rawCurrent,
            artworkUrl: rawCurrent.artworkUrl || previous.player.artworkUrl,
            album: rawCurrent.album || previous.player.album,
          }
        : rawCurrent;
      stableCurrentRef.current = { service: activeServiceKey, at: now, player };
      return player;
    }
    if (previous?.service === activeServiceKey && now - previous.at < 4200) {
      return rawCurrent
        ? {
            ...previous.player,
            ...rawCurrent,
            title: previous.player.title,
            artist: previous.player.artist,
            album: previous.player.album,
            artworkUrl: previous.player.artworkUrl,
          }
        : previous.player;
    }
    return rawCurrent;
  }, [rawCurrent, activeServiceKey]);

  useEffect(() => {
    const publish = () => {
      const status = String(current?.status || "Stopped");
      publishPlaybackActivity(
        status.toLowerCase() === "playing",
        status,
        activeServiceKey,
        String(current?.name || current?.id || ""),
        String(current?.id || current?.title || ""),
      );
    };
    publish();
    const heartbeat = window.setInterval(publish, 2000);
    return () => window.clearInterval(heartbeat);
  }, [activeServiceKey, current?.status, current?.name, current?.id, current?.title]);

  const enabledApps = useMemo(
    () => musicApps.filter((app) => app.key === activeServiceKey),
    [activeServiceKey]
  );

  useEffect(() => {
    if (!activeServiceReady) return;
    let cancelled = false;
    sourceRefreshTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    sourceRefreshTimersRef.current = [];
    const activeService = activeServiceKey;
    volumeAppliedRef.current = false;
    volumeApplyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    volumeApplyTimersRef.current = [];
    coverRequestRef.current += 1;
    spotifyPlaybackCacheRef.current = { at: 0, player: null, lastValidAt: 0 };
    stableCurrentRef.current = null;
    mediaKeyRef.current = "";
    setSnapshot(emptySnapshot);
    setCoverResolving(false);
    setMediaVisible(false);
    setLoading(true);

    // Enforce one playback source even when the setting changed from the
    // fullscreen route or while QAM was unmounted. The backend serializes app
    // lifecycle changes; the frontend only restores the local player snapshot.
    if (activeService === "localMusic" || activeService === "youtubeMusic") {
      const playingSource = String(localAudioPlayer.getSnapshot().track?.sourceKey ?? "localMusic");
      if (playingSource !== activeService) localAudioPlayer.stop();
      const saved = getSavedSourceVolume(sourceVolumeStorageKey(activeService), localAudioPlayer.getSnapshot().volume);
      volumeValueRef.current = saved;
      setAppVolume(saved);
      setVolumeReady(true);
      void localAudioPlayer.initialize().then(() => localAudioPlayer.setVolume(saved));
    }
    else localAudioPlayer.stop();

    void python.setActiveService(activeService).then(() => {
      if (cancelled) return;
      setMediaVisible(true);
      sourceRefreshTimersRef.current = [0, 220, 650, 1400, 2800].map((delay) =>
        window.setTimeout(() => {
          if (!cancelled) void refresh(true);
        }, delay),
      );
    }).catch(() => {
      if (!cancelled) {
        setMediaVisible(true);
        setLoading(false);
        void refresh(true);
      }
    });

    return () => {
      cancelled = true;
      sourceRefreshTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      sourceRefreshTimersRef.current = [];
    };
  }, [activeServiceKey, activeServiceReady]);

  const mediaKey = `${current?.id ?? ""}|${current?.title ?? ""}|${current?.artist ?? ""}|${current?.album ?? ""}`;
  const spotifyApiActive = activeServiceKey === "spotify" && spotifySettingsReady && spotifyPlus.enabled && spotifyPlus.authenticated;
  const spotifyPaused = spotifyApiActive && spotifyApiStatus.active;
  const stableMediaKey = spotifyPaused ? "spotify-api-paused" : mediaKey;
  const spotifyCoverActive = spotifyApiActive && !spotifyPaused;
  const localCoverActive = (activeServiceKey === "localMusic" || activeServiceKey === "youtubeMusic") && Boolean(current?.title);

  useEffect(() => {
    const syncSharedSpotifyPlayback = (event: Event) => {
      if (!spotifyApiActive) return;
      const detail = event instanceof CustomEvent ? event.detail : null;
      const player = detail && typeof detail === "object" ? detail as PlayerSnapshot : null;
      if (!player) {
        spotifyPlaybackCacheRef.current = { ...spotifyPlaybackCacheRef.current, at: 0 };
        return;
      }
      const now = getSharedSpotifyPlaybackTimestamp() || Date.now();
      spotifyPlaybackCacheRef.current = { at: now, player: { ...player }, lastValidAt: now };
      setSnapshot({ selectedPlayer: player.id, currentPlayer: player.id, selected: { ...player }, players: [{ ...player }] });
      setSnapshotAt(now);
    };
    window.addEventListener(SPOTIFY_PLAYBACK_CHANGED_EVENT, syncSharedSpotifyPlayback);
    return () => window.removeEventListener(SPOTIFY_PLAYBACK_CHANGED_EVENT, syncSharedSpotifyPlayback);
  }, [spotifyApiActive]);

  async function refresh(force = false) {
    if (refreshingRef.current) return;

    refreshingRef.current = true;
    try {
      if (activeServiceKey === "localMusic" || activeServiceKey === "youtubeMusic") {
        const local = localAudioPlayer.getSnapshot();
        // Local music and YouTube Music share the same in-browser player, so the
        // held track can belong to the other source. Ignore it unless its
        // sourceKey matches the active service, otherwise returning to Your Music
        // shows the last YouTube Music song (and vice-versa).
        const rawTrack = local.track;
        const track = rawTrack && String(rawTrack.sourceKey ?? "localMusic") === activeServiceKey ? rawTrack : null;
        const artist = Array.isArray(track?.artists) ? track.artists.map((value: any) => value?.name).filter(Boolean).join(", ") : "";
        const images = Array.isArray(track?.images) && track.images.length ? track.images : track?.album?.images;
        const artworkUrl = Array.isArray(images) ? String(images[images.length - 1]?.url ?? "") : "";
        const player: PlayerSnapshot | null = track ? {
          id: activeServiceKey,
          name: activeServiceKey === "youtubeMusic" ? "YouTube Music" : t.localMusicLabel,
          title: String(track?.name ?? ""),
          artist,
          album: String(track?.album?.name ?? ""),
          status: local.status,
          length: Number(local.length || track?.duration_ms || 0),
          position: Number(local.position || 0),
          canNext: local.canNext,
          canPrevious: local.canPrevious,
          canPlay: true,
          canPause: true,
          canTogglePlayPause: true,
          isSelected: true,
          isCurrent: true,
          canShuffle: true,
          canRepeat: true,
          shuffleActive: local.shuffleActive,
          repeatMode: local.repeatMode === "All" ? "List" : local.repeatMode === "One" ? "Track" : "Off",
          artworkUrl,
        } : null;
        const nextSnapshot: Snapshot = { selectedPlayer: player?.id ?? "", currentPlayer: player?.id ?? "", selected: player, players: player ? [player] : [] };
        const sampledAt = Date.now();
        if (snapshotNeedsRender(snapshotRef.current, nextSnapshot, snapshotAtRef.current, sampledAt)) {
          snapshotRef.current = nextSnapshot;
          snapshotAtRef.current = sampledAt;
          setSnapshot(nextSnapshot);
          setSnapshotAt(sampledAt);
        }
      } else if (spotifyApiActive) {
        if (spotifyApiPausedRef.current) {
          const paused = spotifyPausedPlayer(spotifyT);
          setSnapshot({ selectedPlayer: paused.id, currentPlayer: paused.id, selected: paused, players: [paused] });
          setSnapshotAt(Date.now());
          return;
        }
        const now = Date.now();
        const shouldFetch = force || now - spotifyPlaybackCacheRef.current.at >= 5000;
        if (!shouldFetch) return;

        try {
          const apiState = await python.spotifyGetPlaybackState();
          if (spotifyApiPausedRef.current) return;
          const apiPlayer = apiState?.ok ? spotifyPlaybackToPlayer(apiState.data) : null;
          const previous = spotifyPlaybackCacheRef.current;
          spotifyPlaybackCacheRef.current = apiPlayer
            ? { at: now, player: apiPlayer, lastValidAt: now }
            : { at: now, player: now - previous.lastValidAt <= 12000 ? previous.player : null, lastValidAt: previous.lastValidAt };

          if (apiPlayer) {
            // Publish a complete Spotify API payload atomically. Reusing the
            // cached payload between polls avoids resetting progress to an old
            // base position several times per second.
            setSnapshot({ selectedPlayer: apiPlayer.id, currentPlayer: apiPlayer.id, selected: apiPlayer, players: [apiPlayer] });
            setSnapshotAt(now);
            publishSpotifyPlaybackSnapshot(apiPlayer);
          } else if (!spotifyPlaybackCacheRef.current.player) {
            setSnapshot((previousSnapshot) => previousSnapshot.selected?.id === "spotify-api" ? emptySnapshot : previousSnapshot);
            setSnapshotAt(now);
          }
        } catch {
          // Retain the latest complete API payload. Windows MediaBridge must
          // never overwrite Spotify API metadata in API mode.
        }
      } else {
        const nextSnapshot = await python.getSnapshot();
        const sampledAt = Date.now();
        if (snapshotNeedsRender(snapshotRef.current, nextSnapshot, snapshotAtRef.current, sampledAt)) {
          snapshotRef.current = nextSnapshot;
          snapshotAtRef.current = sampledAt;
          setSnapshot(nextSnapshot);
          setSnapshotAt(sampledAt);
        }
      }
    } catch (error) {
      console.warn(t.refreshFailed, error);
    } finally {
      setLoading(false);
      refreshingRef.current = false;
    }
  }
  function patchCurrentPlayer(update: (player: PlayerSnapshot) => PlayerSnapshot) {
    setSnapshot((previous) => {
      const targetId = previous.selected?.id ?? previous.players?.[0]?.id ?? "";
      if (!targetId) return previous;
      const players = previous.players.map((player) => player.id === targetId ? update(player) : player);
      const selected = previous.selected?.id === targetId
        ? update(previous.selected)
        : (players.find((player) => player.id === targetId) ?? previous.selected);
      if (isSpotifyApiActive && selected) publishSpotifyPlaybackSnapshot(selected);
      return { ...previous, selected, players };
    });
    setSnapshotAt(Date.now());
  }

  const isLocalMusicActive = enabledAppKeys[0] === "localMusic" || enabledAppKeys[0] === "youtubeMusic";
  const isSpotifyApiActive = spotifyApiActive;

  function previousAction(): Promise<unknown> {
    return isLocalMusicActive ? localAudioPlayer.command("previous") : isSpotifyApiActive ? python.spotifyPlayerCommand("previous") : python.previousTrack();
  }
  function playPauseAction(): Promise<unknown> {
    return isLocalMusicActive
      ? localAudioPlayer.command("play_pause")
      : isSpotifyApiActive
        ? python.spotifyPlayerCommand(current?.status === "Playing" ? "pause" : "play")
        : python.playPause();
  }
  function nextAction(): Promise<unknown> {
    return isLocalMusicActive ? localAudioPlayer.command("next") : isSpotifyApiActive ? python.spotifyPlayerCommand("next") : python.nextTrack();
  }
  function shuffleAction(): Promise<unknown> {
    return isLocalMusicActive ? localAudioPlayer.command("shuffle") : isSpotifyApiActive ? python.spotifyPlayerCommand("shuffle") : python.shuffle();
  }
  function repeatAction(): Promise<unknown> {
    return isLocalMusicActive ? localAudioPlayer.command("repeat") : isSpotifyApiActive ? python.spotifyPlayerCommand("repeat") : python.repeat();
  }

  async function runAction(
    action: () => Promise<unknown>,
    optimistic?: () => void,
    spotifyRefreshDelays: number[] = [260]
  ) {
    const blockUi = !isSpotifyApiActive;
    if (blockUi) setBusy(true);
    optimistic?.();

    const pending = action();
    const delays = isSpotifyApiActive ? spotifyRefreshDelays : isLocalMusicActive ? [30] : [45, 130, 320, 720, 1450];
    delays.forEach((delay) => {
      window.setTimeout(() => void refresh(true), delay);
    });

    try {
      await pending;
    } finally {
      if (blockUi) window.setTimeout(() => setBusy(false), 120);
    }
  }

  async function openMusicApp(app: MusicAppButton) {
    await runAction(app.open);
    [200, 700, 1500].forEach((delay) => window.setTimeout(() => {
      void python.isMusicAppRunning(app.key).then((running) => setActiveAppRunning(Boolean(running))).catch(() => {});
    }, delay));
  }

  async function closeMusicApp(app: MusicAppButton) {
    setBusy(true);
    try {
      await python.closeMusicApp(app.key);
      setActiveAppRunning(false);
      window.setTimeout(() => void refresh(true), 180);
    } finally {
      window.setTimeout(() => setBusy(false), 120);
    }
  }

  function toggleEnabledApp(key: MusicAppKey) {
    sourceInteractionAtRef.current = Date.now();
    if (key === "localMusic" || key === "youtubeMusic") {
      if (isLocalMusicActive && activeServiceKey !== key) localAudioPlayer.stop();
      void python.pauseExternalPlayback().catch(() => false);
    } else {
      localAudioPlayer.stop();
    }
    setEnabledAppKeys(() => {
      const next: MusicAppKey[] = [key];
      saveEnabledAppKeys(next);
      return next;
    });
  }

  function selectCoverSource(source: CoverSource) {
    void python.setCoverSource(source)
      .then((saved) => setCoverSource(saved))
      .catch(() => setCoverSource(source));
  }

  function selectFullscreenEffect(effect: FullscreenEffectKey) {
    setFullscreenEffect(effect);
    saveFullscreenEffect(effect);
  }

  async function openCurrentSpotifyAlbum() {
    if (enabledAppKeys[0] !== "spotify" || !spotifyPlus.enabled || !spotifyPlus.authenticated || !current) return;
    try {
      const result = await python.spotifyGetCurrentAlbum(
        current.title?.trim() ?? "",
        current.artist?.trim() ?? "",
        current.album?.trim() ?? ""
      );
      if (!result?.ok) throw new Error(result?.error || getTranslations("runtime").openCurrentSpotifyAlbumFailed);
      const albumItem = result.data?.album;
      const albumId = String(albumItem?.id ?? "");
      if (!albumId) throw new Error(getTranslations("runtime").currentSpotifyAlbumUnavailable);
      setSpotifyAlbumRequest({
        id: albumId,
        title: String(albumItem?.name ?? current.album ?? t.unknownAlbum),
        nonce: Date.now(),
      });
    } catch (error: any) {
      toaster.toast({
        title: "Spotify",
        body: localizeRuntimeMessage(error?.message ?? String(error)),
        duration: 3500,
      });
    }
  }

  async function openCurrentLocalAlbum() {
    if (enabledAppKeys[0] !== "localMusic") return;
    try {
      const track = localAudioPlayer.getSnapshot().track;
      const albumItem = track?.album;
      const albumId = String(albumItem?.id ?? "");
      if (!albumId) throw new Error(getTranslations("runtime").currentLocalAlbumUnavailable);
      setLocalAlbumRequest({
        id: albumId,
        title: String(albumItem?.name ?? current?.album ?? t.unknownAlbum),
        nonce: Date.now(),
      });
    } catch (error: any) {
      toaster.toast({
        title: t.localMusicLabel,
        body: localizeRuntimeMessage(error?.message ?? String(error)),
        duration: 3000,
      });
    }
  }

  useEffect(() => {
    let cancelled = false;
    python.getSpotifySettings()
      .then((settings) => {
        if (!cancelled) {
          setSpotifyPlus(settings);
          setSpotifySettingsReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setSpotifySettingsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!spotifyApiActive) {
      spotifyApiPausedRef.current = false;
      setSpotifyApiStatus({ active: false, remainingSeconds: 0, until: 0 });
      return;
    }
    let cancelled = false;
    const updateStatus = async () => {
      try {
        const status = await python.getSpotifyApiStatus();
        if (cancelled) return;
        const wasPaused = spotifyApiPausedRef.current;
        spotifyApiPausedRef.current = Boolean(status.active);
        setSpotifyApiStatus((previous) => (
          previous.active === status.active
          && previous.remainingSeconds === status.remainingSeconds
          && previous.until === status.until
            ? previous
            : status
        ));
        if (status.active && !wasPaused) {
          const paused = spotifyPausedPlayer(spotifyT);
          spotifyPlaybackCacheRef.current = { at: Date.now(), player: null, lastValidAt: 0 };
          setMediaVisible(true);
          setLoading(false);
          setSnapshot({ selectedPlayer: paused.id, currentPlayer: paused.id, selected: paused, players: [paused] });
          setSnapshotAt(Date.now());
        } else if (!status.active && wasPaused) {
          spotifyPlaybackCacheRef.current = { at: 0, player: null, lastValidAt: 0 };
          void refresh(true);
        }
      } catch {
        // This is a local status read; preserve the previous state on a transient RPC error.
      }
    };
    void updateStatus();
    const timer = window.setInterval(() => void updateStatus(), 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [spotifyApiActive]);

  useEffect(() => {
    if (!spotifySettingsReady && activeServiceKey === "spotify") return;
    let cancelled = false;
    volumeApplyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    volumeApplyTimersRef.current = [];
    volumeAppliedRef.current = false;

    const fallback = isLocalMusicActive ? localAudioPlayer.getSnapshot().volume : 100;
    const saved = getSavedSourceVolume(sourceVolumeStorageKey(activeServiceKey), fallback);
    volumeValueRef.current = saved;
    setAppVolume(saved);
    setVolumeReady(isLocalMusicActive);

    const initializeVolume = async () => {
      if (cancelled) return;
      try {
        if (isLocalMusicActive) {
          await localAudioPlayer.initialize();
          if (cancelled) return;
          localAudioPlayer.setVolume(volumeValueRef.current);
          volumeAppliedRef.current = true;
          setVolumeReady(true);
          return;
        }
        const startedAt = Date.now();
        const result = await python.getAppVolume(activeServiceKey);
        if (cancelled || volumeInteractionAtRef.current > startedAt) return;
        if (result?.ok) {
          const actual = clamp(result.volume, 0, 100);
          volumeValueRef.current = actual;
          setAppVolume(actual);
          saveSourceVolume(sourceVolumeStorageKey(activeServiceKey), actual, "observed");
          volumeAppliedRef.current = true;
          setVolumeReady(true);
          return;
        }
      } catch {
        // The player may still be creating its Windows audio session.
      }

      if (cancelled || (spotifyApiActive && spotifyApiPausedRef.current)) return;
      try {
        const applied = await python.setAppVolume(volumeValueRef.current, activeServiceKey);
        if (!cancelled && applied?.ok && !applied.stale) {
          volumeAppliedRef.current = true;
          setVolumeReady(true);
        }
      } catch {
        if (!cancelled) setVolumeReady(false);
      }
    };

    const delays = isLocalMusicActive
      ? [0]
      : [0, 1400, 4200];
    volumeApplyTimersRef.current = delays.map((delay) => window.setTimeout(() => void initializeVolume(), delay));

    return () => {
      cancelled = true;
      volumeApplyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      volumeApplyTimersRef.current = [];
    };
  }, [activeServiceKey, isLocalMusicActive, spotifyApiActive, spotifySettingsReady]);

  useEffect(() => {
    if (!isLocalMusicActive) return;
    return localAudioPlayer.subscribe(() => {
      void refresh(true);
    });
  }, [activeServiceKey, isLocalMusicActive]);

  useEffect(() => {
    const syncVolume = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null;
      if (!detail || String(detail.source || "") !== sourceVolumeStorageKey(activeServiceKey)) return;
      const next = clamp(Number(detail.volume), 0, 100);
      if (detail.origin !== "observed") volumeInteractionAtRef.current = Date.now();
      volumeValueRef.current = next;
      setAppVolume(next);
      setVolumeReady(true);
    };
    window.addEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
    return () => window.removeEventListener(SOURCE_VOLUME_CHANGED_EVENT, syncVolume);
  }, [activeServiceKey]);

  useEffect(() => {
    let cancelled = false;
    python.getCoverSource()
      .then((source) => {
        if (!cancelled) setCoverSource(source === "windows" ? "windows" : "online");
      })
      .catch(() => {
        if (!cancelled) setCoverSource("online");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void refresh(true);

    const timer = window.setInterval(() => {
      void refresh(false);
    }, 900);

    return () => window.clearInterval(timer);
  }, [activeServiceKey]);

  useEffect(() => {
    let cancelled = false;
    const refreshVolume = async () => {
      if (!volumeAppliedRef.current) return;
      if (volumeCommitTimerRef.current || volumeCommitInFlightRef.current) return;
      if (Date.now() - volumeInteractionAtRef.current < 800) return;
      const startedAt = Date.now();
      try {
        const result = isLocalMusicActive
          ? { ok: true, volume: localAudioPlayer.getSnapshot().volume }
          : await python.getAppVolume(activeServiceKey);
        const userChangedVolumeWhileReading = volumeInteractionAtRef.current > startedAt;
        if (!cancelled && result?.ok && !userChangedVolumeWhileReading) {
          const next = clamp(result.volume, 0, 100);
          const displayed = volumeValueRef.current;
          const differs = Math.abs(next - displayed) > 2;
          if (result.origin !== "spotify-connect" && differs && Date.now() - volumeInteractionAtRef.current < 15000) {
            if (!volumeCommitInFlightRef.current && !volumeCommitTimerRef.current) {
              volumeCommitRetryRef.current = 0;
              volumeCommitTimerRef.current = window.setTimeout(() => {
                volumeCommitTimerRef.current = 0;
                flushAppVolumeCommit();
              }, 80);
            }
            return;
          }
          if (differs) {
            const observed = volumeObservedRef.current;
            volumeObservedRef.current = observed.value === next
              ? { value: next, count: observed.count + 1 }
              : { value: next, count: 1 };
            // A newly-created Windows/Connect session can briefly report 100.
            // Accept an external change only after two matching observations;
            // plugin-originated changes arrive immediately through the shared event.
            if (volumeObservedRef.current.count < 2) return;
          } else {
            volumeObservedRef.current = { value: next, count: 0 };
          }
          volumeValueRef.current = next;
          setAppVolume(next);
          setVolumeReady(true);
          saveSourceVolume(sourceVolumeStorageKey(activeServiceKey), next, "observed");
        }
      } catch {
        if (!cancelled && volumeInteractionAtRef.current <= startedAt) setVolumeReady(false);
      }
    };

    const initialTimer = window.setTimeout(() => void refreshVolume(), 5200);
    const timer = window.setInterval(() => void refreshVolume(), 5000);
    return () => {
      cancelled = true;
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [activeServiceKey, isLocalMusicActive, isSpotifyApiActive]);

  function flushAppVolumeCommit() {
    if (volumeCommitInFlightRef.current) {
      volumeCommitQueuedRef.current = true;
      return;
    }

    const requested = volumeValueRef.current;
    volumeCommitQueuedRef.current = false;
    volumeCommitInFlightRef.current = true;

    const pendingVolume = isLocalMusicActive
      ? Promise.resolve({ ok: true, volume: localAudioPlayer.setVolume(requested).volume })
      : python.setAppVolume(requested, activeServiceKey);

    void pendingVolume
      .then((result) => {
        if (!result?.ok) {
          setVolumeReady(false);
          return;
        }
        if ("stale" in result && result.stale) return;

        volumeAppliedRef.current = true;
        setVolumeReady(true);
        // Do not snap the thumb backwards if a newer key/gamepad repeat arrived
        // while the previous source-volume request was still being applied.
        if (volumeValueRef.current === requested) {
          const confirmed = clamp(result.volume, 0, 100);
          // Some Windows audio sessions briefly report their creation default
          // (100) while the requested value is already being applied. Never
          // feed that transient value back into the renderer or the UI.
          if (Math.abs(confirmed - requested) <= 2) {
            volumeCommitRetryRef.current = 0;
            volumeValueRef.current = confirmed;
            setAppVolume(confirmed);
          } else if (volumeCommitRetryRef.current < 3) {
            volumeCommitRetryRef.current += 1;
            volumeCommitQueuedRef.current = true;
          }
        }
      })
      .catch(() => setVolumeReady(false))
      .finally(() => {
        volumeCommitInFlightRef.current = false;
        if (volumeCommitQueuedRef.current || volumeValueRef.current !== requested) {
          volumeCommitQueuedRef.current = false;
          volumeCommitTimerRef.current = window.setTimeout(() => {
            volumeCommitTimerRef.current = 0;
            flushAppVolumeCommit();
          }, 80);
        }
      });
  }

  function changeAppVolume(nextVolume: number) {
    const next = clamp(Math.round(nextVolume), 0, 100);
    volumeValueRef.current = next;
    volumeInteractionAtRef.current = Date.now();
    volumeObservedRef.current = { value: next, count: 0 };
    volumeCommitRetryRef.current = 0;
    setAppVolume(next);
    setVolumeReady(true);
    saveSourceVolume(sourceVolumeStorageKey(activeServiceKey), next);

    if (volumeCommitInFlightRef.current) {
      volumeCommitQueuedRef.current = true;
      return;
    }

    if (volumeCommitTimerRef.current) window.clearTimeout(volumeCommitTimerRef.current);
    volumeCommitTimerRef.current = window.setTimeout(() => {
      volumeCommitTimerRef.current = 0;
      flushAppVolumeCommit();
    }, 35);
  }

  function nudgeAppVolume(delta: number) {
    changeAppVolume(volumeValueRef.current + delta);
  }

  function handleVolumeKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    const direction = directionFromKey(event.key);
    if (!direction) return;
    event.preventDefault();
    event.stopPropagation();
    nudgeAppVolume(direction === "right" ? 1 : -1);
  }

  function handleVolumeButtonDown(event: any) {
    const direction = directionFromGamepadButton(event?.detail?.button);
    if (!direction) return;
    event.preventDefault?.();
    event.stopPropagation?.();
    nudgeAppVolume(direction === "right" ? 1 : -1);
  }

  useEffect(() => {
    return () => {
      if (volumeCommitTimerRef.current) window.clearTimeout(volumeCommitTimerRef.current);
    };
  }, []);

  function handleSettingsBack() {
    setShowSettings(false);
    setLoading(true);
    setMediaVisible(false);
    window.setTimeout(() => {
      void refresh(true);
      setMediaVisible(true);
    }, 0);
  }
  useEffect(() => {
    // Keep the current media fully visible while the next artwork is preloaded.
    // Toggling opacity here caused repeated flashes as metadata and cover
    // responses completed at slightly different times.
    if (!mediaKeyRef.current) {
      mediaKeyRef.current = stableMediaKey;
      setMediaVisible(true);
      return;
    }

    if (mediaKeyRef.current === stableMediaKey) return;

    mediaKeyRef.current = stableMediaKey;
    setMediaVisible(true);
  }, [stableMediaKey]);

  useEffect(() => {
    const title = current?.title?.trim() ?? "";
    const artist = current?.artist?.trim() ?? "";
    const album = current?.album?.trim() ?? "";
    const activeService = activeServiceKey;
    const key = `${activeService}|${title.toLocaleLowerCase()}|${artist.toLocaleLowerCase()}`;

    if (!title) {
      coverRequestRef.current += 1;
      setCoverResolving(false);
      if (!coverClearTimerRef.current) {
        coverClearTimerRef.current = window.setTimeout(() => {
          coverClearTimerRef.current = 0;
          coverUrlRef.current = "";
          coverIdentityRef.current = "";
          setCoverUrl("");
        }, 1800);
      }
      return;
    }
    if (coverClearTimerRef.current) {
      window.clearTimeout(coverClearTimerRef.current);
      coverClearTimerRef.current = 0;
    }

    // Playback status, progress, shuffle, repeat, volume and late album metadata
    // must never reload the artwork for the same visible track.
    if (coverIdentityRef.current === key && coverUrlRef.current) {
      setCoverResolving(false);
      return;
    }

    const immediateArtwork = String(current?.artworkUrl ?? "");
    const requestId = coverRequestRef.current + 1;
    coverRequestRef.current = requestId;
    let cancelled = false;

    const commitPreloadedCover = (url: string) => {
      if (!url || (coverIdentityRef.current === key && url === coverUrlRef.current)) {
        setCoverResolving(false);
        return;
      }
      setCoverResolving(true);
      const image = new Image();
      image.onload = () => {
        if (cancelled || requestId !== coverRequestRef.current) return;
        if (coverCacheRef.current.has(key)) coverCacheRef.current.delete(key);
        coverCacheRef.current.set(key, url);
        while (coverCacheRef.current.size > 160) {
          const oldest = coverCacheRef.current.keys().next().value;
          if (oldest === undefined) break;
          coverCacheRef.current.delete(oldest);
        }
        coverUrlRef.current = url;
        coverIdentityRef.current = key;
        setCoverUrl(url);
        setCoverResolving(false);
      };
      image.onerror = () => {
        if (!cancelled && requestId === coverRequestRef.current) setCoverResolving(false);
      };
      image.src = url;
    };

    if (spotifyCoverActive && immediateArtwork) {
      commitPreloadedCover(immediateArtwork);
      return () => { cancelled = true; };
    }

    const cached = coverCacheRef.current.get(key);
    if (cached) {
      setCoverResolving(false);
      coverUrlRef.current = cached;
      coverIdentityRef.current = key;
      setCoverUrl(cached);
      return;
    }

    setCoverResolving(true);

    (async () => {
      try {
        const localTrack = isLocalMusicActive ? localAudioPlayer.getSnapshot().track : null;
        const images = Array.isArray(localTrack?.images) && localTrack.images.length ? localTrack.images : localTrack?.album?.images;
        const directImage = Array.isArray(images) ? String(images[images.length - 1]?.url ?? "") : "";
        const url = directImage || (localTrack?.coverId
          ? await python.getLocalMusicCover(String(localTrack.coverId))
          : await python.getCoverForService(activeService, title, artist, album));
        if (cancelled || requestId !== coverRequestRef.current) return;
        if (!url) {
          setCoverResolving(false);
          return;
        }
        commitPreloadedCover(url);
      } catch (error) {
        if (!cancelled) {
          setCoverResolving(false);
          console.warn(t.coverFailed, error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [current?.title, current?.artist, current?.album, current?.artworkUrl, coverSource, spotifyCoverActive, activeServiceKey, isLocalMusicActive, t.coverFailed]);

  useEffect(() => () => {
    if (coverClearTimerRef.current) window.clearTimeout(coverClearTimerRef.current);
  }, []);

  useLayoutEffect(() => {
    const root = qamRootRef.current;
    const volume = volumeWrapperRef.current;
    if (!root || !volume) return;

    let frame = 0;
    const update = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rootRect = root.getBoundingClientRect();
        const volumeRect = volume.getBoundingClientRect();
        setBottomGlowFadeTop(Math.max(0, Math.round(volumeRect.top - rootRect.top - 4)));
      });
    };

    update();
    window.addEventListener("resize", update);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(root);
    observer?.observe(volume);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [coverUrl, current?.title, snapshot.players.length, enabledApps.length]);

  const title = current?.title?.trim() ? current.title : t.notPlaying;
  const artist = current?.artist?.trim() ? current.artist : " ";
  const album = spotifyPaused
    ? formatTime(Math.max(0, Number(spotifyApiStatus.remainingSeconds || 0)) * 1000)
    : current?.album?.trim() ? current.album : " ";
  const isPlaying = current?.status === "Playing";
  const isShuffleActive = current?.shuffleActive === true;
  const repeatMode = current?.repeatMode || "None";
  const repeatActive = !["", "None", "Off"].includes(repeatMode);
  const controlsDisabled = loading || spotifyPaused;
  const mediaTransitionStyle: CSSProperties = {
    opacity: mediaVisible ? 1 : 0.28,
    transform: mediaVisible ? "translateY(0)" : "translateY(2px)",
    transition: "opacity 160ms ease, transform 160ms ease",
  };

  if (showSettings) {
    return (
      <SettingsView
        enabledAppKeys={enabledAppKeys}
        coverSource={coverSource}
        fullscreenEffect={fullscreenEffect}
        onBack={handleSettingsBack}
        onSelectCoverSource={selectCoverSource}
        onSelectFullscreenEffect={selectFullscreenEffect}
        onToggleApp={toggleEnabledApp}
        onSpotifySettingsChanged={setSpotifyPlus}
      />
    );
  }

  return (
    <PanelSection>
        <style>{`
        @keyframes inRiproduzioneMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(var(--np-marq, 0px)); }
        }
        @keyframes npQamHaloSpin {
          from { transform: translate3d(-50%, -50%, 0) rotate(0deg); }
          to { transform: translate3d(-50%, -50%, 0) rotate(360deg); }
        }
        .npQamGlowLayer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: visible;
          pointer-events: none;
        }
        .npQamGlowAnchor {
          position: absolute;
          left: 50%;
          top: 6px;
          width: 80%;
          aspect-ratio: 1 / 1;
          transform: translateX(-50%);
          overflow: visible;
        }
        .npQamCoverHalo {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 439%;
          height: 439%;
          border-radius: 999px;
          overflow: hidden;
          transform: translate3d(-50%, -50%, 0);
          transform-origin: 50% 50%;
          transition: opacity 520ms ease;
          animation: npQamHaloSpin 32s linear infinite;
          will-change: transform, opacity;
          -webkit-mask-image: radial-gradient(circle, #000 0%, #000 31%, rgba(0,0,0,0.84) 47%, rgba(0,0,0,0.38) 61%, transparent 76%, transparent 100%);
          mask-image: radial-gradient(circle, #000 0%, #000 31%, rgba(0,0,0,0.84) 47%, rgba(0,0,0,0.38) 61%, transparent 76%, transparent 100%);
        }
        .npQamCoverHalo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          border-radius: inherit;
          filter: blur(58px) saturate(1.68);
          transform: scale(1.06);
        }
        .npQamGlowVeil {
          pointer-events: none;
          z-index: 1;
        }
        .npQamGlowVeilTop {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          height: 220px;
          background: linear-gradient(180deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.88) 42%, rgba(0,0,0,0.48) 68%, rgba(0,0,0,0) 100%);
        }
        .npQamGlowVeilBottom {
          position: absolute;
          left: -32px;
          right: -32px;
          bottom: -220px;
          min-height: 420px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.48) 62px, rgba(0,0,0,0.9) 132px, #000 210px, #000 100%);
        }
        .npAlbumCoverButton {
          transition: transform 140ms ease, filter 140ms ease;
        }
        .npAlbumCoverButton .npAlbumCoverArtwork {
          transition: box-shadow 140ms ease, outline-color 140ms ease;
          outline: 2px solid transparent;
          outline-offset: 3px;
        }
        .npAlbumCoverButton:focus,
        .npAlbumCoverButton.gpfocus {
          transform: scale(1.012);
          filter: drop-shadow(0 0 10px color-mix(in srgb, var(--np-accent, #1DB954) 32%, transparent));
        }
        .npAlbumCoverButton:focus .npAlbumCoverArtwork,
        .npAlbumCoverButton.gpfocus .npAlbumCoverArtwork {
          outline-color: color-mix(in srgb, var(--np-accent, #1DB954) 78%, white 8%);
          box-shadow: 0 14px 38px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in srgb, var(--np-accent, #1DB954) 42%, transparent);
        }
        .npAppVolume {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 78px minmax(0, 1fr) 42px;
          align-items: center;
          gap: 8px;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 6px 8px;
          border-radius: 6px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.86em;
          line-height: 1.15;
          outline: none;
          overflow: hidden;
        }
        .npAppVolume.npAppVolumeFocused,
        .npAppVolume:focus-visible {
          border-color: color-mix(in srgb, var(--np-accent, #66c0f4) 62%, transparent);
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--np-accent, #66c0f4) 20%, transparent), 0 0 18px color-mix(in srgb, var(--np-accent, #66c0f4) 22%, transparent);
        }
        .npAppVolume span,
        .npAppVolume strong {
          min-width: 0;
          font-size: 1em;
          line-height: 1.15;
          font-weight: 500;
        }
        .npAppVolume strong {
          text-align: right;
          font-weight: 700;
        }
        .npAppVolume input[type="range"] {
          min-width: 0;
          width: 100%;
          height: 18px;
          margin: 0;
          padding: 0;
          accent-color: var(--np-accent, #66c0f4);
        }
        .npAppVolume input[type="range"]::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
        }
        .npAppVolume input[type="range"]::-webkit-slider-thumb {
          width: 14px;
          height: 14px;
          margin-top: -4px;
          border-radius: 999px;
        }
      `}</style>
      <PanelSectionRow>
        <div
          ref={qamRootRef}
          style={{ ...qamCenterRowStyle, ["--np-accent" as any]: accentForKey(enabledAppKeys[0]) }}
        >
          <QamGlowLayer artUrl={coverUrl || coverUrlRef.current} playing={isPlaying} bottomFadeTop={bottomGlowFadeTop} />
          <div style={{ ...centeredColumnStyle, position: "relative", zIndex: 3 }}>
            <div style={mediaTransitionStyle}>
              <CoverBox
                artUrl={coverUrl}
                placeholderIcon={spotifyPaused ? <FaClock size={88} style={{ opacity: 0.88 }} /> : undefined}
                showPlaceholder={!coverResolving || spotifyPaused}
                ariaLabel={t.openCurrentAlbum}
                onActivate={spotifyPaused ? undefined : spotifyCoverActive
                  ? () => void openCurrentSpotifyAlbum()
                  : localCoverActive
                    ? () => void openCurrentLocalAlbum()
                    : undefined}
              />

              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "14px",
                }}
              >
                <ScrollingText
                  text={title}
                  style={{
                    color: useDarkCoverMetadata ? "#1A1A1A" : undefined,
                    fontSize: "1.08em",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginBottom: "6px",
                  }}
                />

                <ScrollingText
                  text={artist}
                  style={{
                    color: useDarkCoverMetadata ? "#1A1A1A" : undefined,
                    opacity: 0.84,
                    lineHeight: 1.2,
                    marginBottom: "4px",
                  }}
                />

                <ScrollingText
                  text={album}
                  style={{
                    color: useDarkCoverMetadata ? "#1A1A1A" : undefined,
                    opacity: 0.62,
                    fontSize: "0.9em",
                    lineHeight: 1.2,
                  }}
                />
              </div>
            </div>

            {spotifyPaused ? null : <ProgressView current={current} snapshotAt={snapshotAt} />}

            <div style={{ height: "14px" }} />

            <Focusable style={controlsWrapStyle} flow-children="horizontal">
              <DialogButton
                style={compactButtonStyle}
                disabled={controlsDisabled || !current?.canPrevious}
                onClick={() => void runAction(() => previousAction())}
              >
                <FaStepBackward />
              </DialogButton>

              <DialogButton
                style={compactButtonStyle}
                disabled={controlsDisabled || !current}
                onClick={() => void runAction(
                  () => playPauseAction(),
                  () => patchCurrentPlayer((player) => ({
                    ...player,
                    status: player.status === "Playing" ? "Paused" : "Playing",
                  }))
                )}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </DialogButton>

              <DialogButton
                style={compactButtonStyle}
                disabled={controlsDisabled || !current?.canNext}
                onClick={() => void runAction(() => nextAction())}
              >
                <FaStepForward />
              </DialogButton>
            </Focusable>

            <div style={{ height: "8px" }} />

            <Focusable style={controlsWrapStyle} flow-children="horizontal">
              <DialogButton
                style={{ ...compactButtonStyle, position: "relative", opacity: isShuffleActive ? 1 : 0.58 }}
                disabled={controlsDisabled || !current?.canShuffle}
                onClick={() => void runAction(
                  () => shuffleAction(),
                  () => patchCurrentPlayer((player) => ({ ...player, shuffleActive: !player.shuffleActive })),
                  [1200]
                )}
              >
                <FaRandom />
                {isShuffleActive ? (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "var(--np-accent, #66c0f4)",
                      boxShadow: "0 0 5px var(--np-accent, #66c0f4)",
                      pointerEvents: "none",
                    }}
                  />
                ) : null}
              </DialogButton>

              <DialogButton
                style={{ ...compactButtonStyle, position: "relative", opacity: repeatActive ? 1 : 0.58 }}
                disabled={controlsDisabled || !current?.canRepeat}
                onClick={() => void runAction(
                  () => repeatAction(),
                  () => patchCurrentPlayer((player) => ({
                    ...player,
                    repeatMode: player.repeatMode === "Off"
                      ? "List"
                      : player.repeatMode === "List"
                        ? "Track"
                        : "Off",
                  })),
                  [1200]
                )}
              >
                <RepeatIcon repeatMode={repeatMode} />
                {repeatActive ? (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "var(--np-accent, #66c0f4)",
                      boxShadow: "0 0 5px var(--np-accent, #66c0f4)",
                      pointerEvents: "none",
                    }}
                  />
                ) : null}
              </DialogButton>
            </Focusable>

            <div style={{ height: "8px" }} />
            <Focusable
              ref={volumeWrapperRef as any}
              className="npAppVolume"
              focusClassName="npAppVolumeFocused"
              noFocusRing
              onActivate={() => undefined}
              onButtonDown={handleVolumeButtonDown}
              onKeyDown={handleVolumeKeyDown}
              role="slider"
              tabIndex={0}
              aria-label={t.volume}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(appVolume)}
              style={{ opacity: current && volumeReady ? 1 : 0.46 }}
            >
              <span>{t.volume}</span>
              <input
                type="range"
                value={Math.round(appVolume)}
                min={0}
                max={100}
                step={1}
                disabled={!current || spotifyPaused}
                tabIndex={-1}
                onChange={(event) => changeAppVolume(Number(event.currentTarget.value))}
              />
              <strong>{Math.round(appVolume)}%</strong>
            </Focusable>

            {snapshot.players.length > 1 ? (
              <>
                <div style={{ height: "14px" }} />
                <Focusable flow-children="vertical" style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                  {snapshot.players.map((player) => (
                    <DialogButton
                      key={player.id}
                      style={wideButtonStyle}
                      disabled={busy}
                      onClick={() =>
                        void runAction(async () => {
                          await python.setMediaPlayer(player.id);
                        })
                      }
                    >
                      <span style={buttonContentStyle}>
                        {(player.id === snapshot.selectedPlayer ? "\u2022 " : "") + player.name}
                      </span>
                    </DialogButton>
                  ))}
                </Focusable>
              </>
            ) : null}
            <div style={{ height: "10px" }} />

            <Focusable style={controlsWrapStyle} flow-children="horizontal">
              <DialogButton
                style={splitWideButtonStyle}
                onClick={navigateToFullscreen}
              >
                <FaExpandAlt />
              </DialogButton>

              <DialogButton
                style={splitWideButtonStyle}
                onClick={() => setShowSettings(true)}
              >
                <FaCog />
              </DialogButton>
            </Focusable>

            {enabledAppKeys[0] === "spotify" && spotifyPlus.enabled && spotifyPlus.authenticated ? (
              <>
                <div style={{ height: "10px" }} />
                <SpotifyBrowser openAlbumRequest={spotifyAlbumRequest} onOpenBigPicture={navigateToSpotifyBigPicture} onOpenSettings={() => setShowSettings(true)} />
              </>
            ) : null}

            {enabledAppKeys[0] === "localMusic" ? (
              <>
                <div style={{ height: "10px" }} />
                <LocalMusicBrowser openAlbumRequest={localAlbumRequest} onOpenBigPicture={navigateToLocalMusicBigPicture} />
              </>
            ) : null}

            {enabledAppKeys[0] === "youtubeMusic" ? (
              <>
                <div style={{ height: "10px" }} />
                <YouTubeMusicBrowser onOpenBigPicture={navigateToYouTubeMusicBigPicture} onOpenSettings={() => setShowSettings(true)} />
              </>
            ) : null}

            {enabledApps.length > 0 ? (
              <>
                <div style={{ height: "6px" }} />

                <Focusable style={{ ...centeredColumnStyle, gap: "6px" }} flow-children="vertical">
                  {enabledApps.filter((app) => app.key !== "localMusic" && app.key !== "spotify" && app.key !== "youtubeMusic").map((app) => {
                    const Icon = app.Icon;

                    return (
                      <DialogButton
                        key={app.key}
                        style={wideButtonStyle}
                        disabled={busy}
                        onClick={() => void (activeAppRunning ? closeMusicApp(app) : openMusicApp(app))}
                      >
                        <span style={buttonContentStyle}>
                          <Icon />
                          {formatOpenAppLabel(activeAppRunning ? t.closeApp : t.openApp, appProgramLabel(app))}
                        </span>
                      </DialogButton>
                    );
                  })}
                </Focusable>
              </>
            ) : null}
          </div>
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
}

function NowPlayingTitle() {
  const [key, setKey] = useState<string>(loadEnabledAppKeys()[0]);
  useEffect(() => {
    const syncSource = (event?: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : undefined;
      const next = detail ? normalizeEnabledAppKeys(detail)[0] : loadEnabledAppKeys()[0];
      setKey((previous) => previous === next ? previous : next);
    };
    window.addEventListener(APP_SETTINGS_CHANGED_EVENT, syncSource);
    window.addEventListener("focus", syncSource);
    return () => {
      window.removeEventListener(APP_SETTINGS_CHANGED_EVENT, syncSource);
      window.removeEventListener("focus", syncSource);
    };
  }, []);
  const app = musicApps.find((a) => a.key === key);
  const Icon = app?.Icon ?? FaMusic;
  const t = resolveTranslations();
  const label = app ? appDisplayLabel(app, t) : "Now Playing";
  return (
    <div
      aria-label={label}
      title={label}
      style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%", minWidth: "34px", height: "34px", marginLeft: "auto", paddingRight: "8px", boxSizing: "border-box" }}
    >
      <Icon size={20} style={{ display: "block", flexShrink: 0 }} />
    </div>
  );
}

export default definePlugin(() => {
  routerHook.addRoute(FULLSCREEN_ROUTE, FullscreenRoute);
  routerHook.addRoute(SPOTIFY_BIG_PICTURE_ROUTE, SpotifyBigPictureRoute);
  routerHook.addRoute(LOCAL_MUSIC_BIG_PICTURE_ROUTE, LocalMusicBigPictureRoute);
  routerHook.addRoute(YOUTUBE_MUSIC_BIG_PICTURE_ROUTE, YouTubeMusicBigPictureRoute);
  routerHook.addRoute(FULLSCREEN_SETTINGS_ROUTE, FullscreenSettingsRoute);

  return {
    name: "Now playing",
    titleView: <NowPlayingTitle />,
    content: <Content />,
    icon: <FaMusic />,
    onDismount() {
      publishPlaybackActivity(false, "Stopped", "", "", "");
      localAudioPlayer.destroy();
      routerHook.removeRoute(FULLSCREEN_ROUTE);
      routerHook.removeRoute(SPOTIFY_BIG_PICTURE_ROUTE);
      routerHook.removeRoute(LOCAL_MUSIC_BIG_PICTURE_ROUTE);
      routerHook.removeRoute(YOUTUBE_MUSIC_BIG_PICTURE_ROUTE);
      routerHook.removeRoute(FULLSCREEN_SETTINGS_ROUTE);
    },
  };
});
