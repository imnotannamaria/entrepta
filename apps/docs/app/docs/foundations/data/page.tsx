import { DocNote, DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { DATA_FOUNDATION } from "@/lib/docs-data";
import { foundationPage } from "@/lib/foundations";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import type { Metadata } from "next";

const PAGE = foundationPage("data");

export const metadata: Metadata = {
  title: "Data",
  description:
    "How entrepta holds and shows data: money in minor units, plain dates, changes, the series palette, loading, empty and error states, and hiding values.",
  alternates: {
    canonical: "/docs/foundations/data",
    types: { "text/markdown": "/docs/foundations/data.md" },
  },
};

export default function DataFoundationPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow={`${PAGE.num} · foundations`}
        title={
          <>
            <em>Data.</em> Held exactly, shown one way.
          </>
        }
        description={PAGE.description}
        meta={`${DATA_FOUNDATION.length} topics`}
        markdown="/docs/foundations/data"
      />
      {DATA_FOUNDATION.map((topic) => (
        <section key={topic.id} id={topic.id} className="mb-14 last:mb-0">
          <DocSubhead count={topic.count}>{topic.title}</DocSubhead>
          {topic.notes.map((note) => (
            <DocNote key={note}>{note}</DocNote>
          ))}
          {topic.code ? (
            <CodeBlock
              variant="terminal"
              language="tsx"
              filename={topic.code.file}
              code={topic.code.body}
            />
          ) : null}
        </section>
      ))}
    </article>
  );
}
