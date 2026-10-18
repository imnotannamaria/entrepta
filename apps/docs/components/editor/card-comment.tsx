import { cn } from "@entrepta/registry/lib/utils";
import * as React from "react";

/** The docs' own card footer note, with a dimmed `//` in front. The registry's CardNote has none. */
export const CardComment = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn(className)} {...props}>
      <span aria-hidden className="opacity-60">
        {"// "}
      </span>
      {children}
    </span>
  )
);
CardComment.displayName = "CardComment";
