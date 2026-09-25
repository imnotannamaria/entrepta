import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./kbd";

describe("Kbd", () => {
  it("renders a kbd element with its keys", () => {
    render(<Kbd>⌘K</Kbd>);
    const kbd = screen.getByText("⌘K");
    expect(kbd.tagName).toBe("KBD");
  });

  it("is a bordered chip by default and bare when plain", () => {
    const { rerender } = render(<Kbd>esc</Kbd>);
    expect(screen.getByText("esc")).toHaveClass("border", "h-5");
    rerender(<Kbd variant="plain">esc</Kbd>);
    expect(screen.getByText("esc")).not.toHaveClass("border");
  });

  it("takes the brand ink inside a highlighted menu row", () => {
    render(<Kbd>⌘P</Kbd>);
    expect(screen.getByText("⌘P")).toHaveClass(
      "group-data-[highlighted]/item:text-[var(--fg-brand-text)]",
      "group-data-[selected=true]/item:text-[var(--fg-brand-text)]"
    );
  });
});
