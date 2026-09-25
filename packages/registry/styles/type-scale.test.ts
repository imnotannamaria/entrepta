import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The scale in `globals.css` is the only way to set a font size. A scale that
 * is optional decays one plausible `text-[13px]` at a time, and nothing fails
 * while it does. These checks read the source the way someone reintroducing a
 * stray size would write it.
 *
 * Test files are skipped: they name default steps on purpose, to check that
 * `cn` merges them correctly.
 */

const REPO = path.resolve(__dirname, "../../..");
const ROOTS = ["packages/registry", "apps/docs/app", "apps/docs/components", "apps/docs/lib"];
const SKIP_DIRS = new Set(["node_modules", ".next", "dist"]);

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : sourceFiles(full);
    if (!/\.tsx?$/.test(entry.name) || /\.test\.tsx?$/.test(entry.name)) return [];
    return [full];
  });
}

const FILES = ROOTS.flatMap((root) => sourceFiles(path.join(REPO, root)));

function matches(pattern: RegExp): string[] {
  return FILES.flatMap((file) =>
    fs
      .readFileSync(file, "utf8")
      .split("\n")
      .flatMap((line, i) =>
        pattern.test(line) ? [`${path.relative(REPO, file)}:${i + 1}: ${line.trim()}`] : []
      )
  );
}

describe("the type scale is the only way to set a size", () => {
  it("finds the source it is meant to check", () => {
    expect(FILES.length).toBeGreaterThan(50);
  });

  it("has no arbitrary pixel font sizes", () => {
    expect(matches(/text-\[[0-9.]+px\]/)).toEqual([]);
  });

  // Tailwind's own steps are a second name for sizes the scale already has.
  it("does not use Tailwind's default steps", () => {
    expect(matches(/\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/)).toEqual([]);
  });

  // Inline fontSize is for decorative glyphs such as ◆ and ×, sized to the
  // text beside them. Anything above 18px is real text and belongs on the scale.
  it("keeps inline numeric fontSize down to glyph sizes", () => {
    const oversized = matches(/fontSize: ?[0-9]+/).filter(
      (line) => Number(/fontSize: ?([0-9]+)/.exec(line)?.[1]) > 18
    );
    expect(oversized).toEqual([]);
  });
});
