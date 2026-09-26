import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectHead } from "./sect-head";

describe("SectHead", () => {
  it("is an h2 named by its command, with a hidden prompt", () => {
    render(<SectHead cmd="ls ./work" id="work" />);
    const heading = screen.getByRole("heading", { level: 2, name: "ls ./work" });
    expect(heading).toHaveAttribute("id", "work");
    expect(screen.getByText("$", { exact: false })).toHaveAttribute("aria-hidden");
  });

  it("can render as a plain span", () => {
    render(<SectHead cmd="whoami" as="span" />);
    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("wraps as a row while each half stays whole", () => {
    const { container } = render(<SectHead cmd="ls" meta="4 items" />);
    expect(container.firstChild).toHaveClass("flex-wrap", "border-dashed");
    expect(screen.getByText("4 items")).toHaveClass("whitespace-nowrap");
  });
});
