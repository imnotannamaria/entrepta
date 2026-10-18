# entrepta v4 plan

A working plan, published with the repo. It is not product copy.

**Status:** built on the `v4` branch, in 4.0.0. The phases below are what was asked; "What changed from the plan" at the end says where the build went another way.

- **Source:** the new [annamaria.app](https://annamaria.app), the first site built on entrepta
  that does not want entrepta's mark. It removed the `◆`, the `//`, the cursor glow and the editor
  frame, and every one of those took CSS written against entrepta's internals. That list is the
  list of what is not optional today. The audit was checked against the registry at `ee6d199`.
- **Base:** `main` at `ee6d199` (3.0.0).
- **Outcome:** `@entrepta/registry` 4.0.0 and `@entrepta/cli` 4.0.0. A breaking release: the brand
  glyphs stop being defaults, the editor metaphor leaves the library, and a seventh theme,
  taylor, is the flat and monochrome starting point.
- **Date:** 2026-10-18

---

## Summary

entrepta 3 is Anna Maria's site, made reusable. entrepta 4 is a library anyone can use, even a
client project, with the personality as something you pass rather than something you undo.

What leaves the defaults is the mark: the `◆`, the `//` and the editor metaphor. What stays is
how entrepta looks: mono for UI, serif italic for titles, near black surfaces with the finish
(`.sheen`, `--edge-light`), one overlay family, every ink measured.

Six groups of work:

1. **Options the site needs today.** ChatThread avatars, a tooltip that follows the page, a
   SegmentedControl that does not truncate, and a few fixes. Nothing breaks.
2. **taylor, a monochrome theme.** The brand is white in dark mode and black in light mode, with
   no brand glow. Built only from entrepta's tokens, plus one knob any theme can use.
3. **The `◆` stops being a default.** Labels draw nothing without an `icon`. Navs, tabs and the
   stepper take an `indicator`, a dot unless you pass one.
4. **The `//` goes.** From FieldError, CardComment and the CommandPalette.
5. **EmptyState grows to a full page,** so a 404 or an error screen needs no editor frame.
6. **The editor metaphor leaves the registry** and moves into the docs app, which keeps its look.

---

## Decisions

| Topic | Decision | Why |
| --- | --- | --- |
| Positioning | The core is neutral; the mark is opt-in | The library should fit a site that is not Anna Maria's. Today such a site fights the components with CSS |
| Editor components | Removed from the registry, moved to `apps/docs` | StatusBar, ChromeMessage, SectHead, PageOutline, doc-parts, Card `terminal` and Tabs `window` only make sense together, as an editor. The docs site is the one place that wants them |
| A separate `@entrepta/editor` package | No | One more package to version, publish and keep under trusted publishing, for components no other consumer asked for |
| Typography | Stays: mono for UI, serif italic for titles, Inter for long prose | It is how entrepta looks, not a glyph someone has to remove |
| Theme names | The six stay, and taylor joins them | A theme name never reaches a screen |
| taylor | Seventh preset: white brand on dark, black brand on light, no brand glow | The neutral starting point a client project customizes. It proves the system holds with no hue at all |
| Flat | A token, `--finish-glow` (0 to 1), not a component variant | The finish stays the rule for every surface; how much brand light it carries becomes a number a theme or a project sets once |
| Surfaces | No dashed Card, no flat Dialog in the registry | "Every surface has the toast's finish" (CLAUDE.md §10) holds. A site that wants other shapes builds them from props, not by overriding the Card |
| taylor's charts | Hues stay, from a fixed start (`--chart-from`) | White has no hue to turn, and eight grays cannot each clear 3:1 on a near black card and still be told apart. The UI is monochrome; the data keeps color |
| `◆` in labels | No `icon`, no glyph | The absence of an icon should be nothing. `icon={<Diamond />}` brings it back |
| `◆` as a current marker | An `indicator` prop on Stepper, Sidebar, MobileNav and Tabs, a dot by default | There it carries meaning: which step, which page. It needs a replacement, not a removal |
| Diamond | Stays as a registry item, no longer a dependency of anything | It is what you pass to get the old look. It gets its own docs page |
| Cursor glow | Already opt-in | Card has no spotlight. Only Spotlight and SpotlightCard draw one; the site was hiding its own |
| `lib/format.ts` | Renamed to `lib/entrepta-format.ts` | `format.ts` is a name projects already use. `add amount` replaced the site's own file and broke every import |
| CardComment | Renamed `CardNote`, a muted line of text | "Comment" only made sense with the `//` in front |
| Removed items in the CLI | `add status-bar` says it was removed in 4.0 and links the migration guide | A plain "unknown component" reads like a typo |

### Requests that change shape

| Request | Where it lands | Why |
| --- | --- | --- |
| Dashed Card variant | Stays in the site | Contradicts the surface finish. The site's Tile composes Card props instead of overriding classes |
| Flat Dialog variant | Stays in the site, or `--finish-glow: 0` | Same rule, and the Dialog is in the overlay family test. The glow part of "flat" is now a token |
| Card without spotlight by default | Nothing to do | Already the case. The site removes its own `useSpotlight` calls |
| Plain separator | Nothing to do | No registry component has `role="separator"`. The rule hides the site's own markup |
| Light and dark only switcher | `ModeToggle`, which exists | It uses `use-mode` and never writes `data-theme` |
| StatusScreen, a new component | EmptyState with an illustration and a page size | EmptyState already has the icon, title, description, action and error tone. A second one would be copy number two |
| `◆` and `*` out of the field's accessible name | Check first | Both are already `aria-hidden`. If Playwright's `getByLabel` still reads them, the fix is in how the label is built |

### Stays in the site

The mode switch as a curtain, the cleanup of a `data-theme` saved by the old site, the Tile, the
flat dialog's dashed border, the Hint pill, the page header with its serif lede, Dock,
BrowserWindow, Folder, and everything that is the portfolio itself. The site's job after v4: no
rule in its CSS undoes a style of an entrepta component.

---

## Shared rules for every v4 change

1. A breaking change gets a section in the migration guide, with the line that brings the old
   look back where there is one.
2. A new prop is a cva variant or a node, never a boolean style prop (CLAUDE.md §9).
3. Every component still works with no props beyond the required ones, and looks finished.
4. The tests that hold the system (contrast, overlay family, type scale, source rules, docs
   coverage) change only with a reason written in the commit.
5. A token change lands in all three copies of `globals.css`: the registry, `apps/docs/app` and
   `sandbox/wirst-test/app`.
6. Checked in seven themes, both modes, at 375px, and through `next build` of a clean app with
   the local CLI.
7. Each phase ends with a §12 review of its own diff, then lint, typecheck, tests and build.

---

## Phases

Phases 1 and 2 add and break nothing. Phases 3 to 6 are the breaking ones. Each phase lists what
it touches, then a checklist of what must be true for it to be done.

### Phase 0: Base

**Why.** Pieces every later phase needs, and the one rename that is pure plumbing.

**Work**

1. Branch `v4` from `main`. Major changesets for `@entrepta/registry` and `@entrepta/cli`.
2. **Rename `lib/format.ts` to `lib/entrepta-format.ts`.** The manifest item keeps the name
   `format-lib`; only `files` changes. Twelve items depend on it: amount, bar-list, calendar,
   chart, contribution-grid, date-navigator, date-picker, delta, filter-builder, filters-lib,
   money-input and use-format. Their imports move from `../lib/format` to
   `../lib/entrepta-format`, and `rewriteImports` (`packages/cli/src/commands/add.ts`) maps them
   to the `lib` alias as today. The docs mirror of that rewrite lives in
   `apps/docs/app/docs/components/[slug]/page.tsx`.
3. **Removed items in the CLI.** A `REMOVED` record in `packages/cli/src/commands/add.ts` from
   item name to `{ version: "4.0.0", guide: <url> }`, checked before the unknown-name error, in
   interactive mode too (removed items are not listed). Filled in phase 6.

**Done when**

- [ ] `v4` exists and `pnpm changeset:status` shows a major for both packages.
- [ ] `lib/format.ts` no longer exists in the registry; `grep -r "lib/format\"" packages apps`
      finds nothing.
- [ ] `add amount` in a clean app writes `lib/entrepta-format.ts` and leaves an existing
      `lib/format.ts` untouched (a CLI test with a fixture project).
- [ ] `add <removed-item>` exits non-zero with the version and the guide link (a CLI test with a
      fake entry until phase 6).
- [ ] Manifest tests, the docs install previews and the agents cheat sheet snapshot pass with the
      new path.

### Phase 1: Options, nothing breaks

**Why.** What the site overrides today with CSS aimed at internals. Each item here deletes one
override in annamaria.app.

**Work**

1. **ChatThread avatars** (`content/chat-thread.tsx`). `avatar?: ReactNode` on a message and
   `avatars?: Partial<Record<"user" | "assistant", ReactNode>>` on the thread as the default.
   The node takes the slot the `◆` sits in today (line 167), sized by the component, wrapped in
   an `aria-hidden` span since the role is already in text. The `◆` stays the default until
   phase 3.
2. **Tooltip surface** (`primitives/tooltip.tsx`). A cva variant `surface: "dark" | "page"`,
   default `"dark"`. `"page"` drops `data-surface="dark"` from `TooltipContent`, so the tooltip
   inherits the page's mode. Still on `OVERLAY_SURFACE`; the overlay family test covers both.
3. **SegmentedControl** (`primitives/segmented-control.tsx`). Variants `truncate: true | false`
   (false removes `min-w-0` from the segment and `truncate` from the label, so a segment grows to
   its word and the group scrolls if it must) and `shape: "default" | "pill"` (track and
   indicator on `--radius-full`). The CSS indicator keeps working in both shapes.
4. **Sidebar rail tooltip** (`layout/sidebar.tsx`). The `sideOffset` of the rail tooltips becomes
   a named constant set so the tooltip clears the rail's border, the value the site patched by
   hand (`18`), checked in both modes.
5. **Field docs.** A section on the Field page and its Markdown twin: validate with zod (or any
   schema) and `noValidate` on the form; `required` on the label is only visual, so the control
   carries `required` or the schema does.
6. **The label check.** A Playwright run on the docs Field preview with
   `getByLabel("Email", { exact: true })` on a required field.

**Done when**

- [ ] A thread with `avatars={{ assistant: <Avatar /> }}` renders the avatar and no `◆`; with no
      prop, the `◆` is still there (test).
- [ ] `<TooltipContent surface="page">` has no `data-surface` and reads light tokens on a light
      page (test plus a look in both modes).
- [ ] `truncate={false}` keeps "Monthly" whole in a 240px container at 375px; `shape="pill"`
      rounds track and indicator (test for classes, a look for the slide).
- [ ] The rail tooltip does not touch the rail's border in dark or light.
- [ ] The Field page has the validation section, and `lib/markdown.test.ts` passes.
- [ ] The label check passes, or its fix lands here with a test.
- [ ] annamaria.app can delete its ChatThread, tooltip and SegmentedControl overrides and its
      local sidebar edit (listed for the site, not done here).

### Phase 2: taylor, the monochrome theme

**Why.** A client project wants a quiet base and its own color later. taylor is that base: no
hue, no brand glow, every token still from entrepta. It also proves the system holds when the
brand is the same as the primary ink.

**Work**

1. **The glow knob** (`styles/globals.css`, all three copies). `--finish-glow: 1` declared once,
   on `:root` only, never per mode. Every brand light reads it:
   - `--sheen-tint: color-mix(in srgb, var(--fg-brand) calc(9% * var(--finish-glow)), transparent)`
     on `:root` and `[data-surface="dark"]`, and `calc(4% * ...)` in the light block.
   - `--shadow-brand` the same way at 20%, which carries `--shadow-lift-brand` with it.
   - `--edge-light` and `--shadow-overlay` do not read it: they are depth, not brand.
   One knob is the point. Setting `--sheen-tint` from a theme would take three overrides
   (`:root`, light, dark surface), because the light block and `[data-surface="dark"]` redeclare
   it with higher specificity, and one more for every glow added later. A knob declared only on
   `:root` inherits everywhere. Confirm `color-mix()` with a `calc()` percentage in Safari 17,
   Chrome 119 and Firefox 128 before relying on it; the fallback is a percentage token per mode.
2. **The chart start** (`styles/globals.css`). `--chart-from: var(--fg-brand)`, declared wherever
   the chart tokens are (`:root`, light, `[data-surface="dark"]`). The eight colors read
   `oklch(from var(--chart-from) ...)` instead of `var(--fg-brand)`. Every other theme is
   unchanged. The `@supports not` fallback is untouched.
3. **`styles/themes/taylor.css`**, three blocks, values from the zinc scale:

   | Token | Dark (`:root`) | Light (`:root[data-mode="light"]`) |
   | --- | --- | --- |
   | `--fg-brand` | `#fafafa` (zinc-50) | `#09090b` (zinc-950) |
   | `--fg-brand-hover` | `#d4d4d8` (zinc-300) | `#3f3f46` (zinc-700) |
   | `--fg-on-brand` | `#09090b` | `#fafafa` |
   | `--fg-brand-text` | `#fafafa` | `#09090b` |
   | `--bg-surface-brand` | `rgba(250, 250, 250, 0.08)` | `rgba(9, 9, 11, 0.06)` |
   | `--ring` | `rgba(250, 250, 250, 0.45)` | `rgba(9, 9, 11, 0.4)` |
   | `--finish-glow` | `0` | (inherits) |
   | `--chart-from` | `#3b82f6` | same |

   The third block, `:root[data-mode="light"] [data-surface="dark"]`, puts the dark values back
   inside a dark surface on a light page (a tooltip, a code block). The other themes get by
   without it because their light brand still reads on near black; black does not. The header
   comment of the file says which tokens are the knobs to change for a project's own look.
4. **The CLI.** `THEMES` in `packages/cli/src/utils/themes-css.ts` gains `taylor`. `scopeTheme`
   learns the third selector, rewritten to
   `:root[data-theme="taylor"][data-mode="light"] [data-surface="dark"]` (plus the bare form when
   taylor is the default). The two required blocks still throw when missing; the third is
   optional for every theme. The `--theme` help text in `packages/cli/src/index.ts`, and the "six themes" wording in
   `config.ts` and `init.ts`.
5. **Theme lists elsewhere.** `apps/docs/public/schema.json` (enum) and its test,
   `apps/docs/lib/theme.ts` (`{ id: "taylor", color: "#FAFAFA", lightColor: "#09090B" }`), the
   themes page and `docs-data.ts`, the docs ThemeSwitcher. A swatch that matches its background
   (white on a light panel, black on dark) gets a `--border-strong` ring so it stays visible.
6. **The audit.** In taylor `--fg-brand-text` equals `--fg-primary`, so a state shown only by
   brand-colored text disappears. Every use gets checked for a second cue (weight, underline,
   tint, indicator): arrow-link, avatar, badge, calendar, code-block, date-picker, file-dropzone,
   filter-pill, icon-tile, kbd, theme-switcher, type-in, plus every `text-[var(--fg-brand)]` used
   for a current or selected state (tabs, sidebar). A fix that is a second cue helps every theme.
7. **Tests.** `styles/themes.contrast.test.ts`: `THEMES` gains taylor (14 theme and mode pairs);
   the dark-surface case reads the theme's third block when it has one; the sheen case reads
   `--finish-glow` times the percentage instead of the regex on `--sheen-tint`; the "chart-1
   follows the brand hue" case compares against `--chart-from`.

**Done when**

- [ ] `init --theme=taylor` and `init --themes=all` write taylor, and the CSS output matches a
      snapshot in `themes-css.test.ts`, the third block included.
- [ ] The contrast test passes for all 14 pairs with no threshold lowered.
- [ ] With `--finish-glow: 0` no card, overlay, toast or featured card shows a brand glow or brand
      shadow; with `1` every other theme renders exactly as in 3.0 (a computed-style check on
      the docs preview).
- [ ] Inside a tooltip on a light taylor page, the focus ring and a brand Kbd are white.
- [ ] Charts in taylor use eight distinct hues at 3:1 on the card; ContributionGrid levels are
      grays, which is intended.
- [ ] The audit list is closed: each item has a second cue or a note on why color is not the
      only signal.
- [ ] schema.json, its test, the docs themes page, the docs switcher and the README list seven
      themes.
- [ ] CLAUDE.md §5: seven presets in the table, and "each preset only overrides the brand
      tokens" now reads "the brand tokens, `--finish-glow` and `--chart-from`".

### Phase 3: The `◆` stops being a default

**Why.** The glyph is the mark. Where it decorates, it goes; where it marks the current item, a
neutral dot replaces it.

**Work**

1. **Labels draw nothing without an `icon`:** CardLabel (`primitives/card.tsx`), FieldLabel
   (`primitives/field.tsx`), DialogLabel (`primitives/dialog.tsx`), Metric's label
   (`data/metric.tsx`), the legends of ChoiceCard and SwatchPicker, and ChatThread's assistant
   row (its avatar or nothing). `icon` takes an element as today, so `icon={<Diamond />}` is the
   way back. The label's gap closes when there is no icon.
2. **`indicator?: ReactNode` on Stepper, Sidebar, MobileNav and Tabs.** `null` hides it. The
   default is a dot, defined once in `lib/nav.ts` as `NavIndicator` (a 6px circle in
   `--fg-brand`, `aria-hidden`), so all four match. In the Sidebar and MobileNav the
   `motion.span` with its `layoutId` stays in the component and still travels between items;
   only what it carries changes, and `data-sidebar-mark` and `data-mobile-nav-mark` stay on it.
   In Tabs the inactive tabs keep the transparent placeholder, so the label does not shift.
3. **Diamond** leaves every `registryDeps` list. The manifest test for cross-category imports
   confirms nothing imports it. It gets a docs page, Markdown twin and index entry, showing it
   passed as an `icon` and as an `indicator`.
4. **The docs** pass `<Diamond />` where the docs site wants its own look, so the site does not
   change.

**Done when**

- [ ] `grep -rn "<Diamond" packages/registry --include=*.tsx` finds only tests and the Diamond
      file.
- [ ] `test/label-icons.test.tsx` is inverted: no `◆` by default, the icon when given, never both.
- [ ] Each of the four indicators renders the dot by default, a passed node, or nothing with
      `null` (one test each); the Sidebar dot still travels, with reduced motion instant.
- [ ] Diamond has a docs page, and `components.test.ts`, `markdown.test.ts` and `readme.test.ts`
      pass.
- [ ] The docs site looks as it did in 3.0 (a side by side of home, a component page, the
      sidebar).

### Phase 4: The `//` goes

**Work**

1. **FieldError** renders the message alone; the `aria-hidden` prefix span goes.
2. **CardComment becomes CardNote**, a muted line in `CardFooter`, same type step. Manifest
   `exports`, the docs page and the agents cheat sheet follow.
3. **CommandPalette** drops the `//` from its default footer label (line 202).

**Done when**

- [ ] `grep -rn '"// "' packages/registry --include=*.tsx` finds nothing outside tests.
- [ ] `CardComment` appears nowhere in the registry or the docs, except in the migration guide.
- [ ] FieldError is still announced on appear (existing test).

### Phase 5: EmptyState for a whole page

**Why.** ChromeMessage leaves in phase 6. A project still needs a 404 and an error screen, and
EmptyState is most of one already.

**Work**

1. `illustration?: ReactNode`, above the title and larger than `icon`; when both are given, the
   illustration wins.
2. `size: "sm" | "md" | "page"`. `page` fills the height it gets and centers its content, with
   room for the illustration.
3. `headingLevel` (2 by default), as ChromeMessage has today, for a page that already has an `h1`.
4. Still server safe, no `"use client"`.

**Done when**

- [ ] The docs page shows three recipes: a 404, an error with a retry, and a removed item.
- [ ] `size="page"` holds at 375px with a 200px illustration and a long title (Playwright for
      overflow).
- [ ] Tests for the illustration slot, the page size and the heading level.
- [ ] A clean Next.js app renders `<EmptyState size="page">` in `not-found.tsx`, a server file,
      through `next build`.

### Phase 6: The editor metaphor leaves the registry

**Work**

1. **Removed from the registry and the manifest:** status-bar, chrome-message, sect-head,
   page-outline, doc-parts, Card `variant="terminal"` with `CardTerminalBar` and its body, and
   Tabs `variant="window"`. Nothing in the registry imports any of them. Each name goes into the
   CLI's `REMOVED` record from phase 0.
2. **Moved to `apps/docs/components/editor/`,** with their tests. The docs site keeps its status
   bar, section heads, outline, 404 and error screens. The title bar becomes a docs wrapper
   around the plain Tabs (used by the home hero and one preview). The one terminal Card in the
   docs becomes a docs component.
3. **Docs coverage follows:** the component pages and their previews, `component-index.ts`,
   `components.ts`, the sitemap, the Markdown twins, `llms.txt`, the per-component share images,
   the README table and counts.
4. **Stay:** CodeBlock's `terminal` variant (a block of shell commands is content, not the
   frame), TopNav, Input's `command` variant, Kbd, Spotlight, SpotlightCard, TypeIn.

