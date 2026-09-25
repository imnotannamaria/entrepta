"use client";

import { DOCS_NAV } from "@/lib/component-index";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 py-8">
      {DOCS_NAV.map((section) => (
        <div key={section.heading}>
          <div className="font-mono text-mono-xs uppercase tracking-widest text-[var(--fg-muted)] px-3 mb-2">
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
                      "flex items-center h-8 px-3 rounded-[var(--radius-sm)] font-mono text-mono-sm transition-colors",
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
