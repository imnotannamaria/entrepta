"use client";

import { ChatThread } from "@entrepta/registry/content/chat-thread";
import { Amount } from "@entrepta/registry/data/amount";
import { BarList } from "@entrepta/registry/data/bar-list";
import { Delta } from "@entrepta/registry/data/delta";
import { Metric } from "@entrepta/registry/data/metric";
import { Sparkline } from "@entrepta/registry/data/sparkline";
import { Alert } from "@entrepta/registry/feedback/alert";
import { BentoGrid, BentoItem } from "@entrepta/registry/layout/bento-grid";
import { Avatar, AvatarGroup } from "@entrepta/registry/primitives/avatar";
import { Badge } from "@entrepta/registry/primitives/badge";
import { Button } from "@entrepta/registry/primitives/button";
import { Card, CardHeader, CardLabel } from "@entrepta/registry/primitives/card";
import { Checkbox } from "@entrepta/registry/primitives/checkbox";
import { Field } from "@entrepta/registry/primitives/field";
import { Input } from "@entrepta/registry/primitives/input";
import { Progress } from "@entrepta/registry/primitives/progress";
import { PromptInput } from "@entrepta/registry/primitives/prompt-input";
import { SegmentedControl } from "@entrepta/registry/primitives/segmented-control";
import { Stepper } from "@entrepta/registry/primitives/stepper";
import { Switch } from "@entrepta/registry/primitives/switch";
import type { Icon } from "@phosphor-icons/react";
import {
  BankIcon,
  BellSimpleIcon,
  ChartBarHorizontalIcon,
  ChatCircleIcon,
  FlagCheckeredIcon,
  GaugeIcon,
  GearSixIcon,
  ListChecksIcon,
  TextboxIcon,
  TrendUpIcon,
  UserIcon,
  UsersThreeIcon,
  WalletIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { toast } from "sonner";

const SPENT = [12, 18, 14, 22, 19, 27, 24, 31, 28, 35, 33, 41];

const STEPS = [
  { id: "account", label: "Account", description: "Name and email", icon: UserIcon },
  { id: "bank", label: "Connect a bank", description: "Read only", icon: BankIcon },
  { id: "budget", label: "First budget", description: "Two minutes", icon: WalletIcon },
  { id: "done", label: "Done", icon: FlagCheckeredIcon },
];

const MESSAGES = [
  { id: "1", role: "user" as const, content: "Where did the money go in March?" },
  {
    id: "2",
    role: "assistant" as const,
    content: "Mostly home. Rent and groceries are 71% of what you spent.",
  },
];

const PEOPLE = ["Anna Maria", "Lin Chen", "Rafa Souza", "Noor Haddad", "Theo Blum", "Ines Prado"];

/**
 * One tile: a card with the component's name and a link to its page. The card
 * stretches to its row, so the grid lines up; nothing inside scrolls on its own,
 * so the wheel always moves the page.
 */
function Tile({
  icon,
  label,
  slug,
  children,
}: {
  icon: Icon;
  label: string;
  slug: string;
  children: ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardLabel icon={icon}>{label}</CardLabel>
        <Link
          href={`/docs/components/${slug}`}
          className="focus-ring shrink-0 rounded-[var(--radius-sm)] font-mono text-mono-xs text-[var(--fg-muted)] transition-colors hover:text-[var(--fg-brand-text)]"
        >
          {`<${slug}>`}
        </Link>
      </CardHeader>
      <div className="flex min-w-0 flex-1 flex-col justify-center">{children}</div>
    </Card>
  );
}

/**
 * The real components, live, on the bento grid. Nothing here is a screenshot,
 * and every tile names the file you would copy.
 */
export function HomeShowcase() {
  return (
    <BentoGrid className="[--bento-row:160px]">
      <BentoItem colSpan={{ sm: 6, lg: 4 }}>
        <Tile icon={TrendUpIcon} label="spending" slug="metric">
          <Metric
            label="spent this month"
            value={<Amount value={218450} currency="USD" />}
            delta={
              <Delta current={218450} previous={196200} intent="increase-is-bad" variant="pill" />
            }
            comparison="vs February"
            trend={<Sparkline data={SPENT} tone="chart-1" />}
          />
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 6, lg: 8 }}>
        <Tile icon={ListChecksIcon} label="onboarding" slug="stepper">
          <Stepper steps={STEPS} current="bank" />
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 4 }} rowSpan={{ lg: 2 }}>
        <Tile icon={TextboxIcon} label="sign up" slug="field">
          <div className="flex flex-col gap-4">
            <Field id="home-name" label="name">
              <Input id="home-name" placeholder="Ada Lovelace" />
            </Field>
            <Field id="home-email" label="email" required hint="We never share it.">
              <Input id="home-email" type="email" placeholder="you@company.com" />
            </Field>
            <SegmentedControl
              aria-label="Billing"
              defaultValue="monthly"
              className="w-full"
              options={[
                { value: "monthly", label: "monthly" },
                { value: "yearly", label: "yearly" },
              ]}
            />
            <div className="flex justify-between gap-2 pt-1">
              <Button variant="ghost" size="sm">
                cancel
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  toast.success("Subscribed", { description: "A demo, nothing was sent." })
                }
              >
                subscribe
              </Button>
            </div>
          </div>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 4 }} rowSpan={{ lg: 2 }}>
        <Tile icon={ChatCircleIcon} label="assistant" slug="chat-thread">
          <div className="flex h-full flex-col justify-between gap-4">
            <ChatThread messages={MESSAGES} />
            <PromptInput
              placeholder="Ask about your money"
              onSubmit={(value) =>
                toast("A demo", { description: `No model here, but you asked: ${value}` })
              }
            />
          </div>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 4 }}>
        <Tile icon={GaugeIcon} label="budgets" slug="progress">
          <div className="flex flex-col gap-4">
            <Progress label="groceries" value={72} showValue />
            <Progress label="months saved" value={9} max={12} segments={12} showValue />
          </div>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 4 }}>
        <Tile icon={BellSimpleIcon} label="sync" slug="alert">
          <Alert tone="warning" title="Partial data">
            Two accounts have not synced today.
          </Alert>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 6, lg: 5 }}>
        <Tile icon={ChartBarHorizontalIcon} label="where it went" slug="bar-list">
          <BarList
            format="money"
            currency="USD"
            items={[
              { label: "Housing", value: 182000, color: "chart-1" },
              { label: "Groceries", value: 64000, color: "chart-2" },
              { label: "Transport", value: 31000, color: "chart-3" },
              { label: "Fun", value: 18000, color: "chart-4" },
            ]}
          />
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 4 }}>
        <Tile icon={GearSixIcon} label="settings" slug="switch">
          <div className="flex flex-col gap-3">
            <Switch label="Weekly summary" defaultChecked />
            <Switch label="Price alerts" />
            <Checkbox label="Share anonymous usage" defaultChecked />
          </div>
        </Tile>
      </BentoItem>

      <BentoItem colSpan={{ sm: 3, lg: 3 }}>
        <Tile icon={UsersThreeIcon} label="team" slug="avatar">
          <div className="flex flex-col gap-4">
            <AvatarGroup max={4} aria-label="Team">
              {PEOPLE.map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </AvatarGroup>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="soft" color="success" dot>
                shipped
              </Badge>
              <Badge variant="soft" color="brand">
                v4
              </Badge>
              <Badge variant="outline" color="neutral">
                MIT
              </Badge>
            </div>
          </div>
        </Tile>
      </BentoItem>
    </BentoGrid>
  );
}
