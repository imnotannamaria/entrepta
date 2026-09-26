import { COMPONENT_INDEX } from "@/lib/component-index";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { THEMES } from "@/lib/theme";

export const alt = "entrepta: a design system posed as an IDE";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: `design system · ${COMPONENT_INDEX.length} components · ${THEMES.length} themes`,
    title: "A design system,",
    emphasis: "posed as an IDE.",
    description:
      "Dark-first React components you copy into your repo. Tabs, a command palette, a status bar, serif italic next to mono.",
    command: "$ npx @entrepta/cli@latest init",
  });
}
