import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { FormatProvider } from "../hooks/use-format";
import { MINUS } from "../lib/format";
import { Amount } from "./amount";

const text = (el: Element | null) => el?.textContent?.replace(/[  ]/g, " ");

describe("Amount", () => {
  it("formats minor units in the currency and locale it is given", () => {
    const { container } = render(<Amount value={123456} currency="BRL" locale="pt-BR" />);
    expect(text(container.firstChild as Element)).toBe("R$ 1.234,56");
  });

  it("reads the currency and locale from a FormatProvider", () => {
    const { container } = render(
      <FormatProvider locale="de-DE" currency="EUR">
        <Amount value={123456} />
      </FormatProvider>
    );
    expect(text(container.firstChild as Element)).toBe("1.234,56 €");
  });

  it("lets a prop win over the provider", () => {
    const { container } = render(
      <FormatProvider locale="en-US" currency="EUR">
        <Amount value={500} currency="USD" />
      </FormatProvider>
    );
    expect(container.textContent).toBe("$5.00");
  });

  it("says what is missing when there is no currency anywhere", () => {
    const quiet = console.error;
    console.error = () => {};
    expect(() => render(<Amount value={100} />)).toThrow("needs a currency");
    console.error = quiet;
  });

  it("is mono with tabular figures, so a column lines up", () => {
    const { container } = render(<Amount value={100} currency="USD" />);
    expect(container.firstChild).toHaveClass("font-mono", "tabular-nums");
  });

  it("mutes the currency symbol, and the cents when asked", () => {
    render(<Amount value={123456} currency="USD" muteCents />);
    expect(screen.getByText("$")).toHaveClass("text-[var(--fg-muted)]");
    expect(screen.getByText("56")).toHaveClass("text-[var(--fg-muted)]");
    expect(screen.getByText("1")).not.toHaveClass("text-[var(--fg-muted)]");
  });

  it("colors by the sign with tone auto, and always shows the sign then", () => {
    const { container, rerender } = render(<Amount value={-4500} currency="USD" tone="auto" />);
    expect(container.firstChild).toHaveClass("text-[var(--status-error-fg)]");
    expect(container.textContent).toBe(`${MINUS}$45.00`);
    rerender(<Amount value={4500} currency="USD" tone="auto" />);
    expect(container.firstChild).toHaveClass("text-[var(--status-success-fg)]");
    expect(container.textContent).toBe("+$45.00");
  });

  it("keeps a neutral amount unsigned unless asked", () => {
    const { container, rerender } = render(<Amount value={4500} currency="USD" />);
    expect(container.textContent).toBe("$45.00");
    rerender(<Amount value={4500} currency="USD" signDisplay="always" />);
    expect(container.textContent).toBe("+$45.00");
  });

  it("compacts on screen and keeps the full value for screen readers and hover", () => {
    const { container } = render(
      <Amount value={123456789} currency="USD" compact data-testid="amount" />
    );
    const root = screen.getByTestId("amount");
    expect(root).toHaveAttribute("title", "$1,234,567.89");
    expect(container.querySelector("[aria-hidden]")?.textContent).toBe("$1.2M");
    expect(container.querySelector(".sr-only")?.textContent).toBe("$1,234,567.89");
  });

  it("forwards its ref", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Amount ref={ref} value={1} currency="USD" />);
    expect(ref.current?.tagName).toBe("SPAN");
  });
});
