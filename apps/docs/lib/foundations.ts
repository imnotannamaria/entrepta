import { COMPONENT_INDEX } from "./component-index";
import { depsFor, findComponent } from "./manifest";
import { RULES } from "./rules";

/**
 * The content of the foundations pages. Each page renders it and
 * `lib/markdown.ts` builds the page's twin from it, so the two cannot drift.
 * The demos (type samples, the grid, the radius boxes) stay in the pages.
 */

export type Swatch = { token: string; note: string };
export type Primitive = { token: string; hex: string; use: string };
export type Token = { token: string; value: string; use: string };
/** A rule of thumb: a short lead in bold, then why. */
export type Point = { lead: string; text: string };

export type InkPair = {
  ink: string;
  on: string;
  /** The `on` token is translucent: measure it flattened over this one. */
  over?: string;
  /** The floor the contrast test enforces. */
  min: number;
  note: string;
};

export const FOUNDATIONS_INTRO =
  "Tokens, type, grid, motion. Every component is built from these primitives. Change them once and the whole system shifts.";

/** The seven pages, in order. `summary` is the card on the index, `description` the page's own header. */
export const FOUNDATION_PAGES = [
  {
    slug: "color",
    num: "01",
    title: "Color",
    summary:
      "Zinc neutrals and one brand. Surfaces, inks and accents, measured live for your theme.",
    description:
      "Primitives are the atoms. Components consume only the semantic tokens below, never a primitive or a hex. The brand shifts per theme. Everything else is shared.",
  },
  {
    slug: "typography",
    num: "02",
    title: "Typography",
    summary:
      "Three families. Newsreader serif for headlines, JetBrains Mono for UI, Inter for prose. Ten size tokens.",
    description:
      "Newsreader serif for headlines and proper nouns. JetBrains Mono for everything else. Inter only for long-form prose.",
  },
  {
    slug: "spacing",
    num: "03",
    title: "Grid & spacing",
    summary: "12-column grid, 24px gutter, 1280px max. Base spacing scale from 4px to 96px.",
    description:
      "12 columns, 24px gutters, a 1280px container and a 4px base. Density is high but never chaotic.",
  },
  {
    slug: "motion",
    num: "04",
    title: "Radius & motion",
    summary:
      "Soft corners from 6 to 24px. Motion with a job: entrances, counters, light. Always a reduced-motion path.",
    description:
      "Soft, never round. Motion with a job: entrances, counters and light that follows the cursor, each one earning its place. Every animation has a reduced-motion path.",
  },
  {
    slug: "accessibility",
    num: "05",
    title: "Accessibility",
    summary:
      "Inks measured in every theme, focus, the skip link, reduced motion, screen reader patterns.",
    description:
      "Six themes, two modes, and one rule: every ink clears WCAG AA on what it sits on. A test measures it on every change, and this page measures it live.",
  },
  {
    slug: "rules",
    num: "06",
    title: "Rules",
    summary: "The do and don't list, each one written after a real bug.",
    description:
      "Each rule was written after a real bug. The AGENTS.md generator on the home page reads this same list.",
  },
  {
    slug: "data",
    num: "07",
    title: "Data",
    summary:
      "Money in minor units, plain dates, changes with a sign, the series palette, loading and empty states.",
    description:
      "Money as integers, days as plain strings, changes with a sign, series in the palette. Every data component follows these, so a screen reads the same wherever the number comes from.",
  },
] as const;

export type FoundationSlug = (typeof FOUNDATION_PAGES)[number]["slug"];

export function foundationPage(slug: FoundationSlug) {
  const page = FOUNDATION_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`no foundations page ${slug}`);
  return page;
}

/* ------------------------------------------------------------------ */
/* Color                                                               */
/* ------------------------------------------------------------------ */

