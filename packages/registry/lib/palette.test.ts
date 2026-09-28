import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseHex, toOklch } from "./color-contrast";
import { PALETTE, colorHue, hueName, paletteColor } from "./palette";

describe("palette", () => {
  it("names the eight palette colors and the statuses", () => {
    expect(Object.keys(PALETTE)).toHaveLength(11);
    expect(paletteColor("chart-8")).toBe("var(--chart-8)");
    expect(paletteColor("success")).toBe("var(--status-success)");
  });

  it("passes any other color through", () => {
    expect(paletteColor("oklch(0.7 0.1 200)")).toBe("oklch(0.7 0.1 200)");
    // a series named after an Object method is a string, not a lookup
    expect(paletteColor("toString")).toBe("toString");
    expect(paletteColor("constructor")).toBe("constructor");
  });
});

describe("hue names", () => {
  it("names a hue by the nearest plain color, across 0°", () => {
    expect(hueName(283.6)).toBe("Violet");
    expect(hueName(277)).toBe("Indigo");
    expect(hueName(24)).toBe("Red");
    expect(hueName(359)).toBe("Pink");
    expect(hueName(5)).toBe("Pink");
    expect(hueName(145)).toBe("Green");
  });

  it("reads the hue of a computed color, oklch or rgb, and none from a gray", () => {
    expect(colorHue("oklch(0.72 0.12 283.6)")).toBeCloseTo(283.6);
    expect(colorHue("rgb(124, 107, 255)")).toBeGreaterThan(270);
    expect(colorHue("rgb(128, 128, 128)")).toBeNull();
    expect(colorHue("color-mix(in srgb, red, blue)")).toBeNull();
  });
});

describe("hue names across the six themes", () => {
  const dir = path.join(__dirname, "..", "styles", "themes");
  const themes = fs.readdirSync(dir).filter((file) => file.endsWith(".css"));

  it.each(themes)("%s keeps each swatch's name in both modes, eight different names", (file) => {
    const css = fs.readFileSync(path.join(dir, file), "utf8");
    const [dark, light] = [...css.matchAll(/--fg-brand:\s*(#[0-9a-fA-F]{6})/g)].map((m) => m[1]);
    const names = (hex: string) => {
      const base = toOklch(parseHex(hex) as NonNullable<ReturnType<typeof parseHex>>).h;
      return [0, 45, 90, 135, 180, 225, 270, 315].map((turn) => hueName(base + turn));
    };
    expect(names(light)).toEqual(names(dark));
    expect(new Set(names(dark)).size).toBe(8);
  });

  it("calls the entrepta brand violet, as its theme does", () => {
    expect(
      hueName(toOklch(parseHex("#7c6bff") as NonNullable<ReturnType<typeof parseHex>>).h)
    ).toBe("Violet");
    expect(
      hueName(toOklch(parseHex("#6656ff") as NonNullable<ReturnType<typeof parseHex>>).h)
    ).toBe("Violet");
  });
});
