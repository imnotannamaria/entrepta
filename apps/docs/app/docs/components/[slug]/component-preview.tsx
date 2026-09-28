"use client";

import { COMPONENT_INDEX } from "@/lib/component-index";
import { DEFAULT_MODE, DEFAULT_THEME, STORAGE_KEY_PREFIX, THEMES } from "@/lib/theme";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import {
  DisplayH2,
  DocLabel,
  Em,
  Prose,
  Section,
  Strong,
} from "@entrepta/registry/content/doc-parts";
import { SectHead } from "@entrepta/registry/content/sect-head";
import { Amount } from "@entrepta/registry/data/amount";
import { ChromeMessage } from "@entrepta/registry/feedback/chrome-message";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFoot,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@entrepta/registry/feedback/command-palette";
import { PageLoading } from "@entrepta/registry/feedback/page-loading";
import { Skeleton, SkeletonText } from "@entrepta/registry/feedback/skeleton";
import { ModeToggle } from "@entrepta/registry/layout/mode-toggle";
import { PageOutline } from "@entrepta/registry/layout/page-outline";
import { Sidebar } from "@entrepta/registry/layout/sidebar";
import { StatusBar, StatusBarItem, StatusBarSeparator } from "@entrepta/registry/layout/status-bar";
import { ThemeSwitcher } from "@entrepta/registry/layout/theme-switcher";
import {
  TopNav,
  TopNavBreadcrumb,
  TopNavLink,
  TopNavLogo,
  TopNavLogoMark,
  TopNavMenu,
  TopNavSeparator,
} from "@entrepta/registry/layout/top-nav";
import { ArrowLink } from "@entrepta/registry/motion/arrow-link";
import { Reveal } from "@entrepta/registry/motion/reveal";
import { RollingNumber, useRollOnHover } from "@entrepta/registry/motion/rolling-number";
import { Spotlight, useSpotlight } from "@entrepta/registry/motion/spotlight";
import { TypeIn } from "@entrepta/registry/motion/type-in";
import { Avatar, AvatarGroup } from "@entrepta/registry/primitives/avatar";
import { Badge } from "@entrepta/registry/primitives/badge";
import { Button } from "@entrepta/registry/primitives/button";
import { Calendar, type DateRange } from "@entrepta/registry/primitives/calendar";
import {
  Card,
  CardComment,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTerminalBar,
  CardTerminalBody,
  CardTitle,
} from "@entrepta/registry/primitives/card";
import { Checkbox } from "@entrepta/registry/primitives/checkbox";
import { Combobox, type ComboboxOption } from "@entrepta/registry/primitives/combobox";
import { DateNavigator } from "@entrepta/registry/primitives/date-navigator";
import { DatePicker } from "@entrepta/registry/primitives/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogLabel,
  DialogTitle,
  DialogTrigger,
} from "@entrepta/registry/primitives/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuDestructiveItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@entrepta/registry/primitives/dropdown";
import { Field } from "@entrepta/registry/primitives/field";
import { FilterPill } from "@entrepta/registry/primitives/filter-pill";
import { Input } from "@entrepta/registry/primitives/input";
import { Kbd } from "@entrepta/registry/primitives/kbd";
import { MoneyInput } from "@entrepta/registry/primitives/money-input";
import { Popover, PopoverContent, PopoverTrigger } from "@entrepta/registry/primitives/popover";
import { SegmentedControl } from "@entrepta/registry/primitives/segmented-control";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@entrepta/registry/primitives/select";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@entrepta/registry/primitives/sheet";
import { Switch } from "@entrepta/registry/primitives/switch";
import { TabNav, TabNavLink } from "@entrepta/registry/primitives/tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";
import { Textarea } from "@entrepta/registry/primitives/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipShortcut,
  TooltipTrigger,
} from "@entrepta/registry/primitives/tooltip";
import {
  ArrowRightIcon,
  BracketsCurlyIcon,
  CaretDownIcon,
  CheckIcon,
  FileCodeIcon,
  FileMdIcon,
  FileTsxIcon,
  GearIcon,
  GitBranchIcon,
  HouseIcon,
  HouseLineIcon,
  InfoIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  RobotIcon,
  RocketLaunchIcon,
  SignOutIcon,
  SparkleIcon,
  SquaresFourIcon,
  TagIcon,
  TerminalWindowIcon,
  UserIcon,
  UserSquareIcon,
  WarningIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

/** One labelled row of a preview. */
function Demo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function ButtonPreview() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex w-full max-w-xl flex-col gap-7">
      <Demo label="variants">
        <Button>./projects.sh →</Button>
        <Button variant="secondary">$ npx @entrepta/cli@latest init</Button>
        <Button variant="ghost">cat contact.txt</Button>
        <Button variant="command">npx @entrepta/cli add button</Button>
      </Demo>
      <Demo label="with an icon">
        <Button>
          <RocketLaunchIcon aria-hidden size={14} weight="fill" /> deploy
        </Button>
        <Button variant="secondary">
          <GitBranchIcon aria-hidden size={14} /> new branch
        </Button>
        <Button
          variant="ghost"
          className="[&_svg]:transition-transform hover:[&_svg]:translate-x-0.5"
        >
          read the docs <ArrowRightIcon aria-hidden size={14} />
        </Button>
      </Demo>
      <Demo label="icon only">
        <Button size="icon-sm" variant="ghost" aria-label="Search">
          <MagnifyingGlassIcon aria-hidden size={14} />
        </Button>
        <Button size="icon-md" variant="secondary" aria-label="Settings">
          <GearIcon aria-hidden size={16} />
        </Button>
        <Button size="icon-lg" aria-label="Add a component">
          <PlusIcon aria-hidden size={18} weight="bold" />
        </Button>
      </Demo>
      <Demo label="sizes">
        <Button size="sm">small 32h</Button>
        <Button size="md">medium 40h</Button>
        <Button size="lg">large 48h</Button>
      </Demo>
      <Demo label="states">
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          click to load
        </Button>
        <Button disabled>disabled</Button>
      </Demo>
    </div>
  );
}

