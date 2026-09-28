import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RedactProvider } from "../hooks/use-redact";
import { RollingNumber } from "../motion/rolling-number";
import { Amount } from "./amount";
import { Metric } from "./metric";
import { Redact } from "./redact";

describe("Redact", () => {
  it("does nothing without a provider", () => {
    const { container } = render(<Redact>$1,204.80</Redact>);
    expect(container.innerHTML).toBe("$1,204.80");
  });

  it("covers the value with a mask of its width and says hidden value", () => {
    const { container } = render(
      <RedactProvider hidden>
        <Redact>$1,204.80</Redact>
      </RedactProvider>
    );
    const kept = screen.getByText("$1,204.80");
    expect(kept).toHaveClass("invisible");
    expect(kept).toHaveAttribute("aria-hidden");
    expect(screen.getByText("hidden value")).toHaveClass("sr-only");
    expect(container.querySelectorAll("[data-redacted]")).toHaveLength(1);
  });

  it("shows again when the app says so", () => {
    const { rerender } = render(
      <RedactProvider hidden>
        <Redact>42</Redact>
      </RedactProvider>
    );
    rerender(
      <RedactProvider hidden={false}>
        <Redact>42</Redact>
      </RedactProvider>
    );
    expect(screen.queryByText("hidden value")).not.toBeInTheDocument();
  });

  it("hides an Amount and a RollingNumber on their own", () => {
    const { container } = render(
      <RedactProvider hidden>
        <Amount value={120480} currency="USD" />
        <RollingNumber value="1,204" />
      </RedactProvider>
    );
    expect(container.querySelectorAll("[data-redacted]")).toHaveLength(2);
  });

  it("draws one mask for an Amount inside a Metric", () => {
    const { container } = render(
      <RedactProvider hidden>
        <Metric label="balance" value={<Amount value={120480} currency="USD" />} />
      </RedactProvider>
    );
    expect(container.querySelectorAll("[data-redacted]")).toHaveLength(1);
    expect(screen.getAllByText("hidden value")).toHaveLength(1);
    expect(screen.getByText("balance")).toBeVisible();
  });
});
