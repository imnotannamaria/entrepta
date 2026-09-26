import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Diamond } from "./diamond";

describe("Diamond", () => {
  it("renders the brand mark in the brand color", () => {
    const { container } = render(<Diamond />);
    const mark = container.firstChild as HTMLElement;
    expect(mark.textContent).toBe("◆");
    expect(mark).toHaveClass("text-[var(--fg-brand)]");
  });

  it("is always hidden from screen readers", () => {
    const { container } = render(<Diamond aria-hidden={false} />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("defaults to 9px and accepts 10px", () => {
    const { container, rerender } = render(<Diamond />);
    expect((container.firstChild as HTMLElement).style.fontSize).toBe("9px");
    rerender(<Diamond size={10} />);
    expect((container.firstChild as HTMLElement).style.fontSize).toBe("10px");
  });

  it("merges className and forwards the ref", () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<Diamond ref={ref} className="mr-1" />);
    expect(container.firstChild).toHaveClass("mr-1");
    expect(ref.current).toBe(container.firstChild);
  });
});
