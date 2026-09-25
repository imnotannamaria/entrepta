import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { INK_PAIRS, InkTable } from "@/components/token-values";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "How entrepta stays readable and usable: measured inks in every theme, focus, the skip link, reduced motion and screen reader patterns.",
  alternates: { canonical: "/docs/foundations/accessibility" },
};

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-0 mb-4 max-w-2xl font-mono text-mono-sm leading-relaxed text-[var(--fg-muted)]">
      <span aria-hidden className="text-[var(--fg-brand)]">
        {"// "}
      </span>
      {children}
    </p>
  );
}

export default function AccessibilityPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="05 · foundations"
        title={
          <>
            <em>Accessibility.</em> Measured, not assumed.
          </>
        }
        description="Six themes, two modes, and one rule: every ink clears WCAG AA on what it sits on. A test measures it on every change, and this page measures it live."
        meta="WCAG 2.2 AA"
      />

      <section className="mb-14">
        <DocSubhead count="12 combinations">Inks</DocSubhead>
        <Note>
          No single ink reads on all six brands, so each theme sets two: --fg-on-brand for text on a
          brand fill, and --fg-brand-text for brand-colored text. The contrast test in the registry
          checks every pair below in all twelve theme and mode combinations. Switch the theme to see
          the numbers move.
        </Note>
        <InkTable pairs={INK_PAIRS} />
      </section>

      <section className="mb-14">
        <DocSubhead count="2 ways">Focus</DocSubhead>
        <Note>
          Links get a 2px brand outline. Buttons and menu items draw their own focus, because the
          reset removes outlines from them. A bare button with no style of its own takes the
          .focus-ring class, a box-shadow ring that survives the reset.
        </Note>
        <CodeBlock
          variant="terminal"
          language="tsx"
          filename="icon-button.tsx"
          code={`<button type="button" className="focus-ring" aria-label="Close">
  <XIcon aria-hidden />
</button>`}
        />
      </section>

      <section className="mb-14">
        <DocSubhead count="first in body">Skip link</DocSubhead>
        <Note>
          Hidden until the first Tab, then a mono chip with a $ in the top left. Point it at your
          main landmark.
        </Note>
        <CodeBlock
          variant="terminal"
          language="tsx"
          filename="app/layout.tsx"
          code={`<body>
  <a href="#main" className="skip-link">skip to content</a>
  …
  <main id="main" tabIndex={-1}>…</main>
</body>`}
        />
      </section>

      <section className="mb-14">
        <DocSubhead count="CSS and JS">Reduced motion</DocSubhead>
        <Note>
          The global reset stops every CSS animation and transition for people who ask for less
          motion. Motion components animate through JavaScript, which that reset never reaches, so
          every one of them calls useReducedMotion() and drops its movement, delays and springs. The
          .type-* classes zero their delays too, except .type-late, whose delay is the wait itself.
        </Note>
      </section>

      <section className="mb-14">
        <DocSubhead count="4 patterns">Screen readers</DocSubhead>
        <ul className="m-0 flex list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
          <li>
            <span className="text-[var(--fg-primary)]">Glyphs are hidden.</span> ◆, $, {"//"} and
            the window dots carry aria-hidden, so a label is read as its words.
          </li>
          <li>
            <span className="text-[var(--fg-primary)]">Animated text keeps a real copy.</span>{" "}
            TypeIn and RollingNumber hide their animated pieces and put the sentence or the number
            in an sr-only element. Not aria-label: a span has no role, so the label would be
            ignored.
          </li>
          <li>
            <span className="text-[var(--fg-primary)]">Forms are wired.</span> Field points the
            control at its error or hint with aria-describedby and sets aria-invalid, and the error
            is announced as an alert.
          </li>
          <li>
            <span className="text-[var(--fg-primary)]">Current means current.</span> Route tabs and
            the sidebar mark the active item with aria-current="page", the outline with
            aria-current="location", filter pills with aria-pressed.
          </li>
        </ul>
      </section>

      <section>
        <DocSubhead count="1 attribute">Theme scripts</DocSubhead>
        <Note>
          ThemeScript and ModeScript set data-theme and data-mode on {"<html>"} before React loads,
          so the page never flashes the wrong mode. React then sees attributes it did not render.
          Add suppressHydrationWarning to your {"<html>"} to tell it that is expected.
        </Note>
        <CodeBlock
          variant="terminal"
          language="tsx"
          filename="app/layout.tsx"
          code={`<html lang="en" suppressHydrationWarning>
  <head>
    <ThemeScript />
  </head>
  …
</html>`}
        />
      </section>
    </article>
  );
}
