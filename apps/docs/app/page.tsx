import { OpenAgentsButton } from "@/components/agents-configurator";
import { HomeCatalog } from "@/components/home-catalog";
import { CopyInit, HeroStats, ThemeRow } from "@/components/home-hero";
import { HomeSection, SectionHead, SpecList } from "@/components/home-section";
import { HomeShowcase } from "@/components/home-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { COMPONENT_INDEX, SECTIONS } from "@/lib/component-index";
import { LINKS, USED_BY } from "@/lib/links";
import { tokenCount } from "@/lib/stats";
import { THEMES } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { NEWS } from "@/lib/version";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import { Badge } from "@entrepta/registry/primitives/badge";
import { buttonVariants } from "@entrepta/registry/primitives/button-variants";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardNote,
  CardTitle,
} from "@entrepta/registry/primitives/card";
import { Kbd } from "@entrepta/registry/primitives/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";
import {
  CheckIcon,
  FileCssIcon,
  FileMdIcon,
  FileTsxIcon,
  ListBulletsIcon,
  RobotIcon,
  TerminalWindowIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { type CSSProperties, Fragment } from "react";

/** What a project gets, in the order it matters. */
const FEATURES = [
  "Copy-paste source. The components land in your repo, and you edit them.",
  `${COMPONENT_INDEX.length} components, from buttons to data tables, charts and chat.`,
  "Dark first, with seven themes. Fixed, or all of them at runtime.",
  "Every ink measured for WCAG AA, in every theme and both modes, by a test.",
  "React 19, Tailwind v4 and Radix. No runtime SDK and no telemetry.",
  "Plain CSS variables for tokens. One file to retheme a whole product.",
  "Money, dates, filters and tables that handle the hard parts for you.",
  "A CLI that resolves dependencies and never writes outside your project.",
  "Markdown for every docs page, an llms.txt and an AGENTS.md for your agent.",
  "Motion with a job, and a reduced-motion path for every animation.",
];

const HERO_STATS = [
  { dt: "components", dd: String(COMPONENT_INDEX.length) },
  { dt: "themes", dd: String(THEMES.length) },
  { dt: "tokens", dd: String(tokenCount()) },
  // every theme in dark and light, each ink measured by a test
  { dt: "AA pairs", dd: String(THEMES.length * 2) },
];

const ADD_CODE = `npx @entrepta/cli@latest init --theme=entrepta
npx @entrepta/cli@latest add button card metric`;

const USE_CODE = `import { Amount } from "@/components/entrepta/amount"
import { Metric } from "@/components/entrepta/metric"

export default function Page() {
  return (
    <Metric
      label="spent this month"
      value={<Amount value={218450} currency="USD" />}
    />
  )
}`;

const TOKENS_CODE = `:root {
  --fg-brand: #7c6bff;     /* your brand */
  --finish-glow: 1;        /* 0 is flat */
}`;

/**
 * When each piece of the hero arrives, in seconds from the first paint. The
 * heading goes word by word, then the lede, the actions and the code.
 */
const HERO_AT = {
  news: 0.1,
  heading: 0.25,
  italic: 0.5,
  lede: 0.85,
  actions: 1,
  code: 1.15,
};

const PANEL = "m-0 min-w-0 [grid-area:1/1] data-[state=inactive]:invisible";

const heroDelay = (seconds: number) => ({ "--hero-delay": `${seconds}s` }) as CSSProperties;

/** A line of the heading, a word at a time. The spaces stay text, so it reads as one line. */
function HeroWords({ text, at }: { text: string; at: number }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={word}>
      {i > 0 && " "}
      <span className="hero-in hero-word" style={heroDelay(at + i * 0.08)}>
        {word}
      </span>
    </Fragment>
  ));
}

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
          <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-4 pt-16 pb-16 sm:px-12 sm:pt-24 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex flex-col items-start">
              <img
                src="/brand/mascot-256.png"
                width={72}
                height={72}
                alt=""
                aria-hidden="true"
                style={heroDelay(HERO_AT.news)}
                className="hero-in mb-6 size-[72px] drop-shadow-[0_12px_32px_var(--shadow-brand)]"
              />
              <Link
                href={NEWS.href}
                style={heroDelay(HERO_AT.news)}
                className="hero-in group mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-1 pr-3 pl-1.5 font-mono text-mono-sm text-[var(--fg-secondary)] transition-colors hover:border-[var(--border-brand)] hover:text-[var(--fg-primary)]"
              >
                <Badge variant="solid" color="brand" size="sm" className="rounded-full">
                  new
                </Badge>
                {`${NEWS.label} · ${NEWS.summary}`}
                <span
                  aria-hidden
                  className="text-[var(--fg-brand-text)] transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>

              <h1 className="m-0 mb-6 font-serif text-display-md font-normal text-[var(--fg-primary)] sm:text-display-lg lg:text-display-md xl:text-display-lg">
                {/* CSS, not TypeIn: the heading is the first thing on screen, so it rises in
                    before hydration and is there with JavaScript off */}
                <span className="block">
                  <HeroWords text="The design system" at={HERO_AT.heading} />
                </span>{" "}
                <em className="block italic text-[var(--fg-brand)]">
                  <HeroWords text="you copy and own." at={HERO_AT.italic} />
                </em>
              </h1>

              <p
                style={heroDelay(HERO_AT.lede)}
                className="hero-in m-0 mb-8 max-w-xl text-pretty font-sans text-body-lg text-[var(--fg-secondary)]"
              >
                <strong className="font-medium text-[var(--fg-primary)]">entrepta</strong> is a
                dark-first React library. Near black surfaces, mono for UI, serif italic for titles.
                One command copies the components into your repo, and every ink is measured in seven
                themes.
              </p>

              <div
                style={heroDelay(HERO_AT.actions)}
                className="hero-in flex flex-wrap items-center gap-3"
              >
                <Link href="/docs/components" className={buttonVariants({ size: "lg" })}>
                  browse components <span aria-hidden>→</span>
                </Link>
                <CopyInit />
                <a
                  href={LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                  github ↗
                </a>
              </div>
            </div>

            <div
              style={heroDelay(HERO_AT.code)}
              className="hero-in [--hero-dur:1.2s] [--hero-rise:32px]"
            >
              <Card className="overflow-hidden p-0 max-sm:p-0 gap-0">
                <Tabs defaultValue="add">
                  <TabsList aria-label="How it works">
                    <TabsTrigger value="add" icon={<TerminalWindowIcon />}>
                      add
                    </TabsTrigger>
                    <TabsTrigger value="use" icon={<FileTsxIcon />}>
                      use
                    </TabsTrigger>
                    <TabsTrigger value="tokens" icon={<FileCssIcon />}>
                      tokens
                    </TabsTrigger>
                  </TabsList>
                  {/* every panel is rendered in the same cell, so the box takes the tallest one
                      and switching tabs never changes its height */}
                  <div className="grid">
                    <TabsContent value="add" forceMount className={PANEL}>
                      <CodeBlock
                        code={ADD_CODE}
                        language="bash"
                        filename="terminal"
                        className="h-full rounded-none border-0"
                      />
                    </TabsContent>
                    <TabsContent value="use" forceMount className={PANEL}>
                      <CodeBlock
                        code={USE_CODE}
                        language="tsx"
                        filename="app/page.tsx"
                        className="h-full rounded-none border-0"
                      />
                    </TabsContent>
                    <TabsContent value="tokens" forceMount className={PANEL}>
                      <CodeBlock
                        code={TOKENS_CODE}
                        language="css"
                        filename="app/globals.css"
                        className="h-full rounded-none border-0"
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
              <p className="mt-4 mb-0 font-mono text-mono-sm text-[var(--fg-muted)]">
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
          </div>
        </section>

        {/* ── GALLERY ── */}
        <HomeSection id="gallery" className="border-t-0 pt-4">
          <SectionHead
            eyebrow="live"
            title={
              <>
                <em>Real</em> components.
                <br />
                <span className="text-[var(--fg-muted)]">Not screenshots.</span>
              </>
            }
            description="Every card below is a file you can copy. Pick a theme and they all change."
            aside={<ThemeRow />}
          />
          <HomeShowcase />
          <div className="mt-6">
            <HeroStats stats={HERO_STATS} />
          </div>
        </HomeSection>

        {/* ── FEATURES ── */}
        <HomeSection id="features">
          <SectionHead
            eyebrow="what you get"
            title={
              <>
                <em>The short</em> list.
              </>
            }
            description="Each point is in the docs, with the code."
          />
          <ul className="m-0 grid list-none grid-cols-1 gap-x-12 gap-y-4 p-0 md:grid-cols-2">
            {FEATURES.map((text) => (
              <li
                key={text}
                className="flex items-start gap-3 font-sans text-body-lg leading-relaxed text-[var(--fg-secondary)]"
              >
                <CheckIcon
                  aria-hidden
                  size={16}
                  weight="bold"
                  className="mt-1.5 shrink-0 text-[var(--fg-brand)]"
                />
                {text}
              </li>
            ))}
          </ul>
        </HomeSection>

        {/* ── COMPONENTS INDEX ── */}
        <HomeSection id="inside">
          <SectionHead
            eyebrow="the catalog"
            title={
              <>
                <em>What&apos;s</em> inside.
                <br />
                <span className="text-[var(--fg-muted)]">
                  {COMPONENT_INDEX.length} components, {SECTIONS.length} sections.
                </span>
              </>
            }
            description="Every name below is a page with a live preview, the props and the command to add it."
            aside={
              <Link
                href="/docs/components"
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "shrink-0")}
              >
                browse all <span aria-hidden>→</span>
              </Link>
            }
          />
          <HomeCatalog />
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
                  v: "every ink measured against AA in all 14 theme and mode pairs, by a test",
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
                <CardNote>header · AGENTS.md</CardNote>
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
                <CardNote>/docs/components/button.md</CardNote>
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
                <CardNote>/llms-full.txt</CardNote>
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
          <Card variant="featured" className="p-12 sm:p-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <img
                src="/brand/mascot-256.png"
                width={96}
                height={96}
                alt=""
                aria-hidden="true"
                className="size-24 drop-shadow-[0_16px_40px_var(--shadow-brand)]"
              />
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
          </Card>
        </HomeSection>

        <SiteFooter />
      </main>
    </>
  );
}
