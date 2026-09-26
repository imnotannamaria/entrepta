"use client";

import * as React from "react";
import { cn } from "../lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  /** A muted line under the label. */
  description?: React.ReactNode;
  /** The mixed state, for a "select all" over a list that is partly picked. */
  indeterminate?: boolean;
}

/**
 * A real `<input type="checkbox">` under the visuals, like Switch: focus,
 * keyboard, forms and screen readers come from the browser. The box, the check
 * and the dash are `peer-*` styles over it, and the check draws itself in.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, indeterminate = false, disabled, id, ...props }, ref) => {
    const generated = React.useId();
    const inputId = id ?? generated;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    // indeterminate is a DOM property with no attribute
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <div className={cn("flex items-start gap-2.5", disabled && "opacity-40", className)}>
        <span className="relative mt-0.5 inline-flex size-4 shrink-0">
          <input
            ref={innerRef}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            aria-describedby={descriptionId}
            className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            {...props}
          />
          <span
            aria-hidden
            data-checkbox-box
            className={cn(
              "block size-4 rounded-[4px] border",
              "border-[var(--border-strong)] bg-[var(--bg-field)]",
              "transition-[background-color,border-color,box-shadow,scale] duration-[var(--motion-base)] ease-[var(--ease-out)]",
              "peer-hover:border-[var(--fg-muted)] peer-active:scale-90",
              // fills, then settles with a small overshoot
              "peer-checked:border-[var(--fg-brand)] peer-checked:bg-[var(--fg-brand)]",
              "peer-checked:animate-[check-pop_var(--motion-slow)_var(--ease-out)]",
              "peer-indeterminate:border-[var(--fg-brand)] peer-indeterminate:bg-[var(--fg-brand)]",
              "peer-focus-visible:shadow-[0_0_0_3px_var(--bg-surface-brand)]"
            )}
          />
          <svg
            aria-hidden="true"
            data-checkbox-check
            viewBox="0 0 16 16"
            fill="none"
            className={cn(
              "pointer-events-none absolute inset-0 size-4 text-[var(--fg-on-brand)]",
              "[stroke-dasharray:14] [stroke-dashoffset:14] opacity-0",
              // unchecking erases at once; checking waits for the fill, then draws
              "transition-[stroke-dashoffset,opacity] duration-[var(--motion-fast)] ease-out",
              "peer-checked:[stroke-dashoffset:0] peer-checked:opacity-100",
              "peer-checked:delay-[60ms] peer-checked:duration-[var(--motion-slow)]",
              "peer-checked:animate-[check-pop_var(--motion-slow)_var(--ease-out)]",
              "peer-indeterminate:opacity-0"
            )}
          >
            <path
              d="M4 8.5l2.5 2.5L12 5.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            aria-hidden
            data-checkbox-dash
            className={cn(
              "pointer-events-none absolute top-1/2 left-1/2 h-0.5 w-2 -translate-x-1/2 -translate-y-1/2",
              "scale-x-0 rounded-full bg-[var(--fg-on-brand)] opacity-0",
              "transition-[opacity,scale] duration-[var(--motion-base)] ease-[var(--ease-out)]",
              "peer-indeterminate:scale-x-100 peer-indeterminate:opacity-100"
            )}
          />
        </span>

        {(label || description) && (
          <span className="flex min-w-0 flex-col gap-0.5">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  // a long single word, such as a component name, wraps instead of spilling over
                  "cursor-pointer select-none font-mono text-mono-md text-[var(--fg-secondary)] [overflow-wrap:anywhere]",
                  disabled && "cursor-not-allowed"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span id={descriptionId} className="font-mono text-mono-sm text-[var(--fg-muted)]">
                {description}
              </span>
            )}
          </span>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
