import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COMPONENT_INDEX, DOCS_NAV } from "./component-index";
import { COMPONENT_DOCS } from "./components";
import { COMPONENTS, PICKABLE, installClosure } from "./manifest";

/**
 * A registry item is not done until it has a docs page (CLAUDE.md §11). These
 * checks tie the manifest, the index, the page text and the previews together,
 * so a new item cannot ship without all four.
 */

const PREVIEW_SOURCE = fs.readFileSync(
  path.join(__dirname, "../app/docs/components/[slug]/component-preview.tsx"),
  "utf8"
);
const PREVIEW_KEYS = new Set(
  [
    ...(/const PREVIEWS[^=]*=\s*\{([\s\S]*?)\n\};/.exec(PREVIEW_SOURCE)?.[1] ?? "").matchAll(
      /^\s*"?([a-z-]+)"?:/gm
    ),
  ].map((m) => m[1])
);

describe("docs coverage", () => {
  it("has an index entry, page text and a preview for every component in the manifest", () => {
    const indexed = new Set(COMPONENT_INDEX.map((c) => c.slug));
    const missing = PICKABLE.flatMap((c) => [
      ...(indexed.has(c.name) ? [] : [`${c.name}: index`]),
      ...(COMPONENT_DOCS[c.name] ? [] : [`${c.name}: page text`]),
      ...(PREVIEW_KEYS.has(c.name) ? [] : [`${c.name}: preview`]),
    ]);
    expect(missing).toEqual([]);
  });

  it("has no page for something the CLI cannot install", () => {
    const names = new Set(PICKABLE.map((c) => c.name));
    const stray = [
      ...COMPONENT_INDEX.map((c) => c.slug),
      ...Object.keys(COMPONENT_DOCS),
      ...PREVIEW_KEYS,
    ].filter((slug) => !names.has(slug));
    expect([...new Set(stray)]).toEqual([]);
  });

  it("reaches every hook and lib file through some component", () => {
    const reached = new Set(PICKABLE.flatMap((c) => installClosure(c.name).map((d) => d.name)));
    const orphans = COMPONENTS.filter(
      (c) => (c.category === "hooks" || c.category === "lib") && !reached.has(c.name)
    ).map((c) => c.name);
    // documented on their own foundation pages instead
    expect(orphans.filter((n) => !["color-contrast", "use-url-filter"].includes(n))).toEqual([]);
  });

  it("links every component from the docs nav", () => {
    const hrefs = new Set(DOCS_NAV.flatMap((g) => g.items.map((i) => i.href)));
    const unlinked = PICKABLE.filter((c) => !hrefs.has(`/docs/components/${c.name}`)).map(
      (c) => c.name
    );
    expect(unlinked).toEqual([]);
  });

  it("puts every docs page in the sitemap", async () => {
    const { default: sitemap } = await import("../app/sitemap");
    const urls = new Set(sitemap().map((e) => new URL(e.url).pathname));
    const missing = DOCS_NAV.flatMap((g) => g.items.map((i) => i.href)).filter((h) => !urls.has(h));
    expect(missing).toEqual([]);
  });
});
