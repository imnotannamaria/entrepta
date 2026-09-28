import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

function Example({ maxHeight }: { maxHeight?: number }) {
  return (
    <Table maxHeight={maxHeight}>
      <TableCaption>September entries</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>item</TableHead>
          <TableHead align="end">amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>rent</TableCell>
          <TableCell align="end">1,800.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("is a real table, named by its caption, with column headers", () => {
    render(<Example />);
    expect(screen.getByRole("table", { name: "September entries" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getByRole("columnheader", { name: "item" })).toHaveAttribute("scope", "col");
  });

  it("puts numbers on the right in tabular figures", () => {
    render(<Example />);
    expect(screen.getByRole("cell", { name: "1,800.00" })).toHaveClass(
      "text-right",
      "tabular-nums"
    );
    expect(screen.getByRole("columnheader", { name: "amount" })).toHaveClass("text-right");
  });

  it("scrolls inside its own box, with the header held at the top", () => {
    render(<Example maxHeight={240} />);
    const box = screen.getByRole("table").parentElement as HTMLElement;
    expect(box).toHaveClass("overflow-auto");
    expect(box.style.maxHeight).toBe("240px");
    expect(screen.getAllByRole("rowgroup")[0]).toHaveClass("sticky", "top-0");
  });
});
