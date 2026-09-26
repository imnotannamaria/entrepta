import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import {
  Card,
  CardComment,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
} from "@entrepta/registry/primitives/card";

const SCALE = [
  {
    token: "text-display-xl",
    spec: "80 / 76 · serif",
    sample: (
      <span className="font-serif text-display-xl font-normal">
        Anna <em className="italic">Maria</em>
      </span>
    ),
  },
  {
    token: "text-display-lg",
    spec: "64 / 64 · serif",
    sample: (
      <span className="font-serif text-display-lg font-normal">
        Build with <em className="italic text-[var(--fg-brand)]">entrepta.</em>
      </span>
    ),
  },
  {
    token: "text-display-md",
    spec: "40 / 44 · serif",
    sample: (
      <span className="font-serif text-display-md font-normal">
        One card. <span className="text-[var(--fg-muted)]">Four variants.</span>
      </span>
    ),
  },
  {
    token: "text-heading-lg",
    spec: "24 / 31 · serif",
    sample: (
      <span className="font-serif text-heading-lg text-[var(--fg-primary)]">Project name</span>
    ),
  },
  {
    token: "text-heading-md",
    spec: "18 / 25 · serif",
    sample: (
      <span className="font-serif text-heading-md text-[var(--fg-primary)]">Latest post</span>
    ),
  },
  {
    token: "text-body-lg",
    spec: "16 / 26 · sans",
    sample: (
      <span className="font-sans text-body-lg text-[var(--fg-secondary)]">
        A dark-first design system with editor metaphors. Copy-paste components into your repo, own
        the source.
      </span>
    ),
  },
  {
    token: "text-body-md",
    spec: "14 / 21 · sans",
    sample: (
      <span className="font-sans text-body-md text-[var(--fg-secondary)]">
        A small headless CLI that copies typed components into your repo.
      </span>
    ),
  },
  {
    token: "text-mono-md",
    spec: "14 / 21 · mono",
    sample: (
      <span className="font-mono text-mono-md text-[var(--fg-primary)]">
        $ npx @entrepta/cli@latest init
      </span>
    ),
  },
  {
    token: "text-mono-sm",
    spec: "12 / 17 · mono",
    sample: (
      <span className="font-mono text-mono-sm text-[var(--fg-secondary)]">
        {"// strength day · low cardio"}
      </span>
    ),
  },
  {
    token: "text-mono-xs",
    spec: "10 / 13 · mono",
    sample: (
      <span className="font-mono text-mono-xs text-[var(--fg-muted)] uppercase tracking-[0.08em]">
        TypeScript · UTF-8 · Ln 1, Col 1
      </span>
    ),
  },
];

const FAMILIES = [
  {
    label: "serif · display",
    name: "Newsreader",
    sample: (
      <span className="font-serif text-display-md leading-none">
        Aa<em className="italic">Bb</em>
      </span>
    ),
    comment: "headlines · proper nouns",
  },
  {
    label: "mono",
    name: "JetBrains Mono",
    sample: (
      <span className="font-mono text-display-md leading-none">
        Aa<span className="text-[var(--fg-brand)]">{"{ }"}</span>
      </span>
    ),
    comment: "UI · metadata · code",
  },
  {
    label: "sans · body",
    name: "Inter",
    sample: <span className="font-sans text-display-md leading-none font-medium">Aa Bb</span>,
    comment: "long-form prose only",
  },
];

export default function TypographyPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="02 · foundations"
        title={
          <>
            <em>Typography.</em> Three families, deliberate contrast.
          </>
        }
        description="Newsreader serif for headlines and proper nouns. JetBrains Mono for everything else. Inter only for long-form prose."
        meta="10 scale tokens"
      />

      <section className="mb-14">
        <DocSubhead count="3 families">Families</DocSubhead>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {FAMILIES.map((f) => (
            <Card key={f.name}>
              <CardHeader>
                <CardLabel>{f.label}</CardLabel>
                <CardMeta>{f.name}</CardMeta>
              </CardHeader>
              <div className="flex items-center min-h-[80px] text-[var(--fg-primary)]">
                {f.sample}
              </div>
              <CardFooter>
                <CardComment>{f.comment}</CardComment>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <DocSubhead count={`${SCALE.length} tokens`}>Scale</DocSubhead>
        <div className="flex flex-col">
          {SCALE.map((s, i) => (
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
              <div className="text-[var(--fg-primary)] overflow-hidden">{s.sample}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <DocSubhead count="3 rules">Using the scale</DocSubhead>
        <ul className="m-0 flex max-w-2xl list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
          <li>
            <span className="text-[var(--fg-primary)]">A step is a size, not a font.</span> Each one
            sets size and leading, and the display steps their tracking. Pair it with font-serif,
            font-sans or font-mono where you use it.
          </li>
          <li>
            <span className="text-[var(--fg-primary)]">Only these ten.</span> No arbitrary pixel
            sizes and no Tailwind default steps. A test in the registry fails on both. Inline
            fontSize is kept for glyphs such as ◆, at 18px or less.
          </li>
          <li>
            <span className="text-[var(--fg-primary)]">Registered in cn.</span> Without it,
            tailwind-merge reads text-mono-sm as a color and drops it next to
            text-[var(--fg-muted)]. lib/utils.ts, which init writes, already has it.
          </li>
        </ul>
        <CodeBlock
          className="mt-6"
          variant="terminal"
          language="tsx"
          filename="usage.tsx"
          code={`<h2 className="font-serif text-display-md">Work</h2>
<span className="font-mono text-mono-sm uppercase">latest post</span>

/* or as a variable, in plain CSS */
.label { font-size: var(--text-mono-sm); line-height: var(--text-mono-sm--line-height); }`}
        />
      </section>
    </article>
  );
}
