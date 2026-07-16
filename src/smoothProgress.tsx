import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

type SmoothProgressFillProps = {
  position: number;
  duration: number;
  playing: boolean;
  sampledAt: number;
  style?: CSSProperties;
};

export function SmoothProgressFill({ position, duration, playing, sampledAt, style }: SmoothProgressFillProps) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const base = Math.max(0, Number(position || 0));
    const total = Math.max(1, Number(duration || 1));
    const receivedAt = Math.max(0, Number(sampledAt || Date.now()));

    const draw = () => {
      const elapsed = playing ? Math.max(0, Date.now() - receivedAt) : 0;
      const ratio = Math.max(0, Math.min(1, (base + elapsed) / total));
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${ratio})`;
      if (playing && ratio < 1) frame = window.requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [duration, playing, position, sampledAt]);

  return (
    <div
      ref={fillRef}
      aria-hidden="true"
      style={{ width: "100%", transform: "scaleX(0)", transformOrigin: "left center", willChange: "transform", ...style }}
    />
  );
}
