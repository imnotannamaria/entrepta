import { SiteCommandPaletteProvider } from "@/components/site-command-palette";
import { ThemeInitScript } from "@/components/theme-init-script";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Toaster } from "@entrepta/registry/feedback/toast";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://entrepta.vercel.app";
const SITE_NAME = "entrepta";
const SITE_TAGLINE = "a personal design system, posed as an IDE";
const SITE_DESCRIPTION =
  "Dark-first React component library. Copy-paste components, CSS tokens, CLI. Built around editor metaphors: tabs, command palette, status bar, file paths.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Anna Maria", url: "https://annamaria.app" }],
  creator: "Anna Maria",
  publisher: "Anna Maria",
  keywords: [
    "design system",
    "react",
    "component library",
    "tailwind",
    "tailwind v4",
    "shadcn",
    "copy paste components",
    "dark mode",
    "css variables",
    "next.js",
    "radix ui",
    "entrepta",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    creator: "@annamariadevbr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-x-clip bg-[var(--bg-canvas)] text-[var(--fg-primary)] antialiased">
        <ThemeInitScript />
        <a href="#main-content" className="skip-link">
          skip to content
        </a>
        <SiteCommandPaletteProvider>
          {children}
          <ThemeSwitcher />
          {/* above the status bar and the floating theme switcher */}
          <Toaster
            position="bottom-right"
            offset={{ bottom: 96, right: 20 }}
            mobileOffset={{ bottom: 88, left: 16, right: 16 }}
          />
        </SiteCommandPaletteProvider>
        <Analytics />
      </body>
    </html>
  );
}
