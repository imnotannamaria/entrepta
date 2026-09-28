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

  it("puts the diamond on the current step only", () => {
    const { container } = render(<Stepper steps={STEPS} current="bank" />);
    const diamonds = [...container.querySelectorAll("span")].filter(
      (s) => s.textContent === "◆" && s.children.length === 0
    );
    expect(diamonds).toHaveLength(1);
    expect(screen.getAllByRole("listitem")[1]).toContainElement(diamonds[0]);
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
