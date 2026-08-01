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
import { useCommandPalette } from "@entrepta/registry/hooks/use-command-palette";
import { Box, FileCode, GitBranch, Home, Layout, Palette, Sparkles, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, createContext, useCallback, useContext, useMemo } from "react";

interface SiteCommandPaletteCtx {
  toggle: () => void;
  open: () => void;
}

const Ctx = createContext<SiteCommandPaletteCtx | null>(null);

const ICON_PROPS = { width: 13, height: 13, strokeWidth: 1.5 };

export function SiteCommandPaletteProvider({ children }: { children: ReactNode }) {
  const { open, setOpen, toggle } = useCommandPalette();
  const router = useRouter();

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(href);
    },
    [router, setOpen]
  );

  const ctx = useMemo<SiteCommandPaletteCtx>(
    () => ({ toggle, open: () => setOpen(true) }),
    [toggle, setOpen]
  );

  return (
    <Ctx.Provider value={ctx}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="search docs, components, themes…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>

            <CommandGroup heading="pages">
              <CommandItem icon={<Home {...ICON_PROPS} />} shortcut="⌘1" onSelect={() => go("/")}>
                Home
              </CommandItem>
              <CommandItem
                icon={<FileCode {...ICON_PROPS} />}
                shortcut="⌘2"
                onSelect={() => go("/docs")}
              >
                Docs · Introduction
              </CommandItem>
              <CommandItem
                icon={<FileCode {...ICON_PROPS} />}
                onSelect={() => go("/docs/installation")}
              >
                Installation
              </CommandItem>
              <CommandItem icon={<FileCode {...ICON_PROPS} />} onSelect={() => go("/docs/cli")}>
                CLI Reference
              </CommandItem>
              <CommandItem icon={<Palette {...ICON_PROPS} />} onSelect={() => go("/docs/themes")}>
                Themes
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="foundations">
              <CommandItem
                icon={<Sparkles {...ICON_PROPS} />}
                onSelect={() => go("/docs/foundations")}
              >
                Overview
              </CommandItem>
              <CommandItem
                icon={<Palette {...ICON_PROPS} />}
                onSelect={() => go("/docs/foundations/color")}
              >
                Color
              </CommandItem>
              <CommandItem
                icon={<Type {...ICON_PROPS} />}
                onSelect={() => go("/docs/foundations/typography")}
              >
                Typography
              </CommandItem>
              <CommandItem
                icon={<Layout {...ICON_PROPS} />}
                onSelect={() => go("/docs/foundations/spacing")}
              >
                Spacing & Grid
              </CommandItem>
              <CommandItem
                icon={<Sparkles {...ICON_PROPS} />}
                onSelect={() => go("/docs/foundations/motion")}
              >
                Radius & Motion
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="components">
              <CommandItem icon={<Box {...ICON_PROPS} />} onSelect={() => go("/docs/components")}>
                All components
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/button")}
              >
                Button
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/badge")}
              >
                Badge
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/input")}
              >
                Input
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/card")}
              >
                Card
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/dialog")}
              >
                Dialog
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/dropdown")}
              >
                Dropdown
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/tooltip")}
              >
                Tooltip
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/tabs")}
              >
                Tabs
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/status-bar")}
              >
                StatusBar
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/top-nav")}
              >
                TopNav
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/theme-switcher")}
              >
                ThemeSwitcher
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/mode-toggle")}
              >
                ModeToggle
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/toast")}
              >
                Toast
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/skeleton")}
              >
                Skeleton
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/command-palette")}
              >
                CommandPalette
              </CommandItem>
              <CommandItem
                icon={<Box {...ICON_PROPS} />}
                onSelect={() => go("/docs/components/code-block")}
              >
                CodeBlock
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="links">
              <CommandItem
                icon={<GitBranch {...ICON_PROPS} />}
                onSelect={() => go("https://github.com/imnotannamaria/entrepta")}
              >
                GitHub repository
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandFoot />
        </Command>
      </CommandDialog>
    </Ctx.Provider>
  );
}

export function useSiteCommandPalette() {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error("useSiteCommandPalette must be used inside SiteCommandPaletteProvider");
  }
  return v;
}
