import { COMPONENT_INDEX } from "./component-index";
import { type COMPONENTS, PICKABLE, installClosure } from "./manifest";
import { RULES, type RuleTopic } from "./rules";
import { THEMES, type ThemeId } from "./theme";

/**
 * Builds the AGENTS.md (or CLAUDE.md) a project needs so a coding agent can
 * install and use entrepta without reading the docs. Pure: the configurator on
 * the home page calls it on every change, and the tests call it directly.
 */

export const FRAMEWORKS = ["next-app", "next-pages", "vite"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const FILE_NAMES = ["AGENTS.md", "CLAUDE.md"] as const;
export type FileName = (typeof FILE_NAMES)[number];

export type AgentsOptions = {
  framework: Framework;
  theme: ThemeId;
  mode: "dark" | "light";
  themes: "single" | "all";
  pm: PackageManager;
  /** Manifest names the user picked. Their dependencies come along on their own. */
  components: string[];
  fileName: FileName;
};

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  "next-app": "Next.js App Router",
  "next-pages": "Next.js Pages Router",
  vite: "Vite",
};

/** Where the CLI puts things, per framework. Mirrors packages/cli detect-framework.ts. */
const PATHS: Record<
  Framework,
  { css: string; components: string; alias: string; utils: string; hooks: string; lib: string }
> = {
  "next-app": {
    css: "app/globals.css",
    components: "app/components/entrepta/",
    alias: "@/app/components/entrepta",
    utils: "lib/utils.ts",
    hooks: "hooks/",
    lib: "lib/",
  },
  "next-pages": {
    css: "styles/globals.css",
    components: "components/entrepta/",
    alias: "@/components/entrepta",
    utils: "lib/utils.ts",
    hooks: "hooks/",
    lib: "lib/",
  },
  vite: {
    css: "src/index.css",
    components: "src/components/entrepta/",
    alias: "@/components/entrepta",
    utils: "src/lib/utils.ts",
    hooks: "src/hooks/",
    lib: "src/lib/",
  },
};

const RUNNERS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx",
};

const TYPE_STEPS = [
  "display-xl",
  "display-lg",
  "display-md",
  "heading-lg",
  "heading-md",
  "body-lg",
  "body-md",
  "mono-md",
  "mono-sm",
  "mono-xs",
];

/** The picked components, in docs order, with anything unknown dropped. */
export function pickedComponents(names: string[]) {
  const picked = new Set(names);
  return COMPONENT_INDEX.filter((c) => picked.has(c.slug)).map((c) => ({
    ...c,
    manifest: PICKABLE.find((p) => p.name === c.slug),
  }));
}

/** Everything `add` brings for these components, the picked ones included. */
export function closureOf(names: string[]) {
  const seen = new Map<string, (typeof COMPONENTS)[number]>();
  for (const name of names) for (const c of installClosure(name)) seen.set(c.name, c);
  return [...seen.values()];
}

/** Whether any of these, or what they pull in, animates through the motion package. */
export function usesMotion(names: string[]) {
  return closureOf(names).some((c) => c.deps.includes("motion"));
}

function bullets(lines: string[]) {
  return lines.map((l) => `- ${l}`).join("\n");
}

