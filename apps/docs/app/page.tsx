import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SiteStatusBar } from "@/components/site-status-bar";
import Link from "next/link";

const PRINCIPLES = [
  {
    num: "01",
    title: "Dark-first, always.",
    desc: "Both products are born dark. Light mode is optional, never priority. The deep zinc-950 is the canvas — not dashboard gray.",
    tag: "canvas: #09090B",
  },
  {
    num: "02",
    title: "Editor as metaphor.",
    desc: "Tabs, command palette, status bar, file paths, inline comments, shell prompts, monospace metadata. Not decoration — personality.",
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
    count: "52 tokens",
    href: "/docs/foundations/color",
    preview: (
      <div className="flex gap-1.5 mt-3">
        {["#09090B", "#7C6BFF", "#10B981", "#F59E0B", "#F43F5E"].map((c) => (
          <span
            key={c}
            className="w-9 h-9 rounded-lg border border-[var(--border-subtle)]"
            style={{ background: c }}
          />
        ))}
      </div>
    ),
  },
  {
    label: "primitives",
    num: "05",
    name: "Primitives",
    desc: "Buttons, badges, inputs, cards. The atoms used everywhere.",
    count: "8 components",
    href: "/docs/components/button",
    preview: (
      <div className="flex gap-1.5 flex-wrap mt-3">
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--fg-brand)] text-white">
          FEATURED
        </span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--status-success)]/15 text-[var(--status-success)] border border-[var(--status-success)]/30">
          shipped
        </span>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-[var(--border-strong)] text-[var(--fg-muted)]">
          v0.1.0
        </span>
      </div>
    ),
  },
  {
    label: "layout",
    num: "06",
    name: "Layout",
    desc: "Tab bar, status bar, top nav, section header. The IDE chrome.",
    count: "4 components",
    href: "/docs/components/tab-bar",
    preview: (
      <div className="mt-3 flex bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-lg overflow-hidden font-mono text-[11px]">
        <span className="px-2.5 py-1.5 text-[var(--fg-primary)] bg-[var(--bg-surface)] border-r border-[var(--border-subtle)]">
          <span className="text-[var(--fg-brand)]">◆</span> home.tsx
        </span>
        <span className="px-2.5 py-1.5 text-[var(--fg-muted)] border-r border-[var(--border-subtle)]">
          about.md
        </span>
        <span className="px-2.5 py-1.5 text-[var(--fg-muted)]">stack.ts</span>
      </div>
    ),
  },
  {
    label: "feedback",
    num: "07",
    name: "Feedback",
    desc: "Toasts, command palette, skeleton. Interaction signals.",
    count: "3 components",
    href: "/docs/components/toast",
    preview: (
      <div className="mt-3 px-3 py-2 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] border-l-2 border-l-[var(--status-success)] rounded-md font-mono text-[11px]">
        <span className="text-[var(--fg-primary)]">synced</span>{" "}
        <span className="text-[var(--fg-muted)]">· 7 days written</span>
      </div>
    ),
  },
  {
    label: "themes",
    num: "08",
    name: "Themes",
    desc: "6 presets — one command to switch. Same tokens, different personality.",
    count: "6 presets",
    href: "/docs/themes",
    preview: (
      <div className="mt-3 flex gap-2">
        {["#7C6BFF", "#A1A1AA", "#10B981", "#F59E0B", "#F43F5E", "#64748B"].map((c) => (
          <span
            key={c}
            className="w-6 h-6 rounded-full border border-[var(--border-subtle)]"
            style={{ background: c }}
          />
        ))}
      </div>
    ),
  },
  {
    label: "cli",
    num: "09",
    name: "CLI",
    desc: "npx entrepta init · add · diff. Copy-paste without the clipboard.",
    count: "3 commands",
    href: "/docs/cli",
    preview: (
      <div className="mt-3 px-3 py-2 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-md font-mono text-[11px] text-[var(--fg-muted)]">
        <span className="text-[var(--status-success)]">$</span> npx entrepta add button
      </div>
    ),
  },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main className="pt-14 pb-10 sm:pb-16">
        {/* ── HERO ── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-20 sm:pt-28 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-start">
          <div>
            <div className="font-mono text-[11px] text-[var(--fg-muted)] mb-6 flex items-center gap-3">
              <span>design system</span>
              <span className="border border-[var(--border-subtle)] rounded px-1.5 py-0.5 text-[var(--fg-brand)]">
                v0.1 · draft
              </span>
              <span>by anna maria</span>
            </div>

            <h1 className="font-serif text-[clamp(40px,6vw,80px)] leading-[1.02] font-normal tracking-[-0.02em] text-[var(--fg-primary)] mb-8">
              A personal <em className="italic text-[var(--fg-brand)]">design system</em>,<br />
              posed as an <span className="text-[var(--fg-muted)]">IDE.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-[var(--fg-secondary)] leading-relaxed max-w-xl mb-10">
              <strong className="text-[var(--fg-primary)] font-medium">entrepta</strong> is the
              visual and interaction language behind two web products —{" "}
              <strong className="text-[var(--fg-primary)] font-medium">portfolio</strong> and{" "}
              <strong className="text-[var(--fg-primary)] font-medium">wristkit</strong>. Shared
              foundations, 6 themes, dark-first. Built around editor metaphors: tabs, command
              palette, status bar, file paths.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link
                href="/docs/components"
                className="flex items-center gap-2 h-10 px-5 bg-[var(--fg-brand)] text-white font-mono text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
              >
                browse components <span>→</span>
              </Link>
              <Link
                href="#install"
                className="flex items-center gap-2 h-10 px-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--fg-secondary)] font-mono text-sm rounded-[var(--radius-sm)] hover:border-[var(--border-strong)] hover:text-[var(--fg-primary)] transition-colors"
              >
                $ install
              </Link>
            </div>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { dt: "tokens", dd: "52" },
                { dt: "components", dd: "17" },
                { dt: "themes", dd: "6" },
                { dt: "updated", dd: "2026-05" },
              ].map((s) => (
                <div
                  key={s.dt}
                  className="border border-[var(--border-subtle)] rounded-[var(--radius-sm)] p-3"
                >
                  <dt className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-1">
                    {s.dt}
                  </dt>
                  <dd className="font-mono text-sm text-[var(--fg-primary)]">{s.dd}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Editor preview */}
          <aside
            className="hidden lg:flex flex-col rounded-[var(--radius-lg)] border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-canvas)]"
            aria-hidden="true"
          >
            <div className="flex items-center border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              {["tokens.css", "card.tsx", "theme.ts"].map((tab, i) => (
                <span
                  key={tab}
                  className={`px-4 py-2.5 font-mono text-xs border-b-2 ${
                    i === 0
                      ? "text-[var(--fg-primary)] border-[var(--fg-brand)] bg-[var(--bg-canvas)]"
                      : "text-[var(--fg-muted)] border-transparent"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="flex flex-1">
              <div className="flex flex-col items-end pr-4 pt-4 font-mono text-[11px] text-[var(--border-strong)] select-none">
                {Array.from({ length: 8 }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static line numbers, never reordered
                  <span key={i} className="leading-6">
                    {i + 1}
                  </span>
                ))}
              </div>
              <pre className="flex-1 pt-4 pb-4 pr-4 font-mono text-[12px] leading-6 overflow-x-auto">
                <span className="text-[var(--fg-muted)]">{"/* entrepta · semantic tokens */"}</span>
                {"\n"}
                <span className="text-[var(--status-info)]">{":root"}</span>
                <span className="text-[var(--fg-secondary)]">{" {"}</span>
                {"\n"}
                {"  "}
                <span className="text-[var(--fg-brand)]">{"--fg-brand"}</span>
                <span className="text-[var(--fg-secondary)]">{": "}</span>
                <span className="text-[var(--status-success)]">{"#7C6BFF"}</span>
                <span className="text-[var(--fg-secondary)]">{";"}</span>
                {"\n"}
                {"  "}
                <span className="text-[var(--fg-brand)]">{"--bg-canvas"}</span>
                <span className="text-[var(--fg-secondary)]">{": "}</span>
                <span className="text-[var(--status-success)]">{"#09090B"}</span>
                <span className="text-[var(--fg-secondary)]">{";"}</span>
                {"\n"}
                {"  "}
                <span className="text-[var(--fg-brand)]">{"--bg-surface"}</span>
                <span className="text-[var(--fg-secondary)]">{": "}</span>
                <span className="text-[var(--status-success)]">{"#18181B"}</span>
                <span className="text-[var(--fg-secondary)]">{";"}</span>
                {"\n"}
                <span className="text-[var(--fg-secondary)]">{"}"}</span>
                {"\n"}
                <span className="text-[var(--fg-muted)]">{"// theme: emerald"}</span>
                {"\n"}
                <span className="text-[var(--status-info)]">{"[data-theme"}</span>
                <span className="text-[var(--fg-secondary)]">{"="}</span>
                <span className="text-[var(--status-warning)]">{'"emerald"'}</span>
                <span className="text-[var(--status-info)]">{"]"}</span>
                <span className="text-[var(--fg-secondary)]">{" {"}</span>
                {"\n"}
                {"  "}
                <span className="text-[var(--fg-brand)]">{"--fg-brand"}</span>
                <span className="text-[var(--fg-secondary)]">{": "}</span>
                <span className="text-[var(--status-success)]">{"#10B981"}</span>
                <span className="text-[var(--fg-secondary)]">{";"}</span>
                {"\n"}
                <span className="text-[var(--fg-secondary)]">{"}"}</span>
              </pre>
            </div>
            <div className="h-6 px-3 flex items-center justify-between bg-[var(--fg-brand)] font-mono text-[10px] text-white">
              <span>TypeScript · UTF-8 · Ln 4, Col 18</span>
              <span>anna@recife</span>
            </div>
          </aside>
        </section>

        {/* ── INSTALL ── */}
        <section
          id="install"
          className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]"
        >
          <div className="mb-10">
            <div className="font-mono text-[11px] text-[var(--fg-brand)] uppercase tracking-widest mb-3">
              — getting started
            </div>
            <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
              <em className="italic">Three</em> commands.
              <br />
              <span className="text-[var(--fg-muted)]">You own the code.</span>
            </h2>
            <p className="mt-4 font-sans text-base text-[var(--fg-secondary)] max-w-lg leading-relaxed">
              entrepta ships as CSS tokens + copy-paste components. No SDK. No analytics. Drop it
              into any Next.js or Vite project and start shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            {/* Terminal */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-canvas)]">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
                  terminal · zsh
                </span>
                <span className="font-mono text-[10px] text-[var(--fg-muted)]">
                  ~/projects/portfolio
                </span>
              </div>
              <div className="p-6 flex flex-col gap-4 font-mono text-sm">
                {[
                  {
                    num: "01",
                    cmd: "npx entrepta init --theme=entrepta",
                    out: "wrote app/globals.css · created entrepta.json",
                  },
                  {
                    num: "02",
                    cmd: "npx entrepta add button badge input",
                    out: "3 components copied to components/entrepta/",
                  },
                  {
                    num: "03",
                    cmd: "npm run dev",
                    out: null,
                  },
                ].map((step) => (
                  <div key={step.num} className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--fg-muted)] text-[10px] w-5 shrink-0">
                        {step.num}
                      </span>
                      <span className="text-[var(--fg-secondary)]">
                        <span className="text-[var(--fg-brand)]">$</span> {step.cmd}
                      </span>
                    </div>
                    {step.out && (
                      <div className="pl-8 text-[11px] text-[var(--fg-muted)]">→ {step.out}</div>
                    )}
                  </div>
                ))}
                <div className="pl-8 flex items-center gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] inline-block" />
                  <span className="text-[var(--status-success)]">ready</span>
                  <span className="text-[var(--fg-muted)]">· run npm run dev</span>
                </div>
              </div>
            </div>

            {/* Package card */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-6 flex flex-col gap-4 bg-[var(--bg-surface)]">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl text-[var(--fg-primary)]">@entrepta/cli</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--fg-brand)]/15 text-[var(--fg-brand)] border border-[var(--fg-brand)]/30">
                  v0.1.0
                </span>
              </div>
              {[
                { k: "size", v: "14 kb gzipped" },
                { k: "deps", v: "zero peer deps" },
                { k: "ships", v: "css vars · components" },
                { k: "license", v: "MIT" },
                { k: "themes", v: "6 presets" },
              ].map((r) => (
                <div
                  key={r.k}
                  className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3"
                >
                  <span className="font-mono text-[11px] text-[var(--fg-muted)]">{r.k}</span>
                  <span className="font-mono text-[11px] text-[var(--fg-secondary)]">{r.v}</span>
                </div>
              ))}
              <Link
                href="/docs"
                className="mt-auto pt-4 border-t border-[var(--border-subtle)] font-mono text-xs text-[var(--fg-brand)] hover:opacity-80 transition-opacity text-right"
              >
                read the docs →
              </Link>
            </div>
          </div>
        </section>

        {/* ── PRINCIPLES ── */}
        <section
          id="principles"
          className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]"
        >
          <div className="flex items-start justify-between mb-12">
            <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
              <em className="italic">Six</em> principles.
              <br />
              One product personality.
            </h2>
            <span className="font-mono text-[10px] text-[var(--fg-muted)] hidden sm:block mt-2">
              section 1.2 · brief
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-subtle)]">
            {PRINCIPLES.map((p) => (
              <div
                key={p.num}
                className="bg-[var(--bg-canvas)] p-6 hover:bg-[var(--bg-surface)] transition-colors"
              >
                <div className="font-mono text-[10px] text-[var(--fg-brand)] mb-4">{p.num}</div>
                <h3 className="font-sans text-sm font-semibold text-[var(--fg-primary)] mb-2">
                  {p.title}
                </h3>
                <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed mb-4">
                  {p.desc}
                </p>
                <div className="font-mono text-[10px] text-[var(--fg-muted)] border border-[var(--border-subtle)] rounded px-2 py-1 inline-block">
                  {p.tag}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPONENTS PREVIEW ── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-normal leading-tight tracking-tight text-[var(--fg-primary)]">
              <em className="italic">What's</em> inside.{" "}
              <span className="text-[var(--fg-muted)]">Six categories.</span>
            </h2>
            <Link
              href="/docs/components"
              className="hidden sm:inline-block font-mono text-xs text-[var(--fg-brand)] hover:opacity-80 transition-opacity"
            >
              browse all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPONENT_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group flex flex-col p-5 border border-[var(--border-subtle)] rounded-[var(--radius-md)] bg-[var(--bg-canvas)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
                    {cat.label}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--fg-muted)]">{cat.num}</span>
                </div>
                <h3 className="font-sans text-sm font-semibold text-[var(--fg-primary)] mb-1.5">
                  {cat.name}
                </h3>
                <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed">
                  {cat.desc}
                </p>
                {cat.preview}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--fg-muted)]">{cat.count}</span>
                  <span className="font-mono text-[10px] text-[var(--fg-brand)] group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA STRIP ── */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-12 py-20 border-t border-[var(--border-subtle)]">
          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-12 sm:p-16 text-center bg-[radial-gradient(ellipse_at_top_right,rgba(124,107,255,0.08),transparent_60%)]">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-brand)] mb-4">
              — ready to ship
            </div>
            <h2 className="font-serif text-[clamp(36px,5vw,72px)] font-normal leading-none tracking-tight text-[var(--fg-primary)] mb-6">
              Start building.
            </h2>
            <p className="font-sans text-base text-[var(--fg-secondary)] max-w-md mx-auto mb-8 leading-relaxed">
              Every token, every component, every state — laid out in the docs. Press{" "}
              <kbd className="font-mono text-xs border border-[var(--border-strong)] rounded px-1.5 py-0.5 text-[var(--fg-muted)]">
                ⌘K
              </kbd>{" "}
              to jump anywhere.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/docs/components"
                className="flex items-center gap-2 h-11 px-6 bg-[var(--fg-brand)] text-white font-mono text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
              >
                browse components →
              </Link>
              <Link
                href="/docs/themes"
                className="flex items-center gap-2 h-11 px-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--fg-secondary)] font-mono text-sm rounded-[var(--radius-sm)] hover:border-[var(--border-strong)] hover:text-[var(--fg-primary)] transition-colors"
              >
                see themes
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>

      <SiteStatusBar />
    </>
  );
}
