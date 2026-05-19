import { SiteCommandPaletteProvider } from "@/components/site-command-palette";
import { ThemeInitScript } from "@/components/theme-init-script";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Toaster } from "@entrepta/registry/feedback/toast";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://entrepta.vercel.app"),
  title: "entrepta · a personal design system",
  description:
    "Dark-first design system posed as an IDE. Copy-paste components, CSS tokens, CLI. Built by Anna Maria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--bg-canvas)] text-[var(--fg-primary)] antialiased">
        <ThemeInitScript />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-3 focus:py-2 focus:rounded-[var(--radius-sm)] focus:bg-[var(--bg-surface)] focus:text-[var(--fg-primary)] focus:border focus:border-[var(--fg-brand)] focus:outline-none focus:shadow-[0_0_0_3px_var(--bg-surface-brand)] focus:font-mono focus:text-xs"
        >
          Skip to main content
        </a>
        <SiteCommandPaletteProvider>
          {children}
          <ThemeSwitcher />
          <Toaster position="bottom-right" />
        </SiteCommandPaletteProvider>
      </body>
    </html>
  );
}
