import fs from "node:fs";
import path from "node:path";
import { act, render, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ModeToggle } from "../layout/mode-toggle";
import { ThemeSwitcher } from "../layout/theme-switcher";
import { setReducedMotion } from "../test/media";
import { transitionTheme, useMode } from "./use-mode";
import { useTheme } from "./use-theme";

/**
 * A theme switch lands in one frame: transitions are held while it runs, and a
 * browser with view transitions crossfades the whole page. Its own file, since
 * the switch count is module state that frames left over by other tests would
 * disturb.
 */

const root = document.documentElement;
const holding = () => root.hasAttribute("data-theme-switching");

let frames: FrameRequestCallback[] = [];
const runFrame = () => {
  const due = frames;
  frames = [];
  for (const callback of due) callback(0);
};

type FakeTransition = { update: Promise<void>; finish: () => Promise<void> };
let transitions: FakeTransition[] = [];

/** A startViewTransition that runs the update a tick later and finishes when told. */
function installViewTransitions() {
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: (update: () => void) => {
      let resolve = () => {};
      const finished = new Promise<void>((r) => {
        resolve = r;
      });
      const updated = Promise.resolve().then(update);
      transitions.push({
        update: updated,
        finish: async () => {
          resolve();
          await finished;
        },
      });
      return { ready: updated, finished, updateCallbackDone: updated };
    },
  });
}

beforeEach(() => {
  frames = [];
  transitions = [];
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.push(callback);
    return frames.length;
  });
});

afterEach(async () => {
  // end every switch a test left open, so the count starts at zero again
  for (const t of transitions) await t.finish();
  runFrame();
  runFrame();
  Reflect.deleteProperty(document, "startViewTransition");
  setReducedMotion(false);
  vi.restoreAllMocks();
  window.localStorage.clear();
  root.removeAttribute("data-mode");
  root.removeAttribute("data-theme");
});

describe("transitionTheme", () => {
  it("changes the page at once with transitions held, and lets them go after a painted frame", () => {
    transitionTheme(() => root.setAttribute("data-mode", "light"));
    expect(root.getAttribute("data-mode")).toBe("light");
    expect(holding()).toBe(true);
    runFrame();
    // released before this frame paints, every component would ease into the change
    expect(holding()).toBe(true);
    runFrame();
    expect(holding()).toBe(false);
  });

  it("crossfades through a view transition where the browser has one", async () => {
    installViewTransitions();
    transitionTheme(() => root.setAttribute("data-mode", "light"));
    expect(transitions).toHaveLength(1);
    expect(holding()).toBe(true);
    await transitions[0].update;
    expect(root.getAttribute("data-mode")).toBe("light");
    expect(holding()).toBe(true);
    await transitions[0].finish();
    expect(holding()).toBe(false);
  });

  it("switches at once with reduced motion, even where view transitions exist", () => {
    installViewTransitions();
    setReducedMotion(true);
    transitionTheme(() => root.setAttribute("data-mode", "light"));
    expect(transitions).toHaveLength(0);
    expect(root.getAttribute("data-mode")).toBe("light");
  });

  it("holds transitions until the last of two overlapping switches ends", async () => {
    installViewTransitions();
    transitionTheme(() => root.setAttribute("data-mode", "light"));
    transitionTheme(() => root.removeAttribute("data-mode"));
    await transitions[0].finish();
    expect(holding()).toBe(true);
    await transitions[1].finish();
    expect(holding()).toBe(false);
  });

  it("lets transitions go even when the change itself throws", () => {
    expect(() =>
      transitionTheme(() => {
        throw new Error("broken switch");
      })
    ).toThrow("broken switch");
    runFrame();
    runFrame();
    expect(holding()).toBe(false);
  });

  it("does not reject when a newer switch skips this one", async () => {
    const unhandled = vi.fn();
    window.addEventListener("unhandledrejection", unhandled);
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: (update: () => void) => {
        update();
        const ready = Promise.reject(new DOMException("Transition was skipped", "AbortError"));
        return { ready, finished: Promise.resolve() };
      },
    });
    transitionTheme(() => root.setAttribute("data-mode", "light"));
    await new Promise((r) => setTimeout(r, 0));
    window.removeEventListener("unhandledrejection", unhandled);
    expect(unhandled).not.toHaveBeenCalled();
    expect(holding()).toBe(false);
  });
});

describe("the hooks switch through it", () => {
  const THEMES = [
    { id: "entrepta", label: "entrepta", color: "#7C6BFF" },
    { id: "ivy", label: "ivy", color: "#35A365" },
  ];

  it("useMode", async () => {
    installViewTransitions();
    const { result } = renderHook(() => useMode());
    act(() => result.current.setMode("light"));
    expect(transitions).toHaveLength(1);
    await act(() => transitions[0].update);
    expect(root.getAttribute("data-mode")).toBe("light");
  });

  it("useTheme, for the preset as well as the mode", async () => {
    installViewTransitions();
    const { result } = renderHook(() => useTheme({ themes: THEMES }));
    act(() => result.current.setTheme("ivy"));
    act(() => result.current.setMode("light"));
    expect(transitions).toHaveLength(2);
    await act(() => Promise.all(transitions.map((t) => t.update)));
    expect(root.getAttribute("data-theme")).toBe("ivy");
    expect(root.getAttribute("data-mode")).toBe("light");
  });
});

describe("the stylesheet and the toggles", () => {
  const css = fs.readFileSync(path.join(__dirname, "../styles/globals.css"), "utf8");

  it("holds every transition during a switch, except what opts out", () => {
    const rule =
      /:root\[data-theme-switching\] \*:not\(\[data-theme-motion\]\)[^{]*\{\s*transition: none !important;/;
    expect(css).toMatch(rule);
    expect(css).toMatch(/:root\[data-theme-switching\]::view-transition-group\(\*\)/);
  });

  it("keeps the sun and moon turning in both toggles", () => {
    const { container, unmount } = render(<ModeToggle />);
    expect(container.querySelectorAll("[data-icon][data-theme-motion]")).toHaveLength(2);
    unmount();
    render(<ThemeSwitcher themes={[{ id: "entrepta", label: "entrepta", color: "#7C6BFF" }]} />);
    act(() => document.querySelector<HTMLButtonElement>("[aria-haspopup]")?.click());
    expect(document.querySelectorAll("[data-icon][data-theme-motion]")).toHaveLength(2);
  });
});
