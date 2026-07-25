"use client";

import * as React from "react";

type ThemeMode = "dark" | "light";

interface UseModeOptions {
  /** Mode used when nothing is stored. Default `"dark"`. */
  defaultMode?: ThemeMode;
  /**
   * localStorage key prefix. The hook stores `${storageKey}:mode`. Default
   * `"entrepta"`. Keep it in sync with `useTheme` if you use both.
   */
  storageKey?: string;
  /** Lock the mode to `defaultMode`. Setters become no-ops. */
  disableMode?: boolean;
}

interface UseModeReturn {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

function applyModeAttribute(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  if (mode === "light") document.documentElement.setAttribute("data-mode", "light");
  else document.documentElement.removeAttribute("data-mode");
}

function safeRead(key: string): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: string) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  } catch {}
}

/**
 * Dark/light mode only. Drives `data-mode` on `<html>` and persists the
 * choice. Use `useTheme` instead when you also need the color presets.
 */
function useMode(options: UseModeOptions = {}): UseModeReturn {
  const { defaultMode = "dark", storageKey = "entrepta", disableMode } = options;

  const modeKey = `${storageKey}:mode`;
  const [mode, setModeState] = React.useState<ThemeMode>(defaultMode);

  // Hydrate from storage once on mount. ModeScript already applied the
  // attribute pre-paint, so this mostly syncs React state to match. It also
  // covers the case where nothing is stored and the default is light.
  React.useEffect(() => {
    const stored = disableMode ? null : safeRead(modeKey);
    if (stored === "dark" || stored === "light") {
      setModeState(stored);
      applyModeAttribute(stored);
      return;
    }
    if (defaultMode === "light") applyModeAttribute("light");
  }, [modeKey, defaultMode, disableMode]);

  const setMode = React.useCallback(
    (next: ThemeMode) => {
      if (disableMode) return;
      setModeState(next);
      applyModeAttribute(next);
      safeWrite(modeKey, next);
    },
    [modeKey, disableMode]
  );

  const toggleMode = React.useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  return { mode, setMode, toggleMode };
}

export { useMode };
export type { ThemeMode, UseModeOptions, UseModeReturn };
