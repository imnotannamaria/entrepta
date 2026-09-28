import { isPlainDate } from "./format";

export type FilterFieldType = "enum" | "text" | "amount" | "date" | "boolean";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  /** Plain letters, digits, `-` and `_`: it ends up in the URL. */
  id: string;
  label: string;
  type: FilterFieldType;
  /** The values an `enum` field takes. */
  options?: readonly FilterOption[];
  /** ISO 4217, for an `amount` field. Falls back to the FormatProvider's. */
  currency?: string;
}

export type FilterOp = "is" | "is-not" | "contains" | "gt" | "lt" | "before" | "after";

/** An option's value, text, integer minor units, a `YYYY-MM-DD` day, or a yes or no. */
export type FilterValue = string | number | boolean;

export interface Filter {
  field: string;
  op: FilterOp;
  value: FilterValue;
}

/** What each type can ask, the first one being the default. */
export const FILTER_OPS: Record<FilterFieldType, readonly FilterOp[]> = {
  enum: ["is", "is-not"],
  text: ["contains", "is"],
  amount: ["gt", "lt", "is"],
  date: ["is", "before", "after"],
  boolean: ["is"],
};

/** Past this many a URL is noise, not a question anyone asked. */
export const MAX_FILTERS = 20;
export const MAX_TEXT = 200;

const FIELD_ID = /^[A-Za-z0-9_-]{1,64}$/;
const MINOR_UNITS = /^-?\d{1,15}$/;

/** Whether a filter asks something its field can answer. */
export function isValidFilter(filter: Filter, fields: readonly FilterField[]): boolean {
  const field = fields.find((candidate) => candidate.id === filter.field);
  if (!field || !FIELD_ID.test(field.id)) return false;
  if (!FILTER_OPS[field.type].includes(filter.op)) return false;
  const { value } = filter;
  switch (field.type) {
    case "enum":
      return typeof value === "string" && (field.options ?? []).some((o) => o.value === value);
    case "text":
      return typeof value === "string" && value.trim().length > 0 && value.length <= MAX_TEXT;
    case "amount":
      return typeof value === "number" && Number.isSafeInteger(value);
    case "date":
      return isPlainDate(value);
    case "boolean":
      return typeof value === "boolean";
  }
}

/**
 * Each filter as `field:op:value`, one string per filter, for
 * `params.append("filter", …)`. URLSearchParams does the escaping.
 */
export function serializeFilters(filters: readonly Filter[]): string[] {
  return filters.map((filter) => `${filter.field}:${filter.op}:${String(filter.value)}`);
}

/**
 * The filters in a URL, against the fields that exist. The URL is input, so
 * anything that does not name a field, an operator its type has, or a value
 * the field takes is dropped rather than trusted, and so is a repeat.
 */
export function parseFilters(values: readonly string[], fields: readonly FilterField[]): Filter[] {
  const filters: Filter[] = [];
  const seen = new Set<string>();
  for (const raw of values) {
    if (filters.length >= MAX_FILTERS) break;
    const first = raw.indexOf(":");
    const second = raw.indexOf(":", first + 1);
    if (first < 1 || second < 0) continue;
    const id = raw.slice(0, first);
    const op = raw.slice(first + 1, second) as FilterOp;
    const text = raw.slice(second + 1);
    const field = fields.find((candidate) => candidate.id === id);
    if (!field) continue;

    let value: FilterValue;
    if (field.type === "amount") {
      if (!MINOR_UNITS.test(text)) continue;
      value = Number(text);
    } else if (field.type === "boolean") {
      if (text !== "true" && text !== "false") continue;
      value = text === "true";
    } else {
      value = text;
    }

    const filter = { field: id, op, value };
    const key = `${id}:${op}:${text}`;
    if (seen.has(key) || !isValidFilter(filter, fields)) continue;
    seen.add(key);
    filters.push(filter);
  }
  return filters;
}

const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/**
 * Whether a row's value passes a filter, for lists filtered in the browser.
 * Text compares without case or accents; days compare as `YYYY-MM-DD`.
 */
export function matchesFilter(value: unknown, filter: Filter): boolean {
  const target = filter.value;
  switch (filter.op) {
    case "is":
    case "is-not": {
      const same =
        typeof value === "string" && typeof target === "string"
          ? fold(value) === fold(target)
          : value === target;
      return filter.op === "is" ? same : !same;
    }
    case "contains":
      return typeof value === "string" && fold(value).includes(fold(String(target)));
    case "gt":
      return typeof value === "number" && value > Number(target);
    case "lt":
      return typeof value === "number" && value < Number(target);
    case "before":
      return typeof value === "string" && value < String(target);
    case "after":
      return typeof value === "string" && value > String(target);
  }
}
