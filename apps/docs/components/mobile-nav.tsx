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
import { NavGroups } from "./nav-groups";

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
              className="focus-ring inline-flex items-center justify-center size-8 rounded-[var(--radius-sm)] text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-hover-soft)] transition-colors"
            >
              <XIcon aria-hidden size={16} />
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="Site and docs" className="flex-1 overflow-y-auto px-4 pt-5 pb-16">
            <NavGroups
              groups={[{ heading: "Site", items: TOP_LINKS }, ...(isDocs ? DOCS_NAV : [])]}
              pathname={pathname}
            />
          </nav>

          <div className="border-t border-[var(--border-subtle)] px-4 py-3 font-mono text-mono-xs uppercase tracking-widest text-[var(--fg-muted)]">
            press <Kbd>⌘K</Kbd> to search
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
