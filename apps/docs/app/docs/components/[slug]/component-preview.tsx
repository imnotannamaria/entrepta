"use client";

import { COMPONENT_INDEX } from "@/lib/component-index";
import { DEFAULT_MODE, DEFAULT_THEME, STORAGE_KEY_PREFIX, THEMES } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  chartColor,
  chartCursor,
  chartGrid,
  chartProjection,
  chartXAxis,
  chartYAxis,
  formatChartValue,
  useChartMotion,
} from "@entrepta/registry/charts/chart";
import { type ChatMessage, ChatThread } from "@entrepta/registry/content/chat-thread";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import { Diamond } from "@entrepta/registry/content/diamond";
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
import { BarList } from "@entrepta/registry/data/bar-list";
import { type ContributionDay, ContributionGrid } from "@entrepta/registry/data/contribution-grid";
import { DataTable, dataTableColumns } from "@entrepta/registry/data/data-table";
import { Delta } from "@entrepta/registry/data/delta";
import { FilterBuilder, type FilterBuilderField } from "@entrepta/registry/data/filter-builder";
import { ListGroup, ListRow } from "@entrepta/registry/data/list-row";
import { Metric } from "@entrepta/registry/data/metric";
import { Redact } from "@entrepta/registry/data/redact";
import { Sparkline } from "@entrepta/registry/data/sparkline";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@entrepta/registry/data/table";
import { Alert } from "@entrepta/registry/feedback/alert";
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
import { EmptyState } from "@entrepta/registry/feedback/empty-state";
import { PageLoading } from "@entrepta/registry/feedback/page-loading";
import { Skeleton, SkeletonText } from "@entrepta/registry/feedback/skeleton";
import { RedactProvider } from "@entrepta/registry/hooks/use-redact";
import { BentoGrid, BentoItem } from "@entrepta/registry/layout/bento-grid";
import { MobileNav } from "@entrepta/registry/layout/mobile-nav";
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
import { type Filter, matchesFilter, serializeFilters } from "@entrepta/registry/lib/filters";
import { formatMoney } from "@entrepta/registry/lib/format";
import type { PaletteKey } from "@entrepta/registry/lib/palette";
import { ArrowLink } from "@entrepta/registry/motion/arrow-link";
import { Reveal } from "@entrepta/registry/motion/reveal";
import { RollingNumber, useRollOnHover } from "@entrepta/registry/motion/rolling-number";
import { Spotlight, useSpotlight } from "@entrepta/registry/motion/spotlight";
import { SpotlightCard } from "@entrepta/registry/motion/spotlight-card";
import { TypeIn } from "@entrepta/registry/motion/type-in";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@entrepta/registry/primitives/accordion";
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
import { ChoiceCard } from "@entrepta/registry/primitives/choice-card";
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
import { FileDropzone, type FileDropzoneItem } from "@entrepta/registry/primitives/file-dropzone";
import { FilterPill } from "@entrepta/registry/primitives/filter-pill";
import { IconTile } from "@entrepta/registry/primitives/icon-tile";
import { Input } from "@entrepta/registry/primitives/input";
import { Kbd } from "@entrepta/registry/primitives/kbd";
import { MoneyInput } from "@entrepta/registry/primitives/money-input";
import { Popover, PopoverContent, PopoverTrigger } from "@entrepta/registry/primitives/popover";
import { Progress } from "@entrepta/registry/primitives/progress";
import { PromptInput } from "@entrepta/registry/primitives/prompt-input";
import { SecretField } from "@entrepta/registry/primitives/secret-field";
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
import { Stepper } from "@entrepta/registry/primitives/stepper";
import { SwatchPicker } from "@entrepta/registry/primitives/swatch-picker";
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
  ArrowCounterClockwiseIcon,
  ArrowRightIcon,
  BooksIcon,
  BracketsCurlyIcon,
  BriefcaseIcon,
  CalendarBlankIcon,
  CaretDownIcon,
  ChartLineUpIcon,
  CheckIcon,
  ClockIcon,
  CoffeeIcon,
  CurrencyDollarIcon,
  DotsThreeIcon,
  EyeIcon,
  EyeSlashIcon,
  FileCodeIcon,
  FileMdIcon,
  FileTsxIcon,
  FilmStripIcon,
  ForkKnifeIcon,
  FunnelIcon,
  FunnelSimpleXIcon,
  GearIcon,
  GitBranchIcon,
  GraduationCapIcon,
  HouseIcon,
  HouseLineIcon,
  InfoIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PiggyBankIcon,
  PlusIcon,
  RobotIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  SignOutIcon,
  SparkleIcon,
  SquaresFourIcon,
  TagIcon,
  TerminalWindowIcon,
  TextAaIcon,
  TrayIcon,
  UserIcon,
  UserSquareIcon,
  WalletIcon,
  WarningIcon,
  XIcon,
} from "@phosphor-icons/react";
import * as React from "react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
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
    { label: "client invoice", value: 950000 },
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

const ENTRIES = [
  {
    id: "1",
    date: "2026-09-27",
    item: "coffee",
    category: "out",
    amount: -450,
    icon: CoffeeIcon,
    color: "chart-4",
  },
  {
    id: "2",
    date: "2026-09-27",
    item: "books",
    category: "learning",
    amount: -6200,
    icon: BooksIcon,
    color: "chart-6",
  },
  {
    id: "3",
    date: "2026-09-26",
    item: "client invoice",
    category: "income",
    amount: 950000,
    icon: BriefcaseIcon,
    color: "chart-1",
  },
  {
    id: "4",
    date: "2026-09-26",
    item: "rent",
    category: "home",
    amount: -180000,
    icon: HouseLineIcon,
    color: "chart-3",
  },
  {
    id: "5",
    date: "2026-09-25",
    item: "groceries",
    category: "home",
    amount: -12380,
    icon: ShoppingCartIcon,
    color: "chart-3",
  },
  {
    id: "6",
    date: "2026-09-25",
    item: "cinema",
    category: "out",
    amount: -3200,
    icon: FilmStripIcon,
    color: "chart-4",
  },
  {
    id: "7",
    date: "2026-09-24",
    item: "refund",
    category: "income",
    amount: 8990,
    icon: ArrowCounterClockwiseIcon,
    color: "chart-1",
  },
] as const;

type Entry = (typeof ENTRIES)[number];

