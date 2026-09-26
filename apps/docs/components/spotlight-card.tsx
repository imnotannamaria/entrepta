"use client";

import { Spotlight, useSpotlight } from "@entrepta/registry/motion/spotlight";
import { Card, type CardProps } from "@entrepta/registry/primitives/card";

/** A Card with the cursor glow, for server pages that cannot hold the hook. */
export function SpotlightCard({ children, ...props }: CardProps) {
  const { onMouseMove, spotlight } = useSpotlight(640);
  return (
    <Card onMouseMove={onMouseMove} {...props}>
      <Spotlight {...spotlight} />
      <div className="relative">{children}</div>
    </Card>
  );
}
