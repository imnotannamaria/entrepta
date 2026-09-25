import { FileMdIcon, HouseLineIcon } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./sidebar";

const ITEMS = [
  { id: "home", label: "Home", href: "/", icon: HouseLineIcon },
  { id: "blog", label: "Blog", href: "/blog", icon: FileMdIcon },
];

describe("Sidebar", () => {
  it("is a named nav of labelled links", () => {
    render(<Sidebar items={ITEMS} active="home" />);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });

  it("marks the active item as the current page, with one travelling diamond", () => {
    const { container } = render(<Sidebar items={ITEMS} active="blog" />);
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    const marks = container.querySelectorAll("[data-sidebar-mark]");
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("renders through your router's link component", () => {
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >((props, ref) => <a ref={ref} data-router {...props} />);
    render(<Sidebar items={ITEMS} linkComponent={RouterLink} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-router");
  });

  it("is 56px wide", () => {
    const { container } = render(<Sidebar items={ITEMS} />);
    expect(container.firstChild).toHaveClass("w-14");
  });
});