export function buildAgentsMd(options: AgentsOptions): string {
  const paths = PATHS[options.framework];
  const runner = RUNNERS[options.pm];
  const picked = pickedComponents(options.components);
  const names = picked.map((c) => c.slug);
  const closure = closureOf(names);
  const extras = closure.filter(
    (c) => !names.includes(c.name) && c.category !== "hooks" && c.category !== "lib"
  );
  const motion = usesMotion(names);
  const theme = THEMES.find((t) => t.id === options.theme) ?? THEMES[0];
  const isNext = options.framework !== "vite";

  const sections: string[] = [];

  sections.push(`# entrepta in this project

This project uses [entrepta](https://entrepta.vercel.app), a dark-first design system with an editor metaphor: tabs, a command palette, a status bar, shell prompts, serif italic next to mono. Its components are copied into the repo as source, so they are this project's code: read them, and edit them when a change calls for it.

Built for ${FRAMEWORK_LABELS[options.framework]} with the ${theme.label} theme.`);

  const initFlags = [`--theme=${theme.id}`, ...(options.themes === "all" ? ["--themes=all"] : [])];
  const setup = [
    `${runner} @entrepta/cli@latest init ${initFlags.join(" ")}`,
    ...(names.length ? [`${runner} @entrepta/cli@latest add ${names.join(" ")}`] : []),
  ];
  sections.push(`## Setup

\`\`\`bash
${setup.join("\n")}
\`\`\`

${bullets([
  `\`init\` writes the tokens, \`${paths.utils}\` with the \`cn\` helper, and \`entrepta.json\`.`,
  "`add` copies each component with whatever it imports and installs its npm packages.",
  "It never overwrites a file without `--overwrite`. Use that only to take an upstream update, since it replaces local edits.",
  options.framework === "vite"
    ? "entrepta needs Tailwind CSS v4: install `tailwindcss` and `@tailwindcss/vite`, and add `tailwindcss()` to the Vite plugins."
    : "entrepta needs Tailwind CSS v4: install `tailwindcss` and `@tailwindcss/postcss`, and list `@tailwindcss/postcss` in postcss.config.mjs.",
  ...(options.framework === "vite"
    ? [
        'Imports use `@/`, pointing at `src/`. Add `"paths": { "@/*": ["./src/*"] }` to the compilerOptions in tsconfig.app.json, and `resolve: { alias: { "@": path.resolve(__dirname, "src") } }` to vite.config.ts.',
      ]
    : []),
])}`);

  sections.push(`## Where things live

${bullets([
  `Tokens and global CSS: \`${paths.css}\``,
  `Components: \`${paths.components}\`, imported from \`${paths.alias}/<name>\``,
  `The \`cn\` helper: \`${paths.utils}\``,
  `Hooks: \`${paths.hooks}\`. Shared lib files: \`${paths.lib}\``,
])}`);

  sections.push(`## Theme and mode

${bullets([
  options.themes === "all"
    ? `All six themes are installed. \`${theme.id}\` is the default; switch with \`data-theme\` on \`<html>\` or the ThemeSwitcher.`
    : `One theme, \`${theme.id}\`, is installed. Changing it means running \`init\` again.`,
  `Default mode: ${options.mode}. Light mode is \`data-mode="light"\` on \`<html>\`; dark is the absence of it.`,
  "To switch from your own code, wrap the attribute change in `transitionTheme` from the `use-mode` hook. It holds every transition so the page changes at once, not component by component.",
  ...(options.mode === "light"
    ? ['Ship `data-mode="light"` on `<html>` in the server HTML so the first paint is light.']
    : []),
  ...(isNext
    ? [
        "ThemeScript and ModeScript set these attributes before React loads. Wherever they run, add `suppressHydrationWarning` to `<html>`.",
      ]
    : []),
])}`);

  sections.push(`## Tokens

${bullets([
  `Every color is a CSS variable from \`${paths.css}\`. Never write a hex in a component.`,
  "Surfaces: `--bg-canvas` for the page, `--bg-card` for cards, `--bg-overlay` for what covers the page (menus, tooltips, code, dialogs, toasts), `--bg-field` for inputs. `--bg-surface` is zinc-900, for small fills, never an area.",
  "Text: `--fg-primary`, `--fg-secondary`, `--fg-muted`. Borders: `--border-subtle`, `--border-strong`.",
  "Brand: `--fg-brand` for fills, borders, glyphs and text 24px and up. `--fg-brand-text` for brand-colored text below 24px. `--fg-on-brand` for text on a brand fill.",
  "Brand accents mix from the brand, so they follow the theme: `--border-brand`, `--border-brand-strong`, `--bg-surface-brand`, `--fg-brand-glow`. For a new one, use `color-mix(in srgb, var(--fg-brand) N%, transparent)`.",
  "Status: `--status-success`, `--status-warning`, `--status-error`, `--status-info` for fills and dots, `--status-*-fg` for text, `--status-*-soft` for tints.",
  "In Tailwind, write tokens as `bg-[var(--bg-card)]` and `text-[var(--fg-muted)]`.",
])}`);

  sections.push(`## Type

