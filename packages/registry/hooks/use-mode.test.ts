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

  it("clears a data-mode the pre-paint script left behind when it is locked out", () => {
    // ModeScript ran, saw a stored "light" and set the attribute. The hook then
    // mounts locked to dark, so the page must not stay light.
    window.localStorage.setItem("entrepta:mode", "light");
    document.documentElement.setAttribute("data-mode", "light");
    const { result } = renderHook(() => useMode({ disableMode: true }));
    expect(result.current.mode).toBe("dark");
    expect(document.documentElement.getAttribute("data-mode")).toBeNull();
  });

  it("keeps every instance on the same storage key in sync", () => {
    const { result } = renderHook(() => ({ nav: useMode(), corner: useMode() }));
    act(() => result.current.nav.toggleMode());
    expect(result.current.nav.mode).toBe("light");
    expect(result.current.corner.mode).toBe("light");

    act(() => result.current.corner.toggleMode());
    expect(result.current.nav.mode).toBe("dark");
    expect(result.current.corner.mode).toBe("dark");
  });

  it("does not sync instances on different storage keys", () => {
    const { result } = renderHook(() => ({
      a: useMode(),
      b: useMode({ storageKey: "myapp" }),
    }));
    act(() => result.current.a.toggleMode());
    expect(result.current.a.mode).toBe("light");
    expect(result.current.b.mode).toBe("dark");
  });

  it("follows a mode change made in another tab", () => {
    const { result } = renderHook(() => useMode());
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "entrepta:mode", newValue: "light" })
      );
    });
    expect(result.current.mode).toBe("light");
    expect(document.documentElement.getAttribute("data-mode")).toBe("light");
  });
});
