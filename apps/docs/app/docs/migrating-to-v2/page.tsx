import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Migrating to v2",
  description:
    "What changes from entrepta 1 to 2: the type scale, Phosphor icons, the Card, brand inks, new tokens and runtime themes.",
  alternates: { canonical: "/docs/migrating-to-v2" },
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

function Table({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-mono-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-left text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
            <th className="py-2 pr-6 font-normal">{head[0]}</th>
            <th className="py-2 font-normal">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([before, after]) => (
            <tr key={before} className="border-b border-[var(--border-subtle)] last:border-0">
              <td className="py-2.5 pr-6 text-[var(--fg-secondary)]">{before}</td>
              <td className="py-2.5 text-[var(--fg-primary)]">{after}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// The old class names are built by interpolation so the type scale test, which reads this
// file, does not flag the examples as real sizes.
const px = (n: number) => `text-[${n}px]`;
const step = (name: string) => `text-${name}`;

const SIZES: [string, string][] = [
  [px(10), step("mono-xs")],
  [
    `${px(11)}, ${step("xs")}`,
    `${step("mono-sm")} for labels, ${step("mono-xs")} for group headings`,
  ],
  [px(12), step("mono-sm")],
  [`${px(13)} or ${px(14)} in mono`, step("mono-md")],
  [`${px(13)} in sans`, step("body-md")],
  [`${step("sm")} on a large button`, step("body-lg")],
  [`${step("2xl")} on a Card or Dialog title`, step("heading-lg")],
];

const T_CLASSES: [string, string][] = [
  [".t-display-xl", "font-serif text-display-xl"],
  [".t-heading-md", "font-serif text-heading-md (now 18px, was 20px)"],
  [".t-body-md", "font-sans text-body-md"],
  [".t-mono-sm", "font-mono text-mono-sm"],
  [".t-mono-xs", "font-mono text-mono-xs (now 10px, was 11px)"],
  [".t-muted, .t-secondary", "text-[var(--fg-muted)], text-[var(--fg-secondary)]"],
  [".t-brand", "text-[var(--fg-brand-text)] below 24px, text-[var(--fg-brand)] above"],
];

const ICONS: [string, string][] = [
  ["Loader2", "CircleNotchIcon, with animate-spin"],
  ["X", "XIcon"],
  ["Check", "CheckIcon"],
  ["ChevronRight", "CaretRightIcon"],
  ["Circle", 'CircleIcon weight="fill"'],
  ["Search", "MagnifyingGlassIcon"],
  ["Copy", "CopyIcon"],
  ["AlertTriangle", "WarningIcon"],
  ["Sun, Moon", "SunIcon, MoonIcon"],
];

const INKS: [string, string][] = [
  ["text-[var(--bg-canvas)] on a brand fill", "text-[var(--fg-on-brand)]"],
  ["text-[var(--zinc-50)] on a brand fill", "text-[var(--fg-on-brand)]"],
  ["text-[var(--fg-brand)] on text below 24px", "text-[var(--fg-brand-text)]"],
  ["text-[var(--fg-brand-hover)] on the brand tint", "text-[var(--fg-brand-text)]"],
  ["bg-[var(--bg-surface)] on a card", "bg-[var(--bg-card)]"],
  ["bg-[var(--bg-surface)] on a dialog", "bg-[var(--bg-overlay)]"],
];

export default function MigratingPage() {
  return (
    <article>
      <DocPageHeader
        eyebrow="getting started"
        title={
          <>
            Migrating to <em>v2.</em>
          </>
        }
        description="Version 2 changes the type scale, the icons, the Card and the brand inks, all at once. Here is what to change, in the order worth doing it."
        meta="breaking"
      />

      <section className="mb-14">
        <DocSubhead count="3 commands">Update the files</DocSubhead>
        <Note>
          The CLI copies source, so nothing updates on its own. Rewrite the tokens, then each
          component you use. Commit first: --overwrite replaces your edits.
        </Note>
        <CodeBlock
          variant="terminal"
          language="bash"
          filename="terminal"
          code={`# tokens and cn: add --themes=all if you use the ThemeSwitcher
npx @entrepta/cli@latest init --theme=entrepta --overwrite

# every component you already have
npx @entrepta/cli@latest add button card dialog --overwrite`}
        />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${SIZES.length} mappings`}>Font sizes</DocSubhead>
        <Note>
          Sizes come from ten scale steps now. Arbitrary pixel sizes and Tailwind default steps go.
          A step sets size and leading, never the family, so keep your font-* class.
        </Note>
        <Table head={["before", "after"]} rows={SIZES} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${T_CLASSES.length} mappings`}>.t-* classes</DocSubhead>
        <Note>The .t-* classes are gone. Each one becomes a family and a step.</Note>
        <Table head={["before", "after"]} rows={T_CLASSES} />
      </section>

      <section className="mb-14">
        <DocSubhead count={`${ICONS.length} icons`}>lucide to Phosphor</DocSubhead>
        <Note>
          Install @phosphor-icons/react and remove lucide-react. A file without use client imports
          from @phosphor-icons/react/dist/ssr. Phosphor takes size, not width and strokeWidth.
        </Note>
        <Table head={["lucide", "phosphor"]} rows={ICONS} />
      </section>

      <section className="mb-14">
        <DocSubhead count="same API">Card</DocSubhead>
        <Note>
          The parts are the same. The look is new: near black, a border that lights up on hover, and
          a header that wraps. New: size (sm, md, xl), and as on CardLabel for heading semantics.
          The terminal variant now sets its own text color, so it reads in light mode.
        </Note>
      </section>

      <section className="mb-14">
        <DocSubhead count={`${INKS.length} swaps`}>Brand inks and surfaces</DocSubhead>
        <Note>Search your own code for these. The components already use the new tokens.</Note>
        <Table head={["before", "after"]} rows={INKS} />
      </section>

      <section className="mb-14">
        <DocSubhead count="3 changes">Themes</DocSubhead>
        <Note>
          The ThemeSwitcher needs every theme in your CSS: run init with --themes=all. Light mode
          brands moved slightly (entrepta light is now #6656FF) so every ink clears AA. Add
          suppressHydrationWarning to your {"<html>"} if you use ThemeScript or ModeScript.
        </Note>
      </section>

      <section>
        <DocSubhead count="4 changes">Components</DocSubhead>
        <ul className="m-0 flex max-w-2xl list-none flex-col gap-3 p-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
          <li>
            <span className="text-[var(--fg-primary)]">Tabs.</span> The × is a real button next to
            the tab, on the active tab only. Route tabs use the new TabNav and TabNavLink. Tabs now
            depend on motion.
          </li>
          <li>
            <span className="text-[var(--fg-primary)]">StatusBar.</span> position="static" puts it
            in your layout instead of five override classes.
          </li>
          <li>
            <span className="text-[var(--fg-primary)]">CodeBlock.</span> A failed copy now shows
            copy failed instead of claiming it copied.
          </li>
          <li>
            <span className="text-[var(--fg-primary)]">Motion.</span> Reveal, TypeIn, RollingNumber
            and Spotlight bring the motion package when you add them. Nothing else needs it.
          </li>
        </ul>
      </section>
    </article>
  );
}
