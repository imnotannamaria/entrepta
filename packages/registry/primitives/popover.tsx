"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { OVERLAY_SURFACE } from "../lib/overlay";
import { cn } from "../lib/utils";

/**
 * A panel anchored to a trigger, for content you work in: a calendar, a filter,
 * a notification list. A Tooltip only shows text and a Dropdown is a menu of
 * actions. Same surface as the rest of the overlay family.
 */
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverClose = PopoverPrimitive.Close;

/**
 * The panel. Focus moves into it on open and back to the trigger on Esc. It is
 * a dialog to screen readers: name it with `aria-label` when it has no heading.
 */
const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 6, collisionPadding = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(
        OVERLAY_SURFACE,
        "motion-pop z-50 rounded-[var(--radius-md)] p-3 outline-none",
        "max-w-[calc(100vw-16px)] max-h-[var(--radix-popover-content-available-height)] overflow-auto",
        "origin-[var(--radix-popover-content-transform-origin)]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger };
