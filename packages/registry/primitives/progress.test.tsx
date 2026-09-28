import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { setReducedMotion } from "../test/media";
import { Progress } from "./progress";

describe("Progress", () => {
  afterEach(() => setReducedMotion(false));

  it("is a named progressbar with its value in words", () => {
    render(<Progress label="budget" value={75} />);
    const bar = screen.getByRole("progressbar", { name: "budget" });
    expect(bar).toHaveAttribute("aria-valuenow", "75");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuetext", "75%");
  });

  it("clamps the value into its range", () => {
    render(<Progress aria-label="over" value={140} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("starts empty and fills once on screen, sliding on transform", async () => {
    const { container } = render(<Progress aria-label="half" value={50} />);
    const fill = container.querySelector("[role=progressbar] > span") as HTMLElement;
    expect(fill.style.transform).toBe("translateX(-100%)");
    await act(async () => {});
    expect(fill.style.transform).toBe("translateX(-50%)");
  });

  it("is simply full with reduced motion", () => {
    setReducedMotion(true);
    const { container } = render(<Progress aria-label="half" value={50} />);
    const fill = container.querySelector("[role=progressbar] > span") as HTMLElement;
    expect(fill.style.transform).toBe("translateX(-50%)");
  });

  it("counts steps with segments, lit one after another", async () => {
    const { container } = render(<Progress aria-label="months" value={9} max={12} segments={12} />);
    await act(async () => {});
    const steps = container.querySelectorAll<HTMLElement>("[role=progressbar] > span");
    expect(steps[3].style.transitionDelay).toBe("135ms");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "9 of 12");
    expect(container.querySelectorAll("[data-filled]")).toHaveLength(9);
  });

  it("shows the value beside the label when asked", () => {
    render(<Progress label="upload" value={30} showValue />);
    expect(screen.getByText("30%")).toHaveAttribute("aria-hidden", "true");
  });

  it("has no value while indeterminate, and stays still without motion", () => {
    const { container } = render(<Progress aria-label="syncing" indeterminate />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector("[role=progressbar] > span")).toHaveClass(
      "motion-reduce:animate-none"
    );
  });

  it("puts the value in the center of the xl ring", () => {
    render(<Progress variant="ring" size="xl" label="goal" value={62} showValue />);
    expect(screen.getByRole("progressbar", { name: "goal" })).toHaveTextContent("62%");
  });

  it("draws a ring with the same semantics", () => {
    const { container } = render(<Progress variant="ring" label="goal" value={25} />);
    expect(screen.getByRole("progressbar", { name: "goal" })).toHaveAttribute(
      "aria-valuetext",
      "25%"
    );
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("uses the brand by default and a status only when asked, never for a low value", () => {
    const { container, rerender } = render(<Progress aria-label="low" value={3} />);
    expect((container.firstChild as HTMLElement).style.getPropertyValue("--progress-fill")).toBe(
      "var(--fg-brand)"
    );
    rerender(<Progress aria-label="over" value={100} tone="error" />);
    expect((container.firstChild as HTMLElement).style.getPropertyValue("--progress-fill")).toBe(
      "var(--status-error)"
    );
  });
});
