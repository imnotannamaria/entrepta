import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Rules about imports that no type check catches, read straight from the
 * source of the registry and the docs app.
 */

const REPO = path.resolve(__dirname, "../../..");
const ROOTS = ["packages/registry", "apps/docs/app", "apps/docs/components", "apps/docs/lib"];
const SKIP_DIRS = new Set(["node_modules", ".next", "dist"]);

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : sourceFiles(full);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

// Template literals are dropped: the docs keep usage examples, imports included, in strings.
const FILES = ROOTS.flatMap((root) => sourceFiles(path.join(REPO, root))).map((file) => ({
  file: path.relative(REPO, file),
  source: fs.readFileSync(file, "utf8").replace(/`[^`]*`/g, "``"),
}));

const isClient = (source: string) => /^\s*["']use client["']/.test(source);

describe("source rules", () => {
  it("finds the source it is meant to check", () => {
    expect(FILES.length).toBeGreaterThan(50);
  });

  /**
   * The package root is Phosphor's client build and calls createContext when
   * it loads. Imported from a server file, `next build` fails with an error
   * that names no file. Server files import from `@phosphor-icons/react/dist/ssr`.
   */
  it("imports the Phosphor root only from client files", () => {
    const offenders = FILES.filter(
      ({ source }) => /from\s+["']@phosphor-icons\/react["']/.test(source) && !isClient(source)
    ).map(({ file }) => file);
    expect(offenders).toEqual([]);
  });

  it("does not import lucide-react", () => {
    const offenders = FILES.filter(({ source }) => /["']lucide-react["']/.test(source)).map(
      ({ file }) => file
    );
    expect(offenders).toEqual([]);
  });

  // The registry is framework agnostic: routes and links belong to the user's project.
  it("imports nothing from next/* in the registry", () => {
    const offenders = FILES.filter(
      ({ file, source }) =>
        file.startsWith("packages/registry/") && /from\s+["']next(\/[^"']*)?["']/.test(source)
    ).map(({ file }) => file);
    expect(offenders).toEqual([]);
  });
});
