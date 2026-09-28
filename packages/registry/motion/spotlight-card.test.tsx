import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SpotlightCard } from "./spotlight-card";

describe("SpotlightCard", () => {
  it("is a Card with the glow as its first layer", () => {
    const { container } = render(<SpotlightCard variant="featured">hello</SpotlightCard>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-[var(--bg-surface-brand)]");
    expect(card.firstChild).toHaveAttribute("data-spotlight");
  });

  it("lays its children out over the glow with the Card's gap", () => {
    render(
      <SpotlightCard>
        <span>one</span>
        <span>two</span>
      </SpotlightCard>
    );
    const layer = screen.getByText("one").parentElement as HTMLElement;
    expect(layer).toHaveClass("relative", "flex-col", "[gap:inherit]");
  });

  it("hands the alignment set on the card down to its children", () => {
    render(
      <SpotlightCard className="justify-center">
        <span>centered</span>
      </SpotlightCard>
    );
    const layer = screen.getByText("centered").parentElement as HTMLElement;
    expect(layer).toHaveClass("[justify-content:inherit]", "[align-items:inherit]");
  });

  it("still calls your own onMouseMove", () => {
    const onMouseMove = vi.fn();
    const { container } = render(<SpotlightCard onMouseMove={onMouseMove}>x</SpotlightCard>);
    fireEvent.mouseMove(container.firstChild as HTMLElement, { clientX: 10, clientY: 10 });
    expect(onMouseMove).toHaveBeenCalled();
  });
});
