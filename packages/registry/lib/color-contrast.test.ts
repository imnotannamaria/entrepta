import { describe, expect, it } from "vitest";
import {
  composite,
  contrastRatio,
  flatten,
  fromOklch,
  parseColor,
  parseHex,
  parseRgb,
  toOklch,
  wcagGrade,
} from "./color-contrast";

const rgb = (r: number, g: number, b: number, a = 1) => ({ r, g, b, a });

describe("parseRgb", () => {
  it("reads the forms getComputedStyle returns", () => {
    expect(parseRgb("rgb(255, 255, 255)")).toEqual(rgb(255, 255, 255));
    expect(parseRgb("rgb(169 139 245 / 0.35)")).toEqual(rgb(169, 139, 245, 0.35));
    expect(parseRgb("rgba(0, 0, 0, 0.6)")).toEqual(rgb(0, 0, 0, 0.6));
  });

  it("returns null for something that is not a color", () => {
    expect(parseRgb("color-mix(in srgb, #7c6bff 35%, transparent)")).toBeNull();
  });
});

describe("parseHex", () => {
  it("reads short, long and alpha forms", () => {
    expect(parseHex("#fff")).toEqual(rgb(255, 255, 255));
    expect(parseHex("#7c6bff")).toEqual(rgb(124, 107, 255));
    expect(parseHex("#00000080")).toEqual(rgb(0, 0, 0, 128 / 255));
  });

  it("returns null for anything else", () => {
    expect(parseHex("7c6bff")).toBeNull();
    expect(parseHex("var(--zinc-950)")).toBeNull();
  });
});

describe("parseColor", () => {
  it("accepts hex and rgb()", () => {
    expect(parseColor("#09090b")).toEqual(rgb(9, 9, 11));
    expect(parseColor("rgba(124, 107, 255, 0.15)")).toEqual(rgb(124, 107, 255, 0.15));
  });
});

describe("contrastRatio", () => {
  it("puts black on white at the top of the scale", () => {
    expect(contrastRatio(rgb(0, 0, 0), rgb(255, 255, 255))).toBeCloseTo(21, 5);
  });

  it("puts a color against itself at the bottom", () => {
    expect(contrastRatio(rgb(124, 107, 255), rgb(124, 107, 255))).toBeCloseTo(1, 5);
  });

  it("does not care which way round the arguments go", () => {
    const a = rgb(250, 250, 250);
    const b = rgb(9, 9, 11);
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });
});

describe("compositing", () => {
  it("leaves an opaque color alone", () => {
    expect(composite(rgb(10, 20, 30), rgb(255, 255, 255))).toEqual(rgb(10, 20, 30));
  });

  it("returns the backdrop when the top layer is fully transparent", () => {
    expect(composite(rgb(255, 0, 0, 0), rgb(9, 9, 11))).toEqual(rgb(9, 9, 11));
  });

  // The tint is a third color, so measuring against the raw canvas gives a
  // different, wrong number.
  it("measures text on the tint against the flattened tint", () => {
    const canvas = rgb(9, 9, 11);
    const tint = rgb(124, 107, 255, 0.15);
    const ink = rgb(155, 142, 255);

    const onTint = contrastRatio(ink, flatten([tint, canvas]));
    const onCanvas = contrastRatio(ink, canvas);

    expect(onTint).toBeGreaterThan(6);
    expect(onTint).toBeLessThan(6.7);
    expect(Math.abs(onCanvas - onTint)).toBeGreaterThan(0.2);
  });
});

describe("wcagGrade", () => {
  it("grades against the right threshold for the text size", () => {
    expect(wcagGrade(7.1)).toBe("AAA");
    expect(wcagGrade(4.6)).toBe("AA");
    expect(wcagGrade(3.2)).toBe("fail");
    expect(wcagGrade(3.2, true)).toBe("AA");
  });
});

describe("OKLCH", () => {
  it("round-trips an sRGB color", () => {
    for (const hex of ["#7c6bff", "#cc2e36", "#35a365", "#09090b", "#fafafa"]) {
      const color = parseColor(hex) as NonNullable<ReturnType<typeof parseColor>>;
      const back = fromOklch(toOklch(color)) as NonNullable<ReturnType<typeof fromOklch>>;
      expect(back.r).toBeCloseTo(color.r, 3);
      expect(back.g).toBeCloseTo(color.g, 3);
      expect(back.b).toBeCloseTo(color.b, 3);
    }
  });

  it("matches known values", () => {
    const white = toOklch(rgb(255, 255, 255));
    expect(white.l).toBeCloseTo(1, 4);
    expect(white.c).toBeCloseTo(0, 4);
    // #ff0000 is oklch(0.628 0.2577 29.23)
    const red = toOklch(rgb(255, 0, 0));
    expect(red.l).toBeCloseTo(0.628, 3);
    expect(red.c).toBeCloseTo(0.2577, 3);
    expect(red.h).toBeCloseTo(29.23, 1);
  });

  it("refuses a color outside the sRGB gamut instead of clipping it", () => {
    expect(fromOklch({ l: 0.7, c: 0.4, h: 150 })).toBeNull();
    expect(fromOklch({ l: 0.72, c: 0.12, h: 150 })).not.toBeNull();
  });
});
