"use client";

import type { Icon } from "@phosphor-icons/react";
import { Slot } from "@radix-ui/react-slot";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { EASE_OUT } from "../lib/motion";
import { cn } from "../lib/utils";

/**
 * Tabs, in two flavors that look the same:
 *
 * - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`: Radix tabs that switch a
 *   panel in place.
 * - `TabNav`, `TabNavLink`: a row of links, for tabs that are routes. Which one
 *   is active stays in your project: pass `active`.
 *
 * Both share the scroller that fades only the edge with hidden tabs, one brand
 * underline that travels to the active tab, an icon that fills when active and
 * grows on hover.
 */

type TabIcon = React.ReactNode | Icon;

const StripContext = React.createContext<{
  value?: string;
  layoutId: string;
  indicator?: React.ReactNode;
} | null>(null);

function useStrip() {
  const ctx = React.useContext(StripContext);
  if (!ctx) throw new Error("Tab parts must be used inside Tabs or TabNav");
  return ctx;
}

/** Fade an edge of the scroller only when tabs are actually hidden past it. */
function useFadeMask(ref: React.RefObject<HTMLElement | null>, deps: unknown[]) {
  const [edges, setEdges] = React.useState({ start: false, end: false });

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the tab set changes
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft > 1,
        end: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, deps);

  const start = edges.start ? "28px" : "0px";
  const end = edges.end ? "28px" : "0px";
  const mask = `linear-gradient(to right, transparent 0, #000 ${start}, #000 calc(100% - ${end}), transparent 100%)`;
  return { maskImage: mask, WebkitMaskImage: mask } as React.CSSProperties;
}

const rowClass = cn(
  "flex min-h-10 min-w-0 items-stretch select-none",
  "border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]"
);

/** The row around a scroller: the tabs, `after`, then `end` pinned right. */
function Row({
  className,
  after,
  end,
  children,
}: {
  className?: string;
  after?: React.ReactNode;
  end?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(rowClass, className)}>
      {children}
      {after}
      {end && (
        <div className="ml-auto flex shrink-0 items-center gap-2 px-4 font-mono text-mono-sm text-[var(--fg-muted)]">
          {end}
        </div>
      )}
    </div>
  );
}

const scrollerClass = cn(
  "flex min-w-0 items-stretch overflow-x-auto",
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
);

function tabLabelClass(active: boolean) {
  return cn(
    "inline-flex h-full items-center gap-2 px-3 sm:px-4 font-mono text-mono-sm",
    "transition-colors duration-[var(--motion-fast)]",
    // the tab fills the row, so the ring goes inside it
    "focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--fg-brand)]",
    "disabled:cursor-not-allowed disabled:opacity-40",
    active
      ? "text-[var(--fg-primary)]"
      : "text-[var(--fg-muted)] hover:text-[var(--fg-secondary)] cursor-pointer"
  );
}

function TabGlyph({ icon, active }: { icon?: TabIcon; active: boolean }) {
  const { indicator } = useStrip();
  if (!icon) {
    // the room stays on the inactive tabs, so the labels do not shift when one is picked
    return indicator == null ? null : (
      <span aria-hidden className={cn("inline-flex shrink-0", !active && "invisible")}>
        {indicator}
      </span>
    );
  }
  if (React.isValidElement(icon)) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-115 group-has-[:focus-visible]:scale-115",
          active ? "text-[var(--fg-brand)]" : "text-inherit"
        )}
      >
        {icon}
      </span>
    );
  }
  const Glyph = icon as Icon;
  return (
    <Glyph
      aria-hidden
      size={15}
      weight={active ? "fill" : "regular"}
      className={cn(
        "shrink-0 transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-115 group-has-[:focus-visible]:scale-115",
        active && "text-[var(--fg-brand)]"
      )}
    />
  );
}

