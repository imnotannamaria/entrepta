"use client";

import Link from "next/link";
import { Logo } from "./logo";

export function SiteNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/90 backdrop-blur-md">
      <Link href="/" className="flex items-center">
        <Logo showTag />
      </Link>
      <nav className="hidden sm:flex items-center gap-6">
        <Link
          href="/#install"
          className="font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors"
        >
          Install
        </Link>
        <Link
          href="/#principles"
          className="font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors"
        >
          Principles
        </Link>
        <Link
          href="/docs/components"
          className="font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors"
        >
          Components
        </Link>
        <Link
          href="/docs/themes"
          className="font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors"
        >
          Themes
        </Link>
        <a
          href="https://github.com/imnotannamaria/entrepta"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] transition-colors"
        >
          GitHub ↗
        </a>
      </nav>
    </header>
  );
}
