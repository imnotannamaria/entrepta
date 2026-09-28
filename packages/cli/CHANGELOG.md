# @entrepta/cli

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

### Patch Changes

- 64c2e8f: `entrepta --version` prints the real version instead of 0.0.1, and a Bun project with the text `bun.lock` installs with Bun instead of falling back to npm.
- bf47998: Every file the CLI writes now resolves inside the project, symlinks included. `add` checked the path as written, so a folder in a cloned repo that was a symlink to somewhere else still received the write, and `init` did not check at all. Both now resolve the path on disk first and refuse a symlink, or a dangling one, that points out of the project.
- 0ba6e70: `npx @entrepta/cli` installs one package for the registry instead of 33. The registry listed cmdk, sonner, clsx and tailwind-merge as dependencies and React as a required peer, so every CLI run downloaded React, Radix and the rest just to copy text files. They are dev dependencies now, and the React peers are optional. Your project still installs what each component needs when you `add` it.
- Updated dependencies [17ed563]
- Updated dependencies [0ba6e70]
- Updated dependencies [128b991]
- Updated dependencies [1a65d88]
- Updated dependencies [42d70af]
- Updated dependencies [d679394]
- Updated dependencies [8177858]
  - @entrepta/registry@3.0.0

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

### Patch Changes

- Updated dependencies [f339c1d]
  - @entrepta/registry@2.0.0

## 1.1.0

### Minor Changes

- 3756c4c: Add ModeToggle, a dark/light only switch, plus the use-mode hook behind it.

  ModeToggle renders inline by default and can float in any corner with
  `position`. It ships icon and labeled variants, two sizes, and a `ModeScript`
  helper for pre-paint mode restore. `useTheme` now composes `useMode`, so there
  is a single implementation of the mode logic. Install it with
  `npx @entrepta/cli@latest add mode-toggle`.

### Patch Changes

- Updated dependencies [3756c4c]
  - @entrepta/registry@1.2.0

## 1.0.2

### Patch Changes

- 190c94a: Security hardening of the `add` command:

  - **Path traversal guard**: refuse to write components outside the user's project, even if `entrepta.json` aliases (`components`, `hooks`) point at `../../something`. A tampered config can no longer drop files outside the cwd.
  - **Import rewrite escape**: the `utils` alias is now validated to not contain quotes, backslashes, backticks, or newlines before being spliced into generated source — that closes a code-injection vector via a malicious config. `$` characters are also escaped so `String.prototype.replace` doesn't interpret `$1`/`$&`/etc as backrefs.

  No behavior change for any well-formed config; only malformed ones get a clear error and abort.

- 544d034: Pass `--no-audit --no-fund` to npm during install so the CLI doesn't surface security warnings and funding notices from packages it didn't add. pnpm/yarn/bun don't audit on install, so they're unaffected.
- 55f7a1f: New `ThemeSwitcher` layout component + `useTheme` hook.

  The floating theme switcher that ships on the docs site is now a generic registry component any consumer can drop into their app.

  - **`hooks/use-theme.ts`**: persists theme + mode in localStorage and drives the `data-theme` / `data-mode` attributes on `<html>`. Configurable storage key, default theme, default mode, and a `disableMode` opt-out for dark-only sites.
  - **`layout/theme-switcher.tsx`**: the floating UI. Accepts a `themes` array, supports four anchor positions, can hide the mode toggle, and closes on outside click / Escape. Also exports `ThemeScript` — the inline pre-paint snippet that prevents the default-theme flash.
  - **CLI**: both items are registered (`use-theme` as a hook, `theme-switcher` in layout with `use-theme` as a registry dep). `rewriteImports` was extended so the relative `../hooks/<name>` import in registry components becomes the consumer's `hooks` alias on copy.

- Updated dependencies [f8ccf22]
- Updated dependencies [d225728]
- Updated dependencies [55f7a1f]
  - @entrepta/registry@1.1.0

## 1.0.1

### Patch Changes

- a1fd53a: Update README to reflect `npx @entrepta/cli@latest` command pattern
- Updated dependencies [a1fd53a]
  - @entrepta/registry@1.0.1

## 1.0.0

### Major Changes

- 04a2101: update README to reflect npx @entrepta/cli@latest comman
- 26d369a: First version

### Patch Changes

- Updated dependencies [04a2101]
- Updated dependencies [26d369a]
  - @entrepta/registry@1.0.0
