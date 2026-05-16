"use client";

import { useMemo } from "react";
import { useThemePath } from "@/context/ThemePathContext";
import { SPRINKLES } from "./registry";
import { sprinklesForTheme } from "./filter";
import { useSprinklesEnabled } from "./useSprinklesEnabled";

interface SprinklesProps {
  kind: "page-load";
}

export function Sprinkles({ kind }: SprinklesProps) {
  const theme = useThemePath();
  const enabled = useSprinklesEnabled();

  const cameos = useMemo(
    () => sprinklesForTheme(SPRINKLES, "page-load-cameo", theme),
    [theme],
  );

  if (!enabled) return null;
  if (kind !== "page-load") return null;
  if (cameos.length === 0) return null;

  return (
    <>
      {cameos.map((sprinkle) => {
        const Cameo = sprinkle.Component;
        return <Cameo key={sprinkle.id} />;
      })}
    </>
  );
}