export const NEUTRALS: Primitive[] = [
  { token: "zinc-950", hex: "#09090B", use: "bg.canvas" },
  { token: "zinc-900", hex: "#18181B", use: "bg.surface, small fills" },
  { token: "zinc-800", hex: "#27272A", use: "border.subtle" },
  { token: "zinc-700", hex: "#3F3F46", use: "border.strong" },
  { token: "zinc-500", hex: "#71717A", use: "a reference; light fg.muted is #68686F" },
  { token: "zinc-400", hex: "#A1A1AA", use: "fg.secondary" },
  { token: "zinc-200", hex: "#E4E4E7", use: "text on dark" },
  { token: "zinc-50", hex: "#FAFAFA", use: "fg.primary" },
];

export const ACCENTS: Primitive[] = [
  { token: "violet-500", hex: "#7C6BFF", use: "entrepta brand" },
  { token: "violet-400", hex: "#9B8EFF", use: "brand hover" },
  { token: "indigo-400", hex: "#818CF8", use: "status.info" },
  { token: "emerald-500", hex: "#10B981", use: "status.success" },
  { token: "emerald-400", hex: "#34D399", use: "soft success fg" },
  { token: "amber-500", hex: "#F59E0B", use: "status.warning" },
  { token: "rose-500", hex: "#F43F5E", use: "status.error" },
];

export const SURFACES: Swatch[] = [
  { token: "--bg-canvas", note: "the page" },
  { token: "--bg-card", note: "cards, a hair above the canvas" },
  { token: "--bg-card-hover", note: "a card under the pointer" },
  { token: "--bg-overlay", note: "menus, tooltips, code, dialogs, the palette, toasts" },
  { token: "--bg-field", note: "inputs, textareas, the box of a checkbox or switch" },
  { token: "--bg-surface", note: "zinc-900: small fills only, never an area" },
];

export const FINISH: Swatch[] = [
  { token: "--sheen-tint", note: "the brand glow in a corner, 9% dark and 4% light" },
  { token: "--bg-surface-brand", note: "the tint a highlighted row takes" },
];

export const FOREGROUND: Swatch[] = [
  { token: "--fg-primary", note: "titles and body text" },
  { token: "--fg-secondary", note: "supporting text" },
  { token: "--fg-muted", note: "metadata, timestamps" },
  { token: "--border-subtle", note: "card and divider borders" },
  { token: "--border-strong", note: "inputs, hover borders" },
];

export const BRAND: Swatch[] = [
  { token: "--fg-brand", note: "fills, borders, glyphs, text 24px and up" },
  { token: "--fg-brand-hover", note: "the fill on hover" },
  { token: "--fg-brand-text", note: "brand-colored text below 24px" },
  { token: "--fg-on-brand", note: "text on a brand fill" },
  { token: "--bg-surface-brand", note: "the tint: soft badges, selected items" },
  { token: "--border-brand", note: "35% of the brand" },
  { token: "--border-brand-strong", note: "60%, a featured card on hover" },
  { token: "--fg-brand-glow", note: "50%, pulses and glows" },
  { token: "--bg-spotlight", note: "the cursor glow, stronger in light mode" },
];

export const CHART: Swatch[] = [
  { token: "--chart-1", note: "the brand's hue" },
  ...[45, 90, 135, 180, 225, 270, 315].map((turn, i) => ({
    token: `--chart-${i + 2}`,
    note: `the brand's hue turned ${turn}°`,
  })),
  { token: "--chart-grid", note: "horizontal grid lines only" },
  { token: "--chart-axis", note: "axis labels" },
];

export const STATUS: Swatch[] = [
  { token: "--status-success", note: "synced, shipped" },
  { token: "--status-warning", note: "stale, partial" },
  { token: "--status-error", note: "error, denied" },
  { token: "--status-info", note: "loading, syncing" },
];

