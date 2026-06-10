import { definePlugin, routerHook } from "@decky/api";
import { DialogButton, Focusable, Navigation, PanelSection, PanelSectionRow, Router } from "@decky/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { FaAmazon, FaArrowLeft, FaCheck, FaCog, FaDeezer, FaExpandAlt, FaMusic, FaPause, FaPlay, FaRandom, FaRedoAlt, FaStepBackward, FaStepForward } from "react-icons/fa";
import { SiApplemusic, SiSoundcloud, SiSpotify, SiTidal } from "react-icons/si";
import * as python from "./python";
import type { PlayerSnapshot, Snapshot } from "./python";

const emptySnapshot: Snapshot = {
  selectedPlayer: "",
  currentPlayer: "",
  selected: null,
  players: [],
};

const BLOCK_WIDTH = 188;
const CONTROL_GAP = 8;
const BUTTON_HEIGHT = 28;
const APP_SETTINGS_KEY = "nowPlaying.enabledApps";
const FULLSCREEN_EFFECT_SETTINGS_KEY = "nowPlaying.fullscreenEffect";
const FULLSCREEN_ROUTE = "/now-playing/fullscreen";

const qamCenterRowStyle: CSSProperties = {
  width: "calc(100% - 28px)",
  margin: "0 auto",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
};

const centeredColumnStyle: CSSProperties = {
  width: `${BLOCK_WIDTH}px`,
  minWidth: `${BLOCK_WIDTH}px`,
  maxWidth: `${BLOCK_WIDTH}px`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflow: "hidden",
};

const controlsWrapStyle: CSSProperties = {
  width: `${BLOCK_WIDTH}px`,
  minWidth: `${BLOCK_WIDTH}px`,
  maxWidth: `${BLOCK_WIDTH}px`,
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
  width: `${BLOCK_WIDTH}px`,
  minWidth: `${BLOCK_WIDTH}px`,
  maxWidth: `${BLOCK_WIDTH}px`,
  height: `${BUTTON_HEIGHT}px`,
  minHeight: `${BUTTON_HEIGHT}px`,
  padding: 0,
  lineHeight: 1,
};

const iconButtonStyle: CSSProperties = {
  width: `${BUTTON_HEIGHT}px`,
  minWidth: `${BUTTON_HEIGHT}px`,
  maxWidth: `${BUTTON_HEIGHT}px`,
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

const headerRowStyle: CSSProperties = {
  width: `${BLOCK_WIDTH}px`,
  minWidth: `${BLOCK_WIDTH}px`,
  maxWidth: `${BLOCK_WIDTH}px`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "10px",
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
  width: `${BLOCK_WIDTH}px`,
  boxSizing: "border-box",
  padding: "0 4px",
  fontSize: "0.72em",
  fontWeight: 700,
  lineHeight: 1.2,
  opacity: 0.64,
};

const subtleRowTextStyle: CSSProperties = {
  width: `${BLOCK_WIDTH}px`,
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.72em",
  opacity: 0.66,
  marginTop: "3px",
};

const meterBoxStyle: CSSProperties = {
  width: `${BLOCK_WIDTH}px`,
  minWidth: `${BLOCK_WIDTH}px`,
  maxWidth: `${BLOCK_WIDTH}px`,
  boxSizing: "border-box",
  overflow: "hidden",
};

const meterTrackStyle: CSSProperties = {
  width: `${BLOCK_WIDTH}px`,
  minWidth: `${BLOCK_WIDTH}px`,
  maxWidth: `${BLOCK_WIDTH}px`,
  height: "6px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.18)",
  overflow: "hidden",
  boxSizing: "border-box",
};

const meterFillBaseStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "#66c0f4",
  transition: "width 160ms linear",
};

const marqueeShellStyle: CSSProperties = {
  width: `${BLOCK_WIDTH}px`,
  maxWidth: `${BLOCK_WIDTH}px`,
  overflow: "hidden",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
};

type Translation = {
  notPlaying: string;
  unknownArtist: string;
  unknownAlbum: string;
  openApp: string;
  refreshFailed: string;
  coverFailed: string;
  settingsApps?: string;
  settingsFullscreenEffect?: string;
  effectGlow?: string;
  effectOcean?: string;
  effectEnergySaver?: string;
};

