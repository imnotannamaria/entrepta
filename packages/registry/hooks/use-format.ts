"use client";

import * as React from "react";
import { DEFAULT_LOCALE, DEFAULT_TIME_ZONE, type FormatOptions } from "../lib/format";

interface FormatDefaults {
  locale: string;
  currency?: string;
  timeZone: string;
}

const FormatContext = React.createContext<FormatDefaults>({
  locale: DEFAULT_LOCALE,
  timeZone: DEFAULT_TIME_ZONE,
});

interface FormatProviderProps extends FormatOptions {
  children: React.ReactNode;
}

/**
 * The locale, currency and time zone every formatting component reads, set
 * once near the root. A value left out keeps the one from further up.
 */
function FormatProvider({ locale, currency, timeZone, children }: FormatProviderProps) {
  const parent = React.useContext(FormatContext);
  const value = React.useMemo(
    () => ({
      locale: locale ?? parent.locale,
      currency: currency ?? parent.currency,
      timeZone: timeZone ?? parent.timeZone,
    }),
    [locale, currency, timeZone, parent]
  );
  return React.createElement(FormatContext.Provider, { value }, children);
}

/** The defaults in effect, with a component's own props on top. */
function useFormat(own: FormatOptions = {}): FormatDefaults {
  const defaults = React.useContext(FormatContext);
  return {
    locale: own.locale ?? defaults.locale,
    currency: own.currency ?? defaults.currency,
    timeZone: own.timeZone ?? defaults.timeZone,
  };
}

export { FormatProvider, useFormat };
export type { FormatProviderProps };
