"use client";

import { CodeBlock } from "@entrepta/registry/content/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";

interface SourceFile {
  filename: string;
  source: string;
  language?: string;
}

interface Props {
  cliCommand: string;
  dependencies: string[];
  files: SourceFile[];
}

const PACKAGE_MANAGERS = [
  { id: "pnpm", install: "pnpm add" },
  { id: "npm", install: "npm install" },
  { id: "yarn", install: "yarn add" },
  { id: "bun", install: "bun add" },
] as const;

export function ComponentInstall({ cliCommand, dependencies, files }: Props) {
  return (
    <Tabs defaultValue="command" className="flex flex-col">
      <TabsList>
        <TabsTrigger value="command">Command</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>

      <TabsContent value="command" className="pt-5">
        <CodeBlock code={cliCommand} filename="terminal" language="bash" variant="terminal" />
        <p className="mt-3 font-mono text-[11px] text-[var(--fg-muted)] leading-relaxed">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          Resolves dependencies, copies the source, and installs npm packages automatically.
        </p>
      </TabsContent>

      <TabsContent value="manual" className="pt-5">
        <ol className="flex flex-col gap-6 list-none m-0 p-0">
          {dependencies.length > 0 && (
            <li className="grid grid-cols-[28px_1fr] gap-3">
              <span
                aria-hidden
                className="inline-grid place-items-center size-6 mt-0.5 rounded-full border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--fg-muted)]"
              >
                1
              </span>
              <div className="flex flex-col gap-3 min-w-0">
                <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
                  Install the following dependencies:
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
                      <CodeBlock code={`${pm.install} ${dependencies.join(" ")}`} language="bash" />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </li>
          )}

          <li className="grid grid-cols-[28px_1fr] gap-3">
            <span
              aria-hidden
              className="inline-grid place-items-center size-6 mt-0.5 rounded-full border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--fg-muted)]"
            >
              {dependencies.length > 0 ? 2 : 1}
            </span>
            <div className="flex flex-col gap-3 min-w-0">
              <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
                Copy and paste the following code into your project.
              </p>
              <div className="flex flex-col gap-4">
                {files.map((f) => (
                  <CodeBlock
                    key={f.filename}
                    code={f.source}
                    filename={f.filename}
                    language={f.language ?? "tsx"}
                    variant="terminal"
                  />
                ))}
              </div>
            </div>
          </li>

          <li className="grid grid-cols-[28px_1fr] gap-3">
            <span
              aria-hidden
              className="inline-grid place-items-center size-6 mt-0.5 rounded-full border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--fg-muted)]"
            >
              {dependencies.length > 0 ? 3 : 2}
            </span>
            <div className="flex flex-col gap-2 min-w-0">
              <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
                Update the import paths to match your project setup.
              </p>
              <p className="font-mono text-[11px] text-[var(--fg-muted)] leading-relaxed m-0">
                <span className="text-[var(--fg-brand)]">{"// "}</span>
                The snippet imports from <code>@/lib/utils</code> for the <code>cn</code> helper.
                Adjust to your alias.
              </p>
            </div>
          </li>
        </ol>
      </TabsContent>
    </Tabs>
  );
}
