"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { Command, Search } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

const inputWrapperVariants = cva(
  [
    "relative flex items-center",
    "bg-(--bg-surface) border border-(--border-subtle)",
    "transition-colors duration-(--motion-fast)",
    "focus-within:border-(--fg-brand)",
    "has-[:disabled]:opacity-40 has-[:disabled]:pointer-events-none",
  ],
  {
    variants: {
      size: {
        sm: "h-7 rounded-(--radius-sm)",
        md: "h-9 rounded-(--radius-sm)",
        lg: "h-11 rounded-(--radius-md)",
      },
      state: {
        default: "",
        error: "border-(--status-error) focus-within:border-(--status-error)",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

const inputBaseClass = [
  "flex-1 h-full px-3",
  "bg-transparent",
  "font-mono text-sm text-(--fg-primary)",
  "placeholder:text-(--fg-muted)",
  "outline-none",
].join(" ");

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputWrapperVariants> {
  variant?: "default" | "search" | "command";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", size, state, ...props }, ref) => {
    return (
      <div className={cn(inputWrapperVariants({ size, state }), className)}>
        {variant === "search" && (
          <Search
            className="ml-3 shrink-0 text-(--fg-muted)"
            style={{ width: 14, height: 14, strokeWidth: 1.5 }}
          />
        )}
        <input
          ref={ref}
          className={cn(inputBaseClass, variant === "search" && "pl-2")}
          {...props}
        />
        {variant === "command" && (
          <div className="mr-3 flex items-center gap-0.5 text-(--fg-muted)">
            <Command style={{ width: 11, height: 11, strokeWidth: 1.5 }} />
            <span className="font-mono text-xs">K</span>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
