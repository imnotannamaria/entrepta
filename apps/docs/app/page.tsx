import { CommandPaletteTrigger } from "@/components/command-palette-trigger";
import { HomeIdePreview } from "@/components/home-ide-preview";
import { HomeInstall } from "@/components/home-install";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SiteStatusBar } from "@/components/site-status-bar";
import { Badge } from "@entrepta/registry/primitives/badge";
import { Button } from "@entrepta/registry/primitives/button";
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
    desc: "Brand accent shows up in CTAs, focus rings and featured cards. Emerald is exclusive to positive status. The rest is black, white, cold gray.",
    tag: "violet-500 · emerald-400 · zinc-*",
  },
  {
    num: "05",
    title: "High density, clear hierarchy.",
    desc: "A lot of information without feeling chaotic. Strict 12-col grid, defined cards, small badges and dots create secondary rhythm.",
    tag: "12 cols · 24 gutters · 1280 max",
  },
  {
    num: "06",
    title: "Subtle motion, or none.",
    desc: "Fast transitions (120–200ms), no springy theatrics. Loading uses shimmer or pulse. The product is not a demo reel.",
    tag: "120ms · 200ms · 320ms",
  },
];

const COMPONENT_CATEGORIES = [
  {
    label: "foundations",
    num: "01–04",
    name: "Foundations",
    desc: "Color primitives and semantic tokens, type scale, spacing, radius, motion.",
    count: "69 tokens",
    href: "/docs/foundations/color",
    preview: (
      <div className="flex gap-1.5">
        {["#09090B", "#7C6BFF", "#10B981", "#F59E0B", "#F43F5E"].map((c) => (
          <span
            key={c}
            className="w-9 h-9 rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
            style={{ background: c }}
          />
        ))}
      </div>
    ),
  },
  {
    label: "primitives",
    num: "08",
    name: "Primitives",
    desc: "Button, Badge, Input, Card, Dialog, Dropdown, Tooltip, Tabs.",
    count: "8 components",
    href: "/docs/components/button",
    preview: (
      <div className="flex gap-1.5 flex-wrap items-center">
        <Badge variant="solid" color="brand">
          FEATURED
        </Badge>
        <Badge variant="soft" color="success" dot>
          shipped
        </Badge>
        <Badge variant="outline" color="neutral">
          v0.1.0
        </Badge>
      </div>
    ),
  },
  {
    label: "layout",
    num: "02",
    name: "Layout",
    desc: "StatusBar and TopNav. The IDE chrome that frames the canvas.",
    count: "2 components",
    href: "/docs/components/status-bar",
    preview: (
      <div className="flex bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] overflow-hidden font-mono text-[11px]">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[var(--fg-primary)] bg-[var(--bg-surface)] border-r border-[var(--border-subtle)]">
          <span className="text-[var(--fg-brand)] text-[9px] leading-none">◆</span> home.tsx
        </span>
        <span className="px-3 py-1.5 text-[var(--fg-muted)] border-r border-[var(--border-subtle)]">
          about.md
        </span>
        <span className="px-3 py-1.5 text-[var(--fg-muted)]">stack.ts</span>
      </div>
    ),
  },
  {
    label: "feedback",
    num: "03",
    name: "Feedback",
    desc: "Toast, Skeleton, CommandPalette. Interaction signals + loading states.",
    count: "3 components",
    href: "/docs/components/toast",
    preview: (
      <div className="px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-l-2 border-l-[var(--status-success)] rounded-[var(--radius-md)] font-mono text-[11px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
        <div className="text-[var(--fg-primary)] text-[12px] mb-0.5">Build passed</div>
        <div className="font-sans text-[11px] text-[var(--fg-secondary)]">
          12 components compiled in 1.4s
        </div>
      </div>
    ),
  },
  {
    label: "content",
    num: "01",
    name: "Content",
    desc: "CodeBlock. Snippets with macOS chrome, language label and a one-click copy.",
    count: "1 component",
    href: "/docs/components/code-block",
    preview: (
      <div className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden font-mono text-[11px]">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/30 border-b border-[var(--border-subtle)]">
          <span className="w-2 h-2 rounded-full bg-[var(--status-error)] opacity-60" />
          <span className="w-2 h-2 rounded-full bg-[var(--status-warning)] opacity-60" />
          <span className="w-2 h-2 rounded-full bg-[var(--status-success)] opacity-60" />
          <span className="ml-auto text-[10px] uppercase tracking-[0.08em] text-[var(--fg-brand)]">
            bash
          </span>
        </div>
        <div className="px-3 py-2 text-[var(--fg-secondary)]">
          <span className="text-[var(--fg-brand)]">$</span> npx @entrepta/cli@latest add code-block
        </div>
      </div>
    ),
  },
  {
    label: "themes",
    num: "06",
    name: "Themes",
    desc: "Six presets. One CLI flag to switch. Same tokens, different personality.",
    count: "6 presets",
    href: "/docs/themes",
    preview: (
      <div className="flex gap-2">
        {[
          { c: "#7C6BFF", n: "entrepta" },
          { c: "#CC2E36", n: "blossom" },
          { c: "#FF8213", n: "marmalade" },
          { c: "#E85A8A", n: "julia" },
          { c: "#35A365", n: "ivy" },
          { c: "#2563EB", n: "bosco" },
        ].map((t) => (
          <span
            key={t.n}
            title={t.n}
            className="w-6 h-6 rounded-full border border-[var(--border-subtle)]"
            style={{ background: t.c }}
          />
        ))}
      </div>
    ),
  },
  {
    label: "cli",
    num: "02",
    name: "CLI",
    desc: "npx @entrepta/cli@latest init · add. Copy-paste without the clipboard.",
    count: "2 commands",
    href: "/docs/cli",
    preview: (
      <div className="px-3 py-2 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] font-mono text-[11px] text-[var(--fg-secondary)]">
        <span className="text-[var(--fg-muted)]">$</span> npx{" "}
        <span className="text-[var(--fg-brand)]">@entrepta/cli@latest</span> add button
      </div>
    ),
  },
];

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
  { dt: "tokens", dd: "69" },
  { dt: "components", dd: "14" },
  { dt: "themes", dd: "6" },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main id="main-content" tabIndex={-1} className="pt-14 pb-10 sm:pb-16">
        {/* ── HERO ── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-20 sm:pt-28 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-start">
          <div>
            <div className="font-mono text-[11px] text-[var(--fg-muted)] mb-6 inline-flex items-center gap-3 uppercase tracking-[0.06em]">
              <span>design system</span>
              <span className="border border-[var(--border-subtle)] rounded-[3px] px-1.5 py-0.5 text-[var(--fg-brand)] normal-case tracking-normal">
                v1.0
              </span>
              <span>by anna maria</span>
            </div>

            <h1 className="font-serif text-[clamp(40px,6vw,80px)] leading-[1.02] font-normal tracking-[-0.02em] text-[var(--fg-primary)] mb-8">
              A personal <em className="italic text-[var(--fg-brand)]">design system</em>,<br />
              posed as an <span className="text-[var(--fg-muted)]">IDE.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-[var(--fg-secondary)] leading-relaxed max-w-xl mb-10">
              <strong className="text-[var(--fg-primary)] font-medium">entrepta</strong> is a
              dark-first component library you copy into your repo. Foundations, primitives, layout
              and feedback components. Built around editor metaphors: tabs, command palette, status
              bar, file paths, inline comments, shell prompts.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/docs/components">
                <Button size="lg">
                  browse components <span aria-hidden>→</span>
                </Button>
              </Link>
              <Link href="#install">
                <Button variant="command" size="lg">
                  npx @entrepta/cli@latest init
                </Button>
              </Link>
              <CommandPaletteTrigger />
            </div>

            <dl className="grid grid-cols-3 gap-3">
              {HERO_STATS.map((s) => (
                <div
                  key={s.dt}
                  className="border border-[var(--border-subtle)] rounded-[var(--radius-sm)] p-3"
                >
                  <dt className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-[0.08em] mb-1">
                    {s.dt}
                  </dt>
                  <dd className="font-mono text-sm text-[var(--fg-primary)]">{s.dd}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HomeIdePreview />
        </section>

        {/* ── INSTALL ── */}
        <section
          id="install"
          className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]"
        >
          <div className="mb-10">
            <div className="font-mono text-[11px] text-[var(--fg-brand)] uppercase tracking-[0.08em] mb-3">
              · getting started
            </div>
            <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
              <em className="italic text-[var(--fg-brand)]">Three</em> commands.
              <br />
              <span className="text-[var(--fg-muted)]">You own the code.</span>
            </h2>
            <p className="mt-4 font-sans text-base text-[var(--fg-secondary)] max-w-lg leading-relaxed">
              entrepta ships as CSS tokens + copy-paste components. No SDK. No analytics. Drop it
              into any Next.js project and start shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <HomeInstall steps={INSTALL_STEPS} />

            <Card>
              <CardHeader>
                <CardLabel>@entrepta/cli</CardLabel>
                <Badge variant="soft" color="brand">
                  v1.0.1
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {[
                  { k: "size", v: "~7 kb gzipped" },
                  { k: "deps", v: "react 19+" },
                  { k: "ships", v: "css vars · components" },
                  { k: "license", v: "MIT" },
                  { k: "themes", v: "6 presets" },
                ].map((r, i) => (
                  <div
                    key={r.k}
                    className={`flex items-center justify-between font-mono text-[12px] ${
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
                  className="text-[var(--fg-brand)] hover:opacity-80 transition-opacity"
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
            <span className="font-mono text-[11px] text-[var(--fg-muted)] hidden sm:inline-block mt-2 uppercase tracking-[0.08em]">
              section 1.2 · brief
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRINCIPLES.map((p) => (
              <Card key={p.num}>
                <CardHeader>
                  <CardLabel>principle {p.num}</CardLabel>
                </CardHeader>
                <CardTitle className="text-[20px]">{p.title}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
                <CardFooter>
                  <CardComment>{p.tag}</CardComment>
                </CardFooter>
              </Card>
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
              <div className="font-mono text-[11px] text-[var(--fg-brand)] uppercase tracking-[0.08em] mb-3">
                · a11y
              </div>
              <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
                <em className="italic text-[var(--fg-brand)]">Accessible</em> by
                <br />
                <span className="text-[var(--fg-muted)]">default.</span>
              </h2>
              <p className="mt-4 font-sans text-base text-[var(--fg-secondary)] max-w-md leading-relaxed">
                Built on Radix primitives so keyboard navigation, focus management, and ARIA
                semantics come for free. The docs site adds the rest: skip links, live regions, and
                motion that respects user preferences.
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
                  v: "visible 3px brand ring on every focusable surface",
                },
                {
                  k: "screen readers",
                  v: "Radix primitives + aria-label on icon-only controls",
                },
                {
                  k: "skip link",
                  v: "press Tab on any page → jump to main content",
                },
                {
                  k: "motion",
                  v: "prefers-reduced-motion disables animations globally",
                },
                {
                  k: "live regions",
                  v: "theme & toast changes announced to screen readers",
                },
                {
                  k: "contrast",
                  v: "AA targets for body copy; brand reserved for emphasis",
                },
              ].map((row) => (
                <li
                  key={row.k}
                  className="grid grid-cols-[140px_1fr] gap-4 items-baseline py-3 border-b border-[var(--border-subtle)] font-mono text-[12px]"
                >
                  <span className="text-[var(--fg-brand)] inline-flex items-center gap-1.5">
                    <span aria-hidden className="text-[10px] leading-none">
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
              <span className="text-[var(--fg-muted)]">Seven categories.</span>
            </h2>
            <Link href="/docs/components" className="hidden sm:inline-block shrink-0">
              <Button variant="ghost" size="sm">
                browse all ↗
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPONENT_CATEGORIES.map((cat) => (
              <Link key={cat.label} href={cat.href} className="group block">
                <Card className="h-full hover:border-[var(--fg-brand)]/40 transition-colors">
                  <CardHeader>
                    <CardLabel>{cat.label}</CardLabel>
                    <CardMeta>{cat.num}</CardMeta>
                  </CardHeader>
                  <CardTitle className="text-[20px]">{cat.name}</CardTitle>
                  <CardDescription>{cat.desc}</CardDescription>
                  <CardContent>{cat.preview}</CardContent>
                  <CardFooter>
                    <CardComment>{cat.count}</CardComment>
                    <span className="text-[var(--fg-brand)] transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]">
          <Card
            variant="featured"
            className="p-12 sm:p-16 text-center bg-[radial-gradient(ellipse_at_top,var(--bg-surface-brand),transparent_60%)]"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-brand)]">
                · ready to ship
              </div>
              <h2 className="font-serif text-[clamp(36px,5vw,72px)] font-normal leading-none tracking-tight text-[var(--fg-primary)]">
                Start <em className="italic text-[var(--fg-brand)]">building.</em>
              </h2>
              <p className="font-sans text-base text-[var(--fg-secondary)] max-w-md leading-relaxed">
                Every token, every component, every state. Laid out in the docs. Press{" "}
                <kbd className="font-mono text-xs border border-[var(--border-strong)] rounded-[3px] px-1.5 py-0.5 text-[var(--fg-muted)]">
                  ⌘K
                </kbd>{" "}
                to jump anywhere.
              </p>
              <div className="flex gap-3 justify-center flex-wrap mt-2">
                <Link href="/docs/components">
                  <Button size="lg">
                    browse components <span aria-hidden>→</span>
                  </Button>
                </Link>
                <Link href="/docs/themes">
                  <Button variant="secondary" size="lg">
                    see themes
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        <SiteFooter />
      </main>

      <SiteStatusBar />
    </>
  );
}
