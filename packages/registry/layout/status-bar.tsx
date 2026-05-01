"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface StatusBarProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const StatusBar = React.forwardRef<HTMLDivElement, StatusBarProps>(
  ({ className, left, right, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "flex items-center justify-between",
        "h-6 px-3",
        "bg-[var(--fg-brand)] text-white",
        "font-mono text-[10px]",
        "hidden sm:flex",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">{left ?? children}</div>
      <div className="flex items-center gap-3">{right}</div>
    </div>
  )
);
StatusBar.displayName = "StatusBar";

interface StatusBarItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode;
}

const StatusBarItem = React.forwardRef<HTMLSpanElement, StatusBarItemProps>(
  ({ className, children, icon, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "flex items-center gap-1 opacity-90 hover:opacity-100 cursor-default",
        "transition-opacity duration-[var(--motion-fast)]",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
);
StatusBarItem.displayName = "StatusBarItem";

export { StatusBar, StatusBarItem };
export type { StatusBarItemProps, StatusBarProps };
