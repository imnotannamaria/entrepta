import * as React from "react";
import { cn } from "../lib/utils";

export interface TitlebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Right side: a branch, a status, a button. Hidden below 768px. */
  meta?: React.ReactNode;
}

/**
 * The editor's top bar, 40px tall: three decorative window dots, then whatever
 * you pass as children (usually a TabNav), then meta on the right.
 */
const Titlebar = React.forwardRef<HTMLDivElement, TitlebarProps>(
  ({ className, meta, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-10 select-none items-stretch",
        "border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]",
        className
      )}
      {...props}
    >
      <div
        aria-hidden
        data-traffic-lights
        className="flex w-[84px] shrink-0 items-center gap-1.5 border-r border-[var(--border-subtle)] px-3"
      >
        <span className="h-3 w-3 rounded-full bg-[var(--status-error)] opacity-85" />
        <span className="h-3 w-3 rounded-full bg-[var(--status-warning)] opacity-85" />
        <span className="h-3 w-3 rounded-full bg-[var(--status-success)] opacity-85" />
      </div>
      {/* a TabNav brings its own height and bottom border; the bar already has both */}
      <div className="flex min-w-0 flex-1 items-stretch [&>div]:min-h-0 [&>div]:flex-1 [&>div]:border-b-0">
        {children}
      </div>
      {meta && (
        <div className="hidden shrink-0 items-center gap-4 px-4 font-mono text-mono-sm text-[var(--fg-muted)] md:flex">
          {meta}
        </div>
      )}
    </div>
  )
);
Titlebar.displayName = "Titlebar";

export { Titlebar };
