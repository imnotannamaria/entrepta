"use client";

import * as React from "react";
import { Legend, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ config */

export interface ChartSeriesConfig {
  /** Human label shown in the tooltip and legend. */
  label: string;
  /** Any CSS color. Use a token: "var(--chart-1)". */
  color: string;
}

/** Maps a series dataKey to its label and color. */
export type ChartConfig = Record<string, ChartSeriesConfig>;

const ChartContext = React.createContext<ChartConfig | null>(null);

function useChartConfig(): ChartConfig {
  return React.useContext(ChartContext) ?? {};
}

/* ------------------------------------------------------------ style bridge */

// Config keys and colors are interpolated into a stylesheet, and callers pass
// user data through here (a spreadsheet column name becomes a series key).
// Anything that could close the declaration or the tag is dropped.
const SAFE_KEY = /^[A-Za-z0-9_-]+$/;
const UNSAFE_VALUE = /[;{}<>\\]/;

function isSafeEntry(key: string, item: ChartSeriesConfig): boolean {
  return SAFE_KEY.test(key) && !UNSAFE_VALUE.test(item.color);
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const declarations = Object.entries(config)
    .filter(([key, item]) => isSafeEntry(key, item))
    .map(([key, item]) => `--color-${key}:${item.color};`)
    .join("");

  if (!declarations) return null;

  return (
    // Scoping generated custom properties to this instance needs a real
    // stylesheet. Keys and colors are filtered above; the id is sanitised by
    // the caller.
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: see comment above
      dangerouslySetInnerHTML={{ __html: `[data-chart="${id}"]{${declarations}}` }}
    />
  );
}

/* ----------------------------------------------------------------- motion */

/**
 * Animation props for chart series, disabled under prefers-reduced-motion.
 * Recharts animates in JS, so the global CSS media query does not reach it.
 * Spread the result onto every Bar, Line or Area.
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

/* -------------------------------------------------------------- container */

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
  /** Longer text alternative. Becomes the plot's <desc>. */
  description?: string;
  /**
   * Render a legend below the plot, built from `config`.
   * Prefer this over recharts' own <Legend>, which strips the chart's
   * keyboard layer. See ChartLegend.
   */
  legend?: boolean;
  children: React.ReactElement;
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, height, label, description, legend, className, children, ...props }, ref) => {
    const reactId = React.useId();
    const id = `chart-${reactId.replace(/[^A-Za-z0-9_-]/g, "")}`;

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
      <ChartContext.Provider value={config}>
        <div
          ref={ref}
          data-chart={id}
          className={cn(
            "flex w-full flex-col",
            "[&_.recharts-surface]:outline-none",
            "[&_.recharts-surface:focus-visible]:outline-2",
            "[&_.recharts-surface:focus-visible]:outline-[var(--fg-brand)]",
            "[&_.recharts-surface:focus-visible]:outline-offset-2",
            className
          )}
          style={{ height }}
          {...props}
        >
          <ChartStyle id={id} config={config} />
          <div className="min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              {named}
            </ResponsiveContainer>
          </div>
          {legend ? <ChartLegendContent /> : null}
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

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

export const chartTick = {
  fill: "var(--chart-axis)",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
} as const;

export const chartXAxis = {
  tick: chartTick,
  axisLine: { stroke: "var(--chart-grid)" },
  tickLine: false,
  tickMargin: 8,
} as const;

export const chartYAxis = {
  tick: chartTick,
  axisLine: false,
  tickLine: false,
  width: 34,
} as const;

export const chartCursor = { fill: "var(--chart-cursor)" } as const;

export const chartMargin = {
  /** Column, line, area. */
  vertical: { top: 4, right: 12, left: -8, bottom: 0 },
  /** Horizontal bar. */
  horizontal: { top: 4, right: 12, left: 8, bottom: 0 },
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
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: ChartPayloadItem[];
  label?: string | number;
  /** Format the value. Return a string or a node. */
  formatter?: (value: number | string, key: string, item: ChartPayloadItem) => React.ReactNode;
  labelFormatter?: (label: string | number) => React.ReactNode;
  hideLabel?: boolean;
  className?: string;
}

function seriesKey(item: ChartPayloadItem): string {
  return String(item.dataKey ?? item.name ?? "");
}

function swatchColor(item: ChartPayloadItem): string | undefined {
  return item.color ?? item.fill ?? item.stroke;
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ active, payload, label, formatter, labelFormatter, hideLabel, className }, ref) => {
    const config = useChartConfig();

    if (!active || !payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "min-w-[132px] rounded-[10px] border px-3 py-[9px]",
          "border-[var(--border-strong)] bg-[var(--bg-surface)]",
          "font-mono text-[11px] shadow-[var(--shadow-toast)]",
          className
        )}
      >
        {hideLabel ? null : (
          <div className="mb-[7px] text-[10px] uppercase tracking-[0.08em] text-[var(--fg-muted)]">
            {labelFormatter && label !== undefined ? labelFormatter(label) : label}
          </div>
        )}
        {payload.map((item) => {
          const key = seriesKey(item);
          const name = config[key]?.label ?? item.name ?? key;
          const color = config[key]?.color ?? swatchColor(item);
          return (
            <div key={key} className="flex items-center gap-2 py-[2px]">
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ background: color }}
              />
              <span className="text-[var(--fg-secondary)]">{name}</span>
              <span className="ml-auto font-semibold text-[var(--fg-primary)]">
                {formatter && item.value !== undefined
                  ? formatter(item.value, key, item)
                  : item.value}
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
    const config = useChartConfig();

    const items: { key: string; name: string; color?: string }[] = payload?.length
      ? payload.map((item) => {
          const key = seriesKey(item);
          return {
            key,
            // Recharts puts the series name in `value`, not `name`.
            name: config[key]?.label ?? (item.value !== undefined ? String(item.value) : key),
            color: config[key]?.color ?? swatchColor(item),
          };
        })
      : Object.entries(config).map(([key, item]) => ({
          key,
          name: item.label,
          color: item.color,
        }));

    if (!items.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex shrink-0 flex-wrap items-center justify-center gap-4 pt-3",
          "font-mono text-[11px] text-[var(--fg-secondary)]",
          className
        )}
      >
        {items.map((item) => (
          <span key={item.key} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
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
