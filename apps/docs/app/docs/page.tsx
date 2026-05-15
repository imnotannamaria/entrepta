import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { Button } from "@entrepta/registry/primitives/button";
import {
  Card,
  CardComment,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTerminalBar,
  CardTerminalBody,
  CardTitle,
} from "@entrepta/registry/primitives/card";
import Link from "next/link";

const QUICK_START = [
  {
    num: "01",
    cmd: "npx entrepta init --theme=entrepta",
    comment: "setup tokens + config",
  },
  {
    num: "02",
    cmd: "npx entrepta add button badge input",
    comment: "copy components",
  },
  {
    num: "03",
    cmd: "import { Button } from '@/components/entrepta/button'",
    comment: "use them",
  },
];

const FILES = [
  { file: "app/globals.css", desc: "CSS tokens + reset + fonts" },
  { file: "lib/utils.ts", desc: "cn() helper (clsx + tailwind-merge)" },
  { file: "entrepta.json", desc: "config — theme, paths, aliases" },
];

const NEXT_PAGES = [
  {
    label: "installation",
    num: "→ 1",
    title: "Installation",
    desc: "Detailed setup for Next.js, Vite, and existing projects. Theme switching, CSS-in-CSS tokens.",
    href: "/docs/installation",
  },
  {
    label: "cli",
    num: "→ 2",
    title: "CLI Reference",
    desc: "Every flag for init, add, and diff. Pickers, overrides, and config files.",
    href: "/docs/cli",
  },
  {
    label: "foundations",
    num: "→ 3",
    title: "Foundations",
    desc: "Color, typography, spacing, motion. The tokens every component consumes.",
    href: "/docs/foundations",
  },
  {
    label: "components",
    num: "→ 4",
    title: "Components",
    desc: "13 components across primitives, layout, and feedback. Each with props + live preview.",
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
        description={
          <>
            A dark-first design system distributed in the shadcn-style — copy-paste components, not
            an npm package of pre-built UI. You own the source. Run a command, the component lives
            in your repo, styled with your tokens, editable without fighting a library.
          </>
        }
      />

      <section className="mb-14">
        <DocSubhead>Philosophy</DocSubhead>
        <Card>
          <CardHeader>
            <CardLabel>brief</CardLabel>
            <CardMeta>{"// section 1.1"}</CardMeta>
          </CardHeader>
          <CardTitle className="text-[22px]">
            Dark-first. <em>Editor-shaped.</em> Yours to own.
          </CardTitle>
          <CardDescription>
            entrepta is opinionated about three things: a deep zinc-950 canvas (light mode is
            optional, never priority), editor metaphors as personality (tabs, ◆ markers, file paths,
            shell prompts), and copy-paste distribution (no SDK, no analytics, no runtime wrapper
            between you and your components).
          </CardDescription>
          <CardFooter>
            <CardComment>opinionated · not framework-of-frameworks</CardComment>
          </CardFooter>
        </Card>
      </section>

      <section className="mb-14">
        <DocSubhead count="3 commands">Quick start</DocSubhead>
        <Card variant="terminal">
          <CardTerminalBar>
            <CardLabel>terminal · zsh</CardLabel>
            <CardMeta>~/projects/your-app</CardMeta>
          </CardTerminalBar>
          <CardTerminalBody className="flex flex-col gap-3">
            {QUICK_START.map((s) => (
              <div key={s.num} className="flex items-baseline gap-3">
                <span className="text-[var(--fg-muted)] text-[11px] w-5 shrink-0">{s.num}</span>
                <span className="text-[var(--fg-secondary)] flex-1 min-w-0 break-all">
                  <span className="text-[var(--fg-brand)]">$</span> {s.cmd}
                </span>
                <span className="text-[var(--fg-muted)] text-[11px] hidden md:inline shrink-0">
                  {"// "}
                  {s.comment}
                </span>
              </div>
            ))}
          </CardTerminalBody>
        </Card>
      </section>

      <section className="mb-14">
        <DocSubhead count="3 files">What `init` writes</DocSubhead>
        <Card>
          <div className="flex flex-col">
            {FILES.map((f, i) => (
              <div
                key={f.file}
                className={`grid grid-cols-[20px_220px_1fr] gap-3 items-center py-3 font-mono text-[12px] ${
                  i > 0 ? "border-t border-[var(--border-subtle)]" : ""
                }`}
              >
                <span className="text-[var(--fg-brand)]">→</span>
                <span className="text-[var(--fg-primary)]">{f.file}</span>
                <span className="text-[var(--fg-muted)]">{f.desc}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mb-14">
        <DocSubhead count="4 sections">Where to go next</DocSubhead>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NEXT_PAGES.map((p) => (
            <Link key={p.label} href={p.href} className="group block">
              <Card className="h-full hover:border-[var(--fg-brand)]/40 transition-colors">
                <CardHeader>
                  <CardLabel>{p.label}</CardLabel>
                  <CardMeta>{p.num}</CardMeta>
                </CardHeader>
                <CardTitle className="text-[20px]">{p.title}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
                <CardFooter>
                  <span />
                  <span className="text-[var(--fg-brand)] transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex gap-3 flex-wrap pt-6 border-t border-[var(--border-subtle)]">
        <Link href="/docs/installation">
          <Button size="md">
            installation guide <span aria-hidden>→</span>
          </Button>
        </Link>
        <Link href="/docs/components/button">
          <Button variant="secondary" size="md">
            browse components
          </Button>
        </Link>
        <Link href="/docs/foundations">
          <Button variant="ghost" size="md">
            see foundations
          </Button>
        </Link>
      </div>
    </article>
  );
}
