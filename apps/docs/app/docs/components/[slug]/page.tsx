import fs from "node:fs/promises";
import path from "node:path";
import { ComponentInstall } from "@/components/component-install";
import { DocPageHeader, DocSubhead } from "@/components/doc-page-header";
import { findEntry } from "@/lib/component-index";
import { COMPONENT_DOCS } from "@/lib/components";
import { depsFor, filesFor } from "@/lib/manifest";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentPreview } from "./component-preview";

const REGISTRY_ROOT = path.resolve(process.cwd(), "..", "..", "packages", "registry");

async function readSourceFile(relPath: string): Promise<string> {
  const resolved = path.resolve(REGISTRY_ROOT, relPath);
  const relative = path.relative(REGISTRY_ROOT, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to read outside the registry root: ${relPath}`);
  }
  // Defense in depth: resolve symlinks before reading so a symlinked file
  // inside the registry can't trick the path check into reading something
  // outside it. Build-time only, but cheap to be paranoid.
  const real = await fs.realpath(resolved);
  const realRoot = await fs.realpath(REGISTRY_ROOT);
  const realRel = path.relative(realRoot, real);
  if (realRel.startsWith("..") || path.isAbsolute(realRel)) {
    throw new Error(`Refusing to read symlinked path outside the registry root: ${relPath}`);
  }
  const raw = await fs.readFile(real, "utf-8");
  return rewriteImportsForConsumer(raw);
}

/**
 * Rewrite registry-internal import paths to the aliases users see in their
 * own project, so Manual-tab copy-paste works without manual edits. Mirrors
 * the rewrite the CLI does in `packages/cli/src/commands/add.ts`.
 */
function rewriteImportsForConsumer(source: string): string {
  return source
    .replace(
      /from\s+(['"])\.\.\/lib\/([A-Za-z0-9_-]+)\1/g,
      (_, quote: string, name: string) => `from ${quote}@/lib/${name}${quote}`
    )
    .replace(
      /from\s+(['"])\.\.\/hooks\/([A-Za-z0-9_-]+)\1/g,
      (_, quote: string, name: string) => `from ${quote}@/hooks/${name}${quote}`
    )
    .replace(
      /from\s+(['"])\.\.\/(?:primitives|layout|content|feedback|motion)\/([A-Za-z0-9_-]+)\1/g,
      (_, quote: string, name: string) => `from ${quote}./${name}${quote}`
    );
}

async function getComponentSources(
  slug: string
): Promise<{ filename: string; source: string; language?: string }[]> {
  return Promise.all(
    filesFor(slug).map(async (relPath) => {
      const source = await readSourceFile(relPath);
      const basename = path.basename(relPath);
      const folder = relPath.split("/")[0];
      const dest =
        folder === "hooks" || folder === "lib"
          ? `${folder}/${basename}`
          : `components/entrepta/${basename}`;
      const language = basename.endsWith(".ts") ? "ts" : "tsx";
      return { filename: dest, source, language };
    })
  );
}

async function getUtilsSourceIfNeeded(sources: { source: string }[]): Promise<string | null> {
  const usesCn = sources.some(
    (f) => f.source.includes('from "@/lib/utils"') || f.source.includes("from '@/lib/utils'")
  );
  if (!usesCn) return null;
  return readSourceFile("lib/utils.ts");
}

export function generateStaticParams() {
  return Object.keys(COMPONENT_DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findEntry(slug);
  const doc = COMPONENT_DOCS[slug];
  if (!entry || !doc) return {};
  const component = { ...entry, ...doc };
  const canonical = `/docs/components/${slug}`;
  return {
    title: component.title,
    description: component.description,
    alternates: { canonical, types: { "text/markdown": `${canonical}.md` } },
    openGraph: {
      title: `${component.title} · entrepta`,
      description: component.description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${component.title} · entrepta`,
      description: component.description,
    },
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findEntry(slug);
  const doc = COMPONENT_DOCS[slug];
  if (!entry || !doc) notFound();
  const component = { ...entry, ...doc };

  const sources = await getComponentSources(slug);
  const utilsSource = await getUtilsSourceIfNeeded(sources);

  return (
    <article className="max-w-3xl">
      <DocPageHeader
        eyebrow={component.section}
        title={component.title}
        description={component.description}
        markdown={`/docs/components/${slug}`}
      />

      <section className="mb-10">
        <DocSubhead>Preview</DocSubhead>
        <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] bg-[var(--bg-canvas)] min-h-40 flex items-center justify-center p-8">
          <ComponentPreview slug={slug} />
        </div>
      </section>

      <section className="mb-10">
        <DocSubhead>Installation</DocSubhead>
        <ComponentInstall
          cliCommand={`npx @entrepta/cli@latest add ${slug}`}
          dependencies={depsFor(slug)}
          files={sources}
          utilsSource={utilsSource}
        />
      </section>

      <section className="mb-10">
        <DocSubhead>Usage</DocSubhead>
        <CodeBlock
          code={component.usage}
          variant="terminal"
          filename={`${slug}.tsx`}
          language="tsx"
        />
      </section>

      <section>
        <DocSubhead>Props</DocSubhead>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-mono-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="text-left py-2 pr-6 text-[var(--fg-muted)] font-normal uppercase tracking-widest text-mono-xs">
                  Prop
                </th>
                <th className="text-left py-2 pr-6 text-[var(--fg-muted)] font-normal uppercase tracking-widest text-mono-xs">
                  Type
                </th>
                <th className="text-left py-2 pr-6 text-[var(--fg-muted)] font-normal uppercase tracking-widest text-mono-xs">
                  Default
                </th>
                <th className="text-left py-2 text-[var(--fg-muted)] font-normal uppercase tracking-widest text-mono-xs">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {component.props.map((prop) => (
                <tr
                  key={prop.name}
                  className="border-b border-[var(--border-subtle)] last:border-0"
                >
                  <td className="py-3 pr-6 text-[var(--fg-brand-text)]">{prop.name}</td>
                  <td className="py-3 pr-6 text-[var(--fg-secondary)] max-w-[200px]">
                    <span className="break-all">{prop.type}</span>
                  </td>
                  <td className="py-3 pr-6 text-[var(--fg-muted)]">{prop.default ?? "-"}</td>
                  <td className="py-3 text-[var(--fg-secondary)] font-sans">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
