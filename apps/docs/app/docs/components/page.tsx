import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { COMPONENT_INDEX, SECTIONS } from "@/lib/component-index";
import { NEW_IN_V2 } from "@/lib/docs-data";
import { findComponent } from "@/lib/manifest";
import { Badge } from "@entrepta/registry/primitives/badge";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Components",
  description: `All ${COMPONENT_INDEX.length} entrepta components: ${COMPONENT_INDEX.map((c) => c.title).join(", ")}.`,
  alternates: { canonical: "/docs/components", types: { "text/markdown": "/docs/components.md" } },
};

const GROUPS = SECTIONS.map((section) => ({
  category: section,
  items: COMPONENT_INDEX.filter((c) => c.section === section).map((c) => ({
    name: c.title,
    href: `/docs/components/${c.slug}`,
    desc: findComponent(c.slug)?.description ?? "",
    isNew: NEW_IN_V2.some((n) => n.slug === c.slug),
  })),
}));

export default function ComponentsIndex() {
  return (
    <article className="max-w-3xl">
      <DocPageHeader
        eyebrow="reference"
        title="Components"
        description={`${COMPONENT_INDEX.length} components across ${SECTIONS.length} sections, ${NEW_IN_V2.length} of them new in v2. Copy each one with the CLI or by hand.`}
        markdown="/docs/components"
      />

      <div className="flex flex-col gap-10">
        {GROUPS.map((section) => (
          <div key={section.category}>
            <DocSubhead count={`${section.items.length} components`}>{section.category}</DocSubhead>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start justify-between p-4 border border-[var(--border-subtle)] rounded-[var(--radius-sm)] bg-[var(--bg-canvas)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-strong)] transition-colors"
                >
                  <div>
                    <div className="mb-1 flex items-center gap-2 font-mono text-mono-md text-[var(--fg-primary)]">
                      {item.name}
                      {item.isNew && (
                        <Badge size="sm" variant="soft" color="brand">
                          new
                        </Badge>
                      )}
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
