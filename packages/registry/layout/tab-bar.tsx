"use client";

import { Diamond, X } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

interface TabBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TabBar = React.forwardRef<HTMLDivElement, TabBarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-end overflow-x-auto",
        "bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]",
        "scrollbar-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center px-3 shrink-0 h-10 border-r border-[var(--border-subtle)]">
        <Diamond
          className="text-[var(--fg-brand)]"
          style={{ width: 13, height: 13, strokeWidth: 1.5 }}
        />
      </div>
      <div className="flex items-end overflow-x-auto scrollbar-none">{children}</div>
    </div>
  )
);
TabBar.displayName = "TabBar";

interface TabBarItemProps {
  active?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const TabBarItem = React.forwardRef<HTMLDivElement, TabBarItemProps>(
  ({ className, children, active, onClose, icon, onClick, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group relative flex items-center shrink-0",
        "border-b-2 border-transparent",
        "transition-colors duration-[var(--motion-fast)]",
        active ? "border-[var(--fg-brand)] bg-[var(--bg-surface)]" : "hover:bg-[var(--bg-surface)]",
        className
      )}
      {...props}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 h-10 pl-4 font-mono text-xs",
          active
            ? "text-[var(--fg-primary)]"
            : "text-[var(--fg-muted)] hover:text-[var(--fg-secondary)]",
          onClose ? "pr-1" : "pr-4"
        )}
      >
        {icon && (
          <span
            className={cn("shrink-0", active ? "text-[var(--fg-brand)]" : "text-[var(--fg-muted)]")}
          >
            {icon}
          </span>
        )}
        <span>{children}</span>
      </button>
      {onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={cn(
            "mr-2 rounded p-0.5 opacity-0 group-hover:opacity-100",
            "text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-surface-elevated)]",
            "transition-all duration-[var(--motion-fast)]",
            "focus-visible:outline-none focus-visible:opacity-100",
            active && "opacity-100"
          )}
          aria-label="Close tab"
        >
          <X style={{ width: 12, height: 12, strokeWidth: 1.5 }} />
        </button>
      )}
    </div>
  )
);
TabBarItem.displayName = "TabBarItem";

export { TabBar, TabBarItem };
export type { TabBarItemProps, TabBarProps };
