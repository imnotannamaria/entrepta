import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { RULES } from "@/lib/rules";
import { ArrowLink } from "@entrepta/registry/motion/arrow-link";
import { Card } from "@entrepta/registry/primitives/card";
import Link from "next/link";

const COMPONENTS = [
  { slug: "reveal", title: "Reveal", note: "rise and fade in once on screen, staggered" },
  {
    slug: "type-in",
    title: "TypeIn",
    note: "text that assembles itself, full sentence in the DOM",
  },
  { slug: "rolling-number", title: "RollingNumber", note: "odometer digits, one turn on hover" },
  { slug: "spotlight", title: "Spotlight", note: "brand glow trailing the cursor on a spring" },
  {
    slug: "arrow-link",
    title: "ArrowLink",
    note: "arrow that travels, rule that wipes in, CSS only",
  },
];

const CSS_CLASSES = [
  { name: ".type-line", note: "a line that types itself with no JS, set --type-chars" },
  { name: ".type-fade", note: "a line that fades up after --type-delay" },
  { name: ".type-caret", note: "a blinking block caret" },
  { name: ".type-late", note: "a line that only shows when a wait runs long" },
  { name: ".load-dot-1 to 3", note: "an ellipsis" },
  { name: ".skeleton-sweep", note: "one band of light over a grid of skeletons" },
];

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
        description="Soft, never round. Motion with a job: entrances, counters and light that follows the cursor, each one earning its place. Every animation has a reduced-motion path."
        meta="9 tokens · 5 components"
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
                <div className="flex flex-col gap-1 font-mono text-mono-sm">
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
                  className={`grid grid-cols-[140px_70px_1fr_100px] gap-3 items-center py-3 font-mono text-mono-sm ${
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

          <div className="mt-4 font-mono text-mono-sm text-[var(--fg-muted)] leading-relaxed">
            <span className="text-[var(--fg-brand)]">{"// "}</span>
            Components respect{" "}
            <span className="text-[var(--fg-primary)]">prefers-reduced-motion</span> globally. All
            animations collapse to ~0ms when the user requests reduced motion.
          </div>
        </div>
      </section>

      <section className="mt-14">
        <DocSubhead count={`${COMPONENTS.length} components`}>Motion components</DocSubhead>
        <p className="mb-4 max-w-2xl font-mono text-mono-sm leading-relaxed text-[var(--fg-muted)]">
          <span aria-hidden className="text-[var(--fg-brand)]">
            {"// "}
          </span>
          Four of them animate through the motion package, which installs with them and nowhere
          else. They share lib/motion.ts: the ease-out curve, one viewport rule and a stagger cap of
          six.
        </p>
        <ul className="m-0 flex list-none flex-col p-0">
          {COMPONENTS.map((c) => (
            <li
              key={c.slug}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--border-subtle)] py-3 last:border-0"
            >
              <ArrowLink asChild>
                <Link href={`/docs/components/${c.slug}`}>{c.title}</Link>
              </ArrowLink>
              <span className="font-mono text-mono-sm text-[var(--fg-muted)]">{c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <DocSubhead count={`${CSS_CLASSES.length} classes`}>Motion in CSS</DocSubhead>
        <p className="mb-4 max-w-2xl font-mono text-mono-sm leading-relaxed text-[var(--fg-muted)]">
          <span aria-hidden className="text-[var(--fg-brand)]">
            {"// "}
          </span>
          For what has to move before JavaScript runs, such as a loading screen. They live in
          globals.css, and the reduced-motion reset stops them.
        </p>
        <ul className="m-0 flex list-none flex-col p-0 font-mono text-mono-sm">
          {CSS_CLASSES.map((c) => (
            <li
              key={c.name}
              className="grid grid-cols-[180px_1fr] gap-4 border-b border-[var(--border-subtle)] py-2.5 last:border-0"
            >
              <code className="text-[var(--fg-primary)]">{c.name}</code>
              <span className="text-[var(--fg-muted)]">{c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <DocSubhead count="from the rules">Motion rules</DocSubhead>
        <ul className="m-0 flex list-none flex-col p-0">
          {RULES.filter((r) => r.topic === "motion").map((r) => (
            <li
              key={r.do}
              className="border-b border-[var(--border-subtle)] py-3 font-mono text-mono-sm last:border-0"
            >
              <span className="text-[var(--fg-primary)]">{r.do}.</span>{" "}
              <span className="text-[var(--fg-muted)]">{r.dont}.</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
