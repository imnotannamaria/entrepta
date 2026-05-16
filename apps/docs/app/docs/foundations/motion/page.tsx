import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { Card } from "@entrepta/registry/primitives/card";

const RADII = [
  { token: "radius.sm", value: "6px · badge", px: 6 },
  { token: "radius.md", value: "10px · button · input", px: 10 },
  { token: "radius.lg", value: "16px · card · dialog", px: 16 },
  { token: "radius.xl", value: "24px · featured", px: 24 },
  { token: "radius.full", value: "∞ · avatar · dot", px: 9999 },
];

const MOTION = [
  { token: "motion.fast", duration: "120ms", easing: "ease-out", use: "hover · tooltip" },
  { token: "motion.base", duration: "200ms", easing: "ease-out", use: "card · button" },
  { token: "motion.slow", duration: "320ms", easing: "ease-in-out", use: "modal · drawer" },
  { token: "shimmer", duration: "1.5s", easing: "linear loop", use: "skeleton" },
];

export default function MotionPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="04 · foundations"
        title={
          <>
            <em>Radius</em> & motion.
          </>
        }
        description="Soft, never round. Motion is fast and unfussy. The product is not a demo reel."
        meta="9 tokens"
      />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <DocSubhead count={`${RADII.length} tokens`}>Border radius</DocSubhead>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {RADII.map((r) => (
              <Card key={r.token}>
                <div className="flex items-center justify-center h-20">
                  <div
                    className="w-16 h-16 bg-[var(--bg-surface-brand)] border border-[var(--fg-brand)]/30"
                    style={{ borderRadius: `${Math.min(r.px, 9999)}px` }}
                  />
                </div>
                <div className="flex flex-col gap-1 font-mono text-[11px]">
                  <span className="text-[var(--fg-primary)]">{r.token}</span>
                  <span className="text-[var(--fg-muted)]">{r.value}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <DocSubhead count={`${MOTION.length} tokens`}>Motion</DocSubhead>
          <Card>
            <div className="flex flex-col">
              {MOTION.map((m, i) => (
                <div
                  key={m.token}
                  className={`grid grid-cols-[140px_70px_1fr_100px] gap-3 items-center py-3 font-mono text-[12px] ${
                    i > 0 ? "border-t border-[var(--border-subtle)]" : ""
                  }`}
                >
                  <span className="text-[var(--fg-primary)]">{m.token}</span>
                  <span className="text-[var(--fg-muted)]">{m.duration}</span>
                  <span className="text-[var(--fg-muted)]">{m.easing}</span>
                  <span className="text-[var(--fg-secondary)] text-right">{m.use}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-4 font-mono text-[11px] text-[var(--fg-muted)] leading-relaxed">
            <span className="text-[var(--fg-brand)]">{"// "}</span>
            Components respect{" "}
            <span className="text-[var(--fg-primary)]">prefers-reduced-motion</span> globally. All
            animations collapse to ~0ms when the user requests reduced motion.
          </div>
        </div>
      </section>
    </article>
  );
}
