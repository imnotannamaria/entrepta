import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sparkline } from "./sparkline";

describe("Sparkline", () => {
  it("is decoration for screen readers", () => {
    const { container } = render(<Sparkline data={[1, 3, 2]} />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("draws the line from the oldest value to the newest, low values at the bottom", () => {
    const { container } = render(<Sparkline data={[0, 10]} area={false} dot={false} />);
    const line = container.querySelector("path")?.getAttribute("d");
    expect(line).toBe("M0.00 30.00 L100.00 2.00");
  });

  it("fills under the line with a gradient of its color", () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);
    const [area, line] = container.querySelectorAll("path");
    expect(area.getAttribute("fill")).toMatch(/^url\(#spark-/);
    // through CSS, since an SVG attribute does not read a variable
    expect(line.getAttribute("stroke")).toBeNull();
    expect(line.style.stroke).toBe("var(--spark)");
    expect((container.firstChild as HTMLElement).style.getPropertyValue("--spark")).toBe(
      "var(--chart-1)"
    );
  });

  it("puts a round dot on the last value", () => {
    const { container } = render(<Sparkline data={[4, 2, 4]} tone="success" />);
    const dot = container.querySelector("span.rounded-full") as HTMLElement;
    expect(dot.style.left).toBe("100%");
    expect(dot.style.top).toBe("6.25%");
  });

  it("draws nothing without two finite values", () => {
    expect(render(<Sparkline data={[5]} />).container.firstChild).toBeNull();
    expect(render(<Sparkline data={[Number.NaN, 2]} />).container.firstChild).toBeNull();
  });

  it("keeps a flat series in the middle band rather than dividing by zero", () => {
    const { container } = render(<Sparkline data={[3, 3, 3]} area={false} dot={false} />);
    expect(container.querySelector("path")?.getAttribute("d")).not.toContain("NaN");
  });
});
