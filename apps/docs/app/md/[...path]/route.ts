import { MD_PAGES, findMdPage } from "@/lib/markdown";

/** The Markdown twin of a docs page. `/docs/cli.md` is rewritten here in next.config.ts. */

export const dynamic = "force-static";

export function generateStaticParams() {
  return MD_PAGES.map((p) => ({ path: p.path.slice(1).split("/") }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const page = findMdPage(`/${path.join("/")}`);
  if (!page) return new Response("Not found\n", { status: 404 });
  return new Response(`${page.render()}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
