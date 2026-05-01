export default function ThemesPage() {
  const themes = [
    {
      name: "entrepta",
      brand: "#7C6BFF",
      vibe: "Default — personal, lúdico, IDE personality",
    },
    { name: "zinc", brand: "#A1A1AA", vibe: "Sem accent — neutro frio, terminal-like" },
    { name: "emerald", brand: "#10B981", vibe: "Open source, devtools, fintech" },
    { name: "amber", brand: "#F59E0B", vibe: "Warmth, blogs, editorial" },
    { name: "rose", brand: "#F43F5E", vibe: "Bold, creative, agencies" },
    { name: "slate", brand: "#64748B", vibe: "Neutro quente, corporate-friendly" },
  ];

  return (
    <article className="max-w-3xl">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-brand)] mb-6">
        customization
      </div>
      <h1 className="font-serif text-4xl font-normal text-[var(--fg-primary)] leading-tight tracking-tight mb-4">
        Themes
      </h1>
      <p className="font-sans text-base text-[var(--fg-secondary)] leading-relaxed mb-10">
        6 presets. Each changes only{" "}
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1.5 py-0.5 rounded">
          --fg-brand
        </code>
        ,{" "}
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1.5 py-0.5 rounded">
          --bg-surface-brand
        </code>
        , and{" "}
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] px-1.5 py-0.5 rounded">
          --ring
        </code>
        . Everything else — zinc neutrals, status colors, spacing, type — is shared.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {themes.map((t) => (
          <div
            key={t.name}
            className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-canvas)]"
          >
            <div className="h-16 flex items-center px-5" style={{ backgroundColor: t.brand }}>
              <span className="font-mono text-sm text-white font-medium">{t.name}</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded text-white"
                  style={{ backgroundColor: t.brand }}
                >
                  {t.brand}
                </span>
                <code className="font-mono text-[10px] text-[var(--fg-muted)]">--fg-brand</code>
              </div>
              <p className="font-sans text-xs text-[var(--fg-muted)]">{t.vibe}</p>
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <code className="font-mono text-[11px] text-[var(--fg-secondary)]">
                  npx entrepta init --theme={t.name}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-5 bg-[var(--bg-surface)]">
        <div className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-3">
          {"// tokens that change per theme"}
        </div>
        <pre className="font-mono text-xs text-[var(--fg-secondary)] leading-6 overflow-x-auto">
          {`/* entrepta (default) */
:root {
  --fg-brand:        #7C6BFF;
  --bg-surface-brand: rgba(124,107,255,0.12);
  --ring:            #7C6BFF;
}`}
        </pre>
      </div>
    </article>
  );
}
