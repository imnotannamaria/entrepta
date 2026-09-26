import { cn } from "@/lib/utils";
import { Diamond } from "@entrepta/registry/content/diamond";
import type { ReactNode } from "react";

/** One band of the home page: the 1280px column, its gutters and the rule above it. */
export function HomeSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-[1280px] border-t border-[var(--border-subtle)] px-6 py-20 sm:px-12",
        className
      )}
    >
      {children}
    </section>
  );
}

/**
 * The head of a home section: an eyebrow, a serif title with an italic brand
 * word, a line of prose, and anything that sits to the right, such as a link.
 * The right side wraps under the title when it stops fitting.
 */
export function SectionHead({
  eyebrow,
  title,
  description,
  aside,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4", className)}
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow && (
          <div className="mb-3 font-mono text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-brand-text)]">
            {`· ${eyebrow}`}
          </div>
        )}
        <h2 className="m-0 font-serif text-display-md font-normal text-[var(--fg-primary)] lg:text-display-lg [&_em]:italic [&_em]:text-[var(--fg-brand)]">
          {title}
        </h2>
        {description && (
          <p className="mt-4 mb-0 max-w-xl font-sans text-body-lg leading-relaxed text-[var(--fg-secondary)]">
            {description}
          </p>
        )}
      </div>
      {aside}
    </div>
  );
}

/**
 * A list of a term and what it means, one per row, the term in the brand ink.
 * The term column is capped, so a long term wraps before it squeezes the text.
 */
export function SpecList({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <ul className="m-0 flex list-none flex-col border-t border-[var(--border-subtle)] p-0">
      {rows.map((row) => (
        <li
          key={row.k}
          className="grid grid-cols-[minmax(0,min(140px,40%))_1fr] items-baseline gap-4 border-b border-[var(--border-subtle)] py-3 font-mono text-mono-sm"
        >
          <span className="inline-flex items-center gap-1.5 text-[var(--fg-brand-text)]">
            <Diamond />
            {row.k}
          </span>
          <span className="leading-relaxed text-[var(--fg-secondary)]">{row.v}</span>
        </li>
      ))}
    </ul>
  );
}
