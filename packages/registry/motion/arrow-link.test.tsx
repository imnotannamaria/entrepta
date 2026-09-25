import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { ArrowAffordance, ArrowLink } from "./arrow-link";

describe("ArrowLink", () => {
  it("renders an anchor with the label and a hidden arrow and rule", () => {
    const { container } = render(<ArrowLink href="/docs">read the docs</ArrowLink>);
    const link = screen.getByRole("link", { name: "read the docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("group/arrow");
    expect(container.querySelector('[data-icon="arrow-right"]')).toHaveAttribute("aria-hidden");
    expect(container.querySelector("[data-arrow-rule]")).toHaveAttribute("aria-hidden");
  });

  it("opens external links in a new tab with the up-right arrow", () => {
    const { container } = render(
      <ArrowLink href="https://github.com" external>
        github
      </ArrowLink>
    );
    const link = screen.getByRole("link", { name: "github" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(container.querySelector('[data-icon="arrow-up-right"]')).toBeInTheDocument();
  });

  it("colors the hovered label with the brand text ink", () => {
    render(<ArrowLink href="/">home</ArrowLink>);
    expect(screen.getByRole("link")).toHaveClass("hover:text-[var(--fg-brand-text)]");
  });

  it("wraps your router's link with asChild", () => {
    render(
      <ArrowLink asChild>
        <a href="/blog" data-router-link>
          blog
        </a>
      </ArrowLink>
    );
    const link = screen.getByRole("link", { name: "blog" });
    expect(link).toHaveAttribute("data-router-link");
    expect(link).toHaveClass("group/arrow");
    expect(link.querySelector("[data-arrow-rule]")).toBeInTheDocument();
  });

  it("forwards the ref to the anchor", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <ArrowLink ref={ref} href="/">
        home
      </ArrowLink>
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

describe("ArrowAffordance", () => {
  it("renders the label for a card that is one big link", () => {
    render(<ArrowAffordance>open</ArrowAffordance>);
    expect(screen.getByText("open")).toBeInTheDocument();
  });
});
