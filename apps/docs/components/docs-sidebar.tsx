"use client";

import { DOCS_NAV } from "@/lib/component-index";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs" className="flex flex-col gap-7 pt-8 pb-24">
      {DOCS_NAV.map((section) => (
        <div key={section.heading}>
          <div className="mb-2 px-3 font-mono text-mono-xs uppercase tracking-widest text-[var(--fg-muted)]">
            {section.heading}
          </div>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-8 items-center rounded-[var(--radius-sm)] px-3 font-mono text-mono-sm transition-colors",
                      active
                        ? "bg-[var(--bg-surface)] text-[var(--fg-primary)]"
                        : "text-[var(--fg-muted)] hover:bg-[var(--bg-hover-soft)] hover:text-[var(--fg-secondary)]"
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
