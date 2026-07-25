import { FaRedoAlt } from "react-icons/fa";

// Shared repeat glyph so the QAM and every Big Picture render an identical
// icon for repeat off / all / one. "off" and "all" use the plain redo arrow;
// "one" overlays a small "1" badge (matching the QAM RepeatIcon).
export function RepeatIcon({ one, size }: { one?: boolean; size?: number }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <FaRedoAlt size={size} />
      {one ? (
        <span style={{ position: "absolute", right: "-6px", bottom: "-6px", fontSize: "0.64em", fontWeight: 700, lineHeight: 1 }}>1</span>
      ) : null}
    </span>
  );
}
