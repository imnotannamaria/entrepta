"use client";

import { DEFAULT_MODE, DEFAULT_THEME, STORAGE_KEY_PREFIX, THEMES } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useCopy } from "@entrepta/registry/hooks/use-copy";
import { useTheme } from "@entrepta/registry/hooks/use-theme";
import { RollingNumber, useRollOnHover } from "@entrepta/registry/motion/rolling-number";
import { Button } from "@entrepta/registry/primitives/button";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { toast } from "sonner";

const INIT = "npx @entrepta/cli@latest init";

/** The install command as a button that copies itself. */
export function CopyInit() {
  const { state, copy } = useCopy();
  const onCopy = async () => {
    if (await copy(INIT)) toast.success("Copied", { description: INIT });
    else toast.error("Copy failed", { description: "Select the command and copy it by hand." });
  };
  return (
    <Button
      variant="command"
      size="lg"
      onClick={onCopy}
      aria-label={`Copy ${INIT}`}
      className="max-sm:h-11 max-sm:px-4 max-sm:text-mono-md"
    >
      {INIT.replace("@latest", "")}
      {state === "copied" ? (
        <CheckIcon aria-hidden size={14} weight="bold" className="text-[var(--status-success)]" />
      ) : (
        <CopyIcon aria-hidden size={14} className="text-[var(--fg-muted)]" />
      )}
    </Button>
  );
}

function useSiteTheme() {
  return useTheme({
    themes: THEMES,
    defaultTheme: DEFAULT_THEME,
    defaultMode: DEFAULT_MODE,
    storageKey: STORAGE_KEY_PREFIX,
  });
}

/** The swatches that recolor the whole site, in step with the floating switcher. */
export function ThemeRow() {
  const { theme, setTheme } = useSiteTheme();
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className="font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
        try a theme
      </span>
      <div className="flex items-center gap-2">
        {THEMES.map((t) => {
          const active = t.id === theme;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              aria-label={`${t.label} theme`}
              title={t.label}
              onClick={() => setTheme(t.id)}
              className={cn(
                "focus-ring grid size-7 cursor-pointer place-items-center rounded-full",
                "transition-transform duration-[var(--motion-fast)] ease-out hover:scale-110",
                active &&
                  "ring-2 ring-[var(--fg-brand)] ring-offset-2 ring-offset-[var(--bg-canvas)]"
              )}
            >
              {/* the brand of the page's mode, picked in CSS: the mode is known before hydration */}
              <span
                aria-hidden
                className="size-5 rounded-full bg-[var(--dark)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--fg-primary)_22%,transparent)] [:root[data-mode=light]_&]:bg-[var(--light)]"
                style={{ "--dark": t.color, "--light": t.lightColor } as CSSProperties}
              />
            </button>
          );
        })}
      </div>
      <span
        aria-live="polite"
        className="min-w-[9ch] font-mono text-mono-sm text-[var(--fg-brand-text)]"
      >
        {theme}
      </span>
    </div>
  );
}

function Stat({ label, value, delay: entrance }: { label: string; value: string; delay: number }) {
  // rolls in once, then a full turn on each hover
  const { cycle, delay, handlers } = useRollOnHover(entrance);
  return (
    <div
      {...handlers}
      className="group flex flex-col items-center gap-2 bg-[var(--bg-canvas)] px-4 py-8 transition-colors duration-[var(--motion-base)] hover:bg-[var(--bg-card-hover)] sm:py-10"
    >
      <dd className="m-0 font-serif text-display-lg text-[var(--fg-primary)] transition-colors group-hover:text-[var(--fg-brand)]">
        <RollingNumber value={value} cycle={cycle} delay={delay} height={64} />
      </dd>
      <dt className="order-first font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)] sm:order-none">
        {label}
      </dt>
    </div>
  );
}

/** The counts under the gallery. Each cell rolls a beat after the one before. */
export function HeroStats({ stats }: { stats: { dt: string; dd: string }[] }) {
  return (
    <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--border-subtle)] sm:grid-cols-4">
      {stats.map((s, i) => (
        <Stat key={s.dt} label={s.dt} value={s.dd} delay={0.15 + i * 0.12} />
      ))}
    </dl>
  );
}
