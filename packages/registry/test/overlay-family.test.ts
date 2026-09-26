import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Overlays are one family: a menu, the palette, a tooltip, a dialog, the theme
 * panel and a toast share a surface, and every list of rows highlights the same
 * way. When one of them improves, this is what makes the others follow.
 */

const root = path.join(__dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

const OVERLAYS = [
  "primitives/dropdown.tsx",
  "primitives/tooltip.tsx",
  "primitives/dialog.tsx",
  "feedback/command-palette.tsx",
  "feedback/toast.tsx",
  "layout/theme-switcher.tsx",
];

const MENUS = [
  "primitives/dropdown.tsx",
  "feedback/command-palette.tsx",
  "layout/theme-switcher.tsx",
];

function registryFiles(dir = root): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === "test") return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return registryFiles(full);
    return /\.tsx$/.test(entry.name) && !entry.name.endsWith(".test.tsx") ? [full] : [];
  });
}

describe("overlay family", () => {
  it.each(OVERLAYS)("%s sits on the overlay surface with the overlay shadow", (file) => {
    const source = read(file);
    expect(source).toContain("bg-[var(--bg-overlay)]");
    expect(source).toContain("shadow-[var(--shadow-overlay)]");
  });

  it.each(OVERLAYS.filter((f) => !f.includes("toast")))("%s animates with motion-pop", (file) => {
    expect(read(file)).toContain("motion-pop");
  });

  it.each(MENUS)("%s rows share size and the brand tint highlight", (file) => {
    const source = read(file);
    expect(source).toContain("px-2.5 py-1.5");
    expect(source).toContain("bg-[var(--bg-surface-brand)]");
    expect(source).toContain("group/item");
  });

  it.each(OVERLAYS)("%s carries the toast's finish: the corner glow", (file) => {
    const source = read(file);
    expect(
      source.includes('"sheen') || source.includes(" sheen ") || source.includes("--sheen-tint")
    ).toBe(true);
  });

  it("paints no area in zinc-900: surfaces are near black with the sheen", () => {
    const gray = registryFiles().filter((file) =>
      /bg-\[var\(--bg-surface\)\]/.test(fs.readFileSync(file, "utf8"))
    );
    expect(gray.map((f) => path.relative(root, f))).toEqual([]);
  });

  it.each(["primitives/card.tsx", "content/code-block.tsx", "primitives/button-variants.ts"])(
    "%s uses the sheen",
    (file) => {
      expect(read(file)).toMatch(/["\s]sheen /);
    }
  );

  it("puts no colored bar on the edge of anything", () => {
    const offenders = registryFiles().filter((file) =>
      /inset_[23]px_0_0|border-l-2|border-left-width|border-l-\[/.test(
        fs.readFileSync(file, "utf8")
      )
    );
    expect(offenders.map((f) => path.relative(root, f))).toEqual([]);
  });

  it("writes every keyboard hint with Kbd", () => {
    const raw = registryFiles().filter(
      (file) => !file.endsWith("kbd.tsx") && /<kbd[\s>]/.test(fs.readFileSync(file, "utf8"))
    );
    expect(raw.map((f) => path.relative(root, f))).toEqual([]);
  });
});
