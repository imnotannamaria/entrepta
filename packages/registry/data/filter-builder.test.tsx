import { TagIcon } from "@phosphor-icons/react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import type { Filter } from "../lib/filters";
import { FilterBuilder, type FilterBuilderField } from "./filter-builder";

const FIELDS: FilterBuilderField[] = [
  {
    id: "category",
    label: "Category",
    type: "enum",
    icon: TagIcon,
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

function Harness({
  initial = [],
  onChange,
}: {
  initial?: Filter[];
  onChange?: (value: Filter[]) => void;
}) {
  const [value, setValue] = React.useState<Filter[]>(initial);
  return (
    <FilterBuilder
      fields={FIELDS}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe("FilterBuilder", () => {
  it("is a named group with an add button", () => {
    render(<Harness />);
    const group = screen.getByRole("group", { name: "Filters" });
    expect(within(group).getByRole("button", { name: "Filter" })).toBeInTheDocument();
  });

  it("adds an enum filter: field, option, apply", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    await userEvent.click(screen.getByRole("button", { name: "Category" }));

    const apply = screen.getByRole("button", { name: "Apply" });
    expect(apply).toBeDisabled();
    await userEvent.click(screen.getByRole("radio", { name: "Groceries" }));
    await userEvent.click(apply);

    expect(onChange).toHaveBeenLastCalledWith([
      { field: "category", op: "is", value: "groceries" },
    ]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove filter: Category is Groceries" })
    ).toBeInTheDocument();
  });

  it("offers the conditions of the field's type", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    await userEvent.click(screen.getByRole("button", { name: "Amount" }));
    const condition = screen.getByRole("radiogroup", { name: "Condition" });
    expect(
      within(condition)
        .getAllByRole("radio")
        .map((radio) => radio.getAttribute("value"))
    ).toEqual(["gt", "lt", "is"]);
  });

  it("adds a text filter from the keyboard, the field focused on open", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    await userEvent.click(screen.getByRole("button", { name: "Note" }));
    expect(screen.getByRole("textbox", { name: "Value" })).toHaveFocus();
    await userEvent.keyboard("coffee{Enter}");
    expect(onChange).toHaveBeenLastCalledWith([{ field: "note", op: "contains", value: "coffee" }]);
    expect(screen.getByRole("button", { name: "Note contains “coffee”" })).toBeInTheDocument();
  });

  it("moves through the fields with the arrow keys, from the first one", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    expect(screen.getByRole("button", { name: "Category" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getByRole("button", { name: "Amount" })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}");
    expect(screen.getByRole("button", { name: "Recurring" })).toHaveFocus();
  });

  it("marks the chosen option with a check, like a Select", async () => {
    render(<Harness initial={[{ field: "category", op: "is", value: "rent" }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Category is Rent" }));
    const rent = screen.getByRole("radio", { name: "Rent" }).closest("label");
    expect(rent?.querySelector("svg")).not.toBeNull();
    expect(
      screen.getByRole("radio", { name: "Groceries" }).closest("label")?.querySelector("svg")
    ).toBeNull();
  });

  it("goes back to the list of fields", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    await userEvent.click(screen.getByRole("button", { name: "Note" }));
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("button", { name: "Category" })).toBeInTheDocument();
  });

  it("describes each applied filter in words, money and days formatted", () => {
    render(
      <Harness
        initial={[
          { field: "amount", op: "gt", value: 5000 },
          { field: "date", op: "is", value: "2026-09-01" },
          { field: "recurring", op: "is", value: false },
        ]}
      />
    );
    expect(screen.getByRole("button", { name: "Amount over $50.00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Date on Sep 1, 2026" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recurring is no" })).toBeInTheDocument();
  });

  it("edits an applied filter in place", async () => {
    const onChange = vi.fn();
    render(
      <Harness
        initial={[{ field: "category", op: "is", value: "groceries" }]}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Category is Groceries" }));
    expect(screen.getByRole("radio", { name: "Groceries" })).toHaveFocus();
    await userEvent.click(screen.getByRole("radio", { name: "is not" }));
    await userEvent.click(screen.getByRole("radio", { name: "Rent" }));
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(onChange).toHaveBeenLastCalledWith([{ field: "category", op: "is-not", value: "rent" }]);
  });

  it("removes one filter, or clears them all", async () => {
    const onChange = vi.fn();
    render(
      <Harness
        initial={[
          { field: "category", op: "is", value: "rent" },
          { field: "recurring", op: "is", value: true },
        ]}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove filter: Category is Rent" }));
    expect(onChange).toHaveBeenLastCalledWith([{ field: "recurring", op: "is", value: true }]);
    expect(screen.queryByRole("button", { name: "Clear all" })).not.toBeInTheDocument();
  });

  it("clears them all", async () => {
    const onChange = vi.fn();
    render(
      <Harness
        initial={[
          { field: "category", op: "is", value: "rent" },
          { field: "recurring", op: "is", value: true },
        ]}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("does not render a filter its fields cannot answer", () => {
    render(<Harness initial={[{ field: "category", op: "is", value: "nope" }]} />);
    expect(screen.queryByRole("button", { name: /Category/ })).not.toBeInTheDocument();
  });

  it("takes its words as props", async () => {
    render(
      <FilterBuilder
        fields={FIELDS}
        value={[{ field: "amount", op: "lt", value: 100 }]}
        onValueChange={() => {}}
        labels={{ add: "Filtrar", ops: { lt: "abaixo de" } }}
      />
    );
    expect(screen.getByRole("button", { name: "Filtrar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Amount abaixo de $1.00" })).toBeInTheDocument();
  });
});
