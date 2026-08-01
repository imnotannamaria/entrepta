# @entrepta/registry

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