function IconTilePreview() {
  const palette = [
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
    "chart-6",
    "chart-7",
    "chart-8",
  ] as const;
  return (
    <div className="flex w-full max-w-xl flex-col gap-7">
      <Demo label="the palette, derived from the brand">
        {palette.map((color) => (
          <IconTile key={color} icon={TagIcon} color={color} />
        ))}
      </Demo>
      <Demo label="brand, neutral and the statuses">
        <IconTile icon={SparkleIcon} color="brand" />
        <IconTile icon={TagIcon} />
        <IconTile icon={CheckIcon} color="success" />
        <IconTile icon={WarningIcon} color="warning" />
        <IconTile icon={XIcon} color="error" />
        <IconTile icon={InfoIcon} color="info" />
      </Demo>
      <Demo label="sizes, and a badge in the corner">
        <IconTile icon={HouseLineIcon} color="chart-3" size="sm" />
        <IconTile icon={HouseLineIcon} color="chart-3" />
        <IconTile icon={HouseLineIcon} color="chart-3" size="lg" />
        <IconTile
          icon={WalletIcon}
          color="chart-5"
          size="lg"
          badge={<Avatar name="Bank" size="sm" color="brand" />}
        />
      </Demo>
    </div>
  );
}

function ListRowPreview() {
  const [picked, setPicked] = useState<string | null>("2");
  const days = [
    { label: "Sat, Sep 27", rows: ENTRIES.slice(0, 2) },
    { label: "Fri, Sep 26", rows: ENTRIES.slice(2, 4) },
  ];
  return (
    <div className="w-full max-w-md">
      {days.map((day) => (
        <ListGroup
          key={day.label}
          label={day.label}
          total={
            <Amount
              value={day.rows.reduce((sum, r) => sum + r.amount, 0)}
              currency="USD"
              tone="auto"
            />
          }
        >
          {day.rows.map((row) => (
            <ListRow
              key={row.id}
              leading={<IconTile icon={row.icon} color={row.color} />}
              title={row.item}
              meta={row.category}
              trailing={
                <Amount
                  value={row.amount}
                  currency="USD"
                  tone={row.amount > 0 ? "auto" : "neutral"}
                />
              }
              trailingMeta={row.id === "1" ? "pending" : undefined}
              muted={row.id === "1"}
              selected={picked === row.id}
              onClick={() => setPicked(row.id)}
              actions={
                <Button variant="ghost" size="icon-sm" aria-label={`More for ${row.item}`}>
                  <DotsThreeIcon aria-hidden size={16} weight="bold" />
                </Button>
              }
            />
          ))}
        </ListGroup>
      ))}
    </div>
  );
}

function TablePreview() {
  const rows = ENTRIES.slice(0, 5);
  return (
    <div className="w-full max-w-xl">
      <Table>
        <TableCaption>last five entries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>date</TableHead>
            <TableHead>item</TableHead>
            <TableHead align="end">amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell className="text-[var(--fg-primary)]">{row.item}</TableCell>
              <TableCell align="end">
                <Amount value={row.amount} currency="USD" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={2}>total</TableCell>
            <TableCell align="end">
              <Amount
                value={rows.reduce((sum, r) => sum + r.amount, 0)}
                currency="USD"
                tone="auto"
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

const entryColumns = (() => {
  const col = dataTableColumns<Entry>();
  return col.columns([
    col.accessor("date", { header: "date" }),
    col.accessor("item", {
      header: "item",
      cell: (info) => <span className="text-[var(--fg-primary)]">{info.getValue()}</span>,
    }),
    col.accessor("category", { header: "category" }),
    col.accessor("amount", {
      header: "amount",
      cell: (info) => (
        <Amount
          value={info.getValue()}
          currency="USD"
          tone={info.getValue() > 0 ? "auto" : "neutral"}
        />
      ),
    }),
  ]);
})();

function DataTablePreview() {
  type Shown = "rows" | "loading" | "empty" | "filtered" | "error";
  const [shown, setShown] = useState<Shown>("rows");
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <SegmentedControl
        aria-label="state"
        size="sm"
        className="w-full sm:w-auto sm:self-start"
        value={shown}
        onValueChange={(v) => setShown(v as Shown)}
        // short labels, so five fit at 375px
        options={[
          { value: "rows", label: "rows" },
          { value: "loading", label: "load" },
          { value: "empty", label: "empty" },
          { value: "filtered", label: "filter" },
          { value: "error", label: "error" },
        ]}
      />
      <DataTable
        aria-label="entries"
        data={shown === "rows" || shown === "error" ? [...ENTRIES] : []}
        columns={entryColumns}
        getRowId={(row) => row.id}
        numeric={["amount"]}
        selectable
        rowLabel={(row) => `Select ${row.item}`}
        loading={shown === "loading"}
        filtered={shown === "filtered"}
        onClearFilters={() => setShown("rows")}
        error={
          shown === "error"
            ? {
                description: "The server took too long to answer.",
                onRetry: () => setShown("rows"),
              }
            : null
        }
        empty={{
          title: "No entries yet",
          description: "Add one, or connect an account to bring them in.",
          action: (
            <Button size="sm">
              <PlusIcon aria-hidden size={14} weight="bold" /> add an entry
            </Button>
          ),
        }}
      />
    </div>
  );
}

/** A month of values, drawn once so every render agrees. */
function series(seed: number, length = 30, drift = 0.6) {
  let value = 50;
  return Array.from({ length }, (_, i) => {
    value += Math.sin(i * 1.7 + seed) * 6 + Math.cos(i * 0.6 + seed * 2) * 4 + drift;
    return Math.round(value * 10) / 10;
  });
}

const BALANCE_TREND = series(1, 30, 1.2);
const SPENT_TREND = series(4, 30, 0.8);
const SAVED_TREND = series(7, 30, 1.6);

/** A money value that rolls into place, its symbol in the muted ink like an Amount. */
function RollingMoney({ value, height }: { value: string; height: number }) {
  return (
    <span className="inline-flex items-baseline">
      <span className="text-[var(--fg-muted)]">$</span>
      <RollingNumber value={value} height={height} />
    </span>
  );
}

function MetricPreview() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SpotlightCard>
          <Metric
            icon={ShoppingCartIcon}
            label="spent this month"
            value={<RollingMoney value="2,184.50" height={31} />}
            delta={
              <Delta current={218450} previous={196200} intent="increase-is-bad" variant="pill" />
            }
            comparison="vs August"
            trend={<Sparkline data={SPENT_TREND} tone="chart-1" />}
            hint="2 accounts not synced"
            loading={loading}
          />
        </SpotlightCard>
        <SpotlightCard>
          <Metric
            icon={PiggyBankIcon}
            label="saved"
            value={<RollingMoney value="9,589.90" height={31} />}
            delta={<Delta current={958990} previous={812000} variant="pill" />}
            comparison="since January"
            trend={<Sparkline data={SAVED_TREND} tone="success" />}
            loading={loading}
          />
        </SpotlightCard>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="self-start"
        onClick={() => setLoading((l) => !l)}
      >
        {loading ? "show values" : "show loading"}
      </Button>
    </div>
  );
}

