import { TrayIcon } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("says what is missing and offers one thing to do", () => {
    render(
      <EmptyState
        icon={TrayIcon}
        title="No entries this month"
        description="Add one, or connect an account to bring them in."
        action={<button type="button">add an entry</button>}
      />
    );
    expect(screen.getByText("No entries this month")).toHaveClass("text-[var(--fg-primary)]");
    expect(screen.getByText(/connect an account/)).toHaveClass("font-sans");
    expect(screen.getByRole("button", { name: "add an entry" })).toBeInTheDocument();
  });

  it("puts its icon in a decorative tile", () => {
    const { container } = render(<EmptyState icon={TrayIcon} title="Nothing here yet" />);
    expect(container.querySelector("[aria-hidden='true']")).toHaveClass("size-10");
  });

  it("comes in a smaller size for a widget", () => {
    const { container } = render(<EmptyState size="sm" title="Nothing for this filter" />);
    expect(container.firstChild).toHaveClass("py-6");
  });

  it("takes the error tone when the content could not load", () => {
    const { container } = render(<EmptyState icon={TrayIcon} tone="error" title="Did not load" />);
    expect(container.querySelector("[aria-hidden='true']")).toHaveClass(
      "bg-[var(--status-error-soft)]"
    );
  });

  it("draws an illustration over the icon when it has both", () => {
    const { container } = render(
      <EmptyState icon={TrayIcon} illustration={<svg data-art />} title="Lost" />
    );
    expect(container.querySelector("[data-illustration] [data-art]")).not.toBeNull();
    expect(container.querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("keeps a plain paragraph for a title, and a heading when asked", () => {
    const { rerender } = render(<EmptyState title="Nothing here" />);
    expect(screen.queryByRole("heading")).toBeNull();
    rerender(<EmptyState title="Nothing here" headingLevel={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Nothing here" })).toBeInTheDocument();
  });

  it("is a screen of its own with size page: an h1 in a bigger serif title, centered in its height", () => {
    const { container } = render(
      <EmptyState size="page" title="Page not found" description="It moved, or it never was." />
    );
    expect(container.firstChild).toHaveClass("min-h-[60vh]", "justify-center");
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toHaveClass(
      "font-serif",
      "text-display-md"
    );
    expect(screen.getByText(/never was/)).toHaveClass("text-body-lg");
  });

  it("takes a lower heading level on a page that already has an h1", () => {
    render(<EmptyState size="page" headingLevel={2} title="Something broke" />);
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Something broke" })).toBeInTheDocument();
  });
});
