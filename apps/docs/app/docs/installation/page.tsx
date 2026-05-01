export default function InstallationPage() {
  return (
    <article className="max-w-2xl">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-brand)] mb-6">
        getting started
      </div>
      <h1 className="font-serif text-4xl font-normal text-[var(--fg-primary)] leading-tight tracking-tight mb-4">
        Installation
      </h1>
      <p className="font-sans text-base text-[var(--fg-secondary)] leading-relaxed mb-10">
        entrepta works with any React project. Tailwind v4 is recommended but not required.
      </p>

      <h2 className="font-sans text-lg font-semibold text-[var(--fg-primary)] mb-4 border-b border-[var(--border-subtle)] pb-2">
        Prerequisites
      </h2>
      <ul className="flex flex-col gap-2 mb-8 font-mono text-xs text-[var(--fg-secondary)]">
        {["React ≥ 19", "Next.js 15 (App Router)", "Tailwind v4", "TypeScript"].map((p) => (
          <li key={p} className="flex items-center gap-2">
            <span className="text-[var(--fg-brand)]">◆</span> {p}
          </li>
        ))}
      </ul>

      <h2 className="font-sans text-lg font-semibold text-[var(--fg-primary)] mb-4 border-b border-[var(--border-subtle)] pb-2">
        Setup
      </h2>
      <div className="flex flex-col gap-3 mb-8">
        {[
          {
            step: "1",
            code: "npx entrepta init",
            comment: "Detects your framework, prompts theme",
          },
          { step: "2", code: "npx entrepta init --theme=emerald", comment: "Skip the prompt" },
        ].map((s) => (
          <div
            key={s.step}
            className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-3 font-mono text-sm"
          >
            <span className="text-[var(--fg-muted)] text-[10px] mr-3">{s.step}</span>
            <span className="text-[var(--status-success)]">$</span>{" "}
            <span className="text-[var(--fg-primary)]">{s.code}</span>
            <span className="text-[var(--fg-muted)] ml-2 text-xs">{s.comment}</span>
          </div>
        ))}
      </div>

      <p className="font-sans text-sm text-[var(--fg-secondary)] leading-relaxed">
        This creates{" "}
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1 py-0.5 rounded">
          app/globals.css
        </code>{" "}
        with all design tokens,{" "}
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1 py-0.5 rounded">
          lib/utils.ts
        </code>{" "}
        with the{" "}
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1 py-0.5 rounded">
          cn()
        </code>{" "}
        helper, and{" "}
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1 py-0.5 rounded">
          entrepta.json
        </code>{" "}
        with your project config.
      </p>
    </article>
  );
}
