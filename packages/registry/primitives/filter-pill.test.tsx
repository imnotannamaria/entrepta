import { TagIcon } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FilterPill } from "./filter-pill";

describe("FilterPill", () => {
  it("is a toggle button announced as pressed or not", () => {
    const { rerender } = render(<FilterPill label="film" active={false} />);
    expect(screen.getByRole("button", { name: "film" })).toHaveAttribute("aria-pressed", "false");
    rerender(<FilterPill label="film" active />);
    expect(screen.getByRole("button", { name: "film" })).toHaveAttribute("aria-pressed", "true");
  });

  it("styles the pressed state with the brand tint and its own ink", () => {
    render(<FilterPill label="film" active />);
    expect(screen.getByRole("button")).toHaveClass(
      "aria-pressed:bg-[var(--bg-surface-brand)]",
      "aria-pressed:text-[var(--fg-brand-text)]"
    );
  });

  it("shows the count at full contrast", () => {
    render(<FilterPill label="film" count={12} active={false} />);
    const count = screen.getByText("12");
    expect(count.className).not.toMatch(/opacity/);
  });

  it("renders an icon, hidden from screen readers", () => {
    const { container } = render(<FilterPill label="tags" icon={TagIcon} active />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("calls onClick", async () => {
    const onClick = vi.fn();
    render(<FilterPill label="film" active={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("takes an icon as an element, for a server file", () => {
    render(<FilterPill label="tags" icon={<TagIcon data-testid="glyph" />} active />);
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
  });
});

describe("FilterPill, applied", () => {
  it("names the × after what it removes, and calls onRemove", async () => {
    const onRemove = vi.fn();
    render(<FilterPill label="category is Groceries" onRemove={onRemove} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Remove filter: category is Groceries" })
    );
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("is not a toggle, and edits through onClick", async () => {
    const onClick = vi.fn();
    render(<FilterPill label="amount over 50" onClick={onClick} onRemove={() => {}} />);
    const edit = screen.getByRole("button", { name: "amount over 50" });
    expect(edit).not.toHaveAttribute("aria-pressed");
    await userEvent.click(edit);
    expect(onClick).toHaveBeenCalled();
  });

  it("without onClick, the label is plain text and the × the one button", () => {
    render(<FilterPill label="income" onRemove={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("takes a remove label when the label is not text", () => {
    render(
      <FilterPill
        label={<strong>income</strong>}
        removeLabel="Remove the income filter"
        onRemove={() => {}}
      />
    );
    expect(screen.getByRole("button", { name: "Remove the income filter" })).toBeInTheDocument();
  });

  it("shortens a long label instead of overflowing its row, and keeps the ×", () => {
    render(<FilterPill label="note contains a very long phrase" onRemove={() => {}} />);
    const remove = screen.getByRole("button", { name: /^Remove filter/ });
    expect(remove.parentElement).toHaveClass("max-w-full");
    expect(remove).toHaveClass("shrink-0");
    expect(screen.getByText("note contains a very long phrase")).toHaveClass("truncate");
  });
});
