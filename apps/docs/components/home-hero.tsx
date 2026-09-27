"use client";

import { buildAgentsMd } from "@/lib/agents-md";
import { COMPONENT_INDEX } from "@/lib/component-index";
import { DEFAULT_MODE, DEFAULT_THEME, STORAGE_KEY_PREFIX, THEMES } from "@/lib/theme";
import { useCopy } from "@/lib/use-copy";
import { cn } from "@/lib/utils";
import { useTheme } from "@entrepta/registry/hooks/use-theme";
import { StatusBar, StatusBarItem, StatusBarSeparator } from "@entrepta/registry/layout/status-bar";
import { RollingNumber, useRollOnHover } from "@entrepta/registry/motion/rolling-number";
import { Spotlight, useSpotlight } from "@entrepta/registry/motion/spotlight";
import { Badge } from "@entrepta/registry/primitives/badge";
import { Button } from "@entrepta/registry/primitives/button";
import {
  Card,
  CardComment,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardTitle,
} from "@entrepta/registry/primitives/card";
import { Checkbox } from "@entrepta/registry/primitives/checkbox";
import { Switch } from "@entrepta/registry/primitives/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";
import {
  CheckIcon,
  CopyIcon,
  FileMdIcon,
  FileTsxIcon,
  FilesIcon,
  GitBranchIcon,
  ListChecksIcon,
  MagnifyingGlassIcon,
  PaletteIcon,
  RobotIcon,
  RocketLaunchIcon,
} from "@phosphor-icons/react";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { OpenAgentsButton } from "./agents-configurator";

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

