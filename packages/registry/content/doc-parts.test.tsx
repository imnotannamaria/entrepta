import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DisplayH2, DocLabel, Em, Prose, Section, Strong } from "./doc-parts";

describe("doc parts", () => {
  it("Em is serif italic in the brand text ink", () => {
    render(<Em>entrepta</Em>);
    expect(screen.getByText("entrepta")).toHaveClass(
      "font-serif",
      "italic",
      "text-[var(--fg-brand-text)]"
    );
  });

  it("Strong is primary ink at medium weight", () => {
    render(<Strong>shipped</Strong>);
    expect(screen.getByText("shipped")).toHaveClass("font-medium", "text-[var(--fg-primary)]");
  });

  it("DocLabel hides its markdown prefix", () => {
    render(<DocLabel level="##">career</DocLabel>);
    expect(screen.getByText("##")).toHaveAttribute("aria-hidden");
  });

  it("DisplayH2 is an h2 on the display-md step", () => {
    render(<DisplayH2>Work</DisplayH2>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("text-display-md");
  });

  it("Prose caps the measure", () => {
    render(<Prose>text</Prose>);
    expect(screen.getByText("text")).toHaveClass("max-w-[60ch]", "font-sans");
  });

  it("Section draws a rule between sections, not above the first", () => {
    const { container, rerender } = render(<Section id="a">x</Section>);
    expect(container.firstChild).toHaveClass("border-t", "pt-16");
    rerender(
      <Section id="a" variant="first">
        x
      </Section>
    );
    expect(container.firstChild).not.toHaveClass("border-t");
    expect(container.firstChild).toHaveClass("pt-0");
  });
});
