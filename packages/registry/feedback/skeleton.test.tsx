import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton, SkeletonText } from "./skeleton";

describe("Skeleton", () => {
  it("renders a div with animate-pulse class", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
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

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("SkeletonText", () => {
  it("renders the correct number of skeleton lines", () => {
    const { container } = render(<SkeletonText lines={4} />);
    const lines = container.querySelectorAll(".animate-pulse");
    expect(lines.length).toBe(4);
  });

  it("defaults to 3 lines", () => {
    const { container } = render(<SkeletonText />);
    const lines = container.querySelectorAll(".animate-pulse");
    expect(lines.length).toBe(3);
  });

  it("last line is narrower (w-3/4)", () => {
    const { container } = render(<SkeletonText lines={3} />);
    const lines = container.querySelectorAll(".animate-pulse");
    const lastLine = lines[lines.length - 1];
    expect(lastLine).toHaveClass("w-3/4");
  });
});
