import * as React from "react";
import { cn } from "../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "circle" | "rect";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rect", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse bg-[var(--bg-surface-elevated)]",
        variant === "circle" && "rounded-full",
        variant === "line" && "rounded-[var(--radius-sm)] h-4 w-full",
        variant === "rect" && "rounded-[var(--radius-sm)]",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn("flex flex-col gap-2", className)}>
    {Array.from({ length: lines }, (_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton lines are stateless, index is safe
      <Skeleton key={i} variant="line" className={i === lines - 1 ? "w-3/4" : "w-full"} />
    ))}
  </div>
);
SkeletonText.displayName = "SkeletonText";

export { Skeleton, SkeletonText };
export type { SkeletonProps };
