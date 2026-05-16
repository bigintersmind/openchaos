# Sprinkles

A "sprinkle" is the smallest contribution shape in OpenChaos: one file under
`src/sprinkles/seeds/`, one entry in the registry, and you're done.

**5 minutes + a rhyme.**

## What can I sprinkle?

Four kinds, each with its own tiny schema. Pick whichever fits your idea.

### `terminal-command`

A hidden command in `ChaosTerminal` (open with `~`).

```ts
// src/sprinkles/seeds/sneeze.ts
import type { TerminalCommandSprinkle } from "../types";

export const sneeze: TerminalCommandSprinkle = {
  id: "sneeze",
  kind: "terminal-command",
  author: "your-github-handle",
  keyword: "achoo",
  response: [
    "Gesundheit. The chaos catches a cold.",
    "Production status: contagious.",
  ],
};
```

`response` can be a string or a string array (one line per element).

### `status-bar-message`

A new scrolling message in the Web2 status bar.

```ts
// src/sprinkles/seeds/marquee-glee.ts
import type { StatusBarMessageSprinkle } from "../types";

export const marqueeGlee: StatusBarMessageSprinkle = {
  id: "marquee-glee",
  kind: "status-bar-message",
  author: "your-github-handle",
  message: "Did you know? PRs that rhyme get to climb.",
  // weight: 2,  // optional — duplicate in rotation for more airtime
};
```

### `cursor-trail`

A glyph set for the cursor trail. The site picks one compatible trail at random per page load.

```ts
// src/sprinkles/seeds/snow-flow.ts
import type { CursorTrailSprinkle } from "../types";

export const snowFlow: CursorTrailSprinkle = {
  id: "snow-flow",
  kind: "cursor-trail",
  author: "your-github-handle",
  glyphs: ["❄", "❅", "❆", "·"],
  fadeMs: 600,    // optional — how long each glyph stays visible
  throttleMs: 70, // optional — min ms between emits
};
```

### `page-load-cameo`

A brief one-shot visual rendered on page load. Use sparingly — multiple compatible
cameos render at once.

```tsx
// src/sprinkles/seeds/hello-cello.tsx
"use client";

import { useEffect, useState } from "react";
import type { PageLoadCameoSprinkle } from "../types";

function HelloCello() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div style={{ position: "fixed", top: 16, left: "50%", pointerEvents: "none" }}>
      🎻
    </div>
  );
}

export const helloCello: PageLoadCameoSprinkle = {
  id: "hello-cello",
  kind: "page-load-cameo",
  author: "your-github-handle",
  Component: HelloCello,
  durationMs: 900,
};
```

## Theme compatibility

Sprinkles default to compatible with all four themes (`ascii`, `web2`, `newspaper`,
`vaporwave`). If your sprinkle clashes with a particular theme — say, an emoji
trail that breaks the ASCII vibe — declare it:

```ts
incompatibleThemes: ["ascii"],
```

You don't have to study every theme before shipping. Be a good citizen, declare
clashes you spot, and let the community catch the rest.

## How a sprinkle activates

- `terminal-command` — merged into the command table. Hardcoded commands win on a
  keyword collision.
- `status-bar-message` — appended to the rotation list. Use `weight` for more airtime.
- `cursor-trail` — one compatible sprinkle is chosen at random per page load.
- `page-load-cameo` — every compatible sprinkle renders simultaneously on mount.

## Registering your sprinkle

Add an import + entry to `src/sprinkles/registry.ts`:

```ts
import { snowFlow } from "./seeds/snow-flow";

export const SPRINKLES: readonly Sprinkle[] = [
  // ...existing entries
  snowFlow,
];
```

No filesystem auto-discovery. The explicit list keeps review legible.

## Escape hatch

Append `?sprinkles=off` to any URL to disable all sprinkles for that session.
Useful for screenshots, bug reports, and theme development.

## PR rules — unchanged

Sprinkle PRs follow the same rules as any other:

- Title must contain at least two rhyming words (each > 2 characters).
- CI build must pass.
- Net votes ≥ 10 to be merge-eligible.
- Must be conflict-free.

## Why this exists

The asymmetry between drive-by interest and a full theme build (~220 lines, 6+
files) was keeping a lot of would-be contributors as lurkers. A sprinkle is the
smallest legible contribution: one file, one registry line, one rhyming title.

Have at it.

---

## Agents Welcome

OpenChaos runs a 2-week **"Agents Welcome"** event window. During the event:

- Merges run **nightly** at 19:00 UTC (instead of Saturday-only). The schedule
  reverts to weekly automatically when the window closes.
- PRs authored by AI agents are celebrated: each theme renders a per-theme
  agent badge, and a **Showdown** tab in every theme shows the running
  Humans vs Agents leaderboard.

### How to mark a PR as agent-authored

Add an HTML comment to the PR body (invisible in GitHub's rendered markdown,
parsed by the site):

```html
<!-- chaos-agent -->
```

Or, with a tool name:

```html
<!-- chaos-agent: claude -->
<!-- chaos-agent: cursor -->
<!-- chaos-agent: codex -->
```

The tool name is free-form text (truncated to 64 characters). It's used in
the Showdown tab's tool breakdown. Honest opt-in — a badge of honor, not a tax.

The marker mirrors the existing `<!-- chaos-pitch: ... -->` pattern from author
self-promo pitches. It works for external contributors (no GitHub label
required) and for openchaos-bot alike.

### Rules — unchanged

The event does **not** relax any merge rules:

- Rhyming title (2+ rhyming words, each > 2 characters).
- CI must pass.
- Net votes ≥ 10.
- Conflict-free.
- GitHub OAuth required to vote.

The 10-vote threshold is the slop filter. Agents are welcome; low-quality
contributions still need community support to merge.

### Where the event window lives

The start/end dates are defined in one place:

- TypeScript source of truth: [`src/lib/agent-event.ts`](src/lib/agent-event.ts)
- Mirrored constants in [`.github/workflows/automerge.yml`](.github/workflows/automerge.yml)

Update both when announcing a new event window.

### Pre-event smoke test (maintainer note)

Before announcing a new "Agents Welcome" window publicly, the maintainer should
open one hand-authored PR with `<!-- chaos-agent -->` (or `<!-- chaos-agent: tool -->`)
in its body, then confirm:

- The agent badge renders on the PR card in each of the four themes
  (`/ascii`, `/web2`, `/newspaper`, `/vaporwave`).
- The Showdown tab in each theme reflects the PR under "Agents" and includes
  the tool in the tool breakdown when one is specified.
- The welcome popup shows the event-active copy on a fresh visit (clear
  `openchaos_welcome_seen` from localStorage if needed).

If those four checks pass, the announcement is safe to send.

