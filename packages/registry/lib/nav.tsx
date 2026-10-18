import { cn } from "./utils";

/**
 * A row in a list of destinations: the labeled Sidebar, the MobileNav's More
 * sheet, a docs menu. The current one is raised, with a card's finish; the
 * rest wait in the muted ink. One place, so every nav marks "you are here"
 * the same way.
 */
export const NAV_ROW_CURRENT = cn(
  "sheen bg-[var(--bg-card-hover)] text-[var(--fg-primary)] shadow-[var(--shadow-card)]"
);

/**
 * What marks the current destination, or the current step: a small dot in the
 * brand color. Every nav takes an `indicator` prop to swap it, and `null` hides it.
 */
export function NavIndicator({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-nav-indicator
      className={cn("block size-1.5 rounded-full bg-[var(--fg-brand)]", className)}
    />
  );
}

export const NAV_ROW_IDLE = cn(
  "text-[var(--fg-muted)] hover:bg-[var(--bg-hover-soft)] hover:text-[var(--fg-secondary)]"
);
