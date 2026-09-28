import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Calendar, type DateRange } from "./calendar";

function Single(
  props: Partial<React.ComponentProps<typeof Calendar>> & { initial?: string | null }
) {
  const [value, setValue] = React.useState<string | null>(props.initial ?? "2026-09-15");
  return (
    <>
      <Calendar
        timeZone="UTC"
        {...(props as object)}
        mode="single"
        value={value}
        onValueChange={setValue}
      />
      <output data-testid="held">{value ?? "none"}</output>
    </>
  );
}

function Range() {
  const [value, setValue] = React.useState<DateRange | null>(null);
  return (
    <>
      <Calendar
        mode="range"
        timeZone="UTC"
        month="2026-09-01"
        value={value}
        onValueChange={setValue}
      />
      <output data-testid="held">{value ? `${value.start}..${value.end ?? ""}` : "none"}</output>
    </>
  );
}

const held = () => screen.getByTestId("held").textContent;

afterEach(() => vi.useRealTimers());

describe("Calendar", () => {
  it("shows the month of the value, named in its locale", () => {
    render(<Single locale="pt-BR" />);
    expect(screen.getByRole("grid", { name: "setembro de 2026" })).toBeInTheDocument();
  });

  it("names each day in full for screen readers, and marks the selected one", () => {
    render(<Single />);
    expect(
      screen.getByRole("button", { name: "Tuesday, September 15, 2026, selected" })
    ).toBeInTheDocument();
  });

  it("picks a day as a plain date string", async () => {
    const user = userEvent.setup();
    render(<Single />);
    await user.click(screen.getByRole("button", { name: /September 20, 2026/ }));
    expect(held()).toBe("2026-09-20");
  });

  it("moves between days with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Single />);
    screen.getByRole("button", { name: /September 15, 2026/ }).focus();
    await user.keyboard("{ArrowRight}{ArrowDown}{Enter}");
    expect(held()).toBe("2026-09-23");
  });

  it("marks today in the zone it is given, not the browser's", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    // 02:30 UTC on the 16th is still the 15th in São Paulo
    vi.setSystemTime(new Date("2026-09-16T02:30:00Z"));
    render(<Single timeZone="America/Sao_Paulo" initial={null} month="2026-09-01" />);
    expect(screen.getByRole("button", { name: /September 15, 2026, today/ })).toBeInTheDocument();
  });

  it("keeps days outside min and max, and days it is told to, from being picked", () => {
    render(<Single min="2026-09-10" max="2026-09-20" isDisabled={(day) => day === "2026-09-12"} />);
    expect(screen.getByRole("button", { name: /September 9, 2026/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /September 12, 2026/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /September 21, 2026/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /September 11, 2026/ })).toBeEnabled();
  });

  // the header row is hidden from screen readers: each day's name already says its weekday
  it("starts the week on the locale's first day", () => {
    const { container, unmount } = render(<Single locale="en-US" />);
    expect(container.querySelector("th")).toHaveAttribute("aria-label", "Sunday");
    unmount();
    const { container: german } = render(<Single locale="de-DE" />);
    expect(german.querySelector("th")).toHaveAttribute("aria-label", "Montag");
  });

  it("picks a range in two clicks", async () => {
    const user = userEvent.setup();
    render(<Range />);
    await user.click(screen.getByRole("button", { name: /September 3, 2026/ }));
    expect(held()).toBe("2026-09-03..");
    await user.click(screen.getByRole("button", { name: /September 9, 2026/ }));
    expect(held()).toBe("2026-09-03..2026-09-09");
  });

  it("orders a range picked backwards, and starts over after a finished one", async () => {
    const user = userEvent.setup();
    render(<Range />);
    await user.click(screen.getByRole("button", { name: /September 20, 2026/ }));
    await user.click(screen.getByRole("button", { name: /September 5, 2026/ }));
    expect(held()).toBe("2026-09-05..2026-09-20");
    await user.click(screen.getByRole("button", { name: /September 25, 2026/ }));
    expect(held()).toBe("2026-09-25..");
  });

  it("draws something under a day when asked", () => {
    render(<Single renderDay={(day) => (day === "2026-09-15" ? <i data-testid="dot" /> : null)} />);
    expect(screen.getByTestId("dot").closest("button")).toHaveAccessibleName(/September 15/);
  });
});
