import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable, dataTableColumns } from "./data-table";

type Entry = { id: string; item: string; amount: number };

const col = dataTableColumns<Entry>();
const columns = col.columns([
  col.accessor("item", { header: "item" }),
  col.accessor("amount", { header: "amount", cell: (info) => info.getValue().toFixed(2) }),
]);

const DATA: Entry[] = [
  { id: "a", item: "rent", amount: 1800 },
  { id: "b", item: "coffee", amount: 4.5 },
  { id: "c", item: "books", amount: 62 },
];

const bodyRows = () => screen.getAllByRole("row").slice(1);

describe("DataTable", () => {
  it("renders a named table with a row per record", () => {
    render(<DataTable aria-label="entries" data={DATA} columns={columns} getRowId={(r) => r.id} />);
    expect(screen.getByRole("table", { name: "entries" })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(3);
  });

  it("sorts from its headers and says the order to screen readers", async () => {
    const user = userEvent.setup();
    render(<DataTable aria-label="entries" data={DATA} columns={columns} numeric={["amount"]} />);
    const header = screen.getByRole("columnheader", { name: /amount/ });
    const amounts = () => bodyRows().map((r) => within(r).getAllByRole("cell")[1].textContent);
    expect(header).toHaveAttribute("aria-sort", "none");
    // a number column sorts largest first, TanStack's default for numbers
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(amounts()).toEqual(["1800.00", "62.00", "4.50"]);
    await user.click(within(header).getByRole("button"));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(amounts()).toEqual(["4.50", "62.00", "1800.00"]);
  });

  it("aligns the numeric columns right", () => {
    render(<DataTable aria-label="entries" data={DATA} columns={columns} numeric={["amount"]} />);
    expect(screen.getByRole("cell", { name: "62.00" })).toHaveClass("text-right");
    expect(screen.getByRole("cell", { name: "books" })).toHaveClass("text-left");
  });

  it("selects rows through checkboxes that name the row", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        aria-label="entries"
        data={DATA}
        columns={columns}
        getRowId={(r) => r.id}
        selectable
        rowLabel={(r) => `Select ${r.item}, ${r.amount}`}
      />
    );
    await user.click(screen.getByRole("checkbox", { name: "Select coffee, 4.5" }));
    // the checkbox carries the state; aria-selected is not valid on a plain table's row
    expect(screen.getByRole("checkbox", { name: "Select coffee, 4.5" })).toBeChecked();
    expect(bodyRows()[1]).toHaveAttribute("data-state", "selected");
    expect(bodyRows()[1]).not.toHaveAttribute("aria-selected");
    const all = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
    expect(all.indeterminate).toBe(true);
    await user.click(all);
    expect(bodyRows().every((r) => r.getAttribute("data-state") === "selected")).toBe(true);
  });

  it("shows skeleton rows in its own geometry while loading", () => {
    render(
      <DataTable
        aria-label="entries"
        data={[]}
        columns={columns}
        numeric={["amount"]}
        selectable
        loading
        loadingRows={4}
      />
    );
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    const placeholders = screen.getAllByRole("row", { hidden: true }).slice(1);
    expect(placeholders).toHaveLength(4);
    // a checkbox column, then one bar per column, the numeric one on the right
    const cells = placeholders[0].querySelectorAll("td");
    expect(cells).toHaveLength(3);
    expect(cells[2].firstElementChild).toHaveClass("ml-auto");
    expect(screen.getByRole("checkbox", { name: "Select all rows" })).toBeDisabled();
  });

  it("says there are no rows yet, with its own words and action", () => {
    const { rerender } = render(<DataTable aria-label="entries" data={[]} columns={columns} />);
    expect(screen.getByRole("status")).toHaveTextContent("No rows yet");
    rerender(
      <DataTable
        aria-label="entries"
        data={[]}
        columns={columns}
        empty={{
          title: "No entries this month",
          description: "Add one to start.",
          action: <button type="button">add</button>,
        }}
      />
    );
    const cell = screen.getByText("No entries this month").closest("td");
    expect(cell).toHaveAttribute("colspan", "2");
    expect(screen.getByRole("button", { name: "add" })).toBeInTheDocument();
  });

  it("tells a filter that hides everything apart from no data, and clears it", async () => {
    const user = userEvent.setup();
    const clear = vi.fn();
    render(
      <DataTable aria-label="entries" data={[]} columns={columns} filtered onClearFilters={clear} />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Nothing matches these filters");
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(clear).toHaveBeenCalled();
  });

  it("shows an error in place of the rows, announced, with a retry", async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    render(
      <DataTable
        aria-label="entries"
        data={DATA}
        columns={columns}
        error={{ description: "The server took too long.", onRetry: retry }}
      />
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("The rows did not load");
    expect(alert).toHaveTextContent("The server took too long.");
    // the old rows would read as current, so they are not shown
    expect(screen.queryByRole("cell", { name: "rent" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalled();
  });

  it("takes the words of its states in another language", () => {
    render(
      <DataTable
        aria-label="entries"
        data={[]}
        columns={columns}
        filtered
        onClearFilters={() => {}}
        labels={{ filteredTitle: "Nada com esses filtros", clearFilters: "Limpar filtros" }}
      />
    );
    expect(screen.getByText("Nada com esses filtros")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limpar filtros" })).toBeInTheDocument();
  });

  it("renders only the rows in view past 500, and keeps the total for screen readers", () => {
    const many = Array.from({ length: 2000 }, (_, i) => ({
      id: String(i),
      item: `item ${i}`,
      amount: i,
    }));
    render(<DataTable aria-label="entries" data={many} columns={columns} maxHeight={400} />);
    expect(screen.getByRole("table")).toHaveAttribute("aria-rowcount", "2001");
    expect(bodyRows().length).toBeLessThan(100);
  });

  it("opens a row with the keyboard as well as the pointer", async () => {
    const user = userEvent.setup();
    const opened: string[] = [];
    render(
      <DataTable
        aria-label="entries"
        data={DATA}
        columns={columns}
        onRowClick={(row) => opened.push(row.item)}
      />
    );
    await user.click(screen.getByRole("cell", { name: "rent" }));
    // the clicked row holds the focus, so Tab moves to the next one
    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(opened).toEqual(["rent", "coffee", "coffee"]);
  });
});
