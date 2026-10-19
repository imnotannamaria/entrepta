# @entrepta/registry

## 4.0.0

### Major Changes

- fdad3bb: entrepta 4.0: the library without the mark. The ◆ and the `//` stop being defaults, the editor look leaves the registry, and a seventh theme, taylor, is flat and monochrome. Each breaking change says how to bring the old look back: https://entrepta.vercel.app/docs/migrating-to-v4

  **Breaking**

  - Labels (CardLabel, FieldLabel, DialogLabel, Metric, ChoiceCard, SwatchPicker, ChatThread) draw nothing in front of their text. Pass an icon if you want something there.
  - Sidebar and MobileNav mark the current item with an `indicator`, a dot by default. Tabs, TabNav and Stepper take one too and have none by default. `null` hides it. A Stepper step takes an `icon` for its marker.
  - FieldError, the command palette footer and the menu titles lose the `//` and the ◆. CardComment is now CardNote, the text alone.
  - `lib/format.ts` is `lib/entrepta-format.ts`, since the old name collided with files projects already have. Reinstall what imports it.
  - Removed from the registry: PageLoading, Spotlight and SpotlightCard (and the `--bg-spotlight` token), the × of a tab (`onClose`), StatusBar and ChromeMessage (they live in the docs app now, and ChromeMessage's job is EmptyState with `size="page"`), SectHead, doc-parts, PageOutline, the Card `terminal` variant and the Tabs `window` variant. `add` names each one and links the guide.

  **New**

  - taylor, a theme with no hue: white on dark, black on light, no brand glow. `--finish-glow` (0 to 1) sets how much brand light a card and an overlay carry, and `--chart-from` sets where the chart colors start turning.
  - EmptyState takes an `illustration`, `size="page"` for a 404 or an error screen, and a `headingLevel`.
  - ChatThread takes an avatar for each role. Tooltip follows the mode of the page by default, and `surface="dark"` keeps it near black. SegmentedControl takes `shape="pill"` and `truncate={false}`. The Diamond component is gone.
  - The star of a required label is drawn by CSS, so a test finds the label by its name. The sidebar rail's tooltip clears the rail's border.
  - ChatThread no longer traps the page scroll: a short thread with nothing to scroll let the wheel stop over it.
  - The Sidebar indicator sits in the scrolling list instead of a shared layout animation, so it no longer flies off while the list scrolls the current item into view. SwatchPicker swatches have an edge and a check that reads on any color, so a near black swatch shows on a dark surface.
  - ContributionGrid scrolls sideways only. With a classic scrollbar its box could also scroll up and down by a few pixels.
  - `init --themes=all` with taylor as the default no longer puts taylor's white brand into the code blocks of the other themes in light mode.
  - The Sidebar no longer depends on `motion`: its indicator moves in CSS, and it measures without re-rendering when nothing moved. SwatchPicker's check falls back to the canvas ink where the browser has no relative color.

## 3.0.0

### Major Changes

- 8177858: entrepta 3.0: the components a product needs, on top of everything 2.x has. Nothing in 2.x breaks, so there is nothing to migrate: run `init --overwrite` for the new tokens and add what you need. The whole list, with what each is for: https://entrepta.vercel.app/docs/whats-new-in-v3

  **New components**

  - **Money and numbers.** Amount shows money one way everywhere, from integer minor units, with the real minus sign. MoneyInput takes it in like a cash machine or freely, from any pasted format. Delta says how a value moved, in an arrow, a sign and words, and never shows a percentage from a base of zero. `FormatProvider` sets the locale, currency and time zone once, and `lib/format` does the formatting.
  - **Choosing.** Select, Combobox (a long list you can search, ranked by the start of a word, accents ignored), SegmentedControl, ChoiceCard and SwatchPicker, which hands back a palette key and names each swatch after the hue it shows.
  - **Dates.** Calendar, DatePicker and DateNavigator, for a day, a range, a month or a year, as plain `YYYY-MM-DD` strings that no time zone can shift. Built on react-day-picker 10 with every piece replaced.
  - **Lists and tables.** ListRow and ListGroup, Table, and DataTable on TanStack Table v9, with sorting, selection, column visibility, virtualization past 500 rows, and loading, empty, filtered and error states in place of the rows.
  - **Filters.** FilterBuilder builds filters from fields, each one an applied FilterPill, and `lib/filters` keeps them in the URL, dropping anything the fields cannot answer.
  - **Dashboards.** Metric, Progress, Sparkline, BarList, BentoGrid, SpotlightCard and ContributionGrid.
  - **Charts.** ChartContainer for Recharts: series take a palette color by name, the tooltip shows full values, a legend appears from three series, and a button shows the same numbers as a Table. The Chart page has five recipes.
  - **Layout and overlays.** Popover, Sheet (from the edge, asking before it throws away changes), Accordion, MobileNav and Stepper.
  - **Feedback.** Alert, EmptyState, IconTile and FileDropzone.
  - **Everything else.** Avatar and AvatarGroup (the initials are in the server HTML and the image covers them once it loads, with a presence dot and a `+N` for the rest), SecretField, Redact (hide values on screen when the app says so; Amount, Metric and RollingNumber follow it), and PromptInput and ChatThread, which draw a conversation and take input, with no model and no network.

  **Changed**

  - Sidebar takes `variant="labeled"`: groups, a search slot, a footer and `collapsible`. It keeps the current item in view, a labeled sidebar can be text only, and the rail gives each icon a Tooltip.
  - FilterPill with `onRemove` is an applied filter, with a × named after what it removes. Its icon, and the Sidebar's, can be an element, for a server file.
  - Scrolling the page over a CodeBlock works again: the block only holds sideways scrolls.
  - ChromeMessage takes `headingLevel`, for an error inside a layout that has its own h1.
  - Resizing a Textarea follows the cursor, and Input and Button name the properties they ease.
  - Dialog exports `DialogCloseButton`, CommandInput takes `size="sm"`, Input exports its frame (`inputWrapperVariants`, `fieldTrigger`, `inputFieldClass`), and the Toast's status tile is an IconTile.
  - `useUrlFilterList` keeps a filter with several values in the URL, and `useCopy` is the copy logic CodeBlock uses, as its own hook.

  **Tokens** (run `init --overwrite`)

  - A chart palette with no fixed color: `--chart-1` to `--chart-8` turn the brand's hue in steps of 45°, at a lightness per mode that clears 3:1 on a card. Browsers without relative color get fixed hues at the same lightness.
  - The height animation of the Accordion (`motion-collapse`).
  - Form fields without JetBrains Mono's code ligatures, which reshaped "///" as it was typed and drew slashes blank.

### Minor Changes

- d679394: Switching the theme or the mode now changes the whole page at once. Components eased their own colors on their own clocks (a card over 200ms, a button over 150ms, a badge not at all), so a switch landed piece by piece. `useMode` and `useTheme` now run every switch through `transitionTheme`, exported from `use-mode`. For the length of a switch it sets `data-theme-switching` on `<html>`, which holds every transition, and where the browser has view transitions the page crossfades as one picture over `--motion-slow`. Reduced motion gets the instant switch. The sun and moon in the toggles keep turning through `data-theme-motion`.

  Run `init --overwrite` for the new block in `globals.css`, and `add use-mode use-theme --overwrite` for the hooks. Wrap your own attribute changes in `transitionTheme` if you switch the theme some other way.

### Patch Changes

- 17ed563: Card transitions `translate` instead of `transform`. The hover lift still eases, and a card animated by Motion (a `Reveal` entrance, a `layout` move) no longer has every frame of its `transform` smoothed by a 200ms CSS transition, which made entrances land late.
- 0ba6e70: `npx @entrepta/cli` installs one package for the registry instead of 33. The registry listed cmdk, sonner, clsx and tailwind-merge as dependencies and React as a required peer, so every CLI run downloaded React, Radix and the rest just to copy text files. They are dev dependencies now, and the React peers are optional. Your project still installs what each component needs when you `add` it.
- 128b991: Button, Input, Textarea, FilterPill, StatusBar and TopNav no longer carry `"use client"`. None of them has state or an effect, so a server page renders them with no client JavaScript, and can pass FilterPill a Phosphor icon component. Button and Input import their icons from `@phosphor-icons/react/dist/ssr`.

  `<Button asChild>` works again. The label wrapper and the spinner were handed to Slot along with your element, so it threw `React.Children.only`. With `asChild`, Slot now gets your element alone, and `loading` does not apply.

- 1a65d88: An inactive icon tab keeps its name on phones. The label was `hidden` below `sm`, which also removed it from the accessibility tree, so screen readers and Lighthouse saw links with no name. It is `sr-only` there now: still off screen, still announced.
- 42d70af: `ThemeScript` and `ModeScript` escape `<` in the storage key, so a key that holds `</script>` cannot end the inline script early.

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
