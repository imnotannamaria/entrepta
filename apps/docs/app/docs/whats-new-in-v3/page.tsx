import { AgentActions } from "@/components/agent-actions";
import { DocNote, DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { NewComponentsGrid } from "@/components/new-components-grid";
import { SECTIONS } from "@/lib/component-index";
import { NEW_IN_V3, V3_CHANGES, V3_UPDATE } from "@/lib/docs-data";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import { RobotIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What's new in v3",
  description: `entrepta 3 adds ${NEW_IN_V3.length} components for products: money and dates, lists and tables, filters, dashboards, charts, onboarding and chat. Nothing in 2.x breaks.`,
  alternates: {
    canonical: "/docs/whats-new-in-v3",
    types: { "text/markdown": "/docs/whats-new-in-v3.md" },
  },
};

export default function WhatsNewPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="getting started"
        title={
          <>
            What&apos;s new in <em>v3.</em>
          </>
        }
        description={`${NEW_IN_V3.length} components for products: money and dates, lists and tables, filters, dashboards, charts, onboarding and chat. Nothing in 2.x breaks, so there is nothing to migrate: update the tokens, and add what you need.`}
        meta="no breaking changes"
      />

      <section className="sheen mb-14 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border-brand)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-xl flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-brand-text)]">
            <RobotIcon aria-hidden size={12} weight="bold" />
            let an agent do it
          </span>
          <p className="m-0 font-sans text-body-md leading-relaxed text-[var(--fg-secondary)]">
            Copy this page as Markdown, with every new component and what it is for, and paste it
            into your agent inside the project.
          </p>
        </div>
        <AgentActions path="/docs/whats-new-in-v3" label="copy the page" />
      </section>

      <section className="mb-14">
        <DocSubhead count="2 commands">Update</DocSubhead>
        <DocNote>
          The new tokens come with init: the chart palette, the height animation of the Accordion,
          and fields without code ligatures. Commit first: --overwrite replaces local edits.
        </DocNote>
        <CodeBlock variant="terminal" language="bash" filename="terminal" code={V3_UPDATE} />
      </section>

      {SECTIONS.map((section) => {
        const entries = NEW_IN_V3.filter((c) => c.section === section);
        if (!entries.length) return null;
        return (
          <section key={section} className="mb-14">
            <DocSubhead count={`${entries.length} new`}>{section}</DocSubhead>
            <NewComponentsGrid entries={entries} />
          </section>
        );
      })}

      <section>
        <DocSubhead count={`${V3_CHANGES.length} changes`}>Changed</DocSubhead>
        <DocNote>Everything below keeps its API. It only gained.</DocNote>
        <ul className="m-0 flex max-w-2xl list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
          {V3_CHANGES.map(([name, text]) => (
            <li key={name}>
              <span className="text-[var(--fg-primary)]">{name}.</span> {text}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
