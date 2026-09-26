/**
 * The system's do and don't list. One source for the Rules page and the
 * AGENTS.md generator, so what people read and what agents follow cannot drift.
 */

export const RULE_TOPICS = [
  "color",
  "type",
  "cards",
  "motion",
  "a11y",
  "icons",
  "routing",
] as const;
export type RuleTopic = (typeof RULE_TOPICS)[number];

export type Rule = { topic: RuleTopic; do: string; dont: string };

export const RULES: Rule[] = [
  {
    topic: "color",
    do: "Use a CSS variable for every color",
    dont: "Hardcode a hex in a component. It stops following the theme",
  },
  {
    topic: "color",
    do: "Derive brand accents from --fg-brand with color-mix()",
    dont: "Hardcode the violet. It stops reacting when someone picks another theme",
  },
  {
    topic: "color",
    do: "Put --fg-on-brand on a brand fill",
    dont: "Reach for a fixed near-white. It fails contrast in 7 of the 12 theme and mode pairs",
  },
  {
    topic: "color",
    do: "Color brand text below 24px with --fg-brand-text",
    dont: "Use --fg-brand for small text. It fails AA in 4 of the 12 pairs",
  },
  {
    topic: "color",
    do: "Put cards on --bg-card, menus on --bg-surface, dialogs on --bg-overlay",
    dont: "Fill a grid of cards with --bg-surface. It reads as a field of gray",
  },
  {
    topic: "type",
    do: "Size text with the ten scale steps, such as text-mono-sm",
    // escaped so the scale test, which reads this file, does not flag the examples
    dont: "Write text-[13px\u005d or Tailwind's text-\u0073m. A test fails on both",
  },
  {
    topic: "type",
    do: "Pick the family at the call site: font-serif, font-sans or font-mono",
    dont: "Expect a scale step to set the font. It sets size and leading only",
  },
  {
    topic: "cards",
    do: "Let a row of two halves wrap, and keep each half on one line",
    dont: "Assume it fits. A card clips with no ellipsis, so overflow looks like missing data",
  },
  {
    topic: "motion",
    do: "Trigger entrances with whileInView and once, everywhere",
    dont: "Use animate above the fold. One trigger leaves no judgement call to get wrong",
  },
  {
    topic: "motion",
    do: "Ask useReducedMotion() in anything animated through JS",
    dont: "Assume the CSS reset caught it. Motion never goes through that block",
  },
  {
    topic: "motion",
    do: "Keep the real text in the DOM and animate a hidden copy",
    dont: "Grow a string in state. Crawlers and screen readers get an empty heading",
  },
  {
    topic: "motion",
    do: "Move glows and shines with transform",
    dont: "Rebuild a gradient every frame. It repaints the card and stalls other animations",
  },
  {
    topic: "a11y",
    do: "Hide glyphs such as ◆, $ and // with aria-hidden",
    dont: "Let a screen reader say black diamond suit before every label",
  },
  {
    topic: "a11y",
    do: "Give bare buttons the .focus-ring class",
    dont: "Rely on outline. The reset removes it from every button",
  },
  {
    topic: "icons",
    do: "Import Phosphor from @phosphor-icons/react/dist/ssr in files without use client",
    dont: "Import the package root there. next build fails with an error that names no file",
  },
  {
    topic: "routing",
    do: "Pass your router's link with asChild or linkComponent, and mark the current item with active",
    dont: "Import next/link in a copied component. It stops working outside Next.js",
  },
];
