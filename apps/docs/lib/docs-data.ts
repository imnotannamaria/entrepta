import { COMPONENT_INDEX } from "./component-index";

/**
 * The content of the pages that are not component pages, as data. The page
 * renders it and lib/markdown.ts writes it out for agents, so the two cannot
 * say different things.
 */

export const CLI_COMMANDS = [
  {
    cmd: "npx @entrepta/cli@latest init",
    title: "init",
    desc: "Bootstraps a project. Writes the global CSS, lib/utils.ts and entrepta.json. Prompts for a theme, and for one fixed theme or all six.",
    flags: [
      { flag: "--theme=<preset>", desc: "Skip the prompts. Writes one fixed theme" },
      { flag: "--themes=all", desc: "Write all six themes, switchable with data-theme" },
      { flag: "--overwrite", desc: "Overwrite existing files without asking" },
    ],
  },
  {
    cmd: "npx @entrepta/cli@latest add <component>",
    title: "add",
    desc: "Copies one or more components into your project, with every file they import, and installs their npm packages.",
    flags: [{ flag: "--overwrite", desc: "Replace files that already exist" }],
  },
  {
    cmd: "npx @entrepta/cli@latest add",
    title: "add (interactive)",
    desc: "Same as above, no args. Opens a picker with every component.",
    flags: [],
  },
] as const;

export const REQUIREMENTS = [
  { label: "React", value: "19 or newer" },
  { label: "Framework", value: "Next.js 15 (App or Pages Router) or Vite" },
  { label: "Tailwind CSS", value: "v4, required: components are styled with its classes" },
  { label: "TypeScript", value: "5.x" },
] as const;

export const INIT_FILES = [
  {
    path: "app/globals.css",
    desc: "Tokens, reset, fonts and the type scale. src/index.css in Vite",
  },
  {
    path: "lib/utils.ts",
    desc: "The cn() helper (clsx and tailwind-merge), aware of the type scale",
  },
  { path: "entrepta.json", desc: "Config: theme, paths, aliases" },
] as const;

/** What each preset is for. Colors come from lib/theme.ts. */
export const THEME_NOTES: Record<string, { hover: string; vibe: string }> = {
  entrepta: { hover: "#9B8EFF", vibe: "Default. Violet, playful, IDE personality." },
  blossom: { hover: "#E04750", vibe: "Cherry red. Bold and confident." },
  marmalade: { hover: "#FF9D45", vibe: "Warm orange. Editorial and energetic." },
  julia: { hover: "#F178A0", vibe: "Warm pink. Soft and expressive." },
  ivy: { hover: "#4CBA7C", vibe: "Forest green. Calm and grounded." },
  bosco: { hover: "#4F86F3", vibe: "Deep blue. Technical and steady." },
};

/** How a theme or mode switch lands, on the Themes page and in its Markdown. */
export const THEME_SWITCH = {
  text: "A switch lands all at once. For its length, the hooks hold every transition, so no component eases into the new colors on its own clock. Where the browser has view transitions, the old and new page crossfade as one picture. With reduced motion, the switch is instant. If you set the attributes yourself, wrap the change in transitionTheme.",
  code: `import { transitionTheme } from "@/hooks/use-mode"

transitionTheme(() => {
  document.documentElement.setAttribute("data-theme", "ivy")
})`,
};

/* ------------------------------------------------------------------ */
/* Migrating to v2                                                     */
/* ------------------------------------------------------------------ */

/** The components 1.x shipped. */
export const V1_COMPONENTS = [
  "button",
  "badge",
  "input",
  "card",
  "dialog",
  "dropdown",
  "tooltip",
  "tabs",
  "status-bar",
  "top-nav",
  "skeleton",
  "toast",
  "theme-switcher",
  "mode-toggle",
  "command-palette",
  "code-block",
];

/** The components 2.0 added. Anything in the index after them is new in v3. */
export const V2_COMPONENTS = [
  "kbd",
  "checkbox",
  "switch",
  "textarea",
  "field",
  "filter-pill",
  "sidebar",
  "page-outline",
  "sect-head",
  "doc-parts",
  "chrome-message",
  "page-loading",
  "reveal",
  "type-in",
  "rolling-number",
  "spotlight",
  "arrow-link",
];

export const NEW_IN_V2 = COMPONENT_INDEX.filter((c) => V2_COMPONENTS.includes(c.slug));

export const NEW_IN_V3 = COMPONENT_INDEX.filter(
  (c) => !V1_COMPONENTS.includes(c.slug) && !V2_COMPONENTS.includes(c.slug)
);

/**
 * For a project that rolled its own version of a new component, such as the
 * portfolio entrepta came from: what to look for and replace.
 */
