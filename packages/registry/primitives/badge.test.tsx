import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>active</Badge>);
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    const { container } = render(<Badge>label</Badge>);
    expect(container.firstChild?.nodeName).toBe("SPAN");
  });

  it("applies solid brand variant", () => {
    const { container } = render(
      <Badge variant="solid" color="brand">
        brand
      </Badge>
    );
    expect(container.firstChild).toHaveClass("bg-[var(--fg-brand)]");
  });

  it("applies soft neutral variant by default", () => {
    const { container } = render(<Badge>default</Badge>);
    expect(container.firstChild).toHaveClass("bg-[var(--bg-hover-strong)]");
  });

  it("applies soft success with token bg/fg", () => {
    const { container } = render(
      <Badge variant="soft" color="success">
        ok
      </Badge>
    );
    expect(container.firstChild).toHaveClass("bg-[var(--status-success-soft)]");
    expect(container.firstChild).toHaveClass("text-[var(--status-success-fg)]");
  });

  it("renders status dot when dot prop is true", () => {
    const { container } = render(
      <Badge variant="soft" color="success" dot>
        live
      </Badge>
    );
    const dot = container.querySelector("[aria-hidden]");
    expect(dot).not.toBeNull();
    expect(dot).toHaveClass("bg-[var(--status-success)]");
  });

  it("does not render dot by default", () => {
    const { container } = render(<Badge>plain</Badge>);
    expect(container.querySelector("[aria-hidden]")).toBeNull();
  });

  it("applies outline success variant", () => {
    const { container } = render(
      <Badge variant="outline" color="success">
        ok
      </Badge>
    );
    expect(container.firstChild).toHaveClass("border-[var(--status-success)]");
  });

  it("applies sm size class", () => {
    const { container } = render(<Badge size="sm">sm</Badge>);
    expect(container.firstChild).toHaveClass("h-5");
  });

  it("applies md size class by default", () => {
    const { container } = render(<Badge>md</Badge>);
    expect(container.firstChild).toHaveClass("h-6");
  });

  it("applies solid error variant", () => {
    const { container } = render(
      <Badge variant="solid" color="error">
        err
      </Badge>
    );
    expect(container.firstChild).toHaveClass("bg-[var(--status-error)]");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Badge ref={ref}>ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("merges custom className", () => {
    const { container } = render(<Badge className="my-class">cls</Badge>);
    expect(container.firstChild).toHaveClass("my-class");
  });
});
