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
    "border transition-all duration-[var(--motion-fast)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--fg-brand)] text-[var(--bg-canvas)] border-transparent",
          "hover:opacity-90 active:opacity-80",
        ],
        secondary: [
          "bg-[var(--bg-surface)] text-[var(--fg-primary)] border-[var(--border-strong)]",
          "hover:bg-[var(--bg-surface-elevated)] hover:border-[var(--fg-muted)] active:opacity-80",
        ],
        ghost: [
          "bg-transparent text-[var(--fg-secondary)] border-transparent",
          "hover:bg-[var(--bg-surface)] hover:text-[var(--fg-primary)] active:opacity-80",
        ],
        destructive: [
          "bg-[var(--status-error)] text-white border-transparent",
          "hover:opacity-90 active:opacity-80",
        ],
      },
      size: {
        sm: "h-7 px-3 text-xs rounded-[var(--radius-sm)]",
        md: "h-9 px-4 text-sm rounded-[var(--radius-sm)]",
        lg: "h-11 px-6 text-sm rounded-[var(--radius-md)]",
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
