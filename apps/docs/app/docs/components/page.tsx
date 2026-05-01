import Link from "next/link";

const COMPONENTS = [
  {
    category: "Primitives",
    items: [
      {
        name: "Button",
        href: "/docs/components/button",
        desc: "4 variants, 3 sizes, loading state",
      },
      {
        name: "Badge",
        href: "/docs/components/badge",
        desc: "solid/soft/outline × 6 semantic colors",
      },
      { name: "Input", href: "/docs/components/input", desc: "default, search, command (⌘K)" },
      { name: "Card", href: "/docs/components/card", desc: "default/featured/terminal/data" },
      {
        name: "Dialog",
        href: "/docs/components/dialog",
        desc: "Radix modal with accessible close",
      },
      {
        name: "Dropdown",
        href: "/docs/components/dropdown",
        desc: "Radix menu with items and separators",
      },
      {
        name: "Tooltip",
        href: "/docs/components/tooltip",
        desc: "Hover info with keyboard shortcut hint",
      },
      { name: "Tabs", href: "/docs/components/tabs", desc: "Editor-style file tabs (Radix)" },
    ],
  },
  {
    category: "Layout",
    items: [
      { name: "TabBar", href: "/docs/components/tab-bar", desc: "Full-width IDE editor tab bar" },
      {
        name: "StatusBar",
        href: "/docs/components/status-bar",
        desc: "Fixed bottom bar with brand color",
      },
      {
        name: "TopNav",
        href: "/docs/components/top-nav",
        desc: "Nav with logo, breadcrumb, actions",
      },
      {
        name: "SectionHeader",
        href: "/docs/components/section-header",
        desc: "Eyebrow + two-color headline",
      },
    ],
  },
  {
    category: "Feedback",
    items: [
      { name: "Toast", href: "/docs/components/toast", desc: "Sonner-based with entrepta tokens" },
      { name: "Skeleton", href: "/docs/components/skeleton", desc: "Animated shimmer placeholder" },
      {
        name: "CommandPalette",
        href: "/docs/components/command-palette",
        desc: "⌘K palette with cmdk",
      },
    ],
  },
];

export default function ComponentsIndex() {
  return (
    <article className="max-w-3xl">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-brand)] mb-6">
        reference
      </div>
      <h1 className="font-serif text-4xl font-normal text-[var(--fg-primary)] leading-tight tracking-tight mb-4">
        Components
      </h1>
      <p className="font-sans text-base text-[var(--fg-secondary)] leading-relaxed mb-10">
        17 components across 3 categories. All copy-paste via CLI or manual.
      </p>

      <div className="flex flex-col gap-10">
        {COMPONENTS.map((section) => (
          <div key={section.category}>
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] border-b border-[var(--border-subtle)] pb-2 mb-4">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start justify-between p-4 border border-[var(--border-subtle)] rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-colors"
                >
                  <div>
                    <div className="font-mono text-sm text-[var(--fg-primary)] mb-1">
                      {item.name}
                    </div>
                    <div className="font-sans text-xs text-[var(--fg-muted)]">{item.desc}</div>
                  </div>
                  <span className="font-mono text-xs text-[var(--fg-brand)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
