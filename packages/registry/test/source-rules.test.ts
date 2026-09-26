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
    // `import type` is erased at compile time, so it never reaches the server build
    const valueImport = /^import\s+(?!type\b)[^;]*from\s+["']@phosphor-icons\/react["']/m;
    const offenders = FILES.filter(
      ({ source }) => valueImport.test(source) && !isClient(source)
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

  // The registry is source people run without reading it.
  it("has no eval, no network calls and no raw HTML beyond the theme scripts", () => {
    const rules: [string, RegExp][] = [
      ["eval", /\beval\s*\(|new Function\s*\(/],
      ["network", /\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|new WebSocket/],
    ];
    const registry = FILES.filter(({ file }) => file.startsWith("packages/registry"));
    const offenders = registry.flatMap(({ file, source }) =>
      rules.filter(([, pattern]) => pattern.test(source)).map(([name]) => `${file}: ${name}`)
    );
    const rawHtml = registry
      .filter(({ source }) => source.includes("dangerouslySetInnerHTML"))
      .map(({ file }) => file)
      .filter((file) => !/(theme-switcher|mode-toggle)\.tsx$/.test(file));
    expect([...offenders, ...rawHtml]).toEqual([]);
  });
});
