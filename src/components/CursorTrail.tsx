"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useThemePath } from "@/context/ThemePathContext";
import { SPRINKLES } from "@/sprinkles/registry";
import { sprinklesForTheme } from "@/sprinkles/filter";
import { useSprinklesEnabled } from "@/sprinkles/useSprinklesEnabled";

interface CursorPoint {
  id: number;
  x: number;
  y: number;
  glyph: string;
}

const DEFAULT_GLYPH = "·";
const DEFAULT_FADE_MS = 500;
const DEFAULT_THROTTLE_MS = 80;

export function CursorTrail() {
  const [cursors, setCursors] = useState<CursorPoint[]>([]);
  const [konamiOverride, setKonamiOverride] = useState<string | null>(null);
  const glyphIndexRef = useRef(0);

  const theme = useThemePath();
  const sprinklesEnabled = useSprinklesEnabled();

  const eligible = useMemo(
    () => sprinklesForTheme(SPRINKLES, "cursor-trail", theme),
    [theme],
  );

  // Pick one compatible sprinkle at random per mount (per page load).
  const active = useMemo(() => {
    if (!sprinklesEnabled || eligible.length === 0) return null;
    return eligible[Math.floor(Math.random() * eligible.length)];
  }, [eligible, sprinklesEnabled]);

  const glyphs = active?.glyphs ?? [DEFAULT_GLYPH];
  const fadeMs = active?.fadeMs ?? DEFAULT_FADE_MS;
  const throttleMs = active?.throttleMs ?? DEFAULT_THROTTLE_MS;

  useEffect(() => {
    let cursorId = 0;

    const emit = (e: MouseEvent) => {
      const glyph = konamiOverride ?? glyphs[glyphIndexRef.current % glyphs.length];
      glyphIndexRef.current += 1;
      const point: CursorPoint = {
        id: cursorId++,
        x: e.clientX,
        y: e.clientY,
        glyph,
      };
      setCursors((prev) => [...prev, point]);
      setTimeout(() => {
        setCursors((prev) => prev.filter((c) => c.id !== point.id));
      }, fadeMs);
    };

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const throttled = (e: MouseEvent) => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        emit(e);
        throttleTimer = null;
      }, throttleMs);
    };

    window.addEventListener("mousemove", throttled);
    return () => {
      window.removeEventListener("mousemove", throttled);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [glyphs, fadeMs, throttleMs, konamiOverride]);

  useEffect(() => {
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let pos = 0;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === code[pos].toLowerCase() || e.key === code[pos]) {
        pos++;
        if (pos === code.length) {
          setKonamiOverride("🔫");
          pos = 0;
        }
      } else {
        pos = 0;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div style={{ pointerEvents: "none", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999 }}>
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          className="cursor-trail-emoji"
          style={{
            position: "absolute",
            left: cursor.x,
            top: cursor.y,
            transform: "translate(-50%, -50%)",
            fontSize: "12px",
            userSelect: "none",
            color: "#2a5db0",
            opacity: 0.6,
          }}
        >
          {cursor.glyph}
        </div>
      ))}
    </div>
  );
}
