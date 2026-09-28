"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import * as React from "react";
import { useFormat } from "../hooks/use-format";
import { addDays, addMonths, today as todayIn } from "../lib/format";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { DatePicker, type Granularity } from "./date-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface DateNavigatorProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  /** The group's name, such as "day": it holds three buttons and a picker. */
  "aria-label": string;
  /** `YYYY-MM-DD`, `YYYY-MM` or `YYYY`, by granularity. */
  value: string;
  onValueChange: (value: string) => void;
  granularity?: Granularity;
  /** The first and last days there is anything to show, as `YYYY-MM-DD`. */
  min?: string;
  max?: string;
  locale?: string;
  /** Which day is today. Falls back to the FormatProvider's, then UTC. */
  timeZone?: string;
  /** Words, for another language. The limits say why a step is not possible. */
  labels?: {
    previous?: string;
    next?: string;
    today?: string;
    atStart?: string;
    atEnd?: string;
  };
}

const UNIT = { day: "day", month: "month", year: "year" } as const;

function step(value: string, granularity: Granularity, by: number): string {
  if (granularity === "day") return addDays(value, by);
  if (granularity === "month") return addMonths(`${value}-01`, by).slice(0, 7);
  return String(Number(value) + by);
}

function truncate(day: string, granularity: Granularity): string {
  return granularity === "day" ? day : granularity === "month" ? day.slice(0, 7) : day.slice(0, 4);
}

/**
 * Previous, the period, next and today: to walk through days, months or
 * years. The period opens a DatePicker. At a limit the arrow stays focusable
 * and says why it goes no further. Put the value in the URL so a link and the
 * back button work; that part is the app's.
 */
const DateNavigator = React.forwardRef<HTMLFieldSetElement, DateNavigatorProps>(
  (
    {
      value,
      onValueChange,
      granularity = "day",
      min,
      max,
      locale: ownLocale,
      timeZone: ownZone,
      labels = {},
      className,
      ...props
    },
    ref
  ) => {
    const { locale, timeZone } = useFormat({ locale: ownLocale, timeZone: ownZone });
    const unit = UNIT[granularity];
    const words = {
      previous: labels.previous ?? `Previous ${unit}`,
      next: labels.next ?? `Next ${unit}`,
      today: labels.today ?? (granularity === "day" ? "Today" : `This ${unit}`),
      atStart: labels.atStart ?? `Nothing before this ${unit}`,
      atEnd: labels.atEnd ?? `Nothing after this ${unit}`,
    };
    const lower = min ? truncate(min, granularity) : undefined;
    const upper = max ? truncate(max, granularity) : undefined;
    const previous = step(value, granularity, -1);
    const next = step(value, granularity, 1);
    const current = truncate(todayIn(timeZone), granularity);
    const atStart = lower !== undefined && previous < lower;
    const atEnd = upper !== undefined && next > upper;
    const currentReachable =
      (lower === undefined || current >= lower) && (upper === undefined || current <= upper);

    return (
      <TooltipProvider delayDuration={300}>
        <fieldset
          ref={ref}
          className={cn("m-0 inline-flex min-w-0 items-center gap-1 border-0 p-0", className)}
          {...props}
        >
          <StepButton
            label={words.previous}
            reason={atStart ? words.atStart : null}
            onClick={() => onValueChange(previous)}
          >
            <CaretLeftIcon aria-hidden size={14} weight="bold" />
          </StepButton>
          <DatePicker
            appearance="inline"
            granularity={granularity}
            value={value}
            onValueChange={(picked) => picked && onValueChange(picked)}
            min={min}
            max={max}
            locale={locale}
            timeZone={timeZone}
          />
          <StepButton
            label={words.next}
            reason={atEnd ? words.atEnd : null}
            onClick={() => onValueChange(next)}
          >
            <CaretRightIcon aria-hidden size={14} weight="bold" />
          </StepButton>
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
            aria-disabled={value === current || !currentReachable || undefined}
            onClick={() => {
              if (value !== current && currentReachable) onValueChange(current);
            }}
          >
            {words.today}
          </Button>
        </fieldset>
      </TooltipProvider>
    );
  }
);
DateNavigator.displayName = "DateNavigator";

/**
 * An arrow that stays focusable at a limit, instead of vanishing from the tab
 * order, so its Tooltip can say why it goes no further.
 */
function StepButton({
  label,
  reason,
  onClick,
  children,
}: {
  label: string;
  reason: string | null;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const reasonId = React.useId();
  const button = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-disabled={reason ? true : undefined}
      aria-describedby={reason ? reasonId : undefined}
      onClick={() => {
        if (!reason) onClick();
      }}
      className="aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
    >
      {children}
    </Button>
  );
  if (!reason) return button;
  return (
    <>
      {/* read with the button everywhere; the Tooltip only shows while hovered or focused */}
      <span id={reasonId} className="sr-only">
        {reason}
      </span>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{reason}</TooltipContent>
      </Tooltip>
    </>
  );
}

export { DateNavigator };
export type { DateNavigatorProps };
