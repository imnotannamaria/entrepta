import { AgentActions } from "@/components/agent-actions";
import { DocNote, DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { V4_NEW } from "@/lib/docs-data";
import { RobotIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What's new in v4",
  description:
    "entrepta 4 is the library without the mark: no ◆ or // by default, no editor look, and taylor, a flat monochrome theme.",
  alternates: {
    canonical: "/docs/whats-new-in-v4",
    types: { "text/markdown": "/docs/whats-new-in-v4.md" },
  },
};

export default function WhatsNewV4Page() {
  return (
    <article>
      <DocPageHeader
        eyebrow="getting started"
        title={
          <>
            What&apos;s new in <em>v4.</em>
          </>
        }
        description="The library without the mark. The ◆ and the // stop being defaults, the editor look leaves, and a seventh theme, taylor, is flat and monochrome."
        meta="breaking changes"
      />

      <section className="sheen mb-14 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border-brand)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-xl flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-brand-text)]">
            <RobotIcon aria-hidden size={12} weight="bold" />
            let an agent do it
          </span>
          <p className="m-0 font-sans text-body-md leading-relaxed text-[var(--fg-secondary)]">
            Copy this page as Markdown and paste it into your agent inside the project.
          </p>
        </div>
        <AgentActions path="/docs/whats-new-in-v4" label="copy the page" />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${V4_NEW.length} items`}>New and changed</DocSubhead>
        <ul className="m-0 flex max-w-2xl list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
          {V4_NEW.map(([name, text]) => (
            <li key={name}>
              <span className="text-[var(--fg-primary)]">{name}.</span> {text}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <DocSubhead count="breaking">Updating</DocSubhead>
        <DocNote>
          The ◆ and the {"//"} are not drawn by default anymore, and some pieces of the editor look
          left the registry. Each change says how to bring the old look back.
        </DocNote>
        <Link
          href="/docs/migrating-to-v4"
          className="font-mono text-mono-sm text-[var(--fg-brand-text)] underline underline-offset-4"
        >
          Read the migration guide
        </Link>
      </section>
    </article>
  );
}
