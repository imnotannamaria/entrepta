import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  type Rgba,
  contrastRatio,
  flatten,
  fromOklch,
  parseColor,
  toOklch,
} from "../lib/color-contrast";

/**
 * Every ink the themes promise, measured in all 14 theme and mode combinations
 * straight from the CSS. This replaces a hand-measured table: change a hex and
 * this recomputes, instead of a copied number quietly going stale.
 */

const STYLES = __dirname;
const THEMES = ["entrepta", "blossom", "marmalade", "julia", "ivy", "bosco", "taylor"] as const;
const MODES = ["dark", "light"] as const;

const read = (file: string) => fs.readFileSync(path.join(STYLES, file), "utf8");
const GLOBALS = read("globals.css");

/** The custom properties declared in the first `selector {` block of a file. */
function declarations(css: string, selector: string): Record<string, string> {
  const start = css.search(new RegExp(`(^|\\n)${escapeRegExp(selector)} \\{`));
  if (start === -1) throw new Error(`no "${selector} {" block`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, "");
  return Object.fromEntries(
    [...clean.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])
  );
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const LIGHT = ':root[data-mode="light"]';
const DARK_SURFACE_IN_LIGHT = ':root[data-mode="light"] [data-surface="dark"]';

/** A theme's own block for a dark surface in a light page, if it has one. */
function darkSurfaceBlock(theme: string): Record<string, string> | null {
  try {
    return declarations(read(`themes/${theme}.css`), DARK_SURFACE_IN_LIGHT);
  } catch {
    return null;
  }
}

/** The tokens in effect for one theme and mode, cascade order preserved. */
function tokens(theme: string, mode: (typeof MODES)[number]): Record<string, string> {
  const themeCss = read(`themes/${theme}.css`);
  return {
    ...declarations(GLOBALS, ":root"),
    ...declarations(themeCss, ":root"),
    ...(mode === "light" ? declarations(GLOBALS, LIGHT) : {}),
    ...(mode === "light" ? declarations(themeCss, LIGHT) : {}),
  };
}

// oklch(from var(--base) L C calc(h + N)), where L and C may be var() too:
// the relative color the chart palette is written in.
const RELATIVE_OKLCH =
  /^oklch\(from var\((--[\w-]+)\) (var\(--[\w-]+\)|[\d.]+) (var\(--[\w-]+\)|[\d.]+) calc\(h \+ (\d+)\)\)$/;

function number(set: Record<string, string>, raw: string): number {
  const value = raw.startsWith("var(") ? set[/var\((--[\w-]+)\)/.exec(raw)?.[1] ?? ""] : raw;
  const n = Number(value);
  if (!value || Number.isNaN(n)) throw new Error(`${raw} is not a number: ${value}`);
  return n;
}

function color(set: Record<string, string>, name: string): Rgba {
  let value = set[name];
  for (let hops = 0; value?.startsWith("var("); hops++) {
    if (hops > 5) throw new Error(`${name} does not resolve`);
    value = set[/var\((--[\w-]+)\)/.exec(value)?.[1] ?? ""];
  }
  const relative = value ? RELATIVE_OKLCH.exec(value) : null;
  if (relative) {
    const [, base, l, c, turn] = relative;
    const { h } = toOklch(color(set, base));
    const turned = fromOklch({ l: number(set, l), c: number(set, c), h: h + Number(turn) });
    if (!turned) throw new Error(`${name} leaves the sRGB gamut: ${value}`);
    return turned;
  }
  const parsed = value ? parseColor(value) : null;
  if (!parsed) throw new Error(`${name} is not a color: ${value}`);
  return parsed;
}

type Check = { ink: string; on: string; tintOver?: string; min: number };

