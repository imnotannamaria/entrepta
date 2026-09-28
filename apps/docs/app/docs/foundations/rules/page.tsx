import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { foundationPage } from "@/lib/foundations";
import { RULES, RULE_TOPICS } from "@/lib/rules";
import type { Metadata } from "next";

const PAGE = foundationPage("rules");

export const metadata: Metadata = {
  title: PAGE.title,
  description:
    "The do and don't list behind entrepta: color, type, cards, motion, accessibility, icons and routing.",
  alternates: {
    canonical: "/docs/foundations/rules",
    types: { "text/markdown": "/docs/foundations/rules.md" },
  },
};

export default function RulesPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow={`${PAGE.num} · foundations`}
        title={
          <>
            <em>Rules.</em> What keeps it honest.
          </>
        }
        description={PAGE.description}
        meta={`${RULES.length} rules`}
        markdown="/docs/foundations/rules"
      />
      {RULE_TOPICS.map((topic) => {
        const rules = RULES.filter((r) => r.topic === topic);
        return (
          <section key={topic} className="mb-12">
            <DocSubhead count={`${rules.length} ${rules.length === 1 ? "rule" : "rules"}`}>
              {topic}
            </DocSubhead>
            <ul className="m-0 flex list-none flex-col p-0">
              {rules.map((r) => (
                <li
                  key={r.do}
                  className="grid grid-cols-1 gap-2 border-b border-[var(--border-subtle)] py-3 last:border-0 md:grid-cols-2 md:gap-6"
                >
                  <p className="m-0 font-mono text-mono-sm text-[var(--fg-primary)]">
                    <span className="text-[var(--status-success-fg)]">do </span>
                    {r.do}
                  </p>
                  <p className="m-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
                    <span className="text-[var(--status-error-fg)]">don't </span>
                    {r.dont}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </article>
  );
}
