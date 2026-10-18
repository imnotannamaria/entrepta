import { COMPONENT_INDEX } from "@/lib/component-index";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { THEMES } from "@/lib/theme";

export const alt = "entrepta: the design system you copy and own";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: `design system · ${COMPONENT_INDEX.length} components · ${THEMES.length} themes`,
    title: "The design system",
    emphasis: "you copy and own.",
    description:
      "Dark-first React components you copy into your repo. Near black surfaces, mono for UI, serif italic for titles.",
    command: "$ npx @entrepta/cli@latest init",
  });
}
