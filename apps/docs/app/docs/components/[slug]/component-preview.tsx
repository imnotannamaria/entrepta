"use client";

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
import { PageOutline } from "@entrepta/registry/layout/page-outline";
import { Sidebar } from "@entrepta/registry/layout/sidebar";
import { StatusBar, StatusBarItem, StatusBarSeparator } from "@entrepta/registry/layout/status-bar";
import { Titlebar } from "@entrepta/registry/layout/titlebar";
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
import { Badge } from "@entrepta/registry/primitives/badge";
import { Button } from "@entrepta/registry/primitives/button";
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
  DropdownMenuContent,
  DropdownMenuDestructiveItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@entrepta/registry/primitives/dropdown";
import { Field } from "@entrepta/registry/primitives/field";
import { FilterPill } from "@entrepta/registry/primitives/filter-pill";
import { Input } from "@entrepta/registry/primitives/input";
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
  FileCodeIcon,
  GearIcon,
  GitBranchIcon,
  HouseIcon,
  LightningIcon,
  MoonIcon,
  SunIcon,
  TagIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

function ButtonPreview() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-wrap items-center gap-3">
        <Button>./projects.sh →</Button>
        <Button variant="secondary">$ npx @entrepta/cli@latest init</Button>
        <Button variant="ghost">cat contact.txt</Button>
        <Button variant="command">npx @entrepta/cli add button</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">small 32h</Button>
        <Button size="md">medium 40h</Button>
        <Button size="lg">large 48h</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          Click to load
        </Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  );
}

function BadgePreview() {
  const colors = ["neutral", "brand", "success", "warning", "error", "info"] as const;
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <Badge key={color} variant="solid" color={color}>
            {color}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <Badge key={color} variant="soft" color={color}>
            {color}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <Badge key={color} variant="outline" color={color}>
            {color}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="soft" color="success" dot>
          open to work
        </Badge>
        <Badge variant="soft" color="warning" dot>
          partial
        </Badge>
        <Badge variant="soft" color="error" dot>
          error
        </Badge>
        <Badge variant="soft" color="info" dot>
          syncing
        </Badge>
        <Badge variant="soft" color="neutral" dot>
          idle
        </Badge>
      </div>
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
          Two years of database PTSD, condensed into an opinionated rant about plain text and git.
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
          <CardMeta>v0.1.0</CardMeta>
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">~/options ↓</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>account</DropdownMenuLabel>
        <DropdownMenuItem>
          profile.tsx
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          settings.json
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>workspace</DropdownMenuLabel>
        <DropdownMenuItem>
          new project
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>switch theme</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuDestructiveItem>
          rm -rf session
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
  return (
    <div className="w-full max-w-2xl border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home" onClose={() => {}}>
            home.tsx
          </TabsTrigger>
          <TabsTrigger value="about" onClose={() => {}}>
            about.md
          </TabsTrigger>
          <TabsTrigger value="stack" onClose={() => {}}>
            stack.json
          </TabsTrigger>
          <TabsTrigger value="contact" onClose={() => {}}>
            contact.txt
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="p-5 font-mono text-mono-md text-[var(--fg-secondary)]">
          <div>
            <span className="text-[var(--fg-muted)]">{"// "}</span>landing page
          </div>
          <div className="mt-1">
            <span className="text-[var(--fg-brand-text)]">export default</span> function Home()
          </div>
        </TabsContent>
        <TabsContent
          value="about"
          className="p-5 font-sans text-body-md text-[var(--fg-secondary)] leading-relaxed"
        >
          Engineer building a personal design system. Dark-first, IDE-style, opinionated.
        </TabsContent>
        <TabsContent
          value="stack"
          className="p-5 font-mono text-mono-md text-[var(--fg-secondary)]"
        >
          <div>
            <span className="text-[var(--fg-muted)]">"framework":</span>{" "}
            <span className="text-[var(--status-success-fg)]">"next-15"</span>
          </div>
          <div>
            <span className="text-[var(--fg-muted)]">"react":</span>{" "}
            <span className="text-[var(--status-success-fg)]">"19"</span>
          </div>
        </TabsContent>
        <TabsContent
          value="contact"
          className="p-5 font-mono text-mono-md text-[var(--fg-secondary)]"
        >
          a2002aninha22@gmail.com
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusBarPreview() {
  return (
    <div className="w-full max-w-2xl border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
      <div className="bg-[var(--bg-surface)] h-20 flex items-center justify-center">
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
      <div className="bg-[var(--bg-surface)] h-20 flex items-center justify-center">
        <p className="font-mono text-mono-sm text-[var(--fg-muted)]">page content</p>
      </div>
    </div>
  );
}

function ToastPreview() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast.success("Build passed", {
            description: "12 components compiled in 1.4s",
          })
        }
      >
        success
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast.error("Type error in button.tsx", {
            description: "Property 'variant' does not exist on type 'ButtonProps'",
          })
        }
      >
        error
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast.warning("Deprecated API", {
            description: "useTheme() will be removed in v1.0. Use ThemeProvider instead.",
          })
        }
      >
        warning
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast.info("Update available", {
            description: "entrepta@0.2.0 is ready to install",
          })
        }
      >
        info
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast("Snapshot saved", { description: "~/projects/entrepta/snapshot.json" })
        }
      >
        default
      </Button>
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

function CommandPalettePreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        open palette{" "}
        <kbd className="ml-2 px-1 font-mono text-mono-sm border border-[var(--border-strong)] rounded-[3px] text-[var(--fg-muted)]">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="type to filter…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="pages">
              <CommandItem
                icon={<HouseIcon size={13} />}
                shortcut="⌘1"
                onSelect={() => setOpen(false)}
              >
                home.tsx
              </CommandItem>
              <CommandItem
                icon={<FileCodeIcon size={13} />}
                shortcut="⌘2"
                onSelect={() => setOpen(false)}
              >
                docs/installation
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="components">
              <CommandItem
                icon={<LightningIcon size={13} />}
                shortcut="B"
                onSelect={() => setOpen(false)}
              >
                Button
              </CommandItem>
              <CommandItem
                icon={<LightningIcon size={13} />}
                shortcut="Bd"
                onSelect={() => setOpen(false)}
              >
                Badge
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="actions">
              <CommandItem
                icon={<GitBranchIcon size={13} />}
                shortcut="⌘⇧D"
                onSelect={() => setOpen(false)}
              >
                Deploy to production
              </CommandItem>
              <CommandItem
                icon={<GearIcon size={13} />}
                shortcut="⌘,"
                onSelect={() => setOpen(false)}
              >
                Settings
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandFoot />
        </Command>
      </CommandDialog>
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
  const themes = [
    { id: "entrepta", label: "entrepta", color: "#7C6BFF", active: true },
    { id: "blossom", label: "blossom", color: "#CC2E36", active: false },
    { id: "marmalade", label: "marmalade", color: "#FF8213", active: false },
    { id: "julia", label: "julia", color: "#E85A8A", active: false },
    { id: "ivy", label: "ivy", color: "#35A365", active: false },
    { id: "bosco", label: "bosco", color: "#2563EB", active: false },
  ];
  return (
    <div className="w-full max-w-md flex flex-col items-end gap-3 font-mono text-mono-sm">
      <div
        aria-hidden
        className="flex flex-col gap-1 p-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] min-w-[200px]"
      >
        <div className="px-2 py-1 text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)] border-b border-[var(--border-subtle)] mb-1">
          mode
        </div>
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-[var(--radius-sm)]">
          <span className="flex items-center gap-2.5">
            <span className="inline-grid place-items-center w-4 h-4 shrink-0 text-[var(--fg-primary)]">
              <MoonIcon size={14} />
            </span>
            <span className="text-[var(--fg-primary)]">dark</span>
          </span>
          <span className="text-[var(--fg-muted)] text-mono-xs uppercase tracking-[0.08em]">
            → light
          </span>
        </div>
        <div className="px-2 py-1 text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)] border-b border-[var(--border-subtle)] mt-2 mb-1">
          theme
        </div>
        {themes.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-sm)]"
          >
            <span
              className="inline-block w-4 h-4 rounded-full border border-[var(--border-subtle)] shrink-0"
              style={{ background: t.color }}
            />
            <span
              className={
                t.active ? "text-[var(--fg-primary)] flex-1" : "text-[var(--fg-secondary)] flex-1"
              }
            >
              {t.label}
            </span>
            {t.active && (
              <span className="text-[var(--fg-brand)] text-mono-xs leading-none">◆</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
        <span
          className="inline-block w-3.5 h-3.5 rounded-full border border-[var(--border-subtle)]"
          style={{ background: "#7C6BFF" }}
        />
        <span className="text-[var(--fg-muted)] uppercase tracking-[0.08em] text-mono-xs">
          dark
        </span>
      </div>
      <p className="self-start text-mono-xs text-[var(--fg-muted)] uppercase tracking-[0.08em]">
        {"// live switcher sits in the corner of every docs page"}
      </p>
    </div>
  );
}