const translations: Record<string, Translation> = {
  en: {
    notPlaying: "Not playing",
    unknownArtist: "Unknown artist",
    unknownAlbum: "Unknown album",
    openApp: "Open {app}",
    refreshFailed: "Now playing refresh failed",
    coverFailed: "cover fetch failed",
    settingsApps: "Apps",
    settingsFullscreenEffect: "Fullscreen effect",
    effectGlow: "Glow",
    effectOcean: "Ocean",
    effectEnergySaver: "Energy Saver",
  },
  it: {
    notPlaying: "Non in riproduzione",
    unknownArtist: "Artista sconosciuto",
    unknownAlbum: "Album sconosciuto",
    openApp: "Apri {app}",
    refreshFailed: "Aggiornamento Now playing non riuscito",
    coverFailed: "recupero copertina non riuscito",
    settingsApps: "App",
    settingsFullscreenEffect: "Effetto fullscreen",
    effectGlow: "Bagliore",
    effectOcean: "Oceano",
    effectEnergySaver: "Risparmio energia",
  },
  es: {
    notPlaying: "No se está reproduciendo",
    unknownArtist: "Artista desconocido",
    unknownAlbum: "Album desconocido",
    openApp: "Abrir {app}",
    refreshFailed: "No se pudo actualizar Now playing",
    coverFailed: "no se pudo cargar la carátula",
    settingsApps: "Apps",
    settingsFullscreenEffect: "Efecto de pantalla completa",
    effectGlow: "Resplandor",
    effectOcean: "Océano",
    effectEnergySaver: "Ahorro de energía",
  },
  fr: {
    notPlaying: "Aucune lecture",
    unknownArtist: "Artiste inconnu",
    unknownAlbum: "Album inconnu",
    openApp: "Ouvrir {app}",
    refreshFailed: "Échec de l'actualisation de Now playing",
    coverFailed: "échec du chargement de la pochette",
    settingsApps: "Apps",
    settingsFullscreenEffect: "Effet plein écran",
    effectGlow: "Lueur",
    effectOcean: "Océan",
    effectEnergySaver: "Économie d'énergie",
  },
  de: {
    notPlaying: "Keine Wiedergabe",
    unknownArtist: "Unbekannter Künstler",
    unknownAlbum: "Unbekanntes Album",
    openApp: "{app} öffnen",
    refreshFailed: "Now playing konnte nicht aktualisiert werden",
    coverFailed: "Cover konnte nicht geladen werden",
    settingsApps: "Apps",
    settingsFullscreenEffect: "Vollbildeffekt",
    effectGlow: "Leuchten",
    effectOcean: "Ozean",
    effectEnergySaver: "Energiesparen",
  },
  pt: {
    notPlaying: "Nada em reprodução",
    unknownArtist: "Artista desconhecido",
    unknownAlbum: "Álbum desconhecido",
    openApp: "Abrir {app}",
    refreshFailed: "Falha ao atualizar Now playing",
    coverFailed: "falha ao carregar a capa",
    settingsApps: "Aplicações",
    settingsFullscreenEffect: "Efeito em ecrã inteiro",
    effectGlow: "Brilho",
    effectOcean: "Oceano",
    effectEnergySaver: "Poupança de energia",
  },
  "pt-br": {
    notPlaying: "Nada tocando",
    unknownArtist: "Artista desconhecido",
    unknownAlbum: "Álbum desconhecido",
    openApp: "Abrir {app}",
    refreshFailed: "Falha ao atualizar Now playing",
    coverFailed: "falha ao carregar a capa",
    settingsApps: "Apps",
    settingsFullscreenEffect: "Efeito em tela cheia",
    effectGlow: "Brilho",
    effectOcean: "Oceano",
    effectEnergySaver: "Economia de energia",
  },
  nl: {
    notPlaying: "Niets wordt afgespeeld",
    unknownArtist: "Onbekende artiest",
    unknownAlbum: "Onbekend album",
    openApp: "{app} openen",
    refreshFailed: "Now playing vernieuwen mislukt",
    coverFailed: "hoes laden mislukt",
    settingsApps: "Apps",
    settingsFullscreenEffect: "Fullscreen-effect",
    effectGlow: "Gloed",
    effectOcean: "Oceaan",
    effectEnergySaver: "Energiebesparing",
  },
  sv: {
    notPlaying: "Spelar inget",
    unknownArtist: "Okand artist",
    unknownAlbum: "Okant album",
    openApp: "Oppna {app}",
    refreshFailed: "Now playing kunde inte uppdateras",
    coverFailed: "kunde inte hamta omslag",
  },
  no: {
    notPlaying: "Spiller ikke",
    unknownArtist: "Ukjent artist",
    unknownAlbum: "Ukjent album",
    openApp: "Apne {app}",
    refreshFailed: "Now playing kunne ikke oppdateres",
    coverFailed: "kunne ikke hente omslag",
  },
  da: {
    notPlaying: "Afspiller ikke",
    unknownArtist: "Ukendt kunstner",
    unknownAlbum: "Ukendt album",
    openApp: "Abn {app}",
    refreshFailed: "Now playing kunne ikke opdateres",
    coverFailed: "kunne ikke hente cover",
  },
  fi: {
    notPlaying: "Ei toistoa",
    unknownArtist: "Tuntematon artisti",
    unknownAlbum: "Tuntematon albumi",
    openApp: "Avaa {app}",
    refreshFailed: "Now playing -paivitys epaonnistui",
    coverFailed: "kannen haku epaonnistui",
  },
  pl: {
    notPlaying: "Nic nie jest odtwarzane",
    unknownArtist: "Nieznany wykonawca",
    unknownAlbum: "Nieznany album",
    openApp: "Otworz {app}",
    refreshFailed: "Nie udalo sie odswiezyc Now playing",
    coverFailed: "nie udalo sie pobrac okladki",
  },
  cs: {
    notPlaying: "Nic se neprehrava",
    unknownArtist: "Neznamy interpret",
    unknownAlbum: "Nezname album",
    openApp: "Otevrit {app}",
    refreshFailed: "Now playing se nepodarilo obnovit",
    coverFailed: "nepodarilo se nacist obal",
  },
  sk: {
    notPlaying: "Nic sa neprehrava",
    unknownArtist: "Neznamy interpret",
    unknownAlbum: "Neznamy album",
    openApp: "Otvorit {app}",
    refreshFailed: "Now playing sa nepodarilo obnovit",
    coverFailed: "nepodarilo sa nacitat obal",
  },
  hu: {
    notPlaying: "Nincs lejatszas",
    unknownArtist: "Ismeretlen eloado",
    unknownAlbum: "Ismeretlen album",
    openApp: "{app} megnyitasa",
    refreshFailed: "A Now playing frissitese sikertelen",
    coverFailed: "a borito betoltese sikertelen",
  },
  ro: {
    notPlaying: "Nu se reda nimic",
    unknownArtist: "Artist necunoscut",
    unknownAlbum: "Album necunoscut",
    openApp: "Deschide {app}",
    refreshFailed: "Actualizarea Now playing a esuat",
    coverFailed: "incarcarea copertii a esuat",
  },
  tr: {
    notPlaying: "Calmiyor",
    unknownArtist: "Bilinmeyen sanatci",
    unknownAlbum: "Bilinmeyen album",
    openApp: "{app} ac",
    refreshFailed: "Now playing yenilenemedi",
    coverFailed: "kapak yuklenemedi",
  },
  el: {
    notPlaying: "Δεν αναπαραγεται",
    unknownArtist: "Αγνωστος καλλιτεχνης",
    unknownAlbum: "Αγνωστο αλμπουμ",
    openApp: "Ανοιγμα {app}",
    refreshFailed: "Αποτυχια ανανεωσης Now playing",
    coverFailed: "αποτυχια φορτωσης εξωφυλλου",
  },
  ru: {
    notPlaying: "Не воспроизводится",
    unknownArtist: "Неизвестный исполнитель",
    unknownAlbum: "Неизвестный альбом",
    openApp: "Открыть {app}",
    refreshFailed: "Не удалось обновить Now playing",
    coverFailed: "не удалось загрузить обложку",
  },
  uk: {
    notPlaying: "Не відтворюється",
    unknownArtist: "Невідомий виконавець",
    unknownAlbum: "Невідомий альбом",
    openApp: "Відкрити {app}",
    refreshFailed: "Не вдалося оновити Now playing",
    coverFailed: "не вдалося завантажити обкладинку",
    settingsApps: "Застосунки",
    settingsFullscreenEffect: "Повноекранний ефект",
    effectGlow: "Світіння",
    effectOcean: "Океан",
    effectEnergySaver: "Енергозбереження",
  },
  ja: {
    notPlaying: "再生していません",
    unknownArtist: "不明なアーティスト",
    unknownAlbum: "不明なアルバム",
    openApp: "{app}を開く",
    refreshFailed: "Now playing の更新に失敗しました",
    coverFailed: "カバーの取得に失敗しました",
    settingsApps: "アプリ",
    settingsFullscreenEffect: "全画面エフェクト",
    effectGlow: "グロー",
    effectOcean: "オーシャン",
    effectEnergySaver: "省電力",
  },
  ko: {
    notPlaying: "재생 중 아님",
    unknownArtist: "알 수 없는 아티스트",
    unknownAlbum: "알 수 없는 앨범",
    openApp: "{app} 열기",
    refreshFailed: "Now playing 새로 고침 실패",
    coverFailed: "앨범 아트 불러오기 실패",
  },
  zh: {
    notPlaying: "未在播放",
    unknownArtist: "未知艺人",
    unknownAlbum: "未知专辑",
    openApp: "打开 {app}",
    refreshFailed: "Now playing 刷新失败",
    coverFailed: "封面加载失败",
    settingsApps: "应用",
    settingsFullscreenEffect: "全屏效果",
    effectGlow: "光晕",
    effectOcean: "海洋",
    effectEnergySaver: "节能",
  },
  "zh-tw": {
    notPlaying: "未在播放",
    unknownArtist: "未知演出者",
    unknownAlbum: "未知專輯",
    openApp: "開啟 {app}",
    refreshFailed: "Now playing 重新整理失敗",
    coverFailed: "封面載入失敗",
    settingsApps: "應用程式",
    settingsFullscreenEffect: "全螢幕效果",
    effectGlow: "光暈",
    effectOcean: "海洋",
    effectEnergySaver: "節能",
  },
  ar: {
    notPlaying: "لا يتم التشغيل",
    unknownArtist: "فنان غير معروف",
    unknownAlbum: "البوم غير معروف",
    openApp: "فتح {app}",
    refreshFailed: "فشل تحديث Now playing",
    coverFailed: "فشل تحميل الغلاف",
  },
  he: {
    notPlaying: "לא מתנגן",
    unknownArtist: "אמן לא ידוע",
    unknownAlbum: "אלבום לא ידוע",
    openApp: "פתח את {app}",
    refreshFailed: "רענון Now playing נכשל",
    coverFailed: "טעינת העטיפה נכשלה",
  },
  hi: {
    notPlaying: "चल नहीं रहा",
    unknownArtist: "अज्ञात कलाकार",
    unknownAlbum: "अज्ञात एल्बम",
    openApp: "{app} खोलें",
    refreshFailed: "Now playing रीफ्रेश विफल",
    coverFailed: "कवर लोड नहीं हुआ",
  },
  id: {
    notPlaying: "Tidak diputar",
    unknownArtist: "Artis tidak dikenal",
    unknownAlbum: "Album tidak dikenal",
    openApp: "Buka {app}",
    refreshFailed: "Gagal memuat ulang Now playing",
    coverFailed: "gagal memuat sampul",
  },
  th: {
    notPlaying: "ไม่ได้เล่น",
    unknownArtist: "ศิลปินไม่ทราบชื่อ",
    unknownAlbum: "อัลบั้มไม่ทราบชื่อ",
    openApp: "เปิด {app}",
    refreshFailed: "รีเฟรช Now playing ไม่สำเร็จ",
    coverFailed: "โหลดปกไม่สำเร็จ",
  },
  vi: {
    notPlaying: "Khong phat",
    unknownArtist: "Nghe si khong xac dinh",
    unknownAlbum: "Album khong xac dinh",
    openApp: "Mo {app}",
    refreshFailed: "Khong the lam moi Now playing",
    coverFailed: "khong the tai bia",
  },
};

