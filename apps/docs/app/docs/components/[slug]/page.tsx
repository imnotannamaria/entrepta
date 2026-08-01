import fs from "node:fs/promises";
import path from "node:path";
import { ComponentInstall } from "@/components/component-install";
import { CodeBlock } from "@entrepta/registry/content/code-block";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentPreview } from "./component-preview";

const REGISTRY_ROOT = path.resolve(process.cwd(), "..", "..", "packages", "registry");

async function readSourceFile(relPath: string): Promise<string> {
  const resolved = path.resolve(REGISTRY_ROOT, relPath);
  const relative = path.relative(REGISTRY_ROOT, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to read outside the registry root: ${relPath}`);
  }
  // Defense in depth: resolve symlinks before reading so a symlinked file
  // inside the registry can't trick the path check into reading something
  // outside it. Build-time only, but cheap to be paranoid.
  const real = await fs.realpath(resolved);
  const realRoot = await fs.realpath(REGISTRY_ROOT);
  const realRel = path.relative(realRoot, real);
  if (realRel.startsWith("..") || path.isAbsolute(realRel)) {
    throw new Error(`Refusing to read symlinked path outside the registry root: ${relPath}`);
  }
  const raw = await fs.readFile(real, "utf-8");
  return rewriteImportsForConsumer(raw);
}

/**
 * Rewrite registry-internal import paths to the aliases users see in their
 * own project, so Manual-tab copy-paste works without manual edits. Mirrors
 * the rewrite the CLI does in `packages/cli/src/commands/add.ts`.
 */
function rewriteImportsForConsumer(source: string): string {
  return source
    .replace(
      /from\s+(['"])\.\.\/lib\/utils\1/g,
      (_, quote: string) => `from ${quote}@/lib/utils${quote}`
    )
    .replace(
      /from\s+(['"])\.\.\/hooks\/([A-Za-z0-9_-]+)\1/g,
      (_, quote: string, name: string) => `from ${quote}@/hooks/${name}${quote}`
    );
}

async function getComponentSources(
  component: ComponentDef
): Promise<{ filename: string; source: string; language?: string }[]> {
  const defaultRel = `${component.category.toLowerCase()}/${component.install}.tsx`;
  const filePaths = [defaultRel, ...(component.extraFiles ?? [])];

  return Promise.all(
    filePaths.map(async (relPath) => {
      const source = await readSourceFile(relPath);
      const basename = path.basename(relPath);
      const isHook = relPath.startsWith("hooks/");
      const dest = isHook ? `hooks/${basename}` : `components/entrepta/${basename}`;
      const language = basename.endsWith(".ts") ? "ts" : "tsx";
      return { filename: dest, source, language };
    })
  );
}

async function getUtilsSourceIfNeeded(sources: { source: string }[]): Promise<string | null> {
  const usesCn = sources.some(
    (f) => f.source.includes('from "@/lib/utils"') || f.source.includes("from '@/lib/utils'")
  );
  if (!usesCn) return null;
  return readSourceFile("lib/utils.ts");
}

type Prop = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

type ComponentDef = {
  title: string;
  category: "Primitives" | "Layout" | "Feedback" | "Content";
  description: string;
  install: string;
  usage: string;
  props: Prop[];
  /** npm packages required by this component (excludes clsx/tailwind-merge which init installs). */
  dependencies: string[];
  /** Extra registry files beyond `${category}/${install}.tsx`. Use the registry-relative path. */
  extraFiles?: string[];
};

const COMPONENTS: Record<string, ComponentDef> = {
  button: {
    title: "Button",
    category: "Primitives",
    description:
      "Primary action element with 4 variants, 3 sizes, and a loading state. Extends all native <button> attributes.",
    install: "button",
    dependencies: ["class-variance-authority", "lucide-react", "@radix-ui/react-slot"],
    usage: `import { Button } from "@/components/entrepta/button"

<Button>./projects.sh →</Button>
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
    dependencies: ["class-variance-authority"],
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
    dependencies: ["class-variance-authority", "lucide-react"],
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
    title: "Card",
    category: "Primitives",
    description:
      "Surface container in 4 flavours: default, featured (brand border), terminal (macOS chrome), and data (glass).",
    install: "card",
    dependencies: ["class-variance-authority"],
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
    ],
  },
  dialog: {
    title: "Dialog",
    category: "Primitives",
    description:
      "Accessible modal via Radix UI. Composed of trigger, overlay, content, header, and footer sub-components.",
    install: "dialog",
    dependencies: ["@radix-ui/react-dialog", "lucide-react"],
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
    dependencies: ["@radix-ui/react-dropdown-menu", "lucide-react"],
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
    dependencies: ["@radix-ui/react-tooltip"],
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
    dependencies: ["@radix-ui/react-tabs", "lucide-react"],
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
    dependencies: [],
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
    dependencies: [],
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
    title: "ThemeSwitcher",
    category: "Layout",
    description:
      "Floating theme + dark/light picker. Drives `data-theme` and `data-mode` on `<html>` and persists to localStorage. Ships with a `<ThemeScript>` helper that runs pre-paint to avoid flashes.",
    install: "theme-switcher",
    dependencies: ["lucide-react"],
    extraFiles: ["hooks/use-theme.ts", "hooks/use-mode.ts"],
    usage: `import {
  ThemeScript, ThemeSwitcher,
} from "@/components/entrepta/theme-switcher"

const THEMES = [
  { id: "entrepta", label: "entrepta", color: "#7C6BFF", lightColor: "#6B5BFF" },
  { id: "blossom",  label: "blossom",  color: "#CC2E36", lightColor: "#B8262E" },
  { id: "ivy",      label: "ivy",      color: "#35A365", lightColor: "#1E8350" },
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
    title: "ModeToggle",
    category: "Layout",
    description:
      "Dark/light switch with no theme picker. Drives `data-mode` on `<html>` and persists to localStorage. Renders inline by default, or floats in a corner with `position`. Ships with a `<ModeScript>` helper that runs pre-paint to avoid flashes.",
    install: "mode-toggle",
    dependencies: ["class-variance-authority", "lucide-react"],
    extraFiles: ["hooks/use-mode.ts"],
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
    title: "Toast",
    category: "Feedback",
    description:
      "Notification toasts via Sonner with entrepta tokens. Mount <Toaster> once in root layout, then call toast() anywhere.",
    install: "toast",
    dependencies: ["sonner"],
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
    dependencies: [],
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
      "⌘K command palette built with cmdk. Centered modal with ◆ brand-tinted selection, esc-to-close chip, and a status foot showing keyboard hints. Wire global shortcut with useCommandPalette.",
    install: "command-palette",
    dependencies: ["cmdk", "@radix-ui/react-dialog", "lucide-react"],
    extraFiles: ["hooks/use-command-palette.ts"],
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
    title: "CodeBlock",
    category: "Content",
    description:
      "Code container with optional macOS-style chrome, filename and language labels, and a one-click copy button. Pass raw code via the `code` prop; provide `children` for syntax-highlighted JSX rendering.",
    install: "code-block",
    dependencies: ["lucide-react"],
    usage: `import { CodeBlock } from "@/components/entrepta/code-block"

// Plain copy-paste snippet
<CodeBlock
  code={\`npx @entrepta/cli@latest init --theme=ivy\`}
  filename="install.sh"
  language="bash"
  variant="terminal"
/>

// Custom highlighted body — copy still grabs the raw code
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
};

export function generateStaticParams() {
  return Object.keys(COMPONENTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = COMPONENTS[slug];
  if (!component) return {};
  const canonical = `/docs/components/${slug}`;
  return {
    title: component.title,
    description: component.description,
    alternates: { canonical },
    openGraph: {
      title: `${component.title} · entrepta`,
      description: component.description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${component.title} · entrepta`,
      description: component.description,
    },
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = COMPONENTS[slug];
  if (!component) notFound();

  const sources = await getComponentSources(component);
  const utilsSource = await getUtilsSourceIfNeeded(sources);

  return (
    <article className="max-w-3xl">
      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-brand)] mb-6">
        {component.category}
      </div>

      <h1 className="font-serif text-4xl font-normal text-[var(--fg-primary)] leading-tight tracking-tight mb-3">
        {component.title}
      </h1>
      <p className="font-sans text-base text-[var(--fg-secondary)] leading-relaxed mb-10">
        {component.description}
      </p>

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
          Installation
        </h2>
        <ComponentInstall
          cliCommand={`npx @entrepta/cli@latest add ${component.install}`}
          dependencies={component.dependencies}
          files={sources}
          utilsSource={utilsSource}
        />
      </section>

      <section className="mb-10">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] border-b border-[var(--border-subtle)] pb-2 mb-6">
          Usage
        </h2>
        <CodeBlock
          code={component.usage}
          variant="terminal"
          filename={`${component.install}.tsx`}
          language="tsx"
        />
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
