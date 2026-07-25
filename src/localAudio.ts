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

export type LocalAudioLevels = {
  energy: number;
  bass: number;
  mid: number;
  treble: number;
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
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private frequencyData: Uint8Array<ArrayBuffer> | null = null;
  private lastContextResumeAt = 0;
  private prefetchedVideoIds = new Set<string>();

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
    audio.crossOrigin = "anonymous";
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
      // `play` fires the instant play() is called, before the stream has buffered.
      // Do not flip to "Playing" here or the smooth progress bar starts ticking
      // from 0 while the audio is still resolving, then snaps back when the real
      // audio finally starts. Wait for the `playing` event (actual audio start).
      this.ensureAudioAnalysis();
      void this.audioContext?.resume().catch(() => {});
      this.patch({ error: "" });
    });
    audio.addEventListener("playing", () => {
      this.ensureAudioAnalysis();
      void this.audioContext?.resume().catch(() => {});
      this.lastProgressAt = Date.now();
      this.patch({ status: "Playing", position: Math.max(0, Math.floor((audio.currentTime || 0) * 1000)), error: "" });
      this.scheduleStallRecovery("progress-timeout");
      this.prefetchNext();
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

  // 8 output channels, WebAudio discrete order: FL, FR, FC, LFE, SL, SR, BL, BR.
  static readonly SPEAKER_COUNT = 8;
  private surroundMode: "off" | "5.1" | "7.1" = (() => {
    try {
      const stored = String(window.localStorage.getItem("nowPlaying.surroundMode") || "");
      if (stored === "5.1" || stored === "7.1" || stored === "off") return stored;
      if (window.localStorage.getItem("nowPlaying.upmix71") === "1") return "7.1";
    } catch { /* fall through */ }
    return "off";
  })();
  private speakerVolumes: number[] = (() => {
    try {
      const raw = JSON.parse(String(window.localStorage.getItem("nowPlaying.speakerVolumes") || "[]"));
      if (Array.isArray(raw)) return Array.from({ length: 8 }, (_, i) => Math.max(0, Math.min(100, Number(raw[i] ?? 100))));
    } catch { /* fall through */ }
    return Array.from({ length: 8 }, () => 100);
  })();
  private upmixNodes: AudioNode[] = [];
  private channelContribs: { node: GainNode; base: number; channel: number }[] = [];

  // Route the analyser output either straight to a stereo destination, or through
  // a stereo→7.1 upmix matrix when the option is on and the output device
  // actually supports multichannel. Each output channel has an adjustable volume.
  // Used by Your Music and YouTube Music (both play through this in-browser
  // player); Spotify plays through its own bridge and is unaffected.
  private applyOutputRouting() {
    const context = this.audioContext;
    const analyser = this.analyser;
    if (!context || !analyser) return;
    try { analyser.disconnect(); } catch { /* was not connected yet */ }
    for (const node of this.upmixNodes) { try { node.disconnect(); } catch { /* ignore */ } }
    this.upmixNodes = [];
    this.channelContribs = [];
    const destination = context.destination;
    const maxChannels = Number(destination.maxChannelCount || 2);
    if (this.surroundMode !== "off" && maxChannels >= 6) {
      const channels = this.surroundMode === "7.1" ? Math.min(8, maxChannels) : Math.min(6, maxChannels);
      try {
        destination.channelCount = channels;
        destination.channelCountMode = "explicit";
        destination.channelInterpretation = "discrete";
      } catch { /* device may reject an explicit layout */ }
      const splitter = context.createChannelSplitter(2);
      const merger = context.createChannelMerger(channels);
      analyser.connect(splitter);
      const route = (input: number, output: number, base: number) => {
        const gain = context.createGain();
        gain.gain.value = base * (Math.max(0, Math.min(100, this.speakerVolumes[output] ?? 100)) / 100);
        splitter.connect(gain, input, 0);
        gain.connect(merger, 0, output);
        this.upmixNodes.push(gain);
        this.channelContribs.push({ node: gain, base, channel: output });
      };
      route(0, 0, 1);                       // Front Left  = L
      route(1, 1, 1);                       // Front Right = R
      route(0, 2, 0.5); route(1, 2, 0.5);   // Center = (L+R)/2
      route(0, 3, 0.35); route(1, 3, 0.35); // LFE   = (L+R) attenuated
      if (channels >= 6) { route(0, 4, 0.9); route(1, 5, 0.9); }   // Side L/R
      if (channels >= 8) { route(0, 6, 0.75); route(1, 7, 0.75); } // Back L/R
      merger.connect(destination);
      this.upmixNodes.push(splitter, merger);
    } else {
      try { destination.channelCount = Math.min(2, maxChannels); } catch { /* ignore */ }
      analyser.connect(destination);
    }
  }

  setSurroundMode(mode: "off" | "5.1" | "7.1") {
    this.surroundMode = mode === "5.1" || mode === "7.1" ? mode : "off";
    try { window.localStorage.setItem("nowPlaying.surroundMode", this.surroundMode); } catch { /* storage unavailable */ }
    this.applyOutputRouting();
  }

  getSurroundMode(): "off" | "5.1" | "7.1" {
    return this.surroundMode;
  }

  getSpeakerVolumes(): number[] {
    return [...this.speakerVolumes];
  }

  setSpeakerVolume(channel: number, value: number) {
    if (channel < 0 || channel >= LocalAudioEngine.SPEAKER_COUNT) return;
    const volume = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
    this.speakerVolumes[channel] = volume;
    try { window.localStorage.setItem("nowPlaying.speakerVolumes", JSON.stringify(this.speakerVolumes)); } catch { /* storage unavailable */ }
    // Update the live gain nodes for this channel without rebuilding the graph.
    for (const contrib of this.channelContribs) {
      if (contrib.channel === channel) contrib.node.gain.value = contrib.base * (volume / 100);
    }
  }

  private ensureAudioAnalysis() {
    if (this.analyser || !this.audio || typeof window === "undefined") return;
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    try {
      const context = new AudioContextConstructor();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = .78;
      const source = context.createMediaElementSource(this.audio);
      source.connect(analyser);
      this.audioContext = context;
      this.analyser = analyser;
      this.frequencyData = new Uint8Array(analyser.frequencyBinCount);
      this.applyOutputRouting();
    } catch {
      this.audioContext = null;
      this.analyser = null;
      this.frequencyData = null;
    }
  }

  getAudioLevels(): LocalAudioLevels {
    if (!this.analyser && this.audio && this.state.status === "Playing") {
      // The play-time hookup can fail transiently in restricted CEF contexts;
      // retry lazily while a visualizer is actually reading levels.
      this.ensureAudioAnalysis();
    }
    if (this.audioContext && this.audioContext.state === "suspended" && Date.now() - this.lastContextResumeAt > 1500) {
      this.lastContextResumeAt = Date.now();
      void this.audioContext.resume().catch(() => {});
    }
    const analyser = this.analyser;
    const data = this.frequencyData;
    if (!analyser || !data || this.state.status !== "Playing") {
      return { energy: 0, bass: 0, mid: 0, treble: 0 };
    }
    analyser.getByteFrequencyData(data);
    const average = (from: number, to: number) => {
      let total = 0;
      const end = Math.max(from + 1, Math.min(data.length, to));
      for (let index = from; index < end; index += 1) total += data[index];
      return total / (end - from) / 255;
    };
    const bass = average(0, Math.ceil(data.length * .12));
    const mid = average(Math.ceil(data.length * .12), Math.ceil(data.length * .45));
    const treble = average(Math.ceil(data.length * .45), data.length);
    return {
      bass,
      mid,
      treble,
      energy: Math.min(1, bass * .48 + mid * .36 + treble * .16),
    };
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

  private async streamUrl(track: any) {
    if (String(track?.sourceKey ?? "") === "youtubeMusic") {
      const result = await python.youtubeMusicPrepareStream(String(track?.videoId ?? track?.id ?? ""));
      if (!result?.ok || !result.data?.url) {
        throw new Error(String(result?.error ?? "YouTube Music stream is unavailable"));
      }
      // Replace the small search thumbnail with yt-dlp's full-resolution square
      // cover so the fullscreen and top-bar artwork for the playing track is crisp.
      const thumbnail = String((result.data as any)?.thumbnail ?? "").trim();
      if (thumbnail && track && typeof track === "object") {
        const highRes = { url: thumbnail, width: 1200, height: 1200 };
        track.images = [...(Array.isArray(track.images) ? track.images : []), highRes];
        if (track.album && typeof track.album === "object") {
          track.album.images = [...(Array.isArray(track.album.images) ? track.album.images : []), highRes];
        }
        this.emit(false);
      }
      return String(result.data.url);
    }

    const id = encodeURIComponent(String(track?.id ?? ""));
    return `${this.streamBase}/track/${id}`;
  }

  // Warm the backend stream cache for the next queued YouTube Music track while
  // the current one plays, so skipping/advancing resolves instantly instead of
  // waiting ~1-2 s for yt-dlp. Best-effort and de-duplicated per next track.
  private prefetchNext() {
    try {
      const queue = this.state.queue;
      if (!queue || !queue.length) return;
      // Warm a few upcoming tracks on the backend's dedicated single-worker
      // prefetch executor. That executor never shares threads with on-demand
      // playback resolution, so prefetch can no longer slow down selecting or
      // advancing a track (the problem the 6-at-once version caused). Requests are
      // de-duplicated so each track is only prepared once.
      const AHEAD = 4;
      for (let offset = 1; offset <= AHEAD; offset += 1) {
        const track = queue[this.state.index + offset];
        if (!track || String((track as any)?.sourceKey ?? "") !== "youtubeMusic") continue;
        const videoId = String((track as any)?.videoId ?? (track as any)?.id ?? "");
        if (!videoId || this.prefetchedVideoIds.has(videoId)) continue;
        this.prefetchedVideoIds.add(videoId);
        void python.youtubeMusicPrefetchStream(videoId).catch(() => { this.prefetchedVideoIds.delete(videoId); });
      }
      if (this.prefetchedVideoIds.size > 60) {
        this.prefetchedVideoIds = new Set(Array.from(this.prefetchedVideoIds).slice(-30));
      }
    } catch {
      // Prefetch is purely an optimisation; ignore any failure.
    }
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
        sourceKey: String(state.track?.sourceKey ?? "localMusic"),
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
    // Keep the currently audible track and metadata visible while a remote
    // YouTube Music URL is resolving. `loadCurrent` swaps the source and the
    // metadata together once the new stream is actually ready.
    this.state = {
      ...this.state,
      queue,
      index,
      canPrevious: index > 0 || queue.length > 1,
      canNext: index < queue.length - 1 || queue.length > 1,
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
    // Show the new track's title/cover IMMEDIATELY (like local music) so QAM and
    // Big Picture update the instant you press next/previous or pick a track —
    // never waiting for the remote stream to resolve. The old audio is paused so
    // its position can't tick under the new metadata; the progress bar stays at 0
    // until the real `playing` event fires with the new audio.
    audio.pause();
    this.patch({ track, position: 0, length: Number(track?.duration_ms || 0), status: autoPlay ? "Paused" : "Stopped", error: "" });
    const streamUrl = await this.streamUrl(track);
    if (token !== this.loadingToken) return;
    audio.src = `${streamUrl}?v=${encodeURIComponent(String(track?.modifiedAt ?? track?.id ?? Date.now()))}`;
    audio.load();
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
        this.patch({ queue, index: 0 });
        await this.loadCurrent(true);
        return this.state;
      }
      index = 0;
    }
    else return this.state;
    this.patch({ index });
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
    this.patch({ index });
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
    this.patch({ index: nextIndex });
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
    if (this.audioContext) void this.audioContext.close().catch(() => {});
    this.audioContext = null;
    this.analyser = null;
    this.frequencyData = null;
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
      const streamUrl = await this.streamUrl(track);
      if (token !== this.loadingToken) return;
      audio.pause();
      audio.src = `${streamUrl}?v=${encodeURIComponent(String(track?.modifiedAt ?? track?.id ?? "track"))}&recover=${Date.now()}&reason=${encodeURIComponent(reason)}`;
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