const CHART_MONTHS = [
  { month: "Apr", spent: 171200, income: 950000, projected: null },
  { month: "May", spent: 184900, income: 950000, projected: null },
  { month: "Jun", spent: 166300, income: 972000, projected: null },
  { month: "Jul", spent: 182000, income: 950000, projected: null },
  { month: "Aug", spent: 196200, income: 950000, projected: null },
  { month: "Sep", spent: 218450, income: 958990, projected: 218450 },
  { month: "Oct", spent: null, income: null, projected: 224000 },
  { month: "Nov", spent: null, income: null, projected: 231500 },
];
const NET = [
  { month: "Apr", net: 42800 },
  { month: "May", net: -18900 },
  { month: "Jun", net: 55700 },
  { month: "Jul", net: 31000 },
  { month: "Aug", net: -9200 },
  { month: "Sep", net: 24540 },
];
const BY_CATEGORY = CHART_MONTHS.slice(0, 6).map((m, i) => ({
  month: m.month,
  home: 120000 + (i % 3) * 4000,
  out: 26000 + ((i * 7) % 5) * 3100,
  learning: 9000 + ((i * 3) % 4) * 2200,
}));
const SLICES = [
  { name: "home", value: 124380 },
  { name: "groceries", value: 32050 },
  { name: "out", value: 36500 },
  { name: "learning", value: 15200 },
  { name: "transport", value: 10320 },
];
const SLICE_CONFIG = Object.fromEntries(
  SLICES.map((s, i) => [
    s.name,
    { label: s.name, color: `chart-${i * 2 + 1 > 8 ? 2 : i * 2 + 1}`, format: "money" as const },
  ])
);
const compactUsd = (v: number) => formatChartValue(v, "money", { currency: "USD", compact: true });

