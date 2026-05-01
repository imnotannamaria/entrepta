import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils";

const cardVariants = cva("flex flex-col", {
  variants: {
    variant: {
      default: [
        "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
        "rounded-[var(--radius-md)] p-5",
      ],
      featured: [
        "bg-[var(--bg-surface-brand)] border border-[var(--fg-brand)]",
        "rounded-[var(--radius-md)] p-5",
      ],
      terminal: [
        "bg-[var(--bg-canvas)] border border-[var(--border-subtle)]",
        "rounded-[var(--radius-md)]",
        "font-mono text-sm",
      ],
      data: [
        "bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]",
        "rounded-[var(--radius-md)] p-5 backdrop-blur-sm",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-5 pb-0", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-serif text-lg text-[var(--fg-primary)] leading-snug", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-[var(--fg-muted)] font-sans", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-3", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-3 p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

/* terminal card header bar */
const CardTerminalBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 px-4 py-2 border-b border-[var(--border-subtle)]",
        "text-[var(--fg-muted)] text-xs font-mono",
        className
      )}
      {...props}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-error)] opacity-60" />
      <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-warning)] opacity-60" />
      <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-success)] opacity-60" />
      {children && <span className="ml-2">{children}</span>}
    </div>
  )
);
CardTerminalBar.displayName = "CardTerminalBar";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardTerminalBar };
