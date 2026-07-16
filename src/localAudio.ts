import { useSyncExternalStore } from "react";
import * as python from "./python";
import { getTranslations } from "./i18n";

export type LocalRepeatMode = "None" | "One" | "All";

export type LocalAudioState = {
  track: any | null;
  queue: any[];
  index: number;
  status: "Playing" | "Paused" | "Stopped";
  position: number;
  length: number;
  volume: number;
  shuffleActive: boolean;
  repeatMode: LocalRepeatMode;
  canPrevious: boolean;
  canNext: boolean;
  error: string;
};

const emptyState: LocalAudioState = {
  track: null,
  queue: [],
  index: -1,
  status: "Stopped",
  position: 0,
  length: 0,
  volume: 100,
  shuffleActive: false,
  repeatMode: "None",
  canPrevious: false,
  canNext: false,
  error: "",
};
const LEGACY_LOCAL_SESSION_STORAGE_KEY = "nowPlaying:lastLocalTrack:v1";


function normalizeTrack(entry: any) {
  return entry?.track ?? entry?.item ?? entry;
}

class LocalAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private state: LocalAudioState = { ...emptyState };
  private listeners = new Set<() => void>();
  private streamBase = "";
  private streamBasePromise: Promise<string> | null = null;
  private loadingToken = 0;
  private syncTimer = 0;
  private lastBackendSyncAt = 0;
  private originalQueue: any[] = [];
  private recoveryAttempts = 0;
  private recoveryInFlight = false;
  private lastProgressAt = 0;
  private stallRecoveryTimer = 0;

  constructor() {
    if (typeof window === "undefined") return;
    // Local playback is intentionally session-only. Older builds persisted the
    // last track/queue/position, which could overwrite the live player state
    // whenever QAM, Big Picture or Settings remounted. Remove that legacy entry
    // once and never restore playback state from disk again.
    try {
      window.localStorage?.removeItem(LEGACY_LOCAL_SESSION_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in restricted Steam CEF contexts.
    }
  }

  private clearStallRecoveryTimer() {
    if (this.stallRecoveryTimer) window.clearTimeout(this.stallRecoveryTimer);
    this.stallRecoveryTimer = 0;
  }

  private scheduleStallRecovery(reason: string) {
    if (this.state.status !== "Playing" || this.recoveryInFlight || this.recoveryAttempts >= 2) return;
    this.clearStallRecoveryTimer();
    const progressMarker = this.lastProgressAt;
    this.stallRecoveryTimer = window.setTimeout(() => {
      this.stallRecoveryTimer = 0;
      if (this.state.status !== "Playing" || this.recoveryInFlight || this.recoveryAttempts >= 2) return;
      if (this.lastProgressAt !== progressMarker || Date.now() - this.lastProgressAt < 2400) return;
      void this.reloadAt(this.state.position, reason);
    }, 2800);
  }

  private ensureAudio() {
    if (this.audio || typeof Audio === "undefined") return this.audio;
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = Math.max(0, Math.min(1, this.state.volume / 100));
    audio.addEventListener("timeupdate", () => {
      this.lastProgressAt = Date.now();
      this.clearStallRecoveryTimer();
      this.patch({ position: Math.max(0, Math.floor((audio.currentTime || 0) * 1000)) });
      this.scheduleStallRecovery("progress-timeout");
    });
    audio.addEventListener("durationchange", () => {
      const duration = Number.isFinite(audio.duration) ? Math.max(0, Math.floor(audio.duration * 1000)) : 0;
      this.patch({ length: duration || Number(this.state.track?.duration_ms || 0) });
    });
    audio.addEventListener("loadedmetadata", () => {
      const duration = Number.isFinite(audio.duration) ? Math.max(0, Math.floor(audio.duration * 1000)) : 0;
      this.patch({ length: duration || Number(this.state.track?.duration_ms || 0), error: "" });
    });
    audio.addEventListener("play", () => {
      this.lastProgressAt = Date.now();
      this.patch({ status: "Playing", error: "" });
      this.scheduleStallRecovery("progress-timeout");
    });
    audio.addEventListener("pause", () => {
      this.clearStallRecoveryTimer();
      if (!audio.ended && !this.recoveryInFlight) this.patch({ status: this.state.track ? "Paused" : "Stopped" });
    });
    audio.addEventListener("ended", () => void this.handleEnded());
    audio.addEventListener("stalled", () => this.scheduleStallRecovery("stalled"));
    audio.addEventListener("waiting", () => this.scheduleStallRecovery("waiting"));
    audio.addEventListener("error", () => {
      if (this.recoveryInFlight) return;
      if (this.state.track && this.state.status === "Playing" && this.recoveryAttempts < 2) {
        void this.reloadAt(this.state.position, "media-error");
        return;
      }
      const code = audio.error?.code ?? 0;
      const t = getTranslations("runtime");
      const message = code === 4 ? t.unsupportedLocalFormat : t.localMediaError;
      this.patch({ status: "Stopped", error: message });
    });
    this.audio = audio;
    return audio;
  }

  restoreLastTrack(): Promise<LocalAudioState> {
    // Kept as a compatibility no-op for callers compiled against older builds.
    // Playback state now comes only from this live singleton.
    return Promise.resolve(this.state);
  }

  initialize(): Promise<string> {
    if (this.streamBase) return Promise.resolve(this.streamBase);
    if (!this.streamBasePromise) {
      this.streamBasePromise = python.getLocalMusicStreamBase()
        .then((value) => {
          this.streamBase = String(value || "").replace(/\/$/, "");
          return this.streamBase;
        })
        .finally(() => { this.streamBasePromise = null; });
    }
    return this.streamBasePromise;
  }

  private streamUrl(track: any) {
    const id = encodeURIComponent(String(track?.id ?? ""));
    return `${this.streamBase}/track/${id}`;
  }

  private emit(syncBackend = true) {
    for (const listener of this.listeners) listener();
    if (this.syncTimer) window.clearTimeout(this.syncTimer);
    this.syncTimer = 0;
    if (!syncBackend) return;
    const elapsed = Date.now() - this.lastBackendSyncAt;
    const delay = Math.max(180, 750 - elapsed);
    this.syncTimer = window.setTimeout(() => {
      this.syncTimer = 0;
      this.lastBackendSyncAt = Date.now();
      const state = this.state;
      void python.updateLocalMusicFrontendState({
        track: state.track,
        index: state.index,
        queueLength: state.queue.length,
        status: state.status,
        position: state.position,
        length: state.length,
        volume: state.volume,
        shuffleActive: state.shuffleActive,
        repeatMode: state.repeatMode,
        canPrevious: state.canPrevious,
        canNext: state.canNext,
      }).catch(() => {});
    }, delay);
  }

  private patch(update: Partial<LocalAudioState>) {
    this.state = { ...this.state, ...update };
    this.emit();
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  async playItems(entries: any[], startIndex = 0) {
    const sourceQueue = entries.map(normalizeTrack).filter((track: any) => track?.id);
    if (!sourceQueue.length) throw new Error(getTranslations("runtime").noPlayableLocalTracks);
    const requestedIndex = Math.max(0, Math.min(Math.floor(startIndex || 0), sourceQueue.length - 1));
    this.originalQueue = [...sourceQueue];
    const queue = this.state.shuffleActive
      ? [sourceQueue[requestedIndex], ...this.shuffleEntries(sourceQueue.filter((_, index) => index !== requestedIndex))]
      : sourceQueue;
    const index = this.state.shuffleActive ? 0 : requestedIndex;
    this.state = {
      ...this.state,
      queue,
      index,
      track: queue[index],
      position: 0,
      length: Number(queue[index]?.duration_ms || 0),
      canPrevious: true,
      canNext: true,
      error: "",
    };
    this.emit();
    await this.loadCurrent(true);
    return this.state;
  }

  private async loadCurrent(autoPlay: boolean) {
    const audio = this.ensureAudio();
    const track = this.state.queue[this.state.index];
    if (!audio || !track) throw new Error(getTranslations("runtime").localPlayerUnavailable);
    await this.initialize();
    const token = ++this.loadingToken;
    this.recoveryAttempts = 0;
    this.recoveryInFlight = false;
    this.clearStallRecoveryTimer();
    this.lastProgressAt = Date.now();
    audio.pause();
    audio.src = `${this.streamUrl(track)}?v=${encodeURIComponent(String(track?.modifiedAt ?? track?.id ?? Date.now()))}`;
    audio.load();
    this.patch({ track, position: 0, length: Number(track?.duration_ms || 0), status: autoPlay ? "Paused" : "Stopped", error: "" });
    if (autoPlay) {
      try {
        await audio.play();
      } catch (error: any) {
        if (token !== this.loadingToken) return;
        const message = String(error?.message ?? error ?? getTranslations("runtime").localPlaybackStartFailed);
        this.patch({ status: "Stopped", error: message });
        throw error;
      }
    }
  }

  async playPause() {
    const audio = this.ensureAudio();
    if (!audio) return this.state;
    if ((!this.state.track && this.state.queue.length) || (this.state.track && !audio.src)) await this.loadCurrent(true);
    else if (audio.paused) await audio.play();
    else audio.pause();
    return this.state;
  }

  async next() {
    if (!this.state.queue.length) return this.state;
    let index = this.state.index;
    if (index < this.state.queue.length - 1) index += 1;
    else if (this.state.repeatMode === "All") {
      if (this.state.shuffleActive && this.originalQueue.length > 1) {
        const currentId = String(this.state.track?.id ?? "");
        let queue = this.shuffleEntries(this.originalQueue);
        if (String(queue[0]?.id ?? "") === currentId) {
          const replacement = queue.findIndex((track) => String(track?.id ?? "") !== currentId);
          if (replacement > 0) [queue[0], queue[replacement]] = [queue[replacement], queue[0]];
        }
        this.patch({ queue, index: 0, track: queue[0], position: 0 });
        await this.loadCurrent(true);
        return this.state;
      }
      index = 0;
    }
    else return this.state;
    this.patch({ index, track: this.state.queue[index], position: 0 });
    await this.loadCurrent(true);
    return this.state;
  }

  async previous() {
    const audio = this.ensureAudio();
    if (audio && audio.currentTime > 4) {
      audio.currentTime = 0;
      this.patch({ position: 0 });
      return this.state;
    }
    if (!this.state.queue.length) return this.state;
    let index = this.state.index;
    index = index > 0 ? index - 1 : (this.state.repeatMode === "All" ? this.state.queue.length - 1 : 0);
    this.patch({ index, track: this.state.queue[index], position: 0 });
    await this.loadCurrent(true);
    return this.state;
  }

  async playIndex(index: number) {
    if (!this.state.queue.length) return this.state;
    const nextIndex = Math.max(0, Math.min(Math.floor(index || 0), this.state.queue.length - 1));
    if (nextIndex === this.state.index) {
      const audio = this.ensureAudio();
      if (audio?.paused) await audio.play();
      return this.state;
    }
    this.patch({ index: nextIndex, track: this.state.queue[nextIndex], position: 0 });
    await this.loadCurrent(true);
    return this.state;
  }

  async command(command: "play_pause" | "next" | "previous" | "shuffle" | "repeat") {
    if (command === "play_pause") return this.playPause();
    if (command === "next") return this.next();
    if (command === "previous") return this.previous();
    if (command === "shuffle") {
      const shuffleActive = !this.state.shuffleActive;
      const currentId = String(this.state.track?.id ?? "");
      if (shuffleActive) {
        const prefix = this.state.index >= 0 ? this.state.queue.slice(0, this.state.index + 1) : [];
        const future = this.state.index >= 0 ? this.state.queue.slice(this.state.index + 1) : this.state.queue;
        this.patch({ shuffleActive, queue: [...prefix, ...this.shuffleEntries(future)] });
      } else {
        const restored = this.originalQueue.length ? [...this.originalQueue] : [...this.state.queue];
        const restoredIndex = Math.max(0, restored.findIndex((track) => String(track?.id ?? "") === currentId));
        this.patch({ shuffleActive, queue: restored, index: restoredIndex, track: restored[restoredIndex] ?? this.state.track });
      }
      return this.state;
    }
    const next: LocalRepeatMode = this.state.repeatMode === "None" ? "All" : this.state.repeatMode === "All" ? "One" : "None";
    this.patch({ repeatMode: next });
    return this.state;
  }

  stop() {
    const audio = this.ensureAudio();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.patch({ status: "Stopped", position: 0 });
    return this.state;
  }

  setVolume(value: number) {
    const volume = Math.max(0, Math.min(100, Math.round(value)));
    const audio = this.ensureAudio();
    if (audio) audio.volume = volume / 100;
    this.patch({ volume });
    return this.state;
  }

  seek(ms: number) {
    const audio = this.ensureAudio();
    if (!audio) return;
    audio.currentTime = Math.max(0, ms / 1000);
  }

  destroy() {
    if (this.syncTimer) window.clearTimeout(this.syncTimer);
    this.syncTimer = 0;
    this.lastBackendSyncAt = 0;
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
    }
    this.audio = null;
    this.originalQueue = [];
    this.recoveryAttempts = 0;
    this.recoveryInFlight = false;
    this.clearStallRecoveryTimer();
    this.state = { ...emptyState };
    this.emit(false);
  }

  private async handleEnded() {
    const expectedLength = Math.max(Number(this.state.length || 0), Number(this.state.track?.duration_ms || 0));
    const actualPosition = Math.max(Number(this.state.position || 0), Math.floor((this.audio?.currentTime || 0) * 1000));
    if (expectedLength > 0 && expectedLength - actualPosition > 2500 && this.recoveryAttempts < 2) {
      await this.reloadAt(Math.min(expectedLength - 1000, actualPosition + 80), "premature-ended");
      return;
    }
    if (this.state.repeatMode === "One") {
      await this.loadCurrent(true);
      return;
    }
    if (this.state.index < this.state.queue.length - 1 || this.state.repeatMode === "All") {
      await this.next();
      return;
    }
    this.patch({ status: "Stopped", position: this.state.length });
  }

  private shuffleEntries(entries: any[]) {
    const result = [...entries];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  private async reloadAt(positionMs: number, reason: string) {
    const audio = this.ensureAudio();
    const track = this.state.track;
    if (!audio || !track || this.recoveryInFlight || this.recoveryAttempts >= 2) return;
    await this.initialize();
    this.recoveryInFlight = true;
    this.clearStallRecoveryTimer();
    this.recoveryAttempts += 1;
    const token = ++this.loadingToken;
    const shouldResume = this.state.status === "Playing";
    const resumeAt = Math.max(0, Number(positionMs || 0));
    try {
      audio.pause();
      audio.src = `${this.streamUrl(track)}?v=${encodeURIComponent(String(track?.modifiedAt ?? track?.id ?? "track"))}&recover=${Date.now()}&reason=${encodeURIComponent(reason)}`;
      audio.load();
      await new Promise<void>((resolve, reject) => {
        let settled = false;
        const finish = (error?: Error) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          audio.removeEventListener("loadedmetadata", ready);
          audio.removeEventListener("canplay", ready);
          audio.removeEventListener("error", failed);
          if (error) reject(error); else resolve();
        };
        const ready = () => finish();
        const failed = () => finish(new Error(getTranslations("runtime").localAudioRecoveryFailed));
        const timeout = window.setTimeout(() => finish(), 4500);
        audio.addEventListener("loadedmetadata", ready, { once: true });
        audio.addEventListener("canplay", ready, { once: true });
        audio.addEventListener("error", failed, { once: true });
      });
      if (token !== this.loadingToken) return;
      const maximum = Number.isFinite(audio.duration) && audio.duration > 0 ? Math.max(0, audio.duration * 1000 - 250) : resumeAt;
      audio.currentTime = Math.max(0, Math.min(resumeAt, maximum)) / 1000;
      this.lastProgressAt = Date.now();
      this.patch({ position: Math.floor(audio.currentTime * 1000), error: "" });
      if (shouldResume) await audio.play();
    } catch (error: any) {
      if (token === this.loadingToken) this.patch({ error: String(error?.message ?? error ?? getTranslations("runtime").localAudioRecoveryFailed) });
    } finally {
      if (token === this.loadingToken) this.recoveryInFlight = false;
    }
  }
}

export const localAudioPlayer = new LocalAudioEngine();

export function useLocalAudioState() {
  return useSyncExternalStore(localAudioPlayer.subscribe, localAudioPlayer.getSnapshot, localAudioPlayer.getSnapshot);
}
