/**
 * Numbers, money and dates, formatted the same way everywhere. Pure functions
 * with no React, so a server component, a chart axis and a test can all use
 * them. `FormatProvider` (hooks/use-format) only supplies the defaults.
 *
 * Money travels as an integer count of the currency's smallest unit. How many
 * decimals that is comes from `Intl`, never from an assumption: JPY has none
 * and BHD has three.
 *
 * Dates travel as plain `YYYY-MM-DD` strings. A `Date` carries a time, and a
 * time shifts the day across time zones.
 */

export interface FormatOptions {
  /** A BCP 47 tag. Default `"en-US"`, never the runtime's, which differs between server and browser. */
  locale?: string;
  /** ISO 4217, such as `"EUR"`. Required for money. */
  currency?: string;
  /** IANA, such as `"America/Sao_Paulo"`. Default `"UTC"`. */
  timeZone?: string;
}

export const DEFAULT_LOCALE = "en-US";
export const DEFAULT_TIME_ZONE = "UTC";

/** U+2212, the real minus. `Intl` gives a hyphen in most locales. */
export const MINUS = "−";

/* ------------------------------------------------------------------ money */

/** How many digits the currency's minor unit has: 2 for EUR, 0 for JPY, 3 for BHD. */
export function currencyDigits(currency: string): number {
  return (
    new Intl.NumberFormat("en-US", { style: "currency", currency }).resolvedOptions()
      .maximumFractionDigits ?? 2
  );
}

/** Minor units to the amount a person reads: 123456 EUR is 1234.56. */
export function fromMinor(minor: number, currency: string): number {
  return minor / 10 ** currencyDigits(currency);
}

/** An amount to integer minor units, rounded: 1234.567 EUR is 123457. */
export function toMinor(amount: number, currency: string): number {
  return Math.round(amount * 10 ** currencyDigits(currency));
}

export interface MoneyOptions extends FormatOptions {
  currency: string;
  /** `"auto"` signs negatives only; `"always"` signs both, for deltas and statements. */
  signDisplay?: "auto" | "always" | "never";
  /** `1.2K`, `R$ 1,2 mil`: for axes and small widgets. */
  compact?: boolean;
}

export type MoneyPart = { type: Intl.NumberFormatPartTypes; value: string };

function moneyFormat({ locale, currency, signDisplay = "auto", compact }: MoneyOptions) {
  return new Intl.NumberFormat(locale ?? DEFAULT_LOCALE, {
    style: "currency",
    currency,
    signDisplay: signDisplay === "always" ? "exceptZero" : signDisplay,
    ...(compact ? { notation: "compact", maximumFractionDigits: 1 } : {}),
  });
}

/**
 * The formatted pieces, so a component can style the symbol and the cents on
 * their own. The minus sign is the real one.
 */
export function moneyParts(minor: number, options: MoneyOptions): MoneyPart[] {
  return moneyFormat(options)
    .formatToParts(fromMinor(minor, options.currency))
    .map((part) => (part.type === "minusSign" ? { ...part, value: MINUS } : part));
}

/** `formatMoney(123456, { currency: "EUR", locale: "de-DE" })` is `1.234,56 €`. */
export function formatMoney(minor: number, options: MoneyOptions): string {
  return moneyParts(minor, options)
    .map((part) => part.value)
    .join("");
}

/**
 * Minor units from whatever was typed or pasted: `R$ 1.234,56`, `€1.234,56`,
 * `1,234.56`, `1234.5`, `-12`, `(12.00)`. Null when there is no number in it.
 *
 * With both separators present, the last one is the decimal point. With only
 * one kind, it groups thousands when it appears more than once, or once with
 * exactly three digits after it in a currency with fewer decimals than that
 * (`1.234` euros is a thousand, not one). Otherwise it is the decimal point.
 * Extra decimals round to the currency's.
 */