function BadgePreview() {
  const colors = ["neutral", "brand", "success", "warning", "error", "info"] as const;
  const icons = {
    neutral: TagIcon,
    brand: SparkleIcon,
    success: CheckIcon,
    warning: WarningIcon,
    error: XIcon,
    info: InfoIcon,
  } as const;
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      {(["solid", "soft", "outline"] as const).map((variant) => (
        <Demo key={variant} label={variant}>
          {colors.map((color) => (
            <Badge key={color} variant={variant} color={color}>
              {color}
            </Badge>
          ))}
        </Demo>
      ))}
      <Demo label="with an icon">
        <Badge variant="soft" color="success" icon={CheckIcon}>
          passing
        </Badge>
        <Badge variant="soft" color="error" icon={XIcon}>
          failed
        </Badge>
        <Badge variant="outline" color="brand" icon={GitBranchIcon}>
          main
        </Badge>
        <Badge variant="solid" color="brand" icon={SparkleIcon}>
          NEW
        </Badge>
        {colors.map((color) => (
          <Badge key={color} size="sm" variant="soft" color={color} icon={icons[color]}>
            {color}
          </Badge>
        ))}
      </Demo>
      <Demo label="with a dot">
        <Badge variant="soft" color="success" dot>
          open to work
        </Badge>
        <Badge variant="soft" color="warning" dot>
          partial
        </Badge>
        <Badge variant="soft" color="info" dot>
          syncing
        </Badge>
        <Badge variant="soft" color="neutral" dot>
          idle
        </Badge>
      </Demo>
    </div>
  );
}

const PEOPLE = [
  { name: "Ana Lima", src: "/avatars/ana.svg" },
  { name: "Bruno Reis", src: "/avatars/bruno.svg" },
  { name: "Caio Dias", src: "/avatars/caio.svg" },
  { name: "Duda Melo", src: "/avatars/duda.svg" },
  { name: "Eva Rios", src: "/avatars/eva.svg" },
  { name: "Felipe Sá", src: "/avatars/felipe.svg" },
  { name: "Gabi Nunes" },
];

function AvatarPreview() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-7">
      <Demo label="sizes">
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <Avatar key={size} size={size} name="Ana Lima" src="/avatars/ana.svg" />
        ))}
      </Demo>
      <Demo label="initials, and a square for things">
        <Avatar name="Anna Maria" />
        <Avatar name="Anna Maria" color="brand" />
        <Avatar name="entrepta" shape="square" />
        <Avatar name="deploy bot" shape="square" color="brand" icon={RobotIcon} />
        <Avatar name="entrepta repo" shape="square" icon={GitBranchIcon} />
      </Demo>
      <Demo label="the active profile">
        <Avatar size="lg" name="Ana Lima" src="/avatars/ana.svg" emphasis="ring" />
        <Avatar size="lg" name="Anna Maria" color="brand" emphasis="ring" />
      </Demo>
      <Demo label="status">
        {(["online", "away", "busy", "offline"] as const).map((status) => (
          <Avatar
            key={status}
            size="lg"
            name="Bruno Reis"
            src="/avatars/bruno.svg"
            status={status}
          />
        ))}
      </Demo>
      <Demo label="a group">
        <AvatarGroup max={4} aria-label="contributors">
          {PEOPLE.map((p) => (
            <Avatar key={p.name} name={p.name} src={p.src} />
          ))}
        </AvatarGroup>
        <AvatarGroup size="sm" aria-label="reviewers">
          {PEOPLE.slice(0, 3).map((p) => (
            <Avatar key={p.name} name={p.name} src={p.src} />
          ))}
        </AvatarGroup>
      </Demo>
      <Demo label="a broken image keeps the initials">
        <Avatar name="Caio Dias" src="/avatars/missing.svg" />
      </Demo>
      <Demo label="beside a name">
        <span className="flex items-center gap-2 font-mono text-mono-sm text-[var(--fg-secondary)]">
          <Avatar size="sm" name="Duda Melo" src="/avatars/duda.svg" aria-hidden />
          duda melo
          <span className="text-[var(--fg-muted)]">committed 2h ago</span>
        </span>
      </Demo>
    </div>
  );
}

