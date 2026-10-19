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

  it("gives every swatch an edge, so a near black or near white color shows on any surface", () => {
    const { container } = render(
      <SwatchPicker
        legend="Theme"
        options={[{ value: "taylor", color: "#09090b", name: "taylor" }]}
      />
    );
    const swatch = container.querySelector<HTMLElement>('[data-swatch="taylor"]');
    expect(swatch?.className).toContain("shadow-[inset_0_0_0_1px");
  });

  it("draws the check in the canvas ink, and in the swatch's contrast ink only where relative color works", () => {
    const { container } = render(
      <SwatchPicker
        legend="Theme"
        value="taylor"
        onValueChange={() => {}}
        options={[{ value: "taylor", color: "#09090b", name: "taylor" }]}
      />
    );
    const check = container.querySelector("[data-swatch] svg") as SVGElement;
    expect(check.getAttribute("class")).toContain("text-[var(--bg-canvas)]");
    expect(check.getAttribute("class")).toContain(
      "supports-[color:oklch(from_red_l_c_h)]:text-[var(--check-ink)]"
    );
    expect(check.style.color).toBe("");
  });
});
