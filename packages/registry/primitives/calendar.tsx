"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import * as React from "react";
import {
  type ChevronProps,
  type DayButtonProps,
  DayPicker,
  type Matcher,
  type DateRange as PickerRange,
} from "react-day-picker";
import { useFormat } from "../hooks/use-format";
import { fromLocalDate, toLocalDate, today as todayIn, weekStart } from "../lib/format";
import { cn } from "../lib/utils";

/** A range of plain dates. `end` is missing while the second day is still to be picked. */
interface DateRange {
  start: string;
  end?: string;
}

interface CalendarBaseProps {
  /** Falls back to the FormatProvider's, then `en-US`. */
  locale?: string;
  /** Which day is today. Falls back to the FormatProvider's, then UTC. */
  timeZone?: string;
  /** The first and last days that can be picked, as `YYYY-MM-DD`. */
  min?: string;
  max?: string;
  /** Days that cannot be picked, such as days with no data. */
  isDisabled?: (day: string) => boolean;
  /** Something small under a day's number, such as a dot for coverage. */
  renderDay?: (day: string) => React.ReactNode;
  /** A day in the month to show. Uncontrolled by default. */
  month?: string;
  onMonthChange?: (month: string) => void;
  /** Two months side by side for a range, from 640px up. */
  numberOfMonths?: 1 | 2;
  /** Words for screen readers, for another language. */
  labels?: { previous?: string; next?: string; today?: string; selected?: string };
  autoFocus?: boolean;
  className?: string;
}

type CalendarProps = CalendarBaseProps &
  (
    | { mode?: "single"; value: string | null; onValueChange: (value: string | null) => void }
    | { mode: "range"; value: DateRange | null; onValueChange: (value: DateRange | null) => void }
  );

/** The ◆-less arrows, in the muted ink like every icon button. */
function Chevron({ orientation, className }: ChevronProps) {
  const Icon = orientation === "left" ? CaretLeftIcon : CaretRightIcon;
  return <Icon aria-hidden size={14} weight="bold" className={className} />;
}

/**
 * A month of days to pick one day or a range from. Plain `YYYY-MM-DD` strings
 * in and out, never a Date, so no time zone can move the day. Built on
 * react-day-picker with its own pieces replaced, so it looks like the rest.
 */
function Calendar(props: CalendarProps) {
  const {
    locale: ownLocale,
    timeZone: ownZone,
    min,
    max,
    isDisabled,
    renderDay,
    month,
    onMonthChange,
    numberOfMonths = 1,
    labels = {},
    autoFocus,
    className,
  } = props;
  const { locale, timeZone } = useFormat({ locale: ownLocale, timeZone: ownZone });
  const words = {
    previous: labels.previous ?? "Previous month",
    next: labels.next ?? "Next month",
    today: labels.today ?? "today",
    selected: labels.selected ?? "selected",
  };

  const fullDay = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    [locale]
  );
  const monthYear = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale]
  );
  const weekdayShort = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "narrow" }),
    [locale]
  );
  const weekdayLong = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long" }),
    [locale]
  );

  const disabled: Matcher[] = [];
  if (min) disabled.push({ before: toLocalDate(min) });
  if (max) disabled.push({ after: toLocalDate(max) });
  if (isDisabled) disabled.push((date: Date) => isDisabled(fromLocalDate(date)));

  // The day button is made once. Remade whenever renderDay changes, which an
  // inline function does on every render, all 42 days would remount each time.
  // It reads the latest renderDay from a ref instead.
  const renderDayRef = React.useRef(renderDay);
  renderDayRef.current = renderDay;
  const DayButton = React.useMemo(
    () =>
      function DayButton({ day, modifiers, children, ...buttonProps }: DayButtonProps) {
        const ref = React.useRef<HTMLButtonElement>(null);
        // react-day-picker moves the focus by marking a day focused; its own
        // button does this, so the replacement has to as well
        React.useEffect(() => {
          if (modifiers.focused) ref.current?.focus();
        }, [modifiers.focused]);
        const extra = renderDayRef.current?.(fromLocalDate(day.date));
        return (
          <button ref={ref} {...buttonProps}>
            {children}
            {extra ? (
              <span className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center">
                {extra}
              </span>
            ) : null}
          </button>
        );
      },
    []
  );

  const shared = {
    lang: locale,
    weekStartsOn: weekStart(locale),
    today: toLocalDate(todayIn(timeZone)),
    showOutsideDays: true,
    numberOfMonths,
    autoFocus,
    startMonth: min ? toLocalDate(min) : undefined,
    endMonth: max ? toLocalDate(max) : undefined,
    disabled,
    month: month ? toLocalDate(month) : undefined,
    onMonthChange: onMonthChange ? (date: Date) => onMonthChange(fromLocalDate(date)) : undefined,
    formatters: {
      formatCaption: (date: Date) => monthYear.format(date),
      formatWeekdayName: (date: Date) => weekdayShort.format(date),
      formatDay: (date: Date) => String(date.getDate()),
    },
    labels: {
      labelPrevious: () => words.previous,
      labelNext: () => words.next,
      labelGrid: (date: Date) => monthYear.format(date),
      labelWeekday: (date: Date) => weekdayLong.format(date),
      labelDayButton: (date: Date, modifiers: { today?: boolean; selected?: boolean }) =>
        [
          fullDay.format(date),
          modifiers.today ? words.today : null,
          modifiers.selected ? words.selected : null,
        ]
          .filter(Boolean)
          .join(", "),
    },
    components: { Chevron, DayButton },
    className: cn("relative w-fit font-mono text-mono-sm", className),
    classNames: CLASS_NAMES,
  } as const;

  if (props.mode === "range") {
    const selected: PickerRange | undefined = props.value
      ? {
          from: toLocalDate(props.value.start),
          to: props.value.end ? toLocalDate(props.value.end) : undefined,
        }
      : undefined;
    const onValueChange = props.onValueChange;
    return (
      <DayPicker
        {...shared}
        mode="range"
        selected={selected}
        defaultMonth={selected?.from}
        // Its own range math makes the first click a one-day range, which
        // cannot be told from a finished one. The first click starts a range,
        // the second finishes it, in order whichever comes first.
        onSelect={(_range, clicked) => {
          const day = fromLocalDate(clicked);
          const current = props.value;
          if (!current || current.end) return onValueChange({ start: day });
          const [start, end] = [current.start, day].sort();
          onValueChange({ start, end });
        }}
      />
    );
  }

  const selected = props.value ? toLocalDate(props.value) : undefined;
  const onValueChange = props.onValueChange;
  return (
    <DayPicker
      {...shared}
      mode="single"
      selected={selected}
      defaultMonth={selected}
      onSelect={(date) => onValueChange(date ? fromLocalDate(date) : null)}
    />
  );
}