function AmountPreview() {
  const rows = [
    { label: "rent", value: -180000 },
    { label: "salary", value: 950000 },
    { label: "coffee", value: -1250 },
    { label: "refund", value: 8990 },
  ];
  return (
    <div className="flex w-full max-w-xl flex-col gap-7">
      <Demo label="the same amount, four currencies">
        <Amount value={123456} currency="BRL" locale="pt-BR" />
        <Amount value={123456} currency="EUR" locale="de-DE" />
        <Amount value={123456} currency="USD" locale="en-US" />
        <Amount value={1234} currency="JPY" locale="ja-JP" />
      </Demo>
      <Demo label="tone, always with a sign">
        <Amount value={4500} currency="USD" tone="auto" />
        <Amount value={-4500} currency="USD" tone="auto" />
        <Amount value={0} currency="USD" tone="auto" />
      </Demo>
      <Demo label="compact, the full value on hover">
        <Amount value={110000} currency="BRL" locale="pt-BR" compact />
        <Amount value={123456789} currency="USD" compact />
      </Demo>
      <Demo label="a large value with muted cents">
        <Amount
          value={2350000}
          currency="USD"
          muteCents
          className="font-serif text-display-md text-[var(--fg-primary)]"
        />
      </Demo>
      <Demo label="tabular figures line up">
        <ul className="m-0 flex w-full max-w-xs list-none flex-col gap-1.5 p-0">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-4 font-mono text-mono-sm"
            >
              <span className="text-[var(--fg-secondary)]">{row.label}</span>
              <Amount value={row.value} currency="USD" tone="auto" />
            </li>
          ))}
        </ul>
      </Demo>
    </div>
  );
}

function MoneyInputPreview() {
  const [cash, setCash] = useState<number | null>(123456);
  const [free, setFree] = useState<number | null>(null);
  const held = (value: number | null) => (value === null ? "null" : String(value));
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Field id="money-cash" label="amount" hint={`holds ${held(cash)}, in cents`}>
        <MoneyInput currency="BRL" locale="pt-BR" size="lg" value={cash} onValueChange={setCash} />
      </Field>
      <Field
        id="money-free"
        label="free entry"
        hint={`holds ${held(free)}. Paste 1,234.56 or R$ 99,90`}
      >
        <MoneyInput
          currency="EUR"
          locale="de-DE"
          entry="free"
          value={free}
          onValueChange={setFree}
        />
      </Field>
    </div>
  );
}

function SelectPreview() {
  const [size, setSize] = useState("");
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Field
        id="select-size"
        label="export size"
        hint={size ? `value: ${size}` : "nothing picked yet"}
      >
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger>
            <SelectValue placeholder="Pick a size…" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>phone</SelectLabel>
              <SelectItem value="story" hint="1080×1920">
                story
              </SelectItem>
              <SelectItem value="square" hint="1080×1080">
                square
              </SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>desktop</SelectLabel>
              <SelectItem value="wide" hint="1920×1080">
                wide
              </SelectItem>
              <SelectItem value="print" hint="A4" disabled>
                print
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field id="select-error" label="year" error="Pick the year to show">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pick a year…" />
          </SelectTrigger>
          <SelectContent>
            {["2026", "2025", "2024"].map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

// Every IANA zone the browser knows, grouped by region: a long list worth searching.
const ZONES: ComboboxOption[] = (() => {
  const all =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("timeZone")
      : ["America/Sao_Paulo", "America/New_York", "Europe/Lisbon", "Asia/Tokyo"];
  return all.map((zone) => {
    const [region, ...rest] = zone.split("/");
    return {
      value: zone,
      label: (rest.join(" / ") || region).replaceAll("_", " "),
      group: region,
      keywords: [zone],
    };
  });
})();

function ComboboxPreview() {
  const [zone, setZone] = useState<string | null>("America/Sao_Paulo");
  const [tagOptions, setTagOptions] = useState<ComboboxOption[]>(
    ["design", "docs", "release", "research"].map((t) => ({ value: t, label: t }))
  );
  const [tags, setTags] = useState<string[]>(["docs"]);
  const [category, setCategory] = useState<string | null>("groceries");
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Field id="combo-zone" label="time zone" hint={`${ZONES.length} zones. Try "tok" or "sao"`}>
        <Combobox
          options={ZONES}
          value={zone}
          onValueChange={setZone}
          placeholder="Pick a time zone…"
          searchPlaceholder="Search time zones…"
          emptyText="No time zones match"
        />
      </Field>
      <Field id="combo-tags" label="tags" hint="several values; type a new one to create it">
        <Combobox
          multiple
          creatable
          onCreate={(label) => {
            setTagOptions((now) => [...now, { value: label, label }]);
            return label;
          }}
          options={tagOptions}
          value={tags}
          onValueChange={setTags}
          placeholder="Add tags…"
          searchPlaceholder="Search or create a tag…"
        />
      </Field>
      <Field id="combo-category" label="category" hint="one suggested, to confirm">
        <Combobox
          options={[
            { value: "groceries", label: "groceries", group: "home", suggested: true },
            { value: "rent", label: "rent", group: "home" },
            { value: "coffee", label: "coffee", group: "out" },
            { value: "cinema", label: "cinema", group: "out" },
          ]}
          value={category}
          onValueChange={setCategory}
          searchPlaceholder="Search categories…"
        />
      </Field>
    </div>
  );
}

function SegmentedControlPreview() {
  const [kind, setKind] = useState("expense");
  return (
    <div className="flex flex-col items-start gap-6">
      <SegmentedControl
        aria-label="kind"
        options={[
          { value: "expense", label: "expense" },
          { value: "income", label: "income" },
          { value: "transfer", label: "transfer" },
        ]}
        value={kind}
        onValueChange={setKind}
      />
      <SegmentedControl
        aria-label="period"
        size="sm"
        defaultValue="6M"
        options={["3M", "6M", "12M"].map((v) => ({ value: v, label: v }))}
      />
      <SegmentedControl
        aria-label="view"
        defaultValue="list"
        options={[
          { value: "list", label: "list", icon: <ListIcon /> },
          { value: "grid", label: "grid", icon: <SquaresFourIcon /> },
        ]}
      />
    </div>
  );
}

const DATA_DAYS = new Set([
  "2026-09-02",
  "2026-09-03",
  "2026-09-08",
  "2026-09-15",
  "2026-09-16",
  "2026-09-22",
]);

function CalendarPreview() {
  const [day, setDay] = useState<string | null>("2026-09-15");
  const [range, setRange] = useState<DateRange | null>({ start: "2026-09-08", end: "2026-09-12" });
  return (
    <div className="flex flex-wrap items-start justify-center gap-10">
      <div className="flex flex-col gap-2">
        <Calendar
          value={day}
          onValueChange={setDay}
          month="2026-09-01"
          max="2026-09-27"
          renderDay={(d) =>
            DATA_DAYS.has(d) ? (
              <span aria-hidden className="size-1 rounded-full bg-[var(--fg-brand)]" />
            ) : null
          }
        />
        <span className="font-mono text-mono-xs text-[var(--fg-muted)]">
          {day ?? "no day"} · dots mark days with data
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Calendar mode="range" value={range} onValueChange={setRange} month="2026-09-01" />
        <span className="font-mono text-mono-xs text-[var(--fg-muted)]">
          {range ? `${range.start} → ${range.end ?? "…"}` : "no range"}
        </span>
      </div>
    </div>
  );
}

function DatePickerPreview() {
  const [day, setDay] = useState<string | null>("2026-09-15");
  const [range, setRange] = useState<DateRange | null>(null);
  const [month, setMonth] = useState<string | null>("2026-09");
  const [year, setYear] = useState<string | null>("2026");
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Field id="dp-day" label="date">
        <DatePicker value={day} onValueChange={setDay} max="2026-12-31" />
      </Field>
      <Field id="dp-range" label="period">
        <DatePicker
          mode="range"
          value={range}
          onValueChange={setRange}
          placeholder="Pick a period…"
          presets={[
            { label: "This month", value: { start: "2026-09-01", end: "2026-09-30" } },
            { label: "Last month", value: { start: "2026-08-01", end: "2026-08-31" } },
            { label: "Last 3 months", value: { start: "2026-07-01", end: "2026-09-30" } },
          ]}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field id="dp-month" label="month">
          <DatePicker granularity="month" value={month} onValueChange={setMonth} />
        </Field>
        <Field id="dp-year" label="year">
          <DatePicker granularity="year" value={year} onValueChange={setYear} />
        </Field>
      </div>
    </div>
  );
}

