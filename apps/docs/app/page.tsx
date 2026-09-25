import { OpenAgentsButton } from "@/components/agents-configurator";
import { CommandPaletteTrigger } from "@/components/command-palette-trigger";
import { CopyInit, HomeShowcase, ThemeRow } from "@/components/home-hero";
import { HomeInstall } from "@/components/home-install";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SiteStatusBar } from "@/components/site-status-bar";
import { SpotlightCard } from "@/components/spotlight-card";
import { COMPONENT_INDEX, SECTIONS } from "@/lib/component-index";
import { tokenCount } from "@/lib/stats";
import { THEMES } from "@/lib/theme";
import { Diamond } from "@entrepta/registry/content/diamond";
import { Reveal } from "@entrepta/registry/motion/reveal";
import { RollingNumber } from "@entrepta/registry/motion/rolling-number";
import { TypeIn } from "@entrepta/registry/motion/type-in";
import { Badge } from "@entrepta/registry/primitives/badge";
import { buttonVariants } from "@entrepta/registry/primitives/button-variants";
import {
  Card,
  CardComment,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTitle,
} from "@entrepta/registry/primitives/card";
import { Kbd } from "@entrepta/registry/primitives/kbd";
import { Switch } from "@entrepta/registry/primitives/switch";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const PRINCIPLES = [
  {
    num: "01",
    title: "Dark-first, always.",
    desc: "Both products are born dark. Light mode is optional, never priority. The deep zinc-950 is the canvas, not dashboard gray.",
    tag: "canvas: #09090B",
  },
  {
    num: "02",
    title: "Editor as metaphor.",
    desc: "Tabs, command palette, status bar, file paths, inline comments, shell prompts, monospace metadata. Not decoration. Personality.",
    tag: "tabs · ⌘K · > · $ · //",
  },
  {
    num: "03",
    title: "Typography with deliberate contrast.",
    desc: "Editorial serif for proper nouns. Mono for the rest. Sans only for long prose. The contrast is the signature.",
    tag: "newsreader · jetbrains mono · inter",
  },
  {
    num: "04",
    title: "Color with restraint.",
    desc: "The brand shows up in CTAs, focus and featured cards, with an ink measured for every theme. Cards sit a hair above a darker zinc. The rest is black, white and cold gray.",
    tag: "--fg-brand · --fg-brand-text · zinc",
  },
  {
    num: "05",
    title: "High density, clear hierarchy.",
    desc: "A lot of information without feeling chaotic. Strict 12-col grid, defined cards, small badges and dots create secondary rhythm.",
    tag: "12 cols · 24 gutters · 1280 max",
  },
  {
    num: "06",
    title: "Motion with a job.",
    desc: "Entrances, counters and light that follows the cursor, each one earning its place. Every animation has a reduced-motion path, the JavaScript ones included.",
    tag: "whileInView · once · reduced motion",
  },
];

