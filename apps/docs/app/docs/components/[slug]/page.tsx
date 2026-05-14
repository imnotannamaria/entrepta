import { notFound } from "next/navigation";
import { ComponentPreview } from "./component-preview";

type Prop = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

type ComponentDef = {
  title: string;
  category: "Primitives" | "Layout" | "Feedback";
  description: string;
  install: string;
  usage: string;
  props: Prop[];
};

const COMPONENTS: Record<string, ComponentDef> = {
  button: {
    title: "Button",
    category: "Primitives",
    description:
      "Primary action element with 4 variants, 3 sizes, and a loading state. Extends all native <button> attributes.",
    install: "button",
    usage: `import { Button } from "@/components/entrepta/button"

<Button>./projects.sh →</Button>
<Button variant="secondary">$ npx entrepta init</Button>
<Button variant="ghost">cat contact.txt</Button>
<Button variant="command">npx entrepta add button</Button>
<Button size="sm" loading>Loading…</Button>`,
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "ghost" | "command"',
        default: '"primary"',
        description: "Visual style variant",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Height and padding scale",
      },
      {
        name: "loading",
        type: "boolean",
        default: "false",
        description: "Shows spinner and disables the button",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Delegates rendering to child via Radix Slot",
      },
    ],
  },
  badge: {
    title: "Badge",
    category: "Primitives",
    description: "Inline status chip. 3 variants × 6 semantic colors × 2 sizes.",
    install: "badge",
    usage: `import { Badge } from "@/components/entrepta/badge"

<Badge variant="solid" color="brand">FEATURED</Badge>
<Badge variant="soft" color="success" dot>open to work</Badge>
<Badge variant="outline" color="error">deprecated</Badge>
<Badge variant="soft" color="warning" dot>partial</Badge>`,
    props: [
      {
        name: "variant",
        type: '"solid" | "soft" | "outline"',
        default: '"soft"',
        description: "Fill style",
      },
      {
        name: "color",
        type: '"neutral" | "brand" | "success" | "warning" | "error" | "info"',
        default: '"neutral"',
        description: "Semantic color token",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        default: '"md"',
        description: "Height and padding",
      },
      {
        name: "dot",
        type: "boolean",
        default: "false",
        description: "Renders a colored status dot before the label",
      },
    ],
  },
  input: {
    title: "Input",
    category: "Primitives",
    description:
      "Text field in 3 variants: plain, search (magnifier icon), and command ($ prefix + ⌘K hint). Supports error state and 3 sizes.",
    install: "input",
    usage: `import { Input } from "@/components/entrepta/input"

<Input placeholder="resend-ecommerce" />
<Input variant="search" placeholder="search components…" />
<Input variant="command" placeholder="run command…" />
<Input state="error" defaultValue="HEALTHKIT_KEY" />`,
    props: [
      {
        name: "variant",
        type: '"default" | "search" | "command"',
        default: '"default"',
        description: "Shows prefix/suffix icon",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Height",
      },
      {
        name: "state",
        type: '"default" | "error"',
        default: '"default"',
        description: "Border color for validation feedback",
      },
    ],
  },
  card: {
    title: "Card",
    category: "Primitives",
    description:
      "Surface container in 4 flavours: default, featured (brand border), terminal (macOS chrome), and data (glass).",
    install: "card",
    usage: `import {
  Card, CardHeader, CardLabel, CardMeta, CardTitle,
  CardDescription, CardFooter, CardComment,
  CardTerminalBar, CardTerminalBody,
} from "@/components/entrepta/card"

<Card>
  <CardHeader>
    <CardLabel>latest post</CardLabel>
    <CardMeta>apr 12 · 1 min</CardMeta>
  </CardHeader>
  <CardTitle>
    Plain markdown beats <em>Notion</em>.
  </CardTitle>
  <CardDescription>Two years of database PTSD, condensed.</CardDescription>
  <CardFooter>
    <span>read →</span>
    <CardComment>draft</CardComment>
  </CardFooter>
</Card>

<Card variant="terminal">
  <CardTerminalBar>
    <CardLabel>install</CardLabel>
    <CardMeta>v0.1.0</CardMeta>
  </CardTerminalBar>
  <CardTerminalBody>$ npx entrepta init</CardTerminalBody>
</Card>`,
    props: [
      {
        name: "variant",
        type: '"default" | "featured" | "terminal" | "data"',
        default: '"default"',
        description: "Background and border style",
      },
    ],
  },
  dialog: {
    title: "Dialog",
    category: "Primitives",
    description:
      "Accessible modal via Radix UI. Composed of trigger, overlay, content, header, and footer sub-components.",
    install: "dialog",
    usage: `import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogLabel, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/entrepta/dialog"
import { Button } from "@/components/entrepta/button"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">$ rm -rf project</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogLabel>danger zone</DialogLabel>
      <DialogTitle>
        Delete <em>resend-ecommerce</em>?
      </DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when open state changes",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Whether to block interactions behind overlay",
      },
    ],
  },
  dropdown: {
    title: "Dropdown",
    category: "Primitives",
    description:
      "Context menu via Radix DropdownMenu. Supports items, separators, labels, shortcuts, and keyboard navigation.",
    install: "dropdown",
    usage: `import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuLabel, DropdownMenuShortcut,
  DropdownMenuDestructiveItem,
} from "@/components/entrepta/dropdown"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">~/options ↓</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>account</DropdownMenuLabel>
    <DropdownMenuItem>
      profile.tsx <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>settings.json</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuDestructiveItem>rm -rf session</DropdownMenuDestructiveItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when open state changes",
      },
      {
        name: "side",
        type: '"top" | "bottom" | "left" | "right"',
        default: '"bottom"',
        description: "Placement relative to trigger (on DropdownMenuContent)",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description: "Alignment along the trigger (on DropdownMenuContent)",
      },
    ],
  },
  tooltip: {
    title: "Tooltip",
    category: "Primitives",
    description:
      "Hover popover via Radix Tooltip. Wrap your app in TooltipProvider once at the root. Supports keyboard shortcut hints.",
    install: "tooltip",
    usage: `import {
  TooltipProvider, Tooltip, TooltipTrigger,
  TooltipContent, TooltipShortcut,
} from "@/components/entrepta/tooltip"

// In root layout:
<TooltipProvider>
  {children}
</TooltipProvider>

// Usage:
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="sm">⌘K</Button>
  </TooltipTrigger>
  <TooltipContent>
    open command palette <TooltipShortcut>⌘K</TooltipShortcut>
  </TooltipContent>
</Tooltip>`,
    props: [
      {
        name: "delayDuration",
        type: "number",
        default: "200",
        description: "Delay in ms before tooltip opens (TooltipProvider)",
      },
      {
        name: "side",
        type: '"top" | "bottom" | "left" | "right"',
        default: '"top"',
        description: "Placement relative to trigger (TooltipContent)",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "8",
        description: "Gap in px from trigger (TooltipContent)",
      },
    ],
  },
  tabs: {
    title: "Tabs",
    category: "Primitives",
    description:
      "Editor-style tab navigation via Radix Tabs. Active tab is marked with a ◆ glyph in brand color. Tabs can be closable and accept icons.",
    install: "tabs",
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/entrepta/tabs"

<Tabs defaultValue="home">
  <TabsList>
    <TabsTrigger value="home" onClose={() => {}}>home.tsx</TabsTrigger>
    <TabsTrigger value="about" onClose={() => {}}>about.md</TabsTrigger>
    <TabsTrigger value="stack" onClose={() => {}}>stack.json</TabsTrigger>
  </TabsList>
  <TabsContent value="home" className="p-5">…</TabsContent>
  <TabsContent value="about" className="p-5">…</TabsContent>
  <TabsContent value="stack" className="p-5">…</TabsContent>
</Tabs>`,
    props: [
      {
        name: "defaultValue",
        type: "string",
        description: "Initially active tab (uncontrolled)",
      },
      {
        name: "value",
        type: "string",
        description: "Controlled active tab",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Callback when active tab changes",
      },
      {
        name: "icon",
        type: "ReactNode",
        description: "Optional icon prefix (TabsTrigger)",
      },
      {
        name: "onClose",
        type: "() => void",
        description: "Shows close ✕ when set (TabsTrigger)",
      },
    ],
  },
  "status-bar": {
    title: "StatusBar",
    category: "Layout",
    description:
      "Fixed bottom bar with brand background. Left/right slots for status items. Hidden on mobile (sm:flex).",
    install: "status-bar",
    usage: `import {
  StatusBar, StatusBarItem, StatusBarSeparator,
} from "@/components/entrepta/status-bar"

// In root layout:
<StatusBar
  left={
    <>
      <StatusBarItem icon={<GitBranchIcon />}>main</StatusBarItem>
      <StatusBarSeparator />
      <StatusBarItem>0 errors</StatusBarItem>
    </>
  }
  right={
    <>
      <StatusBarItem>TypeScript</StatusBarItem>
      <StatusBarSeparator />
      <StatusBarItem>UTF-8</StatusBarItem>
    </>
  }
/>`,
    props: [
      {
        name: "left",
        type: "ReactNode",
        description: "Content for the left slot",
      },
      {
        name: "right",
        type: "ReactNode",
        description: "Content for the right slot",
      },
      {
        name: "icon",
        type: "ReactNode",
        description: "Optional icon prefix (StatusBarItem)",
      },
    ],
  },
  "top-nav": {
    title: "TopNav",
    category: "Layout",
    description:
      "Horizontal navigation with left/center/right slots. Compose with TopNavLogo, TopNavLogoMark (brand tile), TopNavBreadcrumb, TopNavMenu, and TopNavLink. Links support active and external states.",
    install: "top-nav",
    usage: `import {
  TopNav, TopNavLogo, TopNavLogoMark,
  TopNavBreadcrumb, TopNavSeparator,
  TopNavMenu, TopNavLink,
} from "@/components/entrepta/top-nav"

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
      <TopNavLink href="/" active>home</TopNavLink>
      <TopNavLink href="/docs">docs</TopNavLink>
      <TopNavLink href="https://github.com" external>github</TopNavLink>
    </TopNavMenu>
  }
