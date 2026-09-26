import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when loading prop is set", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows spinner icon when loading", () => {
    const { container } = render(<Button loading>Loading</Button>);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("marks the button with data-loading when loading", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-loading", "true");
  });

  it("applies primary variant class", () => {
    const { container } = render(<Button>Primary</Button>);
    expect(container.firstChild).toHaveClass("bg-[var(--fg-brand)]");
    expect(container.firstChild).toHaveClass("text-[var(--fg-on-brand)]");
  });

  it("exports the variants from a module without a client boundary", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const source = fs.readFileSync(path.join(__dirname, "button-variants.ts"), "utf8");
    expect(source).not.toMatch(/^["']use client["']/m);
  });

  it("applies secondary variant class", () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    expect(container.firstChild).toHaveClass("bg-transparent");
    expect(container.firstChild).toHaveClass("border-[var(--border-strong)]");
  });

  it("applies ghost variant class", () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    expect(container.firstChild).toHaveClass("bg-transparent");
    expect(container.firstChild).toHaveClass("text-[var(--fg-secondary)]");
  });

  it("applies command variant class", () => {
    const { container } = render(<Button variant="command">npx @entrepta/cli@latest init</Button>);
    expect(container.firstChild).toHaveClass("sheen", "bg-[var(--bg-overlay)]");
    expect(container.firstChild).toHaveClass("border-[var(--border-strong)]");
  });

  it("applies sm size class", () => {
    const { container } = render(<Button size="sm">Small</Button>);
    expect(container.firstChild).toHaveClass("h-8");
  });

  it("applies md size class", () => {
    const { container } = render(<Button size="md">Medium</Button>);
    expect(container.firstChild).toHaveClass("h-10");
  });

  it("applies lg size class", () => {
    const { container } = render(<Button size="lg">Large</Button>);
    expect(container.firstChild).toHaveClass("h-12");
  });

  it("forwards ref to button element", () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className", () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("has square icon sizes, named by aria-label", () => {
    render(
      <Button size="icon-md" variant="ghost" aria-label="Settings">
        <svg aria-hidden />
      </Button>
    );
    const button = screen.getByRole("button", { name: "Settings" });
    expect(button).toHaveClass("size-10");
    expect(button).not.toHaveClass("px-4");
  });

  it("keeps an icon beside the label from shrinking", () => {
    const { container } = render(
      <Button>
        <svg aria-hidden /> deploy
      </Button>
    );
    expect(container.firstChild).toHaveClass("[&_svg]:shrink-0");
  });
});
