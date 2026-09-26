import fs from "node:fs";
import path from "node:path";

/**
 * Counts read from the registry at build time, so the home page never shows a
 * number that drifted. Server only.
 */

const GLOBALS = path.resolve(
  process.cwd(),
  "..",
  "..",
  "packages",
  "registry",
  "styles",
  "globals.css"
);

/** Custom properties declared on :root and in the type scale, each counted once. */
export function tokenCount(): number {
  const css = fs.readFileSync(GLOBALS, "utf8");
  const blocks = [...css.matchAll(/(?:^|\n)(?::root|@theme static) \{([\s\S]*?)\n\}/g)].map(
    (m) => m[1]
  );
  const names = new Set<string>();
  for (const block of blocks) {
    for (const [, name] of block.matchAll(/(--[\w-]+)\s*:/g)) {
      // the scale's --line-height and --letter-spacing are part of their step
      if (!/--(line-height|letter-spacing)$/.test(name)) names.add(name);
    }
  }
  return names.size;
}
