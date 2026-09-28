"use client";

import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import * as React from "react";
import { useFormat } from "../hooks/use-format";
import { formatMoney, formatNumber } from "../lib/format";
import { cn } from "../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../primitives/tooltip";

type DeltaState = "up" | "down" | "flat" | "new" | "none";

interface DeltaComparison {
  state: DeltaState;
  /** current minus previous, in the values' own unit. */
  difference: number | null;
  /** The change as a fraction of the previous value (`0.12` is 12%), when that means something. */
  ratio: number | null;
}

/**
 * What changed between two values. A percentage needs a positive base: from
 * 0, or from below it, "+300%" means nothing, so `ratio` is null there and the
 * difference in value stands in for it.
 */
function compareValues(current: number | null, previous: number | null): DeltaComparison {
  if (current === null) return { state: "none", difference: null, ratio: null };
  if (previous === null) return { state: "new", difference: null, ratio: null };
  const difference = current - previous;
  const ratio = previous > 0 ? difference / previous : null;
  const state = difference > 0 ? "up" : difference < 0 ? "down" : "flat";
  return { state, difference, ratio };
}

const deltaVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap font-mono tabular-nums",
  {
    variants: {
      tone: {
        good: "text-[var(--status-success-fg)]",
        bad: "text-[var(--status-error-fg)]",
        neutral: "text-[var(--fg-secondary)]",
        muted: "text-[var(--fg-muted)]",
      },
      size: {
        sm: "text-mono-xs",
        md: "text-mono-sm",
      },
      // a pill sits on its tone's own soft tint, a pair the contrast test measures
      variant: {
        text: "",
        pill: "rounded-full px-2 py-0.5",
      },
    },
    compoundVariants: [
      { variant: "pill", tone: "good", className: "bg-[var(--status-success-soft)]" },
      { variant: "pill", tone: "bad", className: "bg-[var(--status-error-soft)]" },
      { variant: "pill", tone: "neutral", className: "bg-[var(--bg-hover-strong)]" },
    ],
    defaultVariants: { tone: "neutral", size: "md", variant: "text" },
  }
);

const LABELS = {
  up: "Up",
  down: "Down",
  flat: "No change",
  new: "new",
  none: "No comparison",
};

interface DeltaProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  current: number | null;
  previous: number | null;
  /**
   * `percent` shows the change as a share of the previous value, and falls
   * back to the difference when there is no positive base. `amount` shows the
   * difference in money, from minor units; `number`, as a plain number.
   */
  format?: "percent" | "amount" | "number";
  /** Which way is good news. Spending going up is bad; income going up is good. */
  intent?: "increase-is-good" | "increase-is-bad" | "neutral";
  /** ISO 4217, for `amount` and for the fallback of `percent`. Falls back to the FormatProvider's. */
  currency?: string;
  locale?: string;
  /** Why there is nothing to compare, shown on hover and read by screen readers. */
  reason?: string;
  size?: "sm" | "md";
  /** `pill` puts it on a soft tint of its tone, for a Metric or a tile. */
  variant?: "text" | "pill";
  labels?: Partial<typeof LABELS>;
}

/**
 * How a value moved against the one before it: an arrow, a sign and the
 * change, in words for screen readers. Color only says whether that is good,
 * after the arrow and the sign already said which way it went.
 */
const Delta = React.forwardRef<HTMLSpanElement, DeltaProps>(
  (
    {
      current,
      previous,
      format = "percent",
      intent = "increase-is-good",
      currency: ownCurrency,
      locale: ownLocale,
      reason,
      size,
      variant,
      labels: labelsProp,
      className,
      ...props
    },
    ref
  ) => {
    const labels = { ...LABELS, ...labelsProp };
    const { locale, currency } = useFormat({ locale: ownLocale, currency: ownCurrency });
    const { state, difference, ratio } = compareValues(current, previous);

    if (state === "none") {
      return (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* focusable, so the reason is reachable without a mouse */}
              <span
                ref={ref}
                tabIndex={reason ? 0 : undefined}
                className={cn(
                  deltaVariants({ tone: "muted", size }),
                  "focus-ring rounded-[var(--radius-sm)]",
                  className
                )}
                {...props}
              >
                <span aria-hidden>—</span>
                <span className="sr-only">
                  {reason ? `${labels.none}: ${reason}` : labels.none}
                </span>
              </span>
            </TooltipTrigger>
            {reason ? <TooltipContent>{reason}</TooltipContent> : null}
          </Tooltip>
        </TooltipProvider>
      );
    }

    if (state === "new") {
      return (
        <span
          ref={ref}
          className={cn(deltaVariants({ tone: "neutral", size, variant }), className)}
          {...props}
        >
          {labels.new}
        </span>
      );
    }

    const money = format === "amount" || (format === "percent" && ratio === null && currency);
    let text: string;
    if (format === "percent" && ratio !== null) {
      text = formatNumber(ratio, {
        locale,
        style: "percent",
        signDisplay: "always",
        maximumFractionDigits: 1,
      });
    } else if (money) {
      if (!currency) {
        throw new Error(
          "Delta needs a currency for amounts: pass one, or set it on a FormatProvider."
        );
      }
      text = formatMoney(difference ?? 0, { locale, currency, signDisplay: "always" });
    } else {
      text = formatNumber(difference ?? 0, { locale, signDisplay: "always" });
    }

    const tone =
      state === "flat" || intent === "neutral"
        ? "neutral"
        : (state === "up") === (intent === "increase-is-good")
          ? "good"
          : "bad";
    const Arrow =
      state === "up" ? ArrowUpRightIcon : state === "down" ? ArrowDownRightIcon : ArrowRightIcon;
    const word = state === "up" ? labels.up : state === "down" ? labels.down : labels.flat;

    return (
      <span
        ref={ref}
        data-state={state}
        className={cn(deltaVariants({ tone, size, variant }), className)}
        {...props}
      >
        <Arrow aria-hidden size={size === "sm" ? 10 : 12} weight="bold" className="shrink-0" />
        <span className="sr-only">{word} </span>
        {text}
      </span>
    );
  }
);
Delta.displayName = "Delta";

export { compareValues, Delta, deltaVariants };
export type { DeltaComparison, DeltaProps, DeltaState };
