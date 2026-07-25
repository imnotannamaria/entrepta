"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";
import type { ThemeMode } from "../hooks/use-mode";
import { type ThemeOption, type UseThemeOptions, useTheme } from "../hooks/use-theme";
import { cn } from "../lib/utils";

type SwitcherPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

interface ThemeSwitcherProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange">,
    UseThemeOptions {
  /** Where the floating button anchors. Default `"bottom-right"`. */
  position?: SwitcherPosition;
  /** Hide the dark/light section. Default `false`. */
  hideModeToggle?: boolean;
  /** Label for the screen-reader-only live region. Default `"Active theme"`. */
  liveLabel?: string;
}

/** Sun in light mode, moon in dark mode. Shows the mode you are in, not the one you get. */
function ModeIcon({ mode }: { mode: ThemeMode }) {
  const Icon = mode === "dark" ? Moon : Sun;
  return (
    <Icon
      aria-hidden
      className="text-[var(--fg-primary)]"
      style={{ width: 14, height: 14, strokeWidth: 1.5 }}
    />
  );
}

const POSITION_CLASS: Record<SwitcherPosition, string> = {
  "bottom-right": "bottom-12 right-5",
  "bottom-left": "bottom-12 left-5",
  "top-right": "top-5 right-5",
  "top-left": "top-5 left-5",
};

const ThemeSwitcher = React.forwardRef<HTMLDivElement, ThemeSwitcherProps>(
  (
    {
      themes,
      defaultTheme,
      defaultMode,
      storageKey,
      disableMode,
      position = "bottom-right",
      hideModeToggle,
      liveLabel = "Active theme",
      className,
      ...divProps
    },
    ref
  ) => {
    const { theme, mode, current, setTheme, toggleMode } = useTheme({
      themes,
      defaultTheme,
      defaultMode,
      storageKey,
      disableMode,
    });

    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    React.useEffect(() => {
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

    function handleSelectTheme(id: string) {
      setTheme(id);
      setOpen(false);
    }

    const currentColor = mode === "light" ? (current.lightColor ?? current.color) : current.color;
    const showModeToggle = !hideModeToggle && !disableMode;

    return (
      <div
        ref={containerRef}
        className={cn("fixed z-50 font-mono text-[11px]", POSITION_CLASS[position], className)}
        data-theme-switcher
        {...divProps}
      >
        <span aria-live="polite" className="sr-only">
          {liveLabel}: {current.label}
          {showModeToggle ? `, ${mode} mode.` : "."}
        </span>

        {open && (
          <div
            aria-label="Theme settings"
            className="absolute bottom-[calc(100%+8px)] right-0 flex flex-col gap-1 p-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] min-w-[180px]"
          >
            {showModeToggle && (
              <>
                <div className="px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--fg-muted)] border-b border-[var(--border-subtle)] mb-1">
                  mode
                </div>
                <button
                  type="button"
                  aria-pressed={mode === "light"}
                  data-mode={mode}
                  onClick={toggleMode}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-hover-soft)] focus-visible:outline-none focus-visible:bg-[var(--bg-hover-soft)] transition-colors text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <span aria-hidden className="inline-grid place-items-center w-4 h-4 shrink-0">
                      <ModeIcon mode={mode} />
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
              </>
            )}
            {themes.map((t: ThemeOption) => {
              const isActive = t.id === theme;
              const dotColor = mode === "light" ? (t.lightColor ?? t.color) : t.color;
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
          aria-label={
            showModeToggle
              ? `Theme: ${current.label}, ${mode} mode. Click to change.`
              : `Theme: ${current.label}. Click to change.`
          }
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
          {showModeToggle && (
            <span className="text-[var(--fg-muted)] uppercase tracking-[0.08em] text-[10px]">
              {mode}
            </span>
          )}
        </button>
      </div>
    );
  }
);
ThemeSwitcher.displayName = "ThemeSwitcher";

interface ThemeScriptProps {
  /** Must match the `storageKey` passed to `ThemeSwitcher` / `useTheme`. */
  storageKey?: string;
}

/**
 * Inline script that runs before React hydrates so the saved theme + mode
 * are applied before first paint. Drop this in your root `<head>` to avoid
 * a flash of the default look on every page load.
 */
function ThemeScript({ storageKey = "entrepta" }: ThemeScriptProps) {
  const themeKey = JSON.stringify(`${storageKey}:theme`);
  const modeKey = JSON.stringify(`${storageKey}:mode`);
  const script = `(function(){try{var t=localStorage.getItem(${themeKey});if(t)document.documentElement.setAttribute('data-theme',t);var m=localStorage.getItem(${modeKey});if(m==='light')document.documentElement.setAttribute('data-mode','light');}catch(e){}})();`;
  // biome-ignore lint/security/noDangerouslySetInnerHtml: static string we control; no user input is interpolated.
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export { ThemeScript, ThemeSwitcher };
export type { SwitcherPosition, ThemeScriptProps, ThemeSwitcherProps };