${bullets([
  `Font sizes come from ten steps and nothing else: ${TYPE_STEPS.map((s) => `\`text-${s}\``).join(", ")}.`,
  "A step sets size and leading, never the family. Pair it with `font-serif` (titles, proper nouns), `font-mono` (UI, labels, metadata) or `font-sans` (long prose).",
  "No arbitrary pixel sizes and no Tailwind default size steps.",
  "Compose classes with `cn()` from the utils file. It knows the scale, so a step and a color class survive together.",
])}`);

  const topics: RuleTopic[] = [
    "color",
    "type",
    "cards",
    ...(motion ? (["motion"] as const) : []),
    "a11y",
    "icons",
    "routing",
  ];
  sections.push(`## Rules

${bullets(
  RULES.filter((r) => topics.includes(r.topic)).map((r) => `Do: ${r.do}. Don't: ${r.dont}.`)
)}`);

  if (motion) {
    sections.push(`## Motion

${bullets([
  "Entrances use `whileInView` with `once`, never `animate`, even above the fold.",
  "Everything animated through JavaScript calls `useReducedMotion()` and drops its movement and delays. The CSS reset in the global styles does not reach it.",
  "Keep the real text in the DOM: animate `aria-hidden` pieces and put the sentence in an `sr-only` copy.",
  "Glows and shines move with `transform`. Rebuilding a gradient every frame stalls other animations.",
  "Shared values live in the motion lib file: `EASE_OUT`, `revealViewport`, `STAGGER_LIMIT`.",
])}`);
  }

  sections.push(`## Accessibility

${bullets([
  "Every ink clears WCAG AA on what it sits on, in every theme and mode. Keep each token on the surface it was measured for.",
  "Glyphs such as ◆, $ and // carry `aria-hidden`.",
  "Links get a brand outline on focus. A bare button with no focus style of its own takes the `.focus-ring` class.",
  'Put `<a href="#main" class="skip-link">skip to content</a>` first in `<body>`.',
  ...(names.includes("field")
    ? [
        "Wrap each form control in `Field`: it wires the label, `aria-describedby` and `aria-invalid`.",
      ]
    : []),
])}`);

  sections.push(`## Data

${bullets([
  "Money is an integer of minor units (123456 is 1,234.56), shown with Amount and typed with MoneyInput. Never a float.",
  "A day is a plain `YYYY-MM-DD` string, never a Date. Set the locale, currency and time zone once with `FormatProvider`; `lib/format` has the helpers.",
  "A change is a Delta: an arrow, a sign and words. No percentage from a base of zero or below; a missing value is a dash with its reason, never a zero.",
  "Series colors are palette keys, `chart-1` to `chart-8`, stored as the key, never a hex. The status colors appear in a chart only for results above and below zero, with a sign.",
  "A data component takes `loading` and draws its skeleton in its final shape. Empty and error are composed where the words are known: EmptyState, Alert, a Badge for stale data. A failed load is never an empty list.",
  "`RedactProvider` hides values on screen; Amount, Metric and RollingNumber follow it. It hides from view, not from the page.",
])}`);

  if (picked.length) {
    const sheet = picked.map((c) => {
      const exportsList = c.manifest?.exports ?? [];
      return `### ${c.title}

\`\`\`tsx
import { ${exportsList.join(", ")} } from "${paths.alias}/${c.slug}"

${c.manifest?.usage ?? ""}
\`\`\`

Docs: https://entrepta.vercel.app/docs/components/${c.slug}.md`;
    });
    const also = extras.length
      ? `\n\nAlso installed as dependencies: ${extras.map((c) => `\`${c.name}\``).join(", ")}.`
      : "";
    sections.push(`## Components

${sheet.join("\n\n")}${also}`);
  }

  sections.push(`## Reading the docs

${bullets([
  "Every docs page has a Markdown version at the same URL plus `.md`. Read that instead of the HTML. The component index is https://entrepta.vercel.app/docs/components.md, and each component has its own, such as https://entrepta.vercel.app/docs/components/button.md.",
  "https://entrepta.vercel.app/llms.txt lists every page. https://entrepta.vercel.app/llms-full.txt is all of them in one file.",
  "Upgrading from 1.x: https://entrepta.vercel.app/docs/migrating-to-v2.md, step by step, with every new component. From 2.x to 3 nothing breaks: https://entrepta.vercel.app/docs/whats-new-in-v3.md.",
  "Money, dates, series colors and data states: https://entrepta.vercel.app/docs/foundations/data.md.",
])}`);

  sections.push(`## Before calling a UI change done

${bullets([
  "Look at it at 375px wide, in dark and light, and with reduced motion on. Tests do not measure text or overflow.",
  "A card clips its content with no ellipsis. A row of two halves should wrap, with each half kept on one line.",
])}`);

  return `${sections.join("\n\n")}\n`;
}
