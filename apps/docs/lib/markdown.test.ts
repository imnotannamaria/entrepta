import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COMPONENT_INDEX } from "./component-index";
import { NEW_IN_V2, NEW_IN_V3, REPLACES, V1_COMPONENTS, V2_COMPONENTS } from "./docs-data";
import { MD_PAGES, SITE_URL, componentMd, llmsFullTxt, llmsTxt, migrationMd } from "./markdown";

/**
 * The docs an agent reads: every `.md` twin, llms.txt and llms-full.txt. They
 * come from the same data as the pages, and these checks keep them complete.
 */

describe("markdown pages", () => {
  it.each(MD_PAGES.map((p) => [p.path, p]))("%s renders a titled page", (_path, page) => {
    const md = page.render();
    expect(md.startsWith("# ")).toBe(true);
    expect(md).not.toMatch(/undefined|\[object Object\]/);
    expect(md.length).toBeGreaterThan(200);
  });

  it("has a twin for every component page", () => {
    const paths = new Set(MD_PAGES.map((p) => p.path));
    const missing = COMPONENT_INDEX.filter((c) => !paths.has(`/docs/components/${c.slug}`));
    expect(missing).toEqual([]);
  });

  it("has a twin for every foundations page", () => {
    const dir = path.join(__dirname, "../app/docs/foundations");
    const pages = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => `/docs/foundations/${d.name}`);
    const paths = new Set(MD_PAGES.map((p) => p.path));
    expect(pages.filter((p) => !paths.has(p))).toEqual([]);
    expect(pages.length).toBeGreaterThanOrEqual(7);
  });

  it("gives a component its install command, usage and props", () => {
    const md = componentMd("checkbox");
    expect(md).toContain("npx @entrepta/cli@latest add checkbox");
    expect(md).toContain("## Usage");
    expect(md).toContain("| `indeterminate` |");
  });

  it("declares the twin on each page that has one, and hands its own path to the copy button", () => {
    const read = (p: string) => fs.readFileSync(path.join(__dirname, "../app", p), "utf8");
    const problems: string[] = [];
    for (const page of MD_PAGES) {
      // one [slug] page serves every component, checked below
      if (page.path.startsWith("/docs/components/")) continue;
      const source = read(`${page.path.slice(1)}/page.tsx`);
      if (!source.includes(`"text/markdown": "${page.path}.md"`))
        problems.push(`${page.path}: no twin`);
      // DocPageHeader's markdown and AgentActions' path take the page, and add the .md themselves
      for (const m of source.matchAll(/\b(?:markdown|path)="([^"]+)"/g)) {
        if (m[1] !== page.path) problems.push(`${page.path}: copies ${m[1]}`);
      }
    }
    const slug = read("docs/components/[slug]/page.tsx");
    if (!slug.includes('"text/markdown"')) problems.push("[slug]: no twin");
    expect(problems).toEqual([]);
  });

  it("nests no section at the level of the one it belongs to", () => {
    const md = migrationMd();
    const rules = md.slice(md.indexOf("## Rules to keep while migrating"));
    expect(rules.match(/^## /gm)).toHaveLength(1);
  });
});

describe("llms.txt", () => {
  it("links every Markdown page with an absolute .md URL", () => {
    const txt = llmsTxt();
    const missing = MD_PAGES.filter((p) => !txt.includes(`(${SITE_URL}${p.path}.md)`));
    expect(missing.map((p) => p.path)).toEqual([]);
    expect(txt.startsWith("# entrepta\n\n> ")).toBe(true);
  });

  it("joins every page in llms-full.txt", () => {
    const full = llmsFullTxt();
    for (const page of MD_PAGES) expect(full).toContain(page.render().split("\n")[0]);
  });
});

describe("migration guide", () => {
  it("splits the index into 1.x, 2.0 and v3 components, with no strays", () => {
    const slugs = COMPONENT_INDEX.map((c) => c.slug);
    expect([...V1_COMPONENTS, ...V2_COMPONENTS].filter((s) => !slugs.includes(s))).toEqual([]);
    expect(NEW_IN_V2.length).toBe(V2_COMPONENTS.length);
    expect(V1_COMPONENTS.length + NEW_IN_V2.length + NEW_IN_V3.length).toBe(COMPONENT_INDEX.length);
  });

  it("lists every new component, with what it replaces, in the Markdown an agent copies", () => {
    const md = migrationMd();
    const missing = NEW_IN_V2.filter(
      (c) => !md.includes(`**${c.title}**`) || !md.includes(`/docs/components/${c.slug}.md`)
    );
    expect(missing).toEqual([]);
    expect(NEW_IN_V2.filter((c) => !REPLACES[c.slug]).map((c) => c.slug)).toEqual([]);
  });
});