/** The inks entrepta promises, with the floors its contrast test enforces. */
export const INK_PAIRS: InkPair[] = [
  { ink: "--fg-on-brand", on: "--fg-brand", min: 4.5, note: "text on a brand fill" },
  { ink: "--fg-brand-text", on: "--bg-canvas", min: 4.5, note: "brand text on the page" },
  { ink: "--fg-brand-text", on: "--bg-card", min: 4.5, note: "brand text on a card" },
  {
    ink: "--fg-brand-text",
    on: "--bg-surface-brand",
    over: "--bg-canvas",
    min: 5,
    note: "brand text on the tint",
  },
  { ink: "--fg-primary", on: "--bg-canvas", min: 4.5, note: "body text" },
  { ink: "--fg-secondary", on: "--bg-card", min: 4.5, note: "secondary text on a card" },
  { ink: "--fg-muted", on: "--bg-canvas", min: 4.5, note: "metadata on the page" },
  { ink: "--fg-muted", on: "--bg-card", min: 4.5, note: "metadata on a card" },
  { ink: "--fg-muted", on: "--bg-overlay", min: 4.5, note: "metadata in a dialog" },
  {
    ink: "--status-success-fg",
    on: "--status-success-soft",
    over: "--bg-canvas",
    min: 4.5,
    note: "a soft success badge",
  },
  { ink: "--status-error-fg", on: "--bg-card", min: 4.5, note: "a field error on a card" },
];

export const COLOR_NOTES = {
  surfaces:
    "Cards sit on --bg-card, a hair above the canvas and defined by their border. Anything that covers the page, and code, sits on --bg-overlay. Fields sit on --bg-field. A zinc-900 area reads as a field of gray, so no component paints one.",
  finish:
    "Every surface has the same finish: near black underneath, the .sheen class for a brand glow in the top-left corner, and --edge-light, a line of light on the top edge, which --shadow-card and --shadow-overlay already carry. Put both on a surface of your own.",
  brand:
    "Every theme sets the brand and its two inks. The rest is mixed from --fg-brand with color-mix, so it follows any theme on its own. Switch the theme with the button in the corner and these repaint.",
  inks: "Each ink on what it actually sits on, measured for the theme and mode you are in. The floors are what the contrast test enforces in all twelve combinations.",
  chart:
    "No fixed color. Each series is the brand's hue, turned in steps of 45°, at one lightness per mode that clears 3:1 on a card. Switch the theme and the palette follows. A result above or below zero uses the status colors and a sign instead.",
};

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

export const TYPE_FAMILIES = [
  { label: "serif · display", name: "Newsreader", use: "headlines · proper nouns" },
  { label: "mono", name: "JetBrains Mono", use: "UI · metadata · code" },
  { label: "sans · body", name: "Inter", use: "long-form prose only" },
] as const;

/** Size over line height in px, and the family each step is meant for. */
export const TYPE_SCALE = [
  { token: "text-display-xl", spec: "80 / 76 · serif" },
  { token: "text-display-lg", spec: "64 / 64 · serif" },
  { token: "text-display-md", spec: "40 / 44 · serif" },
  { token: "text-heading-lg", spec: "24 / 31 · serif" },
  { token: "text-heading-md", spec: "18 / 25 · serif" },
  { token: "text-body-lg", spec: "16 / 26 · sans" },
  { token: "text-body-md", spec: "14 / 21 · sans" },
  { token: "text-mono-md", spec: "14 / 21 · mono" },
  { token: "text-mono-sm", spec: "12 / 17 · mono" },
  { token: "text-mono-xs", spec: "10 / 13 · mono" },
] as const;

export const TYPE_RULES: Point[] = [
  {
    lead: "A step is a size, not a font.",
    text: "Each one sets size and leading, and the display steps their tracking. Pair it with font-serif, font-sans or font-mono where you use it.",
  },
  {
    lead: "Only these ten.",
    text: "No arbitrary pixel sizes and no Tailwind default steps. A test in the registry fails on both. Inline fontSize is kept for glyphs such as ◆, at 18px or less.",
  },
  {
    lead: "Registered in cn.",
    text: "Without it, tailwind-merge reads text-mono-sm as a color and drops it next to text-[var(--fg-muted)]. lib/utils.ts, which init writes, already has it.",
  },
];

