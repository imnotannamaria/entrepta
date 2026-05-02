import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader, SectionHeadingAccent } from "./section-header";

describe("SectionHeader", () => {
  it("renders heading text", () => {
    render(<SectionHeader heading="Hello world" />);
    expect(screen.getByRole("heading", { name: "Hello world" })).toBeInTheDocument();
  });

  it("renders eyebrow when provided", () => {
    render(<SectionHeader eyebrow="components" heading="Title" />);
    expect(screen.getByText("components")).toBeInTheDocument();
  });

  it("does not render eyebrow when omitted", () => {
    render(<SectionHeader heading="Title" />);
    expect(screen.queryByText("components")).not.toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<SectionHeader heading="Title" description="Some description" />);
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    const { container } = render(<SectionHeader heading="Title" />);
    const p = container.querySelector("p");
    expect(p).not.toBeInTheDocument();
  });

  it("applies center alignment class when align=center", () => {
    const { container } = render(<SectionHeader heading="Title" align="center" />);
    expect(container.firstChild).toHaveClass("items-center", "text-center");
  });

  it("does not apply center class when align=left (default)", () => {
    const { container } = render(<SectionHeader heading="Title" />);
    expect(container.firstChild).not.toHaveClass("items-center");
  });

  it("eyebrow uses brand color by default", () => {
    render(<SectionHeader eyebrow="label" heading="Title" />);
    const eyebrow = screen.getByText("label");
    expect(eyebrow).toHaveStyle({ color: "var(--fg-brand)" });
  });

  it("eyebrow accepts custom color via eyebrowColor prop", () => {
    render(<SectionHeader eyebrow="label" eyebrowColor="#ff0000" heading="Title" />);
    expect(screen.getByText("label")).toHaveStyle({ color: "#ff0000" });
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<SectionHeader ref={ref} heading="Title" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("SectionHeadingAccent", () => {
  it("renders children with brand color class", () => {
    render(<SectionHeadingAccent>highlighted</SectionHeadingAccent>);
    const el = screen.getByText("highlighted");
    expect(el).toHaveClass("text-[var(--fg-brand)]");
  });

  it("merges custom className", () => {
    render(<SectionHeadingAccent className="font-bold">text</SectionHeadingAccent>);
    expect(screen.getByText("text")).toHaveClass("font-bold");
  });
});
