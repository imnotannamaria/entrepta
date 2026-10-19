"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  chartGrid,
  chartXAxis,
  chartYAxis,
  formatChartValue,
  useChartMotion,
} from "@entrepta/registry/charts/chart";
import { ChatThread } from "@entrepta/registry/content/chat-thread";
import { Amount } from "@entrepta/registry/data/amount";
import { type ContributionDay, ContributionGrid } from "@entrepta/registry/data/contribution-grid";
import { Delta } from "@entrepta/registry/data/delta";
import { Metric } from "@entrepta/registry/data/metric";
import { Sparkline } from "@entrepta/registry/data/sparkline";
import { Alert } from "@entrepta/registry/feedback/alert";
import { BentoGrid, BentoItem } from "@entrepta/registry/layout/bento-grid";
import { Avatar } from "@entrepta/registry/primitives/avatar";
import { Button } from "@entrepta/registry/primitives/button";
import { Calendar } from "@entrepta/registry/primitives/calendar";
import { Card, CardHeader, CardLabel } from "@entrepta/registry/primitives/card";
import { Checkbox } from "@entrepta/registry/primitives/checkbox";
import { Field } from "@entrepta/registry/primitives/field";
import { Input } from "@entrepta/registry/primitives/input";
import { MoneyInput } from "@entrepta/registry/primitives/money-input";
import { PromptInput } from "@entrepta/registry/primitives/prompt-input";
import { SegmentedControl } from "@entrepta/registry/primitives/segmented-control";
import { Switch } from "@entrepta/registry/primitives/switch";
import type { Icon } from "@phosphor-icons/react";
import {
  BellSimpleIcon,
  CalendarDotsIcon,
  ChartLineUpIcon,
  ChatCircleIcon,
  FireIcon,
  GearSixIcon,
  PiggyBankIcon,
  TextboxIcon,
  TrendUpIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const SPENT = [12, 18, 14, 22, 19, 27, 24, 31, 28, 35, 33, 41];
const SAVED = [8, 9, 12, 11, 15, 17, 16, 21, 24, 23, 28, 32];

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
/** Twelve months of income and spending in cents, drawn once so every render agrees. */
const FLOW = MONTHS.map((month, i) => ({
  month,
  income: 640000 + i * 41000 + Math.round(Math.sin(i / 1.3) * 62000),
  spent: 430000 + Math.round(Math.sin(i / 1.7 + 1) * 120000) + i * 16000,
}));

const MESSAGES = [
  { id: "1", role: "user" as const, content: "Where did the money go in March?" },
  {
    id: "2",
    role: "assistant" as const,
    content: "Mostly home. Rent and groceries are 71% of what you spent, and dining out is up 12%.",
  },
];

/** A year of workouts, drawn once so every render agrees. */
const YEAR: ContributionDay[] = (() => {
  const days: ContributionDay[] = [];
  const start = Date.UTC(2025, 9, 20);
  for (let i = 0; i < 364; i++) {
    const date = new Date(start + i * 86_400_000).toISOString().slice(0, 10);
    const wave = Math.sin(i / 9) + Math.sin(i / 3.1) * 0.6 + (i % 7 === 6 ? -1.2 : 0);
    const level = Math.max(0, Math.min(4, Math.round(wave + 1.6))) as 0 | 1 | 2 | 3 | 4;
    days.push({
      date,
      level,
      state: level === 0 ? "rest day" : `${level} workout${level === 1 ? "" : "s"}`,
    });
  }
  return days;
})();

const compactUsd = (v: number) => formatChartValue(v, "money", { currency: "USD", compact: true });

/**
 * One tile: a card with the component's name and a link to its page. The card
 * stretches to its row, so the grid lines up; nothing inside scrolls on its own
 * in the vertical direction, so the wheel always moves the page.
 */
function Tile({
  icon,
  label,
  slug,
  children,
  header,
}: {
  icon: Icon;
  label: string;
  slug: string;
  children: React.ReactNode;
  /** Something in the header, between the label and the link. */
  header?: React.ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardLabel icon={icon}>{label}</CardLabel>
        <div className="flex items-center gap-3">
          {header}
          <Link
            href={`/docs/components/${slug}`}
            // the visible <slug> reads as "less than slug greater than"
            aria-label={`${slug} docs`}
            className="focus-ring shrink-0 rounded-[var(--radius-sm)] font-mono text-mono-xs text-[var(--fg-muted)] transition-colors hover:text-[var(--fg-brand-text)]"
          >
            {`<${slug}>`}
          </Link>
        </div>
      </CardHeader>
      <div className="flex min-w-0 flex-1 flex-col justify-center">{children}</div>
    </Card>
  );
}

function FlowChart() {
  const [range, setRange] = React.useState<"6m" | "12m">("12m");
  const motion = useChartMotion();
  const data = range === "6m" ? FLOW.slice(6) : FLOW;
  return (
    <Tile
      icon={ChartLineUpIcon}
      label="cash flow"
      slug="chart"
      header={
        <SegmentedControl
          aria-label="Range"
          size="sm"
          value={range}
          onValueChange={(v) => setRange(v as "6m" | "12m")}
          options={[
            { value: "6m", label: "6m" },
            { value: "12m", label: "12m" },
          ]}
        />
      }
    >
      <ChartContainer
        key={range}
        config={{
          income: { label: "income", color: "chart-2", format: "money" },
          spent: { label: "spent", color: "chart-1", format: "money" },
        }}
        height={250}
        label="Income and spending by month"
        data={data}
        categoryKey="month"
        currency="USD"
        legend
      >
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
          <defs>
            {(["income", "spent"] as const).map((key) => (
              <linearGradient key={key} id={`home-fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: `var(--color-${key})`, stopOpacity: 0.32 }} />
                <stop offset="100%" style={{ stopColor: `var(--color-${key})`, stopOpacity: 0 }} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid {...chartGrid} />
          <XAxis dataKey="month" {...chartXAxis} />
          <YAxis {...chartYAxis} tickFormatter={compactUsd} />
          <ChartTooltip
            cursor={{ stroke: "var(--chart-grid)" }}
            content={<ChartTooltipContent />}
          />
          <Area
            dataKey="income"
            stroke="var(--color-income)"
            strokeWidth={2}
            fill="url(#home-fill-income)"
            {...motion}
          />
          <Area
            dataKey="spent"
            stroke="var(--color-spent)"
            strokeWidth={2}
            fill="url(#home-fill-spent)"
            {...motion}
          />
        </AreaChart>
      </ChartContainer>
    </Tile>
  );
}

/**
 * The real components, live, on the bento grid. Nothing here is a screenshot,
 * and every tile names the file you would copy.
 */
export function HomeShowcase() {
  const [day, setDay] = React.useState<string | null>("2026-09-18");
  const [budget, setBudget] = React.useState<number | null>(240000);
  return (
    <BentoGrid className="[--bento-row:150px]">
      <BentoItem colSpan={{ sm: 6, lg: 8 }} rowSpan={{ lg: 2 }}>
        <FlowChart />
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 4 }}>
        <Tile icon={TrendUpIcon} label="spending" slug="metric">
          <Metric
            label="spent this month"
            value={<Amount value={218450} currency="USD" />}
            delta={
              <Delta current={218450} previous={196200} intent="increase-is-bad" variant="pill" />
            }
            comparison="vs August"
            trend={<Sparkline data={SPENT} tone="chart-1" />}
          />
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 4 }}>
        <Tile icon={PiggyBankIcon} label="savings" slug="sparkline">
          <Metric
            label="saved this year"
            value={<Amount value={958990} currency="USD" />}
            delta={<Delta current={958990} previous={812000} variant="pill" />}
            comparison="since January"
            trend={<Sparkline data={SAVED} tone="success" />}
          />
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 6, lg: 5 }} rowSpan={{ lg: 2 }}>
        <Tile icon={ChatCircleIcon} label="assistant" slug="chat-thread">
          <div className="flex h-full flex-col justify-between gap-4">
            <ChatThread
              messages={MESSAGES}
              avatars={{
                user: <Avatar name="Anna Maria" size="sm" />,
                assistant: <Avatar name="Entre Assistant" size="sm" />,
              }}
            />
            <PromptInput
              placeholder="Ask about your money"
              suggestions={["Biggest expense?", "Compare to Feb"]}
              onSubmit={(value) =>
                toast("A demo", { description: `There is no model here, but you asked: ${value}` })
              }
            />
          </div>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 4 }} rowSpan={{ lg: 2 }}>
        <Tile icon={CalendarDotsIcon} label="due dates" slug="calendar">
          <div className="flex justify-center">
            <Calendar value={day} onValueChange={setDay} month="2026-09-01" />
          </div>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 3 }}>
        <Tile icon={BellSimpleIcon} label="sync" slug="alert">
          <Alert tone="warning" title="Partial data">
            Two accounts have not synced today.
          </Alert>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 3 }}>
        <Tile icon={GearSixIcon} label="settings" slug="switch">
          <div className="flex flex-col gap-3">
            <Switch label="Weekly summary" defaultChecked />
            <Switch label="Price alerts" />
            <Checkbox label="Share anonymous usage" defaultChecked />
          </div>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 6, lg: 5 }}>
        <Tile icon={TextboxIcon} label="new budget" slug="money-input">
          <div className="flex flex-col gap-4">
            <Field id="home-name" label="name">
              <Input id="home-name" placeholder="Groceries" />
            </Field>
            <Field
              id="home-limit"
              label="monthly limit"
              hint="Type digits, they fill from the right."
            >
              <MoneyInput id="home-limit" currency="USD" value={budget} onValueChange={setBudget} />
            </Field>
            <div className="flex justify-between gap-2 pt-1">
              <Button variant="ghost" size="sm">
                cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  toast.success("Budget saved", { description: "A demo, nothing was sent." })
                }
              >
                save budget
              </Button>
            </div>
          </div>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 6, lg: 7 }}>
        <Tile icon={FireIcon} label="workouts" slug="contribution-grid">
          <ContributionGrid label="Workouts in the last year" days={YEAR} />
        </Tile>
      </BentoItem>
    </BentoGrid>
  );
}