/** Six swatches that recolor the whole site, in step with the floating switcher. */
export function ThemeRow() {
  const { theme, setTheme, mode } = useSiteTheme();
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
              <span
                aria-hidden
                className="size-5 rounded-full"
                style={{ background: mode === "light" ? t.lightColor : t.color }}
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

/* ------------------------------------------------------------------ */
/* The editor                                                          */
/* ------------------------------------------------------------------ */

const K = "text-[var(--status-info)]"; // keyword
const S = "text-[var(--status-warning)]"; // string
const T = "text-[var(--fg-brand-text)]"; // tag
const P = "text-[var(--fg-muted)]"; // punctuation and props
const X = "text-[var(--fg-primary)]"; // text

/** One line of code: a gutter number and the tokens. */
function Line({ n, children }: { n: number; children?: React.ReactNode }) {
  return (
    <div className="flex">
      <span
        aria-hidden
        className="w-9 shrink-0 select-none pr-4 text-right text-[var(--fg-muted)] opacity-60"
      >
        {n}
      </span>
      <span className="whitespace-pre">{children}</span>
    </div>
  );
}

function PageCode() {
  const lines: React.ReactNode[] = [
    <Fragment key="l1">
      <span className={K}>import</span> {"{ Card, CardTitle }"} <span className={K}>from</span>{" "}
      <span className={S}>"@/components/entrepta/card"</span>
    </Fragment>,
    <Fragment key="l2">
      <span className={K}>import</span> {"{ Badge }"} <span className={K}>from</span>{" "}
      <span className={S}>"@/components/entrepta/badge"</span>
    </Fragment>,
    <Fragment key="l3">
      <span className={K}>import</span> {"{ Checkbox }"} <span className={K}>from</span>{" "}
      <span className={S}>"@/components/entrepta/checkbox"</span>
    </Fragment>,
    null,
    <Fragment key="l5">
      <span className={K}>export default function</span> <span className={X}>Launch</span>
      {"() {"}
    </Fragment>,
    <Fragment key="l6">
      {"  "}
      <span className={K}>return</span> (
    </Fragment>,
    <Fragment key="l7">
      {"    "}
      <span className={P}>{"<"}</span>
      <span className={T}>Card</span> <span className={P}>variant=</span>
      <span className={S}>"featured"</span>
      <span className={P}>{">"}</span>
    </Fragment>,
    <Fragment key="l8">
      {"      "}
      <span className={P}>{"<"}</span>
      <span className={T}>Badge</span> <span className={P}>icon=</span>
      {"{RocketIcon}"}
      <span className={P}>{">"}</span>
      <span className={X}>v2.0</span>
      <span className={P}>{"</"}</span>
      <span className={T}>Badge</span>
      <span className={P}>{">"}</span>
    </Fragment>,
    <Fragment key="l9">
      {"      "}
      <span className={P}>{"<"}</span>
      <span className={T}>CardTitle</span>
      <span className={P}>{">"}</span>
      <span className={X}>Ship it </span>
      <span className={P}>{"<"}</span>
      <span className={T}>em</span>
      <span className={P}>{">"}</span>
      <span className={X}>tonight.</span>
      <span className={P}>{"</"}</span>
      <span className={T}>em</span>
      <span className={P}>{"></"}</span>
      <span className={T}>CardTitle</span>
      <span className={P}>{">"}</span>
    </Fragment>,
    <Fragment key="l10">
      {"      "}
      <span className={P}>{"<"}</span>
      <span className={T}>Checkbox</span> <span className={P}>label=</span>
      <span className={S}>"tests pass"</span> <span className={P}>checked /{">"}</span>
    </Fragment>,
    <Fragment key="l11">
      {"      "}
      <span className={P}>{"<"}</span>
      <span className={T}>Button</span> <span className={P}>onClick=</span>
      {"{deploy}"}
      <span className={P}>{">"}</span>
      <span className={X}>deploy</span>
      <span className={P}>{"</"}</span>
      <span className={T}>Button</span>
      <span className={P}>{">"}</span>
    </Fragment>,
    <Fragment key="l12">
      {"    "}
      <span className={P}>{"</"}</span>
      <span className={T}>Card</span>
      <span className={P}>{">"}</span>
    </Fragment>,
    <Fragment key="l13">{"  )"}</Fragment>,
    <Fragment key="l14">{"}"}</Fragment>,
  ];
  return (
    <pre className="m-0 py-4 pr-4 font-mono text-mono-sm leading-6 text-[var(--fg-secondary)]">
      {lines.map((l, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed lines
        <Line key={i} n={i + 1}>
          {l}
        </Line>
      ))}
    </pre>
  );
}

function LivePreview() {
  const [tasks, setTasks] = useState({ tests: true, review: true, docs: false });
  const [preview, setPreview] = useState(true);
  const [shipping, setShipping] = useState(false);
  const ready = Object.values(tasks).every(Boolean);

  const deploy = () => {
    setShipping(true);
    setTimeout(() => {
      setShipping(false);
      toast.success("Deployed to production", {
        description: preview
          ? "preview url: entrepta.vercel.app"
          : `${COMPONENT_INDEX.length} components, 0 errors`,
      });
    }, 900);
  };

  return (
    <div className="flex h-full flex-col bg-[var(--bg-canvas)]">
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-3 py-2 font-mono text-mono-xs text-[var(--fg-muted)]">
        <span className="size-1.5 rounded-full bg-[var(--status-success)]" />
        localhost:3000
        <span className="ml-auto uppercase tracking-[0.08em]">preview</span>
      </div>
      <div className="grid flex-1 place-items-center p-5 sm:p-8">
        <Card variant="featured" className="w-full max-w-sm">
          <CardHeader>
            <CardLabel icon={ListChecksIcon}>launch</CardLabel>
            <Badge variant="soft" color="brand" icon={RocketLaunchIcon}>
              v2.0
            </Badge>
          </CardHeader>
          <CardTitle>
            Ship it <em>tonight.</em>
          </CardTitle>
          <CardDescription>Check the list, then press deploy. It is a real button.</CardDescription>
          <div className="flex flex-col gap-2.5">
            {(
              [
                ["tests", "tests pass"],
                ["review", "review approved"],
                ["docs", "docs updated"],
              ] as const
            ).map(([key, label]) => (
              <Checkbox
                key={key}
                label={label}
                checked={tasks[key]}
                onChange={() => setTasks({ ...tasks, [key]: !tasks[key] })}
              />
            ))}
          </div>
          <CardFooter>
            <Switch
              label="preview url"
              checked={preview}
              onChange={(e) => setPreview(e.target.checked)}
            />
            <Button size="sm" onClick={deploy} disabled={!ready} loading={shipping}>
              deploy
            </Button>
          </CardFooter>
          {!ready && <CardComment>check every box to deploy</CardComment>}
        </Card>
      </div>
    </div>
  );
}

function TokensCode({ theme }: { theme: (typeof THEMES)[number] }) {
  const rows: [string, string][] = [
    ["--bg-canvas", "#09090B"],
    ["--bg-card", "#0B0B0E"],
    ["--fg-primary", "#FAFAFA"],
    ["--fg-brand", theme.color],
    ["--fg-brand-text", "per theme, AA"],
    ["--border-subtle", "#27272A"],
  ];
  return (
    <pre className="m-0 py-4 pr-4 font-mono text-mono-sm leading-6 text-[var(--fg-secondary)]">
      <Line n={1}>
        <span className={P}>{`/* ${theme.label}, one of six, all measured */`}</span>
      </Line>
      <Line n={2}>
        <span className={K}>:root</span> {"{"}
      </Line>
      {rows.map(([k, v], i) => (
        <Line key={k} n={i + 3}>
          {"  "}
          <span className={T}>{k}</span>: <span className={S}>{v}</span>
          {";"}
          {k === "--fg-brand" && (
            <span
              aria-hidden
              className="ml-2 inline-block size-2.5 rounded-full align-middle"
              style={{ background: "var(--fg-brand)" }}
            />
          )}
        </Line>
      ))}
      <Line n={rows.length + 3}>{"}"}</Line>
    </pre>
  );
}

function AgentsPeek({ theme }: { theme: string }) {
  const md = buildAgentsMd({
    framework: "next-app",
    theme: theme as (typeof THEMES)[number]["id"],
    mode: "dark",
    themes: "single",
    pm: "pnpm",
    components: ["button", "card", "checkbox"],
    fileName: "AGENTS.md",
  })
    .split("\n")
    .slice(0, 14);
  return (
    <div className="relative">
      <pre className="m-0 py-4 pr-4 font-mono text-mono-sm leading-6 text-[var(--fg-secondary)]">
        {md.map((l, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed lines
          <Line key={i} n={i + 1}>
            <span className={cn(l.startsWith("#") && T, "whitespace-pre-wrap")}>{l}</span>
          </Line>
        ))}
      </pre>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-canvas)] to-transparent" />
      <OpenAgentsButton className="focus-ring absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-brand-strong)] bg-[var(--bg-surface-brand)] px-3 py-1.5 font-mono text-mono-sm text-[var(--fg-brand-text)] transition-colors hover:bg-[var(--bg-card-hover)]">
        <RobotIcon aria-hidden size={14} /> build yours
      </OpenAgentsButton>
    </div>
  );
}

