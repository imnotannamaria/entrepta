"use client";

import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-mono text-xs font-medium leading-none",
  {
    variants: {
      variant: {
        solid: "",
        soft: "",
        outline: "border bg-transparent",
      },
      color: {
        neutral: "",
        brand: "",
        success: "",
        warning: "",
        error: "",
        info: "",
      },
      size: {
        sm: "h-5 px-1.5 rounded-[var(--radius-sm)]",
        md: "h-6 px-2 rounded-[var(--radius-sm)]",
      },
    },
    compoundVariants: [
      // solid
      {
        variant: "solid",
        color: "neutral",
        className: "bg-[var(--fg-muted)] text-[var(--bg-canvas)]",
      },
      {
        variant: "solid",
        color: "brand",
        className: "bg-[var(--fg-brand)] text-[var(--bg-canvas)]",
      },
      {
        variant: "solid",
        color: "success",
        className: "bg-[var(--status-success)] text-[var(--bg-canvas)]",
      },
      {
        variant: "solid",
        color: "warning",
        className: "bg-[var(--status-warning)] text-[var(--bg-canvas)]",
      },
      {
        variant: "solid",
        color: "error",
        className: "bg-[var(--status-error)] text-white",
      },
      {
        variant: "solid",
        color: "info",
        className: "bg-[var(--status-info)] text-[var(--bg-canvas)]",
      },
      // soft
      {
        variant: "soft",
        color: "neutral",
        className: "bg-[var(--bg-surface)] text-[var(--fg-secondary)]",
      },
      {
        variant: "soft",
        color: "brand",
        className: "bg-[var(--bg-surface-brand)] text-[var(--fg-brand)]",
      },
      {
        variant: "soft",
        color: "success",
        className:
          "bg-[color-mix(in_srgb,var(--status-success)_15%,transparent)] text-[var(--status-success)]",
      },
      {
        variant: "soft",
        color: "warning",
        className:
          "bg-[color-mix(in_srgb,var(--status-warning)_15%,transparent)] text-[var(--status-warning)]",
      },
      {
        variant: "soft",
        color: "error",
        className:
          "bg-[color-mix(in_srgb,var(--status-error)_15%,transparent)] text-[var(--status-error)]",
      },
      {
        variant: "soft",
        color: "info",
        className:
          "bg-[color-mix(in_srgb,var(--status-info)_15%,transparent)] text-[var(--status-info)]",
      },
      // outline
      {
        variant: "outline",
        color: "neutral",
        className: "border-[var(--border-strong)] text-[var(--fg-secondary)]",
      },
      {
        variant: "outline",
        color: "brand",
        className: "border-[var(--fg-brand)] text-[var(--fg-brand)]",
      },
      {
        variant: "outline",
        color: "success",
        className: "border-[var(--status-success)] text-[var(--status-success)]",
      },
      {
        variant: "outline",
        color: "warning",
        className: "border-[var(--status-warning)] text-[var(--status-warning)]",
      },
      {
        variant: "outline",
        color: "error",
        className: "border-[var(--status-error)] text-[var(--status-error)]",
      },
      {
        variant: "outline",
        color: "info",
        className: "border-[var(--status-info)] text-[var(--status-info)]",
      },
    ],
    defaultVariants: {
      variant: "soft",
      color: "neutral",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, color, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, color, size }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
