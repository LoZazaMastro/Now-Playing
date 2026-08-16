import { DialogButton, Focusable, GamepadButton } from "@decky/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { localAudioPlayer } from "./localAudio";
import { getTranslations } from "./i18n";
import * as python from "./python";

// WebAudio discrete channel order: FL, FR, FC, LFE, SL, SR, BL, BR.
// 5.1 uses the first 6; 7.1 uses all 8.
const SPEAKER_LABELS = ["FL", "FR", "C", "LFE", "SL", "SR", "BL", "BR"];

// Single shared "Upmix surround" card (used once in the settings, not per source).
// Expands to a 5.1 / 7.1 selector and per-speaker volumes. Applies to the
// in-browser player (Your Music + YouTube Music); Spotify uses its own bridge.
export function SurroundUpmixControls({ accent = "#66c0f4", cardStyle }: { accent?: string; cardStyle?: CSSProperties }) {
  const t = useMemo(() => getTranslations("core"), []);
  const [mode, setMode] = useState<"off" | "5.1" | "7.1">(() => localAudioPlayer.getSurroundMode());
  const [expanded, setExpanded] = useState(false);
  const [volumes, setVolumes] = useState<number[]>(() => localAudioPlayer.getSpeakerVolumes());
  const backendSyncTimer = useRef<number>(0);
  const channels = mode === "7.1" ? 8 : mode === "5.1" ? 6 : 0;

  useEffect(() => {
    let active = true;
    void python.getSurroundSettings().then((saved) => {
      if (!active) return;
      setMode(saved.mode);
      setVolumes(saved.speakerVolumes);
      localAudioPlayer.setSurroundMode(saved.mode);
      saved.speakerVolumes.forEach((value, index) => localAudioPlayer.setSpeakerVolume(index, value));
    }).catch(() => {});
    return () => {
      active = false;
      if (backendSyncTimer.current) window.clearTimeout(backendSyncTimer.current);
    };
  }, []);

  const syncBackend = (nextMode: "off" | "5.1" | "7.1", nextVolumes: number[]) => {
    if (backendSyncTimer.current) window.clearTimeout(backendSyncTimer.current);
    backendSyncTimer.current = window.setTimeout(() => void python.setSurroundSettings(nextMode, nextVolumes), 180);
  };

  const choose = (target: "5.1" | "7.1") => {
    const next = mode === target ? "off" : target;
    setMode(next);
    localAudioPlayer.setSurroundMode(next);
    syncBackend(next, volumes);
  };
  const setVol = (index: number, value: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    setVolumes((prev) => {
      const next = [...prev];
      next[index] = clamped;
      syncBackend(mode, next);
      return next;
    });
    localAudioPlayer.setSpeakerVolume(index, clamped);
  };
  const nudge = (index: number) => (event: any) => {
    const key = event?.detail?.key ?? event?.key;
    const button = event?.detail?.button;
    const delta = key === "ArrowLeft" || key === "Left" || button === GamepadButton.DIR_LEFT ? -5
      : key === "ArrowRight" || key === "Right" || button === GamepadButton.DIR_RIGHT ? 5 : 0;
    if (!delta) return;
    event?.preventDefault?.();
    event?.stopPropagation?.();
    setVol(index, (volumes[index] ?? 100) + delta);
  };

  const modeButton = (target: "5.1" | "7.1") => (
    <DialogButton
      style={{ flex: 1, minWidth: 0, height: 40, minHeight: 40, padding: 0, opacity: mode === target ? 1 : 0.6, border: mode === target ? `1px solid ${accent}` : undefined }}
      onClick={() => choose(target)}
    >
      <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: mode === target ? accent : undefined }}>{target}</span>
    </DialogButton>
  );

  return (
    <div style={{ width: "100%", boxSizing: "border-box", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.035)", ["--sp-accent" as any]: accent, ...cardStyle }}>
      <style>{`
        .npSpeakerRow.gpfocus, .npSpeakerRow:focus, .npSpeakerRow:focus-visible {
          border-color: var(--sp-accent, #fff) !important;
          box-shadow: 0 0 0 1px var(--sp-accent, #fff), 0 0 14px color-mix(in srgb, var(--sp-accent, #fff) 40%, transparent) !important;
        }
      `}</style>
      <DialogButton style={{ width: "100%", minWidth: "100%" }} onClick={() => setExpanded((value) => !value)}>
        <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", boxSizing: "border-box" }}>
          <span style={{ fontWeight: 600 }}>{t.surroundUpmix}{mode !== "off" ? <span style={{ color: accent, marginLeft: 8, fontSize: ".82em" }}>{mode}</span> : null}</span>
          {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </span>
      </DialogButton>
      {expanded ? (
        <>
          <p style={{ margin: "9px 4px 8px", fontSize: "0.68em", lineHeight: 1.42, opacity: 0.6 }}>{t.surroundUpmixHint}</p>
          <Focusable flow-children="horizontal" style={{ display: "flex", gap: "8px" }}>
            {modeButton("5.1")}
            {modeButton("7.1")}
          </Focusable>
          {channels > 0 ? (
            <Focusable flow-children="vertical" style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
              {SPEAKER_LABELS.slice(0, channels).map((label, index) => (
                <Focusable
                  key={label}
                  className="npSpeakerRow"
                  role="slider"
                  noFocusRing
                  onActivate={() => undefined}
                  onButtonDown={nudge(index)}
                  onKeyDown={nudge(index)}
                  tabIndex={0}
                  {...({ focusable: true } as any)}
                  aria-label={label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={volumes[index]}
                  style={{ display: "grid", gridTemplateColumns: "48px minmax(0,1fr) 40px", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "7px", border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.03)" }}
                >
                  <span style={{ fontSize: ".76em", fontWeight: 700 }}>{label}</span>
                  <div style={{ position: "relative", height: "6px", borderRadius: "999px", background: "rgba(255,255,255,.15)", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, width: `${volumes[index]}%`, background: accent, borderRadius: "999px" }} />
                  </div>
                  <strong style={{ fontSize: ".72em", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{volumes[index]}</strong>
                </Focusable>
              ))}
            </Focusable>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
