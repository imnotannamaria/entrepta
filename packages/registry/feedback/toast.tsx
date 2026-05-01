"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <>
    <style>{`
      [data-sonner-toast] {
        font-family: var(--font-mono) !important;
        font-size: 0.75rem !important;
        background: var(--bg-surface) !important;
        border: 1px solid var(--border-subtle) !important;
        border-left-width: 2px !important;
        border-left-color: var(--border-strong) !important;
        color: var(--fg-primary) !important;
        border-radius: var(--radius-sm) !important;
      }
      [data-sonner-toast] [data-description] {
        color: var(--fg-muted) !important;
        font-family: var(--font-mono) !important;
        font-size: 0.75rem !important;
      }
      [data-sonner-toast][data-type="success"] {
        border-left-color: var(--status-success) !important;
      }
      [data-sonner-toast][data-type="error"] {
        border-left-color: var(--status-error) !important;
      }
      [data-sonner-toast][data-type="warning"] {
        border-left-color: var(--status-warning) !important;
      }
      [data-sonner-toast][data-type="info"] {
        border-left-color: var(--status-info) !important;
      }
    `}</style>
    <Sonner theme="dark" className="toaster group" {...props} />
  </>
);

export { Toaster };
export { toast } from "sonner";
