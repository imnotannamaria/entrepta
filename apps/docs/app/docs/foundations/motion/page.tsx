import { DocNote, DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import {
  MOTION_CSS,
  MOTION_NOTES,
  MOTION_RULES,
  MOTION_TOKENS,
  RADII,
  foundationPage,
  motionComponents,
} from "@/lib/foundations";
import { ArrowLink } from "@entrepta/registry/motion/arrow-link";
import { Card } from "@entrepta/registry/primitives/card";
import type { Metadata } from "next";
import Link from "next/link";

const PAGE = foundationPage("motion");

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.summary,
  alternates: {
    canonical: "/docs/foundations/motion",
    types: { "text/markdown": "/docs/foundations/motion.md" },
  },
};

export default function MotionPage() {
  const components = motionComponents();
  const js = components.filter((c) => c.js).length;

  return (
    <article>
      <DocPageHeader
        eyebrow={`${PAGE.num} · foundations`}
        title={
          <>
            <em>Radius</em> & motion.
          </>
        }
        description={PAGE.description}
        meta={`${RADII.length + MOTION_TOKENS.length} tokens · ${components.length} components`}
        markdown="/docs/foundations/motion"
      />

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <DocSubhead count={`${RADII.length} tokens`}>Border radius</DocSubhead>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-3">
            {RADII.map((r) => (
              <Card key={r.token}>
                <div className="flex h-20 items-center justify-center">
                  <div
                    className="size-16 border border-[var(--border-brand)] bg-[var(--bg-surface-brand)]"
                    style={{ borderRadius: `var(${r.token})` }}
                  />
                </div>
                <div className="flex flex-col gap-1 font-mono text-mono-sm">
                  <span className="text-[var(--fg-primary)]">{r.token}</span>
                  <span className="text-[var(--fg-muted)]">
                    {r.value} · {r.use}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <DocSubhead count={`${MOTION_TOKENS.length} tokens`}>Motion</DocSubhead>
          <Card>
            <ul className="m-0 flex list-none flex-col p-0">
              {MOTION_TOKENS.map((m) => (
                <li
                  key={m.token}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--border-subtle)] py-3 font-mono text-mono-sm last:border-0"
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[var(--fg-primary)]">{m.token}</span>
                    <span className="break-all text-[var(--fg-muted)]">{m.value}</span>
                  </span>
                  <span className="text-[var(--fg-secondary)]">{m.use}</span>
                </li>
              ))}
            </ul>
          </Card>
          <div className="mt-4">
            <DocNote>{MOTION_NOTES.reduced}</DocNote>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <DocSubhead count={`${components.length} components`}>Motion components</DocSubhead>
        <DocNote>
          {`${js} of them animate through JavaScript. `}
          {MOTION_NOTES.components}
        </DocNote>
        <ul className="m-0 flex list-none flex-col p-0">
          {components.map((c) => (
            <li
              key={c.slug}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--border-subtle)] py-3 last:border-0"
            >
              <ArrowLink asChild>
                <Link href={`/docs/components/${c.slug}`}>{c.title}</Link>
              </ArrowLink>
              <span className="font-mono text-mono-sm text-[var(--fg-muted)]">
                {c.note}
                {c.js ? "" : " · CSS only"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <DocSubhead count={`${MOTION_CSS.length} classes`}>Motion in CSS</DocSubhead>
        <DocNote>{MOTION_NOTES.css}</DocNote>
        <ul className="m-0 flex list-none flex-col p-0 font-mono text-mono-sm">
          {MOTION_CSS.map((c) => (
            <li
              key={c.token}
              className="grid grid-cols-1 gap-1 border-b border-[var(--border-subtle)] py-2.5 last:border-0 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-4"
            >
              <code className="text-[var(--fg-primary)]">{c.token}</code>
              <span className="text-[var(--fg-muted)]">{c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <DocSubhead count="from the rules">Motion rules</DocSubhead>
        <ul className="m-0 flex list-none flex-col p-0">
          {MOTION_RULES.map((r) => (
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
