import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import {
  Card,
  CardComment,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTerminalBar,
  CardTerminalBody,
  CardTitle,
} from "@entrepta/registry/primitives/card";

const COMMANDS = [
  {
    cmd: "npx entrepta init",
    title: "init",
    desc: "Bootstraps a project. Writes globals.css, lib/utils.ts, and entrepta.json. Prompts for a theme.",
    flags: [
      { flag: "--theme=<preset>", desc: "Skip the theme prompt" },
      { flag: "--overwrite", desc: "Overwrite existing files without asking" },
    ],
  },
  {
    cmd: "npx entrepta add <component>",
    title: "add",
    desc: "Copies one or more components into your project. Resolves dependencies automatically.",
    flags: [{ flag: "--overwrite", desc: "Overwrite without confirming" }],
  },
  {
    cmd: "npx entrepta add",
    title: "add (interactive)",
    desc: "Same as above, no args. Opens a picker with every available component.",
    flags: [],
  },
  {
    cmd: "npx entrepta diff <component>",
    title: "diff",
    desc: "Shows the diff between your local copy of a component and the current registry version.",
    flags: [],
  },
];

export default function CliPage() {
  return (
    <article>
      <DocPageHeader
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
        meta="4 commands"
      />

      <section className="mb-12">
        <DocSubhead count="quick try">First run</DocSubhead>
        <Card variant="terminal">
          <CardTerminalBar>
            <CardLabel>terminal · zsh</CardLabel>
            <CardMeta>~/your-app</CardMeta>
          </CardTerminalBar>
          <CardTerminalBody className="flex flex-col gap-2">
            <div className="text-[var(--fg-secondary)]">
              <span className="text-[var(--fg-brand)]">$</span> npx entrepta init
              <span className="text-[var(--fg-muted)]"> --theme=entrepta</span>
            </div>
            <div className="text-[var(--fg-muted)] text-[11px] pl-3">→ wrote app/globals.css</div>
            <div className="text-[var(--fg-muted)] text-[11px] pl-3">→ created entrepta.json</div>
            <div className="text-[var(--fg-secondary)] mt-2">
              <span className="text-[var(--fg-brand)]">$</span> npx entrepta add button
            </div>
            <div className="text-[var(--fg-muted)] text-[11px] pl-3">
              → copied components/entrepta/button.tsx
            </div>
          </CardTerminalBody>
        </Card>
      </section>

      <section>
        <DocSubhead count={`${COMMANDS.length} commands`}>Commands</DocSubhead>
        <div className="flex flex-col gap-4">
          {COMMANDS.map((c) => (
            <Card key={c.cmd}>
              <CardHeader>
                <CardLabel>{c.title}</CardLabel>
                <CardMeta>
                  {c.flags.length === 0
                    ? "no flags"
                    : `${c.flags.length} flag${c.flags.length > 1 ? "s" : ""}`}
                </CardMeta>
              </CardHeader>
              <CardTitle className="font-mono text-[15px] text-[var(--fg-primary)]">
                <span className="text-[var(--fg-brand)]">$</span> {c.cmd}
              </CardTitle>
              <p className="font-sans text-[13px] leading-relaxed text-[var(--fg-secondary)] m-0">
                {c.desc}
              </p>
              {c.flags.length > 0 && (
                <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-subtle)]">
                  {c.flags.map((f) => (
                    <div
                      key={f.flag}
                      className="grid grid-cols-[220px_1fr] gap-3 items-center font-mono text-[12px]"
                    >
                      <code className="text-[var(--fg-brand)]">{f.flag}</code>
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
