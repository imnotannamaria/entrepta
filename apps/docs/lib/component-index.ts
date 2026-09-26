/**
 * Every component page: its slug (the manifest name), its title and its docs section, in
 * sidebar order. Small on purpose, so client components can import it. The long text is in
 * components.ts.
 */

/** Docs sections. Not the registry folders: Input lives in primitives/ but reads as a form. */
export const SECTIONS = ["Primitives", "Forms", "Layout", "Content", "Feedback", "Motion"] as const;
export type Section = (typeof SECTIONS)[number];

export type ComponentEntry = { slug: string; title: string; section: Section };

export const COMPONENT_INDEX: ComponentEntry[] = [
  { slug: "button", title: "Button", section: "Primitives" },
  { slug: "badge", title: "Badge", section: "Primitives" },
  { slug: "card", title: "Card", section: "Primitives" },
  { slug: "dialog", title: "Dialog", section: "Primitives" },
  { slug: "dropdown", title: "Dropdown", section: "Primitives" },
  { slug: "tooltip", title: "Tooltip", section: "Primitives" },
  { slug: "kbd", title: "Kbd", section: "Primitives" },
  { slug: "tabs", title: "Tabs", section: "Primitives" },
  { slug: "input", title: "Input", section: "Forms" },
  { slug: "textarea", title: "Textarea", section: "Forms" },
  { slug: "checkbox", title: "Checkbox", section: "Forms" },
  { slug: "switch", title: "Switch", section: "Forms" },
  { slug: "field", title: "Field", section: "Forms" },
  { slug: "filter-pill", title: "FilterPill", section: "Forms" },
  { slug: "status-bar", title: "StatusBar", section: "Layout" },
  { slug: "top-nav", title: "TopNav", section: "Layout" },
  { slug: "theme-switcher", title: "ThemeSwitcher", section: "Layout" },
  { slug: "mode-toggle", title: "ModeToggle", section: "Layout" },
  { slug: "sidebar", title: "Sidebar", section: "Layout" },
  { slug: "page-outline", title: "PageOutline", section: "Layout" },
  { slug: "code-block", title: "CodeBlock", section: "Content" },
  { slug: "sect-head", title: "SectHead", section: "Content" },
  { slug: "doc-parts", title: "Doc parts", section: "Content" },
  { slug: "toast", title: "Toast", section: "Feedback" },
  { slug: "skeleton", title: "Skeleton", section: "Feedback" },
  { slug: "command-palette", title: "CommandPalette", section: "Feedback" },
  { slug: "chrome-message", title: "ChromeMessage", section: "Feedback" },
  { slug: "page-loading", title: "PageLoading", section: "Feedback" },
  { slug: "reveal", title: "Reveal", section: "Motion" },
  { slug: "type-in", title: "TypeIn", section: "Motion" },
  { slug: "rolling-number", title: "RollingNumber", section: "Motion" },
  { slug: "spotlight", title: "Spotlight", section: "Motion" },
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
