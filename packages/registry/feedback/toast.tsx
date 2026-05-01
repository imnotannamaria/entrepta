"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="dark"
    className="toaster group"
    toastOptions={{
      classNames: {
        toast: [
          "group toast",
          "font-mono text-xs",
          "bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-l-2",
          "text-[var(--fg-primary)] shadow-lg",
          "rounded-[var(--radius-sm)]",
        ].join(" "),
        description: "text-[var(--fg-muted)]",
        actionButton: [
          "bg-[var(--fg-brand)] text-white",
          "rounded-[var(--radius-sm)] font-mono text-xs",
        ].join(" "),
        cancelButton: [
          "bg-[var(--bg-surface-elevated)] text-[var(--fg-muted)]",
          "rounded-[var(--radius-sm)] font-mono text-xs",
        ].join(" "),
        success: "border-l-[var(--status-success)]",
        error: "border-l-[var(--status-error)]",
        warning: "border-l-[var(--status-warning)]",
        info: "border-l-[var(--status-info)]",
      },
    }}
    {...props}
  />
);

export { Toaster };
export { toast } from "sonner";
