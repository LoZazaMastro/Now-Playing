import { localAudioPlayer } from "./localAudio";
import * as python from "./python";

export type VisualLevels = { energy: number; bass: number; mid: number; treble: number };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Shared live-level feed for the Spotify integrated player.
 *
 * The playback bridge refreshes its PCM RMS meter every 32 ms; this feed polls
 * a dedicated lightweight backend method at a visual rate while at least one
 * fullscreen visualizer is mounted, and interpolates between samples.
 */
class SpotifyLevelFeed {
  private users = 0;
  private timer = 0;
  private polling = false;
  private level = 0;
  private previousLevel = 0;
  private sampleAt = 0;
  private playing = false;
  private lastSuccess = 0;

  retain() {
    this.users += 1;
    if (this.users === 1) this.start();
  }

  release() {
    this.users = Math.max(0, this.users - 1);
    if (!this.users) this.stop();
  }

  private start() {
    const poll = async () => {
      if (this.polling) return;
      this.polling = true;
      try {
        const result = await python.getSpotifyAudioLevel();
        const value = Number(result?.level);
        if (Number.isFinite(value) && value >= 0) {
          this.previousLevel = this.level;
          this.level = clamp01(value);
          this.sampleAt = performance.now();
          this.playing = Boolean(result?.playing);
          this.lastSuccess = this.sampleAt;
        }
      } catch {
        // Transient backend hiccups fall back to the synthetic pulse.
      } finally {
        this.polling = false;
      }
    };
    void poll();
    this.timer = window.setInterval(() => void poll(), 160);
  }

  private stop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = 0;
  }

  read(): { level: number; playing: boolean } | null {
    if (performance.now() - this.lastSuccess > 1600) return null;
    const progress = clamp01((performance.now() - this.sampleAt) / 170);
    return { level: this.previousLevel + (this.level - this.previousLevel) * progress, playing: this.playing };
  }
}

const spotifyFeed = new SpotifyLevelFeed();

/**
 * Musical fallback pulse so the visualizers never freeze, even when no live
 * measurement is available (analyser blocked, bridge briefly unreachable).
 */
function syntheticLevels(seconds: number, intensity: number): VisualLevels {
  const beat = Math.pow(Math.max(0, Math.sin(seconds * Math.PI * 2 * 1.02)), 3);
  const half = Math.pow(Math.max(0, Math.sin(seconds * Math.PI * 2 * 0.51 + 0.6)), 2);
  const bass = (0.34 + beat * 0.5) * intensity;
  const mid = (0.3 + half * 0.28 + Math.sin(seconds * 2.3) * 0.08) * intensity;
  const treble = (0.24 + Math.abs(Math.sin(seconds * 5.2 + 1.3)) * 0.26) * intensity;
  return {
    bass: clamp01(bass),
    mid: clamp01(mid),
    treble: clamp01(treble),
    energy: clamp01(bass * 0.5 + mid * 0.34 + treble * 0.16),
  };
}

/** Mount-scoped retain of the live Spotify feed. Returns the release callback. */
export function retainVisualizerAudio(useLocalAudio: boolean): () => void {
  if (!useLocalAudio) {
    spotifyFeed.retain();
    return () => spotifyFeed.release();
  }
  return () => {};
}

// Per-band response weighting, in order of prominence: bass detection is
// boosted 20%; treble reacts at 70% of bass; mid at 30% of bass.
const BASS_GAIN = 1.2;
const TREBLE_GAIN = BASS_GAIN * 0.7;
const MID_GAIN = BASS_GAIN * 0.3;
class AdaptiveSourceGain {
  private peak = 0.18;
  private gain = 1;

