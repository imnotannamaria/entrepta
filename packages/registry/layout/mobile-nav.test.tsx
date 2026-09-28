import {
  ChartBarIcon,
  GearIcon,
  HouseLineIcon,
  ListIcon,
  TagIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { MobileNav } from "./mobile-nav";

const FOUR = [
  { id: "home", label: "Home", href: "/", icon: HouseLineIcon },
  { id: "list", label: "Activity", href: "/activity", icon: ListIcon },
  { id: "charts", label: "Reports", href: "/reports", icon: ChartBarIcon },
  { id: "wallet", label: "Accounts", href: "/accounts", icon: WalletIcon },
];
const SIX = [
  ...FOUR,
  { id: "tags", label: "Categories", href: "/categories", icon: TagIcon },
  { id: "settings", label: "Settings", href: "/settings", icon: GearIcon },
];

describe("MobileNav", () => {
  it("is a named nav with up to four links and no More when they fit", () => {
    render(<MobileNav items={FOUR} active="home" />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).getAllByRole("link")).toHaveLength(4);
    expect(screen.queryByRole("button", { name: "More" })).not.toBeInTheDocument();
  });

  it("marks the current page with one diamond", () => {
    const { container } = render(<MobileNav items={FOUR} active="charts" />);
    expect(screen.getByRole("link", { name: "Reports" })).toHaveAttribute("aria-current", "page");
    expect(container.querySelectorAll("[data-mobile-nav-mark]")).toHaveLength(1);
  });

  it("puts the fifth destination and on in a More sheet", async () => {
    render(<MobileNav items={SIX} active="home" />);
    expect(screen.getAllByRole("link")).toHaveLength(4);
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    const sheet = screen.getByRole("dialog", { name: "More" });
    expect(within(sheet).getByRole("link", { name: "Categories" })).toHaveAttribute(
      "href",
      "/categories"
    );
    expect(within(sheet).getByRole("link", { name: "Settings" })).toBeInTheDocument();
  });

  it("closes the sheet when a destination in it is chosen", async () => {
    // hash links, since jsdom cannot navigate
    render(<MobileNav items={SIX.map((item) => ({ ...item, href: `#${item.id}` }))} />);
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    await userEvent.click(screen.getByRole("link", { name: "Settings" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the sheet through a router's link, which prevents the click's default", async () => {
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >(({ onClick, href, ...props }, ref) => (
      <a
        ref={ref}
        href={href}
        {...props}
        onClick={(event) => {
          event.preventDefault();
          onClick?.(event);
        }}
      />
    ));
    render(<MobileNav items={SIX} linkComponent={RouterLink} />);
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    await userEvent.click(screen.getByRole("link", { name: "Settings" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves the diamond to More when the current page is inside it", () => {
    const { container } = render(<MobileNav items={SIX} active="settings" />);
    const more = screen.getByRole("button", { name: "More" });
    expect(more.querySelector("[data-mobile-nav-mark]")).not.toBeNull();
    expect(container.querySelectorAll("[data-mobile-nav-mark]")).toHaveLength(1);
  });

  it("shows More for extra content even with four destinations", async () => {
    render(<MobileNav items={FOUR} more={<button type="button">Sign out</button>} />);
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("is fixed to the bottom by default and clears the home indicator", () => {
    render(<MobileNav items={FOUR} />);
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("fixed", "bottom-0", "pb-[env(safe-area-inset-bottom)]");
  });

  it("renders through your router's link component", () => {
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >((props, ref) => <a ref={ref} data-router {...props} />);
    render(<MobileNav items={FOUR} linkComponent={RouterLink} position="static" />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-router");
    expect(screen.getByRole("navigation")).not.toHaveClass("fixed");
  });

  it("shows the destinations in More as tiles, the current one in the brand", async () => {
    render(<MobileNav items={SIX} active="settings" />);
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    const settings = screen.getByRole("link", { name: "Settings" });
    expect(settings.querySelector("span[aria-hidden='true']")).toHaveClass(
      "bg-[var(--bg-surface-brand)]"
    );
  });

  it("renders the sheet inside a container of your choice", async () => {
    const frame = document.createElement("div");
    document.body.append(frame);
    render(<MobileNav items={SIX} container={frame} />);
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    expect(frame).toContainElement(screen.getByRole("dialog"));
    frame.remove();
  });
});