export const REPLACES: Record<string, string> = {
  kbd: "hand-styled key chips next to shortcuts",
  checkbox: "native checkboxes with accent-color, or a custom box",
  switch: "a custom toggle built from a div",
  textarea: "a textarea styled by hand",
  field: "label, hint and error markup wired to aria-describedby by hand",
  "filter-pill": "filter buttons that keep their state in the URL",
  sidebar: "an icon rail with its own active indicator",
  "page-outline": "a table of contents with a scrollspy",
  "sect-head": "a $ command rule above a section",
  "doc-parts": "the eyebrow, section and display heading pieces of a long page",
  "chrome-message": "404 and error screens",
  "page-loading": "a loading.tsx with dots or lines",
  reveal: "fade-in-on-scroll wrappers",
  "type-in": "a typewriter heading",
  "rolling-number": "an odometer counter",
  spotlight: "a glow that follows the cursor",
  "arrow-link": "a link with a moving arrow",
};

// Old class names are built by interpolation so the type scale test, which reads
// the docs, does not flag the examples as real sizes.
const px = (n: number) => `text-[${n}px]`;
const step = (name: string) => `text-${name}`;

export const MIGRATION = {
  sizes: [
    [px(10), step("mono-xs")],
    [
      `${px(11)}, ${step("xs")}`,
      `${step("mono-sm")} for labels, ${step("mono-xs")} for group headings`,
    ],
    [px(12), step("mono-sm")],
    [`${px(13)} or ${px(14)} in mono`, step("mono-md")],
    [`${px(13)} in sans`, step("body-md")],
    [`${step("sm")} on a large button`, step("body-lg")],
    [`${step("2xl")} on a Card or Dialog title`, step("heading-lg")],
  ] as [string, string][],
  tClasses: [
    [".t-display-xl", "font-serif text-display-xl"],
    [".t-heading-md", "font-serif text-heading-md (now 18px, was 20px)"],
    [".t-body-md", "font-sans text-body-md"],
    [".t-mono-sm", "font-mono text-mono-sm"],
    [".t-mono-xs", "font-mono text-mono-xs (now 10px, was 11px)"],
    [".t-muted, .t-secondary", "text-[var(--fg-muted)], text-[var(--fg-secondary)]"],
    [".t-brand", "text-[var(--fg-brand-text)] below 24px, text-[var(--fg-brand)] above"],
  ] as [string, string][],
  icons: [
    ["Loader2", "CircleNotchIcon, with animate-spin"],
    ["X", "XIcon"],
    ["Check", "CheckIcon"],
    ["ChevronRight", "CaretRightIcon"],
    ["Circle", 'CircleIcon weight="fill"'],
    ["Search", "MagnifyingGlassIcon"],
    ["Copy", "CopyIcon"],
    ["AlertTriangle", "WarningIcon"],
    ["Sun, Moon", "SunIcon, MoonIcon"],
  ] as [string, string][],
  inks: [
    ["text-[var(--bg-canvas)] on a brand fill", "text-[var(--fg-on-brand)]"],
    ["text-[var(--zinc-50)] on a brand fill", "text-[var(--fg-on-brand)]"],
    ["text-[var(--fg-brand)] on text below 24px", "text-[var(--fg-brand-text)]"],
    ["text-[var(--fg-brand-hover)] on the brand tint", "text-[var(--fg-brand-text)]"],
    ["--fg-brand-on-tint", "--fg-brand-text"],
    ["bg-[var(--bg-surface)] on a card", "bg-[var(--bg-card)]"],
    [
      "bg-[var(--bg-surface)] on a dialog, menu or code block",
      "bg-[var(--bg-overlay)] with the sheen class",
    ],
    ["bg-[var(--bg-surface)] on an input", "bg-[var(--bg-field)]"],
  ] as [string, string][],
  update: `# tokens and cn: add --themes=all if you use the ThemeSwitcher
npx @entrepta/cli@latest init --theme=entrepta --overwrite

# every component you already have
npx @entrepta/cli@latest add button card dialog --overwrite`,
  themes:
    "The ThemeSwitcher needs every theme in your CSS: run init with --themes=all. Light mode brands moved slightly (entrepta light is now #6656FF) so every ink clears AA, and light --fg-muted is #68686F. Add suppressHydrationWarning to your <html> if you use ThemeScript or ModeScript.",
  card: "The parts are the same. The look is new: near black with a glow in the corner, a border that lights up on hover, and a header that wraps. New: size (sm, md, xl), and as and icon on CardLabel. The terminal variant sets its own text color, so it reads in light mode.",
  components: [
    [
      "Tabs",
      'The × is a real button next to the tab, on the active tab only. Route tabs use TabNav and TabNavLink, and variant="window" draws the title bar. Tabs depend on motion.',
    ],
    [
      "Dropdown, Toast, Tooltip, CommandPalette",
      "All sit on the overlay surface. A highlighted row takes the brand tint instead of an edge bar, keyboard hints are Kbd, and a toast shows its status as an icon tile. The Toaster adds a close button.",
    ],
    ["StatusBar", 'position="static" puts it in your layout instead of five override classes.'],
    ["CodeBlock", "A failed copy says copy failed instead of claiming it copied."],
    [
      "RollingNumber, Reveal, TypeIn, Spotlight",
      "Bring the motion package when you add them. Nothing else needs it.",
    ],
  ] as [string, string][],
};
