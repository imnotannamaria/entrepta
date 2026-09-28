import { describe, expect, it } from "vitest";
import {
  MINUS,
  addDays,
  addMonths,
  compareDates,
  currencyDigits,
  decimalSeparator,
  formatDate,
  formatDateRange,
  formatInstant,
  formatMoney,
  formatMonth,
  formatNumber,
  fromLocalDate,
  fromMinor,
  isPlainDate,
  moneyParts,
  parseMoney,
  toLocalDate,
  toMinor,
  today,
  weekStart,
} from "./format";

// Intl puts narrow no-break spaces in some locales; compare on plain spaces.
const plain = (text: string) => text.replace(/[\u00a0\u202f\u2009]/g, " ");

describe("money", () => {
  it("knows each currency's minor unit from Intl", () => {
    expect(currencyDigits("EUR")).toBe(2);
    expect(currencyDigits("JPY")).toBe(0);
    expect(currencyDigits("BHD")).toBe(3);
  });

  it("converts between minor units and amounts", () => {
    expect(fromMinor(123456, "EUR")).toBe(1234.56);
    expect(fromMinor(1234, "JPY")).toBe(1234);
    expect(toMinor(1234.567, "EUR")).toBe(123457);
    expect(toMinor(1.2345, "BHD")).toBe(1235);
  });

  it("formats in the locale it is given, never the runtime's", () => {
    expect(plain(formatMoney(123456, { currency: "BRL", locale: "pt-BR" }))).toBe("R$ 1.234,56");
    expect(plain(formatMoney(123456, { currency: "EUR", locale: "de-DE" }))).toBe("1.234,56 €");
    expect(formatMoney(123456, { currency: "USD" })).toBe("$1,234.56");
    expect(formatMoney(1234, { currency: "JPY", locale: "en-US" })).toBe("¥1,234");
  });

  it("writes the real minus sign, and signs gains too when asked", () => {
    expect(formatMoney(-500, { currency: "USD" })).toBe(`${MINUS}$5.00`);
    expect(formatMoney(500, { currency: "USD", signDisplay: "always" })).toBe("+$5.00");
    expect(formatMoney(0, { currency: "USD", signDisplay: "always" })).toBe("$0.00");
  });

  it("compacts for axes and small widgets", () => {
    expect(plain(formatMoney(110000, { currency: "BRL", locale: "pt-BR", compact: true }))).toBe(
      "R$ 1,1 mil"
    );
    expect(formatMoney(123456789, { currency: "USD", compact: true })).toBe("$1.2M");
  });

  it("hands over the parts, so the symbol and the cents can be styled", () => {
    const parts = moneyParts(-123456, { currency: "BRL", locale: "pt-BR" });
    expect(parts.find((p) => p.type === "currency")?.value).toBe("R$");
    expect(parts.find((p) => p.type === "fraction")?.value).toBe("56");
    expect(parts.find((p) => p.type === "minusSign")?.value).toBe(MINUS);
  });
});

describe("parseMoney", () => {
  const brl = { currency: "BRL", locale: "pt-BR" };
  const usd = { currency: "USD" };

  it.each([
    ["R$ 1.234,56", 123456],
    ["1.234,56", 123456],
    ["1,234.56", 123456],
    ["€1.234,56", 123456],
    ["1234,5", 123450],
    ["1234.5", 123450],
    ["1234", 123400],
    ["1.234", 123400],
    ["1,234", 123400],
    ["1.234.567", 123456700],
    ["12,3456", 1235],
    ["0,05", 5],
  ])("reads %s as %i minor units", (text, minor) => {
    expect(parseMoney(text, brl)).toBe(minor);
    expect(parseMoney(text, usd)).toBe(minor);
  });

  it("reads a negative from a minus, a real minus or accounting parentheses", () => {
    expect(parseMoney("-12", usd)).toBe(-1200);
    expect(parseMoney(`${MINUS}R$ 12,00`, brl)).toBe(-1200);
    expect(parseMoney("(12.00)", usd)).toBe(-1200);
  });

  it("follows the currency's decimals", () => {
    expect(parseMoney("1.234", { currency: "BHD" })).toBe(1234);
    expect(parseMoney("1,234", { currency: "JPY" })).toBe(1234);
    expect(parseMoney("12.5", { currency: "JPY" })).toBe(13);
  });

  it("returns null when nothing in it is a number", () => {
    expect(parseMoney("", usd)).toBeNull();
    expect(parseMoney("R$", brl)).toBeNull();
    expect(parseMoney("abc", usd)).toBeNull();
  });
});

