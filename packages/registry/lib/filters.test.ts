import { describe, expect, it } from "vitest";
import {
  type Filter,
  type FilterField,
  MAX_FILTERS,
  isValidFilter,
  matchesFilter,
  parseFilters,
  serializeFilters,
} from "./filters";

const FIELDS: FilterField[] = [
  {
    id: "category",
    label: "Category",
    type: "enum",
    options: [
      { value: "groceries", label: "Groceries" },
      { value: "rent", label: "Rent" },
    ],
  },
  { id: "note", label: "Note", type: "text" },
  { id: "amount", label: "Amount", type: "amount", currency: "USD" },
  { id: "date", label: "Date", type: "date" },
  { id: "recurring", label: "Recurring", type: "boolean" },
];

const FILTERS: Filter[] = [
  { field: "category", op: "is", value: "groceries" },
  { field: "note", op: "contains", value: "a:b c" },
  { field: "amount", op: "gt", value: 5000 },
  { field: "date", op: "before", value: "2026-09-01" },
  { field: "recurring", op: "is", value: false },
];

describe("serializeFilters and parseFilters", () => {
  it("round-trip every type, a colon in the text included", () => {
    const strings = serializeFilters(FILTERS);
    expect(strings[1]).toBe("note:contains:a:b c");
    expect(parseFilters(strings, FIELDS)).toEqual(FILTERS);
  });

  it("survive a real URL", () => {
    const params = new URLSearchParams();
    for (const value of serializeFilters(FILTERS)) params.append("filter", value);
    const back = new URLSearchParams(params.toString()).getAll("filter");
    expect(parseFilters(back, FIELDS)).toEqual(FILTERS);
  });

  it("drop what does not match a field", () => {
    expect(
      parseFilters(
        [
          "nope:is:x",
          "category:is:other",
          "category:contains:groceries",
          "amount:gt:12.5",
          "amount:gt:1e9",
          "date:is:2026-02-30",
          "recurring:is:yes",
          "note:contains:",
          `note:contains:${"x".repeat(201)}`,
          "category",
          ":is:x",
          "__proto__:is:x",
        ],
        FIELDS
      )
    ).toEqual([]);
  });

  it("keep each filter once, and at most twenty", () => {
    expect(parseFilters(["category:is:rent", "category:is:rent"], FIELDS)).toHaveLength(1);
    const many = Array.from({ length: 30 }, (_, index) => `amount:gt:${index}`);
    expect(parseFilters(many, FIELDS)).toHaveLength(MAX_FILTERS);
  });
});

describe("isValidFilter", () => {
  it("wants an operator the type has and a value of the type", () => {
    expect(isValidFilter({ field: "amount", op: "lt", value: 100 }, FIELDS)).toBe(true);
    expect(isValidFilter({ field: "amount", op: "before", value: 100 }, FIELDS)).toBe(false);
    expect(isValidFilter({ field: "amount", op: "lt", value: "100" }, FIELDS)).toBe(false);
    expect(isValidFilter({ field: "note", op: "is", value: "   " }, FIELDS)).toBe(false);
  });

  it("rejects a field id that could not live in a URL", () => {
    const odd: FilterField[] = [{ id: "a:b", label: "A", type: "text" }];
    expect(isValidFilter({ field: "a:b", op: "is", value: "x" }, odd)).toBe(false);
  });
});

describe("matchesFilter", () => {
  it("compares text without case or accents", () => {
    expect(matchesFilter("Café da manhã", { field: "note", op: "contains", value: "CAFE" })).toBe(
      true
    );
    expect(matchesFilter("Rent", { field: "category", op: "is-not", value: "rent" })).toBe(false);
  });

  it("compares amounts and days", () => {
    expect(matchesFilter(6000, { field: "amount", op: "gt", value: 5000 })).toBe(true);
    expect(matchesFilter(6000, { field: "amount", op: "lt", value: 5000 })).toBe(false);
    expect(matchesFilter("2026-08-31", { field: "date", op: "before", value: "2026-09-01" })).toBe(
      true
    );
    expect(matchesFilter("2026-09-02", { field: "date", op: "after", value: "2026-09-01" })).toBe(
      true
    );
    expect(matchesFilter(true, { field: "recurring", op: "is", value: true })).toBe(true);
  });

  it("never matches a value of the wrong type", () => {
    expect(matchesFilter(undefined, { field: "amount", op: "gt", value: 0 })).toBe(false);
    expect(matchesFilter(null, { field: "note", op: "contains", value: "a" })).toBe(false);
  });
});
