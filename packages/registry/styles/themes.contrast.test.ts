import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { type Rgba, contrastRatio, flatten, parseColor } from "../lib/color-contrast";

/**
 * Every ink the themes promise, measured in all 12 theme and mode combinations
 * straight from the CSS. This replaces a hand-measured table: change a hex and
 * this recomputes, instead of a copied number quietly going stale.
 */

const STYLES = __dirname;
const THEMES = ["entrepta", "blossom", "marmalade", "julia", "ivy", "bosco"] as const;
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

function color(set: Record<string, string>, name: string): Rgba {
  let value = set[name];
  for (let hops = 0; value?.startsWith("var("); hops++) {
    if (hops > 5) throw new Error(`${name} does not resolve`);
    value = set[/var\((--[\w-]+)\)/.exec(value)?.[1] ?? ""];
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
        const pct = Number(/(\d+)%/.exec(set["--sheen-tint"] ?? "")?.[1]);
        expect(pct).toBeGreaterThan(0);
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
