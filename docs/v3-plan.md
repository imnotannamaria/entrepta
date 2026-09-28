# entrepta v3 plan

A working plan, published with the repo. It is not product copy.

**Status:** planned. Phase 0 has started: the 2.1 work (Avatar, the theme switch, the security
review) and the charts branch are merged on `v3`.

- **Sources:** the next products built on entrepta listed the components they miss, among them
  [Wristkit](https://wristkit-web.vercel.app) (Apple Health cards and a yearly calendar) and a
  dashboard app with forms, money and charts. This plan keeps what is generic and says where each
  request landed.
- **Base:** `v3` at `bd577c9`, which is `main` plus the 2.1 commits plus `feat/charts`.
- **Outcome:** `@entrepta/registry` 3.0.0 and `@entrepta/cli` 3.0.0, released once, with
  everything below. Nothing that exists today breaks; the major is for the size of the release.
- **Date:** 2026-09-27

---

## Summary

entrepta 2 is a system for pages: a portfolio, a landing page, docs. The next consumers are products:
forms that take money and dates, lists of hundreds of rows, dashboards, onboarding. v3 adds what
a product needs, in entrepta's voice: near black surfaces, mono for UI, one overlay family, every
ink measured, motion with a reduced-motion path.

About 34 new registry items, in five groups:

1. **Overlays and forms.** Popover, Sheet, Select, Combobox, SegmentedControl, Calendar,
   DatePicker, DateNavigator, MoneyInput, ChoiceCard, SwatchPicker, SecretField, FileDropzone,
   FilterBuilder.
2. **Data.** Amount, Metric and Delta, Progress, IconTile, ListRow, Table, DataTable,
   ContributionGrid, Redact.
3. **Charts.** ChartContainer with recipes for line, area and four kinds of bar chart, a donut,
   and two charts without Recharts: BarList and Sparkline.
4. **Layout and feedback.** Sidebar with labels, MobileNav, BentoGrid, Accordion, Stepper, Alert,
   EmptyState.
5. **Chat.** PromptInput and ChatThread.

---

## Decisions

| Topic | Decision | Why |
| --- | --- | --- |
| Release | One 3.0.0 with everything | The work still runs in priority order, so the apps can install from the branch early |
| Calendar | `react-day-picker` 10, unstyled, every part replaced with entrepta pieces | Date grid keyboard rules, locales and time zones are a lot to own. v10 ships no CSS unless its `style.css` is imported, takes `components`, `classNames`, `labels`, `formatters` and `timeZone`, and is MIT |
| Tables | `@tanstack/react-table` and `@tanstack/react-virtual` under DataTable | Sorting, selection and column visibility are solved there. Virtualization above about 500 rows. `Table` primitives stay dependency free |
| Charts | Recharts, as a dependency of the chart items only | The charts branch already chose it and measured its accessibility layer. BarList and Sparkline skip it, so a page of widgets does not pay for Recharts |
| Chart API | A container, presets and documented recipes, not one component per chart type | Wrapping each Recharts chart in our own props hides the options people need. Each app composes its charts from the recipes |
| Categorical palette | `--chart-1` to `--chart-8` derived from the brand, no fixed hex | Every accent already derives from `--fg-brand`. `--chart-1` is the brand; the others turn its hue in even steps with CSS relative color (`oklch(from var(--fg-brand) L C calc(h + N))`), at a lightness and chroma set per mode so each clears 3:1 on the card. A theme recolors its charts with nothing else to edit. Result charts (above and below zero) use the status colors plus a sign, never the palette, so a red or green brand cannot be read as a result |
| Money | Integer minor units, currency and locale always passed, no default currency | entrepta is not a finance system. Minor units come from `Intl` (JPY has none, BHD has three), so "cents" is never assumed |
| Locale | A `FormatProvider` (locale, currency, time zone) read by every formatting component | An app in one locale and currency would otherwise repeat them on every Amount. Without a provider, `en-US`, never the runtime default, which differs between server and browser and breaks hydration |
| Dates | Plain `YYYY-MM-DD` strings in, out and in the URL, never a `Date` with a time | Both apps asked for it. A `Date` shifts the day across time zones |
| Single choice | SegmentedControl, ChoiceCard and SwatchPicker are native radio inputs | Like Checkbox and Switch. The browser gives `radiogroup`, arrow keys and one tab stop, with no Radix |
| New categories | `data/` and `charts/` in the registry; Data and Charts in the docs nav | 34 items do not fit in the current five folders |
| Login | No CodeInput | No consumer has its own login screen |
| Chat | PromptInput and ChatThread are UI components, no AI SDK | They render messages and take input. Streaming and tools stay in the app |
| Avatar sizes | 24, 32, 48 and 96px, and `emphasis: "ring"` | Avatar never shipped (2.1 became v3), so its scale can still follow Wristkit's, which has a real use for each size: inline, lists and menus, cards, the profile |

### Requests that change shape

| Request | Where it lands | Why |
| --- | --- | --- |
| Popover on `--bg-surface` | On `OVERLAY_SURFACE`, in the overlay family test | `--bg-surface` is never an area (CLAUDE.md §10). Overlays are one family |
| Alert with a colored side bar, if it comes up | Icon tile and tint, like the toast | No colored bar on the edge of anything (CLAUDE.md §10) |
| IconTile as new | Extracted from the Toast's status tile, which then uses it | A second tile would be copy number two |
| SecretField as an Input variant | Its own component | It has state (reveal, copy, expired), and Input is server safe now |
| Copy logic in SecretField | A `use-copy` hook, extracted from CodeBlock and the docs app | It lives in two places today |
| MoneyInput `aria-valuetext` | Dropped | Not supported on a text field. The formatted value with its currency is read correctly as is |
| A period navigator and Wristkit's DayNavigator | One generic DateNavigator in entrepta | Two apps asked for the same thing: previous, next, today, a picker, bounds. Each app keeps the URL param |
| FilterBuilder | In entrepta, generic | Fields are typed data, operators come from the type. Nothing in it knows about money. Quick filters stay FilterPills outside it |
| BentoGrid | In entrepta | Two consumers: a dashboard home and the portfolio it was drawn from. Container queries per item are more than a class list |
| Sidebar with labels | A variant of Sidebar, plus a separate MobileNav | The bottom bar on phones is a different component, not a breakpoint of the rail |

### Stays in each app

Anything that carries a product's rules: Wristkit's ActivityCalendar, ExportPreview and
ConnectionStatus, and the money compositions of the dashboard app (its rows, forms, cards, home
widgets and flows). ConnectionStatus comes up in both, but it is a Badge with a dot and a
Tooltip, and the states differ: it stays in each.

---

## Shared rules for every v3 item

A component is done when all of these hold (CLAUDE.md §11 and §12):

1. cva for variants, `cn` for classes, `forwardRef`, `asChild` where it composes.
2. Tokens only. A new ink or fill pairing gets a line in `styles/themes.contrast.test.ts`.
3. Sizes from the ten scale steps. Money and numbers in `font-mono` with `tabular-nums`.
4. `"use client"` only with state, effects or a client library. Icon props take `IconProp`.
5. A test file next to it, the manifest entry (`files`, `deps`, `registryDeps`, `usage`,
   `exports`), a docs page with preview, Markdown twin and index entry.
6. Checked in six themes, both modes, at 375px (Playwright for overflow and console errors) and
   through `next build` of a clean app with the local CLI.
7. Motion: `whileInView` with `once` or CSS, `useReducedMotion()` for anything in JS.
8. Copy defaults in English, every string a prop. A sign is a glyph, never only a color.
9. **Data components** (DataTable, ListRow lists, Metric, charts, ContributionGrid) take
   `loading` and draw their own Skeleton in the final geometry. Empty, error and stale are
   composed by the caller with EmptyState, Alert and Badge, so each app words them.
10. A value from a URL is matched against allowed values before use (`useUrlFilter` already
    does; FilterBuilder's parser does the same against its fields).

---

## Phases

The order follows the consumers' priorities (P0 forms and lists, P1 dashboards, P2 onboarding,
P3 later), with the items Wristkit also needs moved as early as they can go.

### Phase 0: Base

**Why.** Pieces that several components need, done once.

1. Major changesets for both packages. Branch `v3` (done). Charts merged (done).
2. **Registry categories.** `data` and `charts` in the manifest type, `rewriteImports` in the CLI,
   `listRegistryFiles` and `VALID_CATEGORIES` in the manifest test, the docs sections Data and
   Charts, and the `rewriteImportsForConsumer` mirror in the docs.
3. **Palette.** `--chart-1` to `--chart-8`, `--chart-grid`, `--chart-axis`, `--chart-cursor`,
   redone from the branch without a fixed hex: the brand and seven turns of its hue, with a
   lightness and chroma per mode, measured against `--bg-card` (not `--bg-surface`) at 3:1 in all
   12 theme and mode pairs. `lib/color-contrast` learns `oklch()` and relative color so the test
   can read them. Redeclared in `[data-surface="dark"]`. The contrast test also checks each color
   on its own 15% tile tint (IconTile, below). A Palette section on the Color foundation page.
4. **`lib/format.ts` and `FormatProvider`.** Money from minor units, compact notation, a real
   minus sign (U+2212, `Intl` gives a hyphen), signed display, parsing of anything pasted
   (`R$ 1.234,56`, `1,234.56`, `1234.5`), plain date strings, formatting in a given time zone.
   Pure functions with thorough tests; the provider only supplies defaults.
5. **`hooks/use-copy.ts`.** Extracted from CodeBlock and the docs app, with its `error` state.
6. **`useUrlFilter` for several values** (`?category=a&category=b`), still validated.
7. **Avatar.** Sizes 24, 32, 48 and 96px, and `emphasis: "ring"`.

### Phase 1: Overlays (P0)

1. **Popover.** Radix Popover. `open`, `onOpenChange`, `side`, `align`, `modal`. On
   `OVERLAY_SURFACE` with `motion-pop`; joins the overlay family test. Esc returns focus to the
   trigger; focus goes to the first interactive element.
2. **Sheet.** Radix Dialog. `side: "right" | "bottom"` (bottom below 640px by default), `size`,
   required title, `description`, a fixed `footer`. On `--bg-overlay` with the finish. `dirty`
   asks before closing: the confirm is part of the Sheet, not a second dialog on top.

### Phase 2: Money and numbers (P0)

1. **Amount.** `value` in minor units, `tone: "auto" | "neutral" | "positive" | "negative"`,
   `signDisplay`, `compact`, `muteCents`, `animate` (RollingNumber). The currency symbol smaller
   and in `--fg-muted`. With `compact`, the full value in an `sr-only` copy and a Tooltip. Reads
   Redact (Phase 9) from the start through a hook that is a no-op without a provider. Server
   safe unless `animate`.
2. **MoneyInput.** `value` in minor units or `null`, `onValueChange`, `currency`, `locale`,
   `entry: "cents-first" | "free"`, `allowNegative`, `size: "md" | "lg"`. Formats as you type
   without moving the caret, accepts any pasted format, `inputmode="decimal"`, the symbol in
   `--fg-muted`. Works inside Field and with React Hook Form through `Controller` (a docs recipe).

### Phase 3: Choosing (P0, Wristkit phase 2)

1. **Select.** Radix Select, for short lists. Rows are `MENU_ROW` with the brand tint.
2. **Combobox.** Popover and cmdk. `options` with `group` (nested: a parent group, its children as
   options), `hint`, `searchable`, `multiple` (chips in the trigger), `creatable` ("Create 'Pet'"),
   `renderOption` (an IconTile and a name), and a `suggested` option marked with a Badge for the
   person to confirm. Empty text is a prop ("No time zones match").
3. **SegmentedControl.** Native radios. `options: { value; label; icon? }[]`, `size`. The
   indicator travels like the Tabs underline, and stays still with reduced motion.
4. **Calendar.** `react-day-picker` with entrepta's DayButton, Nav, Chevron and caption, on
   `--bg-overlay`. Plain date strings at the edges. States: today, selected, range start, end and
   middle, disabled, outside the limits. `renderDay` for a dot under the day.
5. **DatePicker.** Field-sized trigger, Popover, Calendar. `mode: "single" | "range"`,
   `granularity: "day" | "month" | "year"` (month and year are small grids of our own), `presets`,
   `min`, `max`, `isDisabled`, `timeZone`. The range is announced as text ("Sep 1 to 30").
6. **DateNavigator.** Previous, the period as a DatePicker trigger, next, and today. `value`,
   `onValueChange`, `granularity`, `min`, `max`. At a limit the button is disabled and says why
   in a Tooltip. The URL is the app's job.

### Phase 4: Lists and feedback (P0)

1. **IconTile.** Extracted from the Toast. `icon`, `color` (`brand`, `chart-1` to `chart-8`,
   a status), `size`, a `badge` slot in the corner. The fill is
   `color-mix(in srgb, <color> 15%, var(--bg-card))`, the glyph in the full color at 3:1 or more
   (in the contrast test). Hidden from screen readers by default. The Toast moves onto it.
2. **ListRow** and **ListGroup.** Slots: `leading`, `title` (truncates, Tooltip only when it did),
   `meta`, `trailing` (never truncates), `actions`. `href` makes the whole row a link through a
   stretched link, so the actions sit outside it. `selected`, `muted`. Separated by space and
   hover, no border per row. ListGroup: `ul`, a sticky header with an optional total.
3. **Table.** `Table`, `THead`, `TBody`, `TRow`, `THeadCell`, `TCell`. A real `<table>`, sticky
   header, numeric cells right aligned in tabular figures, horizontal scroll inside its box.
   Server safe.
4. **DataTable.** TanStack on Table: sorting (`aria-sort`), row selection with labelled
   Checkboxes, visible columns, virtualization, skeleton rows. The app swaps it for ListRow below
   640px.
5. **EmptyState.** `icon`, `title`, `description`, `action`, `size`. Two documented cases: no data
   yet (create or connect), nothing for this filter (clear filters). Fits inside a Card.
6. **Alert.** `tone`, `title`, children, `action`, `onDismiss`. `role="status"`, or `alert` for
   an error that needs action. An icon tile and the status tint, no edge bar.

### Phase 5: Navigation and filters (P0 and P1)

1. **Sidebar, `variant="labeled"`.** Icon and label, `groups` with titles, a `search` slot, a
   `footer`, `collapsible` back to the rail (the choice stored, read safely). Active: the brand
   tint, the `◆` and a heavier weight. Collapsed, each icon gets its Tooltip.
2. **MobileNav.** A bottom bar with up to four destinations and More, which opens a Sheet.
   `aria-current="page"`, safe-area padding.
3. **FilterPill, applied.** An `onRemove` that renders a × with a full label ("Remove filter:
   category is Groceries").
4. **FilterBuilder.** `fields: { id; label; type: "enum" | "text" | "amount" | "date" | "boolean";
   options? }[]`, `value: { field; op; value }[]`, `onValueChange`. "+ Filter" opens a Popover:
   field, operator (from the type), value (Combobox, Input, MoneyInput, DatePicker). Active
   filters are applied FilterPills. `serializeFilters` and `parseFilters`, which drops anything
   that does not match a field.

### Phase 6: Dashboards (P1)

1. **Metric** and **Delta.** Metric: `label`, `value`, `delta`, `comparison`, `hint`, `trend`
   slot. Delta: `current`, `previous`, `format: "percent" | "amount"`,
   `intent: "increase-is-good" | "increase-is-bad"`. With a base of zero or below it shows the
   difference in value, never a percentage. States: up, down, flat, new, no data ("—" with the
   reason in a Tooltip). An arrow, a sign and text; color only reinforces.
2. **Progress.** `value`, `max`, `variant: "bar" | "ring"`, `segments` (12 segments, 9 full),
   `label`, `indeterminate`. `role="progressbar"` with `aria-valuetext`. Low progress is never the
   error color.
3. **BentoGrid** and **BentoItem.** `columns` per breakpoint (1, 6, 12), `colSpan` and `rowSpan`
   per breakpoint. Each item is a `@container`. DOM order is reading order. Entrance through
   Reveal with the capped stagger.
4. **Accordion.** Radix Accordion. `type`, items with `trailing` (an Amount) and `actions`
   outside the trigger button.

### Phase 7: Charts (P1, the donut P2)

1. **ChartContainer**, finished. `config` values are palette keys or colors, `format` per series
   through `lib/format`. The name goes on the plot, the summary on `desc` (from the branch).
   ChartTooltipContent shows values through Amount, full even when the axis is compact.
   ChartLegend only from three series. A "View as table" button renders the same data in Table.
   Axis ticks on a scale step (the branch uses 11px).
2. **Recipes** on the Charts docs page, each tested: line and area (with a projection preset:
   dashed, lower opacity, labelled), grouped bars, diverging bars around zero (the status colors,
   the only place they appear, always with a sign), stacked bars, donut (at most five slices). Only horizontal grid
   lines, no frame (the Card is the frame), compact Y axis, abbreviated X axis at 375px.
3. **BarList.** No Recharts, server safe. `items: { label; value; color?; href? }[]`, `max`,
   `showOthers`. Full labels next to bars.
4. **Sparkline.** No Recharts, plain SVG, server safe, `aria-hidden` (the Metric carries the
   value).

### Phase 8: Onboarding and settings (P2, Wristkit phase 2)

1. **Stepper.** `steps`, `current`, `completed`, `errored`, `orientation`. An ordered list,
   `aria-current="step"`, the state of each step in text. The current step takes the `◆`.
2. **ChoiceCard.** Native radio or checkbox inside, the card is the label. `type`, `options:
   { value; title; description?; icon?; badge? }[]`, `value`, `onValueChange`. Selected: the
   strong brand border and a check. Disabled with its reason.
3. **SecretField.** Read only, mono, `use-copy`, `mask` with reveal, an `expired` state with an
   action. The copy button says what it copies; "Copied" through `aria-live="polite"`.
4. **SwatchPicker.** Native radios over the palette keys, each with a name ("Violet") and a check
   when selected. The value is the key, never a hex.

### Phase 9: After the core (P3, Wristkit phase 4)

1. **ContributionGrid.** `days: { date; level: 0-4 | null; state? }[]`, `range`, `renderTooltip`,
   `onSelect`, `legend`. Levels mix the brand into `--bg-card`. One tab stop with arrow keys
   (roving tabindex), a label per cell in text, horizontal scroll on phones at a readable cell
   size, Tooltip kept inside the viewport.
2. **FileDropzone.** A real `<input type="file">` with its label, working by keyboard and click.
   `accept`, `maxSize`, `multiple`, `onFiles`. States: idle, dragging over, uploading (Progress),
   done (the file list), error (type or size, stating the limit). No upload code.
3. **Redact.** `RedactProvider`, `<Redact>`, `useRedacted`. A mask of the same width, "hidden
   value" for screen readers. Amount, Metric and RollingNumber read it. Whether it is on is the
   app's state.
4. **PromptInput** and **ChatThread.** UI components, no AI SDK. PromptInput: Textarea that grows,
   send on ⌘↵, a stop button while streaming, suggestion chips. ChatThread: messages by role,
   streamed text that does not move the reading position, a slot for tool results (a card or a
   chart), `aria-live` for new messages.

### Phase 10: Docs and release

1. A docs page for every item, the Data and Charts sections, the palette on the Color page,
   the format and Redact notes on a Foundations page.
2. "What's new in v3" instead of a migration guide: nothing breaks. It says to rerun
   `init --overwrite` for the new tokens.
3. README table and counts, AGENTS.md cheat sheet (money, dates, the palette, data states),
   CLAUDE.md §7 inventory and §10 decisions, the sandbox copy of `globals.css`.
4. The review of the whole branch against `main`, security first (§12), then release through
   the Changesets PR.

---

## Open decisions

None left. Settled on 2026-09-27: the chat pieces are UI components, the palette derives from the
brand, Avatar takes Wristkit's sizes.

## Risks

- **Size.** About 34 items in one release. Priority order and a test per item keep it
  shippable; the apps can install from the branch with the local CLI before 3.0.0.
- **Dependencies.** Seven new ones across items (Radix Popover, Select and Accordion,
  react-day-picker, TanStack Table and Virtual, Recharts). The CLI installs them without
  versions, so a new major reaches users untested. Each is a dependency only of the items that
  import it.
- **Recharts on the client.** It cannot run in a server component. BarList and Sparkline cover
  the widgets that do not need it.
- **Time zones.** The hardest bugs in both apps. Plain date strings and one format library, with
  tests in several zones, are the defence.

## Out of scope

- Product compositions, listed above.
- A theme generator, CodeInput, saved filter views (a FilterBuilder slot is enough for now),
  reordering home widgets.
