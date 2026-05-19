"use client";

import { CodeBlock } from "@entrepta/registry/content/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";
import type { ReactNode } from "react";

interface SourceFile {
  filename: string;
  source: string;
  language?: string;
}

interface Props {
  cliCommand: string;
  dependencies: string[];
  files: SourceFile[];
  /** When provided, the Manual flow prepends a prerequisite step covering the `cn` helper. */
  utilsSource?: string | null;
}

const PACKAGE_MANAGERS = [
  { id: "pnpm", install: "pnpm add" },
  { id: "npm", install: "npm install" },
  { id: "yarn", install: "yarn add" },
  { id: "bun", install: "bun add" },
] as const;

const CN_DEPS = ["clsx", "tailwind-merge"];

function StepNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="inline-grid place-items-center size-6 mt-0.5 rounded-full border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--fg-muted)]"
    >
      {n}
    </span>
  );
}

function InstallTabs({ packages }: { packages: string[] }) {
  return (
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
          <CodeBlock code={`${pm.install} ${packages.join(" ")}`} language="bash" />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function ComponentInstall({ cliCommand, dependencies, files, utilsSource }: Props) {
  const steps: ReactNode[] = [];

  if (utilsSource) {
    steps.push(
      <li key="cn-deps" className="grid grid-cols-[28px_1fr] gap-3">
        <StepNumber n={steps.length + 1} />
        <div className="flex flex-col gap-3 min-w-0">
          <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
            Install <code>clsx</code> and <code>tailwind-merge</code> (needed by the <code>cn</code>{" "}
            helper).
          </p>
          <InstallTabs packages={CN_DEPS} />
        </div>
      </li>,
      <li key="cn-file" className="grid grid-cols-[28px_1fr] gap-3">
        <StepNumber n={steps.length + 1} />
        <div className="flex flex-col gap-3 min-w-0">
          <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
            Create <code>lib/utils.ts</code> with the <code>cn</code> helper.
          </p>
          <CodeBlock code={utilsSource} filename="lib/utils.ts" language="ts" variant="terminal" />
        </div>
      </li>
    );
  }

  if (dependencies.length > 0) {
    steps.push(
      <li key="deps" className="grid grid-cols-[28px_1fr] gap-3">
        <StepNumber n={steps.length + 1} />
        <div className="flex flex-col gap-3 min-w-0">
          <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
            Install the component's dependencies:
          </p>
          <InstallTabs packages={dependencies} />
        </div>
      </li>
    );
  }

  steps.push(
    <li key="files" className="grid grid-cols-[28px_1fr] gap-3">
      <StepNumber n={steps.length + 1} />
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
    </li>,
    <li key="aliases" className="grid grid-cols-[28px_1fr] gap-3">
      <StepNumber n={steps.length + 1} />
      <div className="flex flex-col gap-2 min-w-0">
        <p className="font-sans text-sm text-[var(--fg-primary)] m-0">
          Update the import paths to match your project setup.
        </p>
        <p className="font-mono text-[11px] text-[var(--fg-muted)] leading-relaxed m-0">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          Snippets import from <code>@/lib/utils</code> for the <code>cn</code> helper. Adjust to
          your alias.
        </p>
      </div>
    </li>
  );

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
        <ol className="flex flex-col gap-6 list-none m-0 p-0">{steps}</ol>
      </TabsContent>
    </Tabs>
  );
}