const languageAliases: Record<string, string> = {
  "pt-pt": "pt",
  "zh-cn": "zh",
  "zh-sg": "zh",
  "zh-hans": "zh",
  "zh-hant": "zh-tw",
  "zh-hk": "zh-tw",
  "zh-mo": "zh-tw",
  nb: "no",
  nn: "no",
};

function resolveTranslations(): Translation {
  const candidates: string[] =
    typeof navigator !== "undefined"
      ? [...Array.from(navigator.languages ?? []), navigator.language].filter(
          (value): value is string => Boolean(value)
        )
      : [];

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    const alias = languageAliases[normalized] ?? normalized;
    const base = alias.split("-")[0];
    const match = translations[alias] ?? translations[base];
    if (match) return match;
  }

  return translations.en;
}

function useTranslations() {
  return useMemo(resolveTranslations, []);
}

function formatOpenAppLabel(template: string, app: string) {
  return template.replace("{app}", app);
}

function formatEffectLabel(t: Translation, effect: FullscreenEffectKey) {
  switch (effect) {
    case "glow":
      return t.effectGlow ?? translations.en.effectGlow ?? "Glow";
    case "ocean":
      return t.effectOcean ?? translations.en.effectOcean ?? "Ocean";
    case "energySaver":
      return t.effectEnergySaver ?? translations.en.effectEnergySaver ?? "Energy Saver";
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
  | "tidal"
  | "appleMusic"
  | "deezer"
  | "amazonMusic"
  | "soundCloud";

const musicApps: MusicAppButton[] = [
  { key: "spotify", label: "Spotify", Icon: SiSpotify, open: python.openSpotify },
  { key: "tidal", label: "Tidal", Icon: SiTidal, open: python.openTidal },
  { key: "appleMusic", label: "Apple Music", Icon: SiApplemusic, open: python.openAppleMusic },
  { key: "deezer", label: "Deezer", Icon: FaDeezer, open: python.openDeezer },
  { key: "amazonMusic", label: "Amazon Music", Icon: FaAmazon, open: python.openAmazonMusic },
  { key: "soundCloud", label: "SoundCloud", Icon: SiSoundcloud, open: python.openSoundCloud },
];

const defaultEnabledAppKeys: MusicAppKey[] = ["spotify"];

type FullscreenEffectKey =
  | "glow"
  | "ocean"
  | "energySaver";

const fullscreenEffects: { key: FullscreenEffectKey }[] = [
  { key: "glow" },
  { key: "ocean" },
  { key: "energySaver" },
];

const defaultFullscreenEffect: FullscreenEffectKey = "glow";

function normalizeEnabledAppKeys(keys: unknown): MusicAppKey[] {
  if (!Array.isArray(keys)) return defaultEnabledAppKeys;

  const knownKeys = new Set(musicApps.map((app) => app.key));
  const normalized = keys.filter((key): key is MusicAppKey => typeof key === "string" && knownKeys.has(key as MusicAppKey));

  return normalized.length > 0 ? normalized : defaultEnabledAppKeys;
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

  try {
    window.localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(keys));
  } catch {
    // Local storage can be unavailable in some embedded contexts; the session state still works.
  }
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

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function MeterBar(props: { value: number; dimmed?: boolean }) {
  const value = clamp(props.value, 0, 1);

  return (
    <div style={meterTrackStyle}>
      <div
        style={{
          ...meterFillBaseStyle,
          width: `${value * 100}%`,
          opacity: props.dimmed ? 0.5 : 1,
        }}
      />
    </div>
  );
}

function ScrollingText(props: { text: string; style?: CSSProperties }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const measure = () => {
      const element = textRef.current;
      const parent = element?.parentElement;
      if (!element || !parent) return;
      setShouldScroll(element.scrollWidth > parent.clientWidth + 2);
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
      title={props.text}
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

function CoverBox(props: { artUrl?: string }) {
  const { artUrl } = props;

  if (artUrl && artUrl.trim()) {
    return (
      <img
        src={artUrl}
        style={{
          width: `${BLOCK_WIDTH}px`,
          height: `${BLOCK_WIDTH}px`,
          objectFit: "cover",
          borderRadius: "18px",
          display: "block",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: `${BLOCK_WIDTH}px`,
        height: `${BLOCK_WIDTH}px`,
        borderRadius: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <FaMusic size={72} />
    </div>
  );
}

function ProgressView(props: { current: PlayerSnapshot | null; clock: number; snapshotAt: number }) {
  const { current, clock, snapshotAt } = props;
  const length = Math.max(1, current?.length ?? 1);
  const basePosition = current?.position ?? 0;
  const livePosition = current?.status === "Playing" ? basePosition + Math.max(0, clock - snapshotAt) : basePosition;
  const position = clamp(livePosition, 0, length);
  const progress = length > 1 ? position / length : 0;

  return (
    <div style={{ ...meterBoxStyle, marginTop: "12px" }}>
      <MeterBar value={progress} />
      <div style={subtleRowTextStyle}>
        <span>{formatTime(position)}</span>
        <span>{formatTime(length)}</span>
      </div>
    </div>
  );
}

function navigateToFullscreen() {
  try {
    Navigation.CloseSideMenus();
  } catch {
    // Older Decky/Steam builds can throw here; navigation below still works in most cases.
  }

  window.setTimeout(() => {
    const mainWindow =
      Router.WindowStore?.GamepadUIMainWindowInstance ??
      Router.WindowStore?.SteamUIWindows?.[0];

    if (mainWindow?.Navigate) {
      mainWindow.Navigate(FULLSCREEN_ROUTE);
      return;
    }

    Navigation.Navigate(FULLSCREEN_ROUTE);
  }, 80);
}

function navigateBackFromFullscreen() {
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

function FullscreenEffectLayer(props: { effect: FullscreenEffectKey }) {
  if (props.effect === "energySaver") return null;

  if (props.effect === "ocean") {
    return <OceanLayer />;
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
  const [fullscreenEffect] = useState<FullscreenEffectKey>(loadFullscreenEffect);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);
  const refreshingRef = useRef<boolean>(false);

  const current: PlayerSnapshot | null = useMemo(
    () => snapshot.selected ?? snapshot.players[0] ?? null,
    [snapshot]
  );

  const title = current?.title?.trim() ? current.title : t.notPlaying;
  const artist = current?.artist?.trim() ? current.artist : t.unknownArtist;
  const album = current?.album?.trim() ? current.album : t.unknownAlbum;
  const isPlaying = current?.status === "Playing";
  const canUsePrevious = !busy && !!current?.canPrevious;
  const canUsePlayPause = !busy && !!current;
  const canUseNext = !busy && !!current?.canNext;

  async function refresh(force = false) {
    if (refreshingRef.current && !force) return;

    refreshingRef.current = true;
    try {
      const next = await python.getSnapshot();
      setSnapshot(next);
    } catch (error) {
      console.warn(t.refreshFailed, error);
    } finally {
      refreshingRef.current = false;
    }
  }

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
    const timer = window.setInterval(() => void refresh(false), 400);
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
        const url = await python.getCover(trackTitle, trackArtist, trackAlbum);
        if (!cancelled) setCoverUrl(url || "");
      } catch (error) {
        if (!cancelled) console.warn(t.coverFailed, error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [current?.title, current?.artist, current?.album, t.coverFailed]);

  return (
    <Focusable
      onCancel={navigateBackFromFullscreen}
      onCancelButton={navigateBackFromFullscreen}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 2147483000,
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
          position: absolute;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 2147483000;
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
        html:has(.npFullscreenRoot) [class*="TopBar"] {
          opacity: 0 !important;
          pointer-events: none !important;
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

        .npFullscreenCover {
          position: absolute;
          left: clamp(64px, 5vw, 108px);
          bottom: clamp(76px, 8.4vh, 118px);
          width: clamp(170px, 13.6vw, 278px);
          height: clamp(170px, 13.6vw, 278px);
          border-radius: clamp(14px, 1.3vw, 24px);
          overflow: hidden;
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
          z-index: 2;
        }

        .npFullscreenMeta {
          position: absolute;
          left: calc(clamp(64px, 5vw, 108px) + clamp(170px, 13.6vw, 278px) + clamp(28px, 2.2vw, 48px));
          right: clamp(64px, 7vw, 144px);
          bottom: calc(clamp(76px, 8.4vh, 118px) + clamp(74px, 7.6vh, 116px));
          min-width: 0;
          z-index: 2;
        }

        .npFullscreenTitle {
          margin: 0 0 16px;
          font-size: clamp(34px, 3.1vw, 58px);
          line-height: 1.02;
          font-weight: 500;
          letter-spacing: 0;
          overflow-wrap: anywhere;
        }

        .npFullscreenText {
          margin: 0;
          font-size: clamp(23px, 2vw, 38px);
          line-height: 1.2;
          letter-spacing: 0;
          color: rgba(255,255,255,0.82);
          overflow-wrap: anywhere;
        }

        .npFullscreenControls {
          position: absolute;
          left: calc(clamp(64px, 5vw, 108px) + clamp(170px, 13.6vw, 278px) + clamp(28px, 2.2vw, 48px));
          bottom: clamp(76px, 8.4vh, 118px);
          display: flex;
          align-items: center;
          gap: clamp(18px, 1.5vw, 30px);
          z-index: 2;
        }

        .npFullscreenControlButton {
          width: clamp(70px, 5.7vw, 98px);
          min-width: clamp(70px, 5.7vw, 98px);
          height: clamp(58px, 4.2vw, 74px);
          min-height: clamp(58px, 4.2vw, 74px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: rgba(255,255,255,0.96);
          background: rgba(255,255,255,0.12);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
          transition: background 140ms ease, box-shadow 140ms ease, transform 140ms ease;
        }

        .npFullscreenControlButton svg {
          width: clamp(20px, 1.7vw, 30px);
          height: clamp(20px, 1.7vw, 30px);
        }

        .npFullscreenControlButtonFocused {
          background: rgba(255,255,255,0.24);
          box-shadow:
            0 0 0 3px rgba(255,255,255,0.92),
            0 0 0 7px rgba(203,135,0,0.72),
            0 16px 44px rgba(0,0,0,0.46);
          transform: translateY(-1px);
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
            bottom: 150px;
          }

          .npFullscreenTitle {
            margin-bottom: 10px;
            font-size: 30px;
          }

          .npFullscreenText {
            font-size: 21px;
          }

          .npFullscreenControls {
            left: 226px;
            bottom: 74px;
            gap: 14px;
          }

          .npFullscreenControlButton {
            width: 62px;
            min-width: 62px;
            height: 54px;
            min-height: 54px;
          }
        }
      `}</style>

      <div className="npFullscreenRoot">
        <FullscreenEffectLayer effect={fullscreenEffect} />
        {fullscreenEffect === "glow" ? (
          <div className="npFullscreenNoise" aria-hidden="true" />
        ) : null}

        <div className="npFullscreenCover">
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

        <div className="npFullscreenMeta">
          <h1 className="npFullscreenTitle">{title}</h1>
          <p className="npFullscreenText">{artist}</p>
          <p className="npFullscreenText">{album}</p>
        </div>

        <Focusable className="npFullscreenControls" flow-children="horizontal">
          <Focusable
            className="npFullscreenControlButton"
            focusClassName="npFullscreenControlButtonFocused"
            style={{ opacity: canUsePrevious ? 1 : 0.38 }}
            onActivate={() => {
              if (canUsePrevious) void runAction(() => python.previousTrack());
            }}
            onClick={() => {
              if (canUsePrevious) void runAction(() => python.previousTrack());
            }}
          >
            <FaStepBackward />
          </Focusable>

          <Focusable
            className="npFullscreenControlButton"
            focusClassName="npFullscreenControlButtonFocused"
            style={{ opacity: canUsePlayPause ? 1 : 0.38 }}
            onActivate={() => {
              if (canUsePlayPause) void runAction(() => python.playPause());
            }}
            onClick={() => {
              if (canUsePlayPause) void runAction(() => python.playPause());
            }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </Focusable>

          <Focusable
            className="npFullscreenControlButton"
            focusClassName="npFullscreenControlButtonFocused"
            style={{ opacity: canUseNext ? 1 : 0.38 }}
            onActivate={() => {
              if (canUseNext) void runAction(() => python.nextTrack());
            }}
            onClick={() => {
              if (canUseNext) void runAction(() => python.nextTrack());
            }}
          >
            <FaStepForward />
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
  fullscreenEffect: FullscreenEffectKey;
  onBack: () => void;
  onSelectFullscreenEffect: (effect: FullscreenEffectKey) => void;
  onToggleApp: (key: MusicAppKey) => void;
}) {
  const t = useTranslations();
  const enabled = new Set(props.enabledAppKeys);

  return (
    <PanelSection>
      <PanelSectionRow>
        <div style={qamCenterRowStyle}>
          <div style={{ ...centeredColumnStyle, overflow: "visible" }}>
            <div style={headerRowStyle}>
              <DialogButton style={iconButtonStyle} onClick={props.onBack}>
                <FaArrowLeft />
              </DialogButton>
              <span />
            </div>

            <div style={{ ...settingsGroupLabelStyle, marginBottom: "6px" }}>
              {t.settingsApps ?? translations.en.settingsApps ?? "Apps"}
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
                      <span>{app.label}</span>
                      <span style={settingsCheckStyle}>{isEnabled ? <FaCheck /> : null}</span>
                    </span>
                  </DialogButton>
                );
              })}
            </Focusable>

            <div style={{ height: "12px" }} />
            <div style={{ ...settingsGroupLabelStyle, marginBottom: "6px" }}>
              {t.settingsFullscreenEffect ?? translations.en.settingsFullscreenEffect ?? "Fullscreen effect"}
            </div>

            <Focusable style={{ ...centeredColumnStyle, gap: "6px" }} flow-children="vertical">
              {fullscreenEffects.map((effect) => {
                const isSelected = props.fullscreenEffect === effect.key;

                return (
                  <DialogButton
                    key={effect.key}
                    style={{ ...wideButtonStyle, opacity: isSelected ? 1 : 0.58 }}
                    onClick={() => props.onSelectFullscreenEffect(effect.key)}
                  >
                    <span style={settingsButtonContentStyle}>
                      <span>{formatEffectLabel(t, effect.key)}</span>
                      <span style={settingsCheckStyle}>{isSelected ? <FaCheck /> : null}</span>
                    </span>
                  </DialogButton>
                );
              })}
            </Focusable>
          </div>
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
}

function Content() {
  const t = useTranslations();
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [enabledAppKeys, setEnabledAppKeys] = useState<MusicAppKey[]>(loadEnabledAppKeys);
  const [fullscreenEffect, setFullscreenEffect] = useState<FullscreenEffectKey>(loadFullscreenEffect);
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot);
  const [snapshotAt, setSnapshotAt] = useState<number>(Date.now());
  const [clock, setClock] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [mediaVisible, setMediaVisible] = useState<boolean>(true);
  const refreshingRef = useRef<boolean>(false);
  const mediaKeyRef = useRef<string>("");

  const current: PlayerSnapshot | null = useMemo(
    () => snapshot.selected ?? snapshot.players[0] ?? null,
    [snapshot]
  );
  const enabledApps = useMemo(
    () => musicApps.filter((app) => enabledAppKeys.includes(app.key)),
    [enabledAppKeys]
  );

  const mediaKey = `${current?.id ?? ""}|${current?.title ?? ""}|${current?.artist ?? ""}|${current?.album ?? ""}`;

  async function refresh(force = false) {
    if (refreshingRef.current && !force) return;

    refreshingRef.current = true;
    try {
      const next = await python.getSnapshot();
      setSnapshot(next);
      setSnapshotAt(Date.now());
    } catch (error) {
      console.warn(t.refreshFailed, error);
    } finally {
      setLoading(false);
      refreshingRef.current = false;
    }
  }
  async function runAction(action: () => Promise<unknown>) {
    try {
      setBusy(true);
      await action();
    } finally {
      window.setTimeout(() => {
        setBusy(false);
      }, 180);
    }

    void refresh(true);
    window.setTimeout(() => void refresh(true), 60);
    window.setTimeout(() => void refresh(true), 180);
  }

  function toggleEnabledApp(key: MusicAppKey) {
    setEnabledAppKeys((previous) => {
      const isEnabled = previous.includes(key);
      if (isEnabled && previous.length === 1) return previous;

      const next = isEnabled ? previous.filter((enabledKey) => enabledKey !== key) : [...previous, key];
      const normalized = normalizeEnabledAppKeys(next);
      saveEnabledAppKeys(normalized);
      return normalized;
    });
  }

  function selectFullscreenEffect(effect: FullscreenEffectKey) {
    setFullscreenEffect(effect);
    saveFullscreenEffect(effect);
  }

  useEffect(() => {
    void refresh(true);

    const timer = window.setInterval(() => {
      void refresh(false);
    }, 400);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(Date.now());
    }, 250);

    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!mediaKeyRef.current) {
      mediaKeyRef.current = mediaKey;
      return;
    }

    if (mediaKeyRef.current === mediaKey) return;

    setMediaVisible(false);
    const timer = window.setTimeout(() => {
      mediaKeyRef.current = mediaKey;
      setMediaVisible(true);
    }, 90);

    return () => window.clearTimeout(timer);
  }, [mediaKey]);

  useEffect(() => {
    const title = current?.title?.trim() ?? "";
    const artist = current?.artist?.trim() ?? "";
    const album = current?.album?.trim() ?? "";

    if (!title) {
      setCoverUrl("");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const url = await python.getCover(title, artist, album);
        if (cancelled) return;

        if (!url) {
          setCoverUrl("");
          return;
        }

        const image = new Image();
        image.onload = () => {
          if (!cancelled) setCoverUrl(url);
        };
        image.onerror = () => {
          if (!cancelled) setCoverUrl(url);
        };
        image.src = url;
      } catch (error) {
        if (!cancelled) {
          console.warn(t.coverFailed, error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [current?.title, current?.artist, current?.album, t.coverFailed]);

  const title = current?.title?.trim() ? current.title : t.notPlaying;
  const artist = current?.artist?.trim() ? current.artist : t.unknownArtist;
  const album = current?.album?.trim() ? current.album : t.unknownAlbum;
  const isPlaying = current?.status === "Playing";
  const isShuffleActive = current?.shuffleActive === true;
  const repeatMode = current?.repeatMode || "None";
  const repeatActive = repeatMode !== "None";
  const controlsDisabled = busy || loading;
  const mediaTransitionStyle: CSSProperties = {
    opacity: mediaVisible ? 1 : 0.28,
    transform: mediaVisible ? "translateY(0)" : "translateY(2px)",
    transition: "opacity 160ms ease, transform 160ms ease",
  };

  if (showSettings) {
    return (
      <SettingsView
        enabledAppKeys={enabledAppKeys}
        fullscreenEffect={fullscreenEffect}
        onBack={() => setShowSettings(false)}
        onSelectFullscreenEffect={selectFullscreenEffect}
        onToggleApp={toggleEnabledApp}
      />
    );
  }

  return (
    <PanelSection>
      <style>{`
        @keyframes inRiproduzioneMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% + ${BLOCK_WIDTH}px)); }
        }
      `}</style>
      <PanelSectionRow>
        <div style={qamCenterRowStyle}>
          <div style={centeredColumnStyle}>
            <div style={mediaTransitionStyle}>
              <CoverBox artUrl={coverUrl} />

              <div
                style={{
                  width: `${BLOCK_WIDTH}px`,
                  textAlign: "center",
                  marginTop: "14px",
                }}
              >
                <ScrollingText
                  text={title}
                  style={{
                    fontSize: "1.08em",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginBottom: "6px",
                  }}
                />

                <ScrollingText
                  text={artist}
                  style={{
                    opacity: 0.84,
                    lineHeight: 1.2,
                    marginBottom: "4px",
                  }}
                />

                <ScrollingText
                  text={album}
                  style={{
                    opacity: 0.62,
                    fontSize: "0.9em",
                    lineHeight: 1.2,
                  }}
                />
              </div>
            </div>

            <ProgressView current={current} clock={clock} snapshotAt={snapshotAt} />

            <div style={{ height: "14px" }} />

            <Focusable style={controlsWrapStyle} flow-children="horizontal">
              <DialogButton
                style={compactButtonStyle}
                disabled={controlsDisabled || !current?.canPrevious}
                onClick={() => void runAction(() => python.previousTrack())}
              >
                <FaStepBackward />
              </DialogButton>

              <DialogButton
                style={compactButtonStyle}
                disabled={controlsDisabled || !current}
                onClick={() => void runAction(() => python.playPause())}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </DialogButton>

              <DialogButton
                style={compactButtonStyle}
                disabled={controlsDisabled || !current?.canNext}
                onClick={() => void runAction(() => python.nextTrack())}
              >
                <FaStepForward />
              </DialogButton>
            </Focusable>

            <div style={{ height: "8px" }} />

            <Focusable style={controlsWrapStyle} flow-children="horizontal">
              <DialogButton
                style={{ ...compactButtonStyle, opacity: isShuffleActive ? 1 : 0.58 }}
                disabled={controlsDisabled || !current?.canShuffle}
                onClick={() => void runAction(() => python.shuffle())}
              >
                <FaRandom />
              </DialogButton>

              <DialogButton
                style={{ ...compactButtonStyle, opacity: repeatActive ? 1 : 0.58 }}
                disabled={controlsDisabled || !current?.canRepeat}
                onClick={() => void runAction(() => python.repeat())}
              >
                <RepeatIcon repeatMode={repeatMode} />
              </DialogButton>
            </Focusable>

            {snapshot.players.length > 1 ? (
              <>
                <div style={{ height: "14px" }} />
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
              </>
            ) : null}
            {enabledApps.length > 0 ? (
              <>
                <div style={{ height: "10px" }} />

                <Focusable style={{ ...centeredColumnStyle, gap: "6px" }} flow-children="vertical">
                  {enabledApps.map((app) => {
                    const Icon = app.Icon;

                    return (
                      <DialogButton
                        key={app.key}
                        style={wideButtonStyle}
                        disabled={busy}
                        onClick={() => void runAction(app.open)}
                      >
                        <span style={buttonContentStyle}>
                          <Icon />
                          {formatOpenAppLabel(t.openApp, app.label)}
                        </span>
                      </DialogButton>
                    );
                  })}
                </Focusable>

                <div style={{ height: "6px" }} />

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
              </>
            ) : null}
          </div>
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => {
  routerHook.addRoute(FULLSCREEN_ROUTE, FullscreenRoute);

  return {
    name: "Now playing",
    titleView: <div>Now playing</div>,
    content: <Content />,
    icon: <FaMusic />,
    onDismount() {
      routerHook.removeRoute(FULLSCREEN_ROUTE);
    },
  };
});
