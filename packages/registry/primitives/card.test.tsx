import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTerminalBar,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies default variant class", () => {
    const { container } = render(<Card>default</Card>);
    expect(container.firstChild).toHaveClass("bg-[var(--bg-surface)]");
  });

  it("applies featured variant class", () => {
    const { container } = render(<Card variant="featured">featured</Card>);
    expect(container.firstChild).toHaveClass("bg-[var(--bg-surface-brand)]");
  });

  it("applies terminal variant class", () => {
    const { container } = render(<Card variant="terminal">terminal</Card>);
    expect(container.firstChild).toHaveClass("bg-[var(--bg-canvas)]");
  });

  it("applies data variant class", () => {
    const { container } = render(<Card variant="data">data</Card>);
    expect(container.firstChild).toHaveClass("bg-[var(--bg-surface-elevated)]");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Card ref={ref}>ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("Card sub-components", () => {
  it("CardHeader renders children", () => {
    render(<CardHeader>header</CardHeader>);
    expect(screen.getByText("header")).toBeInTheDocument();
  });

  it("CardTitle renders as h3", () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByRole("heading", { level: 3, name: "My Title" })).toBeInTheDocument();
  });

  it("CardDescription renders children", () => {
    render(<CardDescription>desc text</CardDescription>);
    expect(screen.getByText("desc text")).toBeInTheDocument();
  });

  it("CardContent renders children", () => {
    render(<CardContent>body</CardContent>);
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("CardFooter renders children", () => {
    render(<CardFooter>footer</CardFooter>);
    expect(screen.getByText("footer")).toBeInTheDocument();
  });

  it("CardTerminalBar renders macOS dots and optional label", () => {
    const { container } = render(<CardTerminalBar>~/project</CardTerminalBar>);
    const dots = container.querySelectorAll(".rounded-full");
    expect(dots.length).toBe(3);
    expect(screen.getByText("~/project")).toBeInTheDocument();
  });
});
