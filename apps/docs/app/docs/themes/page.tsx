import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { CodeBlock } from "@entrepta/registry/content/code-block";
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

      <section className="mb-12">
        <DocSubhead count="3 tokens">What changes per theme</DocSubhead>
        <CodeBlock
          variant="terminal"
          filename="entrepta theme"
          language="css"
          code={`:root {
  --fg-brand:         #7C6BFF;
  --fg-brand-hover:   #9B8EFF;
  --bg-surface-brand: rgba(124, 107, 255, 0.15);
}`}
        />
        <p className="mt-4 font-mono text-[11px] text-[var(--fg-muted)] leading-relaxed">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          Each preset is a single block of CSS variables. To switch, copy the contents of{" "}
          <code className="text-[var(--fg-primary)]">styles/themes/blossom.css</code> (or any
          preset) into the same place in{" "}
          <code className="text-[var(--fg-primary)]">app/globals.css</code>. Existing components
          pick up the new brand color on next page load.
        </p>
      </section>

      <section>
        <DocSubhead count="2 modes">Dark or light</DocSubhead>
        <p className="font-sans text-[13px] leading-relaxed text-[var(--fg-secondary)] mb-4 max-w-2xl">
          Every theme works in both dark and light mode. Dark is the default (no attribute needed).
          Light mode is opted into by setting{" "}
          <code className="font-mono text-[var(--fg-primary)]">data-mode="light"</code> on{" "}
          <code className="font-mono text-[var(--fg-primary)]">&lt;html&gt;</code>. Surface,
          foreground and border tokens flip; the brand color shifts slightly darker to keep AA
          contrast on white. Terminal-style surfaces (CodeBlock, Card{" "}
          <code className="font-mono">variant="terminal"</code>, Tooltip) stay dark in both modes by
          carrying <code className="font-mono text-[var(--fg-primary)]">data-surface="dark"</code>{" "}
          internally.
        </p>
        <CodeBlock
          variant="terminal"
          filename="app/layout.tsx"
          language="tsx"
          code={`<html lang="en" data-theme="entrepta" data-mode="light">
  ...
</html>`}
        />
        <p className="mt-4 font-mono text-[11px] text-[var(--fg-muted)] leading-relaxed">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          To make it user-toggleable, mirror the docs site: persist the choice in{" "}
          <code className="text-[var(--fg-primary)]">localStorage</code> and run a tiny inline
          script before hydration that reads it and sets the attribute. The full implementation is
          in{" "}
          <code className="text-[var(--fg-primary)]">apps/docs/components/theme-switcher.tsx</code>{" "}
          and <code className="text-[var(--fg-primary)]">theme-init-script.tsx</code>.
        </p>
      </section>
    </article>
  );
}
