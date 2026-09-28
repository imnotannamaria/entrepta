/**
 * The chart recipes, as code to copy. The Chart page renders each one live
 * (component-preview.tsx) and prints this code in its usage and its Markdown
 * twin, so an agent reading the .md gets every recipe.
 */

export type ChartRecipe = { id: string; title: string; note: string; code: string };

const SETUP = `import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  chartColor, chartCursor, chartGrid, chartProjection, chartXAxis, chartYAxis,
  formatChartValue, useChartMotion,
} from "@/components/entrepta/chart"
import { formatMoney } from "@/lib/format"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Label, Pie, PieChart,
  ReferenceLine, XAxis, YAxis } from "recharts"

// money in minor units; the axis compact, the tooltip and the table in full
const compact = (v: number) => formatChartValue(v, "money", { currency: "USD", compact: true })
// inside your component: no entrance with reduced motion
const motion = useChartMotion()`;

export const CHART_RECIPES: ChartRecipe[] = [
  {
    id: "area",
    title: "Area with a projection",
    note: "The months to come are dashed, fainter and named projected.",
    code: `<ChartContainer
  config={{
    spent: { label: "spent", color: "chart-1", format: "money" },
    projected: { label: "projected", color: "chart-1", format: "money" },
  }}
  height={260}
  label="Spending by month, October and November projected"
  data={months}
  categoryKey="month"
>
  <AreaChart data={months} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
    <defs>
      <linearGradient id="fill-spent" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" style={{ stopColor: "var(--color-spent)", stopOpacity: 0.35 }} />
        <stop offset="100%" style={{ stopColor: "var(--color-spent)", stopOpacity: 0 }} />
      </linearGradient>
    </defs>
    <CartesianGrid {...chartGrid} />
    <XAxis dataKey="month" {...chartXAxis} />
    <YAxis {...chartYAxis} tickFormatter={compact} />
    <ChartTooltip cursor={{ stroke: "var(--chart-grid)" }} content={<ChartTooltipContent />} />
    <Area dataKey="spent" stroke="var(--color-spent)" strokeWidth={2} fill="url(#fill-spent)" {...motion} />
    <Area dataKey="projected" stroke="var(--color-projected)" fill="var(--color-projected)" {...chartProjection} {...motion} />
  </AreaChart>
</ChartContainer>`,
  },
  {
    id: "grouped",
    title: "Grouped bars",
    note: "Two series side by side; name them in the card, so no legend.",
    code: `<ChartContainer
  config={{
    income: { label: "income", color: "chart-2", format: "money" },
    spent: { label: "spent", color: "chart-1", format: "money" },
  }}
  height={260}
  label="Income and spending by month"
  data={months}
  categoryKey="month"
>
  <BarChart data={months} barGap={4}>
    <CartesianGrid {...chartGrid} />
    <XAxis dataKey="month" {...chartXAxis} />
    <YAxis {...chartYAxis} tickFormatter={compact} />
    <ChartTooltip cursor={chartCursor} content={<ChartTooltipContent />} />
    <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} {...motion} />
    <Bar dataKey="spent" fill="var(--color-spent)" radius={[4, 4, 0, 0]} {...motion} />
  </BarChart>
</ChartContainer>`,
  },
  {
    id: "diverging",
    title: "Diverging bars",
    note: "Above and below zero: the one place the status colors appear, always with a sign.",
    code: `<ChartContainer
  config={{ net: { label: "net", color: "chart-1", format: "money", signed: true } }}
  height={260}
  label="What was left each month, income minus spending"
  data={net}
  categoryKey="month"
>
  <BarChart data={net}>
    <CartesianGrid {...chartGrid} />
    <XAxis dataKey="month" {...chartXAxis} />
    <YAxis {...chartYAxis} tickFormatter={compact} />
    <ReferenceLine y={0} stroke="var(--border-strong)" />
    <ChartTooltip cursor={chartCursor} content={<ChartTooltipContent />} />
    <Bar dataKey="net" radius={4} {...motion}>
      {net.map((row) => (
        <Cell key={row.month} fill={chartColor(row.net < 0 ? "error" : "success")} />
      ))}
    </Bar>
  </BarChart>
</ChartContainer>`,
  },
  {
    id: "stacked",
    title: "Stacked bars",
    note: "Parts of a whole over time; three series, so the legend shows.",
    code: `<ChartContainer
  config={{
    home: { label: "home", color: "chart-1", format: "money" },
    out: { label: "out", color: "chart-3", format: "money" },
    learning: { label: "learning", color: "chart-5", format: "money" },
  }}
  height={280}
  label="Spending by category and month"
  data={byCategory}
  categoryKey="month"
>
  <BarChart data={byCategory}>
    <CartesianGrid {...chartGrid} />
    <XAxis dataKey="month" {...chartXAxis} />
    <YAxis {...chartYAxis} tickFormatter={compact} />
    <ChartTooltip cursor={chartCursor} content={<ChartTooltipContent />} />
    <Bar dataKey="home" stackId="month" fill="var(--color-home)" {...motion} />
    <Bar dataKey="out" stackId="month" fill="var(--color-out)" {...motion} />
    <Bar dataKey="learning" stackId="month" fill="var(--color-learning)" radius={[4, 4, 0, 0]} {...motion} />
  </BarChart>
</ChartContainer>`,
  },
  {
    id: "donut",
    title: "Donut",
    note: "Five slices at most; past that, a BarList reads better.",
    code: `<ChartContainer config={categoryConfig} height={260} label="Spending by category in September">
  <PieChart>
    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
    <Pie data={slices} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%"
      paddingAngle={2} cornerRadius={4} stroke="none" {...motion}>
      {slices.map((s) => <Cell key={s.name} fill={\`var(--color-\${s.name})\`} />)}
      {/* the total in the hole: the pie sits at the plot's center */}
      <Label position="center" content={() => (
        <text x="50%" y="50%" textAnchor="middle" className="fill-[var(--fg-primary)] font-mono text-heading-md">
          {formatMoney(total, { currency: "USD" })}
        </text>
      )} />
    </Pie>
  </PieChart>
</ChartContainer>`,
  },
];

/** Every recipe in one block, for the page's usage and its Markdown twin. */
export const CHART_USAGE = [
  SETUP,
  ...CHART_RECIPES.map((recipe) => `// ${recipe.title}. ${recipe.note}\n${recipe.code}`),
].join("\n\n");