function ChartPreview() {
  type Recipe = "area" | "grouped" | "diverging" | "stacked" | "donut";
  const [recipe, setRecipe] = useState<Recipe>("area");
  const motion = useChartMotion();
  const total = SLICES.reduce((sum, s) => sum + s.value, 0);
  const head = {
    area: ["spending", "Oct and Nov projected"],
    grouped: ["income and spending", "last 6 months"],
    diverging: ["what was left", "income minus spending"],
    stacked: ["by category", "last 6 months"],
    donut: ["september", "by category"],
  }[recipe];

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <SegmentedControl
        aria-label="recipe"
        size="sm"
        className="w-full sm:w-auto sm:self-start"
        value={recipe}
        onValueChange={(v) => setRecipe(v as Recipe)}
        options={[
          { value: "area", label: "area" },
          { value: "grouped", label: "bars" },
          { value: "diverging", label: "net" },
          { value: "stacked", label: "stack" },
          { value: "donut", label: "donut" },
        ]}
      />
      <SpotlightCard variant="data">
        <CardHeader>
          <CardLabel>{head[0]}</CardLabel>
          <CardMeta>{head[1]}</CardMeta>
        </CardHeader>
        {recipe === "area" ? (
          <ChartContainer
            key="area"
            config={{
              spent: { label: "spent", color: "chart-1", format: "money" },
              projected: { label: "projected", color: "chart-1", format: "money" },
            }}
            height={260}
            label="Spending by month, October and November projected"
            description="Spending rose from $1,663 in June to $2,184 in September, and is projected to reach $2,315 in November."
            data={CHART_MONTHS}
            categoryKey="month"
            currency="USD"
          >
            <AreaChart data={CHART_MONTHS} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
              <defs>
                <linearGradient id="fill-spent" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    style={{ stopColor: "var(--color-spent)", stopOpacity: 0.35 }}
                  />
                  <stop offset="100%" style={{ stopColor: "var(--color-spent)", stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="month" {...chartXAxis} />
              <YAxis {...chartYAxis} tickFormatter={compactUsd} />
              <ChartTooltip
                cursor={{ stroke: "var(--chart-grid)" }}
                content={<ChartTooltipContent />}
              />
              <Area
                dataKey="spent"
                stroke="var(--color-spent)"
                strokeWidth={2}
                fill="url(#fill-spent)"
                {...motion}
              />
              <Area
                dataKey="projected"
                stroke="var(--color-projected)"
                fill="var(--color-projected)"
                {...chartProjection}
                {...motion}
              />
            </AreaChart>
          </ChartContainer>
        ) : recipe === "grouped" ? (
          <ChartContainer
            key="grouped"
            config={{
              income: { label: "income", color: "chart-2", format: "money" },
              spent: { label: "spent", color: "chart-1", format: "money" },
            }}
            height={260}
            label="Income and spending by month"
            data={CHART_MONTHS.slice(0, 6)}
            categoryKey="month"
            currency="USD"
          >
            <BarChart data={CHART_MONTHS.slice(0, 6)} barGap={4}>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="month" {...chartXAxis} />
              <YAxis {...chartYAxis} tickFormatter={compactUsd} />
              <ChartTooltip cursor={chartCursor} content={<ChartTooltipContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} {...motion} />
              <Bar dataKey="spent" fill="var(--color-spent)" radius={[4, 4, 0, 0]} {...motion} />
            </BarChart>
          </ChartContainer>
        ) : recipe === "diverging" ? (
          <ChartContainer
            key="diverging"
            config={{ net: { label: "net", color: "chart-1", format: "money", signed: true } }}
            height={260}
            label="What was left each month, income minus spending"
            data={NET}
            categoryKey="month"
            currency="USD"
          >
            <BarChart data={NET}>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="month" {...chartXAxis} />
              <YAxis {...chartYAxis} tickFormatter={compactUsd} />
              <ReferenceLine y={0} stroke="var(--border-strong)" />
              <ChartTooltip cursor={chartCursor} content={<ChartTooltipContent />} />
              <Bar dataKey="net" radius={4} {...motion}>
                {NET.map((row) => (
                  <Cell key={row.month} fill={chartColor(row.net < 0 ? "error" : "success")} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : recipe === "stacked" ? (
          <ChartContainer
            key="stacked"
            config={{
              home: { label: "home", color: "chart-1", format: "money" },
              out: { label: "out", color: "chart-3", format: "money" },
              learning: { label: "learning", color: "chart-5", format: "money" },
            }}
            height={280}
            label="Spending by category and month"
            data={BY_CATEGORY}
            categoryKey="month"
            currency="USD"
          >
            <BarChart data={BY_CATEGORY}>
              <CartesianGrid {...chartGrid} />
              <XAxis dataKey="month" {...chartXAxis} />
              <YAxis {...chartYAxis} tickFormatter={compactUsd} />
              <ChartTooltip cursor={chartCursor} content={<ChartTooltipContent />} />
              <Bar dataKey="home" stackId="month" fill="var(--color-home)" {...motion} />
              <Bar dataKey="out" stackId="month" fill="var(--color-out)" {...motion} />
              <Bar
                dataKey="learning"
                stackId="month"
                fill="var(--color-learning)"
                radius={[4, 4, 0, 0]}
                {...motion}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <ChartContainer
            key="donut"
            config={SLICE_CONFIG}
            height={300}
            label="Spending by category in September"
            currency="USD"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
              <Pie
                data={SLICES}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="88%"
                paddingAngle={2}
                cornerRadius={4}
                stroke="none"
                {...motion}
              >
                {SLICES.map((s) => (
                  <Cell key={s.name} fill={`var(--color-${s.name})`} />
                ))}
                <Label
                  position="center"
                  // the pie sits at the plot's center, so the total can too
                  content={() => (
                    <text x="50%" y="50%" textAnchor="middle">
                      <tspan
                        x="50%"
                        dy="-0.5em"
                        className="fill-[var(--fg-muted)] font-mono text-mono-xs uppercase"
                      >
                        total
                      </tspan>
                      <tspan
                        x="50%"
                        dy="1.9em"
                        className="fill-[var(--fg-primary)] font-mono text-heading-md"
                      >
                        {formatMoney(total, { currency: "USD" })}
                      </tspan>
                    </text>
                  )}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </SpotlightCard>
    </div>
  );
}

function BarListPreview() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <SpotlightCard>
        <CardHeader>
          <CardLabel>where it went</CardLabel>
          <CardMeta>september</CardMeta>
        </CardHeader>
        <BarList
          items={SLICES.map((s, i) => ({ label: s.name, value: s.value, color: `chart-${i + 1}` }))}
          max={4}
          showOthers
          format="money"
          currency="USD"
        />
      </SpotlightCard>
      <SpotlightCard>
        <CardHeader>
          <CardLabel>most read</CardLabel>
          <CardMeta>7 days</CardMeta>
        </CardHeader>
        <BarList
          items={[
            { label: "/", value: 4820, href: "#home" },
            { label: "/docs/components/data-table", value: 1210, href: "#dt" },
            { label: "/docs/installation", value: 2380, href: "#install" },
            { label: "/docs/themes", value: 640, href: "#themes" },
          ]}
        />
      </SpotlightCard>
    </div>
  );
}

const ONBOARDING = [
  { id: "account", label: "Account", description: "Name and email" },
  { id: "bank", label: "Connect a bank", description: "Read only" },
  { id: "budget", label: "First budget", description: "Two minutes" },
  { id: "done", label: "Done" },
];

function StepperPreview() {
  const [at, setAt] = useState(1);
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <SpotlightCard>
        <Stepper steps={ONBOARDING} current={ONBOARDING[at].id} />
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={at === 0} onClick={() => setAt(at - 1)}>
            back
          </Button>
          <Button size="sm" disabled={at === ONBOARDING.length - 1} onClick={() => setAt(at + 1)}>
            next
          </Button>
        </div>
      </SpotlightCard>
      <Demo label="vertical, a step that needs attention">
        <Stepper
          steps={ONBOARDING.slice(0, 3)}
          current="budget"
          errored={["bank"]}
          orientation="vertical"
        />
      </Demo>
    </div>
  );
}

function ChoiceCardPreview() {
  const [plan, setPlan] = useState("pro");
  return (
    <ChoiceCard
      className="w-full max-w-2xl"
      legend="Choose a plan"
      columns={3}
      value={plan}
      onValueChange={setPlan}
      options={[
        {
          value: "free",
          title: "Free",
          description: "One account, a month of history.",
          icon: WalletIcon,
        },
        {
          value: "pro",
          title: "Pro",
          description: "Every account and all of it.",
          icon: RocketLaunchIcon,
          badge: <Badge variant="soft">$4/mo</Badge>,
        },
        {
          value: "team",
          title: "Team",
          description: "Shared budgets.",
          icon: UserSquareIcon,
          disabled: "Coming in October",
        },
      ]}
    />
  );
}

function SwatchPickerPreview() {
  const [color, setColor] = useState<PaletteKey>("chart-3");
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <SwatchPicker legend="Category color" value={color} onValueChange={setColor} />
      <div className="flex items-center gap-3 font-mono text-mono-sm text-[var(--fg-secondary)]">
        <IconTile icon={ShoppingCartIcon} color={color} />
        groceries · <code className="text-[var(--fg-primary)]">{color}</code>
      </div>
    </div>
  );
}

function SecretFieldPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Demo label="api key">
        <SecretField name="API key" value="sk_live_51H8xQ2eZvKYlo2C4f2a" />
      </Demo>
      <Demo label="expired">
        <SecretField
          name="old API key"
          value="sk_live_09Qe7wYtR2bLm1Vn8c1d"
          expired={{
            message: "Expired 2 days ago",
            action: (
              <Button size="sm" variant="secondary">
                new key
              </Button>
            ),
          }}
        />
      </Demo>
    </div>
  );
}

function RedactPreview() {
  const [hidden, setHidden] = useState(true);
  return (
    <RedactProvider hidden={hidden}>
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <Button
          variant="secondary"
          size="sm"
          className="self-start"
          aria-pressed={hidden}
          onClick={() => setHidden((h) => !h)}
        >
          {hidden ? <EyeIcon aria-hidden size={14} /> : <EyeSlashIcon aria-hidden size={14} />}
          {hidden ? "show values" : "hide values"}
        </Button>
        <div className="grid gap-4 sm:grid-cols-2">
          <SpotlightCard>
            <Metric
              icon={WalletIcon}
              label="balance"
              value={<Amount value={1204580} currency="USD" />}
              delta={<Delta current={1204580} previous={1122000} variant="pill" />}
              comparison="vs August"
            />
          </SpotlightCard>
          <SpotlightCard>
            <CardHeader>
              <CardLabel>account</CardLabel>
            </CardHeader>
            <div className="flex flex-col gap-1 font-mono text-mono-sm text-[var(--fg-secondary)]">
              <span>
                number <Redact className="text-[var(--fg-primary)]">0042-7781-3309</Redact>
              </span>
              <span>
                last paid <Amount value={-180000} currency="USD" />
              </span>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </RedactProvider>
  );
}

/** A year of workouts, drawn once so every render agrees. */
const YEAR: ContributionDay[] = (() => {
  const days: ContributionDay[] = [];
  const start = Date.UTC(2025, 8, 29);
  for (let i = 0; i < 365; i++) {
    const date = new Date(start + i * 86_400_000).toISOString().slice(0, 10);
    const wave = Math.sin(i / 9) + Math.sin(i / 3.1) * 0.6 + (i % 7 === 6 ? -1.2 : 0);
    const level =
      i % 53 === 17
        ? null
        : (Math.max(0, Math.min(4, Math.round(wave + 1.6))) as 0 | 1 | 2 | 3 | 4);
    const count = level === null ? 0 : level;
    days.push({
      date,
      level,
      state:
        level === null
          ? undefined
          : count === 0
            ? "rest day"
            : `${count} workout${count > 1 ? "s" : ""}, ${count * 22} min`,
    });
  }
  return days;
})();

function ContributionGridPreview() {
  const [day, setDay] = useState<string | undefined>("2026-09-20");
  const chosen = YEAR.find((d) => d.date === day);
  return (
    <SpotlightCard className="w-full max-w-3xl">
      <CardHeader>
        <CardLabel>workouts · last 12 months</CardLabel>
        <CardMeta>
          {chosen ? `${chosen.date} · ${chosen.state ?? "no data"}` : "pick a day"}
        </CardMeta>
      </CardHeader>
      <ContributionGrid
        label="Workouts in the last year"
        days={YEAR}
        selected={day}
        onSelect={setDay}
      />
    </SpotlightCard>
  );
}

function FileDropzonePreview() {
  const [items, setItems] = useState<FileDropzoneItem[]>([
    { id: "done", name: "september-statement.pdf", size: 482_000 },
  ]);
  // pretend uploads, stopped if the page goes before they finish
  const timers = React.useRef<number[]>([]);
  const count = React.useRef(0);
  React.useEffect(
    () => () => {
      for (const t of timers.current) window.clearInterval(t);
    },
    []
  );
  const upload = (files: File[]) => {
    for (const file of files) {
      // a counter, not the time: two files in one drop share a millisecond
      count.current += 1;
      const id = `${file.name}-${count.current}`;
      setItems((all) => [...all, { id, name: file.name, size: file.size, progress: 0 }]);
      let progress = 0;
      const timer = window.setInterval(() => {
        progress += 0.12;
        setItems((all) =>
          all.map((item) => (item.id === id ? { ...item, progress: Math.min(progress, 1) } : item))
        );
        if (progress >= 1) {
          window.clearInterval(timer);
          setItems((all) =>
            all.map((item) => (item.id === id ? { ...item, progress: undefined } : item))
          );
        }
      }, 220);
      timers.current.push(timer);
    }
  };
  return (
    <FileDropzone
      className="w-full max-w-md"
      accept="image/*,.pdf,.csv"
      maxSize={5_000_000}
      multiple
      hint="PDF, CSV or an image, up to 5 MB"
      onFiles={upload}
      items={items}
      onRemove={(id) => setItems((all) => all.filter((item) => item.id !== id))}
    />
  );
}

function PromptInputPreview() {
  const [sent, setSent] = useState<string | null>(null);
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <PromptInput
        onSubmit={setSent}
        suggestions={["Spending this month", "Biggest category", "Compare with August"]}
      />
      <p className="m-0 font-mono text-mono-xs text-[var(--fg-muted)]">
        {sent ? `sent: ${sent}` : "⌘↵ or Ctrl↵ sends; ↵ is a new line"}
      </p>
    </div>
  );
}

