import type { RouteGroup } from "@/lib/chaos-router";
import { ROUTE_GROUPS } from "@/lib/chaos-router";
import type { Sprinkle, SprinkleKind, SprinkleOfKind } from "./types";

function isRouteGroup(theme: string): theme is RouteGroup {
  return (ROUTE_GROUPS as readonly string[]).includes(theme);
}

export function sprinklesForTheme<K extends SprinkleKind>(
  sprinkles: readonly Sprinkle[],
  kind: K,
  theme: string,
): SprinkleOfKind<K>[] {
  const ofKind = sprinkles.filter(
    (s): s is SprinkleOfKind<K> => s.kind === kind,
  );
  if (!isRouteGroup(theme)) {
    return ofKind;
  }
  return ofKind.filter((s) => !s.incompatibleThemes?.includes(theme));
}
