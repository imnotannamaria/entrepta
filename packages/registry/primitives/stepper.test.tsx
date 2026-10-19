import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stepper } from "./stepper";

const STEPS = [
  { id: "account", label: "Account" },
  { id: "bank", label: "Connect a bank", description: "Read only" },
  { id: "budget", label: "First budget" },
];

describe("Stepper", () => {
  it("is an ordered list with the current step marked and every state in words", () => {
    render(<Stepper steps={STEPS} current="bank" />);
    const items = screen.getAllByRole("listitem");
    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).toHaveTextContent("Account, completed");
    expect(items[1]).toHaveTextContent("Connect a bank, current step");
    expect(items[2]).toHaveTextContent("First budget, not started");
  });

  it("shows a step's icon in its marker, and the number when it has none", () => {
    function FakeIcon(props: { className?: string }) {
      return <svg data-fake-icon className={props.className} />;
    }
    const steps = [
      { id: "account", label: "Account", icon: FakeIcon as never },
      { id: "bank", label: "Connect a bank", icon: FakeIcon as never },
      { id: "budget", label: "First budget" },
    ];
    const { container } = render(<Stepper steps={steps} current="account" />);
    // the first is current, the second is upcoming: both show their icon; the third its number
    expect(container.querySelectorAll("[data-fake-icon]")).toHaveLength(2);
    expect(screen.getAllByRole("listitem")[2]).toHaveTextContent("3");
    expect(container.querySelector("[data-nav-indicator]")).toBeNull();
  });

  it("shows a check for a done step and a warning for one that needs attention, over its icon", () => {
    function FakeIcon() {
      return <svg data-fake-icon />;
    }
    const steps = [
      { id: "a", label: "A", icon: FakeIcon as never },
      { id: "b", label: "B", icon: FakeIcon as never },
      { id: "c", label: "C", icon: FakeIcon as never },
    ];
    const { container } = render(<Stepper steps={steps} current="c" errored={["b"]} />);
    // only the current step keeps its icon
    expect(container.querySelectorAll("[data-fake-icon]")).toHaveLength(1);
  });

  it("takes any node as the indicator of the current step", () => {
    const { container } = render(
      <Stepper steps={STEPS} current="bank" indicator={<b data-mine>◆</b>} />
    );
    expect(container.querySelectorAll("[data-mine]")).toHaveLength(1);
    expect(screen.getAllByRole("listitem")[1]).toContainElement(
      container.querySelector("[data-mine]") as HTMLElement
    );
  });

  it("draws a line between steps in both directions, and none after the last", () => {
    const { container, rerender } = render(<Stepper steps={STEPS} current="bank" />);
    const lines = () => container.querySelectorAll("[data-step-line]");
    expect(lines()).toHaveLength(STEPS.length - 1);
    rerender(<Stepper steps={STEPS} current="bank" orientation="vertical" />);
    expect(lines()).toHaveLength(STEPS.length - 1);
    expect(lines()[0]).toHaveClass("w-px", "flex-1");
  });

  it("takes completed and errored steps as given, errors first", () => {
    render(<Stepper steps={STEPS} current="budget" completed={["account"]} errored={["bank"]} />);
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveTextContent("needs attention");
    expect(items[1]).toHaveAttribute("data-state", "error");
  });

  it("keeps only the current label in view on a phone when horizontal", () => {
    render(<Stepper steps={STEPS} current="bank" />);
    expect(screen.getByText("Account").parentElement).toHaveClass("max-sm:sr-only");
    expect(screen.getByText("Connect a bank").parentElement).not.toHaveClass("max-sm:sr-only");
  });

  it("stacks vertically with every label", () => {
    render(<Stepper steps={STEPS} current="bank" orientation="vertical" />);
    expect(screen.getByRole("list")).toHaveAttribute("data-orientation", "vertical");
    expect(screen.getByText("Account").parentElement).not.toHaveClass("max-sm:sr-only");
  });
});
