import { type AgentsOptions, buildAgentsMd } from "./agents-md";
import { COMPONENT_INDEX, SECTIONS, findEntry } from "./component-index";
import { COMPONENT_DOCS } from "./components";
import {
  CLI_COMMANDS,
  DATA_FOUNDATION,
  DOCS_INTRO,
  INIT_FILES,
  MIGRATION,
  NEW_IN_V2,
  NEW_IN_V3,
  REPLACES,
  REQUIREMENTS,
  THEME_NOTES,
  THEME_SWITCH,
  V3_CHANGES,
  V3_UPDATE,
} from "./docs-data";
import {
  A11Y_SECTIONS,
  ACCENTS,
  BRAND,
  CHART,
  COLOR_NOTES,
  FINISH,
  FOREGROUND,
  FOUNDATIONS_INTRO,
  FOUNDATION_PAGES,
  type FoundationSlug,
  GRID,
  INK_PAIRS,
  MOTION_CSS,
  MOTION_NOTES,
  MOTION_RULES,
  MOTION_TOKENS,
  NEUTRALS,
  RADII,
  SPACE_SCALE,
  STATUS,
  SURFACES,
  type Swatch,
  TYPE_FAMILIES,
  TYPE_RULES,
  TYPE_SCALE,
  TYPE_USAGE,
  foundationPage,
  motionComponents,
} from "./foundations";
import { LINKS, USED_BY } from "./links";
import { depsFor, filesFor, findComponent, installClosure } from "./manifest";
import { RULES, RULE_TOPICS } from "./rules";
import { THEMES } from "./theme";

/**
 * The docs as Markdown, for coding agents. Every page with a `.md` twin is
 * listed in MD_PAGES; `/llms.txt` indexes them and `/llms-full.txt` joins them.
 * Built from the same data the pages render, never written twice.
 */

export const SITE_URL = "https://entrepta.vercel.app";

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`),
  ].join("\n");

const code = (lang: string, body: string) => `\`\`\`${lang}\n${body}\n\`\`\``;
const mdUrl = (path: string) => `${SITE_URL}${path}.md`;

/** Pulls `## Heading` sections out of a generated AGENTS.md, in the order asked. */
function agentsSections(headings: string[]) {
  const options: AgentsOptions = {
    framework: "next-app",
    theme: "entrepta",
    mode: "dark",
    themes: "single",
    pm: "npm",
    components: [],
    fileName: "AGENTS.md",
  };
  const md = buildAgentsMd(options);
  return headings
    .map((h) => {
      const start = md.indexOf(`## ${h}\n`);
      if (start === -1) return "";
      const end = md.indexOf("\n## ", start + 3);
      return md.slice(start, end === -1 ? undefined : end).trim();
    })
    .filter(Boolean)
    .join("\n\n");
}

export function componentMd(slug: string): string {
  const entry = findEntry(slug);
  const doc = COMPONENT_DOCS[slug];
  const manifest = findComponent(slug);
  if (!entry || !doc || !manifest) throw new Error(`no component ${slug}`);
  const deps = depsFor(slug);
  const alongside = installClosure(slug)
    .map((c) => c.name)
    .filter((n) => n !== slug);
  return [
    `# ${entry.title}`,
    `> ${doc.description}`,
    `Section: ${entry.section}. Docs: ${SITE_URL}/docs/components/${slug}`,
    "## Install",
    code("bash", `npx @entrepta/cli@latest add ${slug}`),
    [
      `Files: ${filesFor(slug)
        .map((f) => `\`${f}\``)
        .join(", ")}.`,
      deps.length ? `npm packages: ${deps.map((d) => `\`${d}\``).join(", ")}.` : "No npm packages.",
      alongside.length ? `Comes with: ${alongside.map((d) => `\`${d}\``).join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    "## Usage",
    code("tsx", doc.usage),
    "## Props",
    table(
      ["Prop", "Type", "Default", "Description"],
      doc.props.map((p) => [`\`${p.name}\``, `\`${p.type}\``, p.default ?? "-", p.description])
    ),
  ].join("\n\n");
}

