import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
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
    token: "display.xl",
    spec: "80 / 76 · serif",
    sample: (
      <span className="font-serif text-[80px] leading-[1] font-normal tracking-[-0.02em]">
        Anna <em className="italic">Maria</em>
      </span>
    ),
  },
  {
    token: "display.lg",
    spec: "64 / 64 · serif",
    sample: (
      <span className="font-serif text-[64px] leading-[1] font-normal tracking-[-0.02em]">
        Build with <em className="italic text-[var(--fg-brand)]">entrepta.</em>
      </span>
    ),
  },
  {
    token: "display.md",
    spec: "40 / 44 · serif",
    sample: (
      <span className="font-serif text-[40px] leading-[44px] font-normal tracking-[-0.01em]">
        One card. <span className="text-[var(--fg-muted)]">Four variants.</span>
      </span>
    ),
  },
  {
    token: "heading.lg",
    spec: "24 / 31 · serif",
    sample: (
      <span className="font-serif text-[24px] leading-[31px] text-[var(--fg-primary)]">
        Project name
      </span>
    ),
  },
  {
    token: "heading.md",
    spec: "20 / 28 · serif",
    sample: (
      <span className="font-serif text-[20px] leading-[28px] text-[var(--fg-primary)]">
        Latest post
      </span>
    ),
  },
  {
    token: "body.lg",
    spec: "16 / 26 · sans",
    sample: (
      <span className="font-sans text-[16px] leading-[26px] text-[var(--fg-secondary)]">
        A dark-first design system with editor metaphors. Copy-paste components into your repo, own
        the source.
      </span>
    ),
  },
  {
    token: "body.md",
    spec: "14 / 21 · sans",
    sample: (
      <span className="font-sans text-[14px] leading-[21px] text-[var(--fg-secondary)]">
        A small headless CLI that copies typed components into your repo.
      </span>
    ),
  },
  {
    token: "mono.md",
    spec: "14 / 21 · mono",
    sample: (
      <span className="font-mono text-[14px] leading-[21px] text-[var(--fg-primary)]">
        $ npx entrepta init
      </span>
    ),
  },
  {
    token: "mono.sm",
    spec: "12 / 17 · mono",
    sample: (
      <span className="font-mono text-[12px] leading-[17px] text-[var(--fg-secondary)]">
        {"// strength day · low cardio"}
      </span>
    ),
  },
  {
    token: "mono.xs",
    spec: "11 / 14 · mono",
    sample: (
      <span className="font-mono text-[11px] leading-[14px] text-[var(--fg-muted)] uppercase tracking-[0.08em]">
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
      <span className="font-serif text-[48px] leading-none">
        Aa<em className="italic">Bb</em>
      </span>
    ),
    comment: "headlines · proper nouns",
  },
  {
    label: "mono",
    name: "JetBrains Mono",
    sample: (
      <span className="font-mono text-[48px] leading-none">
        Aa<span className="text-[var(--fg-brand)]">{"{ }"}</span>
      </span>
    ),
    comment: "UI · metadata · code",
  },
  {
    label: "sans · body",
    name: "Inter",
    sample: <span className="font-sans text-[48px] leading-none font-medium">Aa Bb</span>,
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
              <div className="flex flex-col gap-1 font-mono text-[11px]">
                <span className="text-[var(--fg-primary)]">{s.token}</span>
                <span className="text-[var(--fg-muted)]">{s.spec}</span>
              </div>
              <div className="text-[var(--fg-primary)] overflow-hidden">{s.sample}</div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
