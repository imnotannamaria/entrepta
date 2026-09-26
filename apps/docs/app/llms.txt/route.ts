import { llmsTxt } from "@/lib/markdown";

/** The llms.txt index (llmstxt.org): every docs page, as Markdown links. */

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
