import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import { Button } from "@entrepta/registry/primitives/button";
import {
  Card,
  CardComment,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTitle,
} from "@entrepta/registry/primitives/card";
import Link from "next/link";

const REQUIREMENTS = [
  { label: "React", value: "19 or newer" },
  { label: "Next.js", value: "15 (App Router)" },
  { label: "Tailwind", value: "v4" },
  { label: "TypeScript", value: "5.x" },
];

const FILES = [
  { path: "app/globals.css", desc: "CSS tokens, reset, and fonts" },
  { path: "lib/utils.ts", desc: "cn() helper (clsx + tailwind-merge)" },
  { path: "entrepta.json", desc: "Config. Theme, paths, aliases." },
];

export default function InstallationPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="getting started"
        title={
          <>
            Install <em>entrepta.</em>
          </>
        }
        description="Works with any React project. Tailwind v4 is recommended but not required. The CLI detects your framework and adjusts paths."
        meta="2 steps"
      />

      <section className="mb-12">
        <DocSubhead count={`${REQUIREMENTS.length} items`}>Prerequisites</DocSubhead>
        <Card>
          <div className="flex flex-col">
            {REQUIREMENTS.map((r, i) => (
              <div
                key={r.label}
                className={`grid grid-cols-[140px_1fr] gap-3 items-center py-3 font-mono text-[12px] ${
                  i > 0 ? "border-t border-[var(--border-subtle)]" : ""
                }`}
              >
                <span className="text-[var(--fg-primary)] inline-flex items-center gap-1.5">
                  <span aria-hidden className="text-[10px] text-[var(--fg-brand)] leading-none">
                    ◆
                  </span>
                  {r.label}
                </span>
                <span className="text-[var(--fg-muted)]">{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <DocSubhead count="step 1">Run init</DocSubhead>
        <CodeBlock
          variant="terminal"
          filename="terminal · zsh"
          meta="~/your-app"
          language="bash"
          code={`npx entrepta init
npx entrepta init --theme=ivy`}
        >
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-[var(--fg-muted)] text-[11px] mr-3">01</span>
              <span className="text-[var(--fg-brand)]">$</span>{" "}
              <span className="text-[var(--fg-primary)]">npx entrepta init</span>
              <span className="text-[var(--fg-muted)] text-[11px] ml-3">
                {"// prompts for a theme"}
              </span>
            </div>
            <div>
              <span className="text-[var(--fg-muted)] text-[11px] mr-3">02</span>
              <span className="text-[var(--fg-brand)]">$</span>{" "}
              <span className="text-[var(--fg-primary)]">npx entrepta init --theme=ivy</span>
              <span className="text-[var(--fg-muted)] text-[11px] ml-3">
                {"// skip the prompt"}
              </span>
            </div>
          </div>
        </CodeBlock>
      </section>

      <section className="mb-12">
        <DocSubhead count={`${FILES.length} files`}>What init writes</DocSubhead>
        <Card>
          <div className="flex flex-col">
            {FILES.map((f, i) => (
              <div
                key={f.path}
                className={`grid grid-cols-[20px_220px_1fr] gap-3 items-center py-3 font-mono text-[12px] ${
                  i > 0 ? "border-t border-[var(--border-subtle)]" : ""
                }`}
              >
                <span className="text-[var(--fg-brand)]">→</span>
                <code className="text-[var(--fg-primary)]">{f.path}</code>
                <span className="text-[var(--fg-muted)]">{f.desc}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <DocSubhead count="step 2">Add components</DocSubhead>
        <Card>
          <CardHeader>
            <CardLabel>npx entrepta add</CardLabel>
            <CardMeta>copy paste</CardMeta>
          </CardHeader>
          <CardTitle className="text-[20px]">
            One command. <em>Three components.</em>
          </CardTitle>
          <p className="font-sans text-[13px] leading-relaxed text-[var(--fg-secondary)] m-0">
            Run{" "}
            <code className="font-mono text-[var(--fg-brand)]">
              npx entrepta add button badge input
            </code>{" "}
            and the components land in <code className="font-mono">components/entrepta/</code>. Edit
            them like any other file in your repo.
          </p>
          <CardFooter>
            <CardComment>no SDK, no analytics, no runtime wrapper</CardComment>
          </CardFooter>
        </Card>
      </section>

      <div className="flex gap-3 flex-wrap pt-6 border-t border-[var(--border-subtle)]">
        <Link href="/docs/cli">
          <Button size="md">
            CLI reference <span aria-hidden>→</span>
          </Button>
        </Link>
        <Link href="/docs/components">
          <Button variant="secondary" size="md">
            Browse components
          </Button>
        </Link>
        <Link href="/docs/themes">
          <Button variant="ghost" size="md">
            Pick a theme
          </Button>
        </Link>
      </div>
    </article>
  );
}
