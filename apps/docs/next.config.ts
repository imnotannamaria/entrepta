import type { NextConfig } from "next";

// CSP for the production build. Notes on each directive:
//   - script-src needs 'unsafe-inline' for the no-flash ThemeInitScript;
//     migrating that to a nonce-based strategy would let us drop it.
//   - style-src needs 'unsafe-inline' for Tailwind runtime + inline style
//     props on theme dots.
//   - We intentionally omit 'unsafe-eval' so the prod bundle can't eval.
//
// IMPORTANT: this CSP is only sent in production. Next.js dev mode uses
// eval-source-map (the JS chunks are wrapped in eval(), which CSP would
// block — every page becomes blank/inert because React never hydrates).
// Vercel deploys are always production, so the policy still ships there.
const productionCsp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const productionSecurityHeaders = [
  { key: "Content-Security-Policy", value: productionCsp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  transpilePackages: ["@entrepta/registry"],
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    if (!isProd) return [];
    return [
      {
        source: "/:path*",
        headers: productionSecurityHeaders,
      },
    ];
  },
};

export default nextConfig;
