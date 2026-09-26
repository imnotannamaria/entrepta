import { COMPONENT_INDEX, findEntry } from "@/lib/component-index";
import { findComponent } from "@/lib/manifest";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "An entrepta component";

export function generateStaticParams() {
  return COMPONENT_INDEX.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = findEntry(slug);
  const description = findComponent(slug)?.description ?? "";
  return ogImage({
    eyebrow: `components · ${entry?.section.toLowerCase() ?? ""}`,
    title: entry?.title ?? slug,
    description: description ? `${description}.` : "",
    command: `$ npx @entrepta/cli@latest add ${slug}`,
  });
}