/** A preview per docs section. Names and counts come from the component index. */
const SECTION_PREVIEWS: Record<(typeof SECTIONS)[number], React.ReactNode> = {
  Primitives: (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge variant="solid" color="brand">
        FEATURED
      </Badge>
      <Badge variant="soft" color="success" dot>
        shipped
      </Badge>
      <Badge variant="outline" color="neutral">
        v2.0.0
      </Badge>
    </div>
  ),
  Forms: (
    <div className="flex flex-col gap-2">
      <span className="inline-flex items-center gap-1.5 font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
        <Diamond /> email <span className="text-[var(--fg-brand)]">*</span>
      </span>
      <Switch label="send me a copy" defaultChecked />
    </div>
  ),
  Layout: (
    <div className="flex overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-canvas)] font-mono text-mono-sm">
      <span className="inline-flex items-center gap-1.5 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-[var(--fg-primary)]">
        <Diamond /> home.tsx
      </span>
      <span className="border-r border-[var(--border-subtle)] px-3 py-1.5 text-[var(--fg-muted)]">
        about.md
      </span>
      <span className="px-3 py-1.5 text-[var(--fg-muted)]">stack.ts</span>
    </div>
  ),
  Content: (
    <div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-mono-sm">
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-chrome)] px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--status-error)] opacity-60" />
        <span className="h-2 w-2 rounded-full bg-[var(--status-warning)] opacity-60" />
        <span className="h-2 w-2 rounded-full bg-[var(--status-success)] opacity-60" />
        <span className="ml-auto text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-brand-text)]">
          bash
        </span>
      </div>
      <div className="px-3 py-2 text-[var(--fg-secondary)]">
        <span className="text-[var(--fg-brand)]">$</span> npx @entrepta/cli@latest add code-block
      </div>
    </div>
  ),
  Feedback: (
    <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-overlay)] p-3 font-mono shadow-[var(--shadow-card-hover)] [background-image:radial-gradient(140%_120%_at_0%_0%,color-mix(in_srgb,var(--status-success)_12%,transparent),transparent_55%)]">
      <span className="grid size-6 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--status-success-soft)] text-[var(--status-success-fg)]">
        <CheckIcon aria-hidden size={13} weight="bold" />
      </span>
      <div className="flex flex-col gap-0.5 pt-0.5">
        <div className="text-mono-md text-[var(--fg-primary)]">Build passed</div>
        <div className="font-sans text-mono-sm text-[var(--fg-secondary)]">
          {COMPONENT_INDEX.length} components compiled in 1.4s
        </div>
      </div>
    </div>
  ),
  Motion: (
    <div className="flex items-baseline gap-3 font-mono text-mono-sm text-[var(--fg-muted)]">
      <RollingNumber
        value={128}
        height={40}
        className="font-serif text-display-md text-[var(--fg-primary)]"
      />
      repos shipped
    </div>
  ),
};

const SECTION_FIRST_PAGE = Object.fromEntries(
  SECTIONS.map((section) => [section, COMPONENT_INDEX.find((c) => c.section === section)?.slug])
);

const INSTALL_STEPS = [
  {
    num: "01",
    cmd: "npx @entrepta/cli@latest init --theme=entrepta",
    out: "wrote app/globals.css · created entrepta.json",
  },
  {
    num: "02",
    cmd: "npx @entrepta/cli@latest add button badge input",
    out: "3 components copied to components/entrepta/",
  },
  {
    num: "03",
    cmd: "npm run dev",
    out: null,
  },
];

