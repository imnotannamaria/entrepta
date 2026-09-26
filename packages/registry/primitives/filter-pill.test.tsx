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
});
