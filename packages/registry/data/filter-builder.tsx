"use client";

import { ArrowLeftIcon, CheckIcon, PlusIcon } from "@phosphor-icons/react";
import * as React from "react";
import { useFormat } from "../hooks/use-format";
import {
  FILTER_OPS,
  type Filter,
  type FilterField,
  type FilterOp,
  type FilterValue,
  MAX_FILTERS,
  MAX_TEXT,
  isValidFilter,
} from "../lib/filters";
import { formatDate, formatMoney } from "../lib/format";
import { type IconProp, IconSlot } from "../lib/icon";
import { MENU_LABEL, MENU_ROW } from "../lib/overlay";
import { cn } from "../lib/utils";
import { Button } from "../primitives/button";
import { Calendar } from "../primitives/calendar";
import { Combobox } from "../primitives/combobox";
import { FilterPill } from "../primitives/filter-pill";
import { Input } from "../primitives/input";
import { MoneyInput } from "../primitives/money-input";
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover";
import { SegmentedControl } from "../primitives/segmented-control";

const LABELS = {
  group: "Filters",
  add: "Filter",
  chooseField: "Filter by",
  back: "Back",
  apply: "Apply",
  clear: "Clear all",
  operator: "Condition",
  value: "Value",
  search: "Search…",
  yes: "yes",
  no: "no",
  ops: {
    is: "is",
    "is-not": "is not",
    contains: "contains",
    gt: "over",
    lt: "under",
    before: "before",
    after: "after",
  } satisfies Record<FilterOp, string>,
  /** "is" reads as "on" for a day. */
  dateIs: "on",
};

type Labels = typeof LABELS;

/** A field, with an icon for the list of fields. */
type FilterBuilderField = FilterField & { icon?: IconProp };

interface FilterBuilderProps {
  fields: readonly FilterBuilderField[];
  value: readonly Filter[];
  onValueChange: (value: Filter[]) => void;
  labels?: Partial<Omit<Labels, "ops">> & { ops?: Partial<Labels["ops"]> };
  className?: string;
}

/** Up to this many options show as rows; past it, a Combobox to search them. */
const ROWS_UP_TO = 7;

function opLabel(field: FilterField, op: FilterOp, labels: Labels) {
  return field.type === "date" && op === "is" ? labels.dateIs : labels.ops[op];
}

/**
 * Questions about a list, such as "category is Groceries" and "amount over
 * $50", each one an applied FilterPill. "+ Filter" asks for the field, then
 * the condition and the value, with the control that fits the field's type.
 * Keep the filters in the URL with `serializeFilters` and `parseFilters`.
 */
function FilterBuilder({
  fields,
  value,
  onValueChange,
  labels: labelsProp,
  className,
}: FilterBuilderProps) {
  const labels: Labels = {
    ...LABELS,
    ...labelsProp,
    ops: { ...LABELS.ops, ...labelsProp?.ops },
  };
  const format = useFormat();

  const describe = (filter: Filter, field: FilterBuilderField) => {
    const { value: raw } = filter;
    let shown: string;
    if (field.type === "enum") {
      shown = field.options?.find((option) => option.value === raw)?.label ?? String(raw);
    } else if (field.type === "amount" && typeof raw === "number") {
      const currency = field.currency ?? format.currency;
      shown = currency ? formatMoney(raw, { currency, locale: format.locale }) : String(raw);
    } else if (field.type === "date" && typeof raw === "string") {
      shown = formatDate(raw, { locale: format.locale });
    } else if (field.type === "boolean") {
      shown = raw ? labels.yes : labels.no;
    } else {
      shown = `“${raw}”`;
    }
    return `${field.label} ${opLabel(field, filter.op, labels)} ${shown}`;
  };

  const replace = (index: number, next: Filter) =>
    onValueChange(value.map((filter, at) => (at === index ? next : filter)));
  const remove = (index: number) => onValueChange(value.filter((_, at) => at !== index));

  return (
    <fieldset
      aria-label={labels.group}
      className={cn("m-0 flex min-w-0 flex-wrap items-center gap-2 border-0 p-0", className)}
    >
      {value.map((filter, index) => {
        const field = fields.find((candidate) => candidate.id === filter.field);
        if (!field || !isValidFilter(filter, fields)) return null;
        return (
          <AppliedFilter
            key={`${filter.field}:${filter.op}:${String(filter.value)}`}
            label={describe(filter, field)}
            field={field}
            filter={filter}
            labels={labels}
            onApply={(next) => replace(index, next)}
            onRemove={() => remove(index)}
          />
        );
      })}
      {value.length < MAX_FILTERS ? (
        <AddFilter
          fields={fields}
          labels={labels}
          onApply={(next) => onValueChange([...value, next])}
        />
      ) : null}
      {value.length > 1 ? (
        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => onValueChange([])}>
          {labels.clear}
        </Button>
      ) : null}
    </fieldset>
  );
}

