"use client";

import { contrastRatio, flatten, parseRgb, wcagGrade } from "@entrepta/registry/lib/color-contrast";
import { useMemo, useSyncExternalStore } from "react";

/**
 * Token swatches and contrast numbers, read from the live page. Every swatch
 * paints `var(--token)`, and every number is measured from what the browser
 * resolves, so switching theme or mode repaints and re-measures all of it.
 */

/**
 * An off-screen probe. Assigning `var(--token)` to a real color property makes
 * the browser evaluate it: `getPropertyValue` returns a `color-mix()` token as
 * unevaluated text. Created at module scope, never during render.
 */
const probe: HTMLSpanElement | null = (() => {
  if (typeof document === "undefined" || !document.body) return null;
  const el = document.createElement("span");
  el.setAttribute("aria-hidden", "true");
  // the reduced-motion reset gives every element a 0.01ms transition; on the probe that
  // would make each read land mid-transition, so it is switched off here
  el.style.cssText =
    "position:absolute;opacity:0;pointer-events:none;width:0;height:0;transition:none !important";
  document.body.appendChild(el);
  return el;
})();

function resolveColor(token: string): string {
  if (!probe) return "";
  probe.style.color = `var(${token})`;
  return getComputedStyle(probe).color.trim();
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-mode"],
  });
  return () => observer.disconnect();
}

function snapshot() {
  const el = document.documentElement;
  return `${el.getAttribute("data-theme") ?? "entrepta"}:${el.getAttribute("data-mode") ?? "dark"}`;
}

/** `theme:mode`, or "" during prerender. */
export function useThemeKey(): string {
  return useSyncExternalStore(subscribe, snapshot, () => "");
}

function useColors(tokens: string[]): Record<string, string> {
  const theme = useThemeKey();
  const key = tokens.join("|");
  return useMemo(() => {
    const out: Record<string, string> = {};
    if (!theme) return out;
    for (const t of key.split("|")) out[t] = resolveColor(t);
    return out;
  }, [key, theme]);
}

export type Swatch = { token: string; note: string };

export function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  const values = useColors(swatches.map((s) => s.token));
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {swatches.map((s) => (
        <div
          key={s.token}
          className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
        >
          <div className="h-16 w-full" style={{ background: `var(${s.token})` }} />
          <div className="border-t border-[var(--border-subtle)] px-3 py-2.5 font-mono">
            <div className="truncate text-mono-sm text-[var(--fg-primary)]">{s.token}</div>
            <div className="mt-1 truncate text-mono-xs text-[var(--fg-muted)]">
              {values[s.token] || "-"}
            </div>
            <div className="mt-1 text-mono-xs text-[var(--fg-muted)]">{s.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export type InkPair = {
  ink: string;
  on: string;
  /** The `on` token is translucent: measure it flattened over this one. */
  over?: string;
  /** The floor the contrast test enforces. */
  min: number;
  note: string;
};

/**
 * Each ink on what it actually sits on, with the ratio measured right now. The
 * floors are the ones `styles/themes.contrast.test.ts` enforces in all twelve
 * theme and mode combinations.
 */
export function InkTable({ pairs }: { pairs: InkPair[] }) {
  const tokens = [...new Set(pairs.flatMap((p) => [p.ink, p.on, ...(p.over ? [p.over] : [])]))];
  const values = useColors(tokens);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-mono-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-left text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
            <th className="py-2 pr-4 font-normal">sample</th>
            <th className="py-2 pr-4 font-normal">ink</th>
            <th className="py-2 pr-4 font-normal">on</th>
            <th className="py-2 pr-4 font-normal">ratio</th>
            <th className="py-2 font-normal">floor</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((p) => {
            const ink = parseRgb(values[p.ink] ?? "");
            const on = parseRgb(values[p.on] ?? "");
            const over = p.over ? parseRgb(values[p.over] ?? "") : null;
            const bg = on && over ? flatten([on, over]) : on;
            const ratio = ink && bg ? contrastRatio(ink, bg) : null;
            const passes = ratio !== null && ratio >= p.min;
            return (
              <tr
                key={`${p.ink}-${p.on}-${p.over}`}
                className="border-b border-[var(--border-subtle)] last:border-0"
              >
                <td className="py-2.5 pr-4">
                  <span
                    className="inline-flex h-7 items-center rounded-[var(--radius-sm)] px-2"
                    style={{
                      color: `var(${p.ink})`,
                      // a translucent tint is painted over its backdrop, the way it sits on the page
                      backgroundColor: p.over ? `var(${p.over})` : `var(${p.on})`,
                      backgroundImage: p.over
                        ? `linear-gradient(var(${p.on}), var(${p.on}))`
                        : undefined,
                    }}
                  >
                    Aa 12px
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-[var(--fg-primary)]">{p.ink}</td>
                <td className="py-2.5 pr-4 text-[var(--fg-secondary)]">
                  {p.on}
                  {p.over && <span className="text-[var(--fg-muted)]"> over {p.over}</span>}
                </td>
                <td className="py-2.5 pr-4 tabular-nums text-[var(--fg-primary)]">
                  {ratio === null ? "-" : `${ratio.toFixed(2)}:1`}
                  {ratio !== null && (
                    <span
                      className={
                        passes ? "text-[var(--status-success-fg)]" : "text-[var(--status-error-fg)]"
                      }
                    >
                      {` ${wcagGrade(ratio)}`}
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-[var(--fg-muted)]">
                  {p.min}
                  <span className="sr-only">{`: ${p.note}`}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** The inks entrepta promises, with the floors its contrast test enforces. */
export const INK_PAIRS: InkPair[] = [
  { ink: "--fg-on-brand", on: "--fg-brand", min: 4.5, note: "text on a brand fill" },
  { ink: "--fg-brand-text", on: "--bg-canvas", min: 4.5, note: "brand text on the page" },
  { ink: "--fg-brand-text", on: "--bg-card", min: 4.5, note: "brand text on a card" },
  {
    ink: "--fg-brand-text",
    on: "--bg-surface-brand",
    over: "--bg-canvas",
    min: 5,
    note: "brand text on the tint",
  },
  { ink: "--fg-primary", on: "--bg-canvas", min: 4.5, note: "body text" },
  { ink: "--fg-secondary", on: "--bg-card", min: 4.5, note: "secondary text on a card" },
  { ink: "--fg-muted", on: "--bg-canvas", min: 4.5, note: "metadata on the page" },
  { ink: "--fg-muted", on: "--bg-card", min: 4.5, note: "metadata on a card" },
  { ink: "--fg-muted", on: "--bg-overlay", min: 4.5, note: "metadata in a dialog" },
  {
    ink: "--status-success-fg",
    on: "--status-success-soft",
    over: "--bg-canvas",
    min: 4.5,
    note: "a soft success badge",
  },
  { ink: "--status-error-fg", on: "--bg-card", min: 4.5, note: "a field error on a card" },
];