**Done when**

- [ ] None of the removed files exist under `packages/registry`; the manifest has no entry for
      them and the Card and Tabs types have no `terminal` or `window`.
- [ ] `add status-bar` (and each removed name) prints the 4.0 message (CLI test per name).
- [ ] The docs build, and every page that used an editor component renders from
      `apps/docs/components/editor/`.
- [ ] The docs coverage tests pass with the lower count, and the README says it.

### Phase 7: Docs and release

**Work**

1. **Migrating to v4,** a docs page with its Markdown twin. One section per breaking change,
   before and after, and the line that brings the old look back: `icon={<Diamond />}`,
   `indicator={<Diamond />}`, CardNote, the format file, where each removed item went. Wristkit
   is the worked example: it uses chrome-message, sect-head, diamond, card and tabs.
2. **What's new in v4,** for the options of phase 1, taylor and `--finish-glow`, and the page
   EmptyState.
3. **CLAUDE.md and AGENTS.md** together (`test/instructions-sync.test.ts` holds them equal): §1
   positioning, §4 principle 2 (the editor is the docs site's look, not the library's), §5 the
   seven themes and the two new tokens, §7 inventory and counts, §10 decisions, §12 where it
   names Diamond as something to reuse.
4. **The docs home copy** stops selling the IDE metaphor as the library. The site keeps wearing
   it.
