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
  "primitives/popover.tsx",
  "primitives/select.tsx",
  "primitives/dropdown.tsx",
  "primitives/tooltip.tsx",
  "primitives/dialog.tsx",
  "feedback/command-palette.tsx",
  "feedback/toast.tsx",
  "layout/theme-switcher.tsx",
];

const MENUS = [
  "primitives/select.tsx",
  "primitives/date-picker.tsx",
  "primitives/dropdown.tsx",
  "feedback/command-palette.tsx",
  "layout/theme-switcher.tsx",
];

function registryFiles(dir = root): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === "test") return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return registryFiles(full);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

describe("overlay family", () => {
  it("defines the surface and the row once, in lib/overlay.ts", () => {
    const lib = read("lib/overlay.ts");
    for (const piece of [
      "sheen",
      "bg-[var(--bg-overlay)]",
      "shadow-[var(--shadow-overlay)]",
      "border-[var(--border-strong)]",
      "px-2.5 py-1.5",
      "group/item",
    ]) {
      expect(lib).toContain(piece);
    }
  });

  it.each(OVERLAYS)("%s stands on OVERLAY_SURFACE", (file) => {
    const source = read(file);
    expect(source).toMatch(/import \{[^}]*OVERLAY_SURFACE[^}]*\} from "\.\.\/lib\/overlay"/);
    expect(source).toContain("OVERLAY_SURFACE,");
  });

  it.each(OVERLAYS.filter((f) => !f.includes("toast")))("%s animates with motion-pop", (file) => {
    expect(read(file)).toContain("motion-pop");
  });

  it.each(MENUS)("%s builds its rows on MENU_ROW and highlights them in the brand tint", (file) => {
    const source = read(file);
    expect(source).toContain("MENU_ROW");
    expect(source).toContain("bg-[var(--bg-surface-brand)]");
  });

  it("gives the toast the glow through its own tone, over the shared surface", () => {
    expect(read("feedback/toast.tsx")).toContain("var(--toast-glow,var(--sheen-tint))");
  });

  it("keeps the surface classes out of the components, so there is one place to change", () => {
    const copies = OVERLAYS.filter((file) => /shadow-\[var\(--shadow-overlay\)\]/.test(read(file)));
    expect(copies).toEqual([]);
  });

  it("paints no area in zinc-900: surfaces are near black with the sheen", () => {
    // any use of the token counts, as a class, inline style or CSS; declaring it does not
    const usesSurface = /var\(--bg-surface\)/;
    const offenders = [
      ...registryFiles().filter((file) => usesSurface.test(fs.readFileSync(file, "utf8"))),
      ...(usesSurface.test(read("styles/globals.css")) ? ["styles/globals.css"] : []),
    ];
    expect(offenders.map((f) => path.relative(root, path.resolve(root, f)))).toEqual([]);
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
