"use client";

import { CaretDownIcon, CheckIcon, PlusIcon } from "@phosphor-icons/react";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../feedback/command-palette";
import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { inputWrapperVariants } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ComboboxOption {
  value: string;
  label: string;
  /** The heading it sits under, such as a region for a time zone or a parent category. */
  group?: string;
  /** A short note on the right, in the muted ink. */
  hint?: React.ReactNode;
  /** More words that find it: an abbreviation, a synonym. */
  keywords?: string[];
  /** Picked for the person, such as by a model: marked, so they confirm or change it. */
  suggested?: boolean;
  disabled?: boolean;
}

interface ComboboxBaseProps {
  options: readonly ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  /** Said when the search finds nothing. Name what was searched: "No time zones match". */
  emptyText?: React.ReactNode;
  /** Offer to create what was typed when nothing matches it exactly. */
  creatable?: boolean;
  /** Creates the option and returns its value, which is then selected. */
  onCreate?: (label: string) => string | undefined;
  createLabel?: (query: string) => React.ReactNode;
  suggestedLabel?: string;
  /** The row's content, such as an IconTile and a name. The check stays in front of it. */
  renderOption?: (option: ComboboxOption) => React.ReactNode;
  size?: "sm" | "md" | "lg";
  state?: "default" | "error";
  disabled?: boolean;
  className?: string;
  // what a Field wires, or a name of its own
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
}

type ComboboxProps = ComboboxBaseProps &
  (
    | { multiple?: false; value: string | null; onValueChange: (value: string | null) => void }
    | { multiple: true; value: readonly string[]; onValueChange: (value: string[]) => void }
  );

/** Lowercase, without accents, so "sao" finds "São". */
function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/**
 * How well an option matches what was typed. cmdk's own score is fuzzy: it
 * takes letters in order with gaps, across words, so "tok" ranks Khartoum
 * above Tokyo in a long list, and it ranks within a group but not across
 * them. Here a match is a run of the letters typed: the start of the label
 * first, then the start of a word, then anywhere, then a keyword or group.
 */
function score(option: ComboboxOption, search: string): number {
  const query = fold(search.trim());
  if (!query) return 1;
  const label = fold(option.label);
  if (label.startsWith(query)) return 1;
  if (label.split(/[\s/_-]+/).some((word) => word.startsWith(query))) return 0.8;
  if (label.includes(query)) return 0.6;
  const rest = [...(option.keywords ?? []), option.group ?? ""].map(fold);
  if (rest.some((word) => word.includes(query))) return 0.4;
  return 0;
}

/** Groups in the order they first appear; options with no group come first. */
function grouped(options: readonly ComboboxOption[]) {
  const order: (string | undefined)[] = [];
  const byGroup = new Map<string | undefined, ComboboxOption[]>();
  for (const option of options) {
    if (!byGroup.has(option.group)) {
      byGroup.set(option.group, []);
      order.push(option.group);
    }
    byGroup.get(option.group)?.push(option);
  }
  order.sort((a, b) => (a === undefined ? -1 : b === undefined ? 1 : 0));
  return order.map((group) => ({ group, options: byGroup.get(group) ?? [] }));
}

/**
 * A value picked from a long list you can search: a time zone, a category, a
 * set of tags. On the overlay surface, with the same rows as the command
 * palette. For a handful of options, Select is simpler.
 */