function newComponentsList() {
  return NEW_IN_V2.map((c) => {
    const m = findComponent(c.slug);
    const replaces = REPLACES[c.slug] ? ` Replaces ${REPLACES[c.slug]}.` : "";
    return `- **${c.title}** (${c.section}): ${m?.description ?? ""}.${replaces} [docs](${mdUrl(`/docs/components/${c.slug}`)})`;
  }).join("\n");
}

export function migrationMd(): string {
  return [
    "# Migrating an entrepta project to v2",
    "> For a coding agent working in a project that already uses entrepta 1.x, or that copied pieces of it by hand. Do the steps in order, and check the app at 375px, in dark and light, after each one.",
    "## 1. Update the files",
    "The CLI copies source, so nothing updates on its own. Commit first: `--overwrite` replaces local edits. Rewrite the tokens, then each component the project uses (look in `entrepta.json` and the components folder).",
    code("bash", MIGRATION.update),
    "## 2. Font sizes",
    "Sizes come from ten scale steps. Arbitrary pixel sizes and Tailwind default steps go. A step sets size and leading, never the family, so keep the font-* class.",
    table(["before", "after"], MIGRATION.sizes),
    "## 3. The .t-* classes",
    "They are gone. Each becomes a family and a step.",
    table(["before", "after"], MIGRATION.tClasses),
    "## 4. lucide to Phosphor",
    'Install `@phosphor-icons/react` and remove `lucide-react`. A file without `"use client"` imports from `@phosphor-icons/react/dist/ssr`. Phosphor takes `size`, not width and strokeWidth.',
    table(["lucide", "phosphor"], MIGRATION.icons),
    "## 5. Brand inks and surfaces",
    "Search the project's own code for these. The components already use the new tokens.",
    table(["before", "after"], MIGRATION.inks),
    "## 6. Card",
    MIGRATION.card,
    "## 7. Themes",
    MIGRATION.themes,
    "## 8. Components that changed",
    MIGRATION.components.map(([name, text]) => `- **${name}.** ${text}`).join("\n"),
    `## 9. New in v2: ${NEW_IN_V2.length} components`,
    "If the project built its own version of one of these, replace it with `npx @entrepta/cli@latest add <name>` and delete the local copy.",
    newComponentsList(),
    "## Rules to keep while migrating",
    // one level down, under the heading above
    agentsSections(["Tokens", "Type", "Rules"]).replace(/^## /gm, "### "),
  ].join("\n\n");
}

export function whatsNewMd(): string {
  return [
    "# What's new in entrepta 3",
    `> ${NEW_IN_V3.length} components for products: money and dates, lists and tables, filters, dashboards, charts, onboarding and chat. Nothing in 2.x breaks, so there is nothing to migrate.`,
    "## Update",
    "The new tokens come with init: the chart palette, the height animation of the Accordion, and fields without code ligatures. Commit first: `--overwrite` replaces local edits.",
    code("bash", V3_UPDATE),
    ...SECTIONS.map((section) => {
      const entries = NEW_IN_V3.filter((c) => c.section === section);
      if (!entries.length) return "";
      return [
        `## New in ${section}`,
        entries
          .map(
            (c) =>
              `- **${c.title}**: ${findComponent(c.slug)?.description ?? ""}. [docs](${mdUrl(`/docs/components/${c.slug}`)})`
          )
          .join("\n"),
      ].join("\n\n");
    }).filter(Boolean),
    "## Changed",
    "Everything below keeps its API. It only gained.",
    V3_CHANGES.map(([name, text]) => `- **${name}.** ${text}`).join("\n"),
  ].join("\n\n");
}

export function dataFoundationMd(): string {
  return [
    "# Data",
    "> How entrepta holds and shows data. Every data component follows these, so a screen reads the same wherever the number comes from.",
    ...DATA_FOUNDATION.map((topic) =>
      [
        `## ${topic.title}`,
        topic.notes.map((note) => `- ${note}`).join("\n"),
        topic.code ? code("tsx", topic.code.body) : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    ),
  ].join("\n\n");
}

export function componentsIndexMd(): string {
  return [
    "# entrepta components",
    `> ${COMPONENT_INDEX.length} components across ${SECTIONS.length} sections. Each is copied into the project as source with \`npx @entrepta/cli@latest add <name>\`.`,
    ...SECTIONS.map((section) =>
      [
        `## ${section}`,
        COMPONENT_INDEX.filter((c) => c.section === section)
          .map(
            (c) =>
              `- [${c.title}](${mdUrl(`/docs/components/${c.slug}`)}): ${findComponent(c.slug)?.description ?? ""}`
          )
          .join("\n"),
      ].join("\n\n")
    ),
  ].join("\n\n");
}

export function introMd(): string {
  return [
    "# Build with entrepta",
    `> ${DOCS_INTRO.description}`,
    "## Philosophy",
    DOCS_INTRO.philosophy,
    "## Quick start",
    code("bash", DOCS_INTRO.quickStart.map((s) => `${s.cmd}  # ${s.comment}`).join("\n")),
    "## What init writes",
    INIT_FILES.map((f) => `- \`${f.path}\`: ${f.desc}`).join("\n"),
    "## Where to go next",
    [
      `- [Installation](${mdUrl("/docs/installation")}): setup for Next.js and Vite`,
      `- [CLI reference](${mdUrl("/docs/cli")}): every flag of init and add`,
      `- [Foundations](${mdUrl("/docs/foundations")}): what every component follows`,
      `- [Components](${mdUrl("/docs/components")}): ${COMPONENT_INDEX.length} components in ${SECTIONS.length} sections`,
    ].join("\n"),
  ].join("\n\n");
}

export function installationMd(): string {
  return [
    "# Install entrepta",
    "> The CLI detects the framework and writes the tokens, the cn helper and a config. Then add components one by one.",
    "## Requirements",
    REQUIREMENTS.map((r) => `- ${r.label}: ${r.value}`).join("\n"),
    "## 1. Run init",
    code("bash", "npx @entrepta/cli@latest init --theme=entrepta"),
    "## What init writes",
    INIT_FILES.map((f) => `- \`${f.path}\`: ${f.desc}`).join("\n"),
    "## 2. Add components",
    code("bash", "npx @entrepta/cli@latest add button card dialog"),
    `For a project-specific guide, build an AGENTS.md at ${SITE_URL}/?agents=open.`,
  ].join("\n\n");
}

export function cliMd(): string {
  return [
    "# entrepta CLI",
    `> Published as \`@entrepta/cli\` (${LINKS.npmCli}), bin \`entrepta\`. Run it with npx; there is nothing to install. It copies source into the project: no runtime, no SDK.`,
    ...CLI_COMMANDS.map((c) =>
      [
        `## ${c.title}`,
        code("bash", c.cmd),
        c.desc,
        c.flags.length ? c.flags.map((f) => `- \`${f.flag}\`: ${f.desc}`).join("\n") : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    ),
    "## entrepta.json",
    "Read from the project root. It records the theme, whether one theme or all six are installed, the CSS file, the aliases, and `srcDir` when `@/` points at a folder such as `src` in Vite.",
  ].join("\n\n");
}

export function themesMd(): string {
  return [
    "# Themes",
    "> Six presets. Each sets only the brand tokens; neutrals, status colors, spacing and type are shared. Dark and light work in every preset.",
    table(
      ["Preset", "Brand", "Light brand", "Vibe"],
      THEMES.map((t) => [`\`${t.id}\``, t.color, t.lightColor, THEME_NOTES[t.id]?.vibe ?? ""])
    ),
    "## Pick one",
    code("bash", "npx @entrepta/cli@latest init --theme=ivy"),
    "## Or install all six",
    code("bash", "npx @entrepta/cli@latest init --theme=ivy --themes=all"),
    'All six land under `:root[data-theme="<id>"]`, the chosen one also on bare `:root`. Switch with `data-theme` on `<html>`, or the ThemeSwitcher. Light mode is `data-mode="light"` on `<html>`.',
    "## Switching",
    THEME_SWITCH.text,
    code("ts", THEME_SWITCH.code),
  ].join("\n\n");
}

const swatches = (list: Swatch[]) => list.map((w) => `- \`${w.token}\`: ${w.note}`).join("\n");
const tokens = (list: { token: string; value: string; use: string }[]) =>
  table(
    ["Token", "Value", "Use"],
    list.map((t) => [`\`${t.token}\``, t.value, t.use])
  );
const foundationHead = (slug: FoundationSlug) => {
  const page = foundationPage(slug);
  return [`# ${page.title}`, `> ${page.description}`];
};

export function foundationsMd(): string {
  return [
    "# Foundations",
    `> ${FOUNDATIONS_INTRO}`,
    FOUNDATION_PAGES.map(
      (p) => `- [${p.title}](${mdUrl(`/docs/foundations/${p.slug}`)}): ${p.summary}`
    ).join("\n"),
  ].join("\n\n");
}

export function colorMd(): string {
  return [
    ...foundationHead("color"),
    "The values live in `app/globals.css`. The page shows them resolved for the theme you are in.",
    "## Neutrals · zinc",
    table(
      ["Primitive", "Hex", "Use"],
      NEUTRALS.map((c) => [c.token, c.hex, c.use])
    ),
    "## Accents",
    table(
      ["Primitive", "Hex", "Use"],
      ACCENTS.map((c) => [c.token, c.hex, c.use])
    ),
    "## Surfaces",
    COLOR_NOTES.surfaces,
    swatches(SURFACES),
    "## Finish",
    COLOR_NOTES.finish,
    swatches(FINISH),
    "## Text and borders",
    swatches(FOREGROUND),
    "## Brand",
    COLOR_NOTES.brand,
    swatches(BRAND),
    "## Inks",
    COLOR_NOTES.inks,
    table(
      ["Ink", "On", "Floor", "Where"],
      INK_PAIRS.map((p) => [
        `\`${p.ink}\``,
        p.over ? `\`${p.on}\` over \`${p.over}\`` : `\`${p.on}\``,
        `${p.min}:1`,
        p.note,
      ])
    ),
    "## Chart palette",
    COLOR_NOTES.chart,
    swatches(CHART),
    "## Status",
    swatches(STATUS),
  ].join("\n\n");
}

export function typographyMd(): string {
  return [
    ...foundationHead("typography"),
    "## Families",
    TYPE_FAMILIES.map((f) => `- **${f.name}** (${f.label}): ${f.use}`).join("\n"),
    "## Scale",
    "Size over line height, in px.",
    table(
      ["Utility", "Size / leading · family"],
      TYPE_SCALE.map((t) => [`\`${t.token}\``, t.spec])
    ),
    "## Using the scale",
    TYPE_RULES.map((r) => `- **${r.lead}** ${r.text}`).join("\n"),
    code("tsx", TYPE_USAGE.body),
  ].join("\n\n");
}

export function spacingMd(): string {
  return [
    ...foundationHead("spacing"),
    "## Grid",
    tokens(GRID),
    "## Spacing",
    tokens(SPACE_SCALE),
  ].join("\n\n");
}

export function motionMd(): string {
  const components = motionComponents();
  return [
    ...foundationHead("motion"),
    "## Border radius",
    tokens(RADII),
    "## Motion",
    tokens(MOTION_TOKENS),
    MOTION_NOTES.reduced,
    "## Motion components",
    `${components.filter((c) => c.js).length} of them animate through JavaScript. ${MOTION_NOTES.components}`,
    components
      .map(
        (c) =>
          `- [${c.title}](${mdUrl(`/docs/components/${c.slug}`)}): ${c.note}${c.js ? "" : ". CSS only"}`
      )
      .join("\n"),
    "## Motion in CSS",
    MOTION_NOTES.css,
    swatches(MOTION_CSS),
    "## Motion rules",
    MOTION_RULES.map((r) => `- Do: ${r.do}. Don't: ${r.dont}.`).join("\n"),
  ].join("\n\n");
}

export function accessibilityMd(): string {
  return [
    ...foundationHead("accessibility"),
    ...A11Y_SECTIONS.map((section) =>
      [
        `## ${section.title}`,
        section.note ?? "",
        section.inks
          ? table(
              ["Ink", "On", "Floor"],
              INK_PAIRS.map((p) => [`\`${p.ink}\``, `\`${p.on}\``, `${p.min}:1`])
            )
          : "",
        section.points ? section.points.map((p) => `- **${p.lead}** ${p.text}`).join("\n") : "",
        section.code ? code("tsx", section.code.body) : "",
      ]
        .filter(Boolean)
        .join("\n\n")
    ),
  ].join("\n\n");
}

export function rulesMd(): string {
  return [
    ...foundationHead("rules"),
    ...RULE_TOPICS.map((topic) =>
      [
        `## ${topic}`,
        RULES.filter((r) => r.topic === topic)
          .map((r) => `- Do: ${r.do}. Don't: ${r.dont}.`)
          .join("\n"),
      ].join("\n\n")
    ),
  ].join("\n\n");
}

const FOUNDATION_MD: Record<FoundationSlug, () => string> = {
  color: colorMd,
  typography: typographyMd,
  spacing: spacingMd,
  motion: motionMd,
  accessibility: accessibilityMd,
  rules: rulesMd,
  data: dataFoundationMd,
};

export type MdPage = { path: string; title: string; summary: string; render: () => string };

/** Every page with a `.md` twin, in the order llms.txt lists them. */
export const MD_PAGES: MdPage[] = [
  {
    path: "/docs",
    title: "Introduction",
    summary: "What entrepta is, the quick start, and where to go next",
    render: introMd,
  },
  {
    path: "/docs/installation",
    title: "Installation",
    summary: "Requirements, init and what it writes, adding components",
    render: installationMd,
  },
  {
    path: "/docs/cli",
    title: "CLI reference",
    summary: "init, add, their flags and entrepta.json",
    render: cliMd,
  },
  {
    path: "/docs/themes",
    title: "Themes",
    summary: "The six presets and runtime switching",
    render: themesMd,
  },
  {
    path: "/docs/foundations",
    title: "Foundations",
    summary: "The seven foundations pages, one line each",
    render: foundationsMd,
  },
  ...FOUNDATION_PAGES.map((p) => ({
    path: `/docs/foundations/${p.slug}`,
    title: p.title,
    summary: p.summary,
    render: FOUNDATION_MD[p.slug],
  })),
  {
    path: "/docs/whats-new-in-v3",
    title: "What's new in v3",
    summary: "Every new component by section, what changed, and the one command to update",
    render: whatsNewMd,
  },
  {
    path: "/docs/migrating-to-v2",
    title: "Migrating to v2",
    summary: "Step by step for an agent, including every new component",
    render: migrationMd,
  },
  {
    path: "/docs/components",
    title: "Components",
    summary: "Every component with a one-line description",
    render: componentsIndexMd,
  },
  ...COMPONENT_INDEX.map((c) => ({
    path: `/docs/components/${c.slug}`,
    title: c.title,
    summary: findComponent(c.slug)?.description ?? "",
    render: () => componentMd(c.slug),
  })),
];

export function findMdPage(path: string) {
  return MD_PAGES.find((p) => p.path === path);
}

export function llmsTxt(): string {
  const docs = MD_PAGES.filter((p) => !p.path.startsWith("/docs/components/"));
  const components = MD_PAGES.filter((p) => p.path.startsWith("/docs/components/"));
  return `${[
    "# entrepta",
    "> A dark-first React design system you copy into your repo with a CLI, in the shadcn model: tabs, a command palette, a status bar, serif italic next to mono. Tailwind v4, Radix, six themes, every ink measured for WCAG AA.",
    `Every page below is Markdown. Add \`.md\` to any docs URL for the same. For a guide fitted to one project, build an AGENTS.md at ${SITE_URL}/?agents=open.`,
    "## Docs",
    docs.map((p) => `- [${p.title}](${mdUrl(p.path)}): ${p.summary}`).join("\n"),
    "## Components",
    components.map((p) => `- [${p.title}](${mdUrl(p.path)}): ${p.summary}`).join("\n"),
    "## Optional",
    [
      `- [Everything in one file](${SITE_URL}/llms-full.txt)`,
      `- [npm: @entrepta/cli](${LINKS.npmCli})`,
      `- [Source on GitHub](${LINKS.github})`,
      ...USED_BY.map((u) => `- [Built with entrepta: ${u.name}](${u.href}): ${u.what}`),
    ].join("\n"),
  ].join("\n\n")}\n`;
}

export function llmsFullTxt(): string {
  return `${MD_PAGES.map((p) => p.render()).join("\n\n---\n\n")}\n`;
}