export const TYPE_USAGE = {
  file: "usage.tsx",
  body: `<h2 className="font-serif text-display-md">Work</h2>
<span className="font-mono text-mono-sm uppercase">latest post</span>

/* or as a variable, in plain CSS */
.label { font-size: var(--text-mono-sm); line-height: var(--text-mono-sm--line-height); }`,
};

/* ------------------------------------------------------------------ */
/* Grid and spacing                                                    */
/* ------------------------------------------------------------------ */

export const GRID: Token[] = [
  { token: "columns", value: "12", use: "the page grid" },
  { token: "gutter", value: "24px", use: "between columns" },
  { token: "container", value: "1280px", use: "the widest a page gets" },
];

export const SPACE_SCALE: (Token & { px: number })[] = [
  { token: "--space-1", value: "4px", use: "badge ↔ text", px: 4 },
  { token: "--space-2", value: "8px", use: "internal gap", px: 8 },
  { token: "--space-3", value: "12px", use: "chip padding", px: 12 },
  { token: "--space-4", value: "16px", use: "default padding", px: 16 },
  { token: "--space-6", value: "24px", use: "card padding", px: 24 },
  { token: "--space-8", value: "32px", use: "section gap", px: 32 },
  { token: "--space-12", value: "48px", use: "block separator", px: 48 },
  { token: "--space-16", value: "64px", use: "large section gap", px: 64 },
  { token: "--space-24", value: "96px", use: "hero margin", px: 96 },
];

/* ------------------------------------------------------------------ */
/* Radius and motion                                                   */
/* ------------------------------------------------------------------ */

export const RADII: (Token & { px: number })[] = [
  { token: "--radius-sm", value: "6px", use: "badge", px: 6 },
  { token: "--radius-md", value: "10px", use: "button, input", px: 10 },
  { token: "--radius-lg", value: "16px", use: "card, dialog", px: 16 },
  { token: "--radius-xl", value: "24px", use: "featured", px: 24 },
  { token: "--radius-full", value: "9999px", use: "avatar, dot", px: 9999 },
];

export const MOTION_TOKENS: Token[] = [
  { token: "--motion-fast", value: "120ms", use: "hover, tooltip" },
  { token: "--motion-base", value: "200ms", use: "card, button, a menu opening" },
  { token: "--motion-slow", value: "320ms", use: "sheet, collapse, theme switch" },
  { token: "--ease-out", value: "cubic-bezier(0.2, 0.8, 0.2, 1)", use: "entrances and feedback" },
  {
    token: "--ease-in-out",
    value: "cubic-bezier(0.4, 0, 0.2, 1)",
    use: "a height that opens and closes",
  },
];

/** The Motion section of the index, with what the manifest says of each. */
export function motionComponents() {
  return COMPONENT_INDEX.filter((c) => c.section === "Motion").map((c) => ({
    slug: c.slug,
    title: c.title,
    note: findComponent(c.slug)?.description ?? "",
    /** Animates through the motion package, which installs with it. */
    js: depsFor(c.slug).includes("motion"),
  }));
}

export const MOTION_CSS: Swatch[] = [
  { token: ".type-line", note: "a line that types itself with no JS, set --type-chars" },
  { token: ".type-fade", note: "a line that fades up after --type-delay" },
  { token: ".type-caret", note: "a blinking block caret" },
  { token: ".type-late", note: "a line that only shows when a wait runs long" },
  { token: ".load-dot-1 to 3", note: "an ellipsis" },
  { token: ".skeleton-sweep", note: "one band of light over a grid of skeletons" },
  {
    token: ".motion-fade, .motion-pop, .motion-sheet",
    note: "an overlay or a sheet opening and closing",
  },
  {
    token: ".motion-collapse",
    note: "a panel opening to its height, handed over as --collapse-height",
  },
];

