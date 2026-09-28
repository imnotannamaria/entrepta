import { AgentActions } from "@/components/agent-actions";
import { DocNote, DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { NewComponentsGrid } from "@/components/new-components-grid";
import { MIGRATION, NEW_IN_V2 } from "@/lib/docs-data";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import { RobotIcon } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Migrating to v2",
  description:
    "What changes from entrepta 1 to 2: the type scale, Phosphor icons, the Card, brand inks, the surface finish, runtime themes, and every new component.",
  alternates: {
    canonical: "/docs/migrating-to-v2",
    types: { "text/markdown": "/docs/migrating-to-v2.md" },
  },
};

function Table({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-mono-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-left text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
            <th className="py-2 pr-6 font-normal">{head[0]}</th>
            <th className="py-2 font-normal">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([before, after]) => (
            <tr key={before} className="border-b border-[var(--border-subtle)] last:border-0">
              <td className="py-2.5 pr-6 text-[var(--fg-secondary)]">{before}</td>
              <td className="py-2.5 text-[var(--fg-primary)]">{after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MigratingPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="getting started"
        title={
          <>
            Migrating to <em>v2.</em>
          </>
        }
        description={`Version 2 changes the type scale, the icons, the Card, the brand inks and the finish of every surface, and adds ${NEW_IN_V2.length} components. Here is what to change, in the order worth doing it.`}
        meta="breaking"
      />

      <section className="sheen mb-14 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border-brand)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-xl flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-brand-text)]">
            <RobotIcon aria-hidden size={12} weight="bold" />
            let an agent do it
          </span>
          <p className="m-0 font-sans text-body-md leading-relaxed text-[var(--fg-secondary)]">
            Copy this whole guide as Markdown, with every new component and what it replaces, and
            paste it into Claude Code, Cursor or Codex inside your project.
          </p>
        </div>
        <AgentActions path="/docs/migrating-to-v2" label="copy the guide" />
      </section>

      <section className="mb-14">
        <DocSubhead count="2 commands">Update the files</DocSubhead>
        <DocNote>
          The CLI copies source, so nothing updates on its own. Rewrite the tokens, then each
          component you use. Commit first: --overwrite replaces your edits.
        </DocNote>
        <CodeBlock variant="terminal" language="bash" filename="terminal" code={MIGRATION.update} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${NEW_IN_V2.length} components`}>New in v2</DocSubhead>
        <DocNote>
          If your project built its own version of one of these, add the entrepta one and delete
          yours.
        </DocNote>
        <NewComponentsGrid entries={NEW_IN_V2} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${MIGRATION.sizes.length} mappings`}>Font sizes</DocSubhead>
        <DocNote>
          Sizes come from ten scale steps now. Arbitrary pixel sizes and Tailwind default steps go.
          A step sets size and leading, never the family, so keep your font-* class.
        </DocNote>
        <Table head={["before", "after"]} rows={MIGRATION.sizes} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${MIGRATION.tClasses.length} mappings`}>.t-* classes</DocSubhead>
        <DocNote>The .t-* classes are gone. Each one becomes a family and a step.</DocNote>
        <Table head={["before", "after"]} rows={MIGRATION.tClasses} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${MIGRATION.icons.length} icons`}>lucide to Phosphor</DocSubhead>
        <DocNote>
          Install @phosphor-icons/react and remove lucide-react. A file without use client imports
          from @phosphor-icons/react/dist/ssr. Phosphor takes size, not width and strokeWidth.
        </DocNote>
        <Table head={["lucide", "phosphor"]} rows={MIGRATION.icons} />
      </section>

      <section className="mb-14">
        <DocSubhead count="same API">Card</DocSubhead>
        <DocNote>{MIGRATION.card}</DocNote>
      </section>

      <section className="mb-14">
        <DocSubhead count={`${MIGRATION.inks.length} swaps`}>Brand inks and surfaces</DocSubhead>
        <DocNote>
          Search your own code for these. The components already use the new tokens.
        </DocNote>
        <Table head={["before", "after"]} rows={MIGRATION.inks} />
      </section>

      <section className="mb-14">
        <DocSubhead count="3 changes">Themes</DocSubhead>
        <DocNote>{MIGRATION.themes}</DocNote>
      </section>

      <section>
        <DocSubhead count={`${MIGRATION.components.length} changes`}>Components</DocSubhead>
        <ul className="m-0 flex max-w-2xl list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
          {MIGRATION.components.map(([name, text]) => (
            <li key={name}>
              <span className="text-[var(--fg-primary)]">{name}.</span> {text}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
