"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Skeleton } from "../feedback/skeleton";
import { useFormat } from "../hooks/use-format";
import { addDays, compareDates, formatDate, weekStart } from "../lib/format";
import { OVERLAY_SURFACE } from "../lib/overlay";
import { cn } from "../lib/utils";

type Level = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  /** `YYYY-MM-DD`. */
  date: string;
  /** 0 is none, 4 the most. Null is no data, which is not the same as none. */
  level: Level | null;
  /** The day in words, for its label and tooltip: "3 workouts, 42 min". */
  state?: string;
}

const LABELS = {
  levels: ["No activity", "Low", "Medium", "High", "Highest"] as readonly string[],
  noData: "No data",
  less: "Less",
  more: "More",
};

// the brand mixed into the card, one step per level; 0 is an empty well
const LEVEL = [
  "bg-[var(--bg-hover-strong)]",
  "bg-[color-mix(in_srgb,var(--fg-brand)_28%,var(--bg-card))]",
  "bg-[color-mix(in_srgb,var(--fg-brand)_52%,var(--bg-card))]",
  "bg-[color-mix(in_srgb,var(--fg-brand)_76%,var(--bg-card))]",
  "bg-[var(--fg-brand)]",
] as const;
const NO_DATA = "border border-dashed border-[var(--border-subtle)] bg-transparent";

const CELL = 12;
const GAP = 3;

/** Sunday is 0, as Date.getUTCDay has it. */
function dayOfWeek(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

interface ContributionGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  days: readonly ContributionDay[];
  /** What the grid shows, as its name: "Workouts in the last year". */
  label: string;
  /** The days to draw. Defaults to the first and the last day given. */
  range?: { start: string; end: string };
  /** The tooltip's content. Defaults to the date and the day's state. */
  renderTooltip?: (day: ContributionDay) => React.ReactNode;
  /** A day was chosen, by click, Enter or Space. */
  onSelect?: (date: string) => void;
  selected?: string;
  /** The Less to More key under the grid. */
  legend?: boolean;
  loading?: boolean;
  locale?: string;
  labels?: Partial<typeof LABELS>;
}

/**
 * A year of days as a grid of weeks: training, commits, spending. Levels mix
 * the brand into the card, and a day with no data is drawn apart from a day
 * with none. One Tab stop, the arrow keys walk the days, and every cell says
 * its day in words. On a phone it scrolls sideways at a size you can read,
 * starting at the latest weeks.
 */
