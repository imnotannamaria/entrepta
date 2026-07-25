import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useMode } from "./use-mode";

function clearStorage() {
  for (const key of ["entrepta:mode", "myapp:mode"]) {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }
}

beforeEach(() => {
  clearStorage();
  document.documentElement.removeAttribute("data-mode");
});

afterEach(() => {
  document.documentElement.removeAttribute("data-mode");
});

describe("useMode", () => {
  it("defaults to dark with no options", () => {
    const { result } = renderHook(() => useMode());
    expect(result.current.mode).toBe("dark");
    expect(document.documentElement.getAttribute("data-mode")).toBeNull();
  });

  it("honors defaultMode and applies the attribute on mount", () => {
    const { result } = renderHook(() => useMode({ defaultMode: "light" }));
    expect(result.current.mode).toBe("light");
    expect(document.documentElement.getAttribute("data-mode")).toBe("light");
  });

  it("setMode writes data-mode and localStorage", () => {
    const { result } = renderHook(() => useMode());
    act(() => result.current.setMode("light"));
    expect(result.current.mode).toBe("light");
    expect(document.documentElement.getAttribute("data-mode")).toBe("light");
    expect(window.localStorage.getItem("entrepta:mode")).toBe("light");

    act(() => result.current.setMode("dark"));
    expect(document.documentElement.getAttribute("data-mode")).toBeNull();
    expect(window.localStorage.getItem("entrepta:mode")).toBe("dark");
  });

  it("toggleMode flips between dark and light", () => {
    const { result } = renderHook(() => useMode());
    act(() => result.current.toggleMode());
    expect(result.current.mode).toBe("light");
    act(() => result.current.toggleMode());
    expect(result.current.mode).toBe("dark");
  });

  it("hydrates from localStorage on mount", () => {
    window.localStorage.setItem("entrepta:mode", "light");
    const { result } = renderHook(() => useMode());
    expect(result.current.mode).toBe("light");
    expect(document.documentElement.getAttribute("data-mode")).toBe("light");
  });

  it("ignores invalid stored values", () => {
    window.localStorage.setItem("entrepta:mode", "twilight");
    const { result } = renderHook(() => useMode());
    expect(result.current.mode).toBe("dark");
  });

  it("respects a custom storageKey", () => {
    const { result } = renderHook(() => useMode({ storageKey: "myapp" }));
    act(() => result.current.setMode("light"));
    expect(window.localStorage.getItem("myapp:mode")).toBe("light");
    expect(window.localStorage.getItem("entrepta:mode")).toBeNull();
  });

  it("disableMode ignores setMode and stored values", () => {
    window.localStorage.setItem("entrepta:mode", "light");
    const { result } = renderHook(() => useMode({ disableMode: true }));
    expect(result.current.mode).toBe("dark");
    act(() => result.current.setMode("light"));
    expect(result.current.mode).toBe("dark");
    expect(document.documentElement.getAttribute("data-mode")).toBeNull();
  });
});
