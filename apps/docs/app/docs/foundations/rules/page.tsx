import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { RULES, RULE_TOPICS } from "@/lib/rules";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rules",
  description:
    "The do and don't list behind entrepta: color, type, cards, motion, accessibility, icons and routing.",
  alternates: { canonical: "/docs/foundations/rules" },
};

export default function RulesPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="06 · foundations"
        title={
          <>
            <em>Rules.</em> What keeps it honest.
          </>
        }
        description="Each rule was written after a real bug. The AGENTS.md generator on the home page reads this same list."
        meta={`${RULES.length} rules`}
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
