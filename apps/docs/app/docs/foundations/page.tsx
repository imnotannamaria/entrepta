import { DocPageHeader } from "@/components/doc-page-header";
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
import Link from "next/link";

const PAGES = [
  {
    num: "01",
    label: "color",
    title: "Color",
    desc: "Zinc neutrals + brand accent. Primitives, accents, and semantic tokens that components consume.",
    count: "29 tokens",
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
    desc: "Soft corners (6–24px). Fast transitions (120–320ms). Shimmer for skeletons. Respects reduced-motion.",
    count: "9 tokens",
    href: "/docs/foundations/motion",
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
              <CardTitle className="text-[24px]">{p.title}</CardTitle>
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