function ModeGlyph({ mode, size }: { mode: "dark" | "light"; size: "sm" | "md" }) {
  const Icon = mode === "dark" ? MoonIcon : SunIcon;
  return <Icon size={size === "sm" ? 12 : 14} />;
}

function ModeTogglePreview() {
  const shell =
    "inline-flex items-center justify-center font-mono uppercase tracking-[0.08em] rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--fg-secondary)]";
  return (
    <div aria-hidden className="w-full max-w-md flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
          {"// icon"}
        </span>
        <div className="flex items-center gap-3">
          <span className={`${shell} h-9 w-9`}>
            <ModeGlyph mode="dark" size="md" />
          </span>
          <span className={`${shell} h-7 w-7`}>
            <ModeGlyph mode="light" size="sm" />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-mono text-mono-xs uppercase tracking-[0.08em] text-[var(--fg-muted)]">
          {"// labeled"}
        </span>
        <div className="flex items-center gap-3">
          <span className={`${shell} h-9 px-3 gap-2 text-mono-sm`}>
            <ModeGlyph mode="dark" size="md" />
            dark
          </span>
          <span className={`${shell} h-7 px-2.5 gap-2 text-mono-xs`}>
            <ModeGlyph mode="light" size="sm" />
            light
          </span>
        </div>
      </div>
    </div>
  );
}

function DiamondPreview() {
  return (
    <div className="flex flex-col gap-3 font-mono uppercase tracking-[0.08em] text-[var(--fg-secondary)]">
      <span className="inline-flex items-center gap-1.5 text-mono-xs">
        <Diamond size={9} /> mono-xs · 9px
      </span>
      <span className="inline-flex items-center gap-1.5 text-mono-sm">
        <Diamond size={10} /> mono-sm · 10px
      </span>
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

function TitlebarPreview() {
  const [active, setActive] = useState("home");
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
      <Titlebar meta={<span>main</span>}>
        <TabNav aria-label="Preview pages">
          {["home", "about"].map((name) => (
            <TabNavLink
              key={name}
              href={`#${name}`}
              active={active === name}
              icon={name === "home" ? HouseIcon : FileCodeIcon}
              onClick={(e) => {
                e.preventDefault();
                setActive(name);
              }}
              onClose={name === "about" ? () => setActive("home") : undefined}
            >
              {name === "home" ? "home.tsx" : "about.md"}
            </TabNavLink>
          ))}
        </TabNav>
      </Titlebar>
      <div className="h-16 bg-[var(--bg-surface)]" />
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
      <div className="w-56 bg-[var(--bg-surface)]" />
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
  input: <InputPreview />,
  card: <CardPreview />,
  dialog: <DialogPreview />,
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
  diamond: <DiamondPreview />,
  switch: <SwitchPreview />,
  textarea: <TextareaPreview />,
  field: <FieldPreview />,
  "filter-pill": <FilterPillPreview />,
  titlebar: <TitlebarPreview />,
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
