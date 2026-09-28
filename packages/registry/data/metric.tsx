import { cva } from "class-variance-authority";
import * as React from "react";
import { Diamond } from "../content/diamond";
import { Skeleton } from "../feedback/skeleton";
import { type IconProp, IconSlot } from "../lib/icon";
import { cn } from "../lib/utils";
import { Redact } from "./redact";

const valueVariants = cva(
  // never truncated, since an ellipsis would hide digits: the large size steps
  // down in a narrow container instead
  "m-0 whitespace-nowrap font-mono tabular-nums text-[var(--fg-primary)]",
  {
    variants: {
      size: {
        md: "text-heading-lg",
        lg: "text-heading-lg @2xs:text-display-md @2xs:tracking-normal",
      },
    },
    defaultVariants: { size: "md" },
  }
);

const VALUE_SKELETON = { md: "h-7 w-28", lg: "h-7 w-28 @2xs:h-10 @2xs:w-40" } as const;

interface MetricProps extends React.HTMLAttributes<HTMLDListElement> {
  /** What is measured: "spent this month". */
  label: React.ReactNode;
  /** The number: an Amount, a RollingNumber, or text. */
  value: React.ReactNode;
  /** How it moved: a Delta. */
  delta?: React.ReactNode;
  /** Against what: "vs August". */
  comparison?: React.ReactNode;
  /** A short note under it, in the muted ink: "2 accounts not synced". */
  hint?: React.ReactNode;
  /** A small chart under the value, such as a Sparkline. */
  trend?: React.ReactNode;
  /** A Phosphor icon in place of the ◆, when the label names a kind of thing. */
  icon?: IconProp;
  size?: "md" | "lg";
  /** Pieces in the final shape while the value loads. */
  loading?: boolean;
}

/**
 * One number and what it means: the label, the value, how it moved and
 * against what. A description list, so a screen reader pairs the label with
 * the value. It has no surface of its own; put it in a Card, or several in a
 * BentoGrid.
 */
const Metric = React.forwardRef<HTMLDListElement, MetricProps>(
  (
    {
      label,
      value,
      delta,
      comparison,
      hint,
      trend,
      icon,
      size = "md",
      loading = false,
      className,
      ...props
    },
    ref
  ) => (
    <dl
      ref={ref}
      aria-busy={loading || undefined}
      // full width: a size container has no width of its own to shrink to
      className={cn("@container m-0 flex w-full min-w-0 flex-col gap-1.5", className)}
      {...props}
    >
      <dt className="flex min-w-0 items-center gap-1.5 font-mono text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-secondary)]">
        {icon ? (
          <IconSlot icon={icon} size={12} className="text-[var(--fg-brand)]" />
        ) : (
          <Diamond size={10} />
        )}
        <span className="min-w-0 truncate">{label}</span>
      </dt>
      <dd className="m-0 flex min-w-0 flex-col gap-1.5">
        {loading ? (
          <Skeleton className={VALUE_SKELETON[size]} />
        ) : (
          <p className={valueVariants({ size })}>
            <Redact>{value}</Redact>
          </p>
        )}
        {loading && (delta || comparison) ? (
          <Skeleton variant="line" className="h-3.5 w-24" delay={0.06} />
        ) : delta || comparison ? (
          // the delta keeps its line; the comparison wraps under it if it has to
          <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-mono-sm text-[var(--fg-muted)]">
            {delta}
            {comparison ? <span className="min-w-0">{comparison}</span> : null}
          </p>
        ) : null}
        {trend ? (
          <div className="mt-1 h-10 min-w-0">
            {loading ? <Skeleton className="size-full" delay={0.12} /> : trend}
          </div>
        ) : null}
        {hint ? <p className="m-0 font-mono text-mono-xs text-[var(--fg-muted)]">{hint}</p> : null}
      </dd>
    </dl>
  )
);
Metric.displayName = "Metric";

export { Metric };
export type { MetricProps };
