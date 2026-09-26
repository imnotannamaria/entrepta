import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { THEMES, type Theme, buildThemesCss, scopeTheme } from "../utils/themes-css.js";

const THEMES_DIR = path.resolve(__dirname, "../../../registry/styles/themes");
const FILES = Object.fromEntries(
  THEMES.map((t) => [t, fs.readFileSync(path.join(THEMES_DIR, `${t}.css`), "utf8")])
) as Record<Theme, string>;

/** Selectors in the order they appear, one entry per rule. */
function selectors(css: string): string[] {
  return [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{/g)].map((m) =>
    m[1].trim().replace(/\s*\n\s*/g, " ")
  );
}

describe("scopeTheme", () => {
  it("scopes a theme under data-theme", () => {
    expect(selectors(scopeTheme(FILES.ivy, "ivy", false))).toEqual([
      ':root[data-theme="ivy"]',
      ':root[data-theme="ivy"][data-mode="light"]',
    ]);
  });

  it("keeps bare :root on the default theme", () => {
    expect(selectors(scopeTheme(FILES.ivy, "ivy", true))).toEqual([
      ':root, :root[data-theme="ivy"]',
      ':root[data-mode="light"], :root[data-theme="ivy"][data-mode="light"]',
    ]);
  });

  it("refuses a theme file without both blocks", () => {
    expect(() => scopeTheme(":root { --fg-brand: red; }", "ivy", false)).toThrow("ivy");
  });
});

describe("buildThemesCss", () => {
  it("writes all six themes, each with a dark and a light block", () => {
    const css = buildThemesCss(FILES, "entrepta");
    for (const t of THEMES) {
      expect(css).toContain(`:root[data-theme="${t}"] {`);
      expect(css).toContain(`:root[data-theme="${t}"][data-mode="light"] {`);
    }
  });

  // The default's light block ties in specificity with every other theme's
  // dark block, so it has to come before them.
  it("puts the default theme before every other theme", () => {
    const list = selectors(buildThemesCss(FILES, "bosco"));
    expect(list.slice(0, 2)).toEqual([
      ':root, :root[data-theme="bosco"]',
      ':root[data-mode="light"], :root[data-theme="bosco"][data-mode="light"]',
    ]);
    expect(
      list.filter((s) => s.startsWith(":root,") || s.startsWith(':root[data-mode="light"],'))
    ).toHaveLength(2);
    expect(list).toHaveLength(12);
  });

  it("keeps every token value from the theme files", () => {
    const css = buildThemesCss(FILES, "entrepta");
    for (const t of THEMES) {
      for (const [, decl] of FILES[t].matchAll(/(--[\w-]+:\s*[^;]+;)/g)) {
        expect(css).toContain(decl);
      }
    }
  });
});
