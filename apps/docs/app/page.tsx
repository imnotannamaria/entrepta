import { OpenAgentsButton } from "@/components/agents-configurator";
import { CommandPaletteTrigger } from "@/components/command-palette-trigger";
import { CopyInit, HeroStats, HomeShowcase, ThemeRow } from "@/components/home-hero";
import { HomeInstall } from "@/components/home-install";
import { HomeSection, SectionHead, SpecList } from "@/components/home-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SiteStatusBar } from "@/components/site-status-bar";
import { SpotlightCard } from "@/components/spotlight-card";
import { COMPONENT_INDEX, SECTIONS } from "@/lib/component-index";
import { USED_BY } from "@/lib/links";
import { tokenCount } from "@/lib/stats";
import { THEMES } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { VERSION, VERSION_LABEL } from "@/lib/version";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import { Diamond } from "@entrepta/registry/content/diamond";
import { Reveal } from "@entrepta/registry/motion/reveal";
import { RollingNumber } from "@entrepta/registry/motion/rolling-number";
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
import { Tabs, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";
import type { Icon } from "@phosphor-icons/react";
import {
  BellSimpleIcon,
  CheckIcon,
  CubeIcon,
  FileMdIcon,
  FileTextIcon,
  LayoutIcon,
  ListBulletsIcon,
  PaletteIcon,
  RobotIcon,
  SparkleIcon,
  TerminalWindowIcon,
  TextboxIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { CSSProperties } from "react";

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
        v{VERSION}
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
    <div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border-subtle)]">
      <Tabs defaultValue="home">
        <TabsList aria-label="Example files">
          <TabsTrigger value="home">home.tsx</TabsTrigger>
          <TabsTrigger value="about">about.md</TabsTrigger>
          <TabsTrigger value="stack">stack.ts</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  ),
  Content: (
    <CodeBlock
      variant="terminal"
      language="bash"
      showCopy={false}
      size="sm"
      code="npx @entrepta/cli@latest add code-block"
    />
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

/** What each section's card label shows in place of the ◆. */
const SECTION_ICONS: Record<(typeof SECTIONS)[number], Icon> = {
  Primitives: CubeIcon,
  Forms: TextboxIcon,
  Layout: LayoutIcon,
  Content: FileTextIcon,
  Feedback: BellSimpleIcon,
  Motion: SparkleIcon,
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
                  {VERSION_LABEL}
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
                {/* CSS, not TypeIn: the heading is the first thing on screen, so it fades in
                    before hydration and is there with JavaScript off */}
                <span
                  className="type-fade block"
                  style={{ "--type-delay": "0.05s" } as CSSProperties}
                >
                  A design system,
                </span>
                <em
                  className="type-fade block italic text-[var(--fg-brand)]"
                  style={{ "--type-delay": "0.22s" } as CSSProperties}
                >
                  posed as an IDE.
                </em>
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

            <div className="mt-6">
              <HeroStats stats={HERO_STATS} />
            </div>

            <p className="mt-6 text-center font-mono text-mono-sm text-[var(--fg-muted)]">
              in use at{" "}
              {USED_BY.map((u, i) => (
                <span key={u.name}>
                  {i > 0 && " · "}
                  <a
                    href={u.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--fg-secondary)] underline-offset-4 hover:text-[var(--fg-primary)] hover:underline"
                  >
                    {u.name} ↗
                  </a>
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* ── INSTALL ── */}
        <HomeSection id="install">
          <SectionHead
            eyebrow="getting started"
            title={
              <>
                <em>Three</em> commands.
                <br />
                <span className="text-[var(--fg-muted)]">You own the code.</span>
              </>
            }
            description={
              <>
                entrepta ships as CSS tokens and copy-paste components. No runtime SDK and no
                telemetry in what you copy. Drop it into a Next.js or Vite project and start
                shipping.
              </>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <HomeInstall steps={INSTALL_STEPS} />

            <Card>
              <CardHeader>
                <CardLabel icon={TerminalWindowIcon}>@entrepta/cli</CardLabel>
                <Badge variant="soft" color="brand">
                  v{VERSION}
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
        </HomeSection>

        {/* ── PRINCIPLES ── */}
        <HomeSection id="principles">
          <SectionHead
            title={
              <>
                <em>Six</em> principles.
                <br />
                One product personality.
              </>
            }
            aside={
              <span className="font-mono text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-muted)]">
                section 1.2 · brief
              </span>
            }
          />

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
        </HomeSection>

        {/* ── ACCESSIBILITY ── */}
        <HomeSection id="accessibility">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <SectionHead
              className="mb-0"
              eyebrow="a11y"
              title={
                <>
                  <em>Accessible</em> by
                  <br />
                  <span className="text-[var(--fg-muted)]">default.</span>
                </>
              }
              description={
                <>
                  Built on Radix and native elements, so keyboard, focus and ARIA come for free.
                  Every text color is measured against what it sits on, in every theme, and a test
                  fails the build if one drops below AA.
                </>
              }
            />
            <SpecList
              rows={[
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
              ]}
            />
          </div>
        </HomeSection>

        {/* ── SECURITY ── */}
        <HomeSection id="security">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <SectionHead
              className="mb-0"
              eyebrow="security"
              title={
                <>
                  <em>Careful</em> by
                  <br />
                  <span className="text-[var(--fg-muted)]">design.</span>
                </>
              }
              description={
                <>
                  entrepta ships as copy-paste source: no runtime SDK, no telemetry, no remote code.
                  The CLI guards against path traversal via aliases, the docs site sets a strict CSP
                  and the usual hardening headers, and dependencies stay few and justified.
                </>
              }
            />
            <SpecList
              rows={[
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
              ]}
            />
          </div>
        </HomeSection>

        {/* ── COMPONENTS PREVIEW ── */}
        <HomeSection>
          <SectionHead
            title={
              <>
                <em>What's</em> inside.{" "}
                <span className="text-[var(--fg-muted)]">
                  {COMPONENT_INDEX.length} components, {SECTIONS.length} sections.
                </span>
              </>
            }
            aside={
              <Link
                href="/docs/components"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0")}
              >
                browse all ↗
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((section, i) => {
              const items = COMPONENT_INDEX.filter((c) => c.section === section);
              return (
                <Reveal key={section} index={i}>
                  {/* the title's link stretches over the card; the preview sits above it, so
                      its real controls stay usable instead of nesting inside a link */}
                  <Card className="group relative h-full focus-within:border-[var(--border-strong)]">
                    <CardHeader>
                      <CardLabel icon={SECTION_ICONS[section]}>{section.toLowerCase()}</CardLabel>
                      <CardMeta>{`${items.length} ${items.length === 1 ? "component" : "components"}`}</CardMeta>
                    </CardHeader>
                    <CardTitle className="text-heading-md">
                      <Link
                        href={`/docs/components/${SECTION_FIRST_PAGE[section]}`}
                        className="focus-ring rounded-[var(--radius-sm)] after:absolute after:inset-0 after:content-['']"
                      >
                        {section}
                      </Link>
                    </CardTitle>
                    <CardDescription>{items.map((c) => c.title).join(", ")}.</CardDescription>
                    <CardContent className="relative z-10">{SECTION_PREVIEWS[section]}</CardContent>
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
                </Reveal>
              );
            })}
            <Reveal index={SECTIONS.length}>
              <Card className="group relative h-full focus-within:border-[var(--border-strong)]">
                <CardHeader>
                  <CardLabel icon={PaletteIcon}>themes</CardLabel>
                  <CardMeta>{`${THEMES.length} presets`}</CardMeta>
                </CardHeader>
                <CardTitle className="text-heading-md">
                  <Link
                    href="/docs/themes"
                    className="focus-ring rounded-[var(--radius-sm)] after:absolute after:inset-0 after:content-['']"
                  >
                    Themes
                  </Link>
                </CardTitle>
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
                      >
                        <span className="sr-only">{t.label}</span>
                      </span>
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
            </Reveal>
          </div>
        </HomeSection>

        {/* ── FOR AGENTS ── */}
        <HomeSection id="for-agents">
          <SectionHead
            eyebrow="for your coding agent"
            title={
              <>
                <em>Readable</em> by agents,
                <br />
                <span className="text-[var(--fg-muted)]">not only people.</span>
              </>
            }
            description={
              <>
                Claude Code, Cursor and Codex read Markdown better than a web page. Every docs page
                has a Markdown version, and the site keeps an index an agent can start from.
              </>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="h-full">
              <CardHeader>
                <CardLabel icon={RobotIcon}>AGENTS.md</CardLabel>
                <CardMeta>for your project</CardMeta>
              </CardHeader>
              <CardTitle className="text-heading-md">Build the file for your repo.</CardTitle>
              <CardDescription>
                Pick the framework, theme and components. The file says how to install, where things
                live and which token goes where.
              </CardDescription>
              <CardFooter>
                <CardComment>header · AGENTS.md</CardComment>
                <OpenAgentsButton className="cursor-pointer text-[var(--fg-brand-text)] hover:underline underline-offset-4">
                  build yours →
                </OpenAgentsButton>
              </CardFooter>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <CardLabel icon={FileMdIcon}>.md</CardLabel>
                <CardMeta>every page</CardMeta>
              </CardHeader>
              <CardTitle className="text-heading-md">Add .md to any docs URL.</CardTitle>
              <CardDescription>
                The same page as Markdown. Each page also has a copy for agent button, and the
                migration guide copies whole.
              </CardDescription>
              <CardFooter>
                <CardComment>/docs/components/button.md</CardComment>
                <a
                  href="/docs/components/button.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--fg-brand-text)] hover:underline underline-offset-4"
                >
                  try it ↗
                </a>
              </CardFooter>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <CardLabel icon={ListBulletsIcon}>llms.txt</CardLabel>
                <CardMeta>the index</CardMeta>
              </CardHeader>
              <CardTitle className="text-heading-md">Start an agent at llms.txt.</CardTitle>
              <CardDescription>
                Every page, linked, in the llmstxt.org format. llms-full.txt is the whole site in
                one file, ready to paste.
              </CardDescription>
              <CardFooter>
                <CardComment>/llms-full.txt</CardComment>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--fg-brand-text)] hover:underline underline-offset-4"
                >
                  read llms.txt ↗
                </a>
              </CardFooter>
            </Card>
          </div>
        </HomeSection>

        {/* ── CTA STRIP ── */}
        <HomeSection>
          <SpotlightCard variant="featured" className="p-12 sm:p-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="font-mono text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-brand-text)]">
                · ready to ship
              </div>
              <h2 className="m-0 font-serif text-display-lg font-normal text-[var(--fg-primary)] lg:text-display-xl">
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
        </HomeSection>

        <SiteFooter />
      </main>

      <SiteStatusBar />
    </>
  );
}
