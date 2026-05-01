import { type VariantProps, cva } from "class-variance-authority";
import { Command, Search } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

const inputWrapperVariants = cva(
  [
    "relative flex items-center",
    "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
    "transition-colors duration-[var(--motion-fast)]",
    "focus-within:border-[var(--fg-brand)] focus-within:ring-1 focus-within:ring-[var(--ring)]",
    "has-[:disabled]:opacity-40 has-[:disabled]:pointer-events-none",
  ],
  {
    variants: {
      size: {
        sm: "h-7 rounded-[var(--radius-sm)]",
        md: "h-9 rounded-[var(--radius-sm)]",
        lg: "h-11 rounded-[var(--radius-md)]",
      },
      state: {
        default: "",
        error:
          "border-[var(--status-error)] focus-within:border-[var(--status-error)] focus-within:ring-[color-mix(in_srgb,var(--status-error)_40%,transparent)]",
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
  "font-mono text-sm text-[var(--fg-primary)]",
  "placeholder:text-[var(--fg-muted)]",
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
            className="ml-3 shrink-0 text-[var(--fg-muted)]"
            style={{ width: 14, height: 14, strokeWidth: 1.5 }}
          />
        )}
        <input
          ref={ref}
          className={cn(inputBaseClass, variant === "search" && "pl-2")}
          {...props}
        />
        {variant === "command" && (
          <div className="mr-3 flex items-center gap-0.5 text-[var(--fg-muted)]">
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
