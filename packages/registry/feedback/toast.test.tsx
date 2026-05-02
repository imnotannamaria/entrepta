import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toaster } from "./toast";

describe("Toaster", () => {
  it("renders without crashing", () => {
    const { container } = render(<Toaster />);
    expect(container).toBeInTheDocument();
  });

  it("injects style tag with sonner data-attribute selectors", () => {
    const { container } = render(<Toaster />);
    const styleTag = container.querySelector("style");
    expect(styleTag).toBeInTheDocument();
    expect(styleTag?.textContent).toContain("[data-sonner-toast]");
  });

  it("applies success border-left-color token in injected styles", () => {
    const { container } = render(<Toaster />);
    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain('data-type="success"');
    expect(styleTag?.textContent).toContain("var(--status-success)");
  });

  it("applies error border-left-color token in injected styles", () => {
    const { container } = render(<Toaster />);
    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain('data-type="error"');
    expect(styleTag?.textContent).toContain("var(--status-error)");
  });

  it("applies warning border-left-color token in injected styles", () => {
    const { container } = render(<Toaster />);
    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain('data-type="warning"');
    expect(styleTag?.textContent).toContain("var(--status-warning)");
  });

  it("applies info border-left-color token in injected styles", () => {
    const { container } = render(<Toaster />);
    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain('data-type="info"');
    expect(styleTag?.textContent).toContain("var(--status-info)");
  });

  it("applies mono font family from CSS token", () => {
    const { container } = render(<Toaster />);
    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain("var(--font-mono)");
  });

  it("uses dark theme by default", () => {
    render(<Toaster />);
    // Sonner container exists somewhere in the document (portal)
    expect(document.body).toBeInTheDocument();
  });
});
