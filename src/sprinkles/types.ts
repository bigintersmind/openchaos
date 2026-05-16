import type { ComponentType } from "react";
import type { RouteGroup } from "@/lib/chaos-router";

export type SprinkleKind =
  | "terminal-command"
  | "status-bar-message"
  | "cursor-trail"
  | "page-load-cameo";

interface SprinkleBase<K extends SprinkleKind> {
  id: string;
  kind: K;
  author: string;
  incompatibleThemes?: readonly RouteGroup[];
}

export interface TerminalCommandSprinkle extends SprinkleBase<"terminal-command"> {
  keyword: string;
  response: string | readonly string[];
}

export interface StatusBarMessageSprinkle extends SprinkleBase<"status-bar-message"> {
  message: string;
  weight?: number;
}

export interface CursorTrailSprinkle extends SprinkleBase<"cursor-trail"> {
  glyphs: readonly string[];
  fadeMs?: number;
  throttleMs?: number;
}

export interface PageLoadCameoSprinkle extends SprinkleBase<"page-load-cameo"> {
  Component: ComponentType;
  durationMs?: number;
}

export type Sprinkle =
  | TerminalCommandSprinkle
  | StatusBarMessageSprinkle
  | CursorTrailSprinkle
  | PageLoadCameoSprinkle;

export type SprinkleOfKind<K extends SprinkleKind> = Extract<Sprinkle, { kind: K }>;