/>`,
    props: [
      {
        name: "left",
        type: "ReactNode",
        description: "Left slot — logo and breadcrumb",
      },
      {
        name: "center",
        type: "ReactNode",
        description: "Centered slot — hidden on mobile",
      },
      {
        name: "right",
        type: "ReactNode",
        description: "Right slot — actions",
      },
    ],
  },
  toast: {
    title: "Toast",
    category: "Feedback",
    description:
      "Notification toasts via Sonner with entrepta tokens. Mount <Toaster> once in root layout, then call toast() anywhere.",
    install: "toast",
    usage: `import { Toaster } from "@/components/entrepta/toast"
import { toast } from "sonner"

// In root layout:
<Toaster position="bottom-right" />

// Trigger from anywhere:
toast.success("Component copied!")
toast.error("Build failed")
toast.warning("Deprecated API used")
toast("New update available")`,
    props: [
      {
        name: "position",
        type: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"',
        default: '"bottom-right"',
        description: "Where toasts appear on screen",
      },
      {
        name: "duration",
        type: "number",
        default: "4000",
        description: "Auto-dismiss delay in ms",
      },
      {
        name: "expand",
        type: "boolean",
        default: "false",
        description: "Always show all toasts expanded",
      },
    ],
  },
  skeleton: {
    title: "Skeleton",
    category: "Feedback",
    description:
      "Animated shimmer placeholder that respects prefers-reduced-motion. Use SkeletonText for multi-line text blocks.",
    install: "skeleton",
    usage: `import { Skeleton, SkeletonText } from "@/components/entrepta/skeleton"

