import catalogs from "./locales.json";

export type TranslationSection = keyof typeof catalogs.en;
export type CoreTranslation = typeof catalogs.en.core;
export type SpotifyTranslation = typeof catalogs.en.spotify;
export type LocalMusicTranslation = typeof catalogs.en.localMusic;
export type RuntimeTranslation = typeof catalogs.en.runtime;
export type SupportedLocale = keyof typeof catalogs;

const DEFAULT_LOCALE: SupportedLocale = "en";
const localeAliases: Record<string, SupportedLocale> = {
  english: "en",
  "en-us": "en",
  "en-gb": "en",
  italian: "it",
  spanish: "es",
  latam: "es",
  "spanish-latam": "es",
  "es-es": "es",
  "es-mx": "es",
  "es-419": "es",
  french: "fr",
  "fr-fr": "fr",
  "fr-ca": "fr",
  german: "de",
  "de-de": "de",
  brazilian: "pt-br",
  pt: "pt-br",
  "pt-br": "pt-br",
  // European Portuguese is not bundled yet. A complete English fallback is
  // preferable to showing Brazilian wording as though it were locale-native.
  "pt-pt": "en",
  russian: "ru",
  "ru-ru": "ru",
  japanese: "ja",
  "ja-jp": "ja",
  koreana: "ko",
  korean: "ko",
  "ko-kr": "ko",
  schinese: "zh",
  "simplified-chinese": "zh",
  "zh-cn": "zh",
  "zh-sg": "zh",
  "zh-hans": "zh",
  // Traditional Chinese is a different written locale; do not silently
  // substitute Simplified Chinese. Keep the interface internally consistent.
  tchinese: "en",
  "traditional-chinese": "en",
  "zh-tw": "en",
  "zh-hk": "en",
  "zh-mo": "en",
  "zh-hant": "en",
};

function browserLanguageCandidates(): string[] {
  if (typeof navigator === "undefined") return [];
  const values = [...Array.from(navigator.languages ?? []), navigator.language];
  return values
    .map((value) => String(value ?? "").trim().toLowerCase().split("_").join("-"))
    .filter(Boolean);
}

export function resolveLocale(candidates = browserLanguageCandidates()): SupportedLocale {
  for (const candidate of candidates) {
    const direct = localeAliases[candidate] ?? candidate;
    if (direct in catalogs) return direct as SupportedLocale;

    const base = candidate.split("-")[0];
    const aliasedBase = localeAliases[base] ?? base;
    if (aliasedBase in catalogs) return aliasedBase as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}

export function getTranslations<K extends TranslationSection>(section: K): (typeof catalogs.en)[K] {
  const locale = resolveLocale();
  return {
    ...catalogs.en[section],
    ...catalogs[locale][section],
  } as (typeof catalogs.en)[K];
}

export function formatTranslation(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
    template,
  );
}

const runtimeMessageKeys: Record<string, keyof RuntimeTranslation> = {
  "Local music player is not running": "localPlayerNotRunning",
  "Local music player did not respond": "localPlayerNoResponse",
  "Local music file is unavailable": "localFileUnavailable",
  "Questo plugin funziona solo su Windows": "windowsOnly",
  "Windows only": "windowsOnly",
  "Helper C# non avviato correttamente": "helperStartFailed",
  "Folder not found": "folderNotFound",
  "Local music track not found": "localTrackNotFound",
  "Spotify returned an invalid token response": "spotifyInvalidTokenResponse",
  "Spotify authorization session expired": "spotifyAuthorizationExpired",
  "Finishing Spotify connection": "spotifyFinishingConnection",
  "Enter your Spotify Client ID first": "spotifyEnterClientId",
  "Waiting for Spotify authorization": "spotifyWaitingAuthorization",
  "Spotify is not connected": "spotifyNotConnected",
  "Spotify did not return a new access token": "spotifyRefreshTokenFailed",
  "Invalid Spotify API path": "spotifyInvalidApiPath",
  "Spotify returned an invalid response": "spotifyInvalidResponse",
  "Spotify denied this action. Premium or an additional permission may be required": "spotifyActionDenied",
  "Spotify could not find an active playback device": "spotifyNoActiveDevice",
  "Spotify is disabled": "spotifyDisabled",
  "Connect Spotify in the plugin settings first": "spotifyConnectFirst",
  "Unknown Spotify library section": "spotifyUnknownLibrarySection",
  "Invalid Spotify item": "spotifyInvalidItem",
  "No Spotify album is available for the current track": "spotifyNoCurrentAlbum",
  "Spotify could not find the album for the current track": "spotifyAlbumLookupFailed",
  "Open Spotify on this PC, start any song once, then try again": "spotifyOpenAppStartTrack",
  "Unknown Spotify player command": "spotifyUnknownPlayerCommand",
  "No playable Spotify items": "spotifyNoPlayableItems",
  "Missing Spotify URI": "spotifyMissingUri",
  "Invalid Spotify URI": "spotifyInvalidUri",
  "No playable local tracks": "noPlayableLocalTracks",
  "Background choice expired. Search again": "backgroundChoiceExpired",
  "Invalid background choice": "invalidBackgroundChoice",
  "The selected image could not be downloaded": "backgroundDownloadFailed",
  "The selected image is not supported": "unsupportedBackgroundImage",
  "Invalid artist": "invalidArtist",
  "Artist name is required": "artistNameRequired",
  "Spotify artist cache is already being created": "spotifyArtistCacheBusy",
  "Spotify artist cache is busy": "spotifyArtistCacheInUse",
  "Plugin service restart timed out": "restartServicesTimedOut",
  "Plugin service restart is already running": "restartServicesAlreadyRunning",
  "MediaBridge did not restart correctly": "mediaBridgeRestartFailed",
  "Plugin service restart failed": "pluginServiceRestartFailed",
};

export function localizeRuntimeMessage(message: unknown, fallback = ""): string {
  const raw = String(message ?? "").trim();
  if (!raw) return fallback;
  const normalized = raw.startsWith("Error: ") ? raw.slice(7).trim() : raw;
  const key = runtimeMessageKeys[normalized];
  return key ? String(getTranslations("runtime")[key]) : raw;
}

export const supportedLocales = Object.freeze(Object.keys(catalogs) as SupportedLocale[]);
