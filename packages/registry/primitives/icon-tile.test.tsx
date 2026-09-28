import { ForkKnifeIcon } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { IconTile } from "./icon-tile";

describe("IconTile", () => {
  it("is decorative unless it is named", () => {
    const { container, rerender } = render(<IconTile icon={ForkKnifeIcon} />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    rerender(<IconTile icon={ForkKnifeIcon} aria-label="food" />);
    expect(screen.getByRole("img", { name: "food" })).toBeInTheDocument();
  });

  it("tints a palette color over the card and draws the glyph in the full color", () => {
    const { container } = render(<IconTile icon={ForkKnifeIcon} color="chart-3" />);
    expect(container.firstChild).toHaveClass(
      "bg-[color-mix(in_srgb,var(--chart-3)_15%,var(--bg-card))]",
      "text-[var(--chart-3)]"
    );
  });

  it("uses the brand ink on the brand tint, not the raw brand", () => {
    const { container } = render(<IconTile icon={ForkKnifeIcon} color="brand" />);
    expect(container.firstChild).toHaveClass(
      "bg-[var(--bg-surface-brand)]",
      "text-[var(--fg-brand-text)]"
    );
    expect(container.firstChild).not.toHaveClass("text-[var(--fg-brand)]");
  });

  it("takes an icon element too, for a server file", () => {
    const { container } = render(<IconTile icon={<ForkKnifeIcon />} size="lg" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("size-10");
  });

  it("cuts a badge out of the surface in the corner", () => {
    const { container } = render(
      <IconTile icon={ForkKnifeIcon} badge={<span data-testid="bank" />} />
    );
    const slot = screen.getByTestId("bank").parentElement;
    expect(slot).toHaveClass("ring-[var(--cutout,var(--bg-canvas))]", "rounded-full");
    expect(container.firstChild).toContainElement(slot);
  });

  it("forwards its ref", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<IconTile ref={ref} icon={ForkKnifeIcon} />);
    expect(ref.current?.tagName).toBe("SPAN");
  });
});
