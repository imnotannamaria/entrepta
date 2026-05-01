"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 shrink-0",
    "font-mono font-medium tracking-wide",
    "border transition-all duration-(--motion-fast)",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-(--fg-brand) text-(--bg-canvas) border-transparent",
          "hover:opacity-90 active:opacity-80",
        ],
        secondary: [
          "bg-(--bg-surface) text-(--fg-primary) border-(--border-strong)",
          "hover:bg-(--bg-surface-elevated) hover:border-(--fg-muted) active:opacity-80",
        ],
        ghost: [
          "bg-transparent text-(--fg-secondary) border-transparent",
          "hover:bg-(--bg-surface) hover:text-(--fg-primary) active:opacity-80",
        ],
        destructive: [
          "bg-(--status-error) text-white border-transparent",
          "hover:opacity-90 active:opacity-80",
        ],
      },
      size: {
        sm: "h-7 px-3 text-xs rounded-(--radius-sm)",
        md: "h-9 px-4 text-sm rounded-(--radius-sm)",
        lg: "h-11 px-6 text-sm rounded-(--radius-md)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="animate-spin" style={{ width: 14, height: 14, strokeWidth: 1.5 }} />
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
