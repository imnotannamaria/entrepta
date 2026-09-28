"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { EASE_OUT, revealViewport } from "../lib/motion";
import { type PaletteKey, paletteColor } from "../lib/palette";
import { cn } from "../lib/utils";

// A fixed drawing box. It is stretched to the element, and the stroke keeps
// its width through vector-effect, so the line stays crisp at any size.
const W = 100;
const H = 32;
const PAD = 2;

interface SparklineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The values, oldest first. Two or more. */
  data: readonly number[];
  /** A palette color, or a status for a series that is good or bad news. */
  tone?: PaletteKey;
  /** The soft fill under the line. */
  area?: boolean;
  /** The dot on the last value. */
  dot?: boolean;
}

/**
 * The shape of a series, with no axes: the trend under a Metric, a row in a
 * table. It is decoration for screen readers, since the Metric or the row
 * already says the number; the chart for reading values comes with Charts.
 * It wipes in from the left once it is on screen, and stays still with
 * reduced motion.
 */
const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(
  ({ data, tone = "chart-1", area = true, dot = true, className, style, ...props }, ref) => {
    const reduce = useReducedMotion() ?? false;
    const gradientId = `spark-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

    const points = React.useMemo(() => {
      const values = data.filter(Number.isFinite);
      if (values.length < 2) return [];
      const min = Math.min(...values);
      const max = Math.max(...values);
      const span = max - min || 1;
      return values.map((value, index) => ({
        x: (index / (values.length - 1)) * W,
        y: PAD + (1 - (value - min) / span) * (H - PAD * 2),
      }));
    }, [data]);

    if (points.length === 0) return null;

    const line = points
      .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");
    const fill = `${line} L${W} ${H} L0 ${H} Z`;
    const last = points[points.length - 1];

    // The container watches the viewport, not the line: a line clipped to
    // nothing has no visible area, so it would never count as on screen.
    return (
      <motion.div
        ref={ref}
        aria-hidden
        className={cn("relative h-10 w-full", className)}
        style={{ "--spark": paletteColor(tone), ...style } as React.CSSProperties}
        initial={reduce ? false : "hidden"}
        whileInView="shown"
        viewport={revealViewport}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        <motion.div
          className="absolute inset-0"
          variants={{
            hidden: { clipPath: "inset(0 100% 0 0)" },
            shown: {
              clipPath: "inset(0 0% 0 0)",
              transition: { duration: reduce ? 0 : 0.9, ease: EASE_OUT },
            },
          }}
        >
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="size-full overflow-visible"
          >
            {area ? (
              <>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    {/* colors through CSS: an SVG attribute does not read a variable */}
                    <stop offset="0%" style={{ stopColor: "var(--spark)", stopOpacity: 0.28 }} />
                    <stop offset="100%" style={{ stopColor: "var(--spark)", stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <path d={fill} fill={`url(#${gradientId})`} />
              </>
            ) : null}
            <path
              d={line}
              fill="none"
              style={{ stroke: "var(--spark)" }}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </motion.div>
        {dot ? (
          // an HTML dot, since a circle in a stretched drawing would be an oval
          <motion.span
            className="absolute size-1.5 -translate-1/2 rounded-full bg-[var(--spark)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--spark)_22%,transparent)]"
            style={{ left: `${(last.x / W) * 100}%`, top: `${(last.y / H) * 100}%` }}
            variants={{
              hidden: { opacity: 0, scale: 0.4 },
              shown: {
                opacity: 1,
                scale: 1,
                transition: {
                  duration: reduce ? 0 : 0.3,
                  delay: reduce ? 0 : 0.75,
                  ease: EASE_OUT,
                },
              },
            }}
          />
        ) : null}
      </motion.div>
    );
  }
);
Sparkline.displayName = "Sparkline";

export { Sparkline };
export type { SparklineProps };