// Avatar + text row
<div className="flex items-center gap-3">
  <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
  <SkeletonText lines={2} className="flex-1" />
</div>

// Image card
<Skeleton variant="rect" className="w-full h-40" />`,
    props: [
      {
        name: "variant",
        type: '"line" | "circle" | "rect"',
        default: '"rect"',
        description: "Shape preset",
      },
      {
        name: "lines",
        type: "number",
        default: "3",
        description: "Number of text lines (SkeletonText only)",
      },
    ],
  },
  "command-palette": {
    title: "CommandPalette",
    category: "Feedback",
    description:
      "⌘K command palette built with cmdk. Opens via global keyboard shortcut registered by useCommandPalette.",
    install: "command-palette",
    usage: `import {
  Command, CommandDialog, CommandInput,
  CommandList, CommandGroup, CommandItem, CommandEmpty,
} from "@/components/entrepta/command-palette"
import { useCommandPalette } from "@/hooks/use-command-palette"

export function MyPalette() {
  const { open, setOpen } = useCommandPalette()
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => router.push("/")}>
              Home
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}`,
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state (CommandDialog)",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback on close (CommandDialog)",
      },
      {
        name: "placeholder",
        type: "string",
        description: "Input placeholder (CommandInput)",
      },
      {
        name: "shortcut",
        type: "string",
        description: "Keyboard shortcut label (CommandItem)",
      },
      {
        name: "icon",
        type: "ReactNode",
        description: "Icon before label (CommandItem)",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(COMPONENTS).map((slug) => ({ slug }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = COMPONENTS[slug];
  if (!component) notFound();

  return (
    <article className="max-w-3xl">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-brand)] mb-6">
        {component.category}
      </div>

      <h1 className="font-serif text-4xl font-normal text-[var(--fg-primary)] leading-tight tracking-tight mb-3">
        {component.title}
      </h1>
      <p className="font-sans text-base text-[var(--fg-secondary)] leading-relaxed mb-8">
        {component.description}
      </p>

      <div className="flex items-center gap-3 mb-10">
        <code className="font-mono text-xs text-[var(--fg-brand)] bg-[var(--bg-canvas)] border border-[var(--border-subtle)] px-3 py-1.5 rounded-[var(--radius-sm)]">
          npx entrepta add {component.install}
        </code>
      </div>

      <section className="mb-10">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] border-b border-[var(--border-subtle)] pb-2 mb-6">
          Preview
        </h2>
        <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] bg-[var(--bg-canvas)] min-h-40 flex items-center justify-center p-8">
          <ComponentPreview slug={slug} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] border-b border-[var(--border-subtle)] pb-2 mb-6">
          Usage
        </h2>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border-subtle)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-error)] opacity-60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-warning)] opacity-60" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-success)] opacity-60" />
            <span className="font-mono text-xs text-[var(--fg-muted)] ml-2">
              {component.install}.tsx
            </span>
          </div>
          <pre className="font-mono text-xs text-[var(--fg-secondary)] leading-6 p-5 overflow-x-auto">
            <code>{component.usage}</code>
          </pre>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] border-b border-[var(--border-subtle)] pb-2 mb-6">
          Props
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="text-left py-2 pr-6 text-[var(--fg-muted)] font-normal uppercase tracking-widest text-[10px]">
                  Prop
                </th>
                <th className="text-left py-2 pr-6 text-[var(--fg-muted)] font-normal uppercase tracking-widest text-[10px]">
                  Type
                </th>
                <th className="text-left py-2 pr-6 text-[var(--fg-muted)] font-normal uppercase tracking-widest text-[10px]">
                  Default
                </th>
                <th className="text-left py-2 text-[var(--fg-muted)] font-normal uppercase tracking-widest text-[10px]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {component.props.map((prop) => (
                <tr
                  key={prop.name}
                  className="border-b border-[var(--border-subtle)] last:border-0"
                >
                  <td className="py-3 pr-6 text-[var(--fg-brand)]">{prop.name}</td>
                  <td className="py-3 pr-6 text-[var(--fg-secondary)] max-w-[200px]">
                    <span className="break-all">{prop.type}</span>
                  </td>
                  <td className="py-3 pr-6 text-[var(--fg-muted)]">{prop.default ?? "—"}</td>
                  <td className="py-3 text-[var(--fg-secondary)] font-sans">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
