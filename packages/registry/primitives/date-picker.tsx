"use client";

import {
  CalendarBlankIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import * as React from "react";
import { useFormat } from "../hooks/use-format";
import { formatDate, formatDateRange, formatMonth, today as todayIn } from "../lib/format";
import { MENU_LABEL, MENU_ROW } from "../lib/overlay";
import { cn } from "../lib/utils";
import { Calendar, type DateRange } from "./calendar";
import { inputWrapperVariants } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type Granularity = "day" | "month" | "year";

interface DatePreset {
  label: string;
  value: DateRange;
}

interface DatePickerBaseProps {
  /** Falls back to the FormatProvider's, then `en-US`. */
  locale?: string;
  /** Which day is today. Falls back to the FormatProvider's, then UTC. */
  timeZone?: string;
  /** The first and last days that can be picked, as `YYYY-MM-DD`. */
  min?: string;
  max?: string;
  isDisabled?: (day: string) => boolean;
  renderDay?: (day: string) => React.ReactNode;
  placeholder?: string;
  /** `inline` drops the field's frame, for a date that sits in a line of text or a toolbar. */
  appearance?: "field" | "inline";
  size?: "sm" | "md" | "lg";
  state?: "default" | "error";
  disabled?: boolean;
  className?: string;
  /** Words for screen readers, for another language. */
  labels?: {
    previous?: string;
    next?: string;
    today?: string;
    selected?: string;
    presets?: string;
  };
  // what a Field wires
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
}

type DatePickerProps = DatePickerBaseProps &
  (
    | {
        mode?: "single";
        /** `day` holds `YYYY-MM-DD`, `month` holds `YYYY-MM`, `year` holds `YYYY`. */
        granularity?: Granularity;
        value: string | null;
        onValueChange: (value: string | null) => void;
      }
    | {
        mode: "range";
        value: DateRange | null;
        onValueChange: (value: DateRange | null) => void;
        /** Ranges one click away, such as this month and last month. */
        presets?: readonly DatePreset[];
      }
  );

const triggerVariants = cva(
  "justify-between gap-2 text-left font-mono text-mono-md outline-none disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      appearance: {
        field: [
          "focus-visible:border-[var(--fg-brand)] focus-visible:shadow-[0_0_0_3px_var(--bg-surface-brand)]",
          "aria-[invalid=true]:border-[var(--status-error)]",
        ],
        inline: [
          "inline-flex h-8 w-auto items-center rounded-[var(--radius-sm)] px-2",
          "text-[var(--fg-primary)] hover:bg-[var(--bg-hover-soft)] focus-ring",
        ],
      },
    },
    defaultVariants: { appearance: "field" },
  }
);

/**
 * A date picked from a calendar in a popover: one day, a range, a month or a
 * year. Plain strings in and out, never a Date. Inside a Field it takes the
 * label and the error.
 */
