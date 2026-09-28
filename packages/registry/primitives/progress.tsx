"use client";

import { cva } from "class-variance-authority";
import { useInView, useReducedMotion } from "motion/react";
import * as React from "react";
import { revealViewport } from "../lib/motion";
import { cn } from "../lib/utils";

const TONE = {
  brand: "var(--fg-brand)",
  success: "var(--status-success)",
  warning: "var(--status-warning)",
  error: "var(--status-error)",
} as const;

const trackVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-[var(--bg-hover-strong)]",
  {
    variants: {
      size: { sm: "h-1", md: "h-1.5", lg: "h-2", xl: "h-3" },
    },
    defaultVariants: { size: "md" },
  }
);

const RING = { sm: 16, md: 24, lg: 40, xl: 72 } as const;
const RING_STROKE = { sm: 2, md: 3, lg: 4, xl: 6 } as const;

// the entrance: long enough to be seen filling, then every change of value
// eases the same way
const FILL_MOTION = "duration-700 ease-[var(--ease-out)]";

// a trail of light: faint where it started, full at the head
const TRAIL =
  "bg-[linear-gradient(90deg,color-mix(in_srgb,var(--progress-fill)_35%,transparent),var(--progress-fill))]";

// the head glows into the empty track ahead of it
const HEAD = cn(
  "after:absolute after:inset-y-0 after:right-0 after:aspect-square after:rounded-full",
  "after:bg-[var(--progress-fill)] after:shadow-[0_0_8px_2px_color-mix(in_srgb,var(--progress-fill)_60%,transparent)]"
);

interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  value?: number;
  max?: number;
  variant?: "bar" | "ring";
  /** Split the bar into this many steps, such as 12 months or 5 questions. */
  segments?: number;
  /** A name shown above the bar, and the name screen readers hear. */
  label?: React.ReactNode;
  /** What screen readers hear for the value. Defaults to "75%", or "9 of 12" with segments. */
  valueText?: string;
  /** The value beside the label, as `valueText` reads it, or your own node. */
  showValue?: boolean | React.ReactNode;
  /** Working, with no way to tell how far along. */
  indeterminate?: boolean;
  /** `xl` is a 72px ring with the value in its center. */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * The fill's color. A status is a statement you make, such as over budget:
   * a low value is never the error color on its own.
   */
  tone?: keyof typeof TONE;
}

