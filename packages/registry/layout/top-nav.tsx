"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  ({ className, left, center, right, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "flex items-center justify-between",
        "h-12 px-4 sm:px-6",
        "bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">{left ?? children}</div>
      {center && (
        <div className="hidden sm:flex items-center absolute left-1/2 -translate-x-1/2">
          {center}
        </div>
      )}
      <div className="flex items-center gap-2 shrink-0">{right}</div>
    </nav>
  )
);
TopNav.displayName = "TopNav";

interface TopNavLogoProps extends React.HTMLAttributes<HTMLDivElement> {}

const TopNavLogo = React.forwardRef<HTMLDivElement, TopNavLogoProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 font-mono text-sm text-[var(--fg-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TopNavLogo.displayName = "TopNavLogo";

interface TopNavBreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {}

const TopNavBreadcrumb = React.forwardRef<HTMLDivElement, TopNavBreadcrumbProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "hidden sm:flex items-center gap-1 font-mono text-xs text-[var(--fg-muted)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TopNavBreadcrumb.displayName = "TopNavBreadcrumb";

const TopNavSeparator = () => <span className="text-[var(--border-strong)] select-none">/</span>;
TopNavSeparator.displayName = "TopNavSeparator";

export { TopNav, TopNavBreadcrumb, TopNavLogo, TopNavSeparator };
export type { TopNavBreadcrumbProps, TopNavLogoProps, TopNavProps };
