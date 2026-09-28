import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import {
  TYPE_FAMILIES,
  TYPE_RULES,
  TYPE_SCALE,
  TYPE_USAGE,
  foundationPage,
} from "@/lib/foundations";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import {
  Card,
  CardComment,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
} from "@entrepta/registry/primitives/card";
import type { Metadata } from "next";

const PAGE = foundationPage("typography");

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.summary,
  alternates: {
    canonical: "/docs/foundations/typography",
    types: { "text/markdown": "/docs/foundations/typography.md" },
  },
};

/** A sample of each step. The steps themselves, and their specs, are in lib/foundations.ts. */
const SAMPLES: Record<(typeof TYPE_SCALE)[number]["token"], React.ReactNode> = {
  "text-display-xl": (
    <span className="font-serif text-display-xl font-normal">
      Anna <em className="italic">Maria</em>
    </span>
  ),
  "text-display-lg": (
    <span className="font-serif text-display-lg font-normal">
      Build with <em className="italic text-[var(--fg-brand)]">entrepta.</em>
    </span>
  ),
  "text-display-md": (
    <span className="font-serif text-display-md font-normal">
      One card. <span className="text-[var(--fg-muted)]">Four variants.</span>
    </span>
  ),
  "text-heading-lg": (
    <span className="font-serif text-heading-lg text-[var(--fg-primary)]">Project name</span>
  ),
  "text-heading-md": (
    <span className="font-serif text-heading-md text-[var(--fg-primary)]">Latest post</span>
  ),
  "text-body-lg": (
    <span className="font-sans text-body-lg text-[var(--fg-secondary)]">
      A dark-first design system with editor metaphors. Copy-paste components into your repo, own
      the source.
    </span>
  ),
  "text-body-md": (
    <span className="font-sans text-body-md text-[var(--fg-secondary)]">
      A small headless CLI that copies typed components into your repo.
    </span>
  ),
  "text-mono-md": (
    <span className="font-mono text-mono-md text-[var(--fg-primary)]">
      $ npx @entrepta/cli@latest init
    </span>
  ),
  "text-mono-sm": (
    <span className="font-mono text-mono-sm text-[var(--fg-secondary)]">
      {"// strength day · low cardio"}
    </span>
  ),
  "text-mono-xs": (
    <span className="font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
      TypeScript · UTF-8 · Ln 1, Col 1
    </span>
  ),
};

const FAMILY_SAMPLES: Record<(typeof TYPE_FAMILIES)[number]["name"], React.ReactNode> = {
  Newsreader: (
    <span className="font-serif text-display-md leading-none">
      Aa<em className="italic">Bb</em>
    </span>
  ),
  "JetBrains Mono": (
    <span className="font-mono text-display-md leading-none">
      Aa<span className="text-[var(--fg-brand)]">{"{ }"}</span>
    </span>
  ),
  Inter: <span className="font-sans text-display-md font-medium leading-none">Aa Bb</span>,
};

export default function TypographyPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow={`${PAGE.num} · foundations`}
        title={
          <>
            <em>Typography.</em> Three families, deliberate contrast.
          </>
        }
        description={PAGE.description}
        meta={`${TYPE_SCALE.length} scale tokens`}
        markdown="/docs/foundations/typography"
      />

      <section className="mb-14">
        <DocSubhead count={`${TYPE_FAMILIES.length} families`}>Families</DocSubhead>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {TYPE_FAMILIES.map((f) => (
            <Card key={f.name}>
              <CardHeader>
                <CardLabel>{f.label}</CardLabel>
                <CardMeta>{f.name}</CardMeta>
              </CardHeader>
              <div className="flex items-center min-h-[80px] text-[var(--fg-primary)]">
                {FAMILY_SAMPLES[f.name]}
              </div>
              <CardFooter>
                <CardComment>{f.use}</CardComment>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <DocSubhead count={`${TYPE_SCALE.length} tokens`}>Scale</DocSubhead>
        <div className="flex flex-col">
          {TYPE_SCALE.map((s, i) => (
            <div
              key={s.token}
              className={`grid grid-cols-[180px_1fr] gap-6 items-center py-5 ${
                i > 0 ? "border-t border-[var(--border-subtle)]" : ""
              }`}
            >
              <div className="flex flex-col gap-1 font-mono text-mono-sm">
                <span className="text-[var(--fg-primary)]">{s.token}</span>
                <span className="text-[var(--fg-muted)]">{s.spec}</span>
              </div>
              <div className="text-[var(--fg-primary)] overflow-hidden">{SAMPLES[s.token]}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <DocSubhead count={`${TYPE_RULES.length} rules`}>Using the scale</DocSubhead>
        <ul className="m-0 flex max-w-2xl list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
          {TYPE_RULES.map((r) => (
            <li key={r.lead}>
              <span className="text-[var(--fg-primary)]">{r.lead}</span> {r.text}
            </li>
          ))}
        </ul>
        <CodeBlock
          className="mt-6"
          variant="terminal"
          language="tsx"
          filename={TYPE_USAGE.file}
          code={TYPE_USAGE.body}
        />
      </section>
    </article>
  );
}
