import type { TerminalCommandSprinkle } from "../types";

export const chaosFortune: TerminalCommandSprinkle = {
  id: "chaos-fortune",
  kind: "terminal-command",
  author: "openchaos",
  keyword: "sprinkle",
  response: [
    "A sprinkle drifts in on the wind —",
    "your PR might just merge in the end.",
    "",
    "Type `help` for the full menu of chaos.",
  ],
};
