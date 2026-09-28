import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { COMPONENT_INDEX, SECTIONS } from "@/lib/component-index";
import { DOCS_INTRO, INIT_FILES } from "@/lib/docs-data";
import { CodeBlock } from "@entrepta/registry/content/code-block";
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
  title: "Docs",
  description:
    "Get started with entrepta. Install the CLI, copy components into your repo, and ship in a Next.js or Vite project.",
  alternates: {
    canonical: "/docs",
    types: { "text/markdown": "/docs.md" },
  },
};

const NEXT_PAGES = [
  {
    label: "installation",
    title: "Installation",
    desc: "Setup for Next.js and Vite, what init writes, and adding components.",
    href: "/docs/installation",
  },
  {
    label: "cli",
    title: "CLI Reference",
    desc: "Every flag of init and add, and entrepta.json.",
    href: "/docs/cli",
  },
  {
    label: "foundations",
    title: "Foundations",
    desc: "Color, type, spacing, motion, accessibility, rules and data. What every component follows.",
    href: "/docs/foundations",
  },
  {
    label: "components",
    title: "Components",
    desc: `${COMPONENT_INDEX.length} components in ${SECTIONS.length} sections, each with its props and a live preview.`,
    href: "/docs/components",
  },
];

export default function DocsIntro() {
  return (
    <article>
      <DocPageHeader
        eyebrow="getting started"
        title={
          <>
            Build with <em>entrepta.</em>
          </>
        }
        description={DOCS_INTRO.description}
        markdown="/docs"
      />

      <section className="mb-14">
        <DocSubhead>Philosophy</DocSubhead>
        <Card>
          <CardHeader>
            <CardLabel>brief</CardLabel>
            <CardMeta>{"// section 1.1"}</CardMeta>
          </CardHeader>
          <CardTitle>
            Dark-first. <em>Editor-shaped.</em> Yours to own.
          </CardTitle>
          <CardDescription>{DOCS_INTRO.philosophy}</CardDescription>
          <CardFooter>
            <CardComment>opinionated · not framework-of-frameworks</CardComment>
          </CardFooter>
        </Card>
      </section>

      <section className="mb-14">
        <DocSubhead count={`${DOCS_INTRO.quickStart.length} commands`}>Quick start</DocSubhead>
        <CodeBlock
          variant="terminal"
          filename="terminal · zsh"
          meta="~/projects/your-app"
          language="bash"
          code={DOCS_INTRO.quickStart.map((s) => s.cmd).join("\n")}
        >
          <div className="flex flex-col gap-3">
            {DOCS_INTRO.quickStart.map((s, i) => (
              <div key={s.cmd} className="flex items-baseline gap-3">
                <span className="w-5 shrink-0 text-mono-sm text-[var(--fg-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 break-all text-[var(--fg-secondary)]">
                  <span className="text-[var(--fg-brand)]">$</span> {s.cmd}
                </span>
                <span className="hidden shrink-0 text-mono-sm text-[var(--fg-muted)] md:inline">
                  {"// "}
                  {s.comment}
                </span>
              </div>
            ))}
          </div>
        </CodeBlock>
      </section>

      <section className="mb-14">
        <DocSubhead count={`${INIT_FILES.length} files`}>What `init` writes</DocSubhead>
        <Card>
          <ul className="m-0 flex list-none flex-col p-0">
            {INIT_FILES.map((f) => (
              <li
                key={f.path}
                className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-[var(--border-subtle)] py-3 font-mono text-mono-sm last:border-0 sm:grid-cols-[20px_200px_1fr]"
              >
                <span aria-hidden className="text-[var(--fg-brand)]">
                  →
                </span>
                <span className="text-[var(--fg-primary)]">{f.path}</span>
                <span className="col-start-2 text-[var(--fg-muted)] sm:col-start-auto">
                  {f.desc}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mb-14">
        <DocSubhead count={`${NEXT_PAGES.length} sections`}>Where to go next</DocSubhead>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {NEXT_PAGES.map((p, i) => (
            <Link key={p.label} href={p.href} className="group block">
              <Card className="h-full">
                <CardHeader>
                  <CardLabel>{p.label}</CardLabel>
                  <CardMeta>{`→ ${i + 1}`}</CardMeta>
                </CardHeader>
                <CardTitle className="text-heading-md">{p.title}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
                <CardFooter>
                  <span />
                  <span
                    aria-hidden
                    className="text-[var(--fg-brand)] transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-6">
        <Link href="/docs/installation" className={buttonVariants({ size: "md" })}>
          installation guide <span aria-hidden>→</span>
        </Link>
        <Link
          href="/docs/components"
          className={buttonVariants({ variant: "secondary", size: "md" })}
        >
          browse components
        </Link>
        <Link href="/docs/foundations" className={buttonVariants({ variant: "ghost", size: "md" })}>
          see foundations
        </Link>
      </div>
    </article>
  );
}
