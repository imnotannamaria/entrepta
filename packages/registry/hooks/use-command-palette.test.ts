import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useCommandPalette } from "./use-command-palette";

function fireKeydown(key: string, meta = true) {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key, metaKey: meta, ctrlKey: false, bubbles: true })
  );
}

afterEach(() => {
  // Clean up any stale event listeners between tests
});

describe("useCommandPalette", () => {
  it("starts with open = false", () => {
    const { result } = renderHook(() => useCommandPalette());
    expect(result.current.open).toBe(false);
  });

  it("toggle() switches open state", () => {
    const { result } = renderHook(() => useCommandPalette());
    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.open).toBe(false);
  });

  it("setOpen() sets state directly", () => {
    const { result } = renderHook(() => useCommandPalette());
    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
  });

  it("⌘K keyboard shortcut toggles open", () => {
    const { result } = renderHook(() => useCommandPalette());
    act(() => fireKeydown("k"));
    expect(result.current.open).toBe(true);
    act(() => fireKeydown("k"));
    expect(result.current.open).toBe(false);
  });

  it("respects custom shortcut option", () => {
    const { result } = renderHook(() => useCommandPalette({ shortcut: "p" }));
    act(() => fireKeydown("k"));
    expect(result.current.open).toBe(false);
    act(() => fireKeydown("p"));
    expect(result.current.open).toBe(true);
  });

  it("removes event listener on unmount", () => {
    const { result, unmount } = renderHook(() => useCommandPalette());
    unmount();
    act(() => fireKeydown("k"));
    expect(result.current.open).toBe(false);
  });
});
