import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { THEME_NOTES, THEME_SWITCH } from "@/lib/docs-data";
import { THEMES as THEME_LIST } from "@/lib/theme";
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
import type { Metadata } from "next";

const THEMES = THEME_LIST.map((t) => ({
  name: t.id,
  brand: t.color,
  hover: THEME_NOTES[t.id].hover,
  vibe: THEME_NOTES[t.id].vibe,
}));

export const metadata: Metadata = {
  title: "Themes",
  description:
    "Six entrepta theme presets: entrepta, blossom, marmalade, julia, ivy, bosco. Swap brand color with one CLI flag, same tokens.",
  alternates: { canonical: "/docs/themes", types: { "text/markdown": "/docs/themes.md" } },
};

export default function ThemesPage() {
  return (
    <article>
      <DocPageHeader
        markdown="/docs/themes"
        eyebrow="customization"
        title={
          <>
            Six <em>themes.</em> One brand token.
          </>
        }
        description={
          <>
            Each preset sets only the brand: <code>--fg-brand</code>, its hover, its two measured
            inks, the tint and the focus ring. Everything else (zinc neutrals, status colors,
            spacing, type) is shared.
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
              <p className="font-sans text-body-md leading-relaxed text-[var(--fg-secondary)] m-0">
                {t.vibe}
              </p>
              <CardFooter>
                <code className="font-mono text-mono-sm text-[var(--fg-muted)]">
                  --theme={t.name}
                </code>
                <CardComment>{t.brand}</CardComment>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <DocSubhead count="6 tokens">What changes per theme</DocSubhead>
        <CodeBlock
          variant="terminal"
          filename="styles/themes/entrepta.css"
          language="css"
          code={`:root {
  --fg-brand:         #7c6bff;  /* fills, borders, glyphs, large text */
  --fg-brand-hover:   #9b8eff;
  --fg-on-brand:      #09090b;  /* text on a brand fill */
  --fg-brand-text:    #9b8eff;  /* brand-colored text */
  --bg-surface-brand: rgba(124, 107, 255, 0.15);
  --ring:             rgba(124, 107, 255, 0.5);
}`}
        />
        <p className="mt-4 font-mono text-mono-sm text-[var(--fg-muted)] leading-relaxed">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          Each preset is one block of CSS variables per mode. The two inks are set per theme because
          no single one reads on all six brands. Every pair clears WCAG AA in both modes.
        </p>
      </section>

      <section className="mb-12">
        <DocSubhead count="2 ways">One theme or all six</DocSubhead>
        <CodeBlock
          variant="terminal"
          filename="terminal"
          language="bash"
          code={`# one fixed theme
npx @entrepta/cli@latest init --theme=ivy

# all six, switchable at runtime
npx @entrepta/cli@latest init --theme=ivy --themes=all`}
        />
        <p className="mt-4 font-mono text-mono-sm text-[var(--fg-muted)] leading-relaxed">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          With <code className="text-[var(--fg-primary)]">--themes=all</code>, each theme lives
          under <code className="text-[var(--fg-primary)]">data-theme</code> on{" "}
          <code className="text-[var(--fg-primary)]">&lt;html&gt;</code>, and the one you picked is
          the default. Add the <code className="text-[var(--fg-primary)]">theme-switcher</code>{" "}
          component to let people choose.
        </p>
      </section>

      <section className="mb-12">
        <DocSubhead count="2 modes">Dark or light</DocSubhead>
        <p className="font-sans text-body-md leading-relaxed text-[var(--fg-secondary)] mb-4 max-w-2xl">
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
        <p className="mt-4 font-mono text-mono-sm text-[var(--fg-muted)] leading-relaxed">
          <span className="text-[var(--fg-brand)]">{"// "}</span>
          To let people toggle it, add the{" "}
          <code className="text-[var(--fg-primary)]">mode-toggle</code> component. It stores the
          choice, and its <code className="text-[var(--fg-primary)]">ModeScript</code> sets the
          attribute before the page paints.
        </p>
      </section>

      <section>
        <DocSubhead count="1 frame">Switching</DocSubhead>
        <p className="font-sans text-body-md leading-relaxed text-[var(--fg-secondary)] mb-4 max-w-2xl">
          {THEME_SWITCH.text}
        </p>
        <CodeBlock variant="terminal" filename="theme.ts" language="ts" code={THEME_SWITCH.code} />
      </section>
    </article>
  );
}
