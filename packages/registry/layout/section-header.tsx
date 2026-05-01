import * as React from "react";
import { cn } from "../lib/utils";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  eyebrowColor?: string;
  heading: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, eyebrow, eyebrowColor, heading, description, align = "left", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: eyebrowColor ?? "var(--fg-brand)" }}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--fg-primary)] leading-tight">
        {heading}
      </h2>
      {description && (
        <p className="font-sans text-base text-[var(--fg-muted)] leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

interface SectionHeadingAccentProps extends React.HTMLAttributes<HTMLSpanElement> {}

const SectionHeadingAccent = React.forwardRef<HTMLSpanElement, SectionHeadingAccentProps>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn("text-[var(--fg-brand)]", className)} {...props}>
      {children}
    </span>
  )
);
SectionHeadingAccent.displayName = "SectionHeadingAccent";

export { SectionHeader, SectionHeadingAccent };
export type { SectionHeaderProps, SectionHeadingAccentProps };
