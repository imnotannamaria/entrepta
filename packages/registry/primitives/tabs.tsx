"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex items-end gap-0 overflow-x-auto",
      "border-b border-[var(--border-subtle)]",
      "scrollbar-none",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  onClose?: () => void;
  icon?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, onClose, icon, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "group relative flex items-center gap-2 shrink-0",
      "h-9 px-4 font-mono text-xs",
      "text-[var(--fg-muted)] border-b-2 border-transparent",
      "transition-colors duration-[var(--motion-fast)]",
      "hover:text-[var(--fg-secondary)] hover:bg-[var(--bg-surface)]",
      "data-[state=active]:text-[var(--fg-primary)]",
      "data-[state=active]:border-[var(--fg-brand)]",
      "data-[state=active]:bg-[var(--bg-surface)]",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] focus-visible:ring-inset",
      className
    )}
    {...props}
  >
    {icon && (
      <span className="shrink-0 text-[var(--fg-muted)] group-data-[state=active]:text-[var(--fg-brand)]">
        {icon}
      </span>
    )}
    <span>{children}</span>
    {onClose && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={cn(
          "ml-1 rounded p-0.5 opacity-0 group-hover:opacity-100",
          "text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-surface-elevated)]",
          "transition-all duration-[var(--motion-fast)]",
          "focus-visible:outline-none focus-visible:opacity-100"
        )}
        aria-label="Close tab"
      >
        <X style={{ width: 12, height: 12, strokeWidth: 1.5 }} />
      </button>
    )}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