function DateNavigatorPreview() {
  const [day, setDay] = useState("2026-09-27");
  const [month, setMonth] = useState("2026-09");
  return (
    <div className="flex flex-col items-start gap-5">
      <DateNavigator
        aria-label="day"
        value={day}
        onValueChange={setDay}
        min="2026-09-01"
        max="2026-09-30"
      />
      <DateNavigator
        aria-label="month"
        granularity="month"
        value={month}
        onValueChange={setMonth}
      />
      <span className="font-mono text-mono-xs text-[var(--fg-muted)]">
        {day} · {month} · the day stops at Sep 1 and Sep 30
      </span>
    </div>
  );
}

function InputPreview() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <Input placeholder="project-name" />
      <Input variant="search" placeholder="search components…" />
      <Input variant="command" placeholder="run command…" />
      <Input state="error" defaultValue="HEALTHKIT_KEY" />
      <Input disabled placeholder="readonly" />
      <div className="grid grid-cols-3 gap-2">
        <Input size="sm" placeholder="sm" />
        <Input size="md" placeholder="md" />
        <Input size="lg" placeholder="lg" />
      </div>
    </div>
  );
}

function CardPreview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardLabel>latest post</CardLabel>
          <CardMeta>apr 12 · 1 min</CardMeta>
        </CardHeader>
        <CardTitle>
          Plain markdown beats <em>Notion</em>.
        </CardTitle>
        <CardDescription>
          Two years of notes moved out of a database and into plain text and git. What held up.
        </CardDescription>
        <CardFooter>
          <span>read →</span>
          <CardComment>draft</CardComment>
        </CardFooter>
      </Card>

      <Card variant="featured">
        <CardHeader>
          <CardLabel>open-source-kit</CardLabel>
          <Badge variant="solid" color="brand">
            FEATURED
          </Badge>
        </CardHeader>
        <CardTitle>
          Components, in <em>React</em>.
        </CardTitle>
        <CardDescription>
          A dark-first kit of typed primitives. Copy-paste, own the source, ship faster.
        </CardDescription>
        <CardFooter>
          <CardComment>shipped 2025-11</CardComment>
          <span>github ↗</span>
        </CardFooter>
      </Card>

      <Card variant="terminal">
        <CardTerminalBar>
          <CardLabel>install</CardLabel>
          <CardMeta>v2.0.0</CardMeta>
        </CardTerminalBar>
        <CardTerminalBody>
          <div>
            <span className="text-[var(--fg-muted)]">$</span> npx{" "}
            <span className="text-[var(--fg-brand-text)]">@entrepta/cli@latest</span> init
          </div>
          <div>
            <span className="text-[var(--fg-muted)]">$</span> npx @entrepta/cli@latest add{" "}
            <span className="text-[var(--status-success-fg)]">button</span>
          </div>
          <div className="text-[var(--fg-muted)] mt-2">{"// 1 component installed"}</div>
        </CardTerminalBody>
      </Card>

      <Card variant="data">
        <CardHeader>
          <CardLabel>oss '26</CardLabel>
          <Badge variant="soft" color="success" dot>
            +11
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="font-serif text-display-md text-[var(--fg-primary)] leading-none">
            <em className="italic text-[var(--fg-brand)]">11</em>
          </div>
          <div className="font-mono text-mono-sm text-[var(--fg-muted)] mt-1">repos shipped</div>
        </CardContent>
        <CardFooter>
          <CardComment>consistent</CardComment>
          <span>updated 21:14</span>
        </CardFooter>
      </Card>
    </div>
  );
}