/**
 * How far along something is: a bar, a bar in steps, or a ring. A real
 * progressbar with its value in words. It fills once it is on screen, as a
 * trail of light with a glowing head, steps lighting one after another; with
 * reduced motion it is simply full. The bar slides on transform, so a change
 * of value does not reflow the layout.
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      variant = "bar",
      segments,
      label,
      valueText: valueTextProp,
      showValue = false,
      indeterminate = false,
      size = "md",
      tone = "brand",
      className,
      style,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const local = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => local.current as HTMLDivElement);
    const reduce = useReducedMotion() ?? false;
    const seen = useInView(local, revealViewport);

    const safeMax = max > 0 ? max : 100;
    const clamped = Math.min(Math.max(value, 0), safeMax);
    const fraction = clamped / safeMax;
    // empty until it is seen, so the fill is watched rather than spent offscreen
    const drawn = reduce || seen ? fraction : 0;
    const labelId = React.useId();
    const valueText =
      valueTextProp ??
      (segments
        ? `${Math.round(fraction * segments)} of ${segments}`
        : `${Math.round(fraction * 100)}%`);
    const shown = showValue === true ? valueText : showValue || null;

    const a11y = {
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": safeMax,
      "aria-valuenow": indeterminate ? undefined : clamped,
      "aria-valuetext": indeterminate ? undefined : valueText,
      "aria-busy": indeterminate || undefined,
      "aria-label": ariaLabel,
      "aria-labelledby": !ariaLabel && label ? labelId : undefined,
    } as const;

    const fill = { "--progress-fill": TONE[tone] } as React.CSSProperties;

    if (variant === "ring") {
      const px = RING[size];
      const stroke = RING_STROKE[size];
      const center = size === "xl";
      const r = (px - stroke) / 2;
      const length = 2 * Math.PI * r;
      return (
        <div
          ref={local}
          className={cn("inline-flex items-center", center ? "gap-3" : "gap-2", className)}
          style={{ ...fill, ...style }}
          {...props}
        >
          <span {...a11y} className="relative inline-flex shrink-0">
            <svg
              aria-hidden="true"
              width={px}
              height={px}
              viewBox={`0 0 ${px} ${px}`}
              className={cn(
                "shrink-0 -rotate-90",
                indeterminate && "animate-spin motion-reduce:animate-none"
              )}
            >
              <circle
                cx={px / 2}
                cy={px / 2}
                r={r}
                fill="none"
                strokeWidth={stroke}
                className="stroke-[var(--bg-hover-strong)]"
              />
              <circle
                cx={px / 2}
                cy={px / 2}
                r={r}
                fill="none"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={length}
                strokeDashoffset={length * (1 - (indeterminate ? 0.25 : drawn))}
                className={cn(
                  "stroke-[var(--progress-fill)] transition-[stroke-dashoffset]",
                  "[filter:drop-shadow(0_0_3px_color-mix(in_srgb,var(--progress-fill)_55%,transparent))]",
                  FILL_MOTION
                )}
              />
            </svg>
            {center && shown ? (
              <span
                aria-hidden
                className="absolute inset-0 grid place-items-center font-mono text-mono-md tabular-nums text-[var(--fg-primary)]"
              >
                {shown}
              </span>
            ) : null}
          </span>
          {label || (shown && !center) ? (
            <span className="flex min-w-0 flex-col font-mono text-mono-sm">
              {label ? (
                <span id={labelId} className="truncate text-[var(--fg-secondary)]">
                  {label}
                </span>
              ) : null}
              {shown && !center ? (
                <span aria-hidden className="tabular-nums text-[var(--fg-primary)]">
                  {shown}
                </span>
              ) : null}
            </span>
          ) : null}
        </div>
      );
    }

    return (
      <div
        ref={local}
        className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}
        style={{ ...fill, ...style }}
        {...props}
      >
        {label || shown ? (
          // it wraps before anything is cut: the value goes under the label
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 font-mono text-mono-sm">
            {label ? (
              <span id={labelId} className="min-w-0 truncate text-[var(--fg-secondary)]">
                {label}
              </span>
            ) : (
              <span />
            )}
            {shown ? (
              <span aria-hidden className="shrink-0 tabular-nums text-[var(--fg-primary)]">
                {shown}
              </span>
            ) : null}
          </div>
        ) : null}
        {segments && !indeterminate ? (
          <div {...a11y} className="flex w-full gap-0.5">
            {Array.from({ length: segments }, (_, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed steps of one bar, in order
                key={index}
                data-filled={index < Math.round(drawn * segments) || undefined}
                className={cn(
                  trackVariants({ size }),
                  "rounded-[1px] first:rounded-l-full last:rounded-r-full",
                  "data-[filled]:bg-[var(--progress-fill)]",
                  "data-[filled]:shadow-[0_0_6px_color-mix(in_srgb,var(--progress-fill)_45%,transparent)]",
                  "transition-[background-color,box-shadow] duration-[var(--motion-slow)]"
                )}
                // one after another, the way steps are taken
                style={{ transitionDelay: `${index * 45}ms` }}
              />
            ))}
          </div>
        ) : (
          <div {...a11y} className={trackVariants({ size })}>
            {indeterminate ? (
              // the skeleton's band, in the fill's color; still and faint without motion
              <span
                className={cn(
                  "absolute inset-y-0 left-0 w-3/5 rounded-full bg-[var(--progress-fill)]",
                  "animate-[skeleton-sweep_1.4s_ease-in-out_infinite]",
                  "motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-40"
                )}
              />
            ) : (
              <span
                // slid in from the left rather than scaled, which would squash its rounded end
                className={cn(
                  "absolute inset-0 rounded-full transition-transform",
                  TRAIL,
                  HEAD,
                  FILL_MOTION
                )}
                style={{ transform: `translateX(${(drawn - 1) * 100}%)` }}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
export type { ProgressProps };
