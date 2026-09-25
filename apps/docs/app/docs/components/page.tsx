import { COMPONENT_INDEX, SECTIONS } from "@/lib/component-index";
import { findComponent } from "@/lib/manifest";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Components",
  description: `All ${COMPONENT_INDEX.length} entrepta components: ${COMPONENT_INDEX.map((c) => c.title).join(", ")}.`,
  alternates: { canonical: "/docs/components" },
};

const GROUPS = SECTIONS.map((section) => ({
  category: section,
  items: COMPONENT_INDEX.filter((c) => c.section === section).map((c) => ({
    name: c.title,
    href: `/docs/components/${c.slug}`,
    desc: findComponent(c.slug)?.description ?? "",
  })),
}));

export default function ComponentsIndex() {
  return (
    <article className="max-w-3xl">
      <div className="font-mono text-mono-xs uppercase tracking-widest text-[var(--fg-brand-text)] mb-6">
        reference
      </div>
      <h1 className="font-serif text-display-md font-normal text-[var(--fg-primary)] leading-tight tracking-tight mb-4">
        Components
      </h1>
      <p className="font-sans text-body-lg text-[var(--fg-secondary)] leading-relaxed mb-10">
        {COMPONENT_INDEX.length} components across {SECTIONS.length} sections. Copy each one with
        the CLI or by hand.
      </p>

      <div className="flex flex-col gap-10">
        {GROUPS.map((section) => (
          <div key={section.category}>
            <h2 className="font-mono text-mono-xs uppercase tracking-widest text-[var(--fg-muted)] border-b border-[var(--border-subtle)] pb-2 mb-4">
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
                    <div className="font-mono text-mono-md text-[var(--fg-primary)] mb-1">
                      {item.name}
                    </div>
                    <div className="font-sans text-mono-sm text-[var(--fg-muted)]">{item.desc}</div>
                  </div>
                  <span className="font-mono text-mono-sm text-[var(--fg-brand)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
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
