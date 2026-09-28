import { DocNote, DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { InkTable, SwatchGrid } from "@/components/token-values";
import {
  ACCENTS,
  BRAND,
  CHART,
  COLOR_NOTES,
  FINISH,
  FOREGROUND,
  INK_PAIRS,
  NEUTRALS,
  type Primitive,
  STATUS,
  SURFACES,
  foundationPage,
} from "@/lib/foundations";
import type { Metadata } from "next";

const PAGE = foundationPage("color");

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.summary,
  alternates: {
    canonical: "/docs/foundations/color",
    types: { "text/markdown": "/docs/foundations/color.md" },
  },
};

function PrimitiveGrid({ colors }: { colors: Primitive[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {colors.map((c) => (
        <div key={c.token} className="flex flex-col gap-2">
          <div
            className="h-20 w-full rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
            style={{ background: c.hex }}
          />
          <div className="flex flex-col gap-0.5 font-mono text-mono-sm">
            <div className="text-[var(--fg-primary)]">{c.token}</div>
            <div className="text-[var(--fg-muted)]">{c.hex}</div>
            <div className="text-[var(--fg-secondary)]">{c.use}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ColorPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow={`${PAGE.num} · foundations`}
        title={
          <>
            <em>Color.</em> Zinc neutrals, one accent.
          </>
        }
        description={PAGE.description}
        meta="live for your theme"
        markdown="/docs/foundations/color"
      />

      <section className="mb-14">
        <DocSubhead count={`${NEUTRALS.length} tokens`}>Neutrals · zinc</DocSubhead>
        <PrimitiveGrid colors={NEUTRALS} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${ACCENTS.length} tokens`}>Accents</DocSubhead>
        <PrimitiveGrid colors={ACCENTS} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${SURFACES.length} tokens`}>Surfaces</DocSubhead>
        <DocNote>{COLOR_NOTES.surfaces}</DocNote>
        <SwatchGrid swatches={SURFACES} />
      </section>

      <section className="mb-14">
        <DocSubhead count="1 class, 3 tokens">Finish</DocSubhead>
        <DocNote>{COLOR_NOTES.finish}</DocNote>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex h-24 items-end rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 font-mono text-mono-sm text-[var(--fg-muted)]">
            bg-card
          </div>
          <div className="sheen flex h-24 items-end rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 font-mono text-mono-sm text-[var(--fg-muted)] shadow-[var(--shadow-card)]">
            sheen bg-card shadow-card
          </div>
        </div>
        <SwatchGrid swatches={FINISH} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${FOREGROUND.length} tokens`}>Text and borders</DocSubhead>
        <SwatchGrid swatches={FOREGROUND} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${BRAND.length} tokens`}>Brand</DocSubhead>
        <DocNote>{COLOR_NOTES.brand}</DocNote>
        <SwatchGrid swatches={BRAND} />
      </section>

      <section className="mb-14">
        <DocSubhead count="measured live">Inks</DocSubhead>
        <DocNote>{COLOR_NOTES.inks}</DocNote>
        <InkTable pairs={INK_PAIRS} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${CHART.length} tokens`}>Chart palette</DocSubhead>
        <DocNote>{COLOR_NOTES.chart}</DocNote>
        <SwatchGrid swatches={CHART} />
      </section>

      <section>
        <DocSubhead count={`${STATUS.length} tokens`}>Status</DocSubhead>
        <SwatchGrid swatches={STATUS} />
      </section>
    </article>
  );
}
