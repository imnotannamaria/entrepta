import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * apps/docs/app/globals.css is a copy of the registry's, plus two things only
 * the docs need: a second @source for the registry files, and the six themes
 * at the end, switchable at runtime. Anything else that differs is drift.
 */

const REGISTRY = path.resolve(__dirname, "../../../packages/registry/styles");
const registryCss = fs.readFileSync(path.join(REGISTRY, "globals.css"), "utf8");
const docsCss = fs.readFileSync(path.join(__dirname, "globals.css"), "utf8");

const DOCS_SOURCE = '@source "../../../packages/registry/**/*.{ts,tsx}";\n';
const THEMES_MARKER = "/* themes, switch with data-theme on <html> */";

describe("docs globals.css", () => {
  it("matches the registry's, apart from the docs-only parts", () => {
    const at = docsCss.indexOf(THEMES_MARKER);
    expect(at).toBeGreaterThan(-1);
    const shared = docsCss.slice(0, at).replace(DOCS_SOURCE, "");
    expect(shared.trim()).toBe(registryCss.trim());
  });

  it("carries every value of every theme file under its data-theme selector", () => {
    const themes = docsCss.slice(docsCss.indexOf(THEMES_MARKER));
    const missing: string[] = [];
    for (const file of fs.readdirSync(path.join(REGISTRY, "themes"))) {
      const id = file.replace(".css", "");
      const css = fs.readFileSync(path.join(REGISTRY, "themes", file), "utf8");
      for (const [selector, scoped] of [
        [":root {", `:root[data-theme="${id}"] {`],
        [':root[data-mode="light"] {', `:root[data-theme="${id}"][data-mode="light"] {`],
      ]) {
        const body = css.slice(css.indexOf(selector), css.indexOf("}", css.indexOf(selector)));
        const docsStart = themes.indexOf(scoped);
        const docsBody = themes.slice(docsStart, themes.indexOf("}", docsStart));
        for (const [decl] of body.matchAll(/--[\w-]+:\s*[^;]+;/g)) {
          if (docsStart === -1 || !docsBody.includes(decl)) missing.push(`${id} ${scoped} ${decl}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
