import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { GRID, SPACE_SCALE, foundationPage } from "@/lib/foundations";
import { Card } from "@entrepta/registry/primitives/card";
import type { Metadata } from "next";

const PAGE = foundationPage("spacing");

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.summary,
  alternates: {
    canonical: "/docs/foundations/spacing",
    types: { "text/markdown": "/docs/foundations/spacing.md" },
  },
};

export default function SpacingPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow={`${PAGE.num} · foundations`}
        title={
          <>
            <em>Grid</em> & spacing.
          </>
        }
        description={PAGE.description}
        meta={`${SPACE_SCALE.length} scale tokens`}
        markdown="/docs/foundations/spacing"
      />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Grid viz */}
        <div>
          <DocSubhead count="12 cols">Grid</DocSubhead>
          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-3 bg-[var(--bg-canvas)]">
            <div className="grid grid-cols-12 gap-[6px]">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static column indices
                  key={i}
                  className="h-24 rounded-[3px] bg-[var(--bg-surface-brand)] flex items-end justify-center pb-2 font-mono text-mono-xs text-[var(--fg-brand-text)]"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 font-mono text-mono-sm text-[var(--fg-muted)] sm:grid-cols-3">
            {GRID.map((g) => (
              <div
                key={g.token}
                className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] px-3 py-2"
              >
                <span className="text-[var(--fg-primary)]">{g.value}</span> {g.token}
              </div>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div>
          <DocSubhead count={`${SPACE_SCALE.length} tokens`}>Spacing</DocSubhead>
          <Card>
            <div className="flex flex-col">
              {SPACE_SCALE.map((s, i) => (
                <div
                  key={s.token}
                  className={`grid grid-cols-[100px_60px_1fr_100px] gap-3 items-center py-2.5 font-mono text-mono-sm ${
                    i > 0 ? "border-t border-[var(--border-subtle)]" : ""
                  }`}
                >
                  <span className="text-[var(--fg-primary)]">{s.token}</span>
                  <span className="text-[var(--fg-muted)]">{s.value}</span>
                  <span
                    className="h-1.5 rounded-[2px] bg-[var(--fg-brand)] inline-block"
                    style={{ width: `${s.px}px` }}
                  />
                  <span className="text-[var(--fg-muted)] text-right">{s.use}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </article>
  );
}
