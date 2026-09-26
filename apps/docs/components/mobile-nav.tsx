"use client";

import { Logo } from "@/components/logo";
import { DOCS_NAV } from "@/lib/component-index";
import { LINKS } from "@/lib/links";
import { Kbd } from "@entrepta/registry/primitives/kbd";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TOP_LINKS = [
  { label: "docs", href: "/docs" },
  { label: "install", href: "/#install" },
  { label: "principles", href: "/#principles" },
  { label: "components", href: "/docs/components" },
  { label: "themes", href: "/docs/themes" },
  { label: "npm ↗", href: LINKS.npmCli, external: true },
  { label: "github ↗", href: LINKS.github, external: true },
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
        className="focus-ring lg:hidden inline-flex items-center justify-center size-9 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:border-[var(--border-strong)] transition-colors"
        aria-label="Open navigation menu"
      >
        <ListIcon aria-hidden size={16} />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={"fixed inset-0 z-50 bg-black/60 backdrop-blur-[4px] " + "motion-fade"}
        />
        <DialogPrimitive.Content
          className={
            "fixed right-0 top-0 bottom-0 z-50 w-[min(85vw,360px)] " +
            "bg-[var(--bg-canvas)] border-l border-[var(--border-subtle)] " +
            "flex flex-col motion-fade"
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
              className="inline-flex items-center justify-center size-8 rounded-[var(--radius-sm)] text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-hover-soft)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <XIcon aria-hidden size={16} />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pt-5 pb-16">
            <div className="mb-2 px-2 font-mono text-mono-xs uppercase tracking-widest text-[var(--fg-muted)]">
              Site
            </div>
            <ul className="mb-8 flex flex-col gap-0.5">
              {TOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center h-9 px-2 rounded-[var(--radius-sm)] font-mono text-mono-md text-[var(--fg-secondary)] hover:bg-[var(--bg-hover-soft)] hover:text-[var(--fg-primary)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {isDocs &&
              DOCS_NAV.map((section) => (
                <div key={section.heading} className="mb-6">
                  <div className="font-mono text-mono-xs uppercase tracking-widest text-[var(--fg-muted)] px-2 mb-2">
                    {section.heading}
                  </div>
                  <ul className="flex flex-col gap-0.5">
                    {section.items.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`flex items-center h-8 px-2 rounded-[var(--radius-sm)] font-mono text-mono-sm transition-colors ${
                              active
                                ? "sheen bg-[var(--bg-card-hover)] text-[var(--fg-primary)] shadow-[var(--shadow-card)]"
                                : "text-[var(--fg-muted)] hover:bg-[var(--bg-hover-soft)] hover:text-[var(--fg-secondary)]"
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

          <div className="border-t border-[var(--border-subtle)] px-4 py-3 font-mono text-mono-xs uppercase tracking-widest text-[var(--fg-muted)]">
            press <Kbd>⌘K</Kbd> to search
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
