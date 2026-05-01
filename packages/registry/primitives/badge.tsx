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
        sm: "h-5 px-1.5 rounded-(--radius-sm)",
        md: "h-6 px-2 rounded-(--radius-sm)",
      },
    },
    compoundVariants: [
      // solid
      {
        variant: "solid",
        color: "neutral",
        className: "bg-(--fg-muted) text-(--bg-canvas)",
      },
      {
        variant: "solid",
        color: "brand",
        className: "bg-(--fg-brand) text-(--bg-canvas)",
      },
      {
        variant: "solid",
        color: "success",
        className: "bg-(--status-success) text-(--bg-canvas)",
      },
      {
        variant: "solid",
        color: "warning",
        className: "bg-(--status-warning) text-(--bg-canvas)",
      },
      {
        variant: "solid",
        color: "error",
        className: "bg-(--status-error) text-white",
      },
      {
        variant: "solid",
        color: "info",
        className: "bg-(--status-info) text-(--bg-canvas)",
      },
      // soft
      {
        variant: "soft",
        color: "neutral",
        className: "bg-(--bg-surface) text-(--fg-secondary)",
      },
      {
        variant: "soft",
        color: "brand",
        className: "bg-(--bg-surface-brand) text-(--fg-brand)",
      },
      {
        variant: "soft",
        color: "success",
        className:
          "bg-[color-mix(in_srgb,var(--status-success)_15%,transparent)] text-(--status-success)",
      },
      {
        variant: "soft",
        color: "warning",
        className:
          "bg-[color-mix(in_srgb,var(--status-warning)_15%,transparent)] text-(--status-warning)",
      },
      {
        variant: "soft",
        color: "error",
        className:
          "bg-[color-mix(in_srgb,var(--status-error)_15%,transparent)] text-(--status-error)",
      },
      {
        variant: "soft",
        color: "info",
        className:
          "bg-[color-mix(in_srgb,var(--status-info)_15%,transparent)] text-(--status-info)",
      },
      // outline
      {
        variant: "outline",
        color: "neutral",
        className: "border-(--border-strong) text-(--fg-secondary)",
      },
      {
        variant: "outline",
        color: "brand",
        className: "border-(--fg-brand) text-(--fg-brand)",
      },
      {
        variant: "outline",
        color: "success",
        className: "border-(--status-success) text-(--status-success)",
      },
      {
        variant: "outline",
        color: "warning",
        className: "border-(--status-warning) text-(--status-warning)",
      },
      {
        variant: "outline",
        color: "error",
        className: "border-(--status-error) text-(--status-error)",
      },
      {
        variant: "outline",
        color: "info",
        className: "border-(--status-info) text-(--status-info)",
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
