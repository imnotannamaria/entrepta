import { COMPONENT_INDEX, type SECTIONS } from "@/lib/component-index";
import { THEMES } from "@/lib/theme";
import { BentoGrid, BentoItem } from "@entrepta/registry/layout/bento-grid";
import { Card } from "@entrepta/registry/primitives/card";
import { IconTile } from "@entrepta/registry/primitives/icon-tile";
import {
  BellSimpleIcon,
  ChatCircleIcon,
  CubeIcon,
  FileCodeIcon,
  LayoutIcon,
  PaletteIcon,
  SparkleIcon,
  TableIcon,
  TextboxIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

type Section = (typeof SECTIONS)[number];

/** What each section is for, its icon, and its place on the grid. */
const SECTION_INFO: Record<
  Section,
  { icon: ReactElement; blurb: string; span: { sm: 3 | 6; lg: 3 | 6 }; rows?: 2 }
> = {
  Forms: {
    icon: <TextboxIcon />,
    blurb: "Fields wired for screen readers, money, dates and every way to choose.",
    span: { sm: 6, lg: 6 },
    rows: 2,
  },
  Primitives: {
    icon: <CubeIcon />,
    blurb: "The building blocks: buttons, cards, overlays, tabs and steps.",
    span: { sm: 6, lg: 6 },
    rows: 2,
  },
  Data: {
    icon: <TableIcon />,
    blurb: "Money in minor units, charts on Recharts, tables that scale past a thousand rows.",
    span: { sm: 6, lg: 6 },
  },
  Layout: {
    icon: <LayoutIcon />,
    blurb: "Navigation for every width, and a bento grid.",
    span: { sm: 3, lg: 3 },
  },
  Feedback: {
    icon: <BellSimpleIcon />,
    blurb: "Alerts, toasts, skeletons and the empty state.",
    span: { sm: 3, lg: 3 },
  },
  Motion: {
    icon: <SparkleIcon />,
    blurb: "Entrances and counters, with a reduced-motion path.",
    span: { sm: 3, lg: 3 },
  },
  Chat: {
    icon: <ChatCircleIcon />,
    blurb: "A thread and a prompt. Bring your own model.",
    span: { sm: 3, lg: 3 },
  },
  Content: {
    icon: <FileCodeIcon />,
    blurb: "Code with a filename, a copy button and an honest failure.",
    span: { sm: 3, lg: 3 },
  },
};

const ORDER: Section[] = [
  "Forms",
  "Primitives",
  "Data",
  "Layout",
  "Feedback",
  "Motion",
  "Chat",
  "Content",
];

/** A component name that is a link to its page, as a small pill. */
function Chip({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="focus-ring inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-field)] px-2.5 py-1 font-mono text-mono-xs text-[var(--fg-secondary)] transition-colors hover:border-[var(--border-brand)] hover:text-[var(--fg-primary)]"
      >
        {children}
      </Link>
    </li>
  );
}

/** The head of a catalog card: the tile, the count, the name and what it is for. */
function Head({
  icon,
  count,
  title,
  blurb,
}: {
  icon: ReactElement;
  count: number | string;
  title: string;
  blurb: string;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <IconTile icon={icon} color="brand" size="lg" />
        <span className="font-serif text-display-md leading-none text-[var(--fg-primary)] tabular-nums">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="m-0 font-serif text-heading-lg font-normal text-[var(--fg-primary)]">
          {title}
        </h3>
        <p className="m-0 font-sans text-body-md text-[var(--fg-secondary)]">{blurb}</p>
      </div>
    </>
  );
}

/**
 * The catalog by section, on the bento grid: the big sections take half the
 * width, the small ones a quarter, and every component name links to its page.
 */
export function HomeCatalog() {
  return (
    <BentoGrid>
      {ORDER.map((section) => {
        const info = SECTION_INFO[section];
        const items = COMPONENT_INDEX.filter((c) => c.section === section);
        return (
          <BentoItem
            key={section}
            colSpan={info.span}
            rowSpan={info.rows ? { lg: info.rows } : undefined}
          >
            <Card className="h-full">
              <Head icon={info.icon} count={items.length} title={section} blurb={info.blurb} />
              <ul className="m-0 mt-auto flex list-none flex-wrap gap-1.5 p-0">
                {items.map((c) => (
                  <Chip key={c.slug} href={`/docs/components/${c.slug}`}>
                    {c.title}
                  </Chip>
                ))}
              </ul>
            </Card>
          </BentoItem>
        );
      })}
      <BentoItem colSpan={{ sm: 3, lg: 3 }}>
        <Card className="h-full">
          <Head
            icon={<PaletteIcon />}
            count={THEMES.length}
            title="Themes"
            blurb="One brand per theme, in dark and light. Fixed, or all at runtime."
          />
          <ul className="m-0 mt-auto flex list-none flex-wrap gap-1.5 p-0">
            {THEMES.map((t) => (
              <li key={t.id}>
                <Link
                  href="/docs/themes"
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-field)] py-1 pr-2.5 pl-1.5 font-mono text-mono-xs text-[var(--fg-secondary)] transition-colors hover:border-[var(--border-brand)] hover:text-[var(--fg-primary)]"
                >
                  <span
                    aria-hidden
                    className="size-3 rounded-full ring-1 ring-[var(--border-strong)]"
                    style={{ background: t.color }}
                  />
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </BentoItem>
    </BentoGrid>
  );
}
