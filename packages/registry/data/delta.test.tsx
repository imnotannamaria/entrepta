import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FormatProvider } from "../hooks/use-format";
import { MINUS } from "../lib/format";
import { Delta, compareValues } from "./delta";

const text = (el: Element | null) => el?.textContent?.replace(/[\u00a0\u202f]/g, " ");

describe("compareValues", () => {
  it("gives a ratio only over a positive base", () => {
    expect(compareValues(120, 100)).toEqual({ state: "up", difference: 20, ratio: 0.2 });
    expect(compareValues(50, 0)).toEqual({ state: "up", difference: 50, ratio: null });
    expect(compareValues(-10, -50)).toEqual({ state: "up", difference: 40, ratio: null });
    expect(compareValues(80, 100).state).toBe("down");
    expect(compareValues(100, 100).state).toBe("flat");
  });

  it("tells a first value from a missing one", () => {
    expect(compareValues(10, null).state).toBe("new");
    expect(compareValues(null, 10).state).toBe("none");
  });
});

describe("Delta", () => {
  it("says the direction in an arrow, a sign and words", () => {
    const { container } = render(<Delta current={120} previous={100} />);
    expect(text(container.firstChild as Element)).toBe("Up +20%");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Up")).toHaveClass("sr-only");
  });

  it("uses the real minus sign going down", () => {
    const { container } = render(<Delta current={75} previous={100} />);
    expect(text(container.firstChild as Element)).toBe(`Down ${MINUS}25%`);
  });

  it("colors by what the change means, not by its direction", () => {
    const { container, rerender } = render(<Delta current={120} previous={100} />);
    expect(container.firstChild).toHaveClass("text-[var(--status-success-fg)]");
    rerender(<Delta current={120} previous={100} intent="increase-is-bad" />);
    expect(container.firstChild).toHaveClass("text-[var(--status-error-fg)]");
    rerender(<Delta current={120} previous={100} intent="neutral" />);
    expect(container.firstChild).toHaveClass("text-[var(--fg-secondary)]");
  });

  it("never shows a percentage from zero: the difference in value instead", () => {
    const { container } = render(
      <Delta current={5000} previous={0} currency="USD" intent="increase-is-bad" />
    );
    expect(text(container.firstChild as Element)).toBe("Up +$50.00");
    expect(container.textContent).not.toContain("%");
  });

  it("falls back to a plain number when there is no currency", () => {
    const { container } = render(<Delta current={3} previous={0} />);
    expect(text(container.firstChild as Element)).toBe("Up +3");
  });

  it("shows money differences in the provider's currency and locale", () => {
    const { container } = render(
      <FormatProvider locale="pt-BR" currency="BRL">
        <Delta current={10000} previous={12345} format="amount" />
      </FormatProvider>
    );
    expect(text(container.firstChild as Element)).toBe(`Down ${MINUS}R$ 23,45`);
  });

  it("is flat when nothing moved", () => {
    const { container } = render(<Delta current={100} previous={100} />);
    expect(text(container.firstChild as Element)).toBe("No change 0%");
    expect(container.firstChild).toHaveAttribute("data-state", "flat");
  });

  it("marks a first value as new", () => {
    render(<Delta current={10} previous={null} labels={{ new: "novo" }} />);
    expect(screen.getByText("novo")).toBeInTheDocument();
  });

  it("shows a dash with the reason for screen readers and on hover", async () => {
    render(<Delta current={null} previous={100} reason="August has not synced yet" />);
    const dash = screen.getByText("—").parentElement as HTMLElement;
    expect(dash).toHaveTextContent("No comparison: August has not synced yet");
    expect(dash).toHaveAttribute("tabindex", "0");
    await userEvent.hover(dash);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("August has not synced yet");
  });

  it("sits on its tone's soft tint as a pill", () => {
    const { container } = render(
      <Delta current={120} previous={100} intent="increase-is-bad" variant="pill" />
    );
    expect(container.firstChild).toHaveClass(
      "rounded-full",
      "bg-[var(--status-error-soft)]",
      "text-[var(--status-error-fg)]"
    );
  });
});
