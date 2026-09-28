import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SwatchPicker } from "./swatch-picker";

describe("SwatchPicker", () => {
  it("is a group of native radios over the palette keys", () => {
    render(<SwatchPicker legend="Color" defaultValue="chart-3" />);
    expect(screen.getByRole("group", { name: "Color" })).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(8);
    expect(radios.map((r) => r.getAttribute("value"))).toContain("chart-8");
    expect(radios[2]).toBeChecked();
  });

  it("hands back the key, never a color", async () => {
    const onValueChange = vi.fn();
    render(<SwatchPicker legend="Color" value="chart-1" onValueChange={onValueChange} />);
    await userEvent.click(screen.getAllByRole("radio")[4]);
    expect(onValueChange).toHaveBeenCalledWith("chart-5");
  });

  it("paints each swatch from its token", () => {
    const { container } = render(<SwatchPicker legend="Color" />);
    const swatch = container.querySelector<HTMLElement>('[data-swatch="chart-2"]');
    expect(swatch?.style.getPropertyValue("--swatch")).toBe("var(--chart-2)");
  });

  it("names each swatch, with names of your own when given", () => {
    render(
      <SwatchPicker
        legend="Color"
        options={["chart-1", "chart-2"]}
        names={{ "chart-1": "Brand" }}
      />
    );
    expect(screen.getByRole("radio", { name: "Brand" })).toBeInTheDocument();
    // jsdom draws no color, so the hue has no name and the fallback reads
    expect(screen.getByRole("radio", { name: "Color 2" })).toBeInTheDocument();
  });

  it("takes colors of your own, handing back your id", async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <SwatchPicker
        legend="Theme"
        options={[
          { value: "entrepta", color: "#7c6bff", name: "entrepta" },
          { value: "ivy", color: "#35a365", name: "ivy" },
        ]}
        value="entrepta"
        onValueChange={onValueChange}
      />
    );
    await userEvent.click(screen.getByRole("radio", { name: "ivy" }));
    expect(onValueChange).toHaveBeenCalledWith("ivy");
    const swatch = container.querySelector<HTMLElement>('[data-swatch="ivy"]');
    expect(swatch?.style.getPropertyValue("--swatch")).toBe("#35a365");
  });
});
