"use client";

import { ChartBarIcon, TableIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Legend, ResponsiveContainer, Tooltip } from "recharts";
import { Amount } from "../data/amount";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../data/table";
import { useFormat } from "../hooks/use-format";
import { formatMoney, formatNumber } from "../lib/format";
import { OVERLAY_SURFACE } from "../lib/overlay";
import { type PaletteKey, paletteColor } from "../lib/palette";
import { cn } from "../lib/utils";
import { Button } from "../primitives/button";

/* ------------------------------------------------------------------ config */

export type ChartPaletteKey = PaletteKey;

/** How a series' values read: money from minor units, a number, or a share (`0.12` is 12%). */
export type ChartFormat = "number" | "money" | "percent";

export interface ChartSeriesConfig {
  /** The series' name, in the tooltip, the legend and the table. */
  label: string;
  /** A palette key (`"chart-3"`), a status for results above or below zero, or any CSS color. */
  color: ChartPaletteKey | (string & {});
  format?: ChartFormat;
  /** A result above or below zero: "+" and the real minus on every value, never color alone. */
  signed?: boolean;
}

/** Maps a series dataKey to its label, color and format. */
export type ChartConfig = Record<string, ChartSeriesConfig>;

interface ChartContextValue {
  config: ChartConfig;
  currency?: string;
  locale: string;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart(): ChartContextValue {
  return React.useContext(ChartContext) ?? { config: {}, locale: "en-US" };
}

/** Kept for charts written against the first version. */
function useChartConfig(): ChartConfig {
  return useChart().config;
}

/** The CSS color for a config color: a palette key becomes its token. */
export const chartColor = paletteColor;

/**
 * A value as its series reads it. `compact` is for an axis, where "$1.2K"
 * fits and "$1,204.80" does not; the tooltip and the table always show it in
 * full.
 */
export function formatChartValue(
  value: number,
  format: ChartFormat = "number",
  options: { currency?: string; locale?: string; compact?: boolean; signed?: boolean } = {}
): string {
  const { currency, locale, compact, signed } = options;
  const signDisplay = signed ? "always" : "auto";
  if (format === "money" && currency)
    return formatMoney(value, { currency, locale, compact, signDisplay });
  if (format === "percent") {
    return formatNumber(value, { locale, style: "percent", maximumFractionDigits: 1, signDisplay });
  }
  return formatNumber(value, { locale, compact, signDisplay });
}

/* ------------------------------------------------------------ style bridge */

// Series colors become custom properties on the container, so a series can
// point at var(--color-<key>). Callers pass user data through here (a
// spreadsheet column name becomes a series key), so a key must be a plain
// identifier and a color cannot carry a second declaration.
const SAFE_KEY = /^[A-Za-z0-9_-]+$/;
const UNSAFE_VALUE = /[;{}<>\\]/;

function seriesVars(config: ChartConfig): React.CSSProperties {
  const vars: Record<string, string> = {};
  for (const [key, item] of Object.entries(config)) {
    const color = chartColor(item.color);
    if (SAFE_KEY.test(key) && !UNSAFE_VALUE.test(color)) vars[`--color-${key}`] = color;
  }
  return vars as React.CSSProperties;
}

/* ----------------------------------------------------------------- motion */

/**
 * Animation props for chart series, disabled under prefers-reduced-motion.
 * Recharts animates in JS, so the global CSS media query does not reach it.
 * Spread the result onto every Bar, Line, Area or Pie.
 */
export function useChartMotion() {
  // Starts false so server and first client render agree; the effect corrects
  // it before paint on the client.
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return React.useMemo(
    () =>
      ({
        isAnimationActive: !reduced,
        animationDuration: 850,
        animationEasing: "ease-out",
      }) as const,
    [reduced]
  );
}

/**
 * True once the element has been on screen. Recharts plays its entrance when
 * the plot mounts, so the plot mounts when it is seen, not offscreen.
 */
function useSeenOnce<T extends Element>(ref: React.RefObject<T | null>) {
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (seen || !element) return;
    if (typeof IntersectionObserver !== "function") {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, seen]);
  return seen;
}

