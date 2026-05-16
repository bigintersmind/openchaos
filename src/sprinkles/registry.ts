import type { Sprinkle } from "./types";
import { chaosFortune } from "./seeds/chaos-fortune";
import { rhymeOfTheDay } from "./seeds/rhyme-of-the-day";
import { sparkleTrail } from "./seeds/sparkle-trail";
import { entryFirework } from "./seeds/entry-firework";

/**
 * Every sprinkle in the site is registered here. Adding a sprinkle = adding
 * one implementation file under seeds/ plus one entry below. Explicit list
 * keeps narrowing easy and contribution review legible.
 */
export const SPRINKLES: readonly Sprinkle[] = [
  chaosFortune,
  rhymeOfTheDay,
  sparkleTrail,
  entryFirework,
];
