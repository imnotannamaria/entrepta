import { cn } from "@entrepta/registry/lib/utils";
import type * as React from "react";

/**
 * The editor's title bar around a row of tabs: three window dots first, and
 * `end` as muted meta on the right, hidden below 768px. Put a TabsList or a
 * TabNav inside with `className="min-w-0 flex-1 border-b-0"`, since the bar
 * draws the border and the background itself.
 */
export function WindowBar({
  end,
  className,
  children,
}: {
  end?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-10 min-w-0 select-none items-stretch",
        "border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]",
        className
      )}
    >
      <div
        aria-hidden
        data-window-dots
        className="group/dots flex w-[84px] shrink-0 items-center gap-1.5 border-r border-[var(--border-subtle)] px-3"
      >
        {["--status-error", "--status-warning", "--status-success"].map((tone) => (
          <span
            key={tone}
            className="h-3 w-3 rounded-full opacity-85 transition-[opacity,transform] duration-[var(--motion-fast)] group-hover/dots:scale-110 group-hover/dots:opacity-100"
            style={{ background: `var(${tone})` }}
          />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 items-stretch">{children}</div>
      {end ? (
        <div className="hidden shrink-0 items-center gap-4 px-4 font-mono text-mono-sm text-[var(--fg-muted)] md:flex">
          {end}
        </div>
      ) : null}
    </div>
  );
}