const CHECKS: Check[] = [
  { ink: "--fg-on-brand", on: "--fg-brand", min: 4.5 },
  { ink: "--fg-brand-text", on: "--bg-canvas", min: 4.5 },
  { ink: "--fg-brand-text", on: "--bg-card", min: 4.5 },
  { ink: "--fg-brand-text", on: "--bg-surface-brand", tintOver: "--bg-canvas", min: 5 },
  { ink: "--fg-brand-text", on: "--bg-surface-brand", tintOver: "--bg-card", min: 5 },
  { ink: "--fg-muted", on: "--bg-canvas", min: 4.5 },
  { ink: "--fg-muted", on: "--bg-card", min: 4.5 },
  { ink: "--fg-muted", on: "--bg-overlay", min: 4.5 },
  // text on the brand tint: a selected row, a highlighted menu row, a range
  { ink: "--fg-primary", on: "--bg-surface-brand", tintOver: "--bg-card", min: 4.5 },
  { ink: "--fg-secondary", on: "--bg-surface-brand", tintOver: "--bg-card", min: 4.5 },
  { ink: "--fg-secondary", on: "--bg-surface-brand", tintOver: "--bg-overlay", min: 4.5 },
  // the neutral soft fill: a soft Badge, an Avatar's initials
  { ink: "--fg-secondary", on: "--bg-hover-strong", tintOver: "--bg-canvas", min: 4.5 },
  { ink: "--fg-secondary", on: "--bg-hover-strong", tintOver: "--bg-card", min: 4.5 },
  ...(["success", "warning", "error", "info"] as const).flatMap((status): Check[] => [
    { ink: `--status-${status}-fg`, on: "--bg-canvas", min: 4.5 },
    { ink: `--status-${status}-fg`, on: "--bg-card", min: 4.5 },
    {
      ink: `--status-${status}-fg`,
      on: `--status-${status}-soft`,
      tintOver: "--bg-canvas",
      min: 4.5,
    },
  ]),
];

function measure(set: Record<string, string>, check: Check): number {
  const bg = check.tintOver
    ? flatten([color(set, check.on), color(set, check.tintOver)])
    : color(set, check.on);
  return contrastRatio(color(set, check.ink), bg);
}

function label(check: Check) {
  return check.tintOver ? `${check.on} over ${check.tintOver}` : check.on;
}