/* -------------------------------------------------------------- container */

const LABELS = { table: "View as table", chart: "View as chart", noData: "no data" };

export interface ChartContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  config: ChartConfig;
  /**
   * Total pixel height, legend included. Required: ResponsiveContainer
   * collapses to zero inside a parent with no resolved height.
   */
  height: number;
  /** Accessible name for the chart. Say what it shows, not that it is a chart. */
  label: string;
  /** Longer text alternative: the trend in words. Becomes the plot's <desc>. */
  description?: string;
  /** A legend built from `config`. By default only from three series; name one or two in the title. */
  legend?: boolean;
  /**
   * The rows the chart draws, and the key of their category (the month, the
   * category name). With both, a button shows the same numbers as a Table.
   */
  data?: readonly Record<string, unknown>[];
  categoryKey?: string;
  /** For money series. Falls back to the FormatProvider's. */
  currency?: string;
  locale?: string;
  labels?: Partial<typeof LABELS>;
  children: React.ReactElement;
}

/**
 * The frame for a Recharts chart: series colors from the palette, a tooltip
 * on the overlay surface that shows full values, a legend when there are
 * enough series to need one, and the same numbers as a table for anyone who
 * would rather read them. Put it in a Card, which is the frame; the chart
 * draws no border of its own.
 */
