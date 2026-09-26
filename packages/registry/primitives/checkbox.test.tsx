import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("is a native checkbox named by its label", () => {
    render(<Checkbox label="button" />);
    expect(screen.getByRole("checkbox", { name: "button" })).toHaveAttribute("type", "checkbox");
  });

  it("toggles on click, on the label and with the space key", async () => {
    const onChange = vi.fn();
    render(<Checkbox label="card" onChange={onChange} />);
    const input = screen.getByRole("checkbox");
    await userEvent.click(screen.getByText("card"));
    expect(input).toBeChecked();
    await userEvent.click(input);
    expect(input).not.toBeChecked();
    input.focus();
    await userEvent.keyboard(" ");
    expect(input).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("describes itself with the description line", () => {
    render(<Checkbox label="diamond" description="needed by card" />);
    expect(screen.getByRole("checkbox", { name: "diamond" })).toHaveAccessibleDescription(
      "needed by card"
    );
  });

  it("sets the indeterminate property and keeps it in sync", () => {
    const { rerender } = render(<Checkbox label="all" indeterminate />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    rerender(<Checkbox label="all" />);
    expect(input.indeterminate).toBe(false);
  });

  it("puts the on-brand ink on the check, over the brand fill", () => {
    const { container } = render(<Checkbox />);
    expect(container.querySelector("[data-checkbox-box]")).toHaveClass(
      "peer-checked:bg-[var(--fg-brand)]"
    );
    expect(container.querySelector("[data-checkbox-check]")).toHaveClass(
      "text-[var(--fg-on-brand)]"
    );
  });

  it("dims and disables", () => {
    const { container } = render(<Checkbox label="off" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(container.firstChild).toHaveClass("opacity-40");
  });

  it("forwards the ref to the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("settles into the checked state with a pop, and draws the check after the fill", () => {
    const { container } = render(<Checkbox />);
    expect(container.querySelector("[data-checkbox-box]")).toHaveClass(
      "peer-checked:animate-[check-pop_var(--motion-slow)_var(--ease-out)]",
      "peer-active:scale-90"
    );
    expect(container.querySelector("[data-checkbox-check]")).toHaveClass(
      "peer-checked:delay-[60ms]"
    );
  });
});
