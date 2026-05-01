const COMMANDS = [
  {
    cmd: "npx entrepta init",
    desc: "Setup inicial — cria globals.css, lib/utils.ts, entrepta.json. Prompts tema interativo.",
    flags: [
      { flag: "--theme=<preset>", desc: "Skip the theme prompt" },
      { flag: "--overwrite", desc: "Overwrite existing files" },
    ],
  },
  {
    cmd: "npx entrepta add <component>",
    desc: "Copia 1+ componentes para o projeto. Resolve dependências automaticamente.",
    flags: [{ flag: "--overwrite", desc: "Overwrite without confirming" }],
  },
  {
    cmd: "npx entrepta add",
    desc: "Modo interativo — lista todos os componentes disponíveis para selecionar.",
    flags: [],
  },
  {
    cmd: "npx entrepta diff <component>",
    desc: "Mostra diff entre versão local e versão do registry.",
    flags: [],
  },
];

export default function CliPage() {
  return (
    <article className="max-w-2xl">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-brand)] mb-6">
        reference
      </div>
      <h1 className="font-serif text-4xl font-normal text-[var(--fg-primary)] leading-tight tracking-tight mb-4">
        CLI Reference
      </h1>
      <p className="font-sans text-base text-[var(--fg-secondary)] leading-relaxed mb-10">
        The{" "}
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1 py-0.5 rounded">
          entrepta
        </code>{" "}
        CLI copies components and tokens directly into your project.
      </p>

      <div className="flex flex-col gap-6">
        {COMMANDS.map((c) => (
          <div
            key={c.cmd}
            className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden"
          >
            <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
              <code className="font-mono text-sm text-[var(--fg-primary)]">
                <span className="text-[var(--status-success)]">$</span> {c.cmd}
              </code>
            </div>
            <div className="px-4 py-3 bg-[var(--bg-canvas)]">
              <p className="font-sans text-sm text-[var(--fg-secondary)] mb-3">{c.desc}</p>
              {c.flags.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {c.flags.map((f) => (
                    <div key={f.flag} className="flex items-center gap-3 font-mono text-xs">
                      <code className="text-[var(--fg-brand)]">{f.flag}</code>
                      <span className="text-[var(--fg-muted)]">{f.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
