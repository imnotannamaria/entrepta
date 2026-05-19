"use client";

import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  MODE_STORAGE_KEY,
  type Mode,
  THEMES,
  THEME_STORAGE_KEY,
  type ThemeId,
  isMode,
  isThemeId,
} from "@/lib/theme";
import { useEffect, useRef, useState } from "react";

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
}

function applyMode(mode: Mode) {
  if (mode === "light") document.documentElement.setAttribute("data-mode", "light");
  else document.documentElement.removeAttribute("data-mode");
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [mode, setMode] = useState<Mode>(DEFAULT_MODE);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(storedTheme)) setTheme(storedTheme);
    const storedMode = localStorage.getItem(MODE_STORAGE_KEY);
    if (isMode(storedMode)) setMode(storedMode);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSelectTheme(id: ThemeId) {
    setTheme(id);
    applyTheme(id);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {}
    setOpen(false);
  }

  function handleToggleMode() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyMode(next);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {}
  }

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  const currentColor = mode === "light" ? current.lightColor : current.color;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-12 right-5 z-50 font-mono text-[11px]"
      data-theme-switcher
    >
      <span aria-live="polite" className="sr-only">
        Active theme: {current.label}, {mode} mode.
      </span>

      {open && (
        <div
          aria-label="Theme settings"
          className="absolute bottom-[calc(100%+8px)] right-0 flex flex-col gap-1 p-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] min-w-[180px]"
        >
          <div className="px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--fg-muted)] border-b border-[var(--border-subtle)] mb-1">
            mode
          </div>
          <button
            type="button"
            aria-pressed={mode === "light"}
            onClick={handleToggleMode}
            className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-hover-soft)] focus-visible:outline-none focus-visible:bg-[var(--bg-hover-soft)] transition-colors text-left"
          >
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="inline-grid place-items-center w-4 h-4 rounded-full border border-[var(--border-subtle)] text-[10px] leading-none"
                style={{
                  background: mode === "dark" ? "#09090b" : "#fafafa",
                  color: mode === "dark" ? "#fafafa" : "#09090b",
                }}
              >
                {mode === "dark" ? "◗" : "◖"}
              </span>
              <span className="text-[var(--fg-primary)]">{mode}</span>
            </span>
            <span className="text-[var(--fg-muted)] text-[10px] uppercase tracking-[0.08em]">
              {mode === "dark" ? "→ light" : "→ dark"}
            </span>
          </button>

          <div className="px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--fg-muted)] border-b border-[var(--border-subtle)] mt-2 mb-1">
            theme
          </div>
          {THEMES.map((t) => {
            const isActive = t.id === theme;
            const dotColor = mode === "light" ? t.lightColor : t.color;
            return (
              <button
                type="button"
                aria-pressed={isActive}
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                className="group flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-hover-soft)] focus-visible:outline-none focus-visible:bg-[var(--bg-hover-soft)] transition-colors text-left"
              >
                <span
                  aria-hidden
                  className="inline-block w-4 h-4 rounded-full border border-[var(--border-subtle)] shrink-0"
                  style={{ background: dotColor }}
                />
                <span
                  className={
                    isActive
                      ? "text-[var(--fg-primary)] flex-1"
                      : "text-[var(--fg-secondary)] flex-1 group-hover:text-[var(--fg-primary)] transition-colors"
                  }
                >
                  {t.label}
                </span>
                {isActive && (
                  <span aria-hidden className="text-[var(--fg-brand)] text-[10px] leading-none">
                    ◆
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        aria-label={`Theme: ${current.label}, ${mode} mode. Click to change.`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:border-[var(--fg-brand)] focus-visible:shadow-[0_0_0_3px_var(--bg-surface-brand)] transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
      >
        <span
          aria-hidden
          className="inline-block w-3.5 h-3.5 rounded-full border border-[var(--border-subtle)]"
          style={{ background: currentColor }}
        />
        <span className="text-[var(--fg-muted)] uppercase tracking-[0.08em] text-[10px]">
          {mode}
        </span>
      </button>
    </div>
  );
}
