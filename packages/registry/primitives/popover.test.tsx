import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function Example() {
  return (
    <Popover>
      <PopoverTrigger>filters</PopoverTrigger>
      <PopoverContent aria-label="Filters">
        <label>
          amount
          <input />
        </label>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("opens a named dialog from its trigger, with focus inside", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "filters" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "amount" })).toHaveFocus();
  });

  it("closes on Esc and gives focus back to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "filters" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "filters" })).toHaveFocus();
  });

  it("stands on the overlay surface and pops like the rest of the family", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "filters" }));
    const panel = screen.getByRole("dialog");
    expect(panel).toHaveClass("bg-[var(--bg-overlay)]", "sheen", "motion-pop");
    expect(panel.className).not.toContain("--bg-surface)");
  });
});
