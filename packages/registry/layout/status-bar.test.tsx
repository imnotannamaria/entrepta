import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBar, StatusBarItem } from "./status-bar";

describe("StatusBar", () => {
  it("renders left slot content", () => {
    render(<StatusBar left={<span>main</span>} />);
    expect(screen.getByText("main")).toBeInTheDocument();
  });

  it("renders right slot content", () => {
    render(<StatusBar right={<span>TypeScript</span>} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders children as left content when left prop is not provided", () => {
    render(<StatusBar>fallback</StatusBar>);
    expect(screen.getByText("fallback")).toBeInTheDocument();
  });

  it("renders both left and right slots", () => {
    render(
      <StatusBar
        left={<StatusBarItem>branch</StatusBarItem>}
        right={<StatusBarItem>UTF-8</StatusBarItem>}
      />
    );
    expect(screen.getByText("branch")).toBeInTheDocument();
    expect(screen.getByText("UTF-8")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<StatusBar ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("StatusBarItem", () => {
  it("renders children", () => {
    render(<StatusBarItem>label</StatusBarItem>);
    expect(screen.getByText("label")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const { container } = render(
      <StatusBarItem icon={<svg data-testid="icon" />}>label</StatusBarItem>
    );
    expect(container.querySelector("[data-testid='icon']")).toBeInTheDocument();
  });
});
