import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useUrlFilter } from "./use-url-filter";

const TYPES = ["film", "book"] as const;

afterEach(() => window.history.replaceState(null, "", "/"));

describe("useUrlFilter", () => {
  it("reads an allowed value from the query", () => {
    window.history.replaceState(null, "", "/log?type=film");
    const { result } = renderHook(() => useUrlFilter("type", TYPES));
    expect(result.current[0]).toBe("film");
  });

  it("ignores a value that is not allowed", () => {
    window.history.replaceState(null, "", "/log?type=poem");
    const { result } = renderHook(() => useUrlFilter("type", TYPES));
    expect(result.current[0]).toBeNull();
  });

  it("pushes a history entry and keeps the other params", () => {
    window.history.replaceState(null, "", "/log?view=grid");
    const before = window.history.length;
    const { result } = renderHook(() => useUrlFilter("type", TYPES));
    act(() => result.current[1]("book"));
    expect(window.location.pathname + window.location.search).toBe("/log?view=grid&type=book");
    expect(window.history.length).toBe(before + 1);
    expect(result.current[0]).toBe("book");
  });

  it("clears the param and keeps the path", () => {
    window.history.replaceState(null, "", "/log?type=film");
    const { result } = renderHook(() => useUrlFilter("type", TYPES));
    act(() => result.current[1](null));
    expect(window.location.pathname + window.location.search).toBe("/log");
    expect(result.current[0]).toBeNull();
  });

  it("does not wake a filter on another param", () => {
    const a = renderHook(() => useUrlFilter("type", TYPES));
    const b = renderHook(() => useUrlFilter("year", ["2025", "2026"] as const));
    act(() => a.result.current[1]("film"));
    expect(b.result.current[0]).toBeNull();
  });

  it("replaces the history entry instead of adding one when asked", () => {
    window.history.replaceState(null, "", "/log");
    const before = window.history.length;
    const { result } = renderHook(() => useUrlFilter("type", TYPES, undefined, { replace: true }));
    act(() => result.current[1]("film"));
    expect(window.location.search).toBe("?type=film");
    expect(window.history.length).toBe(before);
  });
});
