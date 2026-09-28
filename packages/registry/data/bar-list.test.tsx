import { render, screen, within } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { BarList } from "./bar-list";

const text = (el: Element | null) => el?.textContent?.replace(/[  ]/g, " ");

const PAGES = [
  { label: "/docs/components/data-table", value: 120 },
  { label: "/", value: 480 },
  { label: "/docs/installation", value: 240 },
  { label: "/docs/themes", value: 60 },
  { label: "/docs/cli", value: 30 },
];

describe("BarList", () => {
  it("ranks largest first, each bar as long as its share of the largest", () => {
    const { container } = render(<BarList items={PAGES} />);
    const rows = screen.getAllByRole("listitem");
    expect(rows[0]).toHaveTextContent("/480");
    const bars = container.querySelectorAll<HTMLElement>("span[aria-hidden]");
    expect(bars[0].style.width).toBe("100%");
    expect(bars[1].style.width).toBe("50%");
  });

  it("keeps the whole label, wrapping instead of cutting it", () => {
    render(<BarList items={PAGES} />);
    const label = screen.getByText("/docs/components/data-table");
    expect(label).toHaveClass("break-words");
    expect(label.className).not.toMatch(/truncate/);
  });

  it("shows the first few and adds up the rest", () => {
    render(<BarList items={PAGES} max={2} showOthers />);
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    expect(rows[2]).toHaveTextContent("Others (3)210");
  });

  it("formats money through Amount", () => {
    render(<BarList items={[{ label: "rent", value: 180000 }]} format="money" currency="USD" />);
    expect(text(screen.getByRole("listitem"))).toContain("$1,800.00");
  });

  it("links a row through your router", () => {
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >((props, ref) => <a ref={ref} data-router {...props} />);
    render(
      <BarList items={[{ label: "home", value: 3, href: "/home" }]} linkComponent={RouterLink} />
    );
    const link = within(screen.getByRole("listitem")).getByRole("link");
    expect(link).toHaveAttribute("href", "/home");
    expect(link).toHaveAttribute("data-router");
  });

  it("colors each bar from the palette", () => {
    const { container } = render(<BarList items={[{ label: "a", value: 1, color: "chart-4" }]} />);
    const bar = container.querySelector<HTMLElement>("span[aria-hidden]");
    expect(bar?.style.getPropertyValue("--bar")).toBe("var(--chart-4)");
  });
});