/** The per-tab box: hover, divider, active surface and the travelling underline. */
function TabShell({ active, children }: { active: boolean; children: React.ReactNode }) {
  const { layoutId } = useStrip();
  const reduce = useReducedMotion() ?? false;

  return (
    <div
      data-state={active ? "active" : "inactive"}
      className={cn(
        "group relative inline-flex h-full shrink-0 items-center border-r border-[var(--border-subtle)]",
        "transition-colors duration-150",
        // the active tab glows up from its underline, the brand rising into the surface
        active
          ? "bg-[var(--bg-card)] bg-[linear-gradient(to_top,color-mix(in_srgb,var(--fg-brand)_12%,transparent),transparent_80%)]"
          : "hover:bg-[var(--bg-hover-soft)]"
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          aria-hidden
          data-tab-underline
          transition={reduce ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--fg-brand)]"
        />
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs that switch a panel in place                                   */
/* ------------------------------------------------------------------ */

const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    /** A glyph before the label of the active tab, for tabs with no icon. None by default. */
    indicator?: React.ReactNode;
  }
>(({ value: valueProp, defaultValue, onValueChange, indicator, ...props }, ref) => {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const layoutId = React.useId();

  const handleChange = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <StripContext.Provider value={{ value, layoutId, indicator }}>
      <TabsPrimitive.Root ref={ref} value={value} onValueChange={handleChange} {...props} />
    </StripContext.Provider>
  );
});
Tabs.displayName = "Tabs";

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** Right after the last tab, outside the scroller, such as a `+` button. */
  after?: React.ReactNode;
  /** Pinned to the far end of the row, outside the scroller. */
  end?: React.ReactNode;
}

const TabsList = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, style, after, end, children, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);
    const count = React.Children.count(children);
    const mask = useFadeMask(innerRef, [count]);

    return (
      <Row className={className} after={after} end={end}>
        <TabsPrimitive.List
          ref={innerRef}
          className={scrollerClass}
          style={{ ...mask, ...style }}
          {...props}
        >
          {children}
        </TabsPrimitive.List>
      </Row>
    );
  }
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** An element, or a Phosphor icon component, which fills when active. Without one, the strip's `indicator`, if it has one. */
  icon?: TabIcon;
}

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, value, icon, children, ...props }, ref) => {
  const { value: current } = useStrip();
  const active = current === value;

  return (
    <TabShell active={active}>
      <TabsPrimitive.Trigger
        ref={ref}
        value={value}
        className={cn(tabLabelClass(active), className)}
        {...props}
      >
        <TabGlyph icon={icon} active={active} />
        {/* with an icon, phones show only the active tab's name */}
        <span className={cn(icon && !active && "sr-only sm:not-sr-only")}>{children}</span>
      </TabsPrimitive.Trigger>
    </TabShell>
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

/* ------------------------------------------------------------------ */
/* Tabs that are routes                                                */
/* ------------------------------------------------------------------ */

interface TabNavProps extends React.HTMLAttributes<HTMLElement> {
  /** Names the landmark: "Pages". */
  "aria-label": string;
  after?: React.ReactNode;
  end?: React.ReactNode;
  /** A glyph before the label of the active tab, for tabs with no icon. None by default. */
  indicator?: React.ReactNode;
}

/** A `<nav>` of route tabs. */
const TabNav = React.forwardRef<HTMLElement, TabNavProps>(
  ({ className, style, after, end, indicator, children, ...props }, ref) => {
    const innerRef = React.useRef<HTMLElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLElement);
    const layoutId = React.useId();
    const count = React.Children.count(children);
    const mask = useFadeMask(innerRef, [count]);

    return (
      <StripContext.Provider value={{ layoutId, indicator }}>
        <Row className={className} after={after} end={end}>
          <nav ref={innerRef} className={scrollerClass} style={{ ...mask, ...style }} {...props}>
            {children}
          </nav>
        </Row>
      </StripContext.Provider>
    );
  }
);
TabNav.displayName = "TabNav";

interface TabNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  icon?: TabIcon;
  /** Render your router's link: `<TabNavLink asChild active><Link href="/">home.tsx</Link></TabNavLink>`. */
  asChild?: boolean;
}

/** One route tab. Marked `aria-current="page"` when active. */
const TabNavLink = React.forwardRef<HTMLAnchorElement, TabNavLinkProps>(
  ({ className, active = false, icon, asChild = false, children, ...props }, ref) => {
    const label =
      asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
        ? children.props.children
        : children;
    const inner = (
      <>
        <TabGlyph icon={icon} active={active} />
        <span className={cn(icon && !active && "sr-only sm:not-sr-only")}>{label}</span>
      </>
    );
    const shared = {
      "aria-current": active ? ("page" as const) : undefined,
      className: cn(tabLabelClass(active), className),
    };

    return (
      <TabShell active={active}>
        {asChild && React.isValidElement(children) ? (
          <Slot ref={ref} {...shared} {...props}>
            {React.cloneElement(children, undefined, inner)}
          </Slot>
        ) : (
          <a ref={ref} {...shared} {...props}>
            {inner}
          </a>
        )}
      </TabShell>
    );
  }
);
TabNavLink.displayName = "TabNavLink";

export { TabNav, TabNavLink, Tabs, TabsContent, TabsList, TabsTrigger };
export type { TabNavLinkProps, TabNavProps, TabsListProps, TabsTriggerProps };
