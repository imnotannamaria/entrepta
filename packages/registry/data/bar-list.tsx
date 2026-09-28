import * as React from "react";
import { formatNumber } from "../lib/format";
import { type PaletteKey, paletteColor } from "../lib/palette";
import { cn } from "../lib/utils";
import { Amount } from "./amount";

export interface BarListItem {
  label: string;
  value: number;
  /** A palette key or a CSS color. Defaults to the list's color. */
  color?: PaletteKey | (string & {});
  href?: string;
}

type LinkComponent = React.ElementType<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>;

interface BarListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  items: readonly BarListItem[];
  /** Show the first this many, largest first. */
  max?: number;
  /** With `max`, add up the rest in one last row. */
  showOthers?: boolean;
  /** Money from minor units, a plain number, or a share (`0.12` is 12%). */
  format?: "number" | "money" | "percent";
  /** For money. Falls back to the FormatProvider's. */
  currency?: string;
  locale?: string;
  /** The bars' color when an item has none. */
  color?: PaletteKey | (string & {});
  /** Keep the order given instead of sorting largest first. */
  keepOrder?: boolean;
  /** Your router's link, for items with an `href`. Defaults to `<a>`. */
  linkComponent?: LinkComponent;
  labels?: { others?: string };
}

/**
 * A ranking in rows: where the money went, which pages people read. Each
 * label sits in full on its own bar, which is as long as its share of the
 * largest, and the value stands at the end. No chart library and no
 * JavaScript of its own, so a server page renders it whole.
 */
const BarList = React.forwardRef<HTMLUListElement, BarListProps>(
  (
    {
      items,
      max,
      showOthers = false,
      format = "number",
      currency,
      locale,
      color = "chart-1",
      keepOrder = false,
      linkComponent: LinkComp = "a",
      labels,
      className,
      ...props
    },
    ref
  ) => {
    const sorted = keepOrder ? [...items] : [...items].sort((a, b) => b.value - a.value);
    let rows: BarListItem[] = max !== undefined ? sorted.slice(0, max) : sorted;
    const rest = max !== undefined ? sorted.slice(max) : [];
    if (showOthers && rest.length > 0) {
      rows = [
        ...rows,
        {
          label: labels?.others ?? `Others (${rest.length})`,
          value: rest.reduce((sum, item) => sum + item.value, 0),
          color: "neutral",
        },
      ];
    }
    const largest = Math.max(...rows.map((row) => Math.abs(row.value)), 0) || 1;

    const value = (n: number) =>
      format === "money" ? (
        <Amount value={n} currency={currency} locale={locale} />
      ) : (
        <span className="font-mono tabular-nums">
          {format === "percent"
            ? formatNumber(n, { locale, style: "percent", maximumFractionDigits: 1 })
            : formatNumber(n, { locale })}
        </span>
      );

    return (
      <ul ref={ref} className={cn("m-0 flex list-none flex-col gap-1.5 p-0", className)} {...props}>
        {rows.map((row, index) => {
          const share = Math.abs(row.value) / largest;
          const body = (
            <>
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--bar)_22%,transparent)]"
                style={
                  {
                    "--bar": paletteColor(row.color ?? color),
                    width: `${Math.max(share * 100, 1.5)}%`,
                  } as React.CSSProperties
                }
              />
              {/* the label wraps rather than truncates: it is the point of the row */}
              <span className="relative min-w-0 flex-1 break-words text-[var(--fg-primary)]">
                {row.label}
              </span>
              <span className="relative shrink-0 text-[var(--fg-secondary)]">
                {value(row.value)}
              </span>
            </>
          );
          const rowClass = cn(
            "relative flex min-h-8 items-center gap-4 rounded-[var(--radius-sm)] px-2.5 py-1.5",
            "font-mono text-mono-sm"
          );
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: labels can repeat; the order is the key
            <li key={index}>
              {row.href ? (
                <LinkComp
                  href={row.href}
                  className={cn(
                    rowClass,
                    "focus-ring transition-colors duration-[var(--motion-fast)] hover:bg-[var(--bg-hover-soft)]"
                  )}
                >
                  {body}
                </LinkComp>
              ) : (
                <div className={rowClass}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }
);
BarList.displayName = "BarList";

export { BarList };
export type { BarListProps };
