"use client";

import * as React from "react";
import { cn } from "../lib/utils";

type LinkComponent = React.ElementType<{
  href: string;
  className?: string;
  children?: React.ReactNode;
}>;

interface ListRowProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "title" | "onClick"> {
  /** An IconTile or an Avatar. */
  leading?: React.ReactNode;
  /** One line. It truncates, and then shows the whole text on hover. */
  title: React.ReactNode;
  /** A second line in the muted ink: an account, a date, "3 of 12". */
  meta?: React.ReactNode;
  /** Usually an Amount. It never truncates. */
  trailing?: React.ReactNode;
  /** A line under the trailing value, such as a status. */
  trailingMeta?: React.ReactNode;
  /** A Dropdown of actions, outside the row's link so neither sits inside the other. */
  actions?: React.ReactNode;
  /** Makes the whole row a link, through its title. */
  href?: string;
  /** Your router's link, such as next/link. Plain `a` by default. */
  linkComponent?: LinkComponent;
  /** Makes the whole row a button, through its title. */
  onClick?: () => void;
  /** Picked for a bulk action. */
  selected?: boolean;
  /** Not settled yet, such as a pending entry: the text steps back. */
  muted?: boolean;
}

/** The title's full text on hover, only when it did not fit. */
function useTruncatedTitle<T extends HTMLElement>(text: string | undefined) {
  const ref = React.useRef<T>(null);
  const [cut, setCut] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (!element || !text || typeof ResizeObserver === "undefined") return;
    const measure = () => setCut(element.scrollWidth > element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);
  return { ref, title: cut ? text : undefined };
}

/**
 * The standard row of a list: an entry, a subscription, an account, a
 * notification, a person. The base of a phone layout, where a table does not
 * fit. Rows are set apart by space and hover, not a border each. Put them in a
 * ListGroup, or in a `ul` of your own.
 */
const ListRow = React.forwardRef<HTMLLIElement, ListRowProps>(
  (
    {
      leading,
      title,
      meta,
      trailing,
      trailingMeta,
      actions,
      href,
      linkComponent,
      onClick,
      selected = false,
      muted = false,
      className,
      ...props
    },
    ref
  ) => {
    const text = typeof title === "string" ? title : undefined;
    const truncated = useTruncatedTitle<HTMLSpanElement>(text);
    const interactive = Boolean(href || onClick);
    // the title stretches over the row, so a click anywhere lands on it
    const stretch = cn(
      "outline-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
      "focus-visible:after:shadow-[0_0_0_2px_var(--fg-brand)]"
    );
    const Link = linkComponent ?? "a";
    const titleText = (
      <span ref={truncated.ref} title={truncated.title} className="block truncate">
        {title}
      </span>
    );

    return (
      <li
        ref={ref}
        data-selected={selected || undefined}
        data-muted={muted || undefined}
        className={cn(
          "relative flex min-w-0 items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5",
          "transition-colors duration-[var(--motion-fast)]",
          interactive && "hover:bg-[var(--bg-hover-soft)]",
          selected && "bg-[var(--bg-surface-brand)] hover:bg-[var(--bg-surface-brand)]",
          className
        )}
        {...props}
      >
        {leading ? <span className="flex shrink-0">{leading}</span> : null}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span
            className={cn(
              "min-w-0 font-mono text-mono-md",
              muted ? "text-[var(--fg-secondary)]" : "text-[var(--fg-primary)]"
            )}
          >
            {href ? (
              <Link href={href} className={stretch}>
                {titleText}
              </Link>
            ) : onClick ? (
              <button type="button" onClick={onClick} className={cn(stretch, "w-full text-left")}>
                {titleText}
              </button>
            ) : (
              titleText
            )}
          </span>
          {meta ? (
            <span className="min-w-0 truncate font-mono text-mono-sm text-[var(--fg-muted)]">
              {meta}
            </span>
          ) : null}
        </span>
        {trailing || trailingMeta ? (
          <span
            className={cn(
              "flex shrink-0 flex-col items-end gap-0.5 text-right font-mono text-mono-md",
              muted && "text-[var(--fg-secondary)]"
            )}
          >
            {trailing}
            {trailingMeta ? (
              <span className="text-mono-sm text-[var(--fg-muted)]">{trailingMeta}</span>
            ) : null}
          </span>
        ) : null}
        {actions ? <span className="relative z-[1] flex shrink-0">{actions}</span> : null}
      </li>
    );
  }
);
ListRow.displayName = "ListRow";

interface ListGroupProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The group's heading, such as a day: "Yesterday", "Fri, Sep 25". */
  label: React.ReactNode;
  /** The group's total, on the right of the heading. */
  total?: React.ReactNode;
  /** How far from the top the heading sticks, such as under a top bar. */
  stickyTop?: number | string;
  headingLevel?: 2 | 3 | 4;
}

/**
 * A heading that sticks while its rows scroll by, then the rows. The heading
 * sits on --cutout, the canvas by default: set it on a Card to match.
 */
const ListGroup = React.forwardRef<HTMLElement, ListGroupProps>(
  ({ label, total, stickyTop = 0, headingLevel = 3, className, children, ...props }, ref) => {
    const id = React.useId();
    const Heading = `h${headingLevel}` as const;
    return (
      <section ref={ref} aria-labelledby={id} className={cn("flex flex-col", className)} {...props}>
        <div
          className={cn(
            "sticky z-[2] flex items-center justify-between gap-3 px-3 py-2",
            "bg-[var(--cutout,var(--bg-canvas))]"
          )}
          style={{ top: stickyTop }}
        >
          <Heading
            id={id}
            className="m-0 min-w-0 truncate font-mono text-mono-xs font-normal uppercase tracking-[0.08em] text-[var(--fg-muted)]"
          >
            {label}
          </Heading>
          {total ? (
            <span className="shrink-0 font-mono text-mono-sm text-[var(--fg-secondary)]">
              {total}
            </span>
          ) : null}
        </div>
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0">{children}</ul>
      </section>
    );
  }
);
ListGroup.displayName = "ListGroup";

export { ListGroup, ListRow };
export type { ListGroupProps, ListRowProps };
