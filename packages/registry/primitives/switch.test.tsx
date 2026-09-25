import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

describe("Switch", () => {
  it("is a native checkbox announced as a switch, named by its label", () => {
    render(<Switch label="notifications" />);
    const input = screen.getByRole("switch", { name: "notifications" });
    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("toggles on click and on the label", async () => {
    const onChange = vi.fn();
    render(<Switch label="sound" onChange={onChange} />);
    const input = screen.getByRole("switch");
    await userEvent.click(screen.getByText("sound"));
    expect(input).toBeChecked();
    await userEvent.click(input);
    expect(input).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("toggles with the space key", async () => {
    render(<Switch label="sound" />);
    const input = screen.getByRole("switch");
    input.focus();
    await userEvent.keyboard(" ");
    expect(input).toBeChecked();
  });

  it("puts the theme's on-brand ink on the knob when checked", () => {
    const { container } = render(<Switch />);
    expect(container.querySelector("[data-switch-thumb]")).toHaveClass(
      "peer-checked:bg-[var(--fg-on-brand)]"
    );
  });

  it("dims and disables", () => {
    const { container } = render(<Switch disabled label="off" />);
    expect(screen.getByRole("switch")).toBeDisabled();
    expect(container.firstChild).toHaveClass("opacity-40");
  });

  it("forwards the ref to the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