const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      config,
      height,
      label,
      description,
      legend,
      data,
      categoryKey,
      currency: ownCurrency,
      locale: ownLocale,
      labels: labelsProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const labels = { ...LABELS, ...labelsProp };
    const { locale, currency } = useFormat({ locale: ownLocale, currency: ownCurrency });
    const reactId = React.useId();
    const id = `chart-${reactId.replace(/[^A-Za-z0-9_-]/g, "")}`;
    const plotRef = React.useRef<HTMLDivElement>(null);
    const seen = useSeenOnce(plotRef);
    const [view, setView] = React.useState<"chart" | "table">("chart");

    const context = React.useMemo(() => ({ config, currency, locale }), [config, currency, locale]);
    const showLegend = legend ?? Object.keys(config).length >= 3;
    const tabular = data !== undefined && categoryKey !== undefined;

    // The name goes on the plot itself, not on this wrapper. Recharts already
    // gives the <svg> role="application" and tabindex="0" so it can be explored
    // with the arrow keys; a labelled wrapper around it is dropped by the
    // browser's accessibility tree, leaving the chart nameless. Recharts
    // forwards aria-label to the <svg> and renders `desc` as its <desc>.
    const named = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      "aria-label": label,
      ...(description ? { desc: description } : {}),
    });

    return (
      <ChartContext.Provider value={context}>
        <div
          ref={ref}
          data-chart={id}
          className={cn(
            "flex w-full min-w-0 flex-col",
            "[&_.recharts-surface]:outline-none",
            "[&_.recharts-surface:focus-visible]:outline-2",
            "[&_.recharts-surface:focus-visible]:outline-[var(--fg-brand)]",
            "[&_.recharts-surface:focus-visible]:outline-offset-2",
            // Recharts 3 moves focus to an inner <g> on click, which the browser
            // rings in its own blue; only a keyboard's focus is shown, in the brand
            "[&_g:focus:not(:focus-visible)]:outline-none",
            "[&_g:focus-visible]:outline-2 [&_g:focus-visible]:outline-[var(--fg-brand)]",
            className
          )}
          style={{ ...seriesVars(config), height, ...style }}
          {...props}
        >
          <div ref={plotRef} id={id} className="min-h-0 flex-1">
            {view === "table" && tabular ? (
              <ChartTable
                data={data}
                categoryKey={categoryKey}
                label={label}
                noData={labels.noData}
              />
            ) : seen ? (
              <ResponsiveContainer width="100%" height="100%">
                {named}
              </ResponsiveContainer>
            ) : null}
          </div>
          {showLegend || tabular ? (
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3">
              {showLegend ? (
                // it shrinks and wraps, so a long legend never pushes past the card
                <ChartLegendContent className="min-w-0 shrink justify-start pt-0" />
              ) : (
                <span />
              )}
              {tabular ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 px-2"
                  aria-controls={id}
                  onClick={() => setView(view === "chart" ? "table" : "chart")}
                >
                  {view === "chart" ? (
                    <TableIcon aria-hidden size={14} />
                  ) : (
                    <ChartBarIcon aria-hidden size={14} />
                  )}
                  {view === "chart" ? labels.table : labels.chart}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

/** The chart's numbers in a Table, formatted in full, for reading instead of looking. */
function ChartTable({
  data,
  categoryKey,
  label,
  noData,
}: {
  data: readonly Record<string, unknown>[];
  categoryKey: string;
  label: string;
  noData: string;
}) {
  const { config } = useChart();
  const keys = Object.keys(config);
  return (
    <Table aria-label={label} maxHeight="100%" className="h-full">
      <TableHeader>
        <TableRow>
          <TableHead>{categoryKey}</TableHead>
          {keys.map((key) => (
            <TableHead key={key} align="end">
              {config[key].label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the chart's rows, in the chart's order
          <TableRow key={index}>
            <TableCell className="text-[var(--fg-primary)]">
              {String(row[categoryKey] ?? "")}
            </TableCell>
            {keys.map((key) => (
              <TableCell key={key} align="end">
                {row[key] == null ? (
                  // a dash to see, words to hear
                  <>
                    <span aria-hidden>—</span>
                    <span className="sr-only">{noData}</span>
                  </>
                ) : (
                  <ChartValue value={row[key]} seriesKey={key} />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** One value, full, as its series reads it. Money goes through Amount. */
function ChartValue({ value, seriesKey }: { value: unknown; seriesKey: string }) {
  const { config, currency, locale } = useChart();
  if (typeof value !== "number") return <>{value == null ? "—" : String(value)}</>;
  const format = config[seriesKey]?.format ?? "number";
  const signed = config[seriesKey]?.signed ?? false;
  if (format === "money" && currency) {
    return (
      <Amount
        value={value}
        currency={currency}
        locale={locale}
        signDisplay={signed ? "always" : "auto"}
      />
    );
  }
  return (
    <span className="font-mono tabular-nums">
      {formatChartValue(value, format, { locale, signed })}
    </span>
  );
}

/* --------------------------------------------------------------- presets */

/** Spread onto <CartesianGrid> in a vertical (column, line, area) chart. */
export const chartGrid = {
  strokeDasharray: "3 3",
  stroke: "var(--chart-grid)",
  vertical: false,
} as const;

/** Spread onto <CartesianGrid> in a horizontal bar chart. */
export const chartGridHorizontal = {
  strokeDasharray: "3 3",
  stroke: "var(--chart-grid)",
  horizontal: false,
} as const;

/** Axis labels at the mono-xs step: 10px, in the axis ink. */
export const chartTick = {
  fill: "var(--chart-axis)",
  fontFamily: "var(--font-mono)",
  fontSize: 10,
} as const;

export const chartXAxis = {
  tick: chartTick,
  axisLine: false,
  tickLine: false,
  tickMargin: 8,
  // a phone gets the first and last labels and what fits between them
  interval: "preserveStartEnd",
  minTickGap: 12,
} as const;

export const chartYAxis = {
  tick: chartTick,
  axisLine: false,
  tickLine: false,
  width: 44,
} as const;

export const chartCursor = { fill: "var(--chart-cursor)" } as const;

export const chartMargin = {
  /** Column, line, area. */
  vertical: { top: 4, right: 8, left: -4, bottom: 0 },
  /** Horizontal bar. */
  horizontal: { top: 4, right: 12, left: 8, bottom: 0 },
} as const;

/** A projection or a forecast: dashed, fainter, and named "projected" in the config. */
export const chartProjection = {
  strokeDasharray: "4 4",
  strokeOpacity: 0.7,
  fillOpacity: 0.08,
} as const;

/* --------------------------------------------------------------- tooltip */

export { Tooltip as ChartTooltip };

/**
 * Recharts' own Legend.
 *
 * Adding it to a chart drops `role="application"` and `tabindex="0"` from the
 * plot, so the chart stops being reachable by keyboard. Measured on recharts
 * 3.10.1, with `accessibilityLayer` explicitly on. Prefer ChartContainer's
 * `legend` prop, which renders the same markup as a sibling and leaves the
 * plot alone. This stays exported for charts that need recharts' own legend
 * behaviour and can accept the cost.
 */
export { Legend as ChartLegend };

export interface ChartPayloadItem {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
  fill?: string;
  stroke?: string;
  payload?: Record<string, unknown>;
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: ChartPayloadItem[];
  label?: string | number;
  /** Your own value, in place of the series format. */
  formatter?: (value: number | string, key: string, item: ChartPayloadItem) => React.ReactNode;
  labelFormatter?: (label: string | number) => React.ReactNode;
  hideLabel?: boolean;
  /** A slice or a bar that carries its own name, such as a donut's, in `nameKey`. */
  nameKey?: string;
  className?: string;
}

function seriesKey(item: ChartPayloadItem, nameKey?: string): string {
  if (nameKey && item.payload && item.payload[nameKey] !== undefined) {
    return String(item.payload[nameKey]);
  }
  return String(item.dataKey ?? item.name ?? "");
}

function swatchColor(item: ChartPayloadItem): string | undefined {
  return item.color ?? item.fill ?? item.stroke;
}

/**
 * The tooltip, on the overlay surface. Values show in full, through Amount for
 * money, even when the axis shows them compact.
 */
const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ active, payload, label, formatter, labelFormatter, hideLabel, nameKey, className }, ref) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          OVERLAY_SURFACE,
          "min-w-[148px] rounded-[var(--radius-md)] px-3 py-2 font-mono text-mono-sm",
          className
        )}
      >
        {hideLabel ? null : (
          <div className="mb-1.5 text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
            {labelFormatter && label !== undefined ? labelFormatter(label) : label}
          </div>
        )}
        {payload.map((item) => {
          const key = seriesKey(item, nameKey);
          const series = config[key] ?? config[String(item.dataKey ?? "")];
          const name = series?.label ?? item.name ?? key;
          const color = series ? chartColor(series.color) : swatchColor(item);
          return (
            <div key={key} className="flex items-center gap-2 py-0.5">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-[2px]"
                style={{ background: color }}
              />
              <span className="text-[var(--fg-secondary)]">{name}</span>
              <span className="ml-auto pl-3 text-[var(--fg-primary)]">
                {formatter && item.value !== undefined ? (
                  formatter(item.value, key, item)
                ) : (
                  <ChartValue value={item.value} seriesKey={String(item.dataKey ?? key)} />
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

/* ---------------------------------------------------------------- legend */

export interface ChartLegendContentProps {
  /**
   * Supplied by recharts when used as <Legend content={...}>. Omit it and the
   * legend is built from the container config instead, which is the path
   * ChartContainer's `legend` prop takes.
   */
  payload?: ChartPayloadItem[];
  className?: string;
}

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ payload, className }, ref) => {
    const { config } = useChart();

    const items: { key: string; name: string; color?: string }[] = payload?.length
      ? payload.map((item) => {
          const key = seriesKey(item);
          return {
            key,
            // Recharts puts the series name in `value`, not `name`.
            name: config[key]?.label ?? (item.value !== undefined ? String(item.value) : key),
            color: config[key] ? chartColor(config[key].color) : swatchColor(item),
          };
        })
      : Object.entries(config).map(([key, item]) => ({
          key,
          name: item.label,
          color: chartColor(item.color),
        }));

    if (!items.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3",
          "font-mono text-mono-sm text-[var(--fg-secondary)]",
          className
        )}
      >
        {items.map((item) => (
          <span key={item.key} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ background: item.color }}
            />
            {item.name}
          </span>
        ))}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

export { ChartContainer, ChartTooltipContent, ChartLegendContent, useChartConfig };