function PopoverPreview() {
  const kinds = ["posts", "notes", "talks"] as const;
  const [shown, setShown] = useState<string[]>(["posts", "notes"]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          filters <Badge size="sm">{shown.length}</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Filters" className="flex w-64 flex-col gap-3">
        <span className="font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
          show
        </span>
        {kinds.map((kind) => (
          <Checkbox
            key={kind}
            label={kind}
            checked={shown.includes(kind)}
            onChange={(event) =>
              setShown((now) =>
                event.target.checked ? [...now, kind] : now.filter((k) => k !== kind)
              )
            }
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}

function SheetPreview() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setName("");
      }}
      dirty={name.length > 0}
    >
      <SheetTrigger asChild>
        <Button>
          <PlusIcon aria-hidden size={14} weight="bold" /> new entry
        </Button>
      </SheetTrigger>
      <SheetContent
        title="New entry"
        description="Type a name, then try to close: it asks first."
        footer={
          <>
            <SheetClose asChild>
              <Button variant="ghost">cancel</Button>
            </SheetClose>
            <Button onClick={() => setOpen(false)}>save</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field id="sheet-name" label="name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Q4 notes" />
          </Field>
          <Field id="sheet-note" label="note" hint="optional">
            <Textarea placeholder="// what it is about" />
          </Field>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">$ rm -rf project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogLabel>danger zone</DialogLabel>
          <DialogTitle>
            Delete <em>project-name</em>?
          </DialogTitle>
          <DialogDescription>
            This will permanently remove the project, its history, and all associated data. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Delete project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DropdownPreview() {
  const [wrap, setWrap] = useState(true);
  const [panel, setPanel] = useState("terminal");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          ~/options <CaretDownIcon aria-hidden size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>account</DropdownMenuLabel>
        <DropdownMenuItem>
          <UserIcon aria-hidden size={14} /> profile.tsx
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <GearIcon aria-hidden size={14} /> settings.json
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>view</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
          word wrap
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value={panel} onValueChange={setPanel}>
          <DropdownMenuRadioItem value="terminal">terminal</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="problems">problems</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuDestructiveItem>
          <SignOutIcon aria-hidden size={14} /> rm -rf session
          <DropdownMenuShortcut>⌘⇧Q</DropdownMenuShortcut>
        </DropdownMenuDestructiveItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TooltipPreview() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-wrap items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              hover me
            </Button>
          </TooltipTrigger>
          <TooltipContent>save buffer</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm">
              ⌘K
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            open command palette <TooltipShortcut>⌘K</TooltipShortcut>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              git status
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            3 modified · 1 untracked <TooltipShortcut>⌘⇧G</TooltipShortcut>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="soft" color="success" dot>
              live
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="right">entrepta.vercel.app</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

function TabsPreview() {
  const [route, setRoute] = useState("home");
  const routes = [
    { id: "home", name: "home.tsx", icon: HouseLineIcon },
    { id: "about", name: "about.md", icon: UserSquareIcon },
    { id: "blog", name: "blog/", icon: FileMdIcon },
    { id: "projects", name: "projects/", icon: TerminalWindowIcon },
  ];
  return (
    <div className="flex w-full max-w-2xl flex-col gap-7">
      <Demo label="with icons · hover one">
        <div className="w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
          <Tabs defaultValue="home">
            <TabsList>
              <TabsTrigger value="home" icon={FileTsxIcon} onClose={() => {}}>
                home.tsx
              </TabsTrigger>
              <TabsTrigger value="about" icon={FileMdIcon} onClose={() => {}}>
                about.md
              </TabsTrigger>
              <TabsTrigger value="stack" icon={BracketsCurlyIcon} onClose={() => {}}>
                stack.json
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="home"
              className="p-5 font-mono text-mono-md text-[var(--fg-secondary)]"
            >
              <span className="text-[var(--fg-brand-text)]">export default</span> function Home()
            </TabsContent>
            <TabsContent
              value="about"
              className="p-5 font-sans text-body-md leading-relaxed text-[var(--fg-secondary)]"
            >
              Engineer building a personal design system. Dark-first, IDE-style, opinionated.
            </TabsContent>
            <TabsContent
              value="stack"
              className="p-5 font-mono text-mono-md text-[var(--fg-secondary)]"
            >
              <span className="text-[var(--fg-muted)]">"framework":</span>{" "}
              <span className="text-[var(--status-success-fg)]">"next-15"</span>
            </TabsContent>
          </Tabs>
        </div>
      </Demo>

      <Demo label="variant window · the title bar">
        <div className="w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
          <TabNav
            aria-label="Preview pages"
            variant="window"
            after={
              <button
                type="button"
                aria-label="Open command palette"
                className="focus-ring flex shrink-0 cursor-pointer items-center px-3 font-mono text-mono-md text-[var(--fg-muted)] transition-colors hover:text-[var(--fg-primary)]"
              >
                +
              </button>
            }
            end={
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[var(--fg-brand)]" />
                main
              </span>
            }
          >
            {routes.map((r) => (
              <TabNavLink
                key={r.id}
                href={`#${r.id}`}
                active={route === r.id}
                icon={r.icon}
                onClick={(e) => {
                  e.preventDefault();
                  setRoute(r.id);
                }}
                onClose={r.id !== "home" ? () => setRoute("home") : undefined}
              >
                {r.name}
              </TabNavLink>
            ))}
          </TabNav>
          <div className="sheen h-16 bg-[var(--bg-card)]" />
        </div>
      </Demo>

      <Demo label="without icons · the ◆ marks the active tab">
        <div className="w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
          <Tabs defaultValue="home">
            <TabsList>
              <TabsTrigger value="home">home.tsx</TabsTrigger>
              <TabsTrigger value="about">about.md</TabsTrigger>
              <TabsTrigger value="contact">contact.txt</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Demo>
    </div>
  );
}

function StatusBarPreview() {
  return (
    <div className="w-full max-w-2xl border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
      <div className="sheen flex h-20 items-center justify-center bg-[var(--bg-card)]">
        <p className="font-mono text-mono-sm text-[var(--fg-muted)]">page content</p>
      </div>
      {/* flex overrides the bar's own hidden-below-640px, so the preview shows at every width */}
      <StatusBar
        position="static"
        className="flex"
        left={
          <>
            <StatusBarItem icon={<GitBranchIcon size={10} />}>main</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>0 errors</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>2 warnings</StatusBarItem>
          </>
        }
        right={
          <>
            <StatusBarItem>TypeScript</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>UTF-8</StatusBarItem>
            <StatusBarSeparator />
            <StatusBarItem>Ln 1, Col 1</StatusBarItem>
          </>
        }
      />
    </div>
  );
}

function TopNavPreview() {
  return (
    <div className="w-full max-w-3xl border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
      <TopNav
        left={
          <>
            <TopNavLogo>
              <TopNavLogoMark>e</TopNavLogoMark>
              entrepta
            </TopNavLogo>
            <TopNavBreadcrumb>
              <TopNavSeparator />
              <span>docs</span>
              <TopNavSeparator />
              <span className="here">button</span>
            </TopNavBreadcrumb>
          </>
        }
        right={
          <TopNavMenu>
            <TopNavLink href="#" active>
              home
            </TopNavLink>
            <TopNavLink href="#">docs</TopNavLink>
            <TopNavLink href="#" external>
              github
            </TopNavLink>
            <TopNavLink href="#" external>
              npm
            </TopNavLink>
          </TopNavMenu>
        }
      />
      <div className="sheen flex h-20 items-center justify-center bg-[var(--bg-card)]">
        <p className="font-mono text-mono-sm text-[var(--fg-muted)]">page content</p>
      </div>
    </div>
  );
}

function ToastPreview() {
  const fire: [string, () => void][] = [
    [
      "success",
      () =>
        toast.success("Build passed", {
          description: `${COMPONENT_INDEX.length} components compiled in 1.4s`,
        }),
    ],
    [
      "error",
      () =>
        toast.error("Type error in button.tsx", {
          description: "Property 'variant' does not exist on type 'ButtonProps'",
        }),
    ],
    [
      "warning",
      () =>
        toast.warning("Deprecated token", {
          description: "--fg-brand-on-tint is now --fg-brand-text",
        }),
    ],
    [
      "info",
      () => toast.info("Update available", { description: "entrepta 2.0 is ready to install" }),
    ],
    [
      "with action",
      () =>
        toast("Snapshot saved", {
          description: "~/projects/entrepta/snapshot.json",
          action: { label: "undo", onClick: () => toast("Snapshot restored") },
        }),
    ],
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {fire.map(([label, run]) => (
        <Button key={label} variant="secondary" size="sm" onClick={run}>
          {label}
        </Button>
      ))}
    </div>
  );
}

function SkeletonPreview() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
        <SkeletonText lines={2} className="flex-1" />
      </div>
      <Skeleton variant="rect" className="w-full h-32" />
      <SkeletonText lines={3} />
    </div>
  );
}

function PaletteBody({ onSelect, inline = false }: { onSelect?: () => void; inline?: boolean }) {
  return (
    <>
      {/* the esc chip closes a dialog, so an inline list has none */}
      <CommandInput placeholder="type to filter…" showEsc={!inline} />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="pages">
          <CommandItem icon={<HouseIcon size={14} />} shortcut="⌘1" onSelect={onSelect}>
            home.tsx
          </CommandItem>
          <CommandItem icon={<FileCodeIcon size={14} />} shortcut="⌘2" onSelect={onSelect}>
            docs/installation
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="actions">
          <CommandItem icon={<RocketLaunchIcon size={14} />} shortcut="⌘⇧D" onSelect={onSelect}>
            deploy to production
          </CommandItem>
          <CommandItem icon={<GearIcon size={14} />} shortcut="⌘," onSelect={onSelect}>
            settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandFoot />
    </>
  );
}

function CommandPalettePreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full max-w-xl flex-col gap-7">
      <Demo label="inline · hover or use the arrows">
        <Command className="w-full" loop>
          <PaletteBody inline />
        </Command>
      </Demo>
      <Demo label="as a dialog">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          open palette <Kbd>⌘K</Kbd>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command loop>
            <PaletteBody onSelect={() => setOpen(false)} />
          </Command>
        </CommandDialog>
      </Demo>
    </div>
  );
}

