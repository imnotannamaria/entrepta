"use client";

import { Logo } from "@/components/logo";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TOP_LINKS = [
  { label: "install", href: "/#install" },
  { label: "principles", href: "/#principles" },
  { label: "components", href: "/docs/components" },
  { label: "themes", href: "/docs/themes" },
  { label: "github ↗", href: "https://github.com/imnotannamaria/entrepta", external: true },
];

const DOCS_NAV = [
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

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isDocs = pathname?.startsWith("/docs") ?? false;

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger — close the sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        className="md:hidden inline-flex items-center justify-center size-9 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:border-[var(--border-strong)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        aria-label="Open navigation menu"
      >
        <Menu aria-hidden style={{ width: 16, height: 16, strokeWidth: 1.5 }} />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-[4px] " +
            "data-[state=open]:animate-in data-[state=closed]:animate-out " +
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
          }
        />
        <DialogPrimitive.Content
          className={
            "fixed right-0 top-0 bottom-0 z-50 w-[min(85vw,360px)] " +
            "bg-[var(--bg-canvas)] border-l border-[var(--border-subtle)] " +
            "flex flex-col " +
            "data-[state=open]:animate-in data-[state=closed]:animate-out " +
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right " +
            "duration-200 ease-out"
          }
        >
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Browse the site and documentation pages.
          </DialogPrimitive.Description>

          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <Logo showTag />
            </Link>
            <DialogPrimitive.Close
              aria-label="Close navigation menu"
              className="inline-flex items-center justify-center size-8 rounded-[var(--radius-sm)] text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-surface)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <X aria-hidden style={{ width: 16, height: 16, strokeWidth: 1.5 }} />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] mb-3">
              Site
            </div>
            <ul className="flex flex-col mb-8">
              {TOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center h-9 px-2 rounded-[var(--radius-sm)] font-mono text-[13px] text-[var(--fg-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--fg-primary)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {isDocs &&
              DOCS_NAV.map((section) => (
                <div key={section.heading} className="mb-6">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] px-2 mb-2">
                    {section.heading}
                  </div>
                  <ul className="flex flex-col">
                    {section.items.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`flex items-center h-8 px-2 rounded-[var(--radius-sm)] font-mono text-xs transition-colors ${
                              active
                                ? "bg-[var(--bg-surface-elevated)] text-[var(--fg-primary)]"
                                : "text-[var(--fg-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--fg-secondary)]"
                            }`}
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

          <div className="border-t border-[var(--border-subtle)] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
            press{" "}
            <kbd className="px-1 py-0.5 border border-[var(--border-subtle)] rounded-[3px] text-[var(--fg-secondary)]">
              ⌘K
            </kbd>{" "}
            to search
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
