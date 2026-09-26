import { Diamond } from "@entrepta/registry/content/diamond";
import type { ReactNode } from "react";
import { AgentActions } from "./agent-actions";

interface DocPageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  /** The page path, when the page has a Markdown twin: shows the agent actions. */
  markdown?: string;
}

/**
 * Page header used across foundations and docs intro pages.
 * Mirrors the `.ds-section__head` pattern from the design's storybook.
 */
export function DocPageHeader({ eyebrow, title, description, meta, markdown }: DocPageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 pb-8 border-b border-[var(--border-subtle)] mb-10">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
        <div className="font-mono text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-brand-text)]">
          {eyebrow}
        </div>
        {meta && (
          <span className="font-mono text-mono-sm text-[var(--fg-muted)] uppercase tracking-[0.08em]">
            {meta}
          </span>
        )}
      </div>
      <h1 className="m-0 font-serif text-display-md font-normal text-[var(--fg-primary)] lg:text-display-lg [&_em]:italic [&_em]:text-[var(--fg-brand)]">
        {title}
      </h1>
      {description && (
        <p className="font-sans text-body-lg text-[var(--fg-secondary)] leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
      {markdown && (
        <div className="mt-2">
          <AgentActions path={markdown} />
        </div>
      )}
    </header>
  );
}

interface DocSubheadProps {
  children: ReactNode;
  count?: ReactNode;
}

/** Section sub-head used inside foundations / showcase pages */
export function DocSubhead({ children, count }: DocSubheadProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-4 pb-2 border-b border-[var(--border-subtle)]">
      <div className="font-mono text-mono-sm text-[var(--fg-secondary)] uppercase tracking-[0.06em] inline-flex items-center gap-1.5">
        <Diamond />
        {children}
      </div>
      {count && (
        <span className="font-mono text-mono-xs text-[var(--fg-muted)] uppercase tracking-[0.08em]">
          {count}
        </span>
      )}
    </div>
  );
}
