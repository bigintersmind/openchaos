"use client";

import { useEffect, useState } from "react";
import type { PageLoadCameoSprinkle } from "../types";

const GLYPHS = ["✨", "✳", "✴", "✪", "✷"];
const DURATION_MS = 1100;

function EntryFireworkCameo() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9998,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes sprinkle-entry-firework {
          0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: var(--sprinkle-target, translate(0, -120px)) scale(1); opacity: 0; }
        }
      `}</style>
      {GLYPHS.map((glyph, i) => {
        const angle = (i / GLYPHS.length) * Math.PI * 2;
        const distance = 90;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              fontSize: "24px",
              animation: `sprinkle-entry-firework ${DURATION_MS}ms ease-out forwards`,
              ["--sprinkle-target" as string]: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`,
            }}
          >
            {glyph}
          </div>
        );
      })}
    </div>
  );
}

export const entryFirework: PageLoadCameoSprinkle = {
  id: "entry-firework",
  kind: "page-load-cameo",
  author: "openchaos",
  Component: EntryFireworkCameo,
  durationMs: DURATION_MS,
};
