import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopNav, TopNavBreadcrumb, TopNavLogo, TopNavSeparator } from "./top-nav";

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
    render(<TopNavLogo>◆ entrepta</TopNavLogo>);
    expect(screen.getByText("◆ entrepta")).toBeInTheDocument();
  });
});

describe("TopNavBreadcrumb", () => {
  it("renders breadcrumb items", () => {
    render(
      <TopNavBreadcrumb>
        <span>docs</span>
        <TopNavSeparator />
        <span>button</span>
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
