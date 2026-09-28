import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { type ContributionDay, ContributionGrid } from "./contribution-grid";

// three weeks of September 2026; the 1st is a Tuesday
const DAYS: ContributionDay[] = Array.from({ length: 21 }, (_, i) => ({
  date: `2026-09-${String(i + 1).padStart(2, "0")}`,
  level: (i % 5) as 0 | 1 | 2 | 3 | 4,
}));
DAYS[3] = { date: "2026-09-04", level: null };
DAYS[4] = { date: "2026-09-05", level: 3, state: "3 workouts, 42 min" };

describe("ContributionGrid", () => {
  it("is a named group of day buttons, each saying its day in words", () => {
    render(<ContributionGrid label="Workouts" days={DAYS} />);
    expect(screen.getByRole("group", { name: "Workouts" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(21);
    expect(
      screen.getByRole("button", { name: "Sep 5, 2026: 3 workouts, 42 min" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sep 3, 2026: Medium" })).toBeInTheDocument();
  });

  it("tells a day with no data from a day with none", () => {
    render(<ContributionGrid label="Workouts" days={DAYS} />);
    expect(screen.getByRole("button", { name: "Sep 4, 2026: No data" })).toHaveClass(
      "border-dashed"
    );
    expect(screen.getByRole("button", { name: "Sep 1, 2026: No activity" })).toHaveClass(
      "bg-[var(--bg-hover-strong)]"
    );
  });

  it("is one Tab stop, on the latest day, and the arrows walk the days", async () => {
    render(<ContributionGrid label="Workouts" days={DAYS} />);
    const stops = screen.getAllByRole("button").filter((b) => b.tabIndex === 0);
    expect(stops).toHaveLength(1);
    expect(stops[0]).toHaveAccessibleName(/Sep 21/);
    await userEvent.tab();
    expect(stops[0]).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: /Sep 14/ })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByRole("button", { name: /Sep 13/ })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("button", { name: /Sep 1,/ })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: /Sep 1,/ })).toHaveFocus();
  });

  it("chooses a day with a click or the keyboard", async () => {
    const onSelect = vi.fn();
    render(
      <ContributionGrid label="Workouts" days={DAYS} onSelect={onSelect} selected="2026-09-02" />
    );
    await userEvent.click(screen.getByRole("button", { name: /Sep 10/ }));
    expect(onSelect).toHaveBeenCalledWith("2026-09-10");
    expect(screen.getByRole("button", { name: /Sep 2,/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows a tooltip in the body, with your own content", () => {
    render(
      <ContributionGrid
        label="Workouts"
        days={DAYS}
        renderTooltip={(day) => <span>tip for {day.date}</span>}
      />
    );
    fireEvent.mouseEnter(screen.getByRole("button", { name: /Sep 5/ }));
    const tip = screen.getByRole("tooltip");
    expect(tip).toHaveTextContent("tip for 2026-09-05");
    expect(tip.parentElement).toBe(document.body);
  });

  it("draws a skeleton while loading", () => {
    const { container } = render(<ContributionGrid label="Workouts" days={[]} loading />);
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});
