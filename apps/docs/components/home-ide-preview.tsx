"use client";

import { StatusBar, StatusBarItem, StatusBarSeparator } from "@entrepta/registry/layout/status-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";
import { useState } from "react";

type FileKey = "tokens" | "card" | "theme";

interface FileMeta {
  name: string;
  lang: string;
  cursor: string;
  code: React.ReactNode;
}

const FILES: Record<FileKey, FileMeta> = {
  tokens: {
    name: "tokens.css",
    lang: "CSS",
    cursor: "Ln 4, Col 18",
    code: (
      <>
        <span className="text-[var(--fg-muted)]">{"/* entrepta · semantic tokens */"}</span>
        {"\n"}
        <span className="text-[var(--status-info)]">:root</span>
        <span className="text-[var(--fg-secondary)]">{" {"}</span>
        {"\n  "}
        <span className="text-[var(--fg-brand)]">--fg-brand</span>
        <span className="text-[var(--fg-secondary)]">: </span>
        <span className="text-[var(--status-success-fg)]">#7C6BFF</span>
        <span className="text-[var(--fg-secondary)]">;</span>
        {"\n  "}
        <span className="text-[var(--fg-brand)]">--bg-canvas</span>
        <span className="text-[var(--fg-secondary)]">: </span>
        <span className="text-[var(--status-success-fg)]">#09090B</span>
        <span className="text-[var(--fg-secondary)]">;</span>
        {"\n  "}
        <span className="text-[var(--fg-brand)]">--bg-surface</span>
        <span className="text-[var(--fg-secondary)]">: </span>
        <span className="text-[var(--status-success-fg)]">#18181B</span>
        <span className="text-[var(--fg-secondary)]">;</span>
        {"\n"}
        <span className="text-[var(--fg-secondary)]">{"}"}</span>
        {"\n"}
        <span className="text-[var(--fg-muted)]">{"// theme: ivy"}</span>
        {"\n"}
        <span className="text-[var(--status-info)]">[data-theme</span>
        <span className="text-[var(--fg-secondary)]">=</span>
        <span className="text-[var(--status-warning)]">"ivy"</span>
        <span className="text-[var(--status-info)]">]</span>
        <span className="text-[var(--fg-secondary)]">{" {"}</span>
        {"\n  "}
        <span className="text-[var(--fg-brand)]">--fg-brand</span>
        <span className="text-[var(--fg-secondary)]">: </span>
        <span className="text-[var(--status-success-fg)]">#35A365</span>
        <span className="text-[var(--fg-secondary)]">;</span>
        {"\n"}
        <span className="text-[var(--fg-secondary)]">{"}"}</span>
      </>
    ),
  },
  card: {
    name: "button.tsx",
    lang: "TypeScript",
    cursor: "Ln 3, Col 22",
    code: (
      <>
        <span className="text-[var(--status-info)]">import</span>
        <span className="text-[var(--fg-secondary)]">{" { "}</span>
        <span className="text-[var(--fg-primary)]">Button</span>
        <span className="text-[var(--fg-secondary)]">{" } "}</span>
        <span className="text-[var(--status-info)]">from</span>{" "}
        <span className="text-[var(--status-warning)]">"@/components/entrepta/button"</span>
        {"\n\n"}
        <span className="text-[var(--fg-secondary)]">{"<"}</span>
        <span className="text-[var(--fg-brand)]">Button</span>
        <span className="text-[var(--fg-muted)]"> variant</span>
        <span className="text-[var(--fg-secondary)]">=</span>
        <span className="text-[var(--status-warning)]">"primary"</span>
        <span className="text-[var(--fg-secondary)]">{">"}</span>
        <span className="text-[var(--fg-primary)]">Ship</span>
        <span className="text-[var(--fg-secondary)]">{"</"}</span>
        <span className="text-[var(--fg-brand)]">Button</span>
        <span className="text-[var(--fg-secondary)]">{">"}</span>
      </>
    ),
  },
  theme: {
    name: "theme.ts",
    lang: "TypeScript",
    cursor: "Ln 3, Col 14",
    code: (
      <>
        <span className="text-[var(--fg-muted)]">{"// 6 presets, dark-first"}</span>
        {"\n"}
        <span className="text-[var(--status-info)]">export const</span>{" "}
        <span className="text-[var(--fg-primary)]">themes</span>{" "}
        <span className="text-[var(--fg-secondary)]">= </span>
        <span className="text-[var(--fg-secondary)]">{"["}</span>
        {"\n  "}
        <span className="text-[var(--status-warning)]">"entrepta"</span>
        <span className="text-[var(--fg-secondary)]">,</span>{" "}
        <span className="text-[var(--fg-muted)]">{"// #7C6BFF"}</span>
        {"\n  "}
        <span className="text-[var(--status-warning)]">"blossom"</span>
        <span className="text-[var(--fg-secondary)]">,</span>
        {"\n  "}
        <span className="text-[var(--status-warning)]">"marmalade"</span>
        <span className="text-[var(--fg-secondary)]">,</span>{" "}
        <span className="text-[var(--fg-muted)]">{"// #FF8213"}</span>
        {"\n  "}
        <span className="text-[var(--status-warning)]">"julia"</span>
        <span className="text-[var(--fg-secondary)]">,</span>
        {"\n  "}
        <span className="text-[var(--status-warning)]">"ivy"</span>
        <span className="text-[var(--fg-secondary)]">,</span>
        {"\n  "}
        <span className="text-[var(--status-warning)]">"bosco"</span>
        <span className="text-[var(--fg-secondary)]">,</span>
        {"\n"}
        <span className="text-[var(--fg-secondary)]">{"] as const"}</span>
      </>
    ),
  },
};

const ORDER: FileKey[] = ["tokens", "card", "theme"];

export function HomeIdePreview() {
  const [active, setActive] = useState<FileKey>("tokens");
  const activeFile = FILES[active];

  return (
    <aside className="hidden lg:flex flex-col rounded-[var(--radius-lg)] border border-[var(--border-strong)] overflow-hidden bg-[var(--bg-canvas)] shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
      <Tabs value={active} onValueChange={(v) => setActive(v as FileKey)} className="flex flex-col">
        <TabsList aria-label="Preview files">
          {ORDER.map((key) => (
            <TabsTrigger key={key} value={key}>
              {FILES[key].name}
            </TabsTrigger>
          ))}
        </TabsList>

        {ORDER.map((key) => {
          const file = FILES[key];
          return (
            <TabsContent key={key} value={key} className="flex flex-1 m-0">
              <pre className="flex-1 px-5 py-4 font-mono text-[12px] leading-6 overflow-x-auto whitespace-pre">
                {file.code}
              </pre>
            </TabsContent>
          );
        })}
      </Tabs>

      <StatusBar
        className="static left-auto right-auto bottom-auto z-auto flex"
        left={
          <>
            <StatusBarItem>{activeFile.lang}</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>UTF-8</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>{activeFile.cursor}</StatusBarItem>
          </>
        }
        right={<StatusBarItem>anna@recife</StatusBarItem>}
      />
    </aside>
  );
}