  apply(levels: VisualLevels): VisualLevels {
    const inputPeak = Math.max(levels.energy, levels.bass, levels.mid, levels.treble);
    if (inputPeak > 0.004) {
      // Follow louder transients quickly, then decay slowly so quiet masters get
      // compensated without pumping every beat or clipping louder tracks.
      this.peak = inputPeak > this.peak
        ? this.peak * 0.72 + inputPeak * 0.28
        : Math.max(0.055, this.peak * 0.996);
    }
    // Target a ~0.72 output peak so the local/YouTube Music analyser reaches the
    // same visual intensity as Spotify's bridge PCM level (which drives bands up
    // to ~1.0). The old 0.48 target left them visibly weaker.
    const targetGain = Math.min(6, Math.max(1, 0.72 / Math.max(0.055, this.peak)));
    this.gain += (targetGain - this.gain) * (targetGain > this.gain ? 0.08 : 0.035);
    return {
      bass: clamp01(levels.bass * this.gain),
      mid: clamp01(levels.mid * this.gain),
      treble: clamp01(levels.treble * this.gain),
      energy: clamp01(levels.energy * this.gain),
    };
  }

  relax() {
    this.peak = this.peak * 0.99 + 0.18 * 0.01;
    this.gain += (1 - this.gain) * 0.03;
  }
}

// One adaptive gain for every in-browser source (local files AND YouTube Music).
// Local music previously used the raw analyser bands with no compensation, which
// is why its effects looked weaker than Spotify's.
const localAudioGain = new AdaptiveSourceGain();

function weighBands(levels: VisualLevels): VisualLevels {
  const bass = clamp01(levels.bass * BASS_GAIN);
  const mid = clamp01(levels.mid * MID_GAIN);
  const treble = clamp01(levels.treble * TREBLE_GAIN);
  return { bass, mid, treble, energy: clamp01(bass * 0.5 + mid * 0.34 + treble * 0.16) };
}

/**
 * Per-frame levels for a fullscreen visualizer.
 *
 * Priority: real Web Audio bands (local/YouTube Music), real bridge PCM level
 * (Spotify) expanded into bands, then the synthetic pulse — strong while
 * playing, gentle breathing while paused. Every path is passed through the
 * band weighting so the response order (bass > treble > mid) is consistent.
 */
export function readVisualizerLevels(useLocalAudio: boolean, isPlayingHint: boolean, seconds: number): VisualLevels {
  if (useLocalAudio) {
    const measured = localAudioPlayer.getAudioLevels();
    // Normalise the analyser loudness with the adaptive gain, then derive the
    // bands from the resulting ENERGY exactly the same way the Spotify path does
    // below. Local music and YouTube Music therefore react with the same
    // intensity as Spotify instead of looking weaker (their raw analyser bands
    // read much lower than Spotify's bridge PCM level).
    const gained = localAudioGain.apply(measured);
    if (gained.energy > 0.006) {
      const shape = syntheticLevels(seconds, 1);
      return weighBands({
        energy: clamp01(gained.energy),
        bass: clamp01(gained.energy * (0.75 + shape.bass * 0.5)),
        mid: clamp01(gained.energy * (0.7 + shape.mid * 0.5)),
        treble: clamp01(gained.energy * (0.6 + shape.treble * 0.55)),
      });
    }
    const playing = localAudioPlayer.getSnapshot().status === "Playing" || isPlayingHint;
    return weighBands(syntheticLevels(seconds, playing ? 0.8 : 0.16));
  }
  // Spotify uses the bridge PCM feed, not the browser analyser: let the local
  // adaptive gain drift back to neutral so it starts fresh next local/YTM track.
  localAudioGain.relax();
  const feed = spotifyFeed.read();
  if (feed && feed.playing && feed.level > 0.015) {
    const shape = syntheticLevels(seconds, 1);
    return weighBands({
      energy: clamp01(feed.level),
      bass: clamp01(feed.level * (0.75 + shape.bass * 0.5)),
      mid: clamp01(feed.level * (0.7 + shape.mid * 0.5)),
      treble: clamp01(feed.level * (0.6 + shape.treble * 0.55)),
    });
  }
  const playing = feed ? feed.playing : isPlayingHint;
  return weighBands(syntheticLevels(seconds, playing ? 0.8 : 0.16));
}