function CodeBlockPreview() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <CodeBlock
        code={`npx @entrepta/cli@latest init --theme=ivy
npx @entrepta/cli@latest add button card command-palette`}
        filename="terminal · zsh"
        meta="~/your-app"
        variant="terminal"
        language="bash"
      />
      <CodeBlock
        code={`import { Button } from "@/components/entrepta/button"

<Button variant="primary">Ship</Button>`}
        filename="hero.tsx"
        language="tsx"
      />
    </div>
  );
}

function ThemeSwitcherPreview() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      {/* the real switcher, placed in the flow instead of the corner: it drives this page */}
      <div className="flex h-[380px] items-end">
        <ThemeSwitcher
          themes={THEMES}
          defaultTheme={DEFAULT_THEME}
          defaultMode={DEFAULT_MODE}
          storageKey={STORAGE_KEY_PREFIX}
          position="inline"
        />
      </div>
      <p className="m-0 font-mono text-mono-sm text-[var(--fg-muted)]">
        Click it. It is the same switcher as the one in the corner, and they stay in step.
      </p>
    </div>
  );
}

function ModeTogglePreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-7">
      <Demo label="icon">
        <ModeToggle storageKey={STORAGE_KEY_PREFIX} />
        <ModeToggle storageKey={STORAGE_KEY_PREFIX} size="sm" />
      </Demo>
      <Demo label="labeled">
        <ModeToggle storageKey={STORAGE_KEY_PREFIX} variant="labeled" />
        <ModeToggle storageKey={STORAGE_KEY_PREFIX} variant="labeled" size="sm" />
      </Demo>
    </div>
  );
}

function KbdPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-7">
      <Demo label="chip">
        <Kbd>⌘K</Kbd>
        <Kbd>esc</Kbd>
        <Kbd>↵</Kbd>
        <Kbd>↑↓</Kbd>
        <span className="flex items-center gap-1 font-mono text-mono-sm text-[var(--fg-muted)]">
          <Kbd>⌘</Kbd>+<Kbd>⇧</Kbd>+<Kbd>P</Kbd>
        </span>
      </Demo>
      <Demo label="in a button and an input">
        <Button variant="secondary" size="sm">
          search <Kbd>/</Kbd>
        </Button>
        <Input variant="command" placeholder="run command…" className="w-56" />
      </Demo>
    </div>
  );
}

function CheckboxPreview() {
  const items = ["button", "badge", "card"];
  const [picked, setPicked] = useState<string[]>(["button"]);
  const all = picked.length === items.length;
  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        label="primitives"
        checked={all}
        indeterminate={picked.length > 0 && !all}
        onChange={() => setPicked(all ? [] : items)}
      />
      <div className="flex flex-col gap-3 pl-6">
        {items.map((item) => (
          <Checkbox
            key={item}
            label={item}
            checked={picked.includes(item)}
            onChange={() =>
              setPicked(
                picked.includes(item) ? picked.filter((p) => p !== item) : [...picked, item]
              )
            }
          />
        ))}
        <Checkbox label="diamond" description="needed by card" checked disabled />
      </div>
    </div>
  );
}

function SwitchPreview() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <Switch label="send me a copy" checked={on} onChange={(e) => setOn(e.target.checked)} />
      <Switch label="notifications" />
      <Switch label="disabled" disabled />
    </div>
  );
}

function TextareaPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Textarea placeholder="// what are you building?" />
      <Textarea state="error" defaultValue="too short" rows={2} />
    </div>
  );
}

function FieldPreview() {
  return (
    <form className="flex w-full max-w-md flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
      <Field id="preview-email" label="email" required hint="we never share it">
        <Input type="email" placeholder="you@domain.dev" required />
      </Field>
      <Field id="preview-message" label="message" required error="Tell me a bit more.">
        <Textarea rows={3} />
      </Field>
    </form>
  );
}

function FilterPillPreview() {
  const [type, setType] = useState<string | null>("film");
  const counts: Record<string, number> = { film: 12, book: 3, album: 7 };
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(counts).map((t) => (
        <FilterPill
          key={t}
          label={t}
          count={counts[t]}
          icon={TagIcon}
          active={type === t}
          onClick={() => setType(type === t ? null : t)}
        />
      ))}
    </div>
  );
}

function SidebarPreview() {
  const [active, setActive] = useState("home");
  const items = [
    { id: "home", label: "Home", href: "#home", icon: HouseIcon },
    { id: "files", label: "Files", href: "#files", icon: FileCodeIcon },
    { id: "branch", label: "Branch", href: "#branch", icon: GitBranchIcon },
    { id: "settings", label: "Settings", href: "#settings", icon: GearIcon },
  ];
  return (
    <div
      className="flex h-60 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
      onClickCapture={(e) => {
        const link = (e.target as HTMLElement).closest("a");
        if (!link) return;
        e.preventDefault();
        setActive(link.getAttribute("href")?.slice(1) ?? "home");
      }}
    >
      <Sidebar items={items} active={active} label="Preview" />
      <div className="sheen w-56 bg-[var(--bg-card)]" />
    </div>
  );
}

function PageOutlinePreview() {
  return (
    <div className="flex w-full max-w-md justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
      <PageOutline
        className="!block !static w-64"
        file="about.md"
        items={[
          { id: "outline-intro", label: "intro", level: 1 },
          { id: "outline-career", label: "career", level: 2, count: 4 },
          { id: "outline-education", label: "education", level: 3 },
        ]}
        footer={<span>3 sections</span>}
      />
    </div>
  );
}

function SectHeadPreview() {
  return (
    <div className="w-full max-w-xl">
      <SectHead cmd="ls ./work --featured" meta="4 projects" as="span" />
      <SectHead cmd="cat ./off-the-clock" meta="updated today" as="span" />
    </div>
  );
}

