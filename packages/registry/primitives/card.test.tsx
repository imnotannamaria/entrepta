import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardComment,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTerminalBar,
  CardTerminalBody,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("sits on the card surface and lights its border on hover by default", () => {
    const { container } = render(<Card>default</Card>);
    expect(container.firstChild).toHaveClass(
      "bg-[var(--bg-card)]",
      "border-[var(--border-subtle)]",
      "hover:border-[var(--border-strong)]",
      "hover:bg-[var(--bg-card-hover)]"
    );
  });

  it("transitions the lift through translate, leaving transform to Motion", () => {
    const { container } = render(<Card>card</Card>);
    const transition = [...(container.firstChild as HTMLElement).classList].find((c) =>
      c.startsWith("transition-[")
    );
    expect(transition).toContain("translate");
    expect(transition).not.toContain("transform");
  });

  it("featured sits on the brand tint and lifts on hover", () => {
    const { container } = render(<Card variant="featured">featured</Card>);
    expect(container.firstChild).toHaveClass(
      "bg-[var(--bg-surface-brand)]",
      "border-[var(--border-brand)]",
      "hover:border-[var(--border-brand-strong)]",
      "hover:-translate-y-0.5",
      "hover:shadow-[var(--shadow-lift-brand)]"
    );
  });

  it("terminal stays dark, sets its own ink and drops the padding", () => {
    const { container } = render(<Card variant="terminal">terminal</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute("data-surface", "dark");
    expect(card).toHaveClass("p-0", "max-sm:p-0", "text-[var(--fg-primary)]");
    expect(card).not.toHaveClass("p-6");
  });

  it("terminal drops the padding at every size", () => {
    const { container } = render(
      <Card variant="terminal" size="xl">
        terminal
      </Card>
    );
    expect(container.firstChild).toHaveClass("p-0");
    expect(container.firstChild).not.toHaveClass("pt-14");
  });

  it("uses md by default: 24px padding, 20px below 640px", () => {
    const { container } = render(<Card>md</Card>);
    expect(container.firstChild).toHaveClass("p-6", "max-sm:p-5", "gap-4");
  });

  it("tightens the box at sm", () => {
    const { container } = render(<Card size="sm">sm</Card>);
    expect(container.firstChild).toHaveClass("p-3.5", "gap-2.5");
  });

  it("opens up at xl with the larger radius", () => {
    const { container } = render(<Card size="xl">xl</Card>);
    expect(container.firstChild).toHaveClass("rounded-[var(--radius-xl)]", "pt-14", "px-12");
  });

  it("clips what overflows", () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstChild).toHaveClass("overflow-hidden");
  });

  it("applies data variant class with backdrop blur", () => {
    const { container } = render(<Card variant="data">data</Card>);
    expect(container.firstChild).toHaveClass("backdrop-blur-sm");
  });

  it("applies large radius across variants", () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstChild).toHaveClass("rounded-[var(--radius-lg)]");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Card ref={ref}>ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("Card sub-components", () => {
  it("CardHeader renders children with uppercase mono styling", () => {
    const { container } = render(<CardHeader>header</CardHeader>);
    expect(screen.getByText("header")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("uppercase", "font-mono", "text-mono-sm");
  });

  it("CardHeader wraps as a row while each half stays on one line", () => {
    const { container } = render(
      <CardHeader>
        <CardLabel>featured post</CardLabel>
        <CardMeta>june 8, 2026 · 3 min</CardMeta>
      </CardHeader>
    );
    expect(container.firstChild).toHaveClass("flex-wrap", "gap-x-3", "gap-y-1");
    expect(screen.getByText("featured post").closest("span")).toHaveClass("whitespace-nowrap");
    expect(screen.getByText("june 8, 2026 · 3 min")).toHaveClass("whitespace-nowrap");
  });

  it("CardLabel renders a hidden diamond before children", () => {
    render(<CardLabel>resend-ecommerce</CardLabel>);
    expect(screen.getByText("resend-ecommerce")).toBeInTheDocument();
    expect(screen.getByText("◆")).toHaveAttribute("aria-hidden", "true");
  });

  it("CardLabel can be a heading without heading styles", () => {
    render(<CardLabel as="h2">projects</CardLabel>);
    const heading = screen.getByRole("heading", { level: 2, name: "projects" });
    expect(heading).toHaveClass("m-0", "font-[inherit]", "text-[length:inherit]");
  });

  it("CardMeta renders with muted color", () => {
    const { container } = render(<CardMeta>v0.1.0</CardMeta>);
    expect(container.firstChild).toHaveClass("text-[var(--fg-muted)]");
    expect(screen.getByText("v0.1.0")).toBeInTheDocument();
  });

  it("CardTitle renders as h3 with serif styling", () => {
    const { container } = render(<CardTitle>My Title</CardTitle>);
    const h3 = screen.getByRole("heading", { level: 3, name: "My Title" });
    expect(h3).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("font-serif");
  });

  it("CardDescription renders children with sans body styling", () => {
    const { container } = render(<CardDescription>desc text</CardDescription>);
    expect(screen.getByText("desc text")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("font-sans");
  });

  it("CardContent renders children", () => {
    render(<CardContent>body</CardContent>);
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("CardFooter renders mono+muted small text", () => {
    const { container } = render(<CardFooter>footer</CardFooter>);
    expect(screen.getByText("footer")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("font-mono");
  });

  it("CardFooter sits at the bottom and wraps", () => {
    const { container } = render(<CardFooter>footer</CardFooter>);
    expect(container.firstChild).toHaveClass("mt-auto", "flex-wrap");
  });

  it("CardComment renders // prefix before children", () => {
    const { container } = render(<CardComment>shipped 2025-11</CardComment>);
    expect(screen.getByText("shipped 2025-11")).toBeInTheDocument();
    const prefix = container.querySelector("[aria-hidden]");
    expect(prefix?.textContent).toBe("// ");
    expect(prefix).toHaveClass("opacity-60");
  });

  it("CardTerminalBar has a bottom border and no band over the card's glow", () => {
    const { container } = render(<CardTerminalBar>~/project</CardTerminalBar>);
    expect(screen.getByText("~/project")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("border-b");
    expect((container.firstChild as HTMLElement).className).not.toMatch(/bg-\[/);
  });

  it("CardTerminalBody applies padding and mono font", () => {
    const { container } = render(<CardTerminalBody>$ pnpm dev</CardTerminalBody>);
    expect(screen.getByText("$ pnpm dev")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("font-mono");
    expect(container.firstChild).toHaveClass("p-4");
  });
});