const REPLY =
  "Most of it went to home: rent and groceries are 72% of September. Eating out is up 11% on August, and learning is the one category under budget.";

function ChatThreadPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "hello", role: "system", content: "today" },
  ]);
  const [streaming, setStreaming] = useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearInterval(timer.current), []);

  const send = (text: string) => {
    const n = Date.now();
    setMessages((all) => [
      ...all,
      { id: `u${n}`, role: "user", content: text, time: "14:05" },
      { id: `a${n}`, role: "assistant", content: "", status: "streaming", time: "14:05" },
    ]);
    setStreaming(true);
    const words = REPLY.split(" ");
    let i = 0;
    timer.current = window.setInterval(() => {
      i++;
      const done = i >= words.length;
      setMessages((all) =>
        all.map((m) =>
          m.id === `a${n}`
            ? { ...m, content: words.slice(0, i).join(" "), status: done ? undefined : "streaming" }
            : m
        )
      );
      if (done) {
        window.clearInterval(timer.current);
        setStreaming(false);
        setMessages((all) => [
          ...all,
          {
            id: `t${n}`,
            role: "tool",
            name: "spending_by_category",
            content: (
              <BarList
                items={SLICES.map((s, k) => ({
                  label: s.name,
                  value: s.value,
                  color: `chart-${k + 1}`,
                }))}
                max={4}
                showOthers
                format="money"
                currency="USD"
              />
            ),
          },
        ]);
      }
    }, 70);
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <ChatThread
        className="h-[420px] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3"
        messages={messages}
      />
      <PromptInput
        onSubmit={send}
        streaming={streaming}
        onStop={() => {
          window.clearInterval(timer.current);
          setStreaming(false);
          setMessages((all) =>
            all.map((m) => (m.status === "streaming" ? { ...m, status: undefined } : m))
          );
        }}
        suggestions={
          messages.length > 1 ? undefined : ["Where did the money go?", "Biggest category"]
        }
      />
    </div>
  );
}