function DocPartsPreview() {
  return (
    <div className="w-full max-w-xl">
      <Section variant="first" className="pb-0">
        <DocLabel>about</DocLabel>
        <DisplayH2>
          Engineer, <em>mostly</em>.
        </DisplayH2>
        <Prose className="mt-4 mb-0">
          I build <Strong>design systems</Strong> and ship them as <Em>copy-paste</Em> code.
        </Prose>
      </Section>
    </div>
  );
}

function ChromeMessagePreview() {
  return (
    <div className="w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
      <ChromeMessage
        className="min-h-0 py-8"
        command="cat ./this-page"
        output="cat: ./this-page: No such file or directory"
        title="Page not found."
        note="it moved, or it never existed"
        action={<ArrowLink href="#">go home</ArrowLink>}
      />
    </div>
  );
}

function PageLoadingPreview() {
  const [run, setRun] = useState(0);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
        <PageLoading
          key={run}
          className="min-h-0 py-10"
          command="ls ./log"
          crumb="log"
          label="the log"
          steps={["reading entries", "reading covers"]}
        />
      </div>
      <Button size="sm" variant="secondary" onClick={() => setRun((r) => r + 1)}>
        replay
      </Button>
    </div>
  );
}

function RevealPreview() {
  const [run, setRun] = useState(0);
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <div key={run} className="grid w-full grid-cols-3 gap-3">
        {["one", "two", "three"].map((label, i) => (
          <Reveal key={label} index={i}>
            <Card size="sm">
              <CardHeader>
                <CardLabel>{label}</CardLabel>
              </CardHeader>
            </Card>
          </Reveal>
        ))}
      </div>
      <Button size="sm" variant="secondary" onClick={() => setRun((r) => r + 1)}>
        replay
      </Button>
    </div>
  );
}

function TypeInPreview() {
  const [run, setRun] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <TypeIn
        key={run}
        as="p"
        text="Build with entrepta."
        emphasis="entrepta"
        className="m-0 font-serif text-display-md text-[var(--fg-primary)]"
      />
      <Button size="sm" variant="secondary" onClick={() => setRun((r) => r + 1)}>
        replay
      </Button>
    </div>
  );
}

function RollingNumberPreview() {
  const roll = useRollOnHover(0.2);
  return (
    <div className="flex flex-col items-center gap-2" {...roll.handlers}>
      <RollingNumber
        value={128}
        cycle={roll.cycle}
        delay={roll.delay}
        height={44}
        className="font-serif text-display-md text-[var(--fg-primary)]"
      />
      <span className="font-mono text-mono-sm text-[var(--fg-muted)]">hover to roll</span>
    </div>
  );
}

function SpotlightPreview() {
  const { onMouseMove, spotlight } = useSpotlight(420);
  return (
    <Card className="w-full max-w-md" onMouseMove={onMouseMove}>
      <Spotlight {...spotlight} />
      <CardHeader>
        <CardLabel>spotlight</CardLabel>
        <CardMeta>move the cursor</CardMeta>
      </CardHeader>
      <CardTitle>
        Light that <em>follows</em>.
      </CardTitle>
    </Card>
  );
}

function ArrowLinkPreview() {
  return (
    <div className="flex flex-col items-start gap-3">
      <ArrowLink href="#">read the docs</ArrowLink>
      <ArrowLink href="https://github.com" external>
        github
      </ArrowLink>
    </div>
  );
}

const PREVIEWS: Record<string, React.ReactNode> = {
  button: <ButtonPreview />,
  badge: <BadgePreview />,
  avatar: <AvatarPreview />,
  input: <InputPreview />,
  "money-input": <MoneyInputPreview />,
  select: <SelectPreview />,
  combobox: <ComboboxPreview />,
  "segmented-control": <SegmentedControlPreview />,
  calendar: <CalendarPreview />,
  "date-picker": <DatePickerPreview />,
  "date-navigator": <DateNavigatorPreview />,
  amount: <AmountPreview />,
  card: <CardPreview />,
  dialog: <DialogPreview />,
  sheet: <SheetPreview />,
  popover: <PopoverPreview />,
  dropdown: <DropdownPreview />,
  tooltip: <TooltipPreview />,
  tabs: <TabsPreview />,
  "status-bar": <StatusBarPreview />,
  "top-nav": <TopNavPreview />,
  "theme-switcher": <ThemeSwitcherPreview />,
  "mode-toggle": <ModeTogglePreview />,
  toast: <ToastPreview />,
  skeleton: <SkeletonPreview />,
  "command-palette": <CommandPalettePreview />,
  "code-block": <CodeBlockPreview />,
  kbd: <KbdPreview />,
  checkbox: <CheckboxPreview />,
  switch: <SwitchPreview />,
  textarea: <TextareaPreview />,
  field: <FieldPreview />,
  "filter-pill": <FilterPillPreview />,
  sidebar: <SidebarPreview />,
  "page-outline": <PageOutlinePreview />,
  "sect-head": <SectHeadPreview />,
  "doc-parts": <DocPartsPreview />,
  "chrome-message": <ChromeMessagePreview />,
  "page-loading": <PageLoadingPreview />,
  reveal: <RevealPreview />,
  "type-in": <TypeInPreview />,
  "rolling-number": <RollingNumberPreview />,
  spotlight: <SpotlightPreview />,
  "arrow-link": <ArrowLinkPreview />,
};

export function ComponentPreview({ slug }: { slug: string }) {
  return (
    <div className="w-full flex items-center justify-center">
      {PREVIEWS[slug] ?? (
        <p className="font-mono text-mono-sm text-[var(--fg-muted)]">No preview available</p>
      )}
    </div>
  );
}
