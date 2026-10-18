import { Diamond } from "@entrepta/registry/content/diamond";
import {
  CardLabel as BaseCardLabel,
  type CardLabelProps,
} from "@entrepta/registry/primitives/card";
import * as React from "react";

/** The docs' card label, with the ◆ in front. The registry's CardLabel draws nothing unless it gets an icon. */
export const CardLabel = React.forwardRef<HTMLElement, CardLabelProps>((props, ref) => (
  <BaseCardLabel ref={ref} icon={<Diamond size={10} />} {...props} />
));
CardLabel.displayName = "CardLabel";
