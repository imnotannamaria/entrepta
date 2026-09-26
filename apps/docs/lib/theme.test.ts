import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { THEMES } from "./theme";

/**
 * `THEMES` paints the switcher swatches before any theme CSS applies, so it
 * cannot be read from the stylesheet at runtime. The copy stays, and this test
 * notices when it drifts from the theme files.
 */

const THEMES_DIR = path.resolve(__dirname, "../../../packages/registry/styles/themes");

function brand(id: string, selector: string): string | undefined {
  const css = fs.readFileSync(path.join(THEMES_DIR, `${id}.css`), "utf8");
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return undefined;
  return /--fg-brand:\s*([^;]+);/
    .exec(css.slice(start, css.indexOf("}", start)))?.[1]
    .toLowerCase();
}

describe("THEMES", () => {
  it("lists every theme file", () => {
    const files = fs
      .readdirSync(THEMES_DIR)
      .filter((f) => f.endsWith(".css"))
      .map((f) => f.replace(".css", ""));
    expect(THEMES.map((t) => t.id).sort()).toEqual(files.sort());
  });

  it("matches --fg-brand in every dark block", () => {
    const drifted = THEMES.filter((t) => brand(t.id, ":root") !== t.color.toLowerCase()).map(
      (t) => `${t.id}: ${t.color} vs ${brand(t.id, ":root")}`
    );
    expect(drifted).toEqual([]);
  });

  it("matches --fg-brand in every light block", () => {
    const light = ':root[data-mode="light"]';
    const drifted = THEMES.filter((t) => brand(t.id, light) !== t.lightColor.toLowerCase()).map(
      (t) => `${t.id}: ${t.lightColor} vs ${brand(t.id, light)}`
    );
    expect(drifted).toEqual([]);
  });
});
