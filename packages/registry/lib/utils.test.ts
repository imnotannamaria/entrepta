import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", undefined, false, null, "bar")).toBe("foo bar");
  });

  it("resolves tailwind conflicts, last class wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-mono-sm", "text-mono-md")).toBe("text-mono-md");
  });

  it("handles conditional object syntax from clsx", () => {
    expect(cn({ "font-bold": true, italic: false })).toBe("font-bold");
  });

  it("handles array syntax", () => {
    expect(cn(["text-white", "bg-black"])).toBe("text-white bg-black");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("handles complex merge: overrides earlier responsive variant", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("keeps a scale size alongside a text color", () => {
    expect(cn("text-mono-md", "text-[var(--fg-secondary)]")).toBe(
      "text-mono-md text-[var(--fg-secondary)]"
    );
    expect(cn("text-[var(--fg-secondary)]", "text-mono-md")).toBe(
      "text-[var(--fg-secondary)] text-mono-md"
    );
  });

  it("lets a scale size override a Tailwind default step", () => {
    expect(cn("text-xs", "text-mono-xs")).toBe("text-mono-xs");
  });

  it("keeps a leading that comes before a font size", () => {
    expect(cn("leading-none", "text-mono-sm")).toBe("leading-none text-mono-sm");
  });
});
