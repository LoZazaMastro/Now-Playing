const STORAGE_KEY = "nowPlaying:sourceVolumes:v1";
export const SOURCE_VOLUME_CHANGED_EVENT = "nowPlaying:source-volume-changed";

function clampVolume(value: unknown, fallback = 100) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function readAll(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(Object.entries(parsed).map(([key, value]) => [key, clampVolume(value)]));
  } catch {
    return {};
  }
}

export function getSavedSourceVolume(source: string, fallback = 100): number {
  const key = String(source || "").trim();
  if (!key) return clampVolume(fallback);
  const values = readAll();
  return Object.prototype.hasOwnProperty.call(values, key) ? clampVolume(values[key], fallback) : clampVolume(fallback);
}

export function saveSourceVolume(source: string, value: number, origin: "plugin" | "observed" = "plugin"): number {
  const key = String(source || "").trim();
  const volume = clampVolume(value);
  if (!key || typeof window === "undefined") return volume;
  try {
    const values = readAll();
    values[key] = volume;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    window.dispatchEvent(new CustomEvent(SOURCE_VOLUME_CHANGED_EVENT, { detail: { source: key, volume, origin } }));
  } catch {
    // Embedded CEF can temporarily deny storage; live volume still applies.
  }
  return volume;
}
