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

export type Oklch = { l: number; c: number; h: number };

const toLinear = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (c: number) =>
  255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** An sRGB color in OKLCH, with the hue in degrees. */
export function toOklch({ r, g, b }: Rgba): Oklch {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

/**
 * An OKLCH color in sRGB, or null when it falls outside the sRGB gamut. A
 * browser would map such a color back in, so a palette meant to be measured
 * has to stay inside it.
 */
export function fromOklch({ l, c, h }: Oklch, alpha = 1): Rgba | null {
  const A = c * Math.cos((h * Math.PI) / 180);
  const B = c * Math.sin((h * Math.PI) / 180);
  const lc = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const mc = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const sc = (l - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const linear = [
    4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  ];
  const EPSILON = 1e-4;
  if (linear.some((v) => v < -EPSILON || v > 1 + EPSILON)) return null;
  const [r, g, b] = linear.map((v) => fromLinear(Math.min(1, Math.max(0, v))));
  return { r, g, b, a: alpha };
}

/** AA is 4.5 for body text and 3 for large text; AAA is 7. */
export function wcagGrade(ratio: number, large = false): "AAA" | "AA" | "fail" {
  if (ratio >= 7) return "AAA";
  if (ratio >= (large ? 3 : 4.5)) return "AA";
  return "fail";
}
