"use client";

import { cva } from "class-variance-authority";
import * as React from "react";
import { useFormat } from "../hooks/use-format";
import { formatMoney, moneyParts } from "../lib/format";
import { cn } from "../lib/utils";

const amountVariants = cva("font-mono tabular-nums whitespace-nowrap", {
  variants: {
    tone: {
      neutral: "",
      positive: "text-[var(--status-success-fg)]",
      negative: "text-[var(--status-error-fg)]",
    },
  },
  defaultVariants: { tone: "neutral" },
});

interface AmountProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "title"> {
  /** Integer minor units: 123456 is 1,234.56 in a currency with cents. */
  value: number;
  /** ISO 4217. Falls back to the FormatProvider's. */
  currency?: string;
  /** Falls back to the FormatProvider's, then `en-US`. */
  locale?: string;
  /** `auto` colors by the sign. With any tone but neutral the sign always shows: color only reinforces it. */
  tone?: "auto" | "neutral" | "positive" | "negative";
  /** Defaults to `always` with a tone, `auto` without one. */
  signDisplay?: "auto" | "always" | "never";
  /** `$1.2K`, for axes and small widgets. The full value is still read out and shown on hover. */
  compact?: boolean;
  /** Cents in the muted ink, for a large value where they are noise. */
  muteCents?: boolean;
}

/**
 * One way to show money across an app, so every screen formats alike and
 * columns line up: mono, tabular figures, the real minus sign. The currency
 * symbol takes the muted ink, so the number is what reads first.
 */
const Amount = React.forwardRef<HTMLSpanElement, AmountProps>(
  (
    {
      value,
      currency: ownCurrency,
      locale: ownLocale,
      tone = "neutral",
      signDisplay,
      compact = false,
      muteCents = false,
      className,
      ...props
    },
    ref
  ) => {
    const { locale, currency } = useFormat({ locale: ownLocale, currency: ownCurrency });
    if (!currency) {
      throw new Error("Amount needs a currency: pass one, or set it on a FormatProvider.");
    }
    const resolvedTone =
      tone === "auto" ? (value > 0 ? "positive" : value < 0 ? "negative" : "neutral") : tone;
    const sign = signDisplay ?? (tone === "neutral" ? "auto" : "always");
    const options = { locale, currency, signDisplay: sign, compact } as const;
    const parts = moneyParts(value, options);
    const full = compact ? formatMoney(value, { ...options, compact: false }) : undefined;

    let afterDecimal = false;
    const pieces = parts.map((part, index) => {
      if (part.type === "decimal") afterDecimal = true;
      const muted =
        part.type === "currency" || (muteCents && (part.type === "decimal" || afterDecimal));
      return (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: the parts of one formatted value, in order
          key={index}
          className={cn(muted && "text-[var(--fg-muted)]")}
        >
          {part.value}
        </span>
      );
    });

    return (
      <span
        ref={ref}
        className={cn(amountVariants({ tone: resolvedTone }), className)}
        title={full}
        {...props}
      >
        {compact ? (
          <>
            <span aria-hidden>{pieces}</span>
            <span className="sr-only">{full}</span>
          </>
        ) : (
          pieces
        )}
      </span>
    );
  }
);
Amount.displayName = "Amount";

export { Amount, amountVariants };
export type { AmountProps };
