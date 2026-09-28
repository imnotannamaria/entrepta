import { parseColor, toOklch } from "./color-contrast";

/**
 * The colors a series can take, by name: the eight palette colors, which
 * follow the brand in every theme, and the statuses for results above and
 * below zero, the one job they have in a chart. Charts, sparklines and bar
 * lists all read this, so a series named "chart-3" is the same color in each.
 */
export const PALETTE = {
  "chart-1": "var(--chart-1)",
  "chart-2": "var(--chart-2)",
  "chart-3": "var(--chart-3)",
  "chart-4": "var(--chart-4)",
  "chart-5": "var(--chart-5)",
  "chart-6": "var(--chart-6)",
  "chart-7": "var(--chart-7)",
  "chart-8": "var(--chart-8)",
  success: "var(--status-success)",
  error: "var(--status-error)",
  neutral: "var(--fg-muted)",
} as const;

export type PaletteKey = keyof typeof PALETTE;

/** A palette key's token, or the CSS color given, as is. */
export function paletteColor(color: PaletteKey | (string & {})): string {
  // own keys only: `in` would also find "toString" and "constructor" on the prototype
  return Object.hasOwn(PALETTE, color) ? PALETTE[color as PaletteKey] : color;
}

// Where each hue name starts, in OKLCH degrees. The palette is the brand's
// hue turned in steps of 45°, and a brand shifts a few degrees between dark
// and light, so no boundary sits between a theme's two shades: a swatch keeps
// its name when the mode changes. The six themes are checked in the tests;
// a new brand may want these nudged. Every range is under 45°, so no two
// swatches of one theme share a name.
const HUE_STARTS: readonly [number, string][] = [
  [9.3, "Red"],
  [40, "Orange"],
  [67.5, "Amber"],
  [91.7, "Yellow"],
  [116.5, "Lime"],
  [136.7, "Green"],
  [165, "Teal"],
  [195, "Cyan"],
  [224, "Sky"],
  [250.2, "Blue"],
  [268.5, "Indigo"],
  [278.9, "Violet"],
  [302, "Purple"],
  [324.3, "Magenta"],
  [346.5, "Pink"],
];

/** The plain name of an OKLCH hue: 284, the entrepta brand, is "Violet"; 25 is "Red". */
export function hueName(hue: number): string {
  const h = ((hue % 360) + 360) % 360;
  let name = HUE_STARTS[HUE_STARTS.length - 1][1];
  for (const [start, label] of HUE_STARTS) if (h >= start) name = label;
  return name;
}

/**
 * The OKLCH hue of a color as getComputedStyle gives it: `oklch(…)` from the
 * relative color the palette is built with, or `rgb(…)`. Null for anything
 * else, or a gray with no hue to speak of.
 */
export function colorHue(computed: string): number | null {
  const oklch = /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i.exec(computed.trim());
  if (oklch) return Number(oklch[2]) < 0.02 ? null : Number(oklch[3]);
  const rgb = parseColor(computed);
  if (!rgb) return null;
  const { c, h } = toOklch(rgb);
  return c < 0.02 ? null : h;
}
