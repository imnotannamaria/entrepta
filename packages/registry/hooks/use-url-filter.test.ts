import { act, renderHook } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { useUrlFilter, useUrlFilterList } from "./use-url-filter";

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

describe("useUrlFilterList", () => {
  const CATEGORIES = ["food", "rent", "travel"] as const;

  it("reads every allowed value, drops the rest and counts each once", () => {
    window.history.replaceState(null, "", "/?c=food&c=hack&c=travel&c=food");
    const { result } = renderHook(() => useUrlFilterList("c", CATEGORIES));
    expect(result.current[0]).toEqual(["food", "travel"]);
  });

  it("returns the same array while the URL has not changed", () => {
    window.history.replaceState(null, "", "/?c=food");
    const { result, rerender } = renderHook(() => useUrlFilterList("c", CATEGORIES));
    const first = result.current[0];
    rerender();
    expect(result.current[0]).toBe(first);
  });

  it("writes the values as repeated params and keeps the others", () => {
    window.history.replaceState(null, "", "/?period=2026-09");
    const { result } = renderHook(() => useUrlFilterList("c", CATEGORIES));
    act(() => result.current[1](["rent", "food", "rent"]));
    expect(window.location.search).toBe("?period=2026-09&c=rent&c=food");
    expect(result.current[0]).toEqual(["food", "rent"]);
    act(() => result.current[1]([]));
    expect(window.location.search).toBe("?period=2026-09");
  });

  it("is empty in the server render, so every item is in the HTML", () => {
    window.history.replaceState(null, "", "/?c=food");
    function Probe() {
      const [active] = useUrlFilterList("c", CATEGORIES);
      return createElement("span", null, active.length ? active.join(",") : "all");
    }
    expect(renderToString(createElement(Probe))).toContain("all");
  });
});
