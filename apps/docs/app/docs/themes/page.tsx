import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import {
  Card,
  CardComment,
  CardContent,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
} from "@entrepta/registry/primitives/card";

const THEMES = [
  {
    name: "entrepta",
    brand: "#7C6BFF",
    hover: "#9B8EFF",
    vibe: "Default. Violet, playful, IDE personality.",
  },
  {
    name: "blossom",
    brand: "#CC2E36",
    hover: "#E04750",
    vibe: "Cherry red. Bold and confident.",
  },
  {
    name: "marmalade",
    brand: "#FF8213",
    hover: "#FF9D45",
    vibe: "Warm orange. Editorial and energetic.",
  },
  {
    name: "julia",
    brand: "#E85A8A",
    hover: "#F178A0",
    vibe: "Warm pink. Soft and expressive.",
  },
  {
    name: "ivy",
    brand: "#35A365",
    hover: "#4CBA7C",
    vibe: "Forest green. Calm and grounded.",
  },
  {
    name: "bosco",
    brand: "#2563EB",
    hover: "#4F86F3",
    vibe: "Deep blue. Technical and steady.",
  },
];

export default function ThemesPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="customization"
        title={
          <>
            Six <em>themes.</em> One brand token.
          </>
        }
        description={
          <>
            Each preset overrides three CSS variables: <code>--fg-brand</code>,{" "}
            <code>--fg-brand-hover</code> and <code>--bg-surface-brand</code>. Everything else (zinc
            neutrals, status colors, spacing, type) is shared.
          </>
        }
        meta="6 presets"
      />

      <section className="mb-12">
        <DocSubhead count="6 presets">Available themes</DocSubhead>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map((t) => (
            <Card key={t.name}>
              <CardHeader>
                <CardLabel>{t.name}</CardLabel>
                <CardMeta>{t.brand}</CardMeta>
              </CardHeader>
              <CardContent>
                <div
                  className="h-20 rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
                  style={{
                    background: `linear-gradient(135deg, ${t.brand} 0%, ${t.hover} 100%)`,
                  }}
                />
              </CardContent>
              <p className="font-sans text-[13px] leading-relaxed text-[var(--fg-secondary)] m-0">
                {t.vibe}
              </p>
              <CardFooter>
                <code className="font-mono text-[11px] text-[var(--fg-muted)]">
                  --theme={t.name}
                </code>
                <CardComment>{t.brand}</CardComment>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <DocSubhead count="3 tokens">What changes per theme</DocSubhead>
        <Card variant="terminal">
          <div className="px-4 py-3 border-b border-[var(--border-subtle)] bg-black/30 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-secondary)]">
            {"// entrepta theme"}
          </div>
          <pre className="p-5 font-mono text-[13px] leading-relaxed text-[var(--fg-secondary)] overflow-x-auto m-0">
            {`:root {
  --fg-brand:         #7C6BFF;
  --fg-brand-hover:   #9B8EFF;
  --bg-surface-brand: rgba(124, 107, 255, 0.15);
}`}
          </pre>
        </Card>
        <p className="mt-4 font-mono text-[11px] text-[var(--fg-muted)] leading-relaxed">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          Switch at any time by running{" "}
          <code className="text-[var(--fg-primary)]">npx entrepta theme blossom</code>. Existing
          components pick up the new brand color on next page load.
        </p>
      </section>
    </article>
  );
}