const HERO_STATS = [
  { dt: "components", dd: String(COMPONENT_INDEX.length) },
  { dt: "themes", dd: String(THEMES.length) },
  { dt: "tokens", dd: String(tokenCount()) },
  // every theme in dark and light, each ink measured by a test
  { dt: "AA pairs", dd: String(THEMES.length * 2) },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main id="main-content" tabIndex={-1} className="pt-14 pb-10 sm:pb-16">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden">
          {/* a dot grid that fades out from the top */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_30%,transparent_100%)]"
          />
          <div className="relative mx-auto max-w-[1280px] px-4 pt-16 pb-16 sm:px-12 sm:pt-24">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <Link
                href="/docs/migrating-to-v2"
                className="group mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-1 pr-3 pl-1.5 font-mono text-mono-sm text-[var(--fg-secondary)] transition-colors hover:border-[var(--border-brand)] hover:text-[var(--fg-primary)]"
              >
                <Badge variant="solid" color="brand" size="sm" className="rounded-full">
                  v2.0
                </Badge>
                {`${COMPONENT_INDEX.length} components · ${THEMES.length} themes · motion`}
                <span
                  aria-hidden
                  className="text-[var(--fg-brand-text)] transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>

              <h1 className="m-0 mb-7 font-serif text-display-md font-normal text-[var(--fg-primary)] sm:text-display-lg lg:text-display-xl">
                <TypeIn text="A design system," by="word" className="block" />
                <TypeIn
                  text="posed as an IDE."
                  emphasis="posed as an IDE."
                  by="word"
                  delay={0.25}
                  className="block"
                />
              </h1>

              <p className="m-0 mb-10 max-w-2xl text-balance font-sans text-body-lg text-[var(--fg-secondary)] sm:text-heading-md sm:font-normal">
                <strong className="font-medium text-[var(--fg-primary)]">entrepta</strong> is a
                dark-first React library you copy into your repo: tabs, a command palette, a status
                bar, serif italic next to mono. Every ink is measured in six themes.
              </p>

              <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
                <Link href="/docs/components" className={buttonVariants({ size: "lg" })}>
                  browse components <span aria-hidden>→</span>
                </Link>
                <CopyInit />
                <CommandPaletteTrigger />
              </div>

              <ThemeRow />
            </div>

            <div className="mt-16 sm:mt-20">
              <Reveal>
                <HomeShowcase />
              </Reveal>
            </div>

            <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-4">
              {HERO_STATS.map((s) => (
                <div
                  key={s.dt}
                  className="flex flex-col items-center gap-1 bg-[var(--bg-canvas)] px-4 py-5"
                >
                  <dd className="order-1 m-0 font-serif text-display-md text-[var(--fg-primary)]">
                    <RollingNumber value={s.dd} height={40} />
                  </dd>
                  <dt className="order-2 font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
                    {s.dt}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── INSTALL ── */}
        <section
          id="install"
          className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]"
        >
          <div className="mb-10">
            <div className="font-mono text-mono-sm text-[var(--fg-brand-text)] uppercase tracking-[0.08em] mb-3">
              · getting started
            </div>
            <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
              <em className="italic text-[var(--fg-brand)]">Three</em> commands.
              <br />
              <span className="text-[var(--fg-muted)]">You own the code.</span>
            </h2>
            <p className="mt-4 font-sans text-body-lg text-[var(--fg-secondary)] max-w-lg leading-relaxed">
              entrepta ships as CSS tokens and copy-paste components. No runtime SDK and no
              telemetry in what you copy. Drop it into a Next.js or Vite project and start shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <HomeInstall steps={INSTALL_STEPS} />

            <Card>
              <CardHeader>
                <CardLabel>@entrepta/cli</CardLabel>
                <Badge variant="soft" color="brand">
                  v2.0.0
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {[
                  { k: "size", v: "~7 kb gzipped" },
                  { k: "deps", v: "react 19+" },
                  { k: "ships", v: "css vars · components" },
                  { k: "license", v: "MIT" },
                  { k: "themes", v: `${THEMES.length} presets, fixed or at runtime` },
                ].map((r, i) => (
                  <div
                    key={r.k}
                    className={`flex items-center justify-between font-mono text-mono-sm ${
                      i > 0 ? "border-t border-[var(--border-subtle)] pt-3" : ""
                    }`}
                  >
                    <span className="text-[var(--fg-muted)]">{r.k}</span>
                    <span className="text-[var(--fg-secondary)]">{r.v}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <CardComment>mit · open source</CardComment>
                <Link
                  href="/docs"
                  className="text-[var(--fg-brand-text)] hover:opacity-80 transition-opacity"
                >
                  read the docs ↗
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* ── PRINCIPLES ── */}
        <section
          id="principles"
          className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]"
        >
          <div className="flex items-start justify-between mb-12 gap-6">
            <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
              <em className="italic text-[var(--fg-brand)]">Six</em> principles.
              <br />
              One product personality.
            </h2>
            <span className="font-mono text-mono-sm text-[var(--fg-muted)] hidden sm:inline-block mt-2 uppercase tracking-[0.08em]">
              section 1.2 · brief
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.num} index={i}>
                <Card className="h-full">
                  <CardHeader>
                    <CardLabel>principle {p.num}</CardLabel>
                  </CardHeader>
                  <CardTitle className="text-heading-md">{p.title}</CardTitle>
                  <CardDescription>{p.desc}</CardDescription>
                  <CardFooter>
                    <CardComment>{p.tag}</CardComment>
                  </CardFooter>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── ACCESSIBILITY ── */}
        <section
          id="accessibility"
          className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <div className="font-mono text-mono-sm text-[var(--fg-brand-text)] uppercase tracking-[0.08em] mb-3">
                · a11y
              </div>
              <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
                <em className="italic text-[var(--fg-brand)]">Accessible</em> by
                <br />
                <span className="text-[var(--fg-muted)]">default.</span>
              </h2>
              <p className="mt-4 font-sans text-body-lg text-[var(--fg-secondary)] max-w-md leading-relaxed">
                Built on Radix and native elements, so keyboard, focus and ARIA come for free. Every
                text color is measured against what it sits on, in every theme, and a test fails the
                build if one drops below AA.
              </p>
            </div>
            <ul className="flex flex-col gap-0 border-t border-[var(--border-subtle)]">
              {[
                {
                  k: "keyboard",
                  v: "every interactive element reachable & operable",
                },
                {
                  k: "focus",
                  v: "a visible brand ring on links, buttons, fields and menu items",
                },
                {
                  k: "screen readers",
                  v: "Radix primitives + aria-label on icon-only controls",
                },
                {
                  k: "skip link",
                  v: "press Tab on any page to jump to the main content",
                },
                {
                  k: "motion",
                  v: "reduced motion stops CSS animations and every JS-driven one",
                },
                {
                  k: "live regions",
                  v: "theme & toast changes announced to screen readers",
                },
                {
                  k: "contrast",
                  v: "every ink measured against AA in all 12 theme and mode pairs, by a test",
                },
                {
                  k: "dark + light",
                  v: "every theme ships in two modes; the user picks via data-mode",
                },
              ].map((row) => (
                <li
                  key={row.k}
                  className="grid grid-cols-[140px_1fr] gap-4 items-baseline py-3 border-b border-[var(--border-subtle)] font-mono text-mono-sm"
                >
                  <span className="text-[var(--fg-brand-text)] inline-flex items-center gap-1.5">
                    <span aria-hidden className="text-mono-xs leading-none text-[var(--fg-brand)]">
                      ◆
                    </span>
                    {row.k}
                  </span>
                  <span className="text-[var(--fg-secondary)] leading-relaxed">{row.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── SECURITY ── */}
        <section
          id="security"
          className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <div className="font-mono text-mono-sm text-[var(--fg-brand-text)] uppercase tracking-[0.08em] mb-3">
                · security
              </div>
              <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
                <em className="italic text-[var(--fg-brand)]">Audited</em> by
                <br />
                <span className="text-[var(--fg-muted)]">design.</span>
              </h2>
              <p className="mt-4 font-sans text-body-lg text-[var(--fg-secondary)] max-w-md leading-relaxed">
                entrepta ships as copy-paste source: no runtime SDK, no telemetry, no remote code.
                The CLI guards against path traversal via aliases, the docs site sets a strict CSP
                and the usual hardening headers, and dependencies stay tight and audited.
              </p>
            </div>
            <ul className="flex flex-col gap-0 border-t border-[var(--border-subtle)]">
              {[
                {
                  k: "copy-paste",
                  v: "components land in your repo as plain source, with no runtime to compromise",
                },
                {
                  k: "no runtime telemetry",
                  v: "the CLI calls only npm; copied components ship zero analytics or beacons",
                },
                {
                  k: "alias guard",
                  v: "CLI refuses to write outside the project, even if entrepta.json is tampered",
                },
                {
                  k: "shell-safe",
                  v: "package-manager spawn uses shell:false so deps can't inject commands",
                },
                {
                  k: "csp + headers",
                  v: "strict Content-Security-Policy, HSTS, X-Frame-Options DENY, no Powered-By",
                },
                {
                  k: "no eval",
                  v: "zero eval / new Function / unsafe innerHTML in components or docs",
                },
                {
                  k: "deps minimal",
                  v: "few runtime deps, each one justified, so they stay easy to audit",
                },
              ].map((row) => (
                <li
                  key={row.k}
                  className="grid grid-cols-[140px_1fr] gap-4 items-baseline py-3 border-b border-[var(--border-subtle)] font-mono text-mono-sm"
                >
                  <span className="text-[var(--fg-brand-text)] inline-flex items-center gap-1.5">
                    <span aria-hidden className="text-mono-xs leading-none text-[var(--fg-brand)]">
                      ◆
                    </span>
                    {row.k}
                  </span>
                  <span className="text-[var(--fg-secondary)] leading-relaxed">{row.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── COMPONENTS PREVIEW ── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]">
          <div className="flex items-end justify-between mb-10 gap-6">
            <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
              <em className="italic text-[var(--fg-brand)]">What's</em> inside.{" "}
              <span className="text-[var(--fg-muted)]">
                {COMPONENT_INDEX.length} components, {SECTIONS.length} sections.
              </span>
            </h2>
            <Link
              href="/docs/components"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "hidden shrink-0 sm:inline-flex",
              })}
            >
              browse all ↗
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((section, i) => {
              const items = COMPONENT_INDEX.filter((c) => c.section === section);
              return (
                <Reveal key={section} index={i}>
                  <Link
                    href={`/docs/components/${SECTION_FIRST_PAGE[section]}`}
                    className="group block h-full"
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardLabel>{section.toLowerCase()}</CardLabel>
                        <CardMeta>{`${items.length} ${items.length === 1 ? "component" : "components"}`}</CardMeta>
                      </CardHeader>
                      <CardTitle className="text-heading-md">{section}</CardTitle>
                      <CardDescription>{items.map((c) => c.title).join(", ")}.</CardDescription>
                      <CardContent>{SECTION_PREVIEWS[section]}</CardContent>
                      <CardFooter>
                        <CardComment>{`${section.toLowerCase()}/`}</CardComment>
                        <span
                          aria-hidden
                          className="text-[var(--fg-brand)] transition-transform group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
            <Reveal index={SECTIONS.length}>
              <Link href="/docs/themes" className="group block h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardLabel>themes</CardLabel>
                    <CardMeta>{`${THEMES.length} presets`}</CardMeta>
                  </CardHeader>
                  <CardTitle className="text-heading-md">Themes</CardTitle>
                  <CardDescription>
                    One brand per theme, two measured inks each. Fixed, or all six at runtime.
                  </CardDescription>
                  <CardContent>
                    <div className="flex gap-2">
                      {THEMES.map((t) => (
                        <span
                          key={t.id}
                          title={t.label}
                          className="h-6 w-6 rounded-full border border-[var(--border-subtle)]"
                          style={{ background: t.color }}
                        />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <CardComment>--themes=all</CardComment>
                    <span
                      aria-hidden
                      className="text-[var(--fg-brand)] transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]">
          <SpotlightCard variant="featured" className="p-12 sm:p-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="font-mono text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-brand-text)]">
                · ready to ship
              </div>
              <h2 className="font-serif text-[clamp(36px,5vw,72px)] font-normal leading-none tracking-tight text-[var(--fg-primary)]">
                Start <em className="italic text-[var(--fg-brand)]">building.</em>
              </h2>
              <p className="font-sans text-body-lg text-[var(--fg-secondary)] max-w-md leading-relaxed">
                Every token, every component, every state. Laid out in the docs. Press <Kbd>⌘K</Kbd>{" "}
                to jump anywhere.
              </p>
              <div className="flex gap-3 justify-center flex-wrap mt-2">
                <Link href="/docs/components" className={buttonVariants({ size: "lg" })}>
                  browse components <span aria-hidden>→</span>
                </Link>
                <OpenAgentsButton className={buttonVariants({ variant: "secondary", size: "lg" })}>
                  get your AGENTS.md
                </OpenAgentsButton>
              </div>
            </div>
          </SpotlightCard>
        </section>

        <SiteFooter />
      </main>

      <SiteStatusBar />
    </>
  );
}
