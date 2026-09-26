import { render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { EASE_OUT, revealViewport } from "../lib/motion";
import { setReducedMotion } from "../test/media";
import { Reveal, useReveal } from "./reveal";

afterEach(() => setReducedMotion(false));

describe("useReveal", () => {
  it("rises 14px and fades in over 0.5s, once, when a quarter is in view", () => {
    const { result } = renderHook(() => useReveal(0.2));
    expect(result.current.initial).toEqual({ opacity: 0, y: 14 });
    expect(result.current.whileInView).toEqual({ opacity: 1, y: 0 });
    expect(result.current.viewport).toBe(revealViewport);
    expect(revealViewport).toEqual({ once: true, amount: 0.25 });
    expect(result.current.transition).toEqual({ duration: 0.5, ease: EASE_OUT, delay: 0.2 });
  });

  it("drops the movement, the duration and the delay with reduced motion", () => {
    setReducedMotion(true);
    const { result } = renderHook(() => useReveal(0.2));
    expect(result.current.initial).toEqual({ opacity: 0, y: 0 });
    expect(result.current.transition).toMatchObject({ duration: 0, delay: 0 });
  });

  it("uses whileInView, never animate", () => {
    const { result } = renderHook(() => useReveal());
    expect(result.current).not.toHaveProperty("animate");
  });
});

describe("Reveal", () => {
  it("renders its children from the first render", () => {
    render(<Reveal>card body</Reveal>);
    expect(screen.getByText("card body")).toBeInTheDocument();
  });

  it("starts hidden and lowered, so the entrance has somewhere to come from", () => {
    const { container } = render(<Reveal>x</Reveal>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe("0");
    expect(el.style.transform).toContain("14px");
  });
});