describe("theme contrast", () => {
  for (const theme of THEMES) {
    for (const mode of MODES) {
      it(`${theme} ${mode} clears every ink`, () => {
        const set = tokens(theme, mode);
        const failures = CHECKS.map((check) => ({ check, ratio: measure(set, check) }))
          .filter(({ check, ratio }) => ratio < check.min)
          .map(({ check, ratio }) => `${check.ink} on ${label(check)}: ${ratio.toFixed(2)}`);
        expect(failures).toEqual([]);
      });
    }
  }

  // The .sheen glow brightens the top-left corner of cards and overlays, right
  // where a label sits. Measure the inks at its strongest point.
  it("keeps labels readable on the sheen's brightest corner", () => {
    const failures = THEMES.flatMap((theme) =>
      MODES.flatMap((mode) => {
        const set = tokens(theme, mode);
        const base = Number(
          /calc\((\d+)% \* var\(--finish-glow\)\)/.exec(set["--sheen-tint"] ?? "")?.[1]
        );
        expect(base).toBeGreaterThan(0);
        // --finish-glow scales the glow: a flat theme measures the inks on no glow at all
        const pct = base * number(set, "var(--finish-glow)");
        const glow = { ...color(set, "--fg-brand"), a: pct / 100 };
        // a hovered card and an active nav item carry the sheen too
        return (["--bg-card", "--bg-card-hover", "--bg-overlay"] as const).flatMap((on) => {
          const bg = flatten([glow, color(set, on)]);
          return (["--fg-muted", "--fg-secondary", "--fg-brand-text"] as const)
            .map((ink) => ({ ink, on, ratio: contrastRatio(color(set, ink), bg) }))
            .filter(({ ratio }) => ratio < 4.5)
            .map(
              ({ ink, ratio }) => `${theme} ${mode}: ${ink} on sheen over ${on} ${ratio.toFixed(2)}`
            );
        });
      })
    );
    expect(failures).toEqual([]);
  });

  // An Alert swaps the brand in its corner glow for its status, at 12%.
  it("keeps an Alert's text readable on its status glow", () => {
    const failures = THEMES.flatMap((theme) =>
      MODES.flatMap((mode) => {
        const set = tokens(theme, mode);
        return (["success", "warning", "error", "info"] as const).flatMap((status) => {
          const glow = { ...color(set, `--status-${status}`), a: 0.12 };
          const bg = flatten([glow, color(set, "--bg-card")]);
          return (["--fg-primary", "--fg-secondary"] as const)
            .map((ink) => ({ ink, ratio: contrastRatio(color(set, ink), bg) }))
            .filter(({ ratio }) => ratio < 4.5)
            .map(
              ({ ink, ratio }) => `${theme} ${mode}: ${ink} on ${status} glow ${ratio.toFixed(2)}`
            );
        });
      })
    );
    expect(failures).toEqual([]);
  });

  it('keeps [data-surface="dark"] readable inside a light page', () => {
    const set = {
      ...tokens("entrepta", "light"),
      ...declarations(GLOBALS, '[data-surface="dark"]'),
    };
    const muted = ["--bg-canvas", "--bg-card", "--bg-overlay", "--bg-surface"].map((on) =>
      contrastRatio(color(set, "--fg-muted"), color(set, on))
    );
    expect(Math.min(...muted)).toBeGreaterThanOrEqual(4.5);
  });

  // A theme whose brand is the page's ink brings the dark values back inside a
  // dark surface in a light page. Every ink is measured there too.
  it("keeps every ink readable on a dark surface in a light page, where a theme sets one", () => {
    const themes = THEMES.filter((theme) => darkSurfaceBlock(theme));
    expect(themes).toContain("taylor");
    const failures = themes.flatMap((theme) => {
      const set = {
        ...tokens(theme, "light"),
        ...declarations(GLOBALS, '[data-surface="dark"]'),
        ...darkSurfaceBlock(theme),
      };
      return CHECKS.map((check) => ({ check, ratio: measure(set, check) }))
        .filter(({ check, ratio }) => ratio < check.min)
        .map(
          ({ check, ratio }) => `${theme}: ${check.ink} on ${label(check)}: ${ratio.toFixed(2)}`
        );
    });
    expect(failures).toEqual([]);
  });

  // Series, bars and IconTile glyphs are graphics: 3:1 against what they sit
  // on. An IconTile draws the color over 15% of itself on the card.
  const PALETTE = Array.from({ length: 8 }, (_, i) => `--chart-${i + 1}`);

  it("keeps every chart color at 3:1 on the card and on its own tile, inside sRGB", () => {
    const measure = (set: Record<string, string>, id: string) =>
      PALETTE.flatMap((name) => {
        const ink = color(set, name);
        const card = color(set, "--bg-card");
        const tile = flatten([{ ...ink, a: 0.15 }, card]);
        return [
          { where: "card", ratio: contrastRatio(ink, card) },
          { where: "tile", ratio: contrastRatio(ink, tile) },
        ]
          .filter(({ ratio }) => ratio < 3)
          .map(({ where, ratio }) => `${id}: ${name} on ${where} ${ratio.toFixed(2)}`);
      });
    const low = [
      ...THEMES.flatMap((theme) =>
        MODES.flatMap((mode) => measure(tokens(theme, mode), `${theme} ${mode}`))
      ),
      // a dark surface inside a light page gets the dark palette
      ...THEMES.flatMap((theme) =>
        measure(
          { ...tokens(theme, "light"), ...declarations(GLOBALS, '[data-surface="dark"]') },
          `${theme} dark surface`
        )
      ),
    ];
    expect(low).toEqual([]);
  });

  it("derives the palette from the brand, with no fixed color", () => {
    const set = tokens("entrepta", "dark");
    const brandHue = toOklch(color(set, "--fg-brand")).h;
    expect(toOklch(color(set, "--chart-1")).h).toBeCloseTo(brandHue, 0);
    expect(set["--chart-from"]).toBe("var(--fg-brand)");
    for (const name of PALETTE) expect(set[name]).toMatch(RELATIVE_OKLCH);
    const hues = PALETTE.map((name) => Math.round(toOklch(color(set, name)).h));
    expect(new Set(hues).size).toBe(8);
  });

  // The monochrome theme has no hue to turn, so it names where the charts start.
  it("starts taylor's charts from a hue of their own and eight apart", () => {
    const set = tokens("taylor", "dark");
    expect(set["--chart-from"]).not.toContain("var(");
    const hues = PALETTE.map((name) => Math.round(toOklch(color(set, name)).h));
    expect(new Set(hues).size).toBe(8);
    expect(toOklch(color(set, "--chart-1")).h).toBeCloseTo(
      toOklch(color(set, "--chart-from")).h,
      0
    );
  });

  // The theme files hold every knob a project is told to change.
  it("keeps the finish knob in every theme, and flat only in taylor", () => {
    for (const theme of THEMES) {
      const glow = declarations(read(`themes/${theme}.css`), ":root")["--finish-glow"];
      expect(glow, theme).toBe(theme === "taylor" ? "0" : "1");
    }
  });

  // The brand itself is only for fills, borders, glyphs and large text.
  it("keeps --fg-brand at 3:1 for large text in every combination", () => {
    const low = THEMES.flatMap((theme) =>
      MODES.map((mode) => {
        const set = tokens(theme, mode);
        return {
          id: `${theme} ${mode}`,
          ratio: contrastRatio(color(set, "--fg-brand"), color(set, "--bg-canvas")),
        };
      })
    ).filter(({ ratio }) => ratio < 3);
    expect(low).toEqual([]);
  });
});
