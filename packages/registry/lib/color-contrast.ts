/**
 * WCAG contrast, computed rather than remembered. A measured ratio copied into
 * a table goes stale the day a hex changes, and nothing says so.
 *
 * Pure arithmetic with no DOM, so it runs in tests and in the browser alike.
 */

export type Rgba = { r: number; g: number; b: number; a: number };

/**
 * Parses `rgb(r, g, b)`, `rgb(r g b / a)` and the same with `rgba`, which is
 * what `getComputedStyle` returns for a color. Returns null for anything else,
 * including an unevaluated `color-mix(...)`, instead of scraping its digits.
 */
export function parseRgb(value: string): Rgba | null {
  const body = /^rgba?\(([^)]*)\)$/i.exec(value.trim());
  if (!body) return null;

  const nums = body[1].match(/-?[\d.]+%?/g);
  if (!nums || nums.length < 3) return null;

  const channel = (raw: string) => {
    const n = Number.parseFloat(raw);
    return raw.endsWith("%") ? (n / 100) * 255 : n;
  };

  const alphaRaw = nums[3];
  const a = alphaRaw
    ? alphaRaw.endsWith("%")
      ? Number.parseFloat(alphaRaw) / 100
      : Number.parseFloat(alphaRaw)
    : 1;

  return { r: channel(nums[0]), g: channel(nums[1]), b: channel(nums[2]), a };
}

/** Parses `#rgb`, `#rrggbb` and `#rrggbbaa`. */
export function parseHex(value: string): Rgba | null {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value.trim())?.[1];
  if (!hex) return null;
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const byte = (i: number) => Number.parseInt(full.slice(i, i + 2), 16);
  return { r: byte(0), g: byte(2), b: byte(4), a: full.length === 8 ? byte(6) / 255 : 1 };
}

/** A hex or rgb() color, or null. */
export function parseColor(value: string): Rgba | null {
  return parseHex(value) ?? parseRgb(value);
}

/**
 * What a translucent color looks like over what is behind it. Text on the
 * brand tint sits on the brand at 8 to 15% over the canvas, a third color that
 * is neither, so the tint has to be flattened before measuring against it.
 */
export function composite(fg: Rgba, bg: Rgba): Rgba {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (f: number, b: number) => (f * fg.a + b * bg.a * (1 - fg.a)) / a;
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a };
}

/** Flattens a stack of layers, front to back. The last one has to be opaque. */
export function flatten(layers: Rgba[]): Rgba {
  return layers.reduce((over, under) => composite(over, under));
}

/** WCAG 2.x relative luminance. */
function luminance({ r, g, b }: Rgba): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** The ratio between two opaque colors, 1 to 21. Flatten anything translucent first. */
export function contrastRatio(a: Rgba, b: Rgba): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** AA is 4.5 for body text and 3 for large text; AAA is 7. */
export function wcagGrade(ratio: number, large = false): "AAA" | "AA" | "fail" {
  if (ratio >= 7) return "AAA";
  if (ratio >= (large ? 3 : 4.5)) return "AA";
  return "fail";
}
