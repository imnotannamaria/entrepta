import { DocPageHeader } from "@/components/doc-page-header";
import { RULES } from "@/lib/rules";
import { Button } from "@entrepta/registry/primitives/button";
import {
  Card,
  CardComment,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTitle,
} from "@entrepta/registry/primitives/card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Foundations",
  description:
    "entrepta foundations: color tokens, typography scale, spacing system, radius, motion. The CSS primitives every component is built on.",
  alternates: { canonical: "/docs/foundations" },
};

const PAGES = [
  {
    num: "01",
    label: "color",
    title: "Color",
    desc: "Zinc neutrals and one brand. Surfaces, inks and accents, measured live for your theme.",
    count: "live",
    href: "/docs/foundations/color",
  },
  {
    num: "02",
    label: "typography",
    title: "Typography",
    desc: "Three families. Newsreader serif for headlines, JetBrains Mono for UI, Inter for prose. Ten size tokens.",
    count: "10 tokens",
    href: "/docs/foundations/typography",
  },
  {
    num: "03",
    label: "spacing",
    title: "Grid & Spacing",
    desc: "12-column grid, 24px gutter, 1280px max. Base spacing scale from 4px to 96px.",
    count: "9 tokens",
    href: "/docs/foundations/spacing",
  },
  {
    num: "04",
    label: "motion",
    title: "Radius & Motion",
    desc: "Soft corners from 6 to 24px. Motion with a job: entrances, counters, light. Always a reduced-motion path.",
    count: "5 components",
    href: "/docs/foundations/motion",
  },
  {
    num: "05",
    label: "accessibility",
    title: "Accessibility",
    desc: "Inks measured in every theme, focus, the skip link, reduced motion, screen reader patterns.",
    count: "WCAG AA",
    href: "/docs/foundations/accessibility",
  },
  {
    num: "06",
    label: "rules",
    title: "Rules",
    desc: "The do and don't list, each one written after a real bug.",
    count: `${RULES.length} rules`,
    href: "/docs/foundations/rules",
  },
];

export default function FoundationsIndex() {
  return (
    <article>
      <DocPageHeader
        eyebrow="foundations"
        title={
          <>
            The <em>raw materials.</em>
          </>
        }
        description="Tokens, type, grid, motion. Every component is built from these primitives. Change them once and the whole system shifts."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PAGES.map((p) => (
          <Link key={p.label} href={p.href} className="group block">
            <Card className="h-full hover:border-[var(--fg-brand)]/40 transition-colors">
              <CardHeader>
                <CardLabel>{p.label}</CardLabel>
                <CardMeta>{p.num}</CardMeta>
              </CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.desc}</CardDescription>
              <CardFooter>
                <CardComment>{p.count}</CardComment>
                <span className="text-[var(--fg-brand)] transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex gap-3 flex-wrap">
        <Link href="/docs/components">
          <Button size="md">
            browse components <span aria-hidden>→</span>
          </Button>
        </Link>
        <Link href="/docs/themes">
          <Button variant="secondary" size="md">
            see themes
          </Button>
        </Link>
      </div>
    </article>
  );
}