/** The arrows that turn a calendar's page; the month and year grids use them too. */
const calendarNavButton = cn(
  "inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)]",
  "text-[var(--fg-muted)] hover:bg-[var(--bg-hover-soft)] hover:text-[var(--fg-primary)]",
  "transition-colors duration-[var(--motion-fast)] focus-ring",
  "disabled:pointer-events-none disabled:opacity-30"
);

// The day cell carries the range band; the button inside carries the day.
const CLASS_NAMES = {
  months: "relative flex flex-col gap-6 sm:flex-row",
  month: "flex flex-col gap-3",
  month_caption: "flex h-8 items-center justify-center px-9",
  caption_label: "text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-primary)]",
  nav: "absolute inset-x-0 top-0 z-[1] flex h-8 items-center justify-between",
  button_previous: calendarNavButton,
  button_next: calendarNavButton,
  chevron: "",
  month_grid: "border-collapse",
  weekdays: "",
  weekday: "size-9 p-0 text-center text-mono-xs font-normal uppercase text-[var(--fg-muted)]",
  week: "",
  day: "relative p-0 text-center",
  day_button: cn(
    "relative inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)]",
    "tabular-nums text-[var(--fg-secondary)] outline-none",
    "transition-colors duration-[var(--motion-fast)]",
    "hover:bg-[var(--bg-hover-strong)] hover:text-[var(--fg-primary)] focus-ring",
    "disabled:pointer-events-none"
  ),
  today:
    "[&>button]:font-semibold [&>button]:text-[var(--fg-brand-text)] [&>button]:shadow-[inset_0_0_0_1px_var(--border-brand)]",
  selected:
    "[&>button]:bg-[var(--fg-brand)] [&>button]:text-[var(--fg-on-brand)] [&>button]:hover:bg-[var(--fg-brand-hover)] [&>button]:hover:text-[var(--fg-on-brand)]",
  range_start: "rounded-l-[var(--radius-sm)] bg-[var(--bg-surface-brand)]",
  range_end: "rounded-r-[var(--radius-sm)] bg-[var(--bg-surface-brand)]",
  range_middle:
    "bg-[var(--bg-surface-brand)] [&>button]:rounded-none [&>button]:bg-transparent [&>button]:text-[var(--fg-primary)] [&>button]:hover:bg-[var(--bg-hover-strong)] [&>button]:hover:text-[var(--fg-primary)]",
  outside: "[&>button]:text-[var(--fg-muted)]",
  disabled:
    "[&>button]:text-[var(--fg-muted)] [&>button]:line-through [&>button]:decoration-[var(--border-strong)]",
  hidden: "invisible",
  focused: "",
};

export { Calendar, calendarNavButton };
export type { CalendarProps, DateRange };
