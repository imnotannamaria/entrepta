"use client";

import { DOCS_NAV } from "@/lib/component-index";
import { Sidebar } from "@entrepta/registry/layout/sidebar";
import { Input } from "@entrepta/registry/primitives/input";
import { Kbd } from "@entrepta/registry/primitives/kbd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

/** Lowercase, without accents, so "tipo" finds "Typography" only when it should. */
const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/**
 * The docs navigation is the registry's own labeled Sidebar, with a field
 * that narrows the pages as you type. `/` jumps to it from anywhere on the
 * page, the way the ⌘K palette does for a whole-site search.
 */
export function DocsSidebar() {
  const pathname = usePathname();
  const [query, setQuery] = React.useState("");
  const field = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, select, [contenteditable=true]");
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        field.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = fold(query.trim());
  const groups = DOCS_NAV.map((group) => ({
    title: group.heading,
    items: group.items
      .filter(
        (item) =>
          !needle || fold(item.label).includes(needle) || fold(group.heading).includes(needle)
      )
      .map((item) => ({ id: item.href, label: item.label, href: item.href })),
  })).filter((group) => group.items.length > 0);

  return (
    <Sidebar
      variant="labeled"
      label="Docs"
      groups={groups}
      active={pathname ?? undefined}
      linkComponent={Link}
      className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] md:flex"
      search={
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Input
              ref={field}
              variant="search"
              size="sm"
              placeholder="filter pages"
              aria-label="Filter the docs pages"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
              }}
            />
            {query ? null : (
              <Kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">/</Kbd>
            )}
          </div>
          {/* always in the page, so the message is read when it appears */}
          <output
            aria-live="polite"
            className="px-2.5 font-mono text-mono-xs text-[var(--fg-muted)] empty:hidden"
          >
            {groups.length === 0 ? `No page matches “${query}”.` : ""}
          </output>
        </div>
      }
    />
  );
}
