import type { MetadataRoute } from "next";

const SITE_URL = "https://entrepta.vercel.app";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/docs", priority: 0.9, changeFrequency: "weekly" },
  { path: "/docs/installation", priority: 0.9, changeFrequency: "monthly" },
  { path: "/docs/cli", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/themes", priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/components", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/foundations", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/foundations/color", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/foundations/typography", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/foundations/spacing", priority: 0.6, changeFrequency: "monthly" },
  { path: "/docs/foundations/motion", priority: 0.6, changeFrequency: "monthly" },
];

// Keep in sync with the COMPONENTS keys in app/docs/components/[slug]/page.tsx.
// Next.js page modules cannot export anything other than the reserved names,
// so the list is duplicated here on purpose.
const COMPONENT_SLUGS = [
  "button",
  "badge",
  "input",
  "card",
  "dialog",
  "dropdown",
  "tooltip",
  "tabs",
  "status-bar",
  "top-nav",
  "toast",
  "skeleton",
  "command-palette",
  "code-block",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const componentEntries = COMPONENT_SLUGS.map((slug) => ({
    url: `${SITE_URL}/docs/components/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...componentEntries];
}
