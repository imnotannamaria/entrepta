import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
import type { DateRange } from "./calendar";
import { DatePicker } from "./date-picker";
import { Field } from "./field";

function Single({
  granularity,
  initial = null,
  error,
  min,
  max,
}: {
  granularity?: "day" | "month" | "year";
  initial?: string | null;
  error?: string;
  min?: string;
  max?: string;
}) {
  const [value, setValue] = React.useState<string | null>(initial);
  return (
    <>
      <Field id="when" label="date" error={error}>
        <DatePicker
          granularity={granularity}
          value={value}
          onValueChange={setValue}
          timeZone="UTC"
          min={min}
          max={max}
        />
      </Field>
      <output data-testid="held">{value ?? "none"}</output>
    </>
  );
}

function Range() {
  const [value, setValue] = React.useState<DateRange | null>(null);
  return (
    <>
      <DatePicker
        aria-label="period"
        mode="range"
        timeZone="UTC"
        value={value}
        onValueChange={setValue}
        presets={[{ label: "September", value: { start: "2026-09-01", end: "2026-09-30" } }]}
      />
      <output data-testid="held">{value ? `${value.start}..${value.end ?? ""}` : "none"}</output>
    </>
  );
}

const held = () => screen.getByTestId("held").textContent;

describe("DatePicker", () => {
  it("is a button named by its Field, showing the placeholder, then the date in words", async () => {
    const user = userEvent.setup();
    render(<Single initial="2026-09-15" />);
    const trigger = screen.getByRole("button", { name: "date" });
    expect(trigger).toHaveTextContent("Sep 15, 2026");
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: /September 20, 2026/ }));
    expect(held()).toBe("2026-09-20");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent("Sep 20, 2026");
  });

  it("takes the error state from a Field", () => {
    render(<Single error="Pick a date" />);
    const trigger = screen.getByRole("button", { name: "date" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAccessibleDescription("Pick a date");
    expect(trigger).toHaveTextContent("Pick a date…");
  });

  it("stays open until a range has both ends, then shows it", async () => {
    const user = userEvent.setup();
    render(<Range />);
    await user.click(screen.getByRole("button", { name: "period" }));
    const month = screen.getAllByRole("grid")[0].getAttribute("aria-label") ?? "";
    const [monthName, year] = month.split(" ");
    await user.click(screen.getByRole("button", { name: new RegExp(`${monthName} 3, ${year}`) }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: new RegExp(`${monthName} 8, ${year}`) }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(held()).toMatch(/\.\.\d{4}-\d{2}-08$/);
  });

  it("offers presets one click away", async () => {
    const user = userEvent.setup();
    render(<Range />);
    await user.click(screen.getByRole("button", { name: "period" }));
    await user.click(screen.getByRole("button", { name: "September" }));
    expect(held()).toBe("2026-09-01..2026-09-30");
    expect(screen.getByRole("button", { name: "period" })).toHaveTextContent("Sep 1 – 30, 2026");
  });

  it("picks a month as YYYY-MM from a grid the arrow keys move through", async () => {
    const user = userEvent.setup();
    render(<Single granularity="month" initial="2026-09" />);
    const trigger = screen.getByRole("button", { name: "date" });
    expect(trigger).toHaveTextContent("September 2026");
    await user.click(trigger);
    const september = screen.getByRole("button", { name: /^September 2026/ });
    expect(september).toHaveAttribute("aria-pressed", "true");
    september.focus();
    // left to August, down to November; down again from the last row stays, as in any grid
    await user.keyboard("{ArrowLeft}{ArrowDown}{ArrowDown}{Enter}");
    expect(held()).toBe("2026-11");
  });

  it("opens inside min and max, with Tab on an open month and the arrows skipping closed ones", async () => {
    const user = userEvent.setup();
    // today is past max, so the grid opens on max's year instead of a page of closed months
    render(<Single granularity="month" min="2020-03-01" max="2020-10-31" />);
    await user.click(screen.getByRole("button", { name: "date" }));
    const february = screen.getByRole("button", { name: "February 2020" });
    const march = screen.getByRole("button", { name: "March 2020" });
    expect(february).toBeDisabled();
    expect(march).toBeEnabled();
    expect(march).toHaveAttribute("tabindex", "0");
    march.focus();
    await user.keyboard("{ArrowLeft}{ArrowUp}");
    expect(march).toHaveFocus();
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    // June, then September; December is past max, so focus stays on September
    expect(screen.getByRole("button", { name: "September 2020" })).toHaveFocus();
  });

  it("disables months outside min and max, and turns the page", async () => {
    const user = userEvent.setup();
    render(<Single granularity="month" initial="2026-09" min="2026-03-01" max="2026-10-31" />);
    await user.click(screen.getByRole("button", { name: "date" }));
    expect(screen.getByRole("button", { name: "February 2026" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "November 2026" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Previous year" }));
    expect(screen.getByRole("button", { name: "September 2025" })).toBeDisabled();
  });

  it("picks a year as YYYY", async () => {
    const user = userEvent.setup();
    render(<Single granularity="year" initial="2026" />);
    await user.click(screen.getByRole("button", { name: "date" }));
    // twelve years a page, from a multiple of twelve: 2016 to 2027
    await user.click(screen.getByRole("button", { name: /^2020/ }));
    expect(held()).toBe("2020");
  });
});