function SparklinePreview() {
  const rows = [
    { name: "balance", tone: "chart-1", data: BALANCE_TREND, delta: [1204580, 1122000] },
    { name: "saved", tone: "success", data: SAVED_TREND, delta: [958990, 812000] },
    { name: "spent", tone: "error", data: SPENT_TREND, delta: [218450, 196200] },
  ] as const;
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <SpotlightCard>
        <div className="flex flex-col gap-4">
          <CardHeader>
            <CardLabel>last 30 days</CardLabel>
          </CardHeader>
          <Sparkline data={BALANCE_TREND} className="h-24" />
        </div>
      </SpotlightCard>
      <div className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-[minmax(0,1fr)_minmax(64px,120px)_auto] items-center gap-4 border-b border-[var(--border-subtle)] py-3 font-mono text-mono-sm"
          >
            <span className="truncate text-[var(--fg-primary)]">{row.name}</span>
            <Sparkline data={row.data} tone={row.tone} area={false} className="h-6" />
            <Delta
              current={row.delta[0]}
              previous={row.delta[1]}
              intent={row.name === "spent" ? "increase-is-bad" : "increase-is-good"}
              variant="pill"
              size="sm"
            />
          </div>
        ))}
      </div>
      <Demo label="palette">
        {(["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6"] as const).map(
          (tone, i) => (
            <Sparkline key={tone} data={series(i + 2, 16)} tone={tone} className="h-8 w-24" />
          )
        )}
      </Demo>
    </div>
  );
}

function DeltaPreview() {
  return (
    <div className="flex flex-col gap-6">
      <Demo label="percent">
        <Delta current={120} previous={100} />
        <Delta current={120} previous={100} intent="increase-is-bad" />
        <Delta current={80} previous={100} />
        <Delta current={100} previous={100} />
      </Demo>
      <Demo label="amount and from zero">
        <Delta current={-12380} previous={-9800} format="amount" currency="USD" intent="neutral" />
        <Delta current={5000} previous={0} currency="USD" />
      </Demo>
      <Demo label="new and no data (hover the dash)">
        <Delta current={40} previous={null} />
        <Delta current={null} previous={100} reason="August has not synced yet" />
      </Demo>
    </div>
  );
}

const BUDGETS = [
  { name: "groceries", icon: ShoppingCartIcon, color: "chart-3", spent: 32050, budget: 50000 },
  { name: "dining out", icon: ForkKnifeIcon, color: "chart-4", spent: 18000, budget: 10000 },
  { name: "learning", icon: GraduationCapIcon, color: "chart-6", spent: 6200, budget: 15000 },
] as const;

const usd = (minor: number) => formatMoney(minor, { currency: "USD" });

function BudgetList() {
  return (
    <div className="flex flex-col gap-4">
      {BUDGETS.map((b) => {
        const over = b.spent > b.budget;
        return (
          <div key={b.name} className="flex items-center gap-3">
            <IconTile icon={b.icon} color={b.color} />
            <Progress
              className="min-w-0 flex-1"
              label={b.name}
              value={Math.min(b.spent, b.budget)}
              max={b.budget}
              tone={over ? "error" : "brand"}
              valueText={
                over ? `${usd(b.spent - b.budget)} over` : `${usd(b.spent)} of ${usd(b.budget)}`
              }
              showValue
            />
          </div>
        );
      })}
    </div>
  );
}

function ProgressPreview() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <SpotlightCard>
        <div className="flex flex-col gap-5">
          <CardHeader>
            <CardLabel>budgets · september</CardLabel>
            <CardMeta>12 days left</CardMeta>
          </CardHeader>
          <BudgetList />
        </div>
      </SpotlightCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <SpotlightCard>
          <div className="flex items-center gap-4">
            <Progress variant="ring" size="xl" aria-label="emergency fund" value={62} showValue />
            <div className="flex min-w-0 flex-col gap-1 font-mono">
              <span className="text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-secondary)]">
                emergency fund
              </span>
              <span className="text-mono-sm text-[var(--fg-muted)]">$6,200 of $10,000</span>
            </div>
          </div>
        </SpotlightCard>
        <SpotlightCard>
          <div className="flex flex-col gap-4">
            <Progress label="months saved" value={9} max={12} segments={12} showValue size="lg" />
            <Progress label="syncing accounts" indeterminate size="sm" />
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}

