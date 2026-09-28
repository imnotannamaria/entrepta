import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { describe, expect, it } from "vitest";
import { MINUS } from "../lib/format";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  chartColor,
  chartGrid,
  chartProjection,
  chartTick,
  chartXAxis,
  formatChartValue,
} from "./chart";

const MONTHS = [
  { month: "Jul", spent: 182000, income: 950000, projected: null },
  { month: "Aug", spent: 196200, income: 950000, projected: null },
  { month: "Sep", spent: 218450, income: 958990, projected: 218450 },
  { month: "Oct", spent: null, income: null, projected: 231000 },
];

async function seen() {
  // the test observer reports the plot on screen one microtask later
  await act(async () => {});
}

describe("ChartContainer", () => {
  it("names the plot and mounts it once on screen", async () => {
    const { container } = render(
      <ChartContainer
        config={{ spent: { label: "spent", color: "chart-1", format: "money" } }}
        height={200}
        label="Spending by month"
        description="Spending rose each month"
        currency="USD"
      >
        <LineChart data={MONTHS}>
          <Line dataKey="spent" />
        </LineChart>
      </ChartContainer>
    );
    expect(container.querySelector("svg")).toBeNull();
    await seen();
    const plot = container.querySelector(".recharts-surface");
    expect(plot).toHaveAttribute("aria-label", "Spending by month");
    expect(plot?.querySelector("desc")).toHaveTextContent("Spending rose each month");
  });

  it("turns palette keys into tokens and refuses a color that carries CSS", () => {
    const { container } = render(
      <ChartContainer
        config={{
          a: { label: "a", color: "chart-3" },
          b: { label: "b", color: "red; background: url(x)" },
        }}
        height={100}
        label="x"
      >
        <LineChart data={[]} />
      </ChartContainer>
    );
    const style = (container.firstChild as HTMLElement).style;
    expect(style.getPropertyValue("--color-a")).toBe("var(--chart-3)");
    expect(style.getPropertyValue("--color-b")).toBe("");
    expect(chartColor("error")).toBe("var(--status-error)");
  });

  it("shows a legend only from three series, unless asked", () => {
    const two: ChartConfig = {
      a: { label: "alpha", color: "chart-1" },
      b: { label: "beta", color: "chart-2" },
    };
    const { rerender } = render(
      <ChartContainer config={two} height={100} label="x">
        <LineChart data={[]} />
      </ChartContainer>
    );
    expect(screen.queryByText("alpha")).not.toBeInTheDocument();
    rerender(
      <ChartContainer
        config={{ ...two, c: { label: "gamma", color: "chart-3" } }}
        height={100}
        label="x"
      >
        <LineChart data={[]} />
      </ChartContainer>
    );
    expect(screen.getByText("gamma")).toBeInTheDocument();
    rerender(
      <ChartContainer config={two} height={100} label="x" legend>
        <LineChart data={[]} />
      </ChartContainer>
    );
    expect(screen.getByText("alpha")).toBeInTheDocument();
  });

  it("shows the same numbers as a table, in full", async () => {
    render(
      <ChartContainer
        config={{
          spent: { label: "spent", color: "chart-1", format: "money" },
          income: { label: "income", color: "chart-2", format: "money" },
        }}
        height={240}
        label="Spending by month"
        data={MONTHS}
        categoryKey="month"
        currency="USD"
      >
        <BarChart data={MONTHS}>
          <Bar dataKey="spent" />
        </BarChart>
      </ChartContainer>
    );
    await userEvent.click(screen.getByRole("button", { name: "View as table" }));
    const table = screen.getByRole("table", { name: "Spending by month" });
    expect(table).toHaveTextContent("$2,184.50");
    expect(table).toHaveTextContent("$9,500.00");
    expect(screen.getByRole("columnheader", { name: "income" })).toBeInTheDocument();
    // October has no spending yet: a dash to see, words to hear
    expect(table).toHaveTextContent("—no data");
    await userEvent.click(screen.getByRole("button", { name: "View as chart" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("formats compact values for an axis and full ones everywhere else", () => {
    expect(formatChartValue(218450, "money", { currency: "USD", compact: true })).toBe("$2.2K");
    expect(formatChartValue(218450, "money", { currency: "USD" })).toBe("$2,184.50");
    expect(formatChartValue(0.125, "percent")).toBe("12.5%");
    expect(formatChartValue(-1200, "number")).toBe(`${MINUS}1,200`);
  });

  it("signs every value of a signed series", async () => {
    render(
      <ChartContainer
        config={{ net: { label: "net", color: "chart-1", format: "money", signed: true } }}
        height={200}
        label="Net"
        data={[
          { month: "Jul", net: 42000 },
          { month: "Aug", net: -12000 },
        ]}
        categoryKey="month"
        currency="USD"
      >
        <BarChart data={[]} />
      </ChartContainer>
    );
    await userEvent.click(screen.getByRole("button", { name: "View as table" }));
    const table = screen.getByRole("table");
    expect(table).toHaveTextContent("+$420.00");
    expect(table).toHaveTextContent(`${MINUS}$120.00`);
    expect(formatChartValue(5000, "money", { currency: "USD", signed: true })).toBe("+$50.00");
  });

  it("never rings the inner layer Recharts focuses on a click, only a keyboard's focus", () => {
    const { container } = render(
      <ChartContainer config={{}} height={100} label="x">
        <LineChart data={[]} />
      </ChartContainer>
    );
    expect(container.firstChild).toHaveClass(
      "[&_g:focus:not(:focus-visible)]:outline-none",
      "[&_g:focus-visible]:outline-[var(--fg-brand)]"
    );
  });

  it("puts axis labels on the mono-xs step", () => {
    expect(chartTick.fontSize).toBe(10);
  });
});

describe("ChartTooltipContent", () => {
  it("shows money in full through Amount, even when the axis is compact", async () => {
    const { container } = render(
      <ChartContainer
        config={{ spent: { label: "spent", color: "chart-1", format: "money" } }}
        height={200}
        label="Spending by month"
        currency="USD"
      >
        <LineChart data={MONTHS}>
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(v: number) =>
              formatChartValue(v, "money", { currency: "USD", compact: true })
            }
          />
          <Line dataKey="spent" isAnimationActive={false} />
          <ChartTooltip content={<ChartTooltipContent />} defaultIndex={2} active />
        </LineChart>
      </ChartContainer>
    );
    await seen();
    const tooltip = container.querySelector(".recharts-tooltip-wrapper") as HTMLElement;
    expect(tooltip).toHaveTextContent("Sep");
    expect(tooltip).toHaveTextContent("spent$2,184.50");
  });
});

describe("chart recipes", () => {
  const config: ChartConfig = {
    spent: { label: "spent", color: "chart-1", format: "money" },
    projected: { label: "projected", color: "chart-1", format: "money" },
  };

  it("line with a projection: dashed and fainter", async () => {
    const { container } = render(
      <ChartContainer
        config={config}
        height={220}
        label="Spending, with October projected"
        currency="USD"
      >
        <AreaChart data={MONTHS}>
          <CartesianGrid {...chartGrid} />
          <XAxis dataKey="month" {...chartXAxis} />
          <YAxis
            tickFormatter={(v: number) =>
              formatChartValue(v, "money", { currency: "USD", compact: true })
            }
          />
          <Area
            dataKey="spent"
            stroke="var(--color-spent)"
            fill="var(--color-spent)"
            isAnimationActive={false}
          />
          <Area
            dataKey="projected"
            stroke="var(--color-projected)"
            fill="var(--color-projected)"
            {...chartProjection}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    );
    await seen();
    const dashed = [...container.querySelectorAll(".recharts-area-curve")].filter(
      (path) => path.getAttribute("stroke-dasharray") === "4 4"
    );
    expect(dashed).toHaveLength(1);
    expect(container.querySelectorAll(".recharts-cartesian-grid-vertical line")).toHaveLength(0);
  });

  it("grouped and stacked bars", async () => {
    const bars: ChartConfig = {
      spent: { label: "spent", color: "chart-1", format: "money" },
      income: { label: "income", color: "chart-2", format: "money" },
    };
    const { container, rerender } = render(
      <ChartContainer config={bars} height={220} label="Income and spending" currency="USD">
        <BarChart data={MONTHS}>
          <Bar dataKey="income" fill="var(--color-income)" isAnimationActive={false} />
          <Bar dataKey="spent" fill="var(--color-spent)" isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
    );
    await seen();
    expect(container.querySelectorAll(".recharts-bar")).toHaveLength(2);
    rerender(
      <ChartContainer config={bars} height={220} label="Income and spending" currency="USD">
        <BarChart data={MONTHS}>
          <Bar
            dataKey="income"
            stackId="all"
            fill="var(--color-income)"
            isAnimationActive={false}
          />
          <Bar dataKey="spent" stackId="all" fill="var(--color-spent)" isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
    );
    expect(container.querySelectorAll(".recharts-bar")).toHaveLength(2);
  });

  it("diverging bars take the status colors by sign", async () => {
    const net = [
      { month: "Jul", net: 42000 },
      { month: "Aug", net: -12000 },
    ];
    const { container } = render(
      <ChartContainer
        config={{ net: { label: "net", color: "chart-1", format: "money" } }}
        height={200}
        label="Net by month"
        currency="USD"
      >
        <BarChart data={net}>
          <Bar dataKey="net" isAnimationActive={false}>
            {net.map((row) => (
              <Cell key={row.month} fill={chartColor(row.net < 0 ? "error" : "success")} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    );
    await seen();
    const fills = [...container.querySelectorAll(".recharts-bar-rectangle path")].map((path) =>
      path.getAttribute("fill")
    );
    expect(fills).toEqual(["var(--status-success)", "var(--status-error)"]);
  });

  it("donut, five slices at most", async () => {
    const slices = [
      { name: "home", value: 192380, fill: chartColor("chart-1") },
      { name: "out", value: 3650, fill: chartColor("chart-2") },
      { name: "learning", value: 6200, fill: chartColor("chart-3") },
    ];
    const { container } = render(
      <ChartContainer
        config={{
          home: { label: "home", color: "chart-1", format: "money" },
          out: { label: "out", color: "chart-2", format: "money" },
          learning: { label: "learning", color: "chart-3", format: "money" },
        }}
        height={220}
        label="Spending by category"
        currency="USD"
      >
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            isAnimationActive={false}
          />
        </PieChart>
      </ChartContainer>
    );
    await seen();
    expect(container.querySelectorAll(".recharts-pie-sector")).toHaveLength(3);
    expect(screen.getByText("learning")).toBeInTheDocument();
  });
});
