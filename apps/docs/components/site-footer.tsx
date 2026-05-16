import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] mt-16 sm:mt-24 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 sm:pt-16 grid grid-cols-2 sm:grid-cols-[1fr_auto_auto_auto] gap-8 sm:gap-12">
        <div className="col-span-2 sm:col-span-1">
          <Logo className="mb-4" />
          <p className="font-sans text-sm text-[var(--fg-muted)] max-w-xs leading-relaxed">
            A personal design system, posed as an IDE. Dark-first, built by Anna Maria.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
            System
          </h4>
          <ul className="flex flex-col gap-2">
            {[
              { label: "Color", href: "/docs/foundations/color" },
              { label: "Typography", href: "/docs/foundations/typography" },
              { label: "Spacing", href: "/docs/foundations/spacing" },
              { label: "Motion", href: "/docs/foundations/motion" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
            Components
          </h4>
          <ul className="flex flex-col gap-2">
            {[
              { label: "Primitives", href: "/docs/components/button" },
              { label: "Layout", href: "/docs/components/status-bar" },
              { label: "Feedback", href: "/docs/components/toast" },
              { label: "Themes", href: "/docs/themes" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
            Resources
          </h4>
          <ul className="flex flex-col gap-2">
            {[
              {
                label: "GitHub ↗",
                href: "https://github.com/imnotannamaria/entrepta",
              },
              { label: "npm ↗", href: "#" },
              { label: "Changelog", href: "#" },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 mt-10 sm:mt-12 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] text-[var(--fg-muted)]">v0.1 · 2026</span>
        <span className="font-mono text-[10px] text-[var(--fg-muted)]">built with entrepta</span>
      </div>
    </footer>
  );
}
