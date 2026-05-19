"use client";

import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY, type ThemeId, isThemeId } from "@/lib/theme";
import { useEffect, useRef, useState } from "react";

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(stored)) setTheme(stored);
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

  function handleSelect(id: ThemeId) {
    setTheme(id);
    applyTheme(id);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      // localStorage might be blocked (private mode, etc.) — ignore.
    }
    setOpen(false);
  }

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-12 right-5 z-50 font-mono text-[11px]"
      data-theme-switcher
    >
      <span aria-live="polite" className="sr-only">
        Active theme: {current.label}
      </span>
      {open && (
        <div
          aria-label="Theme"
          className="absolute bottom-[calc(100%+8px)] right-0 flex flex-col gap-1 p-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] min-w-[148px]"
        >
          <div className="px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--fg-muted)] border-b border-[var(--border-subtle)] mb-1">
            theme
          </div>
          {THEMES.map((t) => {
            const isActive = t.id === theme;
            return (
              <button
                type="button"
                aria-pressed={isActive}
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className="group flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-surface-elevated)] focus-visible:outline-none focus-visible:bg-[var(--bg-surface-elevated)] transition-colors text-left"
              >
                <span
                  aria-hidden
                  className="inline-block w-4 h-4 rounded-full border border-[var(--border-subtle)] shrink-0"
                  style={{ background: t.color }}
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
        aria-label={`Theme: ${current.label}. Click to change.`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:border-[var(--fg-brand)] focus-visible:shadow-[0_0_0_3px_var(--bg-surface-brand)] transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
      >
        <span
          aria-hidden
          className="inline-block w-3.5 h-3.5 rounded-full border border-[var(--border-subtle)]"
          style={{ background: current.color }}
        />
        <span className="text-[var(--fg-muted)] uppercase tracking-[0.08em] text-[10px]">
          theme
        </span>
      </button>
    </div>
  );
}
