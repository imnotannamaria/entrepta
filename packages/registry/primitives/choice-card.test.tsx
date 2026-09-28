import { RocketLaunchIcon } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChoiceCard } from "./choice-card";

const PLANS = [
  { value: "free", title: "Free", description: "One account" },
  {
    value: "pro",
    title: "Pro",
    description: "Every account",
    icon: RocketLaunchIcon,
    badge: <span>$4</span>,
  },
  { value: "team", title: "Team", disabled: "Coming in October" },
];

describe("ChoiceCard", () => {
  it("is a group named by its legend, each card the label of a native radio", () => {
    render(<ChoiceCard legend="Plan" options={PLANS} defaultValue="free" />);
    expect(screen.getByRole("group", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Free/ })).toBeChecked();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("chooses with a click anywhere on the card, and with the arrow keys", async () => {
    const onValueChange = vi.fn();
    render(<ChoiceCard legend="Plan" options={PLANS} value="free" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText("Every account"));
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
  });

  it("says why an option is off", () => {
    render(<ChoiceCard legend="Plan" options={PLANS} />);
    const team = screen.getByRole("radio", { name: /Team/ });
    expect(team).toBeDisabled();
    expect(team).toHaveAccessibleDescription("Coming in October");
  });

  it("takes several values as checkboxes", async () => {
    const onValueChange = vi.fn();
    render(
      <ChoiceCard
        type="checkbox"
        legend="Accounts"
        options={PLANS.slice(0, 2)}
        defaultValue={["free"]}
        onValueChange={onValueChange}
      />
    );
    await userEvent.click(screen.getByRole("checkbox", { name: /Pro/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(["free", "pro"]);
  });

  it("marks the chosen card with the strong brand border", () => {
    const { container } = render(<ChoiceCard legend="Plan" options={PLANS} />);
    expect(container.querySelector("label")).toHaveClass(
      "has-[:checked]:border-[var(--border-brand-strong)]"
    );
  });
});
