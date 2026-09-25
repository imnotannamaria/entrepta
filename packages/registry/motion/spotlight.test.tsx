import { act, render, renderHook, waitFor } from "@testing-library/react";
import type * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { setReducedMotion } from "../test/media";
import { Spotlight, useSpotlight } from "./spotlight";

afterEach(() => setReducedMotion(false));

function pointerAt(clientX: number, clientY: number) {
  const target = document.createElement("div");
  target.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect;
  return { clientX, clientY, currentTarget: target } as unknown as React.MouseEvent<HTMLElement>;
}

describe("useSpotlight", () => {
  it("springs the glow toward the pointer", async () => {
    const { result } = renderHook(() => useSpotlight(400));
    expect(result.current.spotlight.size).toBe(400);
    act(() => result.current.onMouseMove(pointerAt(180, 90)));
    await waitFor(() => expect(result.current.spotlight.x.get()).toBeGreaterThan(0));
  });

  it("leaves the glow at rest with reduced motion", async () => {
    setReducedMotion(true);
    const { result } = renderHook(() => useSpotlight());
    act(() => result.current.onMouseMove(pointerAt(180, 90)));
    await new Promise((r) => setTimeout(r, 50));
    expect(result.current.spotlight.x.get()).toBe(0);
    expect(result.current.spotlight.y.get()).toBe(0);
  });
});

describe("Spotlight", () => {
  it("is a hidden, non-interactive layer painted with --bg-spotlight", () => {
    const { result } = renderHook(() => useSpotlight(300));
    const { container } = render(<Spotlight {...result.current.spotlight} />);
    const layer = container.querySelector<HTMLElement>("[data-spotlight]");
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer).toHaveClass("pointer-events-none");
    expect(layer?.style.background).toContain("var(--bg-spotlight)");
    expect(layer?.style.width).toBe("300px");
  });
});
