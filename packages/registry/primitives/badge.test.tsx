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

  it("puts the theme's ink on a solid brand fill", () => {
    const { container } = render(
      <Badge variant="solid" color="brand">
        new
      </Badge>
    );
    expect(container.firstChild).toHaveClass("text-[var(--fg-on-brand)]");
  });

  it("uses the brand text ink for soft and outline brand", () => {
    const { container, rerender } = render(
      <Badge variant="soft" color="brand">
        beta
      </Badge>
    );
    expect(container.firstChild).toHaveClass("text-[var(--fg-brand-text)]");
    rerender(
      <Badge variant="outline" color="brand">
        beta
      </Badge>
    );
    expect(container.firstChild).toHaveClass("text-[var(--fg-brand-text)]");
  });

  it("uses a dark ink on every solid status fill", () => {
    for (const color of ["success", "warning", "error", "info"] as const) {
      const { container, unmount } = render(
        <Badge variant="solid" color={color}>
          {color}
        </Badge>
      );
      expect(container.firstChild).toHaveClass("text-[var(--zinc-950)]");
      unmount();
    }
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

  it("renders a Phosphor icon in place of the dot, sized to the badge", () => {
    function FakeIcon(props: { size?: number; "aria-hidden"?: boolean }) {
      return <svg data-size={props.size} aria-hidden={props["aria-hidden"]} />;
    }
    const { container, rerender } = render(
      <Badge icon={FakeIcon as never} dot>
        shipped
      </Badge>
    );
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(container.querySelector("svg")).toHaveAttribute("data-size", "12");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".rounded-full")).toBeNull();
    rerender(
      <Badge icon={FakeIcon as never} size="sm">
        shipped
      </Badge>
    );
    expect(container.querySelector("svg")).toHaveAttribute("data-size", "10");
  });
});
