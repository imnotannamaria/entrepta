import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./segmented-control";

const KINDS = [
  { value: "expense", label: "expense" },
  { value: "income", label: "income" },
  { value: "transfer", label: "transfer" },
];

describe("SegmentedControl", () => {
  it("is a named radio group with one radio per option", () => {
    render(<SegmentedControl aria-label="kind" options={KINDS} defaultValue="expense" />);
    expect(screen.getByRole("radiogroup", { name: "kind" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "expense" })).toBeChecked();
  });

  it("picks on click and tells the caller", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="kind"
        options={KINDS}
        defaultValue="expense"
        onValueChange={onValueChange}
      />
    );
    await user.click(screen.getByText("income"));
    expect(onValueChange).toHaveBeenCalledWith("income");
    expect(screen.getByRole("radio", { name: "income" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "expense" })).not.toBeChecked();
  });

  it("moves with the arrow keys and takes one Tab stop", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SegmentedControl aria-label="kind" options={KINDS} defaultValue="expense" />
        <button type="button">after</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole("radio", { name: "expense" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "income" })).toBeChecked();
    await user.tab();
    expect(screen.getByRole("button", { name: "after" })).toHaveFocus();
  });

  it("works controlled", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = React.useState("6M");
      return (
        <>
          <SegmentedControl
            aria-label="period"
            options={["3M", "6M", "12M"].map((v) => ({ value: v, label: v }))}
            value={value}
            onValueChange={setValue}
          />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByText("12M"));
    expect(screen.getByRole("status")).toHaveTextContent("12M");
  });

  it("slides the indicator to the chosen segment, in CSS", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SegmentedControl aria-label="kind" options={KINDS} defaultValue="expense" />
    );
    const group = container.firstChild as HTMLElement;
    expect(group.style.getPropertyValue("--segments")).toBe("3");
    expect(group.style.getPropertyValue("--active")).toBe("0");
    await user.click(screen.getByText("transfer"));
    expect(group.style.getPropertyValue("--active")).toBe("2");
    expect(group.querySelector("[aria-hidden]")).toHaveClass("transition-[translate,opacity]");
  });

  it("hides the indicator when nothing is chosen", () => {
    const { container } = render(<SegmentedControl aria-label="kind" options={KINDS} />);
    expect(container.querySelector("[aria-hidden]")).toHaveClass("opacity-0");
  });

  it("disables one option or all of them", () => {
    const { rerender } = render(
      <SegmentedControl
        aria-label="kind"
        options={[...KINDS.slice(0, 2), { ...KINDS[2], disabled: true }]}
      />
    );
    expect(screen.getByRole("radio", { name: "transfer" })).toBeDisabled();
    rerender(<SegmentedControl aria-label="kind" options={KINDS} disabled />);
    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled();
  });
});
