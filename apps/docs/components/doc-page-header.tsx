import type { ReactNode } from "react";

interface DocPageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
}

/**
 * Page header used across foundations and docs intro pages.
 * Mirrors the `.ds-section__head` pattern from the design's storybook.
 */
export function DocPageHeader({ eyebrow, title, description, meta }: DocPageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 pb-8 border-b border-[var(--border-subtle)] mb-10">
      <div className="flex items-start justify-between gap-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-brand)]">
          {eyebrow}
        </div>
        {meta && (
          <span className="font-mono text-[11px] text-[var(--fg-muted)] uppercase tracking-[0.08em]">
            {meta}
          </span>
        )}
      </div>
      <h1 className="font-serif text-[clamp(36px,5vw,56px)] leading-[1.05] font-normal tracking-[-0.02em] text-[var(--fg-primary)] [&_em]:italic [&_em]:text-[var(--fg-brand)]">
        {title}
      </h1>
      {description && (
        <p className="font-sans text-base text-[var(--fg-secondary)] leading-relaxed max-w-2xl">
          {description}
        </p>
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
      <div className="font-mono text-[12px] text-[var(--fg-secondary)] uppercase tracking-[0.06em] inline-flex items-center gap-1.5">
        <span aria-hidden className="text-[10px] text-[var(--fg-brand)] leading-none">
          ◆
        </span>
        {children}
      </div>
      {count && (
        <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-[0.08em]">
          {count}
        </span>
      )}
    </div>
  );
}