function AccordionPreview() {
  const days = [
    { value: "home", rows: ENTRIES.filter((r) => r.category === "home") },
    { value: "out", rows: ENTRIES.filter((r) => r.category === "out") },
    { value: "learning", rows: ENTRIES.filter((r) => r.category === "learning") },
  ];
  return (
    <Accordion type="single" collapsible defaultValue="home" className="w-full max-w-md">
      {days.map((day) => (
        <AccordionItem key={day.value} value={day.value}>
          <AccordionTrigger
            trailing={
              <Amount value={day.rows.reduce((sum, r) => sum + r.amount, 0)} currency="USD" />
            }
            actions={
              <Button variant="ghost" size="icon-sm" aria-label={`More for ${day.value}`}>
                <DotsThreeIcon aria-hidden size={16} weight="bold" />
              </Button>
            }
          >
            {day.value}
          </AccordionTrigger>
          <AccordionContent>
            {/* rows are list items, so they sit in a list */}
            <ul className="m-0 flex list-none flex-col p-0">
              {day.rows.map((row) => (
                <ListRow
                  key={row.id}
                  leading={<IconTile icon={row.icon} color={row.color} size="sm" />}
                  title={row.item}
                  meta={row.date}
                  trailing={<Amount value={row.amount} currency="USD" />}
                />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const RECENT = ENTRIES.slice(0, 3);

function BentoGridPreview() {
  return (
    <BentoGrid className="w-full [--bento-row:92px]">
      <BentoItem colSpan={{ sm: 6, lg: 8 }} rowSpan={{ lg: 3 }}>
        <SpotlightCard variant="data">
          <div className="flex h-full flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <Metric
                size="lg"
                icon={WalletIcon}
                label="balance"
                value={<RollingMoney value="12,045.80" height={44} />}
                delta={<Delta current={1204580} previous={1122000} variant="pill" />}
                comparison="vs August"
              />
              <IconTile icon={ChartLineUpIcon} color="brand" size="lg" className="shrink-0" />
            </div>
            <Sparkline data={BALANCE_TREND} className="mt-auto h-28" />
          </div>
        </SpotlightCard>
      </BentoItem>
      <BentoItem colSpan={{ sm: 3, lg: 4 }} rowSpan={{ lg: 2 }}>
        <SpotlightCard>
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <Progress variant="ring" size="xl" aria-label="emergency fund" value={62} showValue />
            <span className="font-mono text-mono-sm uppercase tracking-[0.08em] text-[var(--fg-secondary)]">
              emergency fund
            </span>
            <span className="font-mono text-mono-sm text-[var(--fg-muted)]">$6,200 of $10,000</span>
          </div>
        </SpotlightCard>
      </BentoItem>
      <BentoItem colSpan={{ sm: 3, lg: 4 }}>
        <SpotlightCard>
          <div className="flex items-center gap-3">
            <IconTile icon={ShieldCheckIcon} color="success" />
            <div className="flex min-w-0 flex-col font-mono">
              <span className="text-mono-sm text-[var(--fg-primary)]">all accounts synced</span>
              <span className="text-mono-xs text-[var(--fg-muted)]">4 banks · 2 min ago</span>
            </div>
          </div>
        </SpotlightCard>
      </BentoItem>
      <BentoItem colSpan={{ sm: 6, lg: 6 }} rowSpan={{ lg: 2 }}>
        <SpotlightCard>
          <div className="flex flex-col gap-5">
            <CardHeader>
              <CardLabel>budgets</CardLabel>
              <CardMeta>12 days left</CardMeta>
            </CardHeader>
            <BudgetList />
          </div>
        </SpotlightCard>
      </BentoItem>
      <BentoItem colSpan={{ sm: 6, lg: 6 }} rowSpan={{ lg: 2 }}>
        <SpotlightCard>
          <div className="flex flex-col gap-3">
            <CardHeader>
              <CardLabel>recent</CardLabel>
              <CardMeta>
                <Delta current={218450} previous={196200} intent="increase-is-bad" size="sm" />{" "}
                spent
              </CardMeta>
            </CardHeader>
            <ul className="-mx-2 my-0 flex list-none flex-col p-0">
              {RECENT.map((row) => (
                <ListRow
                  key={row.id}
                  leading={<IconTile icon={row.icon} color={row.color} />}
                  title={row.item}
                  meta={`${row.category} · ${row.date}`}
                  trailing={
                    <Amount
                      value={row.amount}
                      currency="USD"
                      tone={row.amount > 0 ? "auto" : "neutral"}
                    />
                  }
                />
              ))}
            </ul>
          </div>
        </SpotlightCard>
      </BentoItem>
    </BentoGrid>
  );
}

function EmptyStatePreview() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <EmptyState
          icon={TrayIcon}
          title="No entries yet"
          description="Add one, or connect an account to bring them in."
          action={
            <Button size="sm">
              <PlusIcon aria-hidden size={14} weight="bold" /> add an entry
            </Button>
          }
        />
      </Card>
      <Card>
        <EmptyState
          icon={FunnelIcon}
          title="Nothing for this filter"
          description="No entries in books this month."
          action={
            <Button size="sm" variant="ghost">
              clear filters
            </Button>
          }
        />
      </Card>
    </div>
  );
}

function AlertPreview() {
  const [shown, setShown] = useState(true);
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert tone="info" title="Syncing 2 accounts">
        New entries show up here as they arrive.
      </Alert>
      <Alert tone="success" title="Connected">
        Your bank syncs every morning at 6.
      </Alert>
      <Alert tone="warning" title="Partial data" action={<ArrowLink href="#">sync now</ArrowLink>}>
        Two accounts have not synced today, so this total may be low.
      </Alert>
      {shown ? (
        <Alert tone="error" title="The import stopped" onDismiss={() => setShown(false)}>
          Row 14 has no date. Fix it in the file and import again.
        </Alert>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => setShown(true)} className="self-start">
          bring the error back
        </Button>
      )}
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
  const [applied, setApplied] = useState(["category is home", "amount over $50.00"]);
  const counts: Record<string, number> = { film: 12, book: 3, album: 7 };
  return (
    <div className="flex flex-col gap-6">
      <Demo label="toggle">
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
      </Demo>
      <Demo label="applied">
        <div className="flex flex-wrap gap-2">
          {applied.map((label) => (
            <FilterPill
              key={label}
              label={label}
              onRemove={() => setApplied((all) => all.filter((l) => l !== label))}
            />
          ))}
          {applied.length === 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setApplied(["category is home", "amount over $50.00"])}
            >
              reset
            </Button>
          ) : null}
        </div>
      </Demo>
    </div>
  );
}

/** Links in a preview change the current item instead of the page. */
function followInPlace(setActive: (id: string) => void) {
  return (e: React.MouseEvent) => {
    const link = (e.target as HTMLElement).closest("a");
    if (!link) return;
    e.preventDefault();
    setActive(link.getAttribute("href")?.slice(1) ?? "home");
  };
}

const APP_NAV = [
  { id: "home", label: "Home", href: "#home", icon: HouseIcon },
  { id: "activity", label: "Feed", href: "#activity", icon: ListIcon },
  { id: "accounts", label: "Wallet", href: "#accounts", icon: WalletIcon },
  { id: "categories", label: "Tags", href: "#categories", icon: TagIcon },
  { id: "files", label: "Files", href: "#files", icon: FileCodeIcon },
  { id: "settings", label: "Settings", href: "#settings", icon: GearIcon },
];

function SidebarPreview() {
  const [active, setActive] = useState("home");
  const [railActive, setRailActive] = useState("home");
  const groups = [
    { title: "Money", items: APP_NAV.slice(0, 4) },
    { title: "Workspace", items: APP_NAV.slice(4) },
  ];
  return (
    <div className="flex w-full flex-col gap-8">
      <Demo label="labeled, collapsible">
        <div
          className="flex h-[480px] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
          onClickCapture={followInPlace(setActive)}
        >
          <Sidebar
            variant="labeled"
            groups={groups}
            active={active}
            collapsible
            storageKey={null}
            label="Preview"
            logo={({ collapsed }) =>
              collapsed ? (
                <Diamond size={10} />
              ) : (
                <span className="font-serif text-heading-md italic text-[var(--fg-primary)]">
                  ledger
                </span>
              )
            }
            search={<Input variant="search" size="sm" placeholder="search" aria-label="Search" />}
            footer={({ collapsed }) => (
              <div
                className={cn(
                  "flex items-center gap-2.5",
                  collapsed ? "justify-center" : "px-2.5 py-1"
                )}
              >
                <Avatar name="Anna Maria" size="sm" />
                {collapsed ? null : (
                  <span className="min-w-0 truncate font-mono text-mono-sm text-[var(--fg-secondary)]">
                    anna
                  </span>
                )}
              </div>
            )}
          />
          <div className="sheen min-w-0 flex-1 bg-[var(--bg-card)]" />
        </div>
      </Demo>
      <Demo label="rail">
        <div
          className="flex h-60 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]"
          onClickCapture={followInPlace(setRailActive)}
        >
          <Sidebar items={APP_NAV.slice(0, 4)} active={railActive} label="Rail preview" />
          <div className="sheen w-56 bg-[var(--bg-card)]" />
        </div>
      </Demo>
    </div>
  );
}

function MobileNavPreview() {
  const [active, setActive] = useState("home");
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  return (
    // a phone: transform-gpu makes it the box the sheet is fixed to
    <div
      ref={setFrame}
      className="relative flex h-[460px] w-full max-w-sm transform-gpu flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)]"
      onClickCapture={followInPlace(setActive)}
    >
      <div className="sheen flex flex-1 items-center justify-center bg-[var(--bg-canvas)] font-mono text-mono-sm text-[var(--fg-muted)]">
        #{active}
      </div>
      <MobileNav
        items={APP_NAV}
        active={active}
        position="static"
        label="Preview"
        container={frame}
        more={
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar name="Anna Maria" />
              <div className="flex min-w-0 flex-col font-mono">
                <span className="truncate text-mono-sm text-[var(--fg-primary)]">Anna Maria</span>
                <span className="truncate text-mono-xs text-[var(--fg-muted)]">
                  anna@example.com
                </span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full">
              <SignOutIcon aria-hidden size={14} /> sign out
            </Button>
          </div>
        }
      />
    </div>
  );
}

const ENTRY_FIELDS: FilterBuilderField[] = [
  {
    id: "category",
    label: "Category",
    type: "enum",
    icon: TagIcon,
    options: ["home", "out", "learning", "income"].map((c) => ({ value: c, label: c })),
  },
  { id: "item", label: "Item", type: "text", icon: TextAaIcon },
  { id: "amount", label: "Amount", type: "amount", currency: "USD", icon: CurrencyDollarIcon },
  { id: "date", label: "Date", type: "date", icon: CalendarBlankIcon },
  { id: "pending", label: "Pending", type: "boolean", icon: ClockIcon },
];

function entryValue(row: Entry, field: string): unknown {
  if (field === "amount") return Math.abs(row.amount);
  if (field === "pending") return row.id === "1";
  return row[field as keyof Entry];
}

function FilterBuilderPreview() {
  const [filters, setFilters] = useState<Filter[]>([
    { field: "category", op: "is", value: "home" },
  ]);
  const rows = ENTRIES.filter((row) =>
    filters.every((filter) => matchesFilter(entryValue(row, filter.field), filter))
  );
  const query = new URLSearchParams(serializeFilters(filters).map((f) => ["filter", f])).toString();
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FilterBuilder fields={ENTRY_FIELDS} value={filters} onValueChange={setFilters} />
      <p className="m-0 break-all font-mono text-mono-xs text-[var(--fg-muted)]">
        ?{query || "no filters"}
      </p>
      {rows.length > 0 ? (
        <ListGroup label={`${rows.length} of ${ENTRIES.length} entries`}>
          {rows.map((row) => (
            <ListRow
              key={row.id}
              leading={<IconTile icon={row.icon} color={row.color} />}
              title={row.item}
              meta={`${row.category} · ${row.date}`}
              trailing={
                <Amount
                  value={row.amount}
                  currency="USD"
                  tone={row.amount > 0 ? "auto" : "neutral"}
                />
              }
            />
          ))}
        </ListGroup>
      ) : (
        <EmptyState
          icon={<FunnelSimpleXIcon />}
          title="Nothing matches these filters"
          action={
            <Button variant="secondary" size="sm" onClick={() => setFilters([])}>
              clear filters
            </Button>
          }
        />
      )}
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
        headingLevel={2}
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

function SpotlightCardPreview() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <SpotlightCard>
        <CardHeader>
          <CardLabel icon={WalletIcon}>balance</CardLabel>
          <CardMeta>move the cursor</CardMeta>
        </CardHeader>
        <Metric
          label="this month"
          value={<Amount value={1204580} currency="USD" />}
          delta={<Delta current={1204580} previous={1122000} variant="pill" />}
          trend={<Sparkline data={BALANCE_TREND} />}
        />
      </SpotlightCard>
      <SpotlightCard variant="featured" className="justify-center text-center">
        <CardTitle>
          Start <em>building.</em>
        </CardTitle>
        <CardDescription>
          The glow follows the cursor a beat late, so it reads as light.
        </CardDescription>
      </SpotlightCard>
    </div>
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
  "icon-tile": <IconTilePreview />,
  "list-row": <ListRowPreview />,
  table: <TablePreview />,
  "data-table": <DataTablePreview />,
  "empty-state": <EmptyStatePreview />,
  alert: <AlertPreview />,
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
  metric: <MetricPreview />,
  delta: <DeltaPreview />,
  sparkline: <SparklinePreview />,
  redact: <RedactPreview />,
  "contribution-grid": <ContributionGridPreview />,
  "file-dropzone": <FileDropzonePreview />,
  "prompt-input": <PromptInputPreview />,
  "chat-thread": <ChatThreadPreview />,
  stepper: <StepperPreview />,
  "choice-card": <ChoiceCardPreview />,
  "swatch-picker": <SwatchPickerPreview />,
  "secret-field": <SecretFieldPreview />,
  chart: <ChartPreview />,
  "bar-list": <BarListPreview />,
  progress: <ProgressPreview />,
  accordion: <AccordionPreview />,
  "bento-grid": <BentoGridPreview />,
  "mobile-nav": <MobileNavPreview />,
  "filter-builder": <FilterBuilderPreview />,
  "page-outline": <PageOutlinePreview />,
  "sect-head": <SectHeadPreview />,
  "doc-parts": <DocPartsPreview />,
  "chrome-message": <ChromeMessagePreview />,
  "page-loading": <PageLoadingPreview />,
  reveal: <RevealPreview />,
  "type-in": <TypeInPreview />,
  "rolling-number": <RollingNumberPreview />,
  spotlight: <SpotlightPreview />,
  "spotlight-card": <SpotlightCardPreview />,
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
