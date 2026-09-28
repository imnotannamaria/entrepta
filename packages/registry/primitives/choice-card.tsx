import * as React from "react";
import { Diamond } from "../content/diamond";
import type { IconProp } from "../lib/icon";
import { cn } from "../lib/utils";
import { cardVariants } from "./card";
import { fieldLabelClass } from "./field";
import { IconTile } from "./icon-tile";

export interface ChoiceOption {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: IconProp;
  /** Something small beside the title: "recommended", a price. */
  badge?: React.ReactNode;
  /** Off, and why when it is text: "Needs the Pro plan". */
  disabled?: boolean | string;
}

interface ChoiceCardBaseProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange" | "defaultValue"> {
  options: readonly ChoiceOption[];
  /** The question, as the group's legend. */
  legend: React.ReactNode;
  /** Keep the legend for screen readers only, when a heading above already asks. */
  hideLegend?: boolean;
  /** Columns from 640px up. One below it. */
  columns?: 1 | 2 | 3;
  /** The inputs' name. One is generated if left out. */
  name?: string;
}

type ChoiceCardProps = ChoiceCardBaseProps &
  (
    | {
        type?: "radio";
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
      }
    | {
        type: "checkbox";
        value?: readonly string[];
        defaultValue?: readonly string[];
        onValueChange?: (value: string[]) => void;
      }
  );

const COLUMNS = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" } as const;

/**
 * A choice that needs more than a word: a plan, a way to import, where to
 * start. Each card is the label of a native radio or checkbox, so the arrow
 * keys, the Tab stop and forms come from the browser. The chosen card takes
 * the strong brand border and a check that draws itself in.
 */
const ChoiceCard = React.forwardRef<HTMLFieldSetElement, ChoiceCardProps>((props, ref) => {
  const {
    options,
    legend,
    hideLegend = false,
    columns = 2,
    name: nameProp,
    type = "radio",
    value,
    defaultValue,
    onValueChange,
    className,
    ...rest
  } = props;
  const generated = React.useId();
  const name = nameProp ?? generated;

  const isChecked = (option: string, from: string | readonly string[] | undefined) =>
    Array.isArray(from) ? from.includes(option) : from === option;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onValueChange) return;
    if (type === "radio") {
      (onValueChange as (value: string) => void)(event.target.value);
      return;
    }
    // the checked boxes are the value, read from the DOM, so it works uncontrolled too
    const group = event.target.closest("fieldset");
    const checked = [...(group?.querySelectorAll<HTMLInputElement>("input:checked") ?? [])];
    (onValueChange as (value: string[]) => void)(checked.map((input) => input.value));
  };

  return (
    <fieldset ref={ref} className={cn("m-0 min-w-0 border-0 p-0", className)} {...rest}>
      <legend className={cn(hideLegend ? "sr-only" : cn(fieldLabelClass, "mb-3 p-0"))}>
        {hideLegend ? null : <Diamond />}
        {legend}
      </legend>
      <div className={cn("grid grid-cols-1 gap-3", COLUMNS[columns])}>
        {options.map((option) => {
          const reason = typeof option.disabled === "string" ? option.disabled : null;
          const reasonId = reason ? `${name}-${option.value}-reason` : undefined;
          return (
            <label
              key={option.value}
              className={cn(
                cardVariants({ size: "sm" }),
                "group/choice cursor-pointer flex-row items-start gap-3 p-4",
                "has-[:checked]:border-[var(--border-brand-strong)] has-[:checked]:bg-[var(--bg-card-hover)]",
                "has-[:focus-visible]:shadow-[0_0_0_2px_var(--bg-canvas),0_0_0_4px_var(--fg-brand)]",
                "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:border-[var(--border-subtle)]"
              )}
            >
              <input
                type={type}
                name={name}
                value={option.value}
                disabled={Boolean(option.disabled)}
                aria-describedby={reasonId}
                className="sr-only"
                // no handler without onValueChange, so a server page can render it
                onChange={onValueChange ? onChange : undefined}
                {...(value !== undefined
                  ? { checked: isChecked(option.value, value) }
                  : { defaultChecked: isChecked(option.value, defaultValue) })}
              />
              {option.icon ? <IconTile icon={option.icon} className="mt-0.5" /> : null}
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-mono text-mono-md text-[var(--fg-primary)]">
                    {option.title}
                  </span>
                  {option.badge}
                </span>
                {option.description ? (
                  <span className="font-sans text-body-md text-[var(--fg-secondary)]">
                    {option.description}
                  </span>
                ) : null}
                {reason ? (
                  <span id={reasonId} className="font-mono text-mono-xs text-[var(--fg-muted)]">
                    {reason}
                  </span>
                ) : null}
              </span>
              <Indicator round={type === "radio"} />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
});
ChoiceCard.displayName = "ChoiceCard";

/** The box or the dot in the corner, and a check that draws itself in, like Checkbox's. */
function Indicator({ round }: { round: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative mt-0.5 grid size-5 shrink-0 place-items-center border",
        round ? "rounded-full" : "rounded-[5px]",
        "border-[var(--border-strong)] bg-[var(--bg-field)]",
        "transition-[background-color,border-color] duration-[var(--motion-base)] ease-[var(--ease-out)]",
        "group-hover/choice:border-[var(--fg-muted)]",
        "group-has-[:checked]/choice:border-[var(--fg-brand)] group-has-[:checked]/choice:bg-[var(--fg-brand)]",
        "group-has-[:checked]/choice:animate-[check-pop_var(--motion-slow)_var(--ease-out)]"
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        className={cn(
          "size-4 text-[var(--fg-on-brand)]",
          "[stroke-dasharray:14] [stroke-dashoffset:14] opacity-0",
          "transition-[stroke-dashoffset,opacity] duration-[var(--motion-fast)] ease-out",
          "group-has-[:checked]/choice:[stroke-dashoffset:0] group-has-[:checked]/choice:opacity-100",
          "group-has-[:checked]/choice:delay-[60ms] group-has-[:checked]/choice:duration-[var(--motion-slow)]"
        )}
      >
        <path
          d="M4 8.5l2.5 2.5L12 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export { ChoiceCard };
export type { ChoiceCardProps };
