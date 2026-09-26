export type Prop = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

/** The long-form text for a component page. Title and section live in component-index.ts. */
export type ComponentDoc = {
  description: string;
  usage: string;
  props: Prop[];
};

/**
 * What the docs say about each component, keyed by its manifest name. Server only: this is
 * too much text for a client bundle. Files and npm dependencies come from the manifest.
 */
export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  button: {
    description:
      "Primary action element with 4 variants, 3 sizes, 3 square icon sizes and a loading state. An icon goes in as a child, before or after the label. buttonVariants lives in its own file with no use client, so a server component can style a link as a button.",
    usage: `import { Button } from "@/components/entrepta/button"
import { ArrowRightIcon, GearIcon, RocketLaunchIcon } from "@phosphor-icons/react"

<Button>./projects.sh →</Button>
<Button><RocketLaunchIcon aria-hidden size={14} /> deploy</Button>
<Button variant="secondary">docs <ArrowRightIcon aria-hidden size={14} /></Button>
<Button variant="ghost" size="icon-md" aria-label="Settings">
  <GearIcon aria-hidden size={16} />
</Button>
<Button variant="secondary">$ npx @entrepta/cli@latest init</Button>
<Button variant="ghost">cat contact.txt</Button>
<Button variant="command">npx @entrepta/cli@latest add button</Button>
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
        type: '"sm" | "md" | "lg" | "icon-sm" | "icon-md" | "icon-lg"',
        default: '"md"',
        description:
          "Height and padding. The icon sizes are square: name the button with aria-label",
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
    description:
      "Inline status chip in 3 variants, 6 colors and 2 sizes, with a dot or an icon. Every variant uses an ink measured for its fill.",
    usage: `import { Badge } from "@/components/entrepta/badge"
import { CheckIcon, GitBranchIcon } from "@phosphor-icons/react"

<Badge variant="soft" color="success" icon={CheckIcon}>passing</Badge>
<Badge variant="outline" color="brand" icon={GitBranchIcon}>main</Badge>
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
      {
        name: "icon",
        type: "Icon",
        description:
          "A Phosphor icon component before the label, sized to the badge. Wins over dot",
      },
    ],
  },
  input: {
    description:
      "Text field in 3 variants: plain, search (magnifier icon), and command ($ prefix + ⌘K hint). Supports error state and 3 sizes.",
    usage: `import { Input } from "@/components/entrepta/input"

<Input placeholder="project-name" />
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
    description:
      "Surface container in 4 variants and 3 sizes. Near black with a border that lights up on hover. The header wraps instead of clipping.",
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
  <CardTerminalBody>$ npx @entrepta/cli@latest init</CardTerminalBody>
</Card>`,
    props: [
      {
        name: "variant",
        type: '"default" | "featured" | "terminal" | "data"',
        default: '"default"',
        description: "Background and border style",
      },
      {
        name: "size",
        type: '"sm" | "md" | "xl"',
        default: '"md"',
        description: "Padding, gap and radius",
      },
      {
        name: "as",
        type: '"span" | "h2" | "h3"',
        default: '"span"',
        description: "Render CardLabel as a heading (CardLabel only)",
      },
      {
        name: "icon",
        type: "Icon",
        description: "A Phosphor icon in place of the ◆ (CardLabel only)",
      },
    ],
  },
  dialog: {
    description:
      "Accessible modal on Radix, on the overlay surface. Composed of trigger, overlay, content, header and footer parts.",
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
        Delete <em>project-name</em>?
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
        name: "icon",
        type: "Icon",
        description: "A Phosphor icon in place of the ◆ (DialogLabel)",
      },
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
    description:
      "Context menu on Radix, on the overlay surface. The highlighted row takes the brand tint and its icon and shortcut turn brand. Items, icons, labels, shortcuts, checkbox and radio items, submenus and keyboard navigation.",
    usage: `import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuLabel, DropdownMenuShortcut,
  DropdownMenuDestructiveItem,
} from "@/components/entrepta/dropdown"
import { GearIcon, UserIcon } from "@phosphor-icons/react"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">~/options ↓</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>account</DropdownMenuLabel>
    <DropdownMenuItem>
      <UserIcon aria-hidden size={14} /> profile.tsx
      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <GearIcon aria-hidden size={14} /> settings.json
    </DropdownMenuItem>
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
    description:
      "Hover popover on Radix, on the overlay surface like every other overlay. Wrap your app in TooltipProvider once at the root. TooltipShortcut is a Kbd.",
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
  kbd: {
    description:
      "One look for every keyboard hint: a key cap chip, or plain text for rows that already have a surface. Inside a highlighted menu or palette row it takes the brand ink. Dropdown, CommandPalette, Tooltip and Input all use it.",
    usage: `import { Kbd } from "@/components/entrepta/kbd"

