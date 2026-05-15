import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";

const NEUTRALS = [
  { token: "zinc-950", hex: "#09090B", use: "bg.canvas" },
  { token: "zinc-900", hex: "#18181B", use: "bg.surface" },
  { token: "zinc-800", hex: "#27272A", use: "border.subtle" },
  { token: "zinc-700", hex: "#3F3F46", use: "border.strong" },
  { token: "zinc-500", hex: "#71717A", use: "fg.muted" },
  { token: "zinc-400", hex: "#A1A1AA", use: "fg.secondary" },
  { token: "zinc-200", hex: "#E4E4E7", use: "text on dark" },
  { token: "zinc-50", hex: "#FAFAFA", use: "fg.primary" },
];

const ACCENTS = [
  { token: "violet-500", hex: "#7C6BFF", use: "entrepta brand" },
  { token: "violet-400", hex: "#9B8EFF", use: "brand hover" },
  { token: "indigo-400", hex: "#818CF8", use: "status.info" },
  { token: "emerald-500", hex: "#10B981", use: "status.success" },
  { token: "emerald-400", hex: "#34D399", use: "soft success fg" },
  { token: "amber-500", hex: "#F59E0B", use: "status.warning" },
  { token: "rose-500", hex: "#F43F5E", use: "status.error" },
];

const SEMANTIC = [
  { token: "bg.canvas", value: "zinc-950", use: "page background", swatch: "#09090B" },
  { token: "bg.surface", value: "zinc-900", use: "card background", swatch: "#18181B" },
  { token: "bg.surface.elevated", value: "zinc-800/60", use: "card hover", swatch: "#27272A" },
  {
    token: "bg.surface.brand",
    value: "brand/15",
    use: "featured card",
    swatch: "rgba(124,107,255,0.15)",
  },
  { token: "fg.primary", value: "zinc-50", use: "primary text", swatch: "#FAFAFA" },
  { token: "fg.secondary", value: "zinc-400", use: "secondary text", swatch: "#A1A1AA" },
  { token: "fg.muted", value: "zinc-500", use: "metadata · timestamps", swatch: "#71717A" },
  { token: "fg.brand", value: "varies by theme", use: "accent · CTAs", swatch: "#7C6BFF" },
  { token: "border.subtle", value: "zinc-800", use: "card border", swatch: "#27272A" },
  { token: "border.strong", value: "zinc-700", use: "input · divider", swatch: "#3F3F46" },
  { token: "status.success", value: "emerald-500", use: "synced · shipped", swatch: "#10B981" },
  { token: "status.warning", value: "amber-500", use: "stale · partial", swatch: "#F59E0B" },
  { token: "status.error", value: "rose-500", use: "error · denied", swatch: "#F43F5E" },
  { token: "status.info", value: "indigo-400", use: "loading · syncing", swatch: "#818CF8" },
];

function Swatch({
  chip,
  token,
  hex,
  use,
}: { chip: string; token: string; hex: string; use: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-full h-20 rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
        style={{ background: chip }}
      />
      <div className="flex flex-col gap-0.5 font-mono text-[11px]">
        <div className="text-[var(--fg-primary)]">{token}</div>
        <div className="text-[var(--fg-muted)]">{hex}</div>
        <div className="text-[var(--fg-secondary)]">{use}</div>
      </div>
    </div>
  );
}

export default function ColorPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="01 · foundations"
        title={
          <>
            <em>Color.</em> Zinc neutrals, one accent.
          </>
        }
        description="Primitives are the atoms. Components consume only semantic tokens — never primitives directly. The accent shifts per theme; everything else is shared."
        meta="29 tokens"
      />

      <section className="mb-14">
        <DocSubhead count={`${NEUTRALS.length} tokens`}>Neutrals · zinc</DocSubhead>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {NEUTRALS.map((c) => (
            <Swatch key={c.token} chip={c.hex} token={c.token} hex={c.hex} use={c.use} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <DocSubhead count={`${ACCENTS.length} tokens`}>Accents</DocSubhead>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ACCENTS.map((c) => (
            <Swatch key={c.token} chip={c.hex} token={c.token} hex={c.hex} use={c.use} />
          ))}
        </div>
      </section>

      <section>
        <DocSubhead count="consume these">Semantic · dark</DocSubhead>
        <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-3 px-4 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fg-muted)]">
            <div />
            <div>token</div>
            <div>value</div>
            <div>use</div>
          </div>
          {SEMANTIC.map((r, i) => (
            <div
              key={r.token}
              className={`grid grid-cols-[40px_1fr_1fr_1fr] gap-3 items-center px-4 py-3 font-mono text-[12px] ${
                i > 0 ? "border-t border-[var(--border-subtle)]" : ""
              }`}
            >
              <span
                className="block w-6 h-6 rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
                style={{ background: r.swatch }}
              />
              <span className="text-[var(--fg-primary)]">{r.token}</span>
              <span className="text-[var(--fg-secondary)]">{r.value}</span>
              <span className="text-[var(--fg-muted)]">{r.use}</span>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