export function parseMoney(text: string, options: MoneyOptions): number | null {
  const digits = currencyDigits(options.currency);
  const negative = /[-\u2212]/.test(text) || /\(.*\d.*\)/.test(text);
  const cleaned = text.replace(/[^\d.,]/g, "");
  if (!/\d/.test(cleaned)) return null;

  const lastDot = cleaned.lastIndexOf(".");
  const lastComma = cleaned.lastIndexOf(",");
  let decimal: "." | "," | null = null;
  if (lastDot !== -1 && lastComma !== -1) {
    decimal = lastDot > lastComma ? "." : ",";
  } else if (lastDot !== -1 || lastComma !== -1) {
    const sep = lastDot !== -1 ? "." : ",";
    const count = cleaned.split(sep).length - 1;
    const after = cleaned.length - cleaned.lastIndexOf(sep) - 1;
    const groups = count > 1 || (after === 3 && digits < 3);
    decimal = groups ? null : sep;
  }

  let whole = cleaned;
  let fraction = "";
  if (decimal !== null) {
    const at = cleaned.lastIndexOf(decimal);
    whole = cleaned.slice(0, at);
    fraction = cleaned.slice(at + 1);
  }
  whole = whole.replace(/[.,]/g, "");
  const minor =
    Number(whole || "0") * 10 ** digits + Math.round(Number(`0.${fraction || "0"}`) * 10 ** digits);
  if (!Number.isSafeInteger(minor)) return null;
  return negative && minor !== 0 ? -minor : minor;
}

/** The decimal separator a locale writes: `.` for en-US, `,` for pt-BR. */
export function decimalSeparator(locale = DEFAULT_LOCALE): string {
  return (
    new Intl.NumberFormat(locale).formatToParts(1.5).find((part) => part.type === "decimal")
      ?.value ?? "."
  );
}

/* ---------------------------------------------------------------- numbers */

export interface NumberOptions extends FormatOptions {
  style?: "decimal" | "percent";
  compact?: boolean;
  signDisplay?: "auto" | "always" | "never";
  maximumFractionDigits?: number;
}

/** A plain number or a percentage (`0.12` is 12%), with the real minus sign. */
export function formatNumber(value: number, options: NumberOptions = {}): string {
  const {
    locale,
    style = "decimal",
    compact,
    signDisplay = "auto",
    maximumFractionDigits,
  } = options;
  return new Intl.NumberFormat(locale ?? DEFAULT_LOCALE, {
    style,
    signDisplay: signDisplay === "always" ? "exceptZero" : signDisplay,
    ...(compact ? { notation: "compact" } : {}),
    ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
  })
    .formatToParts(value)
    .map((part) => (part.type === "minusSign" ? MINUS : part.value))
    .join("");
}

/* ------------------------------------------------------------------ dates */

const PLAIN_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `2026-09-27`, a real day of a real month. */
export function isPlainDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = PLAIN_DATE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function toUtc(date: string): Date {
  if (!isPlainDate(date)) throw new Error(`Not a YYYY-MM-DD date: ${date}`);
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today in a time zone, which is not today in UTC for part of every day. */
export function today(timeZone = DEFAULT_TIME_ZONE, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function addDays(date: string, days: number): string {
  const utc = toUtc(date);
  utc.setUTCDate(utc.getUTCDate() + days);
  return fromUtc(utc);
}

/** Months later, clamped to the last day: Jan 31 plus one month is Feb 28 or 29. */
export function addMonths(date: string, months: number): string {
  const utc = toUtc(date);
  const day = utc.getUTCDate();
  utc.setUTCDate(1);
  utc.setUTCMonth(utc.getUTCMonth() + months);
  const last = new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth() + 1, 0)).getUTCDate();
  utc.setUTCDate(Math.min(day, last));
  return fromUtc(utc);
}

/** Negative, zero or positive, like a sort comparator. Plain dates compare as strings. */
export function compareDates(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * A plain date in words, for its locale: `Sep 27, 2026`. Formatted in UTC on
 * purpose: the day is already the day, and no zone may move it.
 */
export function formatDate(
  date: string,
  options: FormatOptions & { style?: Intl.DateTimeFormatOptions } = {}
): string {
  const style = options.style ?? { month: "short", day: "numeric", year: "numeric" };
  return new Intl.DateTimeFormat(options.locale ?? DEFAULT_LOCALE, {
    ...style,
    timeZone: "UTC",
  }).format(toUtc(date));
}

/** An instant (a sync time, a timestamp) in the reader's zone: `Sep 27, 14:05`. */
export function formatInstant(
  instant: Date | number,
  options: FormatOptions & { style?: Intl.DateTimeFormatOptions } = {}
): string {
  const style = options.style ?? {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat(options.locale ?? DEFAULT_LOCALE, {
    ...style,
    timeZone: options.timeZone ?? DEFAULT_TIME_ZONE,
  }).format(instant);
}

/** A range in words, shortened where the ends share a month or year: `Sep 1 – 30, 2026`. */
export function formatDateRange(start: string, end: string, options: FormatOptions = {}): string {
  const format = new Intl.DateTimeFormat(options.locale ?? DEFAULT_LOCALE, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return format.formatRange(toUtc(start), toUtc(end));
}