const ContributionGrid = React.forwardRef<HTMLDivElement, ContributionGridProps>(
  (
    {
      days,
      label,
      range: rangeProp,
      renderTooltip,
      onSelect,
      selected,
      legend = true,
      loading = false,
      locale: ownLocale,
      labels: labelsProp,
      className,
      ...props
    },
    ref
  ) => {
    const labels = { ...LABELS, ...labelsProp };
    const { locale } = useFormat({ locale: ownLocale });
    const byDate = React.useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);

    const sorted = React.useMemo(() => [...days].map((d) => d.date).sort(compareDates), [days]);
    const range = rangeProp ?? { start: sorted[0] ?? "", end: sorted[sorted.length - 1] ?? "" };

    // columns of seven, from the week the range starts in
    const weeks = React.useMemo(() => {
      if (!range.start || !range.end) return [] as string[][];
      const first = (7 + dayOfWeek(range.start) - weekStart(locale)) % 7;
      let cursor = addDays(range.start, -first);
      const columns: string[][] = [];
      while (compareDates(cursor, range.end) <= 0) {
        const column: string[] = [];
        for (let i = 0; i < 7; i++) {
          column.push(cursor);
          cursor = addDays(cursor, 1);
        }
        columns.push(column);
      }
      return columns;
    }, [range.start, range.end, locale]);

    const inRange = (date: string) =>
      compareDates(date, range.start) >= 0 && compareDates(date, range.end) <= 0;

    const [focusDate, setFocusDate] = React.useState<string>(selected ?? range.end);
    const [tip, setTip] = React.useState<{
      date: string;
      x: number;
      top: number;
      bottom: number;
    } | null>(null);
    const scroller = React.useRef<HTMLDivElement>(null);
    const tipRef = React.useRef<HTMLDivElement>(null);
    const [tipLeft, setTipLeft] = React.useState(0);

    // open on the latest weeks, which is where anyone looks first
    // biome-ignore lint/correctness/useExhaustiveDependencies: a new range is the trigger to go back to its end
    React.useEffect(() => {
      const box = scroller.current;
      if (box) box.scrollLeft = box.scrollWidth;
    }, [weeks.length]);

    // kept inside the viewport: centered on the cell, pushed in at the edges
    React.useLayoutEffect(() => {
      const el = tipRef.current;
      if (!tip || !el) return;
      const half = el.offsetWidth / 2;
      setTipLeft(Math.min(Math.max(tip.x, half + 8), window.innerWidth - half - 8));
    }, [tip]);

    const show = (date: string, target: HTMLElement) => {
      const r = target.getBoundingClientRect();
      setTip({ date, x: r.left + r.width / 2, top: r.top, bottom: r.bottom });
    };

    const describe = (date: string) => {
      const day = byDate.get(date);
      const words =
        day?.state ?? (day && day.level !== null ? labels.levels[day.level] : labels.noData);
      return `${formatDate(date, { locale })}: ${words}`;
    };

    const move = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step: Record<string, number> = {
        ArrowLeft: -7,
        ArrowRight: 7,
        ArrowUp: -1,
        ArrowDown: 1,
      };
      let next: string | null = null;
      if (event.key in step) next = addDays(focusDate, step[event.key]);
      if (event.key === "Home") next = range.start;
      if (event.key === "End") next = range.end;
      if (!next) return;
      event.preventDefault();
      if (!inRange(next)) return;
      setFocusDate(next);
      const cell = event.currentTarget.querySelector<HTMLElement>(`[data-date="${next}"]`);
      cell?.focus();
      if (cell) show(next, cell);
    };

    const width = weeks.length * (CELL + GAP) - GAP;
    const tipDay = tip ? (byDate.get(tip.date) ?? { date: tip.date, level: null }) : null;
    const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });

    if (loading) {
      return (
        <div ref={ref} aria-busy className={cn("flex flex-col gap-2", className)} {...props}>
          <Skeleton className="h-3 w-40" />
          <Skeleton className="w-full" style={{ height: 7 * (CELL + GAP) - GAP }} />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("flex min-w-0 flex-col gap-2", className)} {...props}>
        <div ref={scroller} className="overflow-x-auto overscroll-x-contain pb-1">
          <div className="flex gap-2" style={{ width: width + 32 }}>
            {/* weekday names on alternate rows, like a calendar's margin */}
            <div
              aria-hidden
              className="grid shrink-0 pt-[18px] font-mono text-mono-xs text-[var(--fg-muted)]"
              style={{ gridTemplateRows: `repeat(7, ${CELL}px)`, rowGap: GAP, width: 24 }}
            >
              {(weeks[0] ?? []).map((date, i) => (
                <span key={date} className="leading-[12px]">
                  {i % 2 === 1 ? weekday.format(new Date(`${date}T00:00:00Z`)).slice(0, 3) : ""}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <div
                aria-hidden
                className="grid h-3 font-mono text-mono-xs text-[var(--fg-muted)]"
                style={{
                  gridTemplateColumns: `repeat(${weeks.length}, ${CELL}px)`,
                  columnGap: GAP,
                }}
              >
                {weeks.map((column, i) => {
                  const first = column.find((date) => date.endsWith("-01") && inRange(date));
                  return (
                    <span key={column[0]} className="overflow-visible whitespace-nowrap leading-3">
                      {first || i === 0
                        ? month.format(new Date(`${first ?? column[6]}T00:00:00Z`))
                        : ""}
                    </span>
                  );
                })}
              </div>
              {/* biome-ignore lint/a11y/useSemanticElements: a grid of day buttons, one Tab stop, walked by arrow keys */}
              <div
                role="group"
                aria-label={label}
                onKeyDown={move}
                onMouseLeave={() => setTip(null)}
                className="grid grid-flow-col"
                style={{
                  gridTemplateRows: `repeat(7, ${CELL}px)`,
                  gridAutoColumns: `${CELL}px`,
                  gap: GAP,
                }}
              >
                {weeks.flat().map((date) => {
                  if (!inRange(date)) return <span key={date} aria-hidden />;
                  const day = byDate.get(date);
                  const level = day?.level ?? null;
                  return (
                    <button
                      key={date}
                      type="button"
                      data-date={date}
                      tabIndex={date === focusDate ? 0 : -1}
                      aria-label={describe(date)}
                      aria-pressed={onSelect ? date === selected : undefined}
                      onClick={() => {
                        setFocusDate(date);
                        onSelect?.(date);
                      }}
                      onFocus={(event) => show(date, event.currentTarget)}
                      onBlur={() => setTip(null)}
                      onMouseEnter={(event) => show(date, event.currentTarget)}
                      className={cn(
                        "size-3 cursor-pointer rounded-[3px] outline-none",
                        "transition-[box-shadow,scale] duration-[var(--motion-fast)] hover:scale-125",
                        level === null ? NO_DATA : LEVEL[level],
                        "focus-visible:shadow-[0_0_0_2px_var(--bg-canvas),0_0_0_3.5px_var(--fg-brand)]",
                        date === selected && "shadow-[0_0_0_1.5px_var(--fg-primary)]"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {legend ? (
          <div
            aria-hidden
            className="flex items-center justify-end gap-1.5 font-mono text-mono-xs text-[var(--fg-muted)]"
          >
            {labels.less}
            {LEVEL.map((level) => (
              <span key={level} className={cn("size-3 rounded-[3px]", level)} />
            ))}
            {labels.more}
          </div>
        ) : null}
        {tip && tipDay
          ? // in the body: a fixed box inside a moved tile (a Reveal) would move with it
            createPortal(
              <div
                ref={tipRef}
                role="tooltip"
                className={cn(
                  OVERLAY_SURFACE,
                  "pointer-events-none fixed z-50 -translate-x-1/2 rounded-[var(--radius-sm)] px-2.5 py-1.5",
                  "whitespace-nowrap font-mono text-mono-sm text-[var(--fg-primary)]",
                  tip.top < 48 ? "translate-y-2" : "-translate-y-full"
                )}
                style={{ left: tipLeft || tip.x, top: tip.top < 48 ? tip.bottom : tip.top - 8 }}
              >
                {renderTooltip ? renderTooltip(tipDay) : describe(tip.date)}
              </div>,
              document.body
            )
          : null}
      </div>
    );
  }
);
ContributionGrid.displayName = "ContributionGrid";

export { ContributionGrid };
export type { ContributionGridProps };
