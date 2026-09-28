import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "./alert";

describe("Alert", () => {
  it("waits its turn for most notices and interrupts only for an error", () => {
    const { rerender } = render(<Alert title="Partial data" tone="warning" />);
    expect(screen.getByRole("status")).toHaveTextContent("Partial data");
    rerender(<Alert title="Sync failed" tone="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Sync failed");
  });

  it("carries the status in an icon tile and the corner glow, with no colored edge", () => {
    const { container } = render(<Alert tone="success" title="Connected" />);
    const alert = screen.getByRole("status");
    expect(alert).toHaveClass("sheen", "border-[var(--border-subtle)]");
    expect(alert.className).toContain("--sheen-tint:color-mix(in_srgb,var(--status-success)");
    expect(alert.className).not.toMatch(/border-l-|border-s-/);
    expect(container.querySelector("[aria-hidden='true']")).toHaveClass(
      "bg-[var(--status-success-soft)]"
    );
  });

  it("holds the detail, the next step and a way to put it away", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert
        tone="info"
        title="3 rows could not be read"
        action={<a href="/import">review them</a>}
        onDismiss={onDismiss}
      >
        They are missing a date.
      </Alert>
    );
    expect(screen.getByText("They are missing a date.")).toHaveClass("font-sans");
    expect(screen.getByRole("link", { name: "review them" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
