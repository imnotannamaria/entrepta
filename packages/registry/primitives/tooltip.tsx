"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "../lib/utils";

const TooltipProvider = ({
  delayDuration = 200,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
);
TooltipProvider.displayName = "TooltipProvider";

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      data-surface="dark"
      className={cn(
        "z-50 inline-flex items-center gap-2 whitespace-nowrap",
        "bg-[var(--bg-surface)] border border-[var(--border-strong)]",
        "rounded-[var(--radius-sm)] px-2 py-1",
        "font-mono text-mono-sm text-[var(--fg-primary)]",
        "shadow-[0_4px_12px_rgba(0,0,0,0.4)]",
        "motion-pop origin-[var(--radix-tooltip-content-transform-origin)]",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("font-mono text-mono-sm text-[var(--fg-muted)] tracking-[0.04em]", className)}
    {...props}
  />
);
TooltipShortcut.displayName = "TooltipShortcut";

export { Tooltip, TooltipContent, TooltipProvider, TooltipShortcut, TooltipTrigger };
