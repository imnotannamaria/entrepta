"use client";

import { Button } from "@entrepta/registry/primitives/button";
import { Kbd } from "@entrepta/registry/primitives/kbd";
import { useSiteCommandPalette } from "./site-command-palette";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CommandPaletteTrigger({ className, size = "lg" }: Props) {
  const { open } = useSiteCommandPalette();
  return (
    <Button variant="ghost" size={size} className={className} onClick={open} type="button">
      press <Kbd className="ml-1">⌘K</Kbd>
    </Button>
  );
}
