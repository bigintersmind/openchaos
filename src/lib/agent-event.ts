/**
 * Single source of truth for the "Agents Welcome" event window.
 *
 * The leaderboard data builder and the welcome-popup variant both read from
 * here. The automerge workflow mirrors these dates inline (see automerge.yml)
 * because it can't import TS at workflow runtime.
 *
 * When announcing a new event window, update the two ISO strings below and
 * the matching constants in .github/workflows/automerge.yml.
 */

const EVENT_START_ISO = "2026-05-16T00:00:00Z";
const EVENT_END_ISO = "2026-05-30T00:00:00Z";

export interface EventWindow {
  start: Date;
  end: Date;
}

export function getEventWindow(): EventWindow {
  return {
    start: new Date(EVENT_START_ISO),
    end: new Date(EVENT_END_ISO),
  };
}

export function isEventActive(now: Date = new Date()): boolean {
  const w = getEventWindow();
  const t = now.getTime();
  return t >= w.start.getTime() && t < w.end.getTime();
}

export function inEventWindow(when: string | Date): boolean {
  const w = getEventWindow();
  const t = typeof when === "string" ? new Date(when).getTime() : when.getTime();
  if (Number.isNaN(t)) return false;
  return t >= w.start.getTime() && t < w.end.getTime();
}

export const EVENT_RULES_URL =
  "https://github.com/skridlevsky/openchaos/blob/main/SPRINKLES.md#agents-welcome";