function AppliedFilter({
  label,
  field,
  filter,
  labels,
  onApply,
  onRemove,
}: {
  label: string;
  field: FilterBuilderField;
  filter: Filter;
  labels: Labels;
  onApply: (filter: Filter) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* the trigger hands the pill its onClick, which makes the label the edit button */}
        <FilterPill label={label} icon={field.icon} onRemove={onRemove} />
      </PopoverTrigger>
      <PopoverContent aria-label={field.label} className="w-[288px] p-2">
        <FilterEditor
          field={field}
          initial={filter}
          labels={labels}
          onApply={(next) => {
            onApply(next);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function AddFilter({
  fields,
  labels,
  onApply,
}: {
  fields: readonly FilterBuilderField[];
  labels: Labels;
  onApply: (filter: Filter) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [field, setField] = React.useState<FilterBuilderField | null>(null);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setField(null);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm" className="h-7 gap-1.5 border-dashed px-2.5">
          <PlusIcon aria-hidden size={12} weight="bold" />
          {labels.add}
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label={field?.label ?? labels.chooseField} className="w-[288px] p-1">
        {field ? (
          <div className="p-1">
            <FilterEditor
              field={field}
              labels={labels}
              onBack={() => setField(null)}
              onApply={(next) => {
                onApply(next);
                onOpenChange(false);
              }}
            />
          </div>
        ) : (
          <div>
            <div className={MENU_LABEL}>{labels.chooseField}</div>
            <ul className="m-0 flex list-none flex-col p-0" onKeyDown={moveByArrows}>
              {fields.map((candidate) => (
                <li key={candidate.id}>
                  <button
                    type="button"
                    onClick={() => setField(candidate)}
                    className={cn(
                      MENU_ROW,
                      "w-full cursor-pointer text-left",
                      "hover:bg-[var(--bg-surface-brand)] hover:text-[var(--fg-primary)]",
                      "focus-visible:bg-[var(--bg-surface-brand)] focus-visible:text-[var(--fg-primary)]"
                    )}
                  >
                    {candidate.icon ? (
                      <IconSlot
                        icon={candidate.icon}
                        size={14}
                        className="text-[var(--fg-muted)]"
                      />
                    ) : null}
                    <span className="min-w-0 truncate">{candidate.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

/** Up and down move through a list of buttons, as in every other menu. */
function moveByArrows(event: React.KeyboardEvent<HTMLElement>) {
  const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
  if (!step) return;
  const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
  const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
  event.preventDefault();
  buttons[(at + step + buttons.length) % buttons.length]?.focus();
}

const initialValue = (field: FilterField): FilterValue | null =>
  field.type === "boolean" ? true : null;

// The value is what the person came to set, so it gets the focus: the chosen
// option, or the first thing that takes one. Skips rdp's days out of the tab order.
const FIRST_FOCUS = [
  "input:checked",
  "input:not([disabled]), button:not([disabled]):not([tabindex='-1']), [role=combobox]",
];

function FilterEditor({
  field,
  initial,
  labels,
  onApply,
  onBack,
}: {
  field: FilterBuilderField;
  initial?: Filter;
  labels: Labels;
  onApply: (filter: Filter) => void;
  onBack?: () => void;
}) {
  const ops = FILTER_OPS[field.type];
  const [op, setOp] = React.useState<FilterOp>(initial?.op ?? ops[0]);
  const [value, setValue] = React.useState<FilterValue | null>(
    initial?.value ?? initialValue(field)
  );
  const valueRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const box = valueRef.current;
    for (const selector of FIRST_FOCUS) {
      const target = box?.querySelector<HTMLElement>(selector);
      if (target) {
        target.focus();
        return;
      }
    }
  }, []);

  const candidate = value === null ? null : { field: field.id, op, value };
  const ready = candidate !== null && isValidFilter(candidate, [field]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (candidate && ready) onApply(candidate);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7"
            aria-label={labels.back}
            onClick={onBack}
          >
            <ArrowLeftIcon aria-hidden size={14} />
          </Button>
        ) : null}
        <span className="min-w-0 truncate font-mono text-mono-sm text-[var(--fg-primary)]">
          {field.label}
        </span>
      </div>

      {ops.length > 1 ? (
        <SegmentedControl
          aria-label={labels.operator}
          size="sm"
          className="w-full"
          value={op}
          onValueChange={(next) => setOp(next as FilterOp)}
          options={ops.map((candidateOp) => ({
            value: candidateOp,
            label: opLabel(field, candidateOp, labels),
          }))}
        />
      ) : null}

      <div ref={valueRef} className="flex flex-col">
        <ValueControl field={field} value={value} onChange={setValue} labels={labels} />
      </div>

      <Button type="submit" size="sm" disabled={!ready}>
        {labels.apply}
      </Button>
    </form>
  );
}

function ValueControl({
  field,
  value,
  onChange,
  labels,
}: {
  field: FilterBuilderField;
  value: FilterValue | null;
  onChange: (value: FilterValue | null) => void;
  labels: Labels;
}) {
  const format = useFormat();
  const name = React.useId();

  switch (field.type) {
    case "enum": {
      const options = field.options ?? [];
      if (options.length > ROWS_UP_TO) {
        return (
          <Combobox
            aria-label={labels.value}
            size="sm"
            options={options}
            searchPlaceholder={labels.search}
            value={typeof value === "string" ? value : null}
            onValueChange={onChange}
          />
        );
      }
      return (
        <div role="radiogroup" aria-label={labels.value} className="-mx-1 flex flex-col">
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                MENU_ROW,
                "cursor-pointer",
                // like a Select's rows: the highlight is the tint, the choice a check
                "pr-8",
                "hover:bg-[var(--bg-surface-brand)] hover:text-[var(--fg-primary)]",
                "has-[:focus-visible]:bg-[var(--bg-surface-brand)] has-[:focus-visible]:text-[var(--fg-primary)]",
                "has-[:checked]:text-[var(--fg-primary)]"
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="min-w-0 truncate">{option.label}</span>
              {value === option.value ? (
                <CheckIcon
                  aria-hidden
                  size={12}
                  weight="bold"
                  className="absolute right-2.5 text-[var(--fg-brand)]"
                />
              ) : null}
            </label>
          ))}
        </div>
      );
    }
    case "text":
      return (
        <Input
          aria-label={labels.value}
          size="sm"
          maxLength={MAX_TEXT}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value || null)}
        />
      );
    case "amount":
      return (
        <MoneyInput
          aria-label={labels.value}
          currency={field.currency ?? format.currency}
          value={typeof value === "number" ? value : null}
          onValueChange={onChange}
        />
      );
    case "date":
      return (
        <Calendar
          className="mx-auto"
          value={typeof value === "string" ? value : null}
          onValueChange={onChange}
        />
      );
    case "boolean":
      return (
        <SegmentedControl
          aria-label={labels.value}
          size="sm"
          className="w-full"
          value={value === false ? "no" : "yes"}
          onValueChange={(next) => onChange(next === "yes")}
          options={[
            { value: "yes", label: labels.yes },
            { value: "no", label: labels.no },
          ]}
        />
      );
  }
}

export { FilterBuilder };
export type { FilterBuilderField, FilterBuilderProps };
