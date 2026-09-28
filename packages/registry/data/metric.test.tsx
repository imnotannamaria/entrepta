import { WalletIcon } from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Metric } from "./metric";

describe("Metric", () => {
  it("pairs the label with the value in a description list", () => {
    const { container } = render(<Metric label="spent" value="$1,240.00" />);
    expect(container.querySelector("dl > dt")).toHaveTextContent("spent");
    expect(container.querySelector("dl > dd")).toHaveTextContent("$1,240.00");
  });

  it("puts the delta and the comparison on one line under the value", () => {
    render(<Metric label="spent" value="$1" delta={<span>+4%</span>} comparison="vs August" />);
    expect(screen.getByText("+4%").parentElement).toHaveTextContent("+4%vs August");
  });

  it("never truncates the value", () => {
    render(<Metric label="spent" value="$1,240,000.00" size="lg" />);
    const value = screen.getByText("$1,240,000.00");
    expect(value.className).not.toMatch(/truncate|ellipsis/);
    expect(value).toHaveClass("whitespace-nowrap");
  });

  it("steps the large value down in a narrow container", () => {
    const { container } = render(<Metric label="spent" value="$1" size="lg" />);
    expect(container.firstChild).toHaveClass("@container", "w-full");
    expect(screen.getByText("$1")).toHaveClass("text-heading-lg", "@2xs:text-display-md");
  });

  it("draws its pieces in the final shape while loading", () => {
    const { container } = render(
      <Metric label="spent" value="$1" delta={<span>+4%</span>} trend={<svg />} loading />
    );
    expect(screen.queryByText("$1")).not.toBeInTheDocument();
    expect(screen.queryByText("+4%")).not.toBeInTheDocument();
    expect(screen.getByText("spent")).toBeInTheDocument();
    expect(container.querySelectorAll("[aria-hidden='true'].block")).toHaveLength(3);
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });

  it("takes an icon in place of the diamond", () => {
    const { container } = render(<Metric label="balance" value="$1" icon={WalletIcon} />);
    expect(container.querySelector("dt svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("dt")).not.toHaveTextContent("◆");
  });
});
