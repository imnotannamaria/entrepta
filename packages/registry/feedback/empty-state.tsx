import { cva } from "class-variance-authority";
import * as React from "react";
import type { IconProp } from "../lib/icon";
import { cn } from "../lib/utils";
import { IconTile } from "../primitives/icon-tile";

const emptyStateVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    size: {
      sm: "gap-2.5 px-4 py-6",
      md: "gap-3 px-6 py-10",
    },
  },
  defaultVariants: { size: "md" },
});

interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: IconProp;
  /** What is missing, in the reader's words: "No entries this month". */
  title: React.ReactNode;
  /** The next step, not a welcome. */
  description?: React.ReactNode;
  /** One action: create or connect when there is nothing yet, clear the filters when a filter found nothing. */
  action?: React.ReactNode;
  size?: "sm" | "md";
  /** `error` when the content could not load: the tile takes the error tone. */
  tone?: "neutral" | "error";
}

/**
 * A list or a widget with nothing in it. It fits inside a Card, where
 * ChromeMessage takes the whole page. It says what is missing and offers the
 * one thing to do about it.
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon, title, description, action, size = "md", tone = "neutral", className, ...props },
    ref
  ) => (
    <div ref={ref} className={cn(emptyStateVariants({ size }), className)} {...props}>
      {icon ? (
        <IconTile
          icon={icon}
          size={size === "sm" ? "md" : "lg"}
          color={tone === "error" ? "error" : "neutral"}
        />
      ) : null}
      <div className="flex max-w-sm flex-col gap-1">
        <p className="m-0 font-mono text-mono-md text-[var(--fg-primary)]">{title}</p>
        {description ? (
          <p className="m-0 font-sans text-body-md text-[var(--fg-secondary)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  )
);
EmptyState.displayName = "EmptyState";

export { EmptyState, emptyStateVariants };
export type { EmptyStateProps };