describe("numbers", () => {
  it("formats percentages and signs with the real minus", () => {
    expect(formatNumber(0.125, { style: "percent", maximumFractionDigits: 1 })).toBe("12.5%");
    expect(formatNumber(-0.04, { style: "percent" })).toBe(`${MINUS}4%`);
    expect(formatNumber(0.04, { style: "percent", signDisplay: "always" })).toBe("+4%");
    expect(formatNumber(8200, { locale: "pt-BR" })).toBe("8.200");
  });

  it("reads the locale's decimal separator", () => {
    expect(decimalSeparator("en-US")).toBe(".");
    expect(decimalSeparator("pt-BR")).toBe(",");
  });
});

describe("plain dates", () => {
  it("accepts only real days in YYYY-MM-DD", () => {
    expect(isPlainDate("2026-09-27")).toBe(true);
    expect(isPlainDate("2028-02-29")).toBe(true);
    expect(isPlainDate("2026-02-29")).toBe(false);
    expect(isPlainDate("2026-9-27")).toBe(false);
    expect(isPlainDate("2026-09-27T00:00:00Z")).toBe(false);
    expect(isPlainDate(20260927)).toBe(false);
  });

  it("gives today in the zone asked for, not in UTC", () => {
    // 02:30 UTC on the 28th is still the 27th in São Paulo, and the 28th in Tokyo
    const now = new Date("2026-09-28T02:30:00Z");
    expect(today("America/Sao_Paulo", now)).toBe("2026-09-27");
    expect(today("Asia/Tokyo", now)).toBe("2026-09-28");
    expect(today("UTC", now)).toBe("2026-09-28");
  });

  it("moves by days and months, clamping to the month's last day", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2028-01-31", 1)).toBe("2028-02-29");
    expect(addMonths("2026-11-15", 3)).toBe("2027-02-15");
  });

  it("compares as a sort comparator", () => {
    expect(["2026-10-01", "2026-09-30"].sort(compareDates)).toEqual(["2026-09-30", "2026-10-01"]);
  });

  it("writes a day without letting a zone move it", () => {
    expect(formatDate("2026-09-27")).toBe("Sep 27, 2026");
    expect(formatDate("2026-09-27", { locale: "pt-BR" })).toBe("27 de set. de 2026");
    expect(formatDate("2026-01-01", { timeZone: "Pacific/Honolulu" })).toBe("Jan 1, 2026");
  });

  it("writes an instant in the reader's zone", () => {
    const at = new Date("2026-09-28T02:30:00Z");
    expect(formatInstant(at, { timeZone: "America/Sao_Paulo" })).toBe("Sep 27, 11:30 PM");
  });

  it("shortens a range that shares a month", () => {
    expect(plain(formatDateRange("2026-09-01", "2026-09-30"))).toBe("Sep 1 – 30, 2026");
  });

  it("refuses a date with a time", () => {
    expect(() => addDays("2026-09-27T10:00", 1)).toThrow("YYYY-MM-DD");
  });
});

describe("bridges to date pickers", () => {
  it("round-trips a plain date through local midnight", () => {
    for (const date of ["2026-01-01", "2026-03-08", "2026-10-18", "2028-02-29"]) {
      const local = toLocalDate(date);
      expect(local.getHours()).toBe(0);
      expect(fromLocalDate(local)).toBe(date);
    }
  });

  it("knows the first day of the week by locale", () => {
    expect(weekStart("en-US")).toBe(0);
    expect(weekStart("de-DE")).toBe(1);
    expect(weekStart("pt-BR")).toBe(0);
  });

  it("writes a month in words, from a month or a day", () => {
    expect(formatMonth("2026-09")).toBe("September 2026");
    expect(formatMonth("2026-09-27", { locale: "pt-BR" })).toBe("setembro de 2026");
    expect(formatMonth("2026-09", { month: "short" })).toBe("Sep 2026");
  });
});
