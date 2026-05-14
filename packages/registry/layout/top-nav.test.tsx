import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  TopNav,
  TopNavBreadcrumb,
  TopNavLink,
  TopNavLogo,
  TopNavLogoMark,
  TopNavMenu,
  TopNavSeparator,
} from "./top-nav";

describe("TopNav", () => {
  it("renders as a nav element", () => {
    render(<TopNav />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders left slot content", () => {
    render(<TopNav left={<span>Logo</span>} />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("renders right slot content", () => {
    render(<TopNav right={<button type="button">Sign in</button>} />);
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders children as left content when left prop is not provided", () => {
    render(<TopNav>child content</TopNav>);
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<TopNav ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe("TopNavLogo", () => {
  it("renders children", () => {
    render(<TopNavLogo>entrepta</TopNavLogo>);
    expect(screen.getByText("entrepta")).toBeInTheDocument();
  });
});

describe("TopNavLogoMark", () => {
  it("renders the letter as serif italic on a brand tile", () => {
    const { container } = render(<TopNavLogoMark>e</TopNavLogoMark>);
    expect(screen.getByText("e")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-[var(--fg-brand)]");
    expect(container.firstChild).toHaveClass("font-serif");
    expect(container.firstChild).toHaveClass("italic");
  });
});

describe("TopNavBreadcrumb", () => {
  it("renders breadcrumb items and styles .here as primary", () => {
    render(
      <TopNavBreadcrumb>
        <span>docs</span>
        <TopNavSeparator />
        <span className="here">button</span>
      </TopNavBreadcrumb>
    );
    expect(screen.getByText("docs")).toBeInTheDocument();
    expect(screen.getByText("button")).toBeInTheDocument();
  });
});

describe("TopNavSeparator", () => {
  it("renders separator character", () => {
    render(<TopNavSeparator />);
    expect(screen.getByText("/")).toBeInTheDocument();
  });
});

describe("TopNavMenu", () => {
  it("renders a nav with uppercase mono children", () => {
    const { container } = render(
      <TopNavMenu>
        <TopNavLink href="/">home</TopNavLink>
      </TopNavMenu>
    );
    expect(container.firstChild).toHaveClass("uppercase");
    expect(screen.getByText("home")).toBeInTheDocument();
  });
});

describe("TopNavLink", () => {
  it("marks active link with data-state and primary text", () => {
    render(
      <TopNavLink href="/" active>
        home
      </TopNavLink>
    );
    const link = screen.getByText("home").closest("a");
    expect(link).toHaveAttribute("data-state", "active");
    expect(link).toHaveClass("text-[var(--fg-primary)]");
  });

  it("renders external indicator and target attrs", () => {
    render(
      <TopNavLink href="https://github.com" external>
        github
      </TopNavLink>
    );
    const link = screen.getByText("github").closest("a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("↗")).toBeInTheDocument();
  });
});