5. The review of the whole branch against `main`, security first (§12), then release through the
   Changesets PR.
6. **After the release, in annamaria.app:** reinstall the changed items, drop every override this
   plan covers, switch to ModeToggle, and confirm the site's CSS no longer undoes an entrepta
   style.

**Done when**

- [ ] Both pages are in the docs nav, the sitemap and `llms.txt`.
- [ ] Wristkit installs from the branch with the local CLI, follows the guide, and builds.
- [ ] `instructions-sync`, the docs coverage tests and the full suite pass; lint, typecheck and
      build pass.
- [ ] The Version Packages PR shows 4.0.0 for both packages.

---

## Open decisions

- **Phases 1 and 2 as 3.1.** Ship the options and taylor first as a minor, so the site can drop
  its overrides before the major, or keep everything in 4.0.
- **taylor's chart start.** A blue at hue 250 is the proposal. Any fixed hue works; the choice is
  what the first series looks like.
- **More knobs.** `--finish-glow` is the only one planned. Radius or border strength could follow
  the same pattern if a project asks.
- **The dot.** Its size next to each component (stepper, rail, bottom bar, tab) is a design call,
  made on screen in phase 3.

## Risks

- **Silent visual change.** A project that runs `add card --overwrite` loses the `◆` with no
  error. The migration guide and the release notes lead with it.
