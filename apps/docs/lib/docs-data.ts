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

/** The docs introduction: what entrepta is opinionated about, and the first three steps. */
export const DOCS_INTRO = {
  description:
    "A dark-first design system distributed as copy-paste components, not an npm package of pre-built UI. You own the source. Run a command, the component lives in your repo, styled with your tokens, editable without fighting a library.",
  philosophy:
    "entrepta is opinionated about three things: a deep zinc-950 canvas (light mode is optional, never priority), editor metaphors as personality (tabs, ◆ markers, file paths, shell prompts), and copy-paste distribution (no SDK, no runtime telemetry, no wrapper between you and your components).",
  quickStart: [
    { cmd: "npx @entrepta/cli@latest init --theme=entrepta", comment: "tokens and config" },
    { cmd: "npx @entrepta/cli@latest add button badge input", comment: "copy components" },
    { cmd: "npm run dev", comment: "use them" },
  ],
} as const;

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

/**
 * Foundations, Data: how numbers, money and dates are held and shown, and how
 * a data component behaves while it loads, when it is empty and when it fails.
 */
export const DATA_FOUNDATION: {
  id: string;
  title: string;
  count: string;
  notes: string[];
  code?: { file: string; body: string };
}[] = [
  {
    id: "money",
    title: "Money",
    count: "minor units",
    notes: [
      "Money is an integer of minor units: 123456 is 1,234.56 in a currency with cents. Never a float, which drifts after a few sums.",
      "Amount shows it one way everywhere: mono with tabular figures, the real minus sign, the symbol in the muted ink. MoneyInput takes it in, from any pasted format.",
      "Set the locale, the currency and the time zone once, near the root, with FormatProvider. Every component that formats reads it.",
    ],
    code: {
      file: "app/layout.tsx",
      body: `<FormatProvider locale="pt-BR" currency="BRL" timeZone="America/Sao_Paulo">
  {children}
</FormatProvider>

<Amount value={-123456} />          // −R$ 1.234,56
<Amount value={950000} tone="auto" /> // +R$ 9.500,00, in the success ink`,
    },
  },
  {
    id: "dates",
    title: "Dates",
    count: "YYYY-MM-DD",
    notes: [
      "A day is a plain string, 2026-09-28, never a Date: a Date carries an instant, and a time zone can move it to the day before.",
      "Today is today in the account's time zone, from FormatProvider. Words and the first day of the week come from the locale.",
      "lib/format holds the helpers: today, addDays, addMonths, compareDates, formatDate, formatDateRange.",
    ],
  },
  {
    id: "changes",
    title: "Changes",
    count: "Delta",
    notes: [
      "A change is an arrow, a sign and words. Color only says whether it is good news, and intent decides which way is good: spending up is bad, income up is good.",
      "A percentage needs a positive base. From zero or below, Delta shows the difference in value; never +300% from nothing.",
      "A first value reads new. A missing one is a dash with its reason, never a zero.",
    ],
  },
  {
    id: "palette",
    title: "Series colors",
    count: "chart-1 to 8",
    notes: [
      "Series take the palette by name: chart-1 is the brand's hue, the other seven turn it by 45°. Every theme recolors its charts without a line of code.",
      "Store the key a person picked, such as chart-3, never a hex. SwatchPicker hands back the key and names each swatch after the hue it shows.",
      "The status colors appear in a chart only for results above and below zero, and always with a sign.",
    ],
  },
  {
    id: "states",
    title: "States",
    count: "loading, empty, error",
    notes: [
      "A data component takes loading and draws its own skeleton in its final shape: Metric, DataTable, ContributionGrid. Nothing jumps when the values arrive.",
      "Empty and error are composed where the words are known: EmptyState for nothing yet and for filters that hide everything, Alert for a failure that stays, a Badge for data that is stale.",
      "A failed load is never an empty list, which would read as current. DataTable takes an error and shows it in place of the rows.",
    ],
  },
  {
    id: "redact",
    title: "Hiding values",
    count: "Redact",
    notes: [
      "RedactProvider hides amounts and marked values behind a mask of their width, for a screen share or a café. Amount, Metric and RollingNumber follow it; wrap anything else in Redact.",
      "It hides from view, not from the page: the values stay in the HTML. It is no place for a secret.",
    ],
    code: {
      file: "app-shell.tsx",
      body: `const [hidden, setHidden] = useState(false)

<RedactProvider hidden={hidden}>
  <Button variant="ghost" aria-pressed={hidden} onClick={() => setHidden(!hidden)}>hide values</Button>
  <Metric label="balance" value={<Amount value={balance} />} />
</RedactProvider>`,
    },
  },
];

/** What changed in components that were already there, for "What's new in v3". */
export const V3_CHANGES: [string, string][] = [
  [
    "Theme and mode",
    "A switch lands in one frame, crossfaded where the browser can, instead of piece by piece.",
  ],
  [
    "Sidebar",
    'variant="labeled" with groups, a search slot, a footer and collapsible. It keeps the current item in view, and a labeled sidebar can be text only.',
  ],
  ["FilterPill", "With onRemove it is an applied filter, with a × named after what it removes."],
  ["Amount, Metric, RollingNumber", "They hide behind a mask when a RedactProvider asks."],
  [
    "Button",
    "asChild works again, and Button, Input, Textarea, StatusBar and TopNav render on the server.",
  ],
  ["Sheet", "container renders it inside a frame of your own."],
  ["Tabs", "An icon tab keeps its name for screen readers on a phone."],
  ["CodeBlock", "Scrolling the page over a block works again: it only holds sideways scrolls."],
  ["ChromeMessage", "Takes headingLevel, for an error inside a layout that has its own h1."],
  ["Form fields", "No code ligatures, which drew some typed slashes blank."],
  [
    "The CLI",
    "Every write resolves inside the project, symlinks included, and --version tells the truth.",
  ],
];

export const V3_UPDATE = `# the new tokens: the chart palette, the collapse animation, fields without ligatures
npx @entrepta/cli@latest init --theme=entrepta --overwrite

# the 2.x components that changed; keep the ones your project has
npx @entrepta/cli@latest add button input textarea card dialog tabs toast \\
  command-palette code-block sidebar filter-pill rolling-number \\
  mode-toggle theme-switcher status-bar top-nav use-mode use-theme --overwrite`;
