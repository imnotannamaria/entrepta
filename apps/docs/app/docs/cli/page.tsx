import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { NpmPackages } from "@/components/npm-packages";
import { CLI_COMMANDS } from "@/lib/docs-data";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import {
  Card,
  CardComment,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTitle,
} from "@entrepta/registry/primitives/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CLI",
  description:
    "The entrepta CLI reference: init and add, their flags, and entrepta.json. Copy components with everything they import.",
  alternates: { canonical: "/docs/cli", types: { "text/markdown": "/docs/cli.md" } },
};

export default function CliPage() {
  return (
    <article>
      <DocPageHeader
        markdown="/docs/cli"
        eyebrow="reference"
        title={
          <>
            <em>CLI</em> reference.
          </>
        }
        description={
          <>
            The <code>entrepta</code> CLI copies components and tokens directly into your project.
            No SDK, no runtime wrapper. You own the source.
          </>
        }
        meta={`${CLI_COMMANDS.length} commands`}
      />

      <section className="mb-12">
        <DocSubhead count="2 packages">On npm</DocSubhead>
        <NpmPackages />
      </section>

      <section className="mb-12">
        <DocSubhead count="quick try">First run</DocSubhead>
        <CodeBlock
          variant="terminal"
          filename="terminal · zsh"
          meta="~/your-app"
          language="bash"
          code={`npx @entrepta/cli@latest init --theme=entrepta
npx @entrepta/cli@latest add button`}
        >
          <div className="flex flex-col gap-2">
            <div className="text-[var(--fg-secondary)]">
              <span className="text-[var(--fg-brand)]">$</span> npx @entrepta/cli@latest init
              <span className="text-[var(--fg-muted)]"> --theme=entrepta</span>
            </div>
            <div className="text-[var(--fg-muted)] text-mono-sm pl-3">→ wrote app/globals.css</div>
            <div className="text-[var(--fg-muted)] text-mono-sm pl-3">→ created entrepta.json</div>
            <div className="text-[var(--fg-secondary)] mt-2">
              <span className="text-[var(--fg-brand)]">$</span> npx @entrepta/cli@latest add button
            </div>
            <div className="text-[var(--fg-muted)] text-mono-sm pl-3">
              → copied components/entrepta/button.tsx
            </div>
          </div>
        </CodeBlock>
      </section>

      <section>
        <DocSubhead count={`${CLI_COMMANDS.length} commands`}>Commands</DocSubhead>
        <div className="flex flex-col gap-4">
          {CLI_COMMANDS.map((c) => (
            <Card key={c.cmd}>
              <CardHeader>
                <CardLabel>{c.title}</CardLabel>
                <CardMeta>
                  {c.flags.length === 0
                    ? "no flags"
                    : `${c.flags.length} flag${c.flags.length > 1 ? "s" : ""}`}
                </CardMeta>
              </CardHeader>
              <CardTitle className="font-mono text-mono-md text-[var(--fg-primary)]">
                <span className="text-[var(--fg-brand)]">$</span> {c.cmd}
              </CardTitle>
              <p className="font-sans text-body-md leading-relaxed text-[var(--fg-secondary)] m-0">
                {c.desc}
              </p>
              {c.flags.length > 0 && (
                <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-subtle)]">
                  {c.flags.map((f) => (
                    <div
                      key={f.flag}
                      className="grid grid-cols-[220px_1fr] gap-3 items-center font-mono text-mono-sm"
                    >
                      <code className="text-[var(--fg-brand-text)]">{f.flag}</code>
                      <span className="text-[var(--fg-muted)]">{f.desc}</span>
                    </div>
                  ))}
                </div>
              )}
              <CardFooter>
                <CardComment>copy paste, no install</CardComment>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </article>
  );
}
