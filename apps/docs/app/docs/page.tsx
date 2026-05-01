import Link from "next/link";

export default function DocsIntro() {
  return (
    <article className="prose max-w-2xl">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-brand)] mb-6">
        getting started
      </div>

      <h1 className="font-serif text-4xl font-normal text-[var(--fg-primary)] leading-tight tracking-tight mb-4">
        Introduction
      </h1>
      <p className="font-sans text-base text-[var(--fg-secondary)] leading-relaxed mb-8">
        <strong className="text-[var(--fg-primary)] font-medium">entrepta</strong> is a dark-first
        design system distributed in the shadcn/ui model — copy-paste components, not an npm package
        of pre-built UI.
      </p>

      <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-5 mb-8 bg-[var(--bg-surface)]">
        <div className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-3">
          {"// philosophy"}
        </div>
        <p className="font-sans text-sm text-[var(--fg-secondary)] leading-relaxed">
          You own the code. Run{" "}
          <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1.5 py-0.5 rounded">
            npx entrepta add button
          </code>{" "}
          and the component lives in your repo — styled with your tokens, editable without fighting
          a library.
        </p>
      </div>

      <h2 className="font-sans text-lg font-semibold text-[var(--fg-primary)] mb-4 mt-10 border-b border-[var(--border-subtle)] pb-2">
        Quick start
      </h2>

      <div className="flex flex-col gap-3 mb-8">
        {[
          {
            num: "01",
            cmd: "npx entrepta init --theme=entrepta",
            comment: "# setup tokens + config",
          },
          { num: "02", cmd: "npx entrepta add button badge input", comment: "# copy components" },
          {
            num: "03",
            cmd: "import { Button } from '@/components/entrepta/button'",
            comment: "# use them",
          },
        ].map((s) => (
          <div
            key={s.num}
            className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-3 font-mono text-sm"
          >
            <span className="text-[var(--fg-muted)] text-[10px] mr-3">{s.num}</span>
            <span className="text-[var(--fg-primary)]">{s.cmd}</span>
            <span className="text-[var(--fg-muted)] ml-2 text-xs">{s.comment}</span>
          </div>
        ))}
      </div>

      <h2 className="font-sans text-lg font-semibold text-[var(--fg-primary)] mb-4 mt-10 border-b border-[var(--border-subtle)] pb-2">
        What gets copied
      </h2>
      <p className="font-sans text-sm text-[var(--fg-secondary)] leading-relaxed mb-4">
        Running{" "}
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1.5 py-0.5 rounded">
          npx entrepta init
        </code>{" "}
        creates:
      </p>
      <ul className="flex flex-col gap-2 mb-8">
        {[
          { file: "app/globals.css", desc: "CSS tokens + reset + Google Fonts" },
          { file: "lib/utils.ts", desc: "cn() helper (clsx + tailwind-merge)" },
          { file: "entrepta.json", desc: "config — theme, paths, aliases" },
        ].map((f) => (
          <li key={f.file} className="flex items-start gap-3 font-mono text-xs">
            <span className="text-[var(--fg-brand)] shrink-0">→</span>
            <span className="text-[var(--fg-primary)]">{f.file}</span>
            <span className="text-[var(--fg-muted)]">{f.desc}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-3 mt-10">
        <Link
          href="/docs/installation"
          className="flex items-center h-9 px-4 bg-[var(--fg-brand)] text-white font-mono text-xs rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
        >
          Installation guide →
        </Link>
        <Link
          href="/docs/components/button"
          className="flex items-center h-9 px-4 border border-[var(--border-subtle)] text-[var(--fg-secondary)] font-mono text-xs rounded-[var(--radius-sm)] hover:border-[var(--border-strong)] hover:text-[var(--fg-primary)] transition-colors"
        >
          Browse components
        </Link>
      </div>
    </article>
  );
}
