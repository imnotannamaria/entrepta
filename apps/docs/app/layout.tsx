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
        <SiteCommandPaletteProvider>
          {children}
          <ThemeSwitcher />
          <Toaster position="bottom-right" />
        </SiteCommandPaletteProvider>
      </body>
    </html>
  );
}
