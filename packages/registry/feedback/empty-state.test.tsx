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
});
