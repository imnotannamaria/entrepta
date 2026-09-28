import { DocPageHeader } from "@/components/doc-page-header";
import { DATA_FOUNDATION } from "@/lib/docs-data";
import {
  FOUNDATIONS_INTRO,
  FOUNDATION_PAGES,
  type FoundationSlug,
  SPACE_SCALE,
  TYPE_SCALE,
  motionComponents,
} from "@/lib/foundations";
import { RULES } from "@/lib/rules";
import { buttonVariants } from "@entrepta/registry/primitives/button-variants";
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
  alternates: {
    canonical: "/docs/foundations",
    types: { "text/markdown": "/docs/foundations.md" },
  },
};

/** What each card counts. The pages, their titles and summaries are in lib/foundations.ts. */
const COUNTS: Record<FoundationSlug, string> = {
  color: "live",
  typography: `${TYPE_SCALE.length} tokens`,
  spacing: `${SPACE_SCALE.length} tokens`,
  motion: `${motionComponents().length} components`,
  accessibility: "WCAG AA",
  rules: `${RULES.length} rules`,
  data: `${DATA_FOUNDATION.length} topics`,
};

export default function FoundationsIndex() {
  return (
    <article>
      <DocPageHeader
        markdown="/docs/foundations"
        eyebrow="foundations"
        title={
          <>
            The <em>raw materials.</em>
          </>
        }
        description={FOUNDATIONS_INTRO}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FOUNDATION_PAGES.map((p) => (
          <Link key={p.slug} href={`/docs/foundations/${p.slug}`} className="group block">
            <Card className="h-full hover:border-[var(--fg-brand)]/40 transition-colors">
              <CardHeader>
                <CardLabel>{p.slug}</CardLabel>
                <CardMeta>{p.num}</CardMeta>
              </CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.summary}</CardDescription>
              <CardFooter>
                <CardComment>{COUNTS[p.slug]}</CardComment>
                <span className="text-[var(--fg-brand)] transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex gap-3 flex-wrap">
        <Link href="/docs/components" className={buttonVariants({ size: "md" })}>
          browse components <span aria-hidden>→</span>
        </Link>
        <Link href="/docs/themes" className={buttonVariants({ variant: "secondary", size: "md" })}>
          see themes
        </Link>
      </div>
    </article>
  );
}
