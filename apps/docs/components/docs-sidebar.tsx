"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    heading: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "CLI Reference", href: "/docs/cli" },
      { label: "Themes", href: "/docs/themes" },
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
    ],
  },
  {
    heading: "Primitives",
    items: [
      { label: "Button", href: "/docs/components/button" },
      { label: "Badge", href: "/docs/components/badge" },
      { label: "Input", href: "/docs/components/input" },
      { label: "Card", href: "/docs/components/card" },
      { label: "Dialog", href: "/docs/components/dialog" },
      { label: "Dropdown", href: "/docs/components/dropdown" },
      { label: "Tooltip", href: "/docs/components/tooltip" },
      { label: "Tabs", href: "/docs/components/tabs" },
    ],
  },
  {
    heading: "Layout",
    items: [
      { label: "StatusBar", href: "/docs/components/status-bar" },
      { label: "TopNav", href: "/docs/components/top-nav" },
      { label: "ThemeSwitcher", href: "/docs/components/theme-switcher" },
      { label: "ModeToggle", href: "/docs/components/mode-toggle" },
    ],
  },
  {
    heading: "Feedback",
    items: [
      { label: "Toast", href: "/docs/components/toast" },
      { label: "Skeleton", href: "/docs/components/skeleton" },
      { label: "CommandPalette", href: "/docs/components/command-palette" },
    ],
  },
  {
    heading: "Content",
    items: [{ label: "CodeBlock", href: "/docs/components/code-block" }],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 py-8">
      {NAV.map((section) => (
        <div key={section.heading}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] px-3 mb-2">
            {section.heading}
          </div>
          <ul className="flex flex-col">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center h-8 px-3 rounded-[var(--radius-sm)] font-mono text-xs transition-colors",
                      active
                        ? "bg-[var(--bg-surface-elevated)] text-[var(--fg-primary)]"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] hover:bg-[var(--bg-surface)]"
                    )}
                  >
                    {active && (
                      <span className="w-1 h-1 rounded-full bg-[var(--fg-brand)] mr-2 shrink-0" />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
