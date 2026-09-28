import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = fs.readFileSync(path.join(__dirname, "globals.css"), "utf8");

describe("form fields", () => {
  it("show exactly what was typed, with no code ligatures", () => {
    const rule = /input,\s*textarea\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
    expect(rule).toContain("font-variant-ligatures: none");
  });
});

describe("chart palette", () => {
  it("has fixed hues where the browser has no relative color, so charts never vanish", () => {
    const fallback = css.slice(css.indexOf("@supports not (color: oklch(from red l c h))"));
    expect(fallback).not.toBe("");
    for (let i = 1; i <= 8; i++) {
      expect(fallback).toMatch(
        new RegExp(`--chart-${i}: oklch\\(var\\(--chart-l\\) var\\(--chart-c\\) \\d+\\)`)
      );
    }
  });
});
