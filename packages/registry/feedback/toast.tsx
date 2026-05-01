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
          "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
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
        success: "border-[var(--status-success)]",
        error: "border-[var(--status-error)]",
        warning: "border-[var(--status-warning)]",
        info: "border-[var(--status-info)]",
      },
    }}
    {...props}
  />
);

export { Toaster };
export { toast } from "sonner";
