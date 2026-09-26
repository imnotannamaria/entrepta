"use client";

import type { NavGroup } from "@/lib/component-index";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Groups of links under a small heading, the current one on a raised row with
 * a brand dot. The docs sidebar and the mobile menu both render this, so a
 * change to how the current page looks lands in one place.
 */
export function NavGroups({
  groups,
  pathname,
  className,
}: {
  groups: NavGroup[];
  pathname: string | null;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-7", className)}>
      {groups.map((group) => (
        <div key={group.heading}>
          <div className="mb-2 px-3 font-mono text-mono-xs uppercase tracking-widest text-[var(--fg-muted)]">
            {group.heading}
          </div>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className={cn(
                      "flex h-8 items-center rounded-[var(--radius-sm)] px-3 font-mono text-mono-sm transition-colors",
                      active
                        ? "sheen bg-[var(--bg-card-hover)] text-[var(--fg-primary)] shadow-[var(--shadow-card)]"
                        : "text-[var(--fg-muted)] hover:bg-[var(--bg-hover-soft)] hover:text-[var(--fg-secondary)]"
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="mr-2 size-1 shrink-0 rounded-full bg-[var(--fg-brand)]"
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
