# @entrepta/registry

## 2.0.0

### Major Changes

- f339c1d: entrepta 2.0. Tokens, icons, the Card, text sizes and token values all change at once. Read the migration guide before updating: https://entrepta.vercel.app/docs/migrating-to-v2

  Breaking:

  - Font sizes come from ten scale steps (`text-mono-sm`, `text-heading-lg`…). The `.t-*` classes are gone, heading-md is 18px and mono-xs is 10px.
  - Icons are Phosphor. `lucide-react` is no longer a dependency.
  - The Card is rebuilt: near black, a border that lights up on hover, sizes `sm`, `md` and `xl`, and a header that wraps.
  - Text on a brand fill uses `--fg-on-brand`, and brand-colored text below 24px uses `--fg-brand-text`. entrepta light is `#6656ff`, and four light brands shifted slightly.
  - Dialog and CommandPalette sit on `--bg-overlay`. Dark `--fg-muted` is lighter, and light mode status inks are darker, so every ink clears WCAG AA.
  - Tabs put the close button next to the tab, on the active tab only, and now depend on `motion`.
  - Dropdown, Toast, Tooltip, CommandPalette and the ThemeSwitcher panel sit on `--bg-overlay` and highlight rows the same way. A highlighted menu row takes the brand tint instead of an edge bar, and a toast shows its status as an icon tile. The Toaster renders sonner unstyled and adds a close button.

  New:

  - Components: Kbd, Checkbox, Switch, Textarea, Field, FilterPill, ChromeMessage, PageLoading, SectHead, doc parts, Diamond, Sidebar, PageOutline, TabNav with a window variant for the title bar, and the motion set: Reveal, TypeIn, RollingNumber, Spotlight, ArrowLink.
  - Button icon sizes (`icon-sm`, `icon-md`, `icon-lg`) and an `icon` prop on Badge.
  - Tokens for cards, overlays, brand accents and shadows, and a contrast test over all 12 theme and mode combinations.
  - `lib/overlay.ts` holds the overlay surface and menu row classes, and `lib/icon.tsx` lets an icon prop take a Phosphor component or an element, so a server page can pass one to a client component. The CLI copies both with the components that use them. Badge no longer needs `"use client"`.
  - The CLI validates `entrepta.json` before using it, and its `$schema` URL now resolves.
  - CodeBlock takes `wrap` and `size`; the ThemeSwitcher takes `position="inline"`; FilterPill brings `use-url-filter`.
  - `init --themes=all` installs the six themes for runtime switching, and ThemeSwitchers on one page stay in step.
  - Menus, tooltips and dialogs animate open and closed with plain CSS in `globals.css`, and `:root` declares `color-scheme: dark` so native controls and Chrome's autofill match.
  - The CLI copies what a component imports from other folders, routes lib files to the `lib` alias, and records `srcDir` so Vite projects get every file under `src/`.

## 1.2.0

### Minor Changes

- 3756c4c: Add ModeToggle, a dark/light only switch, plus the use-mode hook behind it.

  ModeToggle renders inline by default and can float in any corner with
  `position`. It ships icon and labeled variants, two sizes, and a `ModeScript`
  helper for pre-paint mode restore. `useTheme` now composes `useMode`, so there
  is a single implementation of the mode logic. Install it with
  `npx @entrepta/cli@latest add mode-toggle`.

## 1.1.0

### Minor Changes

- d225728: Light mode support across the registry.

  The registry now ships dual-mode styling. Dark is still the default (no opt-in needed); to switch a project to light, set `data-mode="light"` on `<html>` and the surface, foreground, border and brand tokens flip. Every existing component adapts automatically because they were already token-driven.

  Highlights:

  - **New tokens**: `--bg-hover-soft` / `--bg-hover-strong` (replace hardcoded `bg-white/X` overlays so they flip to black overlays in light mode), `--bg-chrome` (recessed chrome surface used by CodeBlock head + CardTerminalBar — dark overlay in dark mode, subtle dark overlay in light mode).
  - **`[data-surface="dark"]` scope**: a reusable selector that pins every semantic token to its dark value within the marked element. The terminal-style `Card` variant, `Tooltip`, and `CodeBlock` chrome bars use this so they stay IDE-dark even in light mode pages (the design intent: terminal feels like a terminal).
  - **Per-theme light brand**: each of the six theme files (entrepta, blossom, marmalade, julia, ivy, bosco) gets a slightly darker brand color for `data-mode="light"` so contrast stays AA on white surfaces.
  - **Components updated**: Button (ghost/secondary hovers), Badge (soft neutral), Dialog (close-button hover), Tabs (close × hover), Card (`variant="terminal"` now carries `data-surface="dark"`), Tooltip (`data-surface="dark"`), CodeBlock (chrome bar uses `--bg-chrome`).

- 55f7a1f: New `ThemeSwitcher` layout component + `useTheme` hook.

  The floating theme switcher that ships on the docs site is now a generic registry component any consumer can drop into their app.

  - **`hooks/use-theme.ts`**: persists theme + mode in localStorage and drives the `data-theme` / `data-mode` attributes on `<html>`. Configurable storage key, default theme, default mode, and a `disableMode` opt-out for dark-only sites.
  - **`layout/theme-switcher.tsx`**: the floating UI. Accepts a `themes` array, supports four anchor positions, can hide the mode toggle, and closes on outside click / Escape. Also exports `ThemeScript` — the inline pre-paint snippet that prevents the default-theme flash.
  - **CLI**: both items are registered (`use-theme` as a hook, `theme-switcher` in layout with `use-theme` as a registry dep). `rewriteImports` was extended so the relative `../hooks/<name>` import in registry components becomes the consumer's `hooks` alias on copy.

### Patch Changes

- f8ccf22: Accessibility improvements:

  - **Tabs**: the close × on closable tabs is now announced as a "Close tab" button by screen readers (previously it had `aria-hidden` and was invisible to assistive tech). `TabsContent` gains a visible focus ring when reached via keyboard.
  - **Dropdown**: focused menu items now show a brand-colored inset bar in addition to the elevated background, so keyboard users see where they are even on themes with subtle elevation.
  - **CommandPalette**: the input gets a default `aria-label="Search commands"` so screen-reader users hear a name on focus when no label is provided.

## 1.0.1

### Patch Changes

- a1fd53a: Update README to reflect `npx @entrepta/cli@latest` command pattern

## 1.0.0

### Major Changes

- 04a2101: update README to reflect npx @entrepta/cli@latest comman
- 26d369a: First version
