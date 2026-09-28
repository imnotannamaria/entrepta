"use client";

import { CheckIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Diamond } from "../content/diamond";
import { type PaletteKey, colorHue, hueName, paletteColor } from "../lib/palette";
import { cn } from "../lib/utils";
import { fieldLabelClass } from "./field";

const PALETTE_KEYS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
  "chart-7",
  "chart-8",
] as const satisfies readonly PaletteKey[];

/** A color of your own, such as a theme's brand, with the id it stands for. */
export interface SwatchOption {
  value: string;
  /** Any CSS color. */
  color: string;
  name: string;
}

interface SwatchPickerBaseProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange" | "defaultValue"> {
  /** The question, as the group's legend. */
  legend: React.ReactNode;
  hideLegend?: boolean;
  /**
   * Names of your own for palette keys. By default each is named after the hue
   * it shows in the current theme, since the palette turns with the brand.
   */
  names?: Partial<Record<PaletteKey, string>>;
  name?: string;
}

type SwatchPickerProps = SwatchPickerBaseProps &
  (
    | {
        /** The palette keys to offer. Defaults to the eight. */
        options?: readonly PaletteKey[];
        value?: PaletteKey;
        defaultValue?: PaletteKey;
        onValueChange?: (value: PaletteKey) => void;
      }
    | {
        /** Colors of your own, each standing for an id: a theme, a label. */
        options: readonly SwatchOption[];
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
      }
  );

/** Reads the hue each swatch shows, again when the theme or the mode changes. */
function useHueNames(ref: React.RefObject<HTMLElement | null>, keys: readonly PaletteKey[]) {
  const [names, setNames] = React.useState<Partial<Record<PaletteKey, string>>>({});
  // by content, so a new array with the same keys does not read again
  const list = keys.join(",");
  React.useEffect(() => {
    const keys = list.split(",") as PaletteKey[];
    const read = () => {
      const next: Partial<Record<PaletteKey, string>> = {};
      for (const key of keys) {
        const swatch = ref.current?.querySelector<HTMLElement>(`[data-swatch="${key}"]`);
        const hue = swatch ? colorHue(getComputedStyle(swatch).backgroundColor) : null;
        if (hue !== null) next[key] = hueName(hue);
      }
      setNames(next);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode", "class"],
    });
    return () => observer.disconnect();
  }, [ref, list]);
  return names;
}

/**
 * A color for something the person owns: a category, an account, a tag. One
 * native radio per color. With palette keys the value is the key ("chart-3")
 * and never a hex, the color follows every theme, and each swatch is named
 * after the hue it shows. With options of your own, such as the six themes,
 * the value is your id. The chosen one carries a check.
 */
const SwatchPicker = React.forwardRef<HTMLFieldSetElement, SwatchPickerProps>((props, ref) => {
  const {
    legend,
    hideLegend = false,
    options = PALETTE_KEYS,
    value,
    defaultValue,
    onValueChange,
    names: ownNames,
    name: nameProp,
    className,
    ...rest
  } = props;
  const generated = React.useId();
  const name = nameProp ?? generated;
  const box = React.useRef<HTMLDivElement>(null);
  const swatches = (options as readonly (PaletteKey | SwatchOption)[]).map((option) =>
    typeof option === "string"
      ? { value: option as string, color: paletteColor(option), name: ownNames?.[option] }
      : option
  );
  const unnamed = React.useMemo(
    () =>
      (options as readonly (PaletteKey | SwatchOption)[]).filter(
        (o): o is PaletteKey => typeof o === "string"
      ),
    [options]
  );
  const read = useHueNames(box, unnamed);
  const choose = onValueChange as ((value: string) => void) | undefined;

  return (
    <fieldset ref={ref} className={cn("m-0 min-w-0 border-0 p-0", className)} {...rest}>
      <legend className={cn(hideLegend ? "sr-only" : cn(fieldLabelClass, "mb-3 p-0"))}>
        {hideLegend ? null : <Diamond />}
        {legend}
      </legend>
      {/* equal columns, as many as fit: rows break evenly, never five and one */}
      <div
        ref={box}
        className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-x-2 gap-y-4"
      >
        {swatches.map((swatch, index) => {
          const label = swatch.name ?? read[swatch.value as PaletteKey] ?? `Color ${index + 1}`;
          return (
            <label
              key={swatch.value}
              className="group/swatch flex min-w-0 cursor-pointer flex-col items-center gap-1.5"
            >
              <input
                type="radio"
                name={name}
                value={swatch.value}
                className="sr-only"
                onChange={() => choose?.(swatch.value)}
                {...(value !== undefined
                  ? { checked: value === swatch.value }
                  : { defaultChecked: defaultValue === swatch.value })}
              />
              <span
                aria-hidden
                data-swatch={swatch.value}
                className={cn(
                  "grid size-8 place-items-center rounded-full bg-[var(--swatch)]",
                  "ring-offset-2 ring-offset-[var(--cutout,var(--bg-canvas))] transition-[box-shadow,scale] duration-[var(--motion-base)] ease-[var(--ease-out)]",
                  "group-hover/swatch:scale-110",
                  "group-has-[:checked]/swatch:ring-2 group-has-[:checked]/swatch:ring-[var(--swatch)]",
                  "group-has-[:focus-visible]/swatch:ring-2 group-has-[:focus-visible]/swatch:ring-[var(--fg-brand)]"
                )}
                style={{ "--swatch": swatch.color } as React.CSSProperties}
              >
                <CheckIcon
                  size={14}
                  weight="bold"
                  className="text-[var(--bg-canvas)] opacity-0 transition-opacity duration-[var(--motion-fast)] group-has-[:checked]/swatch:opacity-100"
                />
              </span>
              <span className="max-w-full truncate font-mono text-mono-xs text-[var(--fg-muted)] group-has-[:checked]/swatch:text-[var(--fg-primary)]">
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
});
SwatchPicker.displayName = "SwatchPicker";

export { SwatchPicker };
export type { SwatchPickerProps };
