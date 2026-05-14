"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@entrepta/registry/feedback/command-palette";
import { Skeleton, SkeletonText } from "@entrepta/registry/feedback/skeleton";
import { SectionHeader, SectionHeadingAccent } from "@entrepta/registry/layout/section-header";
import { StatusBarItem } from "@entrepta/registry/layout/status-bar";
import { TabBar, TabBarItem } from "@entrepta/registry/layout/tab-bar";
import {
  TopNav,
  TopNavBreadcrumb,
  TopNavLogo,
  TopNavSeparator,
} from "@entrepta/registry/layout/top-nav";
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
import { Input } from "@entrepta/registry/primitives/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@entrepta/registry/primitives/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipShortcut,
  TooltipTrigger,
} from "@entrepta/registry/primitives/tooltip";
import { FileCode, GitBranch, Home, Settings, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ButtonPreview() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-wrap items-center gap-3">
        <Button>./projects.sh →</Button>
        <Button variant="secondary">$ npx entrepta init</Button>
        <Button variant="ghost">cat contact.txt</Button>
        <Button variant="command">npx entrepta add button</Button>
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
      <Input placeholder="resend-ecommerce" />
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
          <CardLabel>resend-ecommerce</CardLabel>
          <Badge variant="solid" color="brand">
            FEATURED
          </Badge>
        </CardHeader>
        <CardTitle>
          Email templates, in <em>React</em>.
        </CardTitle>
        <CardDescription>
          12 typed templates — receipts, shipping, returns. Used by 200+ projects.
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
            <span className="text-[var(--fg-brand)]">entrepta</span> init
          </div>
          <div>
            <span className="text-[var(--fg-muted)]">$</span> entrepta add{" "}
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
          <div className="font-serif text-5xl text-[var(--fg-primary)] leading-none">
            <em className="italic text-[var(--fg-brand)]">11</em>
          </div>
          <div className="font-mono text-xs text-[var(--fg-muted)] mt-1">repos shipped</div>
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
            Delete <em>resend-ecommerce</em>?
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
          <TooltipContent side="right">deploy.entrepta.dev</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

function TabsPreview() {
  return (
    <div className="w-full max-w-md border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="props">Props</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="p-5">
          <p className="font-sans text-sm text-[var(--fg-secondary)]">
            Live component preview goes here.
          </p>
        </TabsContent>
        <TabsContent value="code" className="p-5">
          <code className="font-mono text-xs text-[var(--fg-brand)]">
            {"<Button>Click me</Button>"}
          </code>
        </TabsContent>
        <TabsContent value="props" className="p-5">
          <p className="font-mono text-xs text-[var(--fg-muted)]">
            variant, size, loading, asChild
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TabBarPreview() {
  const [active, setActive] = useState("index");
  const [tabs, setTabs] = useState(["index.tsx", "globals.css", "utils.ts"]);
  return (
    <div className="w-full max-w-lg border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
      <TabBar>
        {tabs.map((tab) => (
          <TabBarItem
            key={tab}
            active={active === tab}
            onClick={() => setActive(tab)}
            onClose={
              tabs.length > 1
                ? () => {
                    const next = tabs.filter((t) => t !== tab);
                    setTabs(next);
                    if (active === tab) setActive(next[0]);
                  }
                : undefined
            }
          >
            {tab}
          </TabBarItem>
        ))}
      </TabBar>
      <div className="p-4 bg-[var(--bg-surface)] min-h-16">
        <code className="font-mono text-xs text-[var(--fg-muted)]">
          {active} — click tabs to switch, ✕ to close
        </code>
      </div>
    </div>
  );
}

function StatusBarPreview() {
  return (
    <div className="w-full max-w-lg border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
      <div className="bg-[var(--bg-surface)] h-20 flex items-center justify-center">
        <p className="font-mono text-xs text-[var(--fg-muted)]">Page content</p>
      </div>
      <div className="flex items-center justify-between h-6 px-3 bg-[var(--fg-brand)] font-mono text-[10px] text-white">
        <div className="flex items-center gap-3">
          <StatusBarItem icon={<GitBranch style={{ width: 10, height: 10, strokeWidth: 1.5 }} />}>
            main
          </StatusBarItem>
          <StatusBarItem>0 errors</StatusBarItem>
        </div>
        <div className="flex items-center gap-3">
          <StatusBarItem>TypeScript</StatusBarItem>
          <StatusBarItem>UTF-8</StatusBarItem>
        </div>
      </div>
    </div>
  );
}

function TopNavPreview() {
  return (
    <div className="w-full max-w-lg border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
      <TopNav
        left={
          <TopNavLogo>
            ◆ entrepta
            <TopNavBreadcrumb>
              <TopNavSeparator />
              components
              <TopNavSeparator />
              button
            </TopNavBreadcrumb>
          </TopNavLogo>
        }
        right={
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              Docs
            </Button>
            <Button size="sm">GitHub</Button>
          </div>
        }
      />
      <div className="bg-[var(--bg-surface)] h-16 flex items-center justify-center">
        <p className="font-mono text-xs text-[var(--fg-muted)]">Page content</p>
      </div>
    </div>
  );
}

function SectionHeaderPreview() {
  return (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <SectionHeader
        eyebrow="components"
        heading={
          <>
            Build faster with <SectionHeadingAccent>entrepta</SectionHeadingAccent>
          </>
        }
        description="Copy-paste components that you own and control."
      />
      <SectionHeader eyebrow="centered layout" heading="Dark-first by default" align="center" />
    </div>
  );
}

function ToastPreview() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => toast.success("Component copied to clipboard!")}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast.error("Build failed — see output")}>
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast.warning("Deprecated API used")}>
        Warning
      </Button>
      <Button variant="secondary" onClick={() => toast("New update available")}>
        Default
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
        Open palette <kbd className="ml-2 font-mono text-[10px] opacity-60">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search pages, components..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              <CommandItem
                icon={<Home style={{ width: 13, height: 13, strokeWidth: 1.5 }} />}
                onSelect={() => setOpen(false)}
              >
                Home
              </CommandItem>
              <CommandItem
                icon={<FileCode style={{ width: 13, height: 13, strokeWidth: 1.5 }} />}
                onSelect={() => setOpen(false)}
              >
                Documentation
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Components">
              <CommandItem
                icon={<Zap style={{ width: 13, height: 13, strokeWidth: 1.5 }} />}
                shortcut="B"
                onSelect={() => setOpen(false)}
              >
                Button
              </CommandItem>
              <CommandItem
                icon={<Zap style={{ width: 13, height: 13, strokeWidth: 1.5 }} />}
                shortcut="Bd"
                onSelect={() => setOpen(false)}
              >
                Badge
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CommandItem
                icon={<Settings style={{ width: 13, height: 13, strokeWidth: 1.5 }} />}
                onSelect={() => setOpen(false)}
              >
                Settings
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
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
  "tab-bar": <TabBarPreview />,
  "status-bar": <StatusBarPreview />,
  "top-nav": <TopNavPreview />,
  "section-header": <SectionHeaderPreview />,
  toast: <ToastPreview />,
  skeleton: <SkeletonPreview />,
  "command-palette": <CommandPalettePreview />,
};

export function ComponentPreview({ slug }: { slug: string }) {
  return (
    <div className="w-full flex items-center justify-center">
      {PREVIEWS[slug] ?? (
        <p className="font-mono text-xs text-[var(--fg-muted)]">No preview available</p>
      )}
    </div>
  );
}
