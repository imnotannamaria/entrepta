import { DocNote, DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { InkTable } from "@/components/token-values";
import { A11Y_SECTIONS, INK_PAIRS, foundationPage } from "@/lib/foundations";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import type { Metadata } from "next";

const PAGE = foundationPage("accessibility");

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.summary,
  alternates: {
    canonical: "/docs/foundations/accessibility",
    types: { "text/markdown": "/docs/foundations/accessibility.md" },
  },
};

export default function AccessibilityPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow={`${PAGE.num} · foundations`}
        title={
          <>
            <em>Accessibility.</em> Measured, not assumed.
          </>
        }
        description={PAGE.description}
        meta="WCAG 2.2 AA"
        markdown="/docs/foundations/accessibility"
      />

      {A11Y_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="mb-14 last:mb-0">
          <DocSubhead count={section.count}>{section.title}</DocSubhead>
          {section.note ? <DocNote>{section.note}</DocNote> : null}
          {section.inks ? <InkTable pairs={INK_PAIRS} /> : null}
          {section.points ? (
            <ul className="m-0 flex list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
              {section.points.map((p) => (
                <li key={p.lead}>
                  <span className="text-[var(--fg-primary)]">{p.lead}</span> {p.text}
                </li>
              ))}
            </ul>
          ) : null}
          {section.code ? (
            <CodeBlock
              variant="terminal"
              language="tsx"
              filename={section.code.file}
              code={section.code.body}
            />
          ) : null}
        </section>
      ))}
    </article>
  );
}