<Kbd>⌘K</Kbd>
<Button variant="secondary">search <Kbd>/</Kbd></Button>
<span><Kbd>⌘</Kbd>+<Kbd>⇧</Kbd>+<Kbd>P</Kbd></span>

// in a row with its own surface, such as a menu item
<Kbd variant="plain">⌘P</Kbd>`,
    props: [
      {
        name: "variant",
        type: '"chip" | "plain"',
        default: '"chip"',
        description: "A bordered key cap, or bare text",
      },
    ],
  },
  tabs: {
    description:
      'Editor file tabs. Tabs switches a panel in place; TabNav is a row of route links. One brand underline travels to the active tab, a Phosphor icon fills when active and grows on hover, and the active tab can show a close button. variant="window" makes either row the editor\'s title bar.',
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/entrepta/tabs"
import { FileTsxIcon, FileMdIcon, BracketsCurlyIcon } from "@phosphor-icons/react"

<Tabs defaultValue="home">
  <TabsList>
    <TabsTrigger value="home" icon={FileTsxIcon} onClose={() => {}}>home.tsx</TabsTrigger>
    <TabsTrigger value="about" icon={FileMdIcon} onClose={() => {}}>about.md</TabsTrigger>
    <TabsTrigger value="stack" icon={BracketsCurlyIcon} onClose={() => {}}>stack.json</TabsTrigger>
  </TabsList>
  <TabsContent value="home" className="p-5">…</TabsContent>
  <TabsContent value="about" className="p-5">…</TabsContent>
  <TabsContent value="stack" className="p-5">…</TabsContent>
</Tabs>

// Without an icon, the active tab gets a ◆
<TabsTrigger value="home">home.tsx</TabsTrigger>

// Tabs that are routes, as the editor's title bar:
// pass active, render your router's link with asChild
import { TabNav, TabNavLink } from "@/components/entrepta/tabs"

<TabNav aria-label="Pages" variant="window" end={<span>main</span>}>
  <TabNavLink asChild active={pathname === "/"} icon={HouseLineIcon}>
    <Link href="/">home.tsx</Link>
  </TabNavLink>
  <TabNavLink asChild active={pathname === "/about"} icon={UserSquareIcon}>
    <Link href="/about">about.md</Link>
  </TabNavLink>
</TabNav>`,
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
        name: "variant",
        type: '"strip" | "window"',
        default: '"strip"',
        description: "window adds the window dots and shows end as meta (TabsList, TabNav)",
      },
      {
        name: "end",
        type: "ReactNode",
        description:
          "Pinned right, outside the scroller. Meta from 768px in a window (TabsList, TabNav)",
      },
      {
        name: "icon",
        type: "ReactNode | Icon",
        description:
          "An element, or a Phosphor icon that fills when active and grows on hover. Defaults to ◆",
      },
      {
        name: "onClose",
        type: "() => void",
        description: "Shows a close button on the active tab",
      },
      {
        name: "active",
        type: "boolean",
        default: "false",
        description: "Marks the current route (TabNavLink)",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Renders your router's link (TabNavLink)",
      },
    ],
  },
  "status-bar": {
    description:
      "Bottom bar on the brand color, pinned to the viewport or placed in your layout. Left and right slots for status items. Hidden below 640px.",
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
        name: "position",
        type: '"fixed" | "static"',
        default: '"fixed"',
        description: "Pinned to the viewport, or a row in your own layout",
      },
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
    description:
      "Horizontal navigation with left/center/right slots. Compose with TopNavLogo, TopNavLogoMark (brand tile), TopNavBreadcrumb, TopNavMenu, and TopNavLink. Links support active and external states.",
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
        description: "Left slot. Logo and breadcrumb.",
      },
      {
        name: "center",
        type: "ReactNode",
        description: "Centered slot. Hidden on mobile.",
      },
      {
        name: "right",
        type: "ReactNode",
        description: "Right slot. Actions and menu.",
      },
    ],
  },
  "theme-switcher": {
    description:
      "Floating theme and dark/light picker, with the same panel, labels and rows as a dropdown. Several on one page stay in step. Drives data-theme and data-mode on <html> and remembers the choice. It needs every theme in your CSS: run init with --themes=all. ThemeScript sets the attributes before paint; add suppressHydrationWarning to your <html>.",
    usage: `import {
  ThemeScript, ThemeSwitcher,
} from "@/components/entrepta/theme-switcher"

// Switching needs every theme in your CSS: run init with --themes=all.
const THEMES = [
  { id: "entrepta", label: "entrepta", color: "#7C6BFF", lightColor: "#6656FF" },
  { id: "blossom",  label: "blossom",  color: "#CC2E36", lightColor: "#B02028" },
  { id: "ivy",      label: "ivy",      color: "#35A365", lightColor: "#258A50" },
] as const

// In your root <head>, before React hydrates:
<ThemeScript storageKey="myapp" />

// Anywhere in the tree (usually the root layout):
<ThemeSwitcher
  themes={THEMES}
  defaultTheme="entrepta"
  storageKey="myapp"
/>`,
    props: [
      {
        name: "themes",
        type: "ThemeOption[]",
        description: "List of themes. Each `{ id, label, color, lightColor? }`. Required.",
      },
      {
        name: "defaultTheme",
        type: "string",
        default: "themes[0].id",
        description: "Theme id to use when nothing is stored.",
      },
      {
        name: "defaultMode",
        type: '"dark" | "light"',
        default: '"dark"',
        description: "Initial mode when nothing is stored.",
      },
      {
        name: "storageKey",
        type: "string",
        default: '"entrepta"',
        description: "Prefix for the two localStorage keys (`:theme`, `:mode`).",
      },
      {
        name: "position",
        type: '"bottom-right" | "bottom-left" | "top-right" | "top-left"',
        default: '"bottom-right"',
        description: "Where the floating trigger anchors.",
      },
      {
        name: "hideModeToggle",
        type: "boolean",
        default: "false",
        description: "Hide the dark/light section and the mode label on the trigger.",
      },
      {
        name: "disableMode",
        type: "boolean",
        default: "false",
        description: "Lock mode to `defaultMode`. Useful for dark-only sites.",
      },
    ],
  },
  "mode-toggle": {
    description:
      "Dark/light switch with no theme picker. Drives data-mode on <html> and remembers the choice. Inline by default, or floating with position. ModeScript sets the mode before paint; add suppressHydrationWarning to your <html>.",
    usage: `import {
  ModeScript, ModeToggle,
} from "@/components/entrepta/mode-toggle"

// In your root <head>, before React hydrates:
<ModeScript />

// Inline, drop it in a nav or a toolbar:
<ModeToggle />
<ModeToggle variant="labeled" size="sm" />

// Floating, same anchors as ThemeSwitcher:
<ModeToggle position="bottom-right" />`,
    props: [
      {
        name: "variant",
        type: '"icon" | "labeled"',
        default: '"icon"',
        description: "`labeled` adds the current mode name next to the glyph.",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        default: '"md"',
        description: "Height and padding scale.",
      },
      {
        name: "position",
        type: '"bottom-right" | "bottom-left" | "top-right" | "top-left"',
        description: "Anchors the button to a screen corner. Omit to keep it inline.",
      },
      {
        name: "defaultMode",
        type: '"dark" | "light"',
        default: '"dark"',
        description: "Mode to use when nothing is stored.",
      },
      {
        name: "storageKey",
        type: "string",
        default: '"entrepta"',
        description: "Prefix for the localStorage key (`:mode`). Match it to ThemeSwitcher.",
      },
      {
        name: "onModeChange",
        type: "(mode: ThemeMode) => void",
        description: "Fires after the mode changes.",
      },
    ],
  },
  toast: {
    description:
      "Notification toasts via Sonner, on the overlay surface. The status shows as a tinted icon tile and a glow in the corner, and each status has its own icon shape. Mount <Toaster> once in the root layout, then call toast() anywhere.",
    usage: `import { Toaster } from "@/components/entrepta/toast"
import { toast } from "sonner"

// In root layout:
<Toaster position="bottom-right" />

// Trigger from anywhere:
toast.success("Component copied!")
toast.error("Build failed")
toast.warning("Deprecated API used")
toast("New update available", {
  action: { label: "reload", onClick: () => location.reload() },
})`,
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
    description:
      "Shimmer placeholder that respects reduced motion. Offset each piece with delay so a card moves as one wave. For grids of hundreds, use the .skeleton-sweep class instead.",
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
        name: "delay",
        type: "number",
        default: "0",
        description: "Seconds to offset the shimmer, so a grid of pieces moves as one wave",
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
    description:
      "⌘K command palette built on cmdk, on the overlay surface. Rows highlight like a dropdown: the brand tint, and the icon and shortcut turn brand. A ◆ on each group, and Kbd chips for esc and the footer hints. Use Command alone for an inline list, or inside CommandDialog. Wire the shortcut with useCommandPalette.",
    usage: `import {
  Command, CommandDialog, CommandInput,
  CommandList, CommandGroup, CommandItem, CommandEmpty,
  CommandSeparator, CommandFoot,
} from "@/components/entrepta/command-palette"
import { useCommandPalette } from "@/hooks/use-command-palette"

export function MyPalette() {
  const { open, setOpen } = useCommandPalette()
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="type to filter…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="pages">
            <CommandItem shortcut="⌘1" onSelect={() => router.push("/")}>
              home.tsx
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="actions">
            <CommandItem shortcut="⌘⇧D" onSelect={deploy}>
              Deploy to production
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <CommandFoot />
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
  "code-block": {
    description:
      "Code container with optional window chrome, filename and language labels, and a copy button that says so when the copy fails. Pass raw code in code, or children for highlighted JSX.",
    usage: `import { CodeBlock } from "@/components/entrepta/code-block"

// Plain copy-paste snippet
<CodeBlock
  code={\`npx @entrepta/cli@latest init --theme=ivy\`}
  filename="install.sh"
  language="bash"
  variant="terminal"
/>

// Custom highlighted body; copy still grabs the raw code
<CodeBlock code={raw} filename="tokens.css" language="css">
  <span className="text-[var(--fg-brand)]">--fg-brand</span>: #7C6BFF;
</CodeBlock>`,
    props: [
      {
        name: "code",
        type: "string",
        description: "Raw code string copied to the clipboard. Required.",
      },
      {
        name: "filename",
        type: "string",
        description: "Label shown on the left of the chrome",
      },
      {
        name: "language",
        type: "string",
        description: "Language tag shown on the right (e.g. bash, tsx, css)",
      },
      {
        name: "meta",
        type: "string",
        description: "Secondary label between filename and language",
      },
      {
        name: "variant",
        type: '"default" | "terminal"',
        default: '"default"',
        description: "`terminal` adds three macOS-style window dots",
      },
      {
        name: "showCopy",
        type: "boolean",
        default: "true",
        description: "Toggle the copy button",
      },
      {
        name: "copyTimeout",
        type: "number",
        default: "1500",
        description: "How long the 'copied' state stays visible (ms)",
      },
    ],
  },
  checkbox: {
    description:
      "A native checkbox under a drawn box. The check draws itself in on the brand fill. Takes a label, a muted description, and an indeterminate state for a select all.",
    usage: `import { Checkbox } from "@/components/entrepta/checkbox"

<Checkbox label="button" defaultChecked />
<Checkbox label="diamond" description="needed by card" checked disabled />
<Checkbox
  label="primitives"
  checked={all}
  indeterminate={some && !all}
  onChange={toggleAll}
/>`,
    props: [
      { name: "label", type: "ReactNode", description: "Clickable label beside the box" },
      {
        name: "description",
        type: "ReactNode",
        description: "Muted line under the label, read as the description",
      },
      {
        name: "indeterminate",
        type: "boolean",
        default: "false",
        description: "The mixed state, a dash on the brand fill",
      },
      { name: "checked", type: "boolean", description: "Controlled state, like a native input" },
    ],
  },
  switch: {
    description:
      "An on/off switch over a native checkbox, so focus, keyboard, forms and screen readers come from the browser.",
    usage: `import { Switch } from "@/components/entrepta/switch"

<Switch label="send me a copy" defaultChecked />
<Switch label="notifications" checked={on} onChange={(e) => setOn(e.target.checked)} />`,
    props: [
      { name: "label", type: "ReactNode", description: "Clickable label next to the switch" },
      { name: "checked", type: "boolean", description: "Controlled state" },
      { name: "defaultChecked", type: "boolean", description: "Uncontrolled starting state" },
      { name: "disabled", type: "boolean", default: "false", description: "Dims and disables" },
    ],
  },
  textarea: {
    description:
      "A multi-line field for prose. Sans for what you type, mono for the placeholder, and an error state.",
    usage: `import { Textarea } from "@/components/entrepta/textarea"

<Textarea placeholder="// what are you building?" />
<Textarea state="error" rows={6} />`,
    props: [
      {
        name: "state",
        type: '"default" | "error"',
        default: '"default"',
        description: "Error sets the border and aria-invalid",
      },
      { name: "rows", type: "number", default: "4", description: "Visible lines" },
    ],
  },
  field: {
    description:
      "Label, control, and error or hint in one column. It wires the control for screen readers: id, aria-describedby and aria-invalid.",
    usage: `import { Field } from "@/components/entrepta/field"
import { Input } from "@/components/entrepta/input"
import { Textarea } from "@/components/entrepta/textarea"

<Field id="email" label="email" required hint="we never share it">
  <Input type="email" required />
</Field>

<Field id="message" label="message" error={errors.message}>
  <Textarea />
</Field>`,
    props: [
      {
        name: "id",
        type: "string",
        description: "The control's id. Error and hint ids derive from it",
      },
      { name: "label", type: "ReactNode", description: "Mono label with a ◆" },
      { name: "icon", type: "Icon", description: "A Phosphor icon in place of the label's ◆" },
      {
        name: "required",
        type: "boolean",
        description: "Adds a brand *. Put required on the control too",
      },
      { name: "error", type: "ReactNode", description: "Replaces the hint, announced as an alert" },
      { name: "hint", type: "ReactNode", description: "Muted line under the control" },
    ],
  },
  "filter-pill": {
    description:
      "A toggle for one filter value, announced as pressed. Pair it with the use-url-filter hook to keep the choice in the URL.",
    usage: `import { FilterPill } from "@/components/entrepta/filter-pill"
import { useUrlFilter } from "@/hooks/use-url-filter"

const TYPES = ["film", "book"] as const
const [type, setType] = useUrlFilter("type", TYPES)

{TYPES.map((t) => (
  <FilterPill
    key={t}
    label={t}
    count={counts[t]}
    active={type === t}
    onClick={() => setType(type === t ? null : t)}
  />
))}`,
    props: [
      { name: "label", type: "ReactNode", description: "Text on the pill" },
      { name: "active", type: "boolean", description: "Pressed state, sets aria-pressed" },
      { name: "count", type: "number", description: "Tally beside the label, at full contrast" },
      { name: "icon", type: "Icon", description: "A Phosphor icon; it fills when active" },
      {
        name: "useUrlFilter(param, allowed, path?)",
        type: "[value, set]",
        description: "Hook: reads and writes ?param=value with pushState, prerender safe",
      },
    ],
  },
  sidebar: {
    description:
      "A 56px icon rail. The active icon fills and a ◆ travels to it. Routing stays yours: pass active and your link component.",
    usage: `import { Sidebar } from "@/components/entrepta/sidebar"
import { FileMdIcon, HouseLineIcon } from "@phosphor-icons/react"
import Link from "next/link"

const ITEMS = [
  { id: "home", label: "Home", href: "/", icon: HouseLineIcon },
  { id: "blog", label: "Blog", href: "/blog", icon: FileMdIcon },
]

<Sidebar items={ITEMS} active={current} linkComponent={Link} logo={<Logo />} />`,
    props: [
      {
        name: "items",
        type: "{ id, label, href, icon }[]",
        description: "Icons are Phosphor components",
      },
      { name: "active", type: "string", description: "Id of the current item" },
      {
        name: "linkComponent",
        type: "ElementType",
        default: '"a"',
        description: "Your router's link",
      },
      { name: "logo", type: "ReactNode", description: "Top of the rail" },
    ],
  },
  "page-outline": {
    description:
      "A sticky outline of the page's sections that follows the scroll. Shown from 1100px up. Works with the window or your own scroll container.",
    usage: `import { PageOutline } from "@/components/entrepta/page-outline"

<PageOutline
  file="about.md"
  items={[
    { id: "intro", label: "intro", level: 1 },
    { id: "career", label: "career", level: 2, count: 4 },
  ]}
  scrollContainer={() => document.querySelector("main")}
/>`,
    props: [
      {
        name: "items",
        type: "{ id, label, level, count? }[]",
        description: "One per section id on the page",
      },
      { name: "file", type: "string", description: "Name in the chip at the top" },
      { name: "footer", type: "ReactNode", description: "Lines under the list" },
      {
        name: "scrollContainer",
        type: "() => HTMLElement | null",
        description: "What scrolls, when it is not the window",
      },
      {
        name: "offset",
        type: "number",
        default: "24",
        description: "Space above a heading after a jump",
      },
    ],
  },
  "sect-head": {
    description:
      "The $ command rule that opens a section, over a dashed line with meta on the right. The row wraps and each half stays whole.",
    usage: `import { SectHead } from "@/components/entrepta/sect-head"

<SectHead id="work" cmd="ls ./work --featured" meta="4 projects" />`,
    props: [
      { name: "cmd", type: "string", description: "The command after the $" },
      { name: "meta", type: "ReactNode", description: "Right side" },
      { name: "id", type: "string", description: "Put on the heading, for anchors" },
      { name: "as", type: '"h2" | "h3" | "span"', default: '"h2"', description: "Heading level" },
    ],
  },
  "doc-parts": {
    description:
      "The pieces a long-form page is written in: DocLabel, Section, DisplayH2, Prose, Em and Strong. No entrance built in, so they never pull in motion.",
    usage: `import { DisplayH2, DocLabel, Em, Prose, Section, Strong } from "@/components/entrepta/doc-parts"

<Section id="about" variant="first">
  <DocLabel>about</DocLabel>
  <DisplayH2>Engineer, <em>mostly</em>.</DisplayH2>
  <Prose>
    I build <Strong>design systems</Strong> and ship them as <Em>copy-paste</Em> code.
  </Prose>
</Section>`,
    props: [
      {
        name: "level",
        type: '"#" | "##"',
        default: '"#"',
        description: "Markdown prefix (DocLabel)",
      },
      {
        name: "variant",
        type: '"default" | "first"',
        default: '"default"',
        description: "The first section has no rule above it (Section)",
      },
    ],
  },
  "chrome-message": {
    description:
      "The surface for 404 and error screens: a $ command, an output line, a serif title, a note and an action. No hooks, so a server component can render it.",
    usage: `import { ChromeMessage } from "@/components/entrepta/chrome-message"

// app/not-found.tsx
export default function NotFound() {
  return (
    <ChromeMessage
      command="cat ./this-page"
      output="cat: ./this-page: No such file or directory"
      title="Page not found."
      note="it moved, or it never existed"
      action={<Link href="/">go home</Link>}
    />
  )
}

// app/error.tsx: an error boundary is a client component
"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ChromeMessage
      accent="error"
      command="npm run page"
      title="Something broke."
      note="the error was logged"
      action={<Button onClick={reset}>try again</Button>}
    >
      {error.digest && <p className="font-mono text-mono-sm">digest: {error.digest}</p>}
    </ChromeMessage>
  )
}`,
    props: [
      { name: "command", type: "string", description: "The command after the $" },
      {
        name: "accent",
        type: '"brand" | "error"',
        default: '"brand"',
        description: "Color of the $",
      },
      { name: "output", type: "string", description: "A terminal output line" },
      { name: "title", type: "ReactNode", description: "Serif h1" },
      { name: "note", type: "ReactNode", description: "Mono line under the title" },
      { name: "action", type: "ReactNode", description: "A way back" },
    ],
  },
  "page-loading": {
    description:
      "A loading screen in CSS alone, so it moves before JavaScript runs. The command types itself, and the list of what is loading appears only if the wait passes 2.2s.",
    usage: `import { PageLoading } from "@/components/entrepta/page-loading"

// app/log/loading.tsx
export default function Loading() {
  return (
    <PageLoading
      command="ls ./log"
      crumb="log"
      label="the log"
      steps={["reading entries", "reading covers"]}
    />
  )
}`,
    props: [
      { name: "command", type: "string", description: "The command the loaded page prints" },
      { name: "crumb", type: "string", description: "Breadcrumb after ~" },
      { name: "steps", type: "string[]", description: "Shown only on a long wait" },
      { name: "label", type: "string", description: "Announced once: Loading {label}" },
    ],
  },
  reveal: {
    description:
      "The entrance every card shares: it rises 14px and fades in once on screen. Staggers lists by index, capped at six.",
    usage: `import { Reveal, useReveal } from "@/components/entrepta/reveal"
import { motion } from "motion/react"

{posts.map((post, i) => (
  <Reveal key={post.slug} index={i}>
    <Card>…</Card>
  </Reveal>
))}

// on your own motion element
<motion.div {...useReveal(0.1)}>…</motion.div>`,
    props: [
      {
        name: "index",
        type: "number",
        default: "0",
        description: "Position in a list, for the stagger",
      },
      { name: "delay", type: "number", default: "0", description: "Seconds before the entrance" },
      { name: "step", type: "number", default: "0.06", description: "Seconds between list items" },
    ],
  },
  "type-in": {
    description:
      "Text that assembles itself piece by piece when it comes on screen. The whole sentence is in the DOM from the first render, for crawlers and screen readers.",
    usage: `import { TypeIn } from "@/components/entrepta/type-in"

<TypeIn as="h1" text="Build with entrepta." emphasis="entrepta" />
<TypeIn text="A longer sentence that wraps on small screens." by="word" />`,
    props: [
      { name: "text", type: "string", description: "The sentence" },
      { name: "emphasis", type: "string", description: "A substring set in serif italic" },
      {
        name: "by",
        type: '"char" | "word"',
        default: '"char"',
        description: "Use word for anything that wraps",
      },
      {
        name: "as",
        type: '"span" | "h1" | "h2" | "h3" | "p"',
        default: '"span"',
        description: "Element",
      },
      {
        name: "delay",
        type: "number",
        default: "0",
        description: "Seconds before the first piece",
      },
      { name: "speed", type: "number", description: "Seconds between pieces" },
    ],
  },
  "rolling-number": {
    description:
      "A number that rolls into place like an odometer, and turns once more on hover. The real value is in an sr-only copy.",
    usage: `import { RollingNumber, useRollOnHover } from "@/components/entrepta/rolling-number"

function Stat() {
  const roll = useRollOnHover(0.2)
  return (
    <div {...roll.handlers} className="font-serif text-display-md">
      <RollingNumber value={128} cycle={roll.cycle} delay={roll.delay} height={44} />
    </div>
  )
}`,
    props: [
      { name: "value", type: "number | string", description: "Whole number. Commas stay still" },
      { name: "cycle", type: "number", default: "0", description: "Change it to roll a full turn" },
      {
        name: "delay",
        type: "number",
        default: "0",
        description: "Entrance delay. 0 after interaction",
      },
      { name: "height", type: "number", default: "34", description: "Height of one digit in px" },
    ],
  },
  spotlight: {
    description:
      "A brand glow that trails the cursor across a card on a spring. It moves by transform, so it never repaints the card.",
    usage: `import { Spotlight, useSpotlight } from "@/components/entrepta/spotlight"

function GlowCard() {
  const { onMouseMove, spotlight } = useSpotlight(560)
  return (
    <Card onMouseMove={onMouseMove}>
      <Spotlight {...spotlight} />
      …
    </Card>
  )
}`,
    props: [
      {
        name: "useSpotlight(size?)",
        type: "{ onMouseMove, spotlight }",
        description: "Size is the glow diameter in px, 560 by default",
      },
    ],
  },
  "arrow-link": {
    description:
      "A text link with an arrow that travels and a brand rule that wipes in on hover and focus. Renders an a, or your router's link with asChild.",
    usage: `import { ArrowLink, ArrowAffordance } from "@/components/entrepta/arrow-link"

<ArrowLink href="/docs">read the docs</ArrowLink>
<ArrowLink href="https://github.com/you" external>github</ArrowLink>
<ArrowLink asChild><Link href="/blog">all posts</Link></ArrowLink>

// a card that is one big link: the footer answers the card's hover
<a href="/post" className="group/arrow">
  <ArrowAffordance>read</ArrowAffordance>
</a>`,
    props: [
      {
        name: "external",
        type: "boolean",
        default: "false",
        description: "Up-right arrow, opens in a new tab",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Renders your router's link",
      },
    ],
  },
};
