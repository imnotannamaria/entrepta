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

  it("applies default variant class", () => {
    const { container } = render(<Card>default</Card>);
    expect(container.firstChild).toHaveClass("bg-[var(--bg-surface)]");
  });

  it("applies featured variant class", () => {
    const { container } = render(<Card variant="featured">featured</Card>);
    expect(container.firstChild).toHaveClass("bg-[var(--bg-surface-brand)]");
  });

  it("applies terminal variant class with no padding", () => {
    const { container } = render(<Card variant="terminal">terminal</Card>);
    expect(container.firstChild).toHaveClass("p-0");
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
    expect(container.firstChild).toHaveClass("uppercase");
    expect(container.firstChild).toHaveClass("font-mono");
  });

  it("CardLabel renders diamond glyph before children", () => {
    render(<CardLabel>resend-ecommerce</CardLabel>);
    expect(screen.getByText("resend-ecommerce")).toBeInTheDocument();
    expect(screen.getByText("◆")).toBeInTheDocument();
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

  it("CardComment renders // prefix before children", () => {
    const { container } = render(<CardComment>shipped 2025-11</CardComment>);
    expect(screen.getByText("shipped 2025-11")).toBeInTheDocument();
    const prefix = container.querySelector("[aria-hidden]");
    expect(prefix?.textContent).toBe("// ");
  });

  it("CardTerminalBar renders with darker background and border-bottom", () => {
    const { container } = render(<CardTerminalBar>~/project</CardTerminalBar>);
    expect(screen.getByText("~/project")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("bg-black/30");
  });

  it("CardTerminalBody applies padding and mono font", () => {
    const { container } = render(<CardTerminalBody>$ pnpm dev</CardTerminalBody>);
    expect(screen.getByText("$ pnpm dev")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("font-mono");
    expect(container.firstChild).toHaveClass("p-4");
  });
});
