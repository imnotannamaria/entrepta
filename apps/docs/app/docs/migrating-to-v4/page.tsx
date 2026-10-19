import { AgentActions } from "@/components/agent-actions";
import { DocNote, DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { V4_BREAKS, V4_NEW, V4_REMOVED, V4_UPDATE } from "@/lib/docs-data";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import { RobotIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Migrating to v4",
  description:
    "What changes from entrepta 3 to 4: the ◆ and the // stop being defaults, the editor look leaves the library, and each change to the look says how to bring the old one back.",
  alternates: {
    canonical: "/docs/migrating-to-v4",
    types: { "text/markdown": "/docs/migrating-to-v4.md" },
  },
};

export default function MigratingV4Page() {
  return (
    <article>
      <DocPageHeader
        eyebrow="getting started"
        title={
          <>
            Migrating to <em>v4.</em>
          </>
        }
        description="Version 4 takes the mark out of the defaults. Nothing is lost: each change to the look says how to bring the old one back."
        meta="breaking"
      />

      <section className="sheen mb-14 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border-brand)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-xl flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-brand-text)]">
            <RobotIcon aria-hidden size={12} weight="bold" />
            let an agent do it
          </span>
          <p className="m-0 font-sans text-body-md leading-relaxed text-[var(--fg-secondary)]">
            Copy this guide as Markdown and paste it into your agent inside the project.
          </p>
        </div>
        <AgentActions path="/docs/migrating-to-v4" label="copy the guide" />
      </section>

      <section className="mb-14">
        <DocSubhead count="3 commands">Update the files</DocSubhead>
        <DocNote>
          The CLI copies source, so nothing updates on its own. Commit first: --overwrite replaces
          your edits.
        </DocNote>
        <CodeBlock variant="terminal" language="bash" filename="terminal" code={V4_UPDATE} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${V4_BREAKS.length} changes`}>What changed</DocSubhead>
        <ul className="m-0 flex max-w-2xl list-none flex-col gap-8 p-0">
          {V4_BREAKS.map((b) => (
            <li key={b.name} className="flex flex-col gap-2">
              <h3 className="m-0 font-mono text-mono-md text-[var(--fg-primary)]">{b.name}</h3>
              <p className="m-0 font-sans text-body-md text-[var(--fg-muted)]">
                Before: {b.before}
              </p>
              <p className="m-0 font-sans text-body-md text-[var(--fg-secondary)]">
                After: {b.after}
              </p>
              {b.back ? (
                <CodeBlock
                  variant="terminal"
                  language="tsx"
                  filename="the old look"
                  code={b.back}
                />
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <DocSubhead count={`${V4_REMOVED.length} removed`}>What was removed</DocSubhead>
        <DocNote>
          The CLI says so when you ask for one of them, and links here. A project that already
          copied one keeps working.
        </DocNote>
        <ul className="m-0 flex max-w-2xl list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
          {V4_REMOVED.map(([name, text]) => (
            <li key={name}>
              <span className="text-[var(--fg-primary)]">{name}.</span> {text}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <DocSubhead count={`${V4_NEW.length} new`}>What is new</DocSubhead>
        <ul className="m-0 flex max-w-2xl list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
          {V4_NEW.map(([name, text]) => (
            <li key={name}>
              <span className="text-[var(--fg-primary)]">{name}.</span> {text}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