export const MOTION_NOTES = {
  reduced:
    "The global reset collapses every CSS animation and transition to about 0ms for people who ask for less motion. Components that animate through JavaScript call useReducedMotion() on their own.",
  components:
    "They share lib/motion.ts: the ease-out curve, one viewport rule and a stagger cap of six. The motion package installs with them and nowhere else.",
  css: "For what has to move before JavaScript runs, such as a loading screen or an overlay. They live in globals.css, and the reduced-motion reset stops them.",
};

export const MOTION_RULES = RULES.filter((r) => r.topic === "motion");

/* ------------------------------------------------------------------ */
/* Accessibility                                                       */
/* ------------------------------------------------------------------ */

export const A11Y_SECTIONS: {
  id: string;
  title: string;
  count: string;
  note?: string;
  /** Show the ink pairs, measured. */
  inks?: boolean;
  points?: Point[];
  code?: { file: string; body: string };
}[] = [
  {
    id: "inks",
    title: "Inks",
    count: "12 combinations",
    inks: true,
    note: "No single ink reads on all six brands, so each theme sets two: --fg-on-brand for text on a brand fill, and --fg-brand-text for brand-colored text. The contrast test in the registry checks every pair below in all twelve theme and mode combinations. Switch the theme to see the numbers move.",
  },
  {
    id: "focus",
    title: "Focus",
    count: "2 ways",
    note: "Links get a 2px brand outline. Buttons and menu items draw their own focus, because the reset removes outlines from them. A bare button with no style of its own takes the .focus-ring class, a box-shadow ring that survives the reset.",
    code: {
      file: "icon-button.tsx",
      body: `<button type="button" className="focus-ring" aria-label="Close">
  <XIcon aria-hidden />
</button>`,
    },
  },
  {
    id: "skip-link",
    title: "Skip link",
    count: "first in body",
    note: "Hidden until the first Tab, then a mono chip with a $ in the top left. Point it at your main landmark.",
    code: {
      file: "app/layout.tsx",
      body: `<body>
  <a href="#main" className="skip-link">skip to content</a>
  …
  <main id="main" tabIndex={-1}>…</main>
</body>`,
    },
  },
  {
    id: "reduced-motion",
    title: "Reduced motion",
    count: "CSS and JS",
    note: "The global reset stops every CSS animation and transition for people who ask for less motion. Motion components animate through JavaScript, which that reset never reaches, so every one of them calls useReducedMotion() and drops its movement, delays and springs. The .type-* classes zero their delays too, except .type-late, whose delay is the wait itself.",
  },
  {
    id: "screen-readers",
    title: "Screen readers",
    count: "4 patterns",
    points: [
      {
        lead: "Glyphs are hidden.",
        text: "◆, $, // and the window dots carry aria-hidden, so a label is read as its words.",
      },
      {
        lead: "Animated text keeps a real copy.",
        text: "TypeIn and RollingNumber hide their animated pieces and put the sentence or the number in an sr-only element. Not aria-label: a span has no role, so the label would be ignored.",
      },
      {
        lead: "Forms are wired.",
        text: "Field points the control at its error or hint with aria-describedby and sets aria-invalid, and the error is announced as an alert.",
      },
      {
        lead: "Current means current.",
        text: 'Route tabs and the sidebar mark the active item with aria-current="page", the outline with aria-current="location", filter pills with aria-pressed.',
      },
    ],
  },
  {
    id: "theme-scripts",
    title: "Theme scripts",
    count: "1 attribute",
    note: "ThemeScript and ModeScript set data-theme and data-mode on <html> before React loads, so the page never flashes the wrong mode. React then sees attributes it did not render. Add suppressHydrationWarning to your <html> to tell it that is expected.",
    code: {
      file: "app/layout.tsx",
      body: `<html lang="en" suppressHydrationWarning>
  <head>
    <ThemeScript />
  </head>
  …
</html>`,
    },
  },
];
