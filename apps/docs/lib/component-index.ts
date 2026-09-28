/**
 * Every component page: its slug (the manifest name), its title and its docs section, in
 * sidebar order. Small on purpose, so client components can import it. The long text is in
 * components.ts.
 */

/** Docs sections. Not the registry folders: Input lives in primitives/ but reads as a form. */
export const SECTIONS = [
  "Primitives",
  "Forms",
  "Layout",
  "Content",
  "Data",
  "Chat",
  "Feedback",
  "Motion",
] as const;
export type Section = (typeof SECTIONS)[number];

export type ComponentEntry = { slug: string; title: string; section: Section };

export const COMPONENT_INDEX: ComponentEntry[] = [
  { slug: "button", title: "Button", section: "Primitives" },
  { slug: "badge", title: "Badge", section: "Primitives" },
  { slug: "avatar", title: "Avatar", section: "Primitives" },
  { slug: "icon-tile", title: "IconTile", section: "Primitives" },
  { slug: "card", title: "Card", section: "Primitives" },
  { slug: "dialog", title: "Dialog", section: "Primitives" },
  { slug: "sheet", title: "Sheet", section: "Primitives" },
  { slug: "popover", title: "Popover", section: "Primitives" },
  { slug: "accordion", title: "Accordion", section: "Primitives" },
  { slug: "dropdown", title: "Dropdown", section: "Primitives" },
  { slug: "tooltip", title: "Tooltip", section: "Primitives" },
  { slug: "kbd", title: "Kbd", section: "Primitives" },
  { slug: "tabs", title: "Tabs", section: "Primitives" },
  { slug: "progress", title: "Progress", section: "Primitives" },
  { slug: "stepper", title: "Stepper", section: "Primitives" },
  { slug: "input", title: "Input", section: "Forms" },
  { slug: "textarea", title: "Textarea", section: "Forms" },
  { slug: "checkbox", title: "Checkbox", section: "Forms" },
  { slug: "switch", title: "Switch", section: "Forms" },
  { slug: "field", title: "Field", section: "Forms" },
  { slug: "money-input", title: "MoneyInput", section: "Forms" },
  { slug: "select", title: "Select", section: "Forms" },
  { slug: "combobox", title: "Combobox", section: "Forms" },
  { slug: "segmented-control", title: "SegmentedControl", section: "Forms" },
  { slug: "choice-card", title: "ChoiceCard", section: "Forms" },
  { slug: "swatch-picker", title: "SwatchPicker", section: "Forms" },
  { slug: "secret-field", title: "SecretField", section: "Forms" },
  { slug: "file-dropzone", title: "FileDropzone", section: "Forms" },
  { slug: "calendar", title: "Calendar", section: "Forms" },
  { slug: "date-picker", title: "DatePicker", section: "Forms" },
  { slug: "date-navigator", title: "DateNavigator", section: "Forms" },
  { slug: "filter-pill", title: "FilterPill", section: "Forms" },
  { slug: "status-bar", title: "StatusBar", section: "Layout" },
  { slug: "top-nav", title: "TopNav", section: "Layout" },
  { slug: "theme-switcher", title: "ThemeSwitcher", section: "Layout" },
  { slug: "mode-toggle", title: "ModeToggle", section: "Layout" },
  { slug: "sidebar", title: "Sidebar", section: "Layout" },
  { slug: "mobile-nav", title: "MobileNav", section: "Layout" },
  { slug: "bento-grid", title: "BentoGrid", section: "Layout" },
  { slug: "page-outline", title: "PageOutline", section: "Layout" },
  { slug: "code-block", title: "CodeBlock", section: "Content" },
  { slug: "sect-head", title: "SectHead", section: "Content" },
  { slug: "doc-parts", title: "Doc parts", section: "Content" },
  { slug: "amount", title: "Amount", section: "Data" },
  { slug: "metric", title: "Metric", section: "Data" },
  { slug: "delta", title: "Delta", section: "Data" },
  { slug: "sparkline", title: "Sparkline", section: "Data" },
  { slug: "chart", title: "Chart", section: "Data" },
  { slug: "bar-list", title: "BarList", section: "Data" },
  { slug: "contribution-grid", title: "ContributionGrid", section: "Data" },
  { slug: "redact", title: "Redact", section: "Data" },
  { slug: "prompt-input", title: "PromptInput", section: "Chat" },
  { slug: "chat-thread", title: "ChatThread", section: "Chat" },
  { slug: "list-row", title: "ListRow", section: "Data" },
  { slug: "table", title: "Table", section: "Data" },
  { slug: "data-table", title: "DataTable", section: "Data" },
  { slug: "filter-builder", title: "FilterBuilder", section: "Data" },
  { slug: "alert", title: "Alert", section: "Feedback" },
  { slug: "empty-state", title: "EmptyState", section: "Feedback" },
  { slug: "toast", title: "Toast", section: "Feedback" },
  { slug: "skeleton", title: "Skeleton", section: "Feedback" },
  { slug: "command-palette", title: "CommandPalette", section: "Feedback" },
  { slug: "chrome-message", title: "ChromeMessage", section: "Feedback" },
  { slug: "page-loading", title: "PageLoading", section: "Feedback" },
  { slug: "reveal", title: "Reveal", section: "Motion" },
  { slug: "type-in", title: "TypeIn", section: "Motion" },
  { slug: "rolling-number", title: "RollingNumber", section: "Motion" },
  { slug: "spotlight", title: "Spotlight", section: "Motion" },
  { slug: "spotlight-card", title: "SpotlightCard", section: "Motion" },
  { slug: "arrow-link", title: "ArrowLink", section: "Motion" },
];

export function findEntry(slug: string): ComponentEntry | undefined {
  return COMPONENT_INDEX.find((c) => c.slug === slug);
}

export type NavGroup = {
  heading: string;
  items: { label: string; href: string; external?: boolean }[];
};

/** The docs navigation, shared by the sidebar, the mobile menu and the palette. */
export const DOCS_NAV: NavGroup[] = [
  {
    heading: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "CLI Reference", href: "/docs/cli" },
      { label: "Themes", href: "/docs/themes" },
      { label: "What's new in v3", href: "/docs/whats-new-in-v3" },
      { label: "Migrating to v2", href: "/docs/migrating-to-v2" },
    ],
  },
  {
    heading: "Foundations",
    items: [
      { label: "Overview", href: "/docs/foundations" },
      { label: "Color", href: "/docs/foundations/color" },
      { label: "Typography", href: "/docs/foundations/typography" },
      { label: "Spacing & Grid", href: "/docs/foundations/spacing" },
      { label: "Radius & Motion", href: "/docs/foundations/motion" },
      { label: "Accessibility", href: "/docs/foundations/accessibility" },
      { label: "Rules", href: "/docs/foundations/rules" },
      { label: "Data", href: "/docs/foundations/data" },
    ],
  },
  ...SECTIONS.map((section) => ({
    heading: section,
    items: COMPONENT_INDEX.filter((c) => c.section === section).map((c) => ({
      label: c.title,
      href: `/docs/components/${c.slug}`,
    })),
  })),
];
