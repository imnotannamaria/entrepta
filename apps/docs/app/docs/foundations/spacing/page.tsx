import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { Card } from "@entrepta/registry/primitives/card";

const SCALE = [
  { token: "space.1", value: "4px", use: "badge ↔ text", px: 4 },
  { token: "space.2", value: "8px", use: "internal gap", px: 8 },
  { token: "space.3", value: "12px", use: "chip padding", px: 12 },
  { token: "space.4", value: "16px", use: "default padding", px: 16 },
  { token: "space.6", value: "24px", use: "card padding", px: 24 },
  { token: "space.8", value: "32px", use: "section gap", px: 32 },
  { token: "space.12", value: "48px", use: "block separator", px: 48 },
  { token: "space.16", value: "64px", use: "section gap large", px: 64 },
  { token: "space.24", value: "96px", use: "hero margin", px: 96 },
];

export default function SpacingPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="03 · foundations"
        title={
          <>
            <em>Grid</em> & spacing.
          </>
        }
        description="12 columns · 24px gutters · 1280px max container · 4px base spacing. Density is high but never chaotic."
        meta="9 scale tokens"
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
                  className="h-24 rounded-[3px] bg-[var(--bg-surface-brand)] flex items-end justify-center pb-2 font-mono text-[10px] text-[var(--fg-brand)]"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] text-[var(--fg-muted)]">
            <div className="border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2">
              <span className="text-[var(--fg-primary)]">1280px</span> max container
            </div>
            <div className="border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2">
              <span className="text-[var(--fg-primary)]">24px</span> gutter
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div>
          <DocSubhead count={`${SCALE.length} tokens`}>Spacing</DocSubhead>
          <Card>
            <div className="flex flex-col">
              {SCALE.map((s, i) => (
                <div
                  key={s.token}
                  className={`grid grid-cols-[100px_60px_1fr_100px] gap-3 items-center py-2.5 font-mono text-[12px] ${
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
