import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateNavigator } from "./date-navigator";

function Harness(props: Partial<React.ComponentProps<typeof DateNavigator>> & { initial: string }) {
  const [value, setValue] = React.useState(props.initial);
  return (
    <>
      <DateNavigator
        aria-label="day"
        timeZone="UTC"
        {...props}
        value={value}
        onValueChange={setValue}
      />
      <output data-testid="held">{value}</output>
    </>
  );
}

const held = () => screen.getByTestId("held").textContent;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-27T12:00:00Z"));
});
afterEach(() => vi.useRealTimers());

describe("DateNavigator", () => {
  it("steps a day back and forward, across month ends", async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-09-30" />);
    await user.click(screen.getByRole("button", { name: "Next day" }));
    expect(held()).toBe("2026-10-01");
    await user.click(screen.getByRole("button", { name: "Previous day" }));
    await user.click(screen.getByRole("button", { name: "Previous day" }));
    expect(held()).toBe("2026-09-29");
  });

  it("steps months and years in their own format", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Harness granularity="month" initial="2026-12" />);
    await user.click(screen.getByRole("button", { name: "Next month" }));
    expect(held()).toBe("2027-01");
    unmount();
    render(<Harness granularity="year" initial="2026" />);
    await user.click(screen.getByRole("button", { name: "Previous year" }));
    expect(held()).toBe("2025");
  });

  it("goes back to today, in the zone it is given", async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-01-10" />);
    await user.click(screen.getByRole("button", { name: "Today" }));
    expect(held()).toBe("2026-09-27");
    expect(screen.getByRole("button", { name: "Today" })).toHaveAttribute("aria-disabled", "true");
  });

  it("stays focusable at a limit and says why it goes no further", async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-09-27" max="2026-09-27" min="2026-09-26" />);
    const next = screen.getByRole("button", { name: "Next day" });
    expect(next).toHaveAttribute("aria-disabled", "true");
    expect(next).not.toBeDisabled();
    expect(next).toHaveAccessibleDescription("Nothing after this day");
    await user.click(next);
    expect(held()).toBe("2026-09-27");
    await user.click(screen.getByRole("button", { name: "Previous day" }));
    expect(held()).toBe("2026-09-26");
    expect(screen.getByRole("button", { name: "Previous day" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("shows the period as a picker that opens a calendar", async () => {
    const user = userEvent.setup();
    render(<Harness initial="2026-09-27" />);
    const period = screen.getByRole("button", { name: /Sep 27, 2026/ });
    await user.click(period);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("takes words for another language", () => {
    render(
      <Harness
        initial="2026-09-27"
        labels={{ previous: "Dia anterior", today: "Hoje" }}
        locale="pt-BR"
      />
    );
    expect(screen.getByRole("button", { name: "Dia anterior" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hoje" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /27 de set\. de 2026/ })).toBeInTheDocument();
  });
});
