import { z } from "zod";

/**
 * The colour themes of `@forthtilliath/shadcn-ui/styles/themes`, scoped under
 * `:root[data-palette="<name>"]` by `scripts/generate-palettes.mjs` — which
 * fails if this list and the themes folder drift apart.
 */
export const PALETTES = [
  "blue",
  "brutalist",
  "bubblegum",
  "claymorphism",
  "crt",
  "default",
  "glass",
  "green",
  "memphis",
  "newspaper",
  "orange",
  "pixel",
  "red",
  "rose",
  "sketch",
  "synthwave",
  "twitter",
  "violet",
  "yellow",
] as const;

export type Palette = (typeof PALETTES)[number];

/** Imported unscoped by `globals.css`: the palette without JS, or nothing stored. */
export const DEFAULT_PALETTE: Palette = "twitter";

export const PALETTE_STORAGE_KEY = "palette";

/** localStorage can be edited by anyone: only a known palette is applied. */
export const paletteSchema = z.enum(PALETTES);

/**
 * Applies the stored palette before the first paint, like next-themes does
 * for the mode (no flash of the default palette). Same format as
 * `usePersistentState` (JSON), same check as `paletteSchema`.
 */
export const paletteScript = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(PALETTE_STORAGE_KEY)}));if(${JSON.stringify(PALETTES)}.indexOf(p)!==-1)document.documentElement.dataset.palette=p}catch(e){}})()`;
