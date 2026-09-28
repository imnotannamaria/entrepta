"use client";

import * as React from "react";
import { useFormat } from "../hooks/use-format";
import { moneyParts, parseMoney } from "../lib/format";
import { cn } from "../lib/utils";
import { inputFieldClass, inputWrapperVariants } from "./input";

interface MoneyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size" | "type"
  > {
  /** Integer minor units, or null when empty. */
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** ISO 4217. Falls back to the FormatProvider's. */
  currency?: string;
  locale?: string;
  /**
   * `cents-first` types like a cash machine: digits enter from the right, so
   * nobody has to find the decimal key. `free` takes the text as typed and
   * formats it when the field loses focus.
   */
  entry?: "cents-first" | "free";
  /** Most amounts take their sign from elsewhere, such as expense or income. */
  allowNegative?: boolean;
  /** `lg` for the main value of a form. */
  size?: "md" | "lg";
  state?: "default" | "error";
}

const MAX_DIGITS = 15;

/** The number without its currency symbol, and where the symbol goes. */
function useMoneyText(locale: string, currency: string) {
  return React.useMemo(() => {
    const sample = moneyParts(100, { locale, currency });
    const at = sample.findIndex((part) => part.type === "currency");
    const firstNumber = sample.findIndex((part) => part.type === "integer");
    const symbol = sample[at]?.value ?? currency;
    const text = (minor: number) =>
      moneyParts(minor, { locale, currency })
        .filter((part) => part.type !== "currency" && part.type !== "literal")
        .map((part) => part.value)
        .join("");
    return { symbol, symbolFirst: at < firstNumber, text };
  }, [locale, currency]);
}

function currencyName(locale: string, currency: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "currency" }).of(currency) ?? currency;
  } catch {
    return currency;
  }
}

/**
 * Money typed without a wrong comma or point. The value is an integer in the
 * currency's smallest unit, never a float. Pasting `R$ 1.234,56`, `€1,234.56`
 * or `1234.5` works in both entry modes. Put it inside a Field, which gives it
 * its label and error.
 */
const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    {
      value,
      onValueChange,
      currency: ownCurrency,
      locale: ownLocale,
      entry = "cents-first",
      allowNegative = false,
      size = "md",
      state,
      className,
      id: ownId,
      onFocus,
      onBlur,
      onPaste,
      onSelect,
      placeholder,
      "aria-describedby": describedBy,
      ...props
    },
    ref
  ) => {
    const { locale, currency } = useFormat({ locale: ownLocale, currency: ownCurrency });
    if (!currency) {
      throw new Error("MoneyInput needs a currency: pass one, or set it on a FormatProvider.");
    }
    const { symbol, symbolFirst, text } = useMoneyText(locale, currency);
    const generatedId = React.useId();
    const id = ownId ?? generatedId;
    const currencyId = `${id}-currency`;
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // In free entry, what the person typed stays as typed while they type.
    const [draft, setDraft] = React.useState<string | null>(null);
    const shown = draft ?? (value === null ? "" : text(value));

    const emit = (next: number | null) => {
      if (next === null) return onValueChange(null);
      onValueChange(allowNegative ? next : Math.abs(next));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      if (entry === "free") {
        setDraft(raw);
        emit(parseMoney(raw, { currency, locale }));
        return;
      }
      const digits = raw
        .replace(/\D/g, "")
        .replace(/^0+(?=\d)/, "")
        .slice(0, MAX_DIGITS);
      if (!digits) return emit(null);
      // Each minus typed flips the sign, so typing it again takes it away.
      const minuses = (raw.match(/[-−]/g) ?? []).length;
      const minor = Number(digits);
      emit(minuses % 2 === 1 ? -minor : minor);
    };

    // A cash machine types at the end. Keeping the caret there is what stops it
    // jumping when the text is reformatted after each key.
    const pinCaret = () => {
      const input = inputRef.current;
      if (entry !== "cents-first" || !input || input.selectionStart !== input.selectionEnd) return;
      const end = input.value.length;
      if (input.selectionStart !== end) input.setSelectionRange(end, end);
    };

    React.useLayoutEffect(() => {
      if (document.activeElement === inputRef.current) pinCaret();
    });

    return (
      <div
        className={cn(inputWrapperVariants({ size, state }), size === "lg" && "gap-2.5", className)}
      >
        {symbolFirst ? <CurrencySymbol text={symbol} /> : null}
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode={entry === "free" ? "decimal" : "numeric"}
          autoComplete="off"
          value={shown}
          placeholder={placeholder ?? text(0)}
          aria-describedby={[describedBy, currencyId].filter(Boolean).join(" ")}
          onChange={handleChange}
          onFocus={(event) => {
            if (entry === "free") setDraft(value === null ? "" : text(value));
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setDraft(null);
            onBlur?.(event);
          }}
          onSelect={(event) => {
            pinCaret();
            onSelect?.(event);
          }}
          onPaste={(event) => {
            onPaste?.(event);
            if (event.defaultPrevented) return;
            const parsed = parseMoney(event.clipboardData.getData("text"), { currency, locale });
            if (parsed === null) return;
            event.preventDefault();
            const next = allowNegative ? parsed : Math.abs(parsed);
            if (entry === "free") setDraft(text(next));
            emit(next);
          }}
          className={cn(
            inputFieldClass,
            "tabular-nums",
            size === "lg" && "text-heading-md",
            !symbolFirst && "text-right"
          )}
          {...props}
        />
        {symbolFirst ? null : <CurrencySymbol text={symbol} />}
        <span id={currencyId} className="sr-only">
          {currencyName(locale, currency)}
        </span>
      </div>
    );
  }
);
MoneyInput.displayName = "MoneyInput";

function CurrencySymbol({ text }: { text: string }) {
  return (
    <span aria-hidden className="shrink-0 select-none font-mono text-[var(--fg-muted)]">
      {text}
    </span>
  );
}

export { MoneyInput };
export type { MoneyInputProps };
