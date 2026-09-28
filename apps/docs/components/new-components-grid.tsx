import type { ComponentEntry } from "@/lib/component-index";
import { REPLACES } from "@/lib/docs-data";
import { findComponent } from "@/lib/manifest";
import { Badge } from "@entrepta/registry/primitives/badge";
import Link from "next/link";

/** A card per component, linking to its page, with what it replaces when it does. */
export function NewComponentsGrid({ entries }: { entries: readonly ComponentEntry[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {entries.map((c) => (
        <Link
          key={c.slug}
          href={`/docs/components/${c.slug}`}
          className="group flex flex-col gap-1.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-card-hover)]"
        >
          <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <span className="font-mono text-mono-md text-[var(--fg-primary)]">{c.title}</span>
            <Badge size="sm" variant="outline" color="neutral">
              {c.section.toLowerCase()}
            </Badge>
          </span>
          <span className="font-sans text-mono-sm text-[var(--fg-secondary)]">
            {findComponent(c.slug)?.description}
          </span>
          {REPLACES[c.slug] && (
            <span className="font-mono text-mono-xs text-[var(--fg-muted)]">
              replaces {REPLACES[c.slug]}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
