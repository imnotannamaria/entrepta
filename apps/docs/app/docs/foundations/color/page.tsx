import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { INK_PAIRS, InkTable, type Swatch, SwatchGrid } from "@/components/token-values";

const NEUTRALS = [
  { token: "zinc-950", hex: "#09090B", use: "bg.canvas" },
  { token: "zinc-900", hex: "#18181B", use: "bg.surface, small fills" },
  { token: "zinc-800", hex: "#27272A", use: "border.subtle" },
  { token: "zinc-700", hex: "#3F3F46", use: "border.strong" },
  { token: "zinc-500", hex: "#71717A", use: "a reference; light fg.muted is #68686F" },
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

const SURFACES: Swatch[] = [
  { token: "--bg-canvas", note: "the page" },
  { token: "--bg-card", note: "cards, a hair above the canvas" },
  { token: "--bg-card-hover", note: "a card under the pointer" },
  { token: "--bg-overlay", note: "menus, tooltips, code, dialogs, the palette, toasts" },
  { token: "--bg-field", note: "inputs, textareas, the box of a checkbox or switch" },
  { token: "--bg-surface", note: "zinc-900: small fills only, never an area" },
];

const FINISH: Swatch[] = [
  { token: "--sheen-tint", note: "the brand glow in a corner, 9% dark and 4% light" },
  { token: "--bg-surface-brand", note: "the tint a highlighted row takes" },
];

const FOREGROUND: Swatch[] = [
  { token: "--fg-primary", note: "titles and body text" },
  { token: "--fg-secondary", note: "supporting text" },
  { token: "--fg-muted", note: "metadata, timestamps" },
  { token: "--border-subtle", note: "card and divider borders" },
  { token: "--border-strong", note: "inputs, hover borders" },
];

const BRAND: Swatch[] = [
  { token: "--fg-brand", note: "fills, borders, glyphs, text 24px and up" },
  { token: "--fg-brand-hover", note: "the fill on hover" },
  { token: "--fg-brand-text", note: "brand-colored text below 24px" },
  { token: "--fg-on-brand", note: "text on a brand fill" },
  { token: "--bg-surface-brand", note: "the tint: soft badges, selected items" },
  { token: "--border-brand", note: "35% of the brand" },
  { token: "--border-brand-strong", note: "60%, a featured card on hover" },
  { token: "--fg-brand-glow", note: "50%, pulses and glows" },
  { token: "--bg-spotlight", note: "the cursor glow, stronger in light mode" },
];

const CHART: Swatch[] = [
  { token: "--chart-1", note: "the brand's hue" },
  ...[45, 90, 135, 180, 225, 270, 315].map((turn, i) => ({
    token: `--chart-${i + 2}`,
    note: `the brand's hue turned ${turn}°`,
  })),
  { token: "--chart-grid", note: "horizontal grid lines only" },
  { token: "--chart-axis", note: "axis labels" },
];

const STATUS: Swatch[] = [
  { token: "--status-success", note: "synced, shipped" },
  { token: "--status-warning", note: "stale, partial" },
  { token: "--status-error", note: "error, denied" },
  { token: "--status-info", note: "loading, syncing" },
];

function PrimitiveSwatch({
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
      <div className="flex flex-col gap-0.5 font-mono text-mono-sm">
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
        description="Primitives are the atoms. Components consume only the semantic tokens below, never a primitive or a hex. The brand shifts per theme. Everything else is shared."
        meta="live for your theme"
      />

      <section className="mb-14">
        <DocSubhead count={`${NEUTRALS.length} tokens`}>Neutrals · zinc</DocSubhead>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {NEUTRALS.map((c) => (
            <PrimitiveSwatch key={c.token} chip={c.hex} token={c.token} hex={c.hex} use={c.use} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <DocSubhead count={`${ACCENTS.length} tokens`}>Accents</DocSubhead>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ACCENTS.map((c) => (
            <PrimitiveSwatch key={c.token} chip={c.hex} token={c.token} hex={c.hex} use={c.use} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <DocSubhead count={`${SURFACES.length} tokens`}>Surfaces</DocSubhead>
        <p className="mb-4 max-w-2xl font-mono text-mono-sm leading-relaxed text-[var(--fg-muted)]">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          Cards sit on --bg-card, a hair above the canvas and defined by their border. Anything that
          covers the page, and code, sits on --bg-overlay. Fields sit on --bg-field. A zinc-900 area
          reads as a field of gray, so no component paints one.
        </p>
        <SwatchGrid swatches={SURFACES} />
      </section>

      <section className="mb-14">
        <DocSubhead count="1 class, 3 tokens">Finish</DocSubhead>
        <p className="mb-4 max-w-2xl font-mono text-mono-sm leading-relaxed text-[var(--fg-muted)]">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          Every surface has the same finish: near black underneath, the .sheen class for a brand
          glow in the top-left corner, and --edge-light, a line of light on the top edge, which
          --shadow-card and --shadow-overlay already carry. Put both on a surface of your own.
        </p>
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
        <p className="mb-4 max-w-2xl font-mono text-mono-sm leading-relaxed text-[var(--fg-muted)]">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          Every theme sets the brand and its two inks. The rest is mixed from --fg-brand with
          color-mix, so it follows any theme on its own. Switch the theme with the button in the
          corner and these repaint.
        </p>
        <SwatchGrid swatches={BRAND} />
      </section>

      <section className="mb-14">
        <DocSubhead count="measured live">Inks</DocSubhead>
        <p className="mb-4 max-w-2xl font-mono text-mono-sm leading-relaxed text-[var(--fg-muted)]">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          Each ink on what it actually sits on, measured for the theme and mode you are in. The
          floors are what the contrast test enforces in all twelve combinations.
        </p>
        <InkTable pairs={INK_PAIRS} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${CHART.length} tokens`}>Chart palette</DocSubhead>
        <p className="mb-4 max-w-2xl font-mono text-mono-sm leading-relaxed text-[var(--fg-muted)]">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          No fixed color. Each series is the brand's hue, turned in steps of 45°, at one lightness
          per mode that clears 3:1 on a card. Switch the theme and the palette follows. A result
          above or below zero uses the status colors and a sign instead.
        </p>
        <SwatchGrid swatches={CHART} />
      </section>

      <section>
        <DocSubhead count={`${STATUS.length} tokens`}>Status</DocSubhead>
        <SwatchGrid swatches={STATUS} />
      </section>
    </article>
  );
}
