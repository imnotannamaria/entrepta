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
import { THEMES, type ThemeId } from "@/lib/theme";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import { Diamond } from "@entrepta/registry/content/diamond";
import { useUrlFilter } from "@entrepta/registry/hooks/use-url-filter";
import type { IconProp } from "@entrepta/registry/lib/icon";
import { Button } from "@entrepta/registry/primitives/button";
import { Checkbox } from "@entrepta/registry/primitives/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogLabel,
  DialogTitle,
} from "@entrepta/registry/primitives/dialog";
import { fieldLabelClass } from "@entrepta/registry/primitives/field";
import { SegmentedControl } from "@entrepta/registry/primitives/segmented-control";
import { SwatchPicker } from "@entrepta/registry/primitives/swatch-picker";
import {
  CheckIcon,
  DownloadSimpleIcon,
  MoonIcon,
  RobotIcon,
  SunIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

const THEME_IDS = THEMES.map((t) => t.id);
const MODES = ["dark", "light"] as const;
const THEMES_MODES = ["single", "all"] as const;
const OPEN = ["open"] as const;
const DEFAULT_COMPONENTS = ["button", "card", "code-block"];
const ALL_SLUGS = COMPONENT_INDEX.map((c) => c.slug);
const SLUGS = new Set(ALL_SLUGS);
// options replace the history entry; only opening the dialog adds one
const REPLACE = { replace: true };

/** The dialog's open state, in `?agents=open`: shareable, and the back button closes it. */
export function useAgentsDialog() {
  const [state, setState] = useUrlFilter("agents", OPEN);
  const open = state === "open";
  const setOpen = useCallback((next: boolean) => setState(next ? "open" : null), [setState]);
  return { open, setOpen };
}

/**
 * The picked components, kept in `?c=button,card`, the same way use-url-filter
 * keeps a single value: prerender safe, replaceState, other params kept.
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
      window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
      window.dispatchEvent(new Event(event));
    },
    [param, event]
  );
  return [value, write];
}

/** A numbered step of the form. */
function Step({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-b border-[var(--border-subtle)] px-6 py-6 last:border-b-0">
      <h3 className="m-0 flex items-baseline gap-2 font-mono text-mono-xs font-normal uppercase tracking-[0.08em] text-[var(--fg-muted)]">
        <span className="text-[var(--fg-brand-text)]">{num}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

type Option<T extends string> = { value: T; label: string; icon?: IconProp };

/** A labelled SegmentedControl that fills its row. */
function Segmented<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  const labelId = `agents-${name}-label`;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {/* a form's label, like Field's and the SwatchPicker's legend above */}
      <span id={labelId} className={fieldLabelClass}>
        <Diamond />
        {legend}
      </span>
      <SegmentedControl
        aria-labelledby={labelId}
        name={name}
        className="w-full"
        options={options}
        value={value}
        onValueChange={(next) => onChange(next as T)}
      />
    </div>
  );
}

type DownloadState = "idle" | "done" | "error";

function Configurator() {
  const [framework, setFramework] = useUrlFilter("fw", FRAMEWORKS, undefined, REPLACE);
  const [theme, setTheme] = useUrlFilter("theme", THEME_IDS, undefined, REPLACE);
  const [mode, setMode] = useUrlFilter("mode", MODES, undefined, REPLACE);
  const [themes, setThemes] = useUrlFilter("themes", THEMES_MODES, undefined, REPLACE);
  const [pm, setPm] = useUrlFilter("pm", PACKAGE_MANAGERS, undefined, REPLACE);
  const [fileName, setFileName] = useUrlFilter("file", FILE_NAMES, undefined, REPLACE);
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
  const everything = ALL_SLUGS.every((s) => options.components.includes(s));

  const toggle = (slug: string) => {
    setPicked(
      options.components.includes(slug)
        ? options.components.filter((s) => s !== slug)
        : [...options.components, slug]
    );
  };

  const toggleSection = (slugs: string[], all: boolean) => {
    const rest = options.components.filter((s) => !slugs.includes(s));
    setPicked(all ? rest : [...rest, ...slugs]);
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
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-x-hidden overflow-y-auto overscroll-none lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:overflow-clip">
      <form
        className="flex min-w-0 flex-col overscroll-none lg:overflow-x-hidden lg:overflow-y-auto lg:border-r lg:border-[var(--border-subtle)]"
        onSubmit={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-[var(--border-subtle)] px-6 pt-6 pb-5">
          <DialogLabel icon={RobotIcon}>agents.md</DialogLabel>
          <DialogTitle>
            Your <em>AGENTS.md</em>, ready to paste.
          </DialogTitle>
          <DialogDescription>
            It tells a coding agent how to install entrepta, where things live, which token goes
            where, and how each component is used. It also points the agent at the docs in Markdown:
            every page has a .md version, such as /docs/components.md. The link keeps your choices.
          </DialogDescription>
        </DialogHeader>

        <Step num="01" title="project">
          <Segmented
            legend="Framework · Next.js router or Vite"
            name="fw"
            options={FRAMEWORKS.map((v) => ({
              value: v,
              // one word each, so three equal segments fit the dialog at 375px
              label: FRAMEWORK_LABELS[v].replace("Next.js ", "").replace(" Router", ""),
            }))}
            value={options.framework}
            onChange={setFramework}
          />
          <Segmented
            legend="Package manager"
            name="pm"
            options={PACKAGE_MANAGERS.map((v) => ({ value: v, label: v }))}
            value={options.pm}
            onChange={setPm}
          />
        </Step>

        <Step num="02" title="look">
          <SwatchPicker
            legend="Theme"
            name="theme"
            // each brand as it looks in the mode picked below
            options={THEMES.map((t) => ({
              value: t.id,
              color: options.mode === "light" ? t.lightColor : t.color,
              name: t.label,
            }))}
            value={options.theme}
            onValueChange={(next) => setTheme(next as ThemeId)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Segmented
              legend="Default mode"
              name="mode"
              options={[
                { value: "dark", label: "dark", icon: MoonIcon },
                { value: "light", label: "light", icon: SunIcon },
              ]}
              value={options.mode}
              onChange={setMode}
            />
            <Segmented
              legend="Themes installed"
              name="themes"
              options={[
                { value: "single", label: "one" },
                { value: "all", label: "all six" },
              ]}
              value={options.themes}
              onChange={setThemes}
            />
          </div>
        </Step>

        <Step num="03" title={`components · ${count} picked`}>
          <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2.5">
            <Checkbox
              label="All components"
              checked={everything}
              indeterminate={options.components.length > 0 && !everything}
              onChange={() => setPicked(everything ? [] : ALL_SLUGS)}
            />
            <span className="font-mono text-mono-xs text-[var(--fg-muted)] tabular-nums">
              {count}/{ALL_SLUGS.length}
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {SECTIONS.map((section) => {
              const items = COMPONENT_INDEX.filter((c) => c.section === section);
              const slugs = items.map((c) => c.slug);
              const on = slugs.filter(
                (s) => options.components.includes(s) || required.has(s)
              ).length;
              const all = slugs.every((s) => options.components.includes(s));
              return (
                <div key={section} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <Checkbox
                      label={section}
                      checked={all}
                      indeterminate={on > 0 && !all}
                      onChange={() => toggleSection(slugs, all)}
                    />
                    <span className="font-mono text-mono-xs text-[var(--fg-muted)] tabular-nums">
                      {on}/{items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(min(10.5rem,100%),1fr))] gap-x-4 gap-y-2.5 pl-6.5">
                    {items.map((c) => {
                      const neededBy = required.get(c.slug);
                      return (
                        <Checkbox
                          key={c.slug}
                          label={c.title}
                          description={neededBy ? `via ${neededBy}` : undefined}
                          checked={options.components.includes(c.slug) || Boolean(neededBy)}
                          disabled={Boolean(neededBy)}
                          onChange={() => toggle(c.slug)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Step>

        <Step num="04" title="file">
          <Segmented
            legend="File name"
            name="file"
            options={FILE_NAMES.map((v) => ({ value: v, label: v }))}
            value={options.fileName}
            onChange={setFileName}
          />
        </Step>
      </form>

      <div className="flex min-h-[480px] min-w-0 flex-col gap-3 bg-[var(--bg-canvas)] p-4 sm:p-6 lg:min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-3 lg:pr-10">
          <p aria-live="polite" className="m-0 font-mono text-mono-sm text-[var(--fg-muted)]">
            <span className="text-[var(--fg-primary)]">{options.fileName}</span>
            {` · ${count} ${count === 1 ? "component" : "components"} · ${markdown.split("\n").length} lines`}
          </p>
          <Button type="button" size="sm" onClick={save}>
            {download === "done" ? (
              <CheckIcon aria-hidden size={14} weight="bold" />
            ) : download === "error" ? (
              <WarningIcon aria-hidden size={14} />
            ) : (
              <DownloadSimpleIcon aria-hidden size={14} weight="bold" />
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
          wrap
          size="sm"
          className="min-h-0 flex-1"
        />
      </div>
    </div>
  );
}

/** The header button and the dialog it opens. Also opened by `?agents=open` and `#agents`. */
export function AgentsDialog() {
  const { open, setOpen } = useAgentsDialog();

  // links from before the dialog pointed at the home page's #agents section
  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === "#agents") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        setOpen(true);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="group/agents max-sm:w-8 max-sm:px-0"
      >
        <RobotIcon
          aria-hidden
          size={14}
          className="text-[var(--fg-brand)] transition-transform duration-200 group-hover/agents:scale-115"
        />
        <span className="max-sm:sr-only">AGENTS.md</span>
      </Button>
      <DialogContent className="h-[min(820px,calc(100dvh-32px))] max-w-[1120px] gap-0 overflow-clip overscroll-none p-0">
        {open && <Configurator />}
      </DialogContent>
    </Dialog>
  );
}

/** Opens the dialog from anywhere on the page, such as a call to action. */
export function OpenAgentsButton({
  className,
  children,
}: { className?: string; children: React.ReactNode }) {
  const { setOpen } = useAgentsDialog();
  return (
    <button type="button" className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}
