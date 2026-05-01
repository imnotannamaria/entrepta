"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";

const CommandDialog = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) => (
  <DialogPrimitive.Root {...props}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-[var(--bg-canvas)]/80 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-[20%] z-50 -translate-x-1/2",
          "w-full max-w-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "duration-[var(--motion-base)]"
        )}
      >
        <DialogPrimitive.Title className="sr-only">Command Palette</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          Search for commands, pages, and components.
        </DialogPrimitive.Description>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);
CommandDialog.displayName = "CommandDialog";

const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex flex-col overflow-hidden",
      "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
      "rounded-[var(--radius-lg)] shadow-2xl",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center gap-3 px-4 border-b border-[var(--border-subtle)]">
    <Search
      className="shrink-0 text-[var(--fg-muted)]"
      style={{ width: 14, height: 14, strokeWidth: 1.5 }}
    />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex-1 h-12 bg-transparent border-0 outline-none",
        "font-mono text-sm text-[var(--fg-primary)]",
        "placeholder:text-[var(--fg-muted)]",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-80 overflow-y-auto overflow-x-hidden p-2", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-8 text-center font-mono text-xs text-[var(--fg-muted)]"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5",
      "[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px]",
      "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest",
      "[&_[cmdk-group-heading]]:text-[var(--fg-muted)]",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("my-1 -mx-2 h-px bg-[var(--border-subtle)]", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

interface CommandItemProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {
  shortcut?: string;
  icon?: React.ReactNode;
}

const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, shortcut, icon, children, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)]",
      "font-mono text-xs text-[var(--fg-secondary)]",
      "cursor-default select-none",
      "transition-colors duration-[var(--motion-fast)]",
      "data-[selected=true]:bg-[var(--bg-surface-elevated)] data-[selected=true]:text-[var(--fg-primary)]",
      "data-[disabled=true]:opacity-40 data-[disabled=true]:pointer-events-none",
      className
    )}
    {...props}
  >
    {icon && <span className="shrink-0 text-[var(--fg-muted)]">{icon}</span>}
    <span className="flex-1">{children}</span>
    {shortcut && (
      <span className="font-mono text-[10px] text-[var(--fg-muted)] tracking-widest">
        {shortcut}
      </span>
    )}
  </CommandPrimitive.Item>
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
};
