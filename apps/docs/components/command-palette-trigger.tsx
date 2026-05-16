"use client";

import { Button } from "@entrepta/registry/primitives/button";
import { useSiteCommandPalette } from "./site-command-palette";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CommandPaletteTrigger({ className, size = "lg" }: Props) {
  const { open } = useSiteCommandPalette();
  return (
    <Button variant="ghost" size={size} className={className} onClick={open} type="button">
      press{" "}
      <kbd className="ml-1 px-1.5 py-0.5 font-mono text-[11px] border border-[var(--border-strong)] rounded-[3px] text-[var(--fg-muted)]">
        ⌘K
      </kbd>
    </Button>
  );
}