const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>((props, ref) => {
  const {
    options,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyText = "No results",
    creatable = false,
    onCreate,
    createLabel = (query: string) => `Create "${query}"`,
    suggestedLabel = "suggested",
    renderOption,
    size,
    state,
    disabled,
    className,
    id,
    "aria-label": ariaLabel,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const chosen: readonly string[] = props.multiple
    ? props.value
    : props.value === null
      ? []
      : [props.value];
  const chosenOptions = chosen
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is ComboboxOption => Boolean(option));

  const pick = (value: string) => {
    if (props.multiple) {
      props.onValueChange(
        props.value.includes(value)
          ? props.value.filter((v) => v !== value)
          : [...props.value, value]
      );
      return;
    }
    props.onValueChange(value);
    setOpen(false);
  };

  const trimmed = query.trim();
  // Idle, the options sit in their groups. Searching, the matches form one
  // list, best first, and the group moves to the right of each row.
  const sections = trimmed
    ? [
        {
          group: undefined,
          options: options
            .map((option) => ({ option, rank: score(option, trimmed) }))
            .filter(({ rank }) => rank > 0)
            .sort((a, b) => b.rank - a.rank)
            .map(({ option }) => option),
        },
      ]
    : grouped(options);
  const hintOf = (option: ComboboxOption) =>
    option.hint ?? (trimmed && option.group ? option.group : null);
  const exact = options.some((option) => option.label.toLowerCase() === trimmed.toLowerCase());
  const canCreate = creatable && trimmed !== "" && !exact;

  const create = () => {
    const created = onCreate?.(trimmed);
    setQuery("");
    if (created) pick(created);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
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
            inputWrapperVariants({ size, state }),
            "justify-between text-left font-mono text-mono-md text-[var(--fg-primary)] outline-none",
            "focus-visible:border-[var(--fg-brand)] focus-visible:shadow-[0_0_0_3px_var(--bg-surface-brand)]",
            "aria-[invalid=true]:border-[var(--status-error)]",
            "disabled:pointer-events-none disabled:opacity-40",
            className
          )}
        >
          <TriggerValue
            chosen={chosenOptions}
            multiple={Boolean(props.multiple)}
            placeholder={placeholder}
          />
          <CaretDownIcon aria-hidden size={14} className="shrink-0 text-[var(--fg-muted)]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={ariaLabel ?? placeholder}
        className="w-[max(var(--radix-popover-trigger-width),240px)] overflow-hidden p-0"
      >
        <CommandPrimitive
          loop
          label={searchPlaceholder}
          shouldFilter={false}
          className="flex flex-col"
        >
          <CommandInput
            size="sm"
            showEsc={false}
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[280px]">
            {canCreate ? null : <CommandEmpty>{emptyText}</CommandEmpty>}
            {sections.map(({ group, options: rows }) => (
              <CommandGroup key={group ?? ""} heading={group}>
                {rows.map((option) => {
                  const isChosen = chosen.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      onSelect={() => pick(option.value)}
                      icon={
                        <CheckIcon
                          aria-hidden
                          size={12}
                          weight="bold"
                          className={cn(
                            "text-[var(--fg-brand)]",
                            isChosen ? "opacity-100" : "opacity-0"
                          )}
                        />
                      }
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {renderOption ? (
                          renderOption(option)
                        ) : (
                          <span className="truncate">{option.label}</span>
                        )}
                        {option.suggested ? (
                          <Badge size="sm" variant="soft" color="brand">
                            {suggestedLabel}
                          </Badge>
                        ) : null}
                        {hintOf(option) ? (
                          <span className="ml-auto shrink-0 text-mono-sm text-[var(--fg-muted)]">
                            {hintOf(option)}
                          </span>
                        ) : null}
                        {isChosen ? <span className="sr-only">, selected</span> : null}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
            {canCreate ? (
              <CommandGroup>
                <CommandItem
                  value={`create:${trimmed}`}
                  onSelect={create}
                  icon={<PlusIcon aria-hidden size={12} weight="bold" />}
                >
                  {createLabel(trimmed)}
                </CommandItem>
              </CommandGroup>
            ) : null}
          </CommandList>
        </CommandPrimitive>
      </PopoverContent>
    </Popover>
  );
});
Combobox.displayName = "Combobox";

/** One label, or up to two chips and a count. It never wraps the trigger onto a second line. */
function TriggerValue({
  chosen,
  multiple,
  placeholder,
}: {
  chosen: ComboboxOption[];
  multiple: boolean;
  placeholder: string;
}) {
  if (chosen.length === 0) {
    return <span className="min-w-0 truncate text-[var(--fg-muted)]">{placeholder}</span>;
  }
  if (!multiple) return <span className="min-w-0 truncate">{chosen[0].label}</span>;
  const shown = chosen.slice(0, 2);
  const rest = chosen.length - shown.length;
  return (
    <span className="flex min-w-0 items-center gap-1 overflow-hidden">
      {shown.map((option) => (
        <Badge key={option.value} size="sm" variant="soft" className="min-w-0 max-w-[12ch]">
          <span className="truncate">{option.label}</span>
        </Badge>
      ))}
      {rest > 0 ? (
        <span className="shrink-0 text-mono-sm text-[var(--fg-muted)]">+{rest}</span>
      ) : null}
    </span>
  );
}

export { Combobox };
export type { ComboboxOption, ComboboxProps };
