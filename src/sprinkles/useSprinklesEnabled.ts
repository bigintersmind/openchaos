"use client";

import { useEffect, useState } from "react";

export function useSprinklesEnabled(): boolean {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("sprinkles") === "off") {
        setEnabled(false);
      }
    } catch {
      // SSR / non-browser — leave enabled
    }
  }, []);

  return enabled;
}
