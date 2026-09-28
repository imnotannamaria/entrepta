import { FileMdIcon, HouseLineIcon } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("takes an icon as an element, for a server file", () => {
    render(<Sidebar items={[{ ...ITEMS[0], icon: <HouseLineIcon data-testid="glyph" /> }]} />);
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
  });
});

const GROUPS = [
  { title: "Money", items: ITEMS },
  {
    title: "Settings",
    items: [{ id: "keys", label: "API keys", href: "/keys", icon: FileMdIcon }],
  },
];

describe("Sidebar, labeled", () => {
  afterEach(() => window.localStorage.clear());

  it("shows each label and names each group by its title", () => {
    render(<Sidebar variant="labeled" groups={GROUPS} active="home" />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveTextContent("Home");
    expect(screen.getByRole("list", { name: "Money" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Settings" })).toBeInTheDocument();
  });

  it("puts the current item on a raised row, never a bar on its edge", () => {
    render(<Sidebar variant="labeled" groups={GROUPS} active="blog" />);
    const current = screen.getByRole("link", { name: "Blog" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveClass("sheen", "bg-[var(--bg-card-hover)]");
    expect(current.className).not.toMatch(/border-l|before:/);
  });

  it("renders the search slot and the footer", () => {
    render(
      <Sidebar
        variant="labeled"
        items={ITEMS}
        search={<input aria-label="Search" />}
        footer={({ collapsed }) => <span>{collapsed ? "A" : "Anna"}</span>}
      />
    );
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByText("Anna")).toBeInTheDocument();
  });

  it("folds to the rail, keeps the group titles for screen readers, and stores the choice", async () => {
    const onCollapsedChange = vi.fn();
    const { container } = render(
      <Sidebar
        variant="labeled"
        groups={GROUPS}
        collapsible
        search={<input aria-label="Search" />}
        onCollapsedChange={onCollapsedChange}
      />
    );
    const toggle = screen.getByRole("button", { name: "Collapse sidebar" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(toggle);

    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(container.firstChild).toHaveClass("w-14");
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveTextContent("Home");
    expect(screen.getByRole("list", { name: "Money" })).toBeInTheDocument();
    expect(window.localStorage.getItem("entrepta:sidebar")).toBe("1");
  });

  it("opens folded when the stored choice says so", () => {
    window.localStorage.setItem("entrepta:sidebar", "1");
    const { container } = render(<Sidebar variant="labeled" items={ITEMS} collapsible />);
    expect(container.firstChild).toHaveClass("w-14");
  });

  it("still works when storage throws", async () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { container } = render(<Sidebar variant="labeled" items={ITEMS} collapsible />);
    expect(container.firstChild).toHaveClass("w-60");
    await userEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(container.firstChild).toHaveClass("w-14");
    spy.mockRestore();
    set.mockRestore();
  });

  it("ignores a stored choice when it is not collapsible", () => {
    window.localStorage.setItem("entrepta:sidebar", "1");
    const { container } = render(<Sidebar variant="labeled" items={ITEMS} />);
    expect(container.firstChild).toHaveClass("w-60");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("takes items with no icon, labeled; the rail shows their first letter", () => {
    const text = [{ id: "a", label: "Accordion", href: "/a" }];
    const { rerender } = render(<Sidebar variant="labeled" items={text} />);
    expect(screen.getByRole("link", { name: "Accordion" })).toHaveTextContent("Accordion");
    rerender(<Sidebar items={text} />);
    expect(screen.getByRole("link", { name: "Accordion" })).toHaveTextContent("A");
  });
});

describe("Sidebar, keeping the current item in view", () => {
  const MANY = Array.from({ length: 30 }, (_, i) => ({
    id: `p${i}`,
    label: `Page ${i}`,
    href: `/${i}`,
  }));

  it("centers it when the page loads, scrolling the list and not the page", () => {
    const scrollTo = vi.fn();
    Element.prototype.scrollTo = scrollTo;
    // measured before the first effect runs
    const spy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      if (this.tagName === "NAV") return { top: 0, bottom: 100, height: 100 } as DOMRect;
      return { top: 300, bottom: 332, height: 32 } as DOMRect;
    });
    render(<Sidebar variant="labeled" items={MANY} active="p20" />);
    expect(scrollTo).toHaveBeenCalledWith({ top: 266, behavior: "auto" });
    spy.mockRestore();
  });

  it("leaves the list alone when the current item already shows", () => {
    const scrollTo = vi.fn();
    Element.prototype.scrollTo = scrollTo;
    const spy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      if (this.tagName === "NAV") return { top: 0, bottom: 100, height: 100 } as DOMRect;
      return { top: 20, bottom: 52, height: 32 } as DOMRect;
    });
    render(<Sidebar variant="labeled" items={MANY} active="p1" />);
    expect(scrollTo).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("brings a new current item in, smoothly, when it changes", () => {
    const scrollTo = vi.fn();
    Element.prototype.scrollTo = scrollTo;
    const spy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
      this: Element
    ) {
      if (this.tagName === "NAV") return { top: 0, bottom: 100, height: 100 } as DOMRect;
      return { top: 400, bottom: 432, height: 32 } as DOMRect;
    });
    const { rerender } = render(<Sidebar variant="labeled" items={MANY} active="p1" />);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 366, behavior: "auto" });
    rerender(<Sidebar variant="labeled" items={MANY} active="p27" />);
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 340, behavior: "smooth" });
    spy.mockRestore();
  });
});
