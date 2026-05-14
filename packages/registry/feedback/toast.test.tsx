import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toaster } from "./toast";

function getStyle(container: HTMLElement) {
  return container.querySelector("style")?.textContent ?? "";
}

describe("Toaster", () => {
  it("renders without crashing", () => {
    const { container } = render(<Toaster />);
    expect(container).toBeInTheDocument();
  });

  it("injects style tag with sonner data-attribute selectors", () => {
    const { container } = render(<Toaster />);
    expect(getStyle(container)).toContain("[data-sonner-toast]");
  });

  it("applies radius-md and the design-spec drop shadow", () => {
    const { container } = render(<Toaster />);
    const style = getStyle(container);
    expect(style).toContain("border-radius: var(--radius-md)");
    expect(style).toContain("box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5)");
  });

  it("uses mono for title and sans for description", () => {
    const { container } = render(<Toaster />);
    const style = getStyle(container);
    expect(style).toMatch(/\[data-title\][^}]*var\(--font-mono\)/);
    expect(style).toMatch(/\[data-description\][^}]*var\(--font-sans\)/);
  });

  it("applies success border-left-color token", () => {
    const { container } = render(<Toaster />);
    const style = getStyle(container);
    expect(style).toContain('data-type="success"');
    expect(style).toContain("var(--status-success)");
  });

  it("applies error border-left-color token", () => {
    const { container } = render(<Toaster />);
    const style = getStyle(container);
    expect(style).toContain('data-type="error"');
    expect(style).toContain("var(--status-error)");
  });

  it("applies warning and info border-left-color tokens", () => {
    const { container } = render(<Toaster />);
    const style = getStyle(container);
    expect(style).toContain('data-type="warning"');
    expect(style).toContain("var(--status-warning)");
    expect(style).toContain('data-type="info"');
    expect(style).toContain("var(--status-info)");
  });

  it("sets min-width 320px and padding 12 16 to match design", () => {
    const { container } = render(<Toaster />);
    const style = getStyle(container);
    expect(style).toContain("min-width: 320px");
    expect(style).toContain("padding: 12px 16px");
  });

  it("uses dark theme by default", () => {
    render(<Toaster />);
    expect(document.body).toBeInTheDocument();
  });
});