const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>((props, ref) => {
  const {
    locale: ownLocale,
    timeZone: ownZone,
    min,
    max,
    isDisabled,
    renderDay,
    placeholder = "Pick a date…",
    appearance = "field",
    size,
    state,
    disabled,
    className,
    labels = {},
    id,
    "aria-label": ariaLabel,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
  } = props;
  const { locale, timeZone } = useFormat({ locale: ownLocale, timeZone: ownZone });
  const [open, setOpen] = React.useState(false);
  const granularity: Granularity = props.mode === "range" ? "day" : (props.granularity ?? "day");

  const text = (() => {
    if (props.mode === "range") {
      const range = props.value;
      if (!range) return null;
      if (!range.end) return `${formatDate(range.start, { locale })} …`;
      return formatDateRange(range.start, range.end, { locale });
    }
    const value = props.value;
    if (!value) return null;
    if (granularity === "month") return formatMonth(value, { locale });
    if (granularity === "year") return value;
    return formatDate(value, { locale });
  })();

  const calendarProps = {
    locale,
    timeZone,
    min,
    max,
    isDisabled,
    renderDay,
    labels,
    autoFocus: true,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          type="button"
          id={id}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          disabled={disabled}
          className={cn(
            appearance === "field" && inputWrapperVariants({ size, state }),
            triggerVariants({ appearance }),
            className
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {appearance === "field" ? (
              <CalendarBlankIcon
                aria-hidden
                size={14}
                className="shrink-0 text-[var(--fg-muted)]"
              />
            ) : null}
            <span
              className={cn(
                "truncate tabular-nums",
                text ? "text-[var(--fg-primary)]" : "text-[var(--fg-muted)]"
              )}
            >
              {text ?? placeholder}
            </span>
          </span>
          {appearance === "inline" ? (
            <CaretDownIcon aria-hidden size={12} className="shrink-0 text-[var(--fg-muted)]" />
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent aria-label={ariaLabel ?? placeholder} className="w-auto">
        {props.mode === "range" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            {props.presets?.length ? (
              <div className="flex flex-col sm:w-40 sm:border-r sm:border-[var(--border-subtle)] sm:pr-3">
                <span className={MENU_LABEL}>{labels.presets ?? "quick ranges"}</span>
                {props.presets.map((preset) => {
                  const on =
                    props.value?.start === preset.value.start &&
                    props.value?.end === preset.value.end;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        props.onValueChange(preset.value);
                        setOpen(false);
                      }}
                      className={cn(
                        MENU_ROW,
                        "text-left hover:bg-[var(--bg-surface-brand)] hover:text-[var(--fg-primary)]",
                        "focus-visible:bg-[var(--bg-surface-brand)] focus-visible:text-[var(--fg-primary)]",
                        on && "text-[var(--fg-primary)]"
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
            <Calendar
              {...calendarProps}
              mode="range"
              numberOfMonths={2}
              value={props.value}
              onValueChange={(range) => {
                props.onValueChange(range);
                if (range?.end) setOpen(false);
              }}
            />
          </div>
        ) : granularity === "day" ? (
          <Calendar
            {...calendarProps}
            mode="single"
            value={props.value}
            onValueChange={(day) => {
              props.onValueChange(day);
              if (day) setOpen(false);
            }}
          />
        ) : (
          <PeriodGrid
            granularity={granularity}
            value={props.value}
            locale={locale}
            current={todayIn(timeZone)}
            min={min}
            max={max}
            labels={labels}
            onPick={(period) => {
              props.onValueChange(period);
              setOpen(false);
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
});
DatePicker.displayName = "DatePicker";

/**
 * Twelve months of one year, or twelve years, as a grid the arrow keys move
 * through. The page turns with the arrows at the top.
 */
function PeriodGrid({
  granularity,
  value,
  locale,
  current,
  min,
  max,
  labels,
  onPick,
}: {
  granularity: "month" | "year";
  value: string | null;
  locale: string;
  current: string;
  min?: string;
  max?: string;
  labels: DatePickerBaseProps["labels"];
  onPick: (period: string) => void;
}) {
  const monthly = granularity === "month";
  const key = (day: string) => (monthly ? day.slice(0, 7) : day.slice(0, 4));
  const startYear = Number((value ?? current).slice(0, 4));
  const [page, setPage] = React.useState(monthly ? startYear : startYear - (startYear % 12));
  const buttons = React.useRef<(HTMLButtonElement | null)[]>([]);

  const cells = Array.from({ length: 12 }, (_, i) => {
    if (monthly) {
      const period = `${page}-${String(i + 1).padStart(2, "0")}`;
      return {
        period,
        short: new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(
          new Date(Date.UTC(page, i, 1))
        ),
        long: formatMonth(period, { locale }),
      };
    }
    const period = String(page + i);
    return { period, short: period, long: period };
  });
  const selectedPeriod = value === null ? null : key(value.length === 4 ? value : `${value}-01`);
  // the one cell Tab lands on: the chosen period, else the current one, else the first
  const indexOf = (period: string | null) => cells.findIndex((cell) => cell.period === period);
  const tabStop = [indexOf(selectedPeriod), indexOf(key(current)), 0].find((i) => i >= 0) ?? 0;
  const outside = (period: string) =>
    (min !== undefined && period < key(min)) || (max !== undefined && period > key(max));

  const move = (from: number, by: number) => {
    const target = buttons.current[Math.min(11, Math.max(0, from + by))];
    target?.focus();
  };

  return (
    <div className="flex w-[252px] flex-col gap-3">
      <div className="flex h-8 items-center justify-between">
        <button
          type="button"
          aria-label={labels?.previous ?? (monthly ? "Previous year" : "Previous years")}
          onClick={() => setPage((p) => p - (monthly ? 1 : 12))}
          className={PAGE_BUTTON}
        >
          <CaretLeftIcon aria-hidden size={14} weight="bold" />
        </button>
        <span
          aria-live="polite"
          className="text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-primary)]"
        >
          {monthly ? page : `${page} – ${page + 11}`}
        </span>
        <button
          type="button"
          aria-label={labels?.next ?? (monthly ? "Next year" : "Next years")}
          onClick={() => setPage((p) => p + (monthly ? 1 : 12))}
          className={PAGE_BUTTON}
        >
          <CaretRightIcon aria-hidden size={14} weight="bold" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {cells.map((cell, index) => {
          const selected = selectedPeriod === cell.period;
          const isCurrent = key(current) === cell.period;
          return (
            <button
              key={cell.period}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              type="button"
              aria-label={[cell.long, isCurrent ? (labels?.today ?? "current") : null]
                .filter(Boolean)
                .join(", ")}
              aria-pressed={selected}
              disabled={outside(cell.period)}
              tabIndex={index === tabStop ? 0 : -1}
              onClick={() => onPick(cell.period)}
              onKeyDown={(event) => {
                const by = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 }[event.key];
                if (by === undefined) return;
                event.preventDefault();
                move(index, by);
              }}
              className={cn(
                "h-9 rounded-[var(--radius-sm)] font-mono text-mono-sm capitalize tabular-nums",
                "text-[var(--fg-secondary)] transition-colors duration-[var(--motion-fast)]",
                "hover:bg-[var(--bg-hover-strong)] hover:text-[var(--fg-primary)] focus-ring",
                "disabled:pointer-events-none disabled:text-[var(--fg-muted)] disabled:line-through",
                isCurrent &&
                  "font-semibold text-[var(--fg-brand-text)] shadow-[inset_0_0_0_1px_var(--border-brand)]",
                selected &&
                  "bg-[var(--fg-brand)] text-[var(--fg-on-brand)] hover:bg-[var(--fg-brand-hover)] hover:text-[var(--fg-on-brand)]"
              )}
            >
              {cell.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const PAGE_BUTTON = cn(
  "inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)]",
  "text-[var(--fg-muted)] hover:bg-[var(--bg-hover-soft)] hover:text-[var(--fg-primary)] focus-ring"
);

export { DatePicker };
export type { DatePickerProps, DatePreset, Granularity };
