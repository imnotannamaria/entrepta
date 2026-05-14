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
        "relative flex items-center justify-between gap-4",
        "py-4 px-4 sm:px-6",
        "bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 min-w-0">{left ?? children}</div>
      {center && (
        <div className="hidden sm:flex items-center absolute left-1/2 -translate-x-1/2">
          {center}
        </div>
      )}
      <div className="flex items-center gap-3 shrink-0">{right}</div>
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
        "inline-flex items-center gap-2 font-mono text-[13px] text-[var(--fg-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TopNavLogo.displayName = "TopNavLogo";

interface TopNavLogoMarkProps extends React.HTMLAttributes<HTMLSpanElement> {}

/** Brand-colored 24x24 tile with serif italic letter. Compose inside TopNavLogo. */
const TopNavLogoMark = React.forwardRef<HTMLSpanElement, TopNavLogoMarkProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-grid place-items-center shrink-0",
        "size-6 rounded-[var(--radius-sm)]",
        "bg-[var(--fg-brand)] text-[var(--bg-canvas)]",
        "font-serif italic text-sm leading-none",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);
TopNavLogoMark.displayName = "TopNavLogoMark";

interface TopNavBreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {}

const TopNavBreadcrumb = React.forwardRef<HTMLDivElement, TopNavBreadcrumbProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "hidden sm:flex items-center gap-1.5",
        "font-mono text-[13px] text-[var(--fg-muted)]",
        "[&_.here]:text-[var(--fg-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TopNavBreadcrumb.displayName = "TopNavBreadcrumb";

const TopNavSeparator = () => (
  <span aria-hidden className="text-[var(--fg-muted)] opacity-60 select-none">
    /
  </span>
);
TopNavSeparator.displayName = "TopNavSeparator";

interface TopNavMenuProps extends React.HTMLAttributes<HTMLElement> {}

const TopNavMenu = React.forwardRef<HTMLElement, TopNavMenuProps>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "hidden md:flex items-center gap-6",
        "font-mono text-[12px] uppercase tracking-[0.06em]",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
);
TopNavMenu.displayName = "TopNavMenu";

interface TopNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  external?: boolean;
}

const TopNavLink = React.forwardRef<HTMLAnchorElement, TopNavLinkProps>(
  ({ className, children, active, external, ...props }, ref) => (
    <a
      ref={ref}
      data-state={active ? "active" : undefined}
      className={cn(
        "inline-flex items-center gap-1",
        "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]",
        "transition-colors duration-150",
        active && "text-[var(--fg-primary)] font-medium",
        className
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {external && (
        <span aria-hidden className="text-[var(--fg-muted)]">
          ↗
        </span>
      )}
    </a>
  )
);
TopNavLink.displayName = "TopNavLink";

export {
  TopNav,
  TopNavBreadcrumb,
  TopNavLink,
  TopNavLogo,
  TopNavLogoMark,
  TopNavMenu,
  TopNavSeparator,
};
export type {
  TopNavBreadcrumbProps,
  TopNavLinkProps,
  TopNavLogoMarkProps,
  TopNavLogoProps,
  TopNavMenuProps,
  TopNavProps,
};
