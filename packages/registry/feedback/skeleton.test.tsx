import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton, SkeletonText } from "./skeleton";

describe("Skeleton", () => {
  it("applies the shimmer animation via inline style", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.animation).toContain("shimmer");
    expect(el.style.backgroundSize).toContain("200%");
  });

  it("applies a horizontal gradient background", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundImage).toContain("linear-gradient(90deg");
    expect(el.style.backgroundImage).toContain("var(--bg-surface)");
    expect(el.style.backgroundImage).toContain("var(--bg-surface-elevated)");
  });

  it("applies rect variant by default", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("rounded-[var(--radius-sm)]");
  });

  it("applies circle variant — rounded-full", () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("applies line variant — full width, fixed height", () => {
    const { container } = render(<Skeleton variant="line" />);
    expect(container.firstChild).toHaveClass("h-4", "w-full");
  });

  it("has aria-hidden for screen readers", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("merges custom className", () => {
    const { container } = render(<Skeleton className="w-10 h-10" />);
    expect(container.firstChild).toHaveClass("w-10", "h-10");
  });

  it("merges custom inline style without dropping animation", () => {
    const { container } = render(<Skeleton style={{ width: 50 }} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("50px");
    expect(el.style.animation).toContain("shimmer");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("SkeletonText", () => {
  it("renders the correct number of skeleton lines", () => {
    const { container } = render(<SkeletonText lines={4} />);
    const lines = container.querySelectorAll("[aria-hidden='true']");
    expect(lines.length).toBe(4);
  });

  it("defaults to 3 lines", () => {
    const { container } = render(<SkeletonText />);
    const lines = container.querySelectorAll("[aria-hidden='true']");
    expect(lines.length).toBe(3);
  });

  it("last line is narrower (w-3/4)", () => {
    const { container } = render(<SkeletonText lines={3} />);
    const lines = container.querySelectorAll("[aria-hidden='true']");
    const lastLine = lines[lines.length - 1];
    expect(lastLine).toHaveClass("w-3/4");
  });
});
