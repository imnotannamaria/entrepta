import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useTheme } from "./use-theme";

const THEMES = [
  { id: "entrepta", label: "entrepta", color: "#7C6BFF", lightColor: "#6B5BFF" },
  { id: "blossom", label: "blossom", color: "#CC2E36" },
  { id: "ivy", label: "ivy", color: "#35A365" },
] as const;

function clearStorage() {
  for (const key of ["entrepta:theme", "entrepta:mode", "myapp:theme", "myapp:mode"]) {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }
}

beforeEach(() => {
  clearStorage();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-mode");
});

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.removeAttribute("data-mode");
});

describe("useTheme", () => {
  it("uses the first theme as default when defaultTheme is omitted", () => {
    const { result } = renderHook(() => useTheme({ themes: THEMES }));
    expect(result.current.theme).toBe("entrepta");
    expect(result.current.mode).toBe("dark");
    expect(result.current.current.id).toBe("entrepta");
  });

  it("honors defaultTheme + defaultMode", () => {
    const { result } = renderHook(() =>
      useTheme({ themes: THEMES, defaultTheme: "ivy", defaultMode: "light" })
    );
    expect(result.current.theme).toBe("ivy");
    expect(result.current.mode).toBe("light");
  });

  it("falls back to first theme when defaultTheme is unknown", () => {
    const { result } = renderHook(() => useTheme({ themes: THEMES, defaultTheme: "nope" }));
    expect(result.current.theme).toBe("entrepta");
  });

  it("throws when themes is empty", () => {
    expect(() => renderHook(() => useTheme({ themes: [] }))).toThrow(/at least one/);
  });

  it("setTheme writes data-theme and localStorage", () => {
    const { result } = renderHook(() => useTheme({ themes: THEMES }));
    act(() => result.current.setTheme("blossom"));
    expect(result.current.theme).toBe("blossom");
    expect(document.documentElement.getAttribute("data-theme")).toBe("blossom");
    expect(window.localStorage.getItem("entrepta:theme")).toBe("blossom");
  });

  it("setTheme ignores unknown ids", () => {
    const { result } = renderHook(() => useTheme({ themes: THEMES }));
    act(() => result.current.setTheme("rogue"));
    expect(result.current.theme).toBe("entrepta");
  });

  it("setMode toggles data-mode and persists", () => {
    const { result } = renderHook(() => useTheme({ themes: THEMES }));
    act(() => result.current.setMode("light"));
    expect(result.current.mode).toBe("light");
    expect(document.documentElement.getAttribute("data-mode")).toBe("light");
    expect(window.localStorage.getItem("entrepta:mode")).toBe("light");

    act(() => result.current.setMode("dark"));
    expect(document.documentElement.getAttribute("data-mode")).toBeNull();
  });

  it("toggleMode flips between dark and light", () => {
    const { result } = renderHook(() => useTheme({ themes: THEMES }));
    act(() => result.current.toggleMode());
    expect(result.current.mode).toBe("light");
    act(() => result.current.toggleMode());
    expect(result.current.mode).toBe("dark");
  });

  it("hydrates from localStorage on mount", () => {
    window.localStorage.setItem("entrepta:theme", "ivy");
    window.localStorage.setItem("entrepta:mode", "light");
    const { result } = renderHook(() => useTheme({ themes: THEMES }));
    expect(result.current.theme).toBe("ivy");
    expect(result.current.mode).toBe("light");
  });

  it("ignores invalid stored values", () => {
    window.localStorage.setItem("entrepta:theme", "rogue");
    window.localStorage.setItem("entrepta:mode", "twilight");
    const { result } = renderHook(() => useTheme({ themes: THEMES }));
    expect(result.current.theme).toBe("entrepta");
    expect(result.current.mode).toBe("dark");
  });

  it("respects a custom storageKey", () => {
    const { result } = renderHook(() => useTheme({ themes: THEMES, storageKey: "myapp" }));
    act(() => result.current.setTheme("blossom"));
    expect(window.localStorage.getItem("myapp:theme")).toBe("blossom");
    expect(window.localStorage.getItem("entrepta:theme")).toBeNull();
  });

  it("disableMode ignores setMode calls", () => {
    const { result } = renderHook(() =>
      useTheme({ themes: THEMES, disableMode: true, defaultMode: "dark" })
    );
    act(() => result.current.setMode("light"));
    expect(result.current.mode).toBe("dark");
    expect(document.documentElement.getAttribute("data-mode")).toBeNull();
  });
});
