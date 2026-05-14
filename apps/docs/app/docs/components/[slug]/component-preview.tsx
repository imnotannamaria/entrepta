"use client";

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
import { Skeleton, SkeletonText } from "@entrepta/registry/feedback/skeleton";
import { StatusBarItem, StatusBarSeparator } from "@entrepta/registry/layout/status-bar";
import {
  TopNav,
  TopNavBreadcrumb,
  TopNavLink,
  TopNavLogo,
  TopNavLogoMark,
  TopNavMenu,
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
        <TabsContent value="home" className="p-5 font-mono text-[13px] text-[var(--fg-secondary)]">
          <div>
            <span className="text-[var(--fg-muted)]">{"// "}</span>landing page
          </div>
          <div className="mt-1">
            <span className="text-[var(--fg-brand)]">export default</span> function Home()
          </div>
        </TabsContent>
        <TabsContent
          value="about"
          className="p-5 font-sans text-[13px] text-[var(--fg-secondary)] leading-relaxed"
        >
          Engineer building a personal design system. Dark-first, IDE-style, opinionated.
        </TabsContent>
        <TabsContent value="stack" className="p-5 font-mono text-[13px] text-[var(--fg-secondary)]">
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
          className="p-5 font-mono text-[13px] text-[var(--fg-secondary)]"
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
        <p className="font-mono text-xs text-[var(--fg-muted)]">page content</p>
      </div>
      <div className="flex items-center justify-between gap-4 py-1.5 px-4 bg-[var(--fg-brand)] font-mono text-[11px] text-[var(--zinc-50)]">
        <div className="flex items-center gap-4">
          <StatusBarItem icon={<GitBranch style={{ width: 10, height: 10, strokeWidth: 1.5 }} />}>
            main
          </StatusBarItem>
          <StatusBarSeparator />
          <StatusBarItem>0 errors</StatusBarItem>
          <StatusBarSeparator />
          <StatusBarItem>2 warnings</StatusBarItem>
        </div>
        <div className="flex items-center gap-4">
          <StatusBarItem>TypeScript</StatusBarItem>
          <StatusBarSeparator />
          <StatusBarItem>UTF-8</StatusBarItem>
          <StatusBarSeparator />
          <StatusBarItem>Ln 1, Col 1</StatusBarItem>
        </div>
      </div>
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
        <p className="font-mono text-xs text-[var(--fg-muted)]">page content</p>
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
            description: "useTheme() will be removed in v1.0 — use ThemeProvider instead",
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
        <kbd className="ml-2 px-1 font-mono text-[11px] border border-[var(--border-strong)] rounded-[3px] text-[var(--fg-muted)]">
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
                icon={<Home style={{ width: 13, height: 13, strokeWidth: 1.5 }} />}
                shortcut="⌘1"
                onSelect={() => setOpen(false)}
              >
                home.tsx
              </CommandItem>
              <CommandItem
                icon={<FileCode style={{ width: 13, height: 13, strokeWidth: 1.5 }} />}
                shortcut="⌘2"
                onSelect={() => setOpen(false)}
              >
                docs/installation
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="components">
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
            <CommandSeparator />
            <CommandGroup heading="actions">
              <CommandItem
                icon={<GitBranch style={{ width: 13, height: 13, strokeWidth: 1.5 }} />}
                shortcut="⌘⇧D"
                onSelect={() => setOpen(false)}
              >
                Deploy to production
              </CommandItem>
              <CommandItem
                icon={<Settings style={{ width: 13, height: 13, strokeWidth: 1.5 }} />}
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