const RAIL = [
  { id: "page", label: "Explorer", icon: FilesIcon },
  { id: "tokens", label: "Tokens", icon: PaletteIcon },
  { id: "agents", label: "Agents", icon: RobotIcon },
] as const;

/** A working editor window, built from the components it advertises. */
export function HomeShowcase() {
  const { current } = useSiteTheme();
  const [tab, setTab] = useState("page");
  const { onMouseMove, spotlight } = useSpotlight(720);

  return (
    <div className="relative">
      {/* the brand light the window sits in; it follows the theme */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] -top-10 bottom-[20%] rounded-full bg-[var(--fg-brand)] opacity-20 blur-[120px]"
      />
      <div
        onMouseMove={onMouseMove}
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] shadow-[var(--shadow-overlay)]"
      >
        <Spotlight {...spotlight} />
        <Tabs value={tab} onValueChange={setTab} className="relative flex flex-col">
          <TabsList
            variant="window"
            aria-label="Showcase files"
            end={
              <span className="flex items-center gap-1.5">
                <GitBranchIcon aria-hidden size={12} />
                main
              </span>
            }
          >
            <TabsTrigger value="page" icon={FileTsxIcon}>
              launch.tsx
            </TabsTrigger>
            <TabsTrigger value="tokens" icon={PaletteIcon}>
              tokens.css
            </TabsTrigger>
            <TabsTrigger value="agents" icon={FileMdIcon}>
              AGENTS.md
            </TabsTrigger>
          </TabsList>

          <div className="flex min-h-[460px]">
            <nav
              aria-label="Showcase panels"
              className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-[var(--border-subtle)] py-3 md:flex"
            >
              {RAIL.map((r) => {
                const active = r.id === tab;
                return (
                  <button
                    key={r.id}
                    type="button"
                    aria-label={r.label}
                    aria-pressed={active}
                    onClick={() => setTab(r.id)}
                    className={cn(
                      "focus-ring group grid size-10 cursor-pointer place-items-center rounded-[var(--radius-sm)] transition-colors",
                      active
                        ? "text-[var(--fg-brand)]"
                        : "text-[var(--fg-muted)] hover:bg-[var(--bg-hover-soft)] hover:text-[var(--fg-secondary)]"
                    )}
                  >
                    <r.icon
                      aria-hidden
                      size={20}
                      weight={active ? "fill" : "regular"}
                      className="transition-transform duration-200 group-hover:scale-115"
                    />
                  </button>
                );
              })}
              <span className="mt-auto grid size-10 place-items-center text-[var(--fg-muted)]">
                <MagnifyingGlassIcon aria-hidden size={20} />
              </span>
            </nav>

            <div className="min-w-0 flex-1 overflow-hidden">
              <TabsContent value="page" className="m-0 h-full">
                <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                  <div className="hidden overflow-x-auto border-r border-[var(--border-subtle)] lg:block">
                    <PageCode />
                  </div>
                  <LivePreview />
                </div>
              </TabsContent>
              <TabsContent value="tokens" className="m-0 overflow-x-auto">
                <TokensCode theme={current as (typeof THEMES)[number]} />
              </TabsContent>
              <TabsContent value="agents" className="m-0 overflow-x-auto">
                <AgentsPeek theme={current.id} />
              </TabsContent>
            </div>
          </div>
        </Tabs>

        <StatusBar
          position="static"
          className="relative flex"
          left={
            <>
              <StatusBarItem icon={<GitBranchIcon size={10} />}>main</StatusBarItem>
              <StatusBarSeparator className="max-sm:hidden" />
              <StatusBarItem className="max-sm:hidden">0 problems</StatusBarItem>
            </>
          }
          right={
            <>
              <StatusBarItem>{`theme: ${current.label}`}</StatusBarItem>
              <StatusBarSeparator className="max-sm:hidden" />
              <StatusBarItem className="max-sm:hidden">TypeScript</StatusBarItem>
            </>
          }
        />
      </div>
    </div>
  );
}

function Stat({ label, value, index }: { label: string; value: string; index: number }) {
  // each cell rolls in a beat after the one before, then rolls a full turn on hover
  const { cycle, delay, handlers } = useRollOnHover(0.15 + index * 0.12);
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

/** The counts under the editor, as wide as it. */
export function HeroStats({ stats }: { stats: { dt: string; dd: string }[] }) {
  return (
    <dl className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--border-subtle)] sm:grid-cols-4">
      {stats.map((s, i) => (
        <Stat key={s.dt} label={s.dt} value={s.dd} index={i} />
      ))}
    </dl>
  );
}
