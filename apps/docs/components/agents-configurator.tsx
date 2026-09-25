"use client";

import {
  type AgentsOptions,
  FILE_NAMES,
  FRAMEWORKS,
  FRAMEWORK_LABELS,
  PACKAGE_MANAGERS,
  buildAgentsMd,
  closureOf,
} from "@/lib/agents-md";
import { COMPONENT_INDEX, SECTIONS } from "@/lib/component-index";
import { THEMES } from "@/lib/theme";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import { useUrlFilter } from "@entrepta/registry/hooks/use-url-filter";
import { Button } from "@entrepta/registry/primitives/button";
import { CheckIcon, DownloadSimpleIcon, WarningIcon } from "@phosphor-icons/react";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

const THEME_IDS = THEMES.map((t) => t.id);
const MODES = ["dark", "light"] as const;
const THEMES_MODES = ["single", "all"] as const;
const DEFAULT_COMPONENTS = ["button", "card", "code-block"];
const SLUGS = new Set(COMPONENT_INDEX.map((c) => c.slug));

/**
 * The picked components, kept in `?c=button,card`, the same way use-url-filter
 * keeps a single value: prerender safe, pushState, other params kept.
 */
function useUrlList(param: string): [string[] | null, (next: string[]) => void] {
  const event = `urlfilter:${param}`;
  const subscribe = useCallback(
    (onChange: () => void) => {
      window.addEventListener("popstate", onChange);
      window.addEventListener(event, onChange);
      return () => {
        window.removeEventListener("popstate", onChange);
        window.removeEventListener(event, onChange);
      };
    },
    [event]
  );
  const raw = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(param),
    () => null
  );
  const value = useMemo(
    () => (raw === null ? null : raw.split(",").filter((s) => SLUGS.has(s))),
    [raw]
  );
  const write = useCallback(
    (next: string[]) => {
      const params = new URLSearchParams(window.location.search);
      params.set(param, next.join(","));
      window.history.pushState(null, "", `${window.location.pathname}?${params}#agents`);
      window.dispatchEvent(new Event(event));
    },
    [param, event]
  );
  return [value, write];
}

function Choice<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  label = (v) => v,
}: {
  legend: string;
  name: string;
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  label?: (value: T) => string;
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2 p-0 font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] px-2.5 font-mono text-mono-sm text-[var(--fg-muted)] transition-colors has-[:checked]:border-[var(--fg-brand)] has-[:checked]:bg-[var(--bg-surface-brand)] has-[:checked]:text-[var(--fg-brand-text)] has-[:focus-visible]:shadow-[0_0_0_3px_var(--bg-surface-brand)]"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {label(option)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type DownloadState = "idle" | "done" | "error";

export function AgentsConfigurator() {
  const [framework, setFramework] = useUrlFilter("fw", FRAMEWORKS);
  const [theme, setTheme] = useUrlFilter("theme", THEME_IDS);
  const [mode, setMode] = useUrlFilter("mode", MODES);
  const [themes, setThemes] = useUrlFilter("themes", THEMES_MODES);
  const [pm, setPm] = useUrlFilter("pm", PACKAGE_MANAGERS);
  const [fileName, setFileName] = useUrlFilter("file", FILE_NAMES);
  const [picked, setPicked] = useUrlList("c");
  const [download, setDownload] = useState<DownloadState>("idle");

  const options: AgentsOptions = {
    framework: framework ?? "next-app",
    theme: theme ?? "entrepta",
    mode: mode ?? "dark",
    themes: themes ?? "single",
    pm: pm ?? "pnpm",
    components: picked ?? DEFAULT_COMPONENTS,
    fileName: fileName ?? "AGENTS.md",
  };
  const markdown = buildAgentsMd(options);

  // components another picked one needs: checked and locked, with the reason
  const required = new Map<string, string>();
  for (const name of options.components) {
    for (const dep of closureOf([name])) {
      if (dep.name !== name && SLUGS.has(dep.name) && !options.components.includes(dep.name)) {
        required.set(dep.name, name);
      }
    }
  }
  const count = new Set([...options.components, ...required.keys()]).size;

  const toggle = (slug: string) => {
    const next = options.components.includes(slug)
      ? options.components.filter((s) => s !== slug)
      : [...options.components, slug];
    setPicked(next);
  };

  const save = () => {
    try {
      const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = options.fileName;
      a.click();
      URL.revokeObjectURL(url);
      setDownload("done");
    } catch {
      setDownload("error");
    }
    setTimeout(() => setDownload("idle"), 1800);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <form className="flex min-w-0 flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <Choice
          legend="framework"
          name="fw"
          options={FRAMEWORKS}
          value={options.framework}
          onChange={setFramework}
          label={(v) => FRAMEWORK_LABELS[v]}
        />
        <Choice
          legend="theme"
          name="theme"
          options={THEME_IDS}
          value={options.theme}
          onChange={setTheme}
        />
        <Choice
          legend="default mode"
          name="mode"
          options={MODES}
          value={options.mode}
          onChange={setMode}
        />
        <Choice
          legend="themes"
          name="themes"
          options={THEMES_MODES}
          value={options.themes}
          onChange={setThemes}
          label={(v) => (v === "single" ? "one, fixed" : "all six, at runtime")}
        />
        <Choice
          legend="package manager"
          name="pm"
          options={PACKAGE_MANAGERS}
          value={options.pm}
          onChange={setPm}
        />
        <Choice
          legend="file name"
          name="file"
          options={FILE_NAMES}
          value={options.fileName}
          onChange={setFileName}
        />

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 p-0 font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
            components
          </legend>
          <div className="flex flex-col gap-4">
            {SECTIONS.map((section) => (
              <div key={section}>
                <div className="mb-1.5 font-mono text-mono-xs text-[var(--fg-secondary)]">
                  {section}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {COMPONENT_INDEX.filter((c) => c.section === section).map((c) => {
                    const neededBy = required.get(c.slug);
                    const checked = options.components.includes(c.slug) || Boolean(neededBy);
                    return (
                      <label
                        key={c.slug}
                        className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-mono-sm text-[var(--fg-secondary)] has-[:disabled]:cursor-default"
                        title={neededBy ? `needed by ${neededBy}` : undefined}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={Boolean(neededBy)}
                          onChange={() => toggle(c.slug)}
                          className="h-3.5 w-3.5 accent-[var(--fg-brand)]"
                        />
                        {c.title}
                        {neededBy && (
                          <span className="text-mono-xs text-[var(--fg-muted)]">
                            via {neededBy}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </form>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="m-0 font-mono text-mono-sm text-[var(--fg-muted)]">
            {`${options.fileName} updated, ${count} ${count === 1 ? "component" : "components"}`}
          </p>
          <Button type="button" variant="secondary" size="sm" onClick={save}>
            {download === "done" ? (
              <CheckIcon aria-hidden size={12} className="text-[var(--status-success)]" />
            ) : download === "error" ? (
              <WarningIcon aria-hidden size={12} className="text-[var(--status-error)]" />
            ) : (
              <DownloadSimpleIcon aria-hidden size={12} />
            )}
            {download === "done"
              ? "downloaded"
              : download === "error"
                ? "download failed"
                : "download"}
          </Button>
        </div>
        <CodeBlock
          code={markdown}
          filename={options.fileName}
          language="md"
          variant="terminal"
          className="max-h-[640px] overflow-y-auto"
        />
      </div>
    </div>
  );
}