- **Removed items.** Low risk in a copy-paste library: a project keeps its copies and they keep
  working. Only `add` stops offering them, and says why.
- **The format rename.** A project with some components on the old name and some on the new
  ends up with both files. They do not conflict; the guide says to delete the old one once
  everything is reinstalled.
- **`color-mix()` with `calc()`.** If a target browser rejects it, every glow disappears in every
  theme, not just taylor. Phase 2 checks support before the knob ships, and keeps the fallback
  ready.
- **Brand equal to ink.** taylor will show every place where color alone marks a state. The
  audit in phase 2 is the defence, and its fixes help every theme.
- **Wristkit** uses two of the removed items. It moves them into its own code, as the docs site
  does.

## What changed from the plan

- **Tabs have no indicator by default.** The travelling underline already says which tab is
  active, so a dot would say it twice. `indicator` is still there on Tabs and TabNav.
- **SectHead, doc-parts and PageOutline were deleted, not moved.** The docs site only used them in
  their own component previews, so moving them would have kept dead code. StatusBar and
  ChromeMessage moved, and `WindowBar` is new, since the title bar was a Tabs variant.
- **The docs keep the look through two wrappers**, `CardLabel` (with the ◆) and `CardComment` (with
  the `//`), in `apps/docs/components/editor/`.
- **`truncate={false}` does not scroll.** Segments stay equal and the control grows to the longest
  word.
- **Phases 1 and 2 did not ship as 3.1.** Everything is one 4.0.
- **`--chart-from` is `#3b82f6`**, a hex, because the contrast test reads the color from the file.
- **Docs component tests run in jsdom** (`apps/docs/test/setup.ts`), with testing-library as docs
  devDependencies, so the editor pieces keep their tests.
- **Two pages shipped**, "What's new in v4" and "Migrating to v4".

## Out of scope

- A theme generator, renaming themes, themes beyond taylor.
- Making the fonts configurable.
- A dashed Card or a flat Dialog in the registry.
- The site's own pieces (Tile, Hint, page header, Dock, BrowserWindow, Folder).
