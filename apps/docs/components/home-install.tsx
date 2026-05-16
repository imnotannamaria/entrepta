"use client";

import { CodeBlock } from "@entrepta/registry/content/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";

interface InstallStep {
  num: string;
  cmd: string;
  out: string | null;
}

interface Props {
  steps: InstallStep[];
}

const PACKAGE_MANAGERS = [
  { id: "pnpm", install: "pnpm add" },
  { id: "npm", install: "npm install" },
  { id: "yarn", install: "yarn add" },
  { id: "bun", install: "bun add" },
] as const;

const PEER_DEPS = ["clsx", "tailwind-merge", "class-variance-authority"];

const GLOBALS_CSS_SNIPPET = `/* app/globals.css — paste the tokens block from
   packages/registry/styles/globals.css, then append one
   theme file from packages/registry/styles/themes/. */

@import "tailwindcss";

:root {
  --bg-canvas:   #09090B;
  --bg-surface:  #18181B;
  --fg-primary:  #FAFAFA;
  --fg-brand:    #7C6BFF;  /* entrepta · swap per theme */
  /* …full token list in the registry */
}`;

const UTILS_TS_SNIPPET = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

export function HomeInstall({ steps }: Props) {
  return (
    <Tabs defaultValue="command" className="flex flex-col">
      <TabsList>
        <TabsTrigger value="command">Command</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>

      <TabsContent value="command" className="pt-5">
        <CodeBlock
          variant="terminal"
          filename="terminal · zsh"
          meta="~/projects/portfolio"
          language="bash"
          code={steps.map((s) => s.cmd).join("\n")}
        >
          <div className="flex flex-col gap-4">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--fg-muted)] text-[11px] w-5 shrink-0">
                    {step.num}
                  </span>
                  <span className="text-[var(--fg-secondary)]">
                    <span className="text-[var(--fg-brand)]">$</span> {step.cmd}
                  </span>
                </div>
                {step.out && (
                  <div className="pl-8 text-[11px] text-[var(--fg-muted)]">→ {step.out}</div>
                )}
              </div>
            ))}
            <div className="pl-8 flex items-center gap-2 text-[11px]">
              <span className="size-1.5 rounded-full bg-[var(--status-success)] inline-block" />
              <span className="text-[var(--status-success-fg)]">ready</span>
              <span className="text-[var(--fg-muted)]">{"// run npm run dev"}</span>
            </div>
          </div>
        </CodeBlock>
      </TabsContent>

      <TabsContent value="manual" className="pt-5">
        <ol className="flex flex-col gap-6 list-none m-0 p-0">
          <li className="grid grid-cols-[28px_1fr] gap-3">
            <span
              aria-hidden
              className="inline-grid place-items-center size-6 mt-0.5 rounded-full border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--fg-muted)]"
            >
              1
            </span>
            <div className="flex flex-col gap-3 min-w-0">
              <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
                Install the peer dependencies.
              </p>
              <Tabs defaultValue="pnpm">
                <TabsList>
                  {PACKAGE_MANAGERS.map((pm) => (
                    <TabsTrigger key={pm.id} value={pm.id}>
                      {pm.id}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {PACKAGE_MANAGERS.map((pm) => (
                  <TabsContent key={pm.id} value={pm.id} className="pt-3">
                    <CodeBlock code={`${pm.install} ${PEER_DEPS.join(" ")}`} language="bash" />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </li>

          <li className="grid grid-cols-[28px_1fr] gap-3">
            <span
              aria-hidden
              className="inline-grid place-items-center size-6 mt-0.5 rounded-full border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--fg-muted)]"
            >
              2
            </span>
            <div className="flex flex-col gap-3 min-w-0">
              <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
                Drop the design tokens into your global stylesheet.
              </p>
              <CodeBlock
                variant="terminal"
                filename="app/globals.css"
                language="css"
                code={GLOBALS_CSS_SNIPPET}
              />
              <p className="font-mono text-[11px] text-[var(--fg-muted)] leading-relaxed m-0">
                <span className="text-[var(--fg-brand)]">{"// "}</span>
                Copy the full file from{" "}
                <code className="text-[var(--fg-secondary)]">
                  packages/registry/styles/globals.css
                </code>{" "}
                then append a theme from{" "}
                <code className="text-[var(--fg-secondary)]">packages/registry/styles/themes/</code>
                .
              </p>
            </div>
          </li>

          <li className="grid grid-cols-[28px_1fr] gap-3">
            <span
              aria-hidden
              className="inline-grid place-items-center size-6 mt-0.5 rounded-full border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--fg-muted)]"
            >
              3
            </span>
            <div className="flex flex-col gap-3 min-w-0">
              <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
                Add the <code>cn</code> helper.
              </p>
              <CodeBlock
                variant="terminal"
                filename="lib/utils.ts"
                language="ts"
                code={UTILS_TS_SNIPPET}
              />
            </div>
          </li>

          <li className="grid grid-cols-[28px_1fr] gap-3">
            <span
              aria-hidden
              className="inline-grid place-items-center size-6 mt-0.5 rounded-full border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--fg-muted)]"
            >
              4
            </span>
            <div className="flex flex-col gap-2 min-w-0">
              <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
                Copy components individually from the docs.
              </p>
              <p className="font-mono text-[11px] text-[var(--fg-muted)] leading-relaxed m-0">
                <span className="text-[var(--fg-brand)]">{"// "}</span>
                Each component page has a{" "}
                <strong className="text-[var(--fg-secondary)]">Manual</strong> tab with its own
                dependency list and copy-pasteable source.
              </p>
            </div>
          </li>
        </ol>
      </TabsContent>
    </Tabs>
  );
}
