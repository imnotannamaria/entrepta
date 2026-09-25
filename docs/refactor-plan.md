# entrepta v2 refactor plan

A working plan, published with the repo. It is not product copy.

- **Source:** entrepta's first consumer, the
  [anna.maria.dev](https://github.com/imnotannamaria/anna.maria.dev) portfolio, grew the design
  system from the inside between July and September 2026. This plan brings that work back.
  Portfolio links point at commit
  [`50c055f`](https://github.com/imnotannamaria/anna.maria.dev/tree/50c055f).
- **Base:** entrepta `main` at `b34272c`.
- **Outcome:** `@entrepta/registry` 2.0.0 and `@entrepta/cli` 2.0.0. This is a major release:
  icons, the Card, text sizes and token values all change.
- **Date:** 2026-09-25

---

## Summary

entrepta started inside the portfolio, and then the two drifted apart. The portfolio kept
changing. Its cards went from gray to near black. Its type settled on a closed scale of ten
steps. The ink on every brand fill got measured, theme by theme. And it gained real motion:
entrances, counters, a light that follows the cursor, all of it respecting people who ask for
less movement. None of that has reached entrepta yet. Installing entrepta today gets you the
system as it stood in May.

The work has five fronts:

1. **Tokens.** Less gray, darker zinc. Surfaces of their own for cards and modals, accents
   derived from the brand, named shadows, and a type scale with no in-between sizes.
2. **Accessibility.** The right ink on every brand background across all 12 theme × mode
   combinations, checked by a test that measures contrast instead of trusting a copied table.
3. **Motion.** `motion` becomes a dependency. In come the primitives the portfolio has already
   run in production, with the rules that keep them honest. Each rule was written after a real
   bug.
4. **Docs and home page.** Rewritten foundations, new rules and accessibility pages, a page for
   every new component, and a home page that shows what the system actually does.
5. **A configurable AGENTS.md.** On the home page, you pick a framework, a theme and your
   components, then copy an AGENTS.md ready for your project.

---

## Decisions

| Topic                | Decision                                                        | Consequence                                                                                                                                                    |
| -------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type scale           | `@theme static` plus CSS variables. The `.t-*` classes go       | Reverses "tokens do not use `@theme`" (CLAUDE.md §10). `globals.css` already imports `tailwindcss`, so no real compatibility is lost. `.t-*` has zero consumers today |
| Card                 | `<Card>` stays a component, rebuilt on the bento look           | The API (`Card`, `CardHeader`…) stays. The surface, hover, sizes and the head and foot overflow contract change                                                 |
| New pieces           | Motion, forms and states, small pieces, editor chrome           | About 20 new registry items (Phases 3 to 5)                                                                                                                    |
| Light themes         | The portfolio's measured values; entrepta light moves to `#6656ff` | The portfolio adopts the fix too (Phase 8)                                                                                                                  |
| Brand as text        | A new `--fg-brand-text` token                                   | `--fg-brand` stays for fills, borders, glyphs and large text                                                                                                   |
| Themes in `init`     | `init` asks: one fixed theme, or all six at runtime             | The CLI gains a runtime mode, and the ThemeSwitcher works in user projects                                                                                     |
| AGENTS.md            | A configurator on the home page                                 | A pure generator in the docs app, fed by the CLI manifest                                                                                                      |
| Icons                | Everything moves to Phosphor                                    | `lucide-react` leaves the registry, the CLI and the docs                                                                                                       |
| Motion               | `motion` ^12 becomes a dependency                               | Only for the items that use it. Nobody installs it by accident                                                                                                 |

---

## Inventory

### Tokens

| Token                                      | entrepta today                                      | portfolio                                     | Action                                        |
| ------------------------------------------ | --------------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| `--bg-card`                                | missing (cards use `--bg-surface`, zinc-900)        | `#0b0b0e` · light `#ffffff`                   | add                                           |
| `--bg-card-hover`                          | missing                                             | `#121216` · light `#f7f7f8`                   | add                                           |
| `--bg-overlay`                             | missing                                             | `#0e0e10` · light `#ffffff`                   | add                                           |
| `--fg-muted` (dark)                        | `#71717a`, about 4.1:1, below AA                    | `#8a8a92`, 5.7:1 on a card                    | replace, including in `[data-surface="dark"]` |
| `--border-brand`, `--border-brand-strong`  | missing                                             | `color-mix` of `--fg-brand` at 35% and 60%    | add                                           |
| `--shadow-brand`, `--fg-brand-glow`        | missing                                             | `color-mix` at 20% and 50%                    | add                                           |
| `--bg-spotlight`                           | missing                                             | `color-mix` at 15%, 26% in light              | add                                           |
| `--shadow-card-hover`                      | missing                                             | `0 8px 24px rgba(0,0,0,.3)`, `.1` in light    | add                                           |
| `--shadow-lift-brand`                      | missing                                             | `0 12px 32px var(--shadow-brand)`             | add                                           |
| `--shadow-overlay`                         | hardcoded inside CommandPalette                     | `0 24px 48px rgba(0,0,0,.6)`                  | add and use                                   |
| `--fg-on-brand`                            | missing (components use `--bg-canvas` or `--zinc-50`) | per theme, 12 values                        | add to the theme files                        |
| `--fg-brand-on-tint`                       | missing                                             | per theme, 12 values                          | ships as `--fg-brand-text`                    |
| Type scale                                 | `.t-*` classes, heading-md 20px, mono-xs 11px       | `@theme`, heading-md 18px, mono-xs 10px       | Phase 1                                       |
| Light brands                               | blossom `#b8262e`, marmalade `#d96b00`, julia `#d33a72`, ivy `#1e8350` | `#b02028`, `#e06800`, `#cc3a6a`, `#258a50` | adopt the portfolio's                 |
| Fonts                                      | Google Fonts `@import`                              | self-hosted with `next/font`                  | see Open decisions                            |

The two sides already match on the zinc and accent primitives, status colors, spacing, radius, motion durations and curves, the reset, global focus and scrollbars.

### Components on both sides

These diffs were read with formatting normalized (semicolons, trailing commas), so the table
lists real changes only.

| Component        | What changed in the portfolio                                                                                                     | Action                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Button           | `buttonVariants` lives in `button-variants.ts` with no `"use client"`, so server components can use it. Primary uses `--fg-on-brand`. Sizes on the scale: sm `mono-sm`, md `mono-md`, lg `body-lg` (lg grows from 14 to 16px) | port                                                       |
| Badge            | Solid brand uses `--fg-on-brand`. sm `mono-xs`, md `mono-sm` (11 to 12px). Soft brand still uses `--fg-brand-hover` as text      | port, and move soft brand to `--fg-brand-text`             |
| Input            | 13px to `mono-md` (14px), the kbd from 11px to `mono-sm`                                                                           | port                                                       |
| Dialog           | Scale only                                                                                                                        | port, and move to `--bg-overlay` and `--shadow-overlay`    |
| Dropdown         | Scale only                                                                                                                        | port                                                       |
| CommandPalette   | `--bg-overlay`, `--shadow-overlay`, a `◆` before each group heading, a footer that wraps with `// palette` on the left            | port                                                       |
| CodeBlock        | A visible `copy failed` state (icon, text, `aria-label`)                                                                          | port                                                       |
| Skeleton         | A `delay` prop, applied negative so the shimmer moves as one wave                                                                 | port, plus `.skeleton-sweep` for large grids               |
| StatusBar        | `--fg-on-brand` instead of `--zinc-50`, which failed 7 of 12 combinations. No longer `fixed`                                       | port; `fixed` or `static` becomes a variant                |
| ThemeSwitcher    | Scale only                                                                                                                        | port                                                       |
| TopNav           | The logo mark uses `--fg-on-brand`, plus the scale                                                                                 | port                                                       |
| Toast            | Nothing                                                                                                                           | icon swap only                                             |
| `lib/utils` (`cn`) | `extendTailwindMerge` with the scale, plus an override that turns off the font-size to leading conflict                         | port, with the tests                                       |
| Hooks            | `use-theme`, `use-mode` and `use-command-palette` are identical                                                                   | nothing                                                    |

### Only in entrepta

Tabs, Tooltip, ModeToggle, and Card (the portfolio replaced its Card with a `.bento-card`
class). All four stay and get the scale and Phosphor. Tabs also takes on the portfolio's
TabStrip look (Phase 5).

### New pieces (portfolio to registry)

Paths are relative to the portfolio repo, at `50c055f`.

| Piece                                                       | Source in the portfolio                                                                                                                         | Registry destination                    | Phase |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ----- |
| `Diamond`                                                   | [`components/ui/diamond.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/diamond.tsx)                           | `content/diamond.tsx`                   | 3     |
| `CardHead`, `CardFoot`                                      | [`components/ui/card-parts.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/card-parts.tsx)                     | inside the rebuilt `primitives/card.tsx` | 3    |
| `EASE_OUT`, `revealViewport`, `STAGGER_LIMIT`               | [`components/ui/reveal.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/reveal.tsx)                             | `lib/motion.ts`                         | 4     |
| `Reveal`, `useReveal`                                       | [`components/ui/reveal.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/reveal.tsx)                             | `motion/reveal.tsx`                     | 4     |
| `TypeIn`                                                    | [`components/ui/type-in.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/type-in.tsx)                           | `motion/type-in.tsx`                    | 4     |
| `RollingNumber`, `useRollOnHover`                           | [`components/ui/rolling-number.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/rolling-number.tsx)             | `motion/rolling-number.tsx`             | 4     |
| `Spotlight`, `useSpotlight`                                 | [`components/ui/spotlight.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/spotlight.tsx)                       | `motion/spotlight.tsx`                  | 4     |
| `ArrowLink`, `ArrowAffordance`                              | [`components/ui/arrow-link.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/arrow-link.tsx)                     | `motion/arrow-link.tsx`                 | 4     |
| `Switch`                                                    | [`app/components/entrepta/switch.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/app/components/entrepta/switch.tsx)         | `primitives/switch.tsx`                 | 5     |
| `Textarea`                                                  | [`app/components/entrepta/textarea.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/app/components/entrepta/textarea.tsx)     | `primitives/textarea.tsx`               | 5     |
| `Field`, `FieldLabel`, `FieldError`                         | [`components/ui/form-field.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/form-field.tsx)                     | `primitives/field.tsx`                  | 5     |
| `FilterPill`, `useUrlFilter`                                | [`components/ui/url-filter.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/url-filter.tsx)                     | `primitives/filter-pill.tsx`, `hooks/use-url-filter.ts` | 5 |
| `ChromeMessage` (404 and error screens)                     | [`components/ui/chrome-message.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/ui/chrome-message.tsx)             | `feedback/chrome-message.tsx`           | 5     |
| `PageLoading` (CSS only, no JS)                             | [`components/chrome/page-loading.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/chrome/page-loading.tsx)         | `feedback/page-loading.tsx`             | 5     |
| `SectHead` (the `$ command` section rule)                   | [`components/home/section-head.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/home/section-head.tsx)             | `content/sect-head.tsx`                 | 5     |
| `DocLabel`, `Em`, `Strong`, `Section`, `DisplayH2`, `Prose` | [`components/chrome/page-parts.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/chrome/page-parts.tsx)             | `content/doc-parts.tsx`                 | 5     |
| `TabStrip`                                                  | [`components/chrome/tab-strip.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/chrome/tab-strip.tsx)               | merged into `primitives/tabs.tsx`       | 5     |
| `Sidebar` (icon rail with a `◆`)                            | [`components/chrome/sidebar.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/chrome/sidebar.tsx)                   | `layout/sidebar.tsx`                    | 5     |
| `PageOutline` (scrollspy)                                   | [`components/chrome/page-outline.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/chrome/page-outline.tsx)         | `layout/page-outline.tsx`               | 5     |
| `Titlebar`                                                  | [`components/chrome/titlebar.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/chrome/titlebar.tsx)                 | `layout/titlebar.tsx`                   | 5     |

### Side findings

Things found while reading both codebases. Each one has a phase that owns it.

1. **entrepta light misses AA for text on the brand fill.** Near-white on `#6b5bff` measures
   4.41:1. `#6656ff` (same hue, 1% less lightness) measures 4.63, and keeps `--fg-brand-text`
   (`#5a4cd6`) at 5.27 on the brand tint. Phase 2.
2. **The brand color as text falls below AA in 4 of 12 combinations:** blossom dark 3.80,
   marmalade light 3.27, ivy light 4.17, bosco dark 3.85, measured against the canvas (the card
   is close). This covers links, `<Em>`, the `$` prompt and brand-colored labels. The measured
   tint inks clear 5.7 in all 12, on both canvas and card. The token lands in Phase 2. Phase 3
   audits the 13 places in the registry that use the brand as text color, and Phase 6 audits
   the 63 in the docs app.
3. **The soft brand Badge uses `--fg-brand-hover` as text,** a pairing the measurements rule
   out. Phase 3.
4. **Dialog and CommandPalette are both modals,** but each styles its own surface and shadow.
   Both move to `--bg-overlay` and `--shadow-overlay`. Phase 3.
5. **The CLI manifest lists `lucide-react` as a dependency of `tabs`,** and `tabs.tsx` imports
   no icons. Phase 3.
6. **Component counts disagree:** the docs home says 14 (hardcoded in `HERO_STATS`), the
   README says 16, and the manifest has 19 entries. The docs app also keeps two component
   lists of its own, in `app/docs/components/page.tsx` and `app/docs/components/[slug]/page.tsx`.
   Phase 7.
7. **`apps/docs/app/globals.css` is a hand-made copy of the registry's,** and nothing notices
   when they drift. Its runtime theme blocks already carry old light values. Phase 6.
8. **The header comment of the registry's `globals.css` is in Portuguese,** and that file ships
   into user projects. Phase 1.
9. **`init` writes one theme into `:root`,** so the ThemeSwitcher cannot switch anything in a
   user project. Phase 2.
10. **`init` writes `lib/utils.ts` from an inline string in `init.ts`,** not from
    `registry/lib/utils.ts`, so `cn` has two sources. Phase 1.
11. **Design principle 6** ("no exaggerated spring, 120 to 320ms") contradicts what is coming
    in: Spotlight and RollingNumber are springs, and entrances run 500ms. Phase 4.

---

## Phases

| Phase | Topic                                                            | Depends on | Size |
| ----- | ---------------------------------------------------------------- | ---------- | ---- |
| 0     | Preparation                                                      | none       | S    |
| 1     | Tokens: surfaces, brand accents, shadows, type scale             | 0          | M    |
| 2     | Accessibility: inks, themes, runtime themes in `init`, tests     | 1          | M    |
| 3     | Existing components: Phosphor, Card, Diamond, brand text         | 1, 2       | L    |
| 4     | Motion: dependency, lib, primitives, CSS                         | 3          | M    |
| 5     | New components: forms, states, small pieces, editor chrome       | 4          | L    |
| 6     | Documentation                                                    | 5          | L    |
| 7     | Home page and the AGENTS.md configurator                         | 6          | M    |
| 8     | Release and adoption                                             | 7          | S    |

Each phase is a branch with a PR into a `v2` integration branch, and `v2` reaches `main` once,
at the end. The reason: changesets publish on every push to `main`, and publishing half of a
major leaves installs with a system that does not fit together.

Every phase ends with lint, typecheck, tests and build passing. Every phase that changes size,
spacing or color also ends with a visual pass, done by a person looking at the screen. The tests
do not measure text. The portfolio's type scale work is the cautionary case: the first three
places checked by eye were broken while every check was green.

---

## Phase 0: Preparation

**Why.** This refactor touches almost every file in the registry. A clean, recorded starting
point is what makes it possible to tell later what changed because of it.

**Checklist**

- [x] Create `v2` from `main`.
- [x] Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` on `main` and record the
      result as the baseline.
- [x] Take screenshots of the docs site (home, foundations, three or four component pages) in
      both modes, for the visual passes to compare against.

**Done when** `v2` exists, the baseline is green and the screenshots are saved.

**Baseline** (2026-09-25, `b34272c`)

- Lint: 115 files, no issues.
- Typecheck: passing.
- Tests: CLI 54 in 6 files, registry 214 in 20 files. All passing.
- Build: the CLI, the registry and the docs app, with 16 docs routes.
- Screenshots: `docs/baseline-v1/`, 48 PNGs. 12 pages (home, docs, the foundations index,
  color, typography, motion, and button, badge, card, code-block, command-palette,
  status-bar), each in dark and light, at 1440px and 375px. Taken from the production build at
  2x with reduced motion, full page. Named `<page>.<mode>.<viewport>.png`.
- Already broken on `main`: in light mode, the command inside the `terminal` Card is dark text
  on a black surface and is nearly unreadable. Phase 3 keeps `data-surface="dark"` on that
  variant, so that pass has to confirm it is fixed.

---

## Phase 1: Tokens

**Why.** Every entrepta card is zinc-900 today, and a whole grid of them reads as a field of
gray. The portfolio found that a card a hair above the canvas, defined by its border, reads as
dark, which is the personality the system is after. This phase brings those tokens, the accents
derived from the brand (borders and glows that follow the theme on their own), and a closed type
scale that ends the "13 or 14?" question.

**What changes for users.** New tokens for cards and modals. Muted text gets a little lighter and
passes AA. Arbitrary sizes such as 13px and 11px go away: 13 becomes 14, and 11 becomes 12 or 10
depending on the role. Utilities such as `text-mono-sm` appear. Components move to the new
surfaces in Phase 3.

**Technical**

1. **Surfaces**, in `:root`, the light block and `[data-surface="dark"]`:

   ```css
   --bg-card: #0b0b0e;        /* light: #ffffff */
   --bg-card-hover: #121216;  /* light: #f7f7f8 */
   --bg-overlay: #0e0e10;     /* light: #ffffff */
   --fg-muted: #8a8a92;       /* light stays #71717a (4.63 on the canvas) */
   ```

   The rule is the portfolio's: `--bg-card` for cards; `--bg-surface` for what sits _above_ a
   card (dropdowns, tooltips, code blocks); `--bg-overlay` for dialogs and the palette.

2. **Brand accents**, declared once in `:root`:

   ```css
   --border-brand: color-mix(in srgb, var(--fg-brand) 35%, transparent);
   --border-brand-strong: color-mix(in srgb, var(--fg-brand) 60%, transparent);
   --shadow-brand: color-mix(in srgb, var(--fg-brand) 20%, transparent);
   --fg-brand-glow: color-mix(in srgb, var(--fg-brand) 50%, transparent);
   --bg-spotlight: color-mix(in srgb, var(--fg-brand) 15%, transparent); /* light: 26% */
   ```

3. **Shadows:** `--shadow-card-hover` (`.1` in light), `--shadow-lift-brand`, `--shadow-overlay`.

4. **`[data-surface="dark"]`** redeclares `--fg-muted`, the three new surfaces, `--bg-spotlight`
   (15%) and `--shadow-card-hover` (`.3`). A `var()` inside a custom property resolves once, on
   the element that declares it, and then inherits as a literal. Without the redeclaration, a
   dark surface inside a light page inherits the light values.

5. **Type scale.** A `@theme static` block with the ten steps, each with its `--line-height`.
   `static` makes Tailwind emit every variable on `:root` even when no utility uses it, so
   `font-size: var(--text-mono-sm)` works in plain CSS. Values: display-xl 80/0.95, display-lg
   64/1, display-md 40/1.1, heading-lg 24/1.3, heading-md **18**/1.4, body-lg 16/1.6, body-md
   14/1.5, mono-md 14/1.5, mono-sm 12/1.4, mono-xs **10**/1.3. A token sets size and leading,
   never family. The `.t-*` classes and the `.t-italic`, `.t-muted`, `.t-secondary` and `.t-brand`
   helpers go.

6. **`cn` in `lib/utils.ts`.** `extendTailwindMerge` with `TYPE_SCALE` registered under
   `font-size`, plus `override: { conflictingClassGroups: { "font-size": [] } }`. The comments in
   the portfolio's [`lib/utils.ts`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/lib/utils.ts)
   explain the two bugs this prevents: a `text-mono-sm` misread as a color and deleted, and a
   `leading-none` deleted by the size that follows it. `init` then copies this file from the
   registry instead of writing its own inline string (finding 10).

7. **Size swap in the components.** There are 174 arbitrary pixel sizes and 48 Tailwind default
   steps across the registry and the docs app. The portfolio used this mapping:

   | Before                                   | After                                                        |
   | ---------------------------------------- | ------------------------------------------------------------ |
   | `text-[10px]`                            | `text-mono-xs`                                               |
   | `text-[11px]`, `text-xs`                 | `text-mono-sm` for labels, `text-mono-xs` for group headings |
   | `text-[12px]`                            | `text-mono-sm`                                               |
   | `text-[13px]`, `text-[14px]` in mono     | `text-mono-md`                                               |
   | `text-[13px]` in sans                    | `text-body-md`                                               |
   | `text-sm` on a large button              | `text-body-lg`                                               |
   | `text-2xl` (Card and Dialog titles)      | `text-heading-lg`                                            |

8. **Scale test**, adapted from the portfolio's
   [`lib/type-scale.test.ts`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/lib/type-scale.test.ts),
   over `packages/registry` and `apps/docs`: no arbitrary pixel sizes, no Tailwind default steps
   (`text-xs`, `text-sm`, `text-base`, `text-lg`…), and no numeric `fontSize` above 18 (the
   glyph exception).

9. **Header comment of `globals.css` in English** (finding 8).

**Checklist**

- [x] Surfaces, brand accents and shadows in `:root`, the light block and `[data-surface="dark"]`
- [x] Dark `--fg-muted` set to `#8a8a92` in both dark blocks
- [x] `@theme static` block with the ten steps; `.t-*` removed
- [x] `lib/utils.ts` with `extendTailwindMerge` and the override; `init` copies it from the registry
- [x] `cn` tests ported from the portfolio's `lib/utils.test.ts` (a color and a size survive together; `leading-*` survives a size)
- [x] The 174 pixel sizes and 48 default steps replaced in the registry and the docs app
- [x] Scale test passing over the registry and the docs app
- [x] Docs copy of `globals.css` updated
- [x] `globals.css` header in English
- [x] CLAUDE.md §5 (tokens) and §10 (the `@theme` decision) updated

**Done when** the scale test passes and every new token exists in all three blocks.

**Notes from the work**

- Open decision 4 went with its recommendation: the display steps carry their tracking in the
  token (`--text-display-*--letter-spacing`). A `tracking-*` class at the call site still wins.
- The scale test lives at `packages/registry/styles/type-scale.test.ts`, because the docs app
  has no test runner. It walks the registry and `apps/docs` and skips `*.test.*` files.
- Toast injected its own CSS with 13px and 12px, and the portfolio never moved it. It now reads
  `var(--text-mono-md)` and `var(--text-mono-sm)`.
- The two glyphs in Tabs (`◆` at 9px, `×` at 14px) and the `◆` in the home hero use inline
  `fontSize`, the glyph exception. Diamond replaces them in Phase 3.
- `apps/docs/lib/utils.ts` re-exports `cn` from the registry instead of keeping a copy.
- Card title overrides: 20px moved to `text-heading-md`; 22px and 24px were dropped, since
  the Card default is already `text-heading-lg`. The 48px family samples on the typography
  page and the data Card number moved to `text-display-md`.
- The color foundations page had `fg.muted` as `#71717A`. It now shows `#8A8A92`, with rows for
  `bg.card` and `bg.overlay`. Phase 6 still rewrites the page.
- 375px: the command Button in the Button preview pushed the page into horizontal scroll once
  mono went to 14px. The demo label drops `@latest`. No docs page overflows at 375px now
  (all 27 checked with Playwright).
- `sandbox/wirst-test` is gitignored and was not touched. It carries chart experiments;
  regenerate it with `init --overwrite` when it is next used.

**Visual pass**

- Button md, Input, CommandPalette items and the CodeBlock body: 13 to 14px. Items get about 7%
  wider; check the palette and the CodeBlock at 375px.
- Badge md: 11 to 12px inside `h-6`. Check that uppercase text still breathes.
- Button lg: 14 to 16px (the docs hero buttons).
- heading-md text: 20 to 18px on the foundations pages.
- Muted text across the docs, a little lighter in dark mode.

---

## Phase 2: Accessibility

**Why.** Text on the brand color is where a six-theme system breaks. The color changes per
theme, and no single ink works on all of them. The portfolio measured all 12 combinations and
found failures in every simple approach. This phase brings the measured answer and replaces the
hand-written table with a test that recomputes contrast on every change.

**What changes for users.** Primary buttons, solid badges and the status bar get readable text
in every theme. Brand-colored text gets a token of its own. A few light-mode brand shades shift
slightly. `init` asks whether the project wants one fixed theme or all six, switchable at runtime.

**Technical**

1. **Theme files.** Each `styles/themes/*.css` gains `--fg-on-brand` and `--fg-brand-text`, and
   the light values become the portfolio's. The final table:

   | Theme     | Mode  | `--fg-brand`  | `--fg-brand-hover` | `--fg-on-brand` | `--fg-brand-text` | `--bg-surface-brand`    |
   | --------- | ----- | ------------- | ------------------ | --------------- | ----------------- | ----------------------- |
   | entrepta  | dark  | `#7c6bff`     | `#9b8eff`          | `#09090b`       | `#9b8eff`         | `rgba(124,107,255,.15)` |
   | entrepta  | light | **`#6656ff`** | `#5848e0`          | `#fafafa`       | `#5a4cd6`         | `rgba(102,86,255,.08)`  |
   | blossom   | dark  | `#cc2e36`     | `#e04750`          | `#fafafa`       | `#e8787d`         | `rgba(204,46,54,.14)`   |
   | blossom   | light | `#b02028`     | `#cc2e36`          | `#fafafa`       | `#b02028`         | `rgba(176,32,40,.08)`   |
   | marmalade | dark  | `#ff8213`     | `#ff9d45`          | `#09090b`       | `#ff9d45`         | `rgba(255,130,19,.14)`  |
   | marmalade | light | `#e06800`     | `#ff8213`          | `#09090b`       | `#a14b00`         | `rgba(224,104,0,.08)`   |
   | julia     | dark  | `#e85a8a`     | `#f178a0`          | `#09090b`       | `#f178a0`         | `rgba(232,90,138,.14)`  |
   | julia     | light | `#cc3a6a`     | `#e85a8a`          | `#fafafa`       | `#af325b`         | `rgba(204,58,106,.08)`  |
   | ivy       | dark  | `#35a365`     | `#4cba7c`          | `#09090b`       | `#4cba7c`         | `rgba(53,163,101,.14)`  |
   | ivy       | light | `#258a50`     | `#35a365`          | `#09090b`       | `#1e7142`         | `rgba(37,138,80,.08)`   |
   | bosco     | dark  | `#2563eb`     | `#4f86f3`          | `#fafafa`       | `#6b9bf5`         | `rgba(37,99,235,.14)`   |
   | bosco     | light | `#1d4ed8`     | `#2563eb`          | `#fafafa`       | `#1d4ed8`         | `rgba(29,78,216,.08)`   |

   `--ring` uses the same rgb as `--bg-surface-brand`, at `.5` (entrepta) or `.45` in dark and
   `.4` in light. `#6656ff` is a computed candidate and needs sign-off in the visual pass.

2. **`--fg-brand-text`** is the portfolio's `--fg-brand-on-tint`, generalized: it is the ink
   for brand-colored text on the canvas, on a card _and_ on the brand tint. Measured: at least
   5.7 on canvas and card in all 12 combinations, and at least 5.21 on the tint. `--fg-brand`
   stays for fills, borders, glyphs (`◆`) and large text (3:1, which all 12 clear). entrepta
   ships only the new name.

3. **Contrast test.** Port the portfolio's
   [`lib/color-contrast.ts`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/lib/color-contrast.ts)
   and write `styles/themes.contrast.test.ts`. It reads the six theme files and `globals.css`
   and requires, in all 12 combinations:
   - `--fg-on-brand` against `--fg-brand`: 4.5 or more
   - `--fg-brand-text` against `--bg-canvas` and `--bg-card`: 4.5 or more
   - `--fg-brand-text` against the tint (`--bg-surface-brand` composited over the canvas): 5.0
     or more
   - `--fg-muted` against canvas, card and overlay: 4.5 or more

   This is what replaces the hand-measured table. A copied measurement goes stale the day a hex
   changes, and nothing says so.

4. **Runtime themes in `init`.** A new prompt, and a `--themes=single|all` flag. `single` works
   as it does today. `all` writes the six blocks, rewriting `:root` to `:root[data-theme="<id>"]`
   and `:root[data-mode="light"]` to `:root[data-theme="<id>"][data-mode="light"]`, and keeps the
   chosen theme on bare `:root` as the default. The theme files stay the only source. The choice
   is recorded in `entrepta.json` (`"themes": "single" | "all"`). Watch the specificity: the
   default theme's light block and another theme's dark block tie at (0,2,0), so the output
   order matters. A CLI test pins the order.

5. **Global accessibility CSS**, from the portfolio:
   - `.skip-link`: a mono chip with a `$`, hidden until focused
   - `.focus-ring`: a `box-shadow` ring for bare buttons that survives the `outline` reset
   - an autofill block (`-webkit-box-shadow` inset plus `-webkit-text-fill-color`) so Chrome stops
     painting a white box over the theme

6. **Theme sync in the docs.** Port
   [`lib/theme-sync.test.ts`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/lib/theme-sync.test.ts):
   `THEMES` in `apps/docs/lib/theme.ts` (the swatch colors) must match the theme files.

**Checklist**

- [x] Six theme files with the table above
- [x] `color-contrast.ts` and the contrast test passing in all 12 combinations
- [x] `init --themes=single|all`, with the prompt, `entrepta.json` and tests in `init.test.ts`
- [x] `.skip-link`, `.focus-ring` and the autofill block in `globals.css`
- [x] Docs `THEMES` updated, plus the sync test
- [x] Runtime blocks in `apps/docs/app/globals.css` on the new values
- [x] CLAUDE.md §5: preset table with `--fg-on-brand` and `--fg-brand-text`, and when to use each

**Done when** the contrast test passes in all 12 combinations and a project created with
`init --themes=all` switches themes through the ThemeSwitcher.

**Notes from the work**

- `init --theme=x` with no `--themes` stays non-interactive and writes one theme, so existing
  scripts and the README commands keep working. The themes prompt only appears when neither
  flag is given, and it comes before the theme prompt.
- The scoping lives in `packages/cli/src/utils/themes-css.ts` (`buildThemesCss`), with its
  own tests over the real theme files. The docs runtime blocks were generated with the same
  function, so `apps/docs/app/globals.css` now ends exactly as an `init --themes=all` output
  does. The old hand-written blocks are gone.
- The contrast test (`packages/registry/styles/themes.contrast.test.ts`) also checks
  `--fg-brand-text` on the tint over a card, `--fg-muted` inside `[data-surface="dark"]` on a
  light page, and `--fg-brand` at 3:1 against the canvas. Putting back the old `#6b5bff`
  makes it fail at 4.41, the number in finding 1.
- `color-contrast.ts` lives at `packages/registry/lib/`, with its tests and a hex parser. It
  is not in the CLI manifest yet; the `lib` routing arrives in Phase 4.
- The docs app now has vitest (`pnpm test` runs it through turbo). The theme sync test is
  `apps/docs/lib/theme.test.ts`. Phases 6 and 7 add their tests there.
- The docs skip link uses `.skip-link` now ("skip to content").
- The themes page shows all six tokens per theme and the `--themes=all` command. The CLI page
  lists the flag. The ThemeSwitcher usage snippet has the new light colors and says it needs
  `--themes=all`.
- The theme prompt labels in `init` had em-dashes. They are gone.
- End to end: a copy of the sandbox app, after `init --theme=entrepta --themes=all`,
  switched to ivy, blossom and bosco through the ThemeSwitcher in Playwright. `--fg-brand` and
  `--fg-on-brand` followed each time, in light mode too.
- Still expected: primary buttons in marmalade and ivy light read poorly until Phase 3 moves
  Button onto `--fg-on-brand`.

**Visual pass**

- entrepta light: the new `#6656ff` next to the old violet. The difference is small; the point
  is to confirm it still reads as the brand.
- blossom, marmalade, julia and ivy in light mode: the brand shades move slightly.
- Skip link: Tab on the docs home, in both modes.
- Autofill: fill an Input with Chrome's autocomplete, in dark and light.

---

## Phase 3: Existing components

**Why.** With tokens and inks in place, the existing components start using them. This is also
the phase of the two changes that break the most: the icon swap and the Card.

**What changes for users.** Icons are Phosphor. The Card looks like the portfolio's cards: near
black, a border that lights up on hover, a header that wraps instead of clipping text. Dialog and
palette share one surface. CodeBlock shows when a copy fails. Brand-colored text uses the new
ink.

**Technical**

1. **Phosphor.** Replace `lucide-react` with `@phosphor-icons/react` in `button`, `input`,
   `dialog`, `dropdown`, `code-block`, `command-palette`, `theme-switcher` and `mode-toggle`, and
   in the docs app (`component-preview.tsx`, `[slug]/page.tsx`, `mobile-nav.tsx`,
   `site-command-palette.tsx`). Use the `*Icon` export names, as the portfolio does:
   `Loader2` to `CircleNotchIcon` (with `animate-spin`), `X` to `XIcon`, `Check` to `CheckIcon`,
   `ChevronRight` to `CaretRightIcon`, `Circle` to `CircleIcon weight="fill"`, `Search` to
   `MagnifyingGlassIcon`, `Copy` to `CopyIcon`, `AlertTriangle` to `WarningIcon`, `Sun` and
   `Moon` to `SunIcon` and `MoonIcon`. **Known trap:** a file without `"use client"` imports from
   `@phosphor-icons/react/dist/ssr`. The package root is the client build and calls
   `createContext` at module scope, and `next build` then fails with an error that names no file.
   Update `deps` in the manifest and in the registry's `package.json`.
2. **Diamond.** `content/diamond.tsx`: the `◆` brand mark, always `aria-hidden`, sizes 9 and 10
   (a glyph, off the scale on purpose). It replaces the inline `◆` spans in Card, Dialog,
   ThemeSwitcher and CommandPalette.
3. **Imports across categories.** Card imports Diamond, which lives in another category. In the
   registry that reads `../content/diamond`. In a user project everything lands in
   `components/entrepta/`, so the CLI rewrites `../<category>/<name>` to `./<name>`, and
   `registryDeps` makes sure the file is copied. The docs Manual tab (`readSourceFile`) mirrors the
   rewrite. Phases 4 and 5 rely on this.
4. **Brand as text.** Go through the 13 places in the registry that color text with `--fg-brand`
   or `--fg-brand-hover`. Body-size text moves to `--fg-brand-text` (for example the CodeBlock
   language label, the outline and soft brand Badge). Glyphs, icons, fills, borders and large
   text (24px and up) keep `--fg-brand` (for example `◆`, the `$` prompt, `<em>` inside a Card
   or Dialog title).
5. **Button.** `buttonVariants` in a `button-variants.ts` with no `"use client"`. The manifest
   lists both files. Primary uses `--fg-on-brand`.
6. **Badge.** Solid brand uses `--fg-on-brand`; soft brand uses `--fg-brand-text`.
7. **Dialog.** `--bg-overlay` and `--shadow-overlay`.
8. **CommandPalette.** `--bg-overlay`, `--shadow-overlay`, a `◆` on each group heading through
   `before:` (cmdk owns that element), a `flex-wrap` footer with `// palette`.
9. **CodeBlock.** `copyState: "idle" | "copied" | "error"`, with `WarningIcon`, the text
   `copy failed` and an `aria-label`.
10. **Skeleton.** A `delay` prop, applied negative. The `.skeleton-sweep` class (one band of
    light moving on `transform` over pieces that stand still) goes into `globals.css` for grids
    with hundreds of pieces.
11. **StatusBar.** A `position: "fixed" | "static"` variant (default `fixed`, which the docs use)
    and `--fg-on-brand`.
12. **TopNav.** Logo mark on `--fg-on-brand`.
13. **Card, rebuilt.** Same API, the `.bento-card` look:
    - base: `--bg-card`, `--border-subtle` border, `--radius-lg`, 24px padding (20px below
      640px), `gap-4`, `overflow-hidden`; hover to `--border-strong` and `--bg-card-hover`
      (200ms, `--ease-out`)
    - `size`: `sm` (padding 14, gap 10), `md`, `xl` (`--radius-xl`, 56/48/48 padding, 32/20/28
      on mobile)
    - `variant`: `default`; `featured` (hover to `--border-brand-strong`, a 2px lift and
      `--shadow-lift-brand`); `terminal` (keeps `data-surface="dark"`); `data` (see Open
      decisions, item 2)
    - `CardHeader` takes the `CardHead` overflow contract: `flex-wrap`, `gap-x-3 gap-y-1`, each
      half `whitespace-nowrap`, uppercase `text-mono-sm`. It also takes an `as` prop (`span`,
      `h2`, `h3`) for heading semantics
    - `CardLabel` uses `<Diamond />`
    - `CardFooter` gets `flex-wrap` and `mt-auto`; `CardComment` renders `//` at 60% opacity
14. **Manifest.** Remove `lucide-react` from `tabs` (finding 5).

**Checklist**

- [x] Phosphor in 8 registry files and 4 docs files; `lucide-react` removed everywhere
- [x] No file without `"use client"` imports the Phosphor root (a grep test)
- [x] Diamond, and the cross-category import rewrite in the CLI and the Manual tab, with tests
- [x] The 13 brand-as-text sites sorted into `--fg-brand-text` or `--fg-brand`
- [x] Button with `button-variants.ts`; manifest lists both files
- [x] Badge, Dialog, CommandPalette, CodeBlock, Skeleton, StatusBar and TopNav as above
- [x] Card rebuilt, with tests for `size`, `variant`, `as` and the overflow contract
- [x] Existing tests updated (the ones that assert classes or icons)
- [x] CLAUDE.md §2 (Phosphor instead of lucide) and §7 (Card)

**Done when** no source file imports `lucide-react` and the docs Cards have the bento look.

**Notes from the work**

- The registry typecheck moved from `NodeNext` to `moduleResolution: "Bundler"`. Phosphor's
  `index.d.ts` re-exports extensionless paths, which NodeNext cannot resolve inside an ESM
  package, so every `*Icon` name read as missing. User projects consume these files through a
  bundler, so this matches them.
- Phosphor icons take `size` instead of the old `width`/`height`/`strokeWidth` style. The radio
  dot is `CircleIcon weight="fill"`. Tests find icons by a `data-icon` attribute instead of
  lucide's class names.
- The source rules test (`packages/registry/test/source-rules.test.ts`) covers the registry and
  the docs app: the Phosphor root only from client files, and no `lucide-react`.
- Two manifest tests were added in the CLI. Every import across registry folders must be
  covered by `registryDeps` (transitively), and every npm package a file imports must be in
  `deps`. The second one caught StatusBar, which now uses cva.
- End to end: in a copy of the sandbox app, `add card dialog button theme-switcher
  mode-toggle` brought `diamond.tsx` and `button-variants.ts` along with the imports rewritten
  to `./diamond`, and `next build` passed.
- Brand as text in the registry: CodeBlock's language label, soft and outline brand Badge, and
  Toast's action moved to `--fg-brand-text`. Diamond, the palette heading `◆`, the Input `$`,
  the Button command `$`, icons, and `<em>` in Card and Dialog titles (24px) keep `--fg-brand`.
- `CardLabel` takes `as`, not `CardHeader`. In the portfolio the heading is the label; making
  the whole header a heading would put the meta inside it.
- Card no longer has `"use client"`; nothing in it needs the client.
- The terminal Card sets its own text color. `color` inherits as a computed value, so on a
  light page the terminal body inherited near-black text. This fixes the bug the baseline
  recorded.
- The `data` Card variant is kept as it was (open decision 2). It still needs a look in the
  visual pass.
- Not in the plan, fixed while there:
  - The Dialog close button drew its focus with `outline`, which the global reset removes from
    every button, so it had no visible focus. It uses `.focus-ring` now.
  - Solid status Badges used `--bg-canvas` as ink, which fails in light mode (2.1 to 2.9:1),
    and solid error used `--fg-primary`, which fails in dark mode (3.52). All four use
    `--zinc-950` now, which clears 5.4 to 9.3 on every status color in both modes.
  - CodeBlock reported "copied" even with no clipboard. The failure state fixes that, and the
    old test that locked it in was changed.
  - The portfolio's `.skeleton-sweep` moved from `-45%` to `145%`, and transform percentages are
    of the band, so it never fully left the card. It runs from `-100%` to `167%` here.
- StatusBar was already hidden below 640px in the registry (`hidden sm:flex`), so open decision
  6 started from a wrong premise. Decided: it stays hidden; a project that wants it on phones passes
  `className="flex"`, which the docs preview now does. The docs previews use
  `position="static"` instead of five override classes.
- Tabs keeps its inline `◆` until Phase 5 turns it into TabStrip.
- Diamond has no docs page yet. That comes in Phase 6 with the other new items.

**Visual pass**

- Every swapped icon: the Button spinner, the Dialog close, the Dropdown check and caret, the
  Input search, the ThemeSwitcher sun and moon. Phosphor draws a different stroke; check whether
  any needs `weight="bold"`.
- Card: the docs home and foundations pages use it in dozens of places. Cards go from `#18181b`
  to `#0b0b0e`; check that borders still separate them from the canvas in both modes. Check the
  hover, the `featured` (3 uses) and `data` (2 uses) variants, and a CardHeader with a long label
  and meta at 375px.
- CommandPalette and Dialog open one after the other: the same surface.
- StatusBar in all 12 combinations: the text on the brand.
- The CodeBlock language label and brand Badges in blossom dark and marmalade light.

---

## Phase 4: Motion

**Why.** The current principle is "subtle motion, or none", and entrepta barely moves. The
portfolio showed that entrances, counters and light can work without turning into a demo reel,
as long as a few rules hold. Each of those rules was written after a real bug: an animation
playing perfectly to an empty room, a spring that froze after a hover, a heading shipped empty to
crawlers.

**What changes for users.** Five motion components and a small lib arrive. Installing one of them
brings `motion` as a dependency; the rest of the system does not need it. Everything respects
`prefers-reduced-motion`, including what is animated through JS, which the global CSS reset
cannot reach.

**Technical**

1. **Dependency.** `motion` ^12 in the registry's `package.json` (for tests and typecheck) and in
   the `deps` of each motion item in the manifest.
2. **`lib/motion.ts`.** `EASE_OUT = [0.2, 0.8, 0.2, 1]` (the `--ease-out` token as an array),
   `revealViewport = { once: true, amount: 0.25 }`, `STAGGER_LIMIT = 6`.
3. **CLI routing for `lib`.** `add` routes only to `components` and `hooks` today. It needs to
   route `lib/*.ts` to `aliases.lib` (already in the `entrepta.json` schema), rewrite
   `from "../lib/motion"` to that alias, accept `category: "lib"` and `category: "motion"` in
   `types.ts`, and keep `lib` items out of the interactive picker, as it does for hooks. Tests in
   `add.test.ts`.
4. **Components**, each one calling `useReducedMotion()`:
   - `Reveal` and `useReveal`: `whileInView` with `once`, never `animate`, even above the fold.
     `y: 14` to `0`, 0.5s, staggered by `index` and capped at `STAGGER_LIMIT`.
   - `TypeIn`: all of the text is in the DOM from the first render. The pieces are `aria-hidden`
     and an `sr-only` copy carries the sentence (not `aria-label`, which a `span` with no role
     ignores). `by="word"` for anything that wraps. An `emphasis` prop instead of arbitrary
     children.
   - `RollingNumber` and `useRollOnHover`: a 0 to 9 strip printed twice; the stagger delay only
     applies to the entrance.
   - `Spotlight` and `useSpotlight`: moves a fixed gradient with `transform` (it never rebuilds
     the gradient string per frame), on a 60/20 spring, colored by `--bg-spotlight`.
   - `ArrowLink` and `ArrowAffordance`: an arrow that travels and a brand rule that wipes in from
     the left, mirrored on `focus-visible`. The portfolio's uses `next/link`; the registry's
     renders an `<a>` and accepts `asChild` (Radix Slot), with no `next/*` import.
5. **Motion CSS** in `globals.css`: the `cursor-blink`, `type-in`, `type-fade`, `load-dot`,
   `skeleton-sweep`, `dot-glow` and `live-pulse` keyframes, and the `.type-line`, `.type-fade`,
   `.type-caret` and `.type-late` classes, with the reduced-motion block that zeroes their delays
   (except `.type-late`, whose delay measures the wait rather than choreographing it).
6. **Test setup.** Mocks for `IntersectionObserver` and for a reduced-motion `matchMedia` in
   `test/setup.ts`.
7. **Principle 6, rewritten** (finding 11). Proposal: _"Motion with a job. Entrances, counters and
   light that follows the cursor, each one earning its place. Every animation has a
   reduced-motion path, including the ones driven by JS."_ It changes in CLAUDE.md §4 and on the
   home page.

**Checklist**

- [x] `motion` as a dependency; `lib/motion.ts`
- [x] CLI: `lib` and `motion` categories, routing to `aliases.lib`, import rewrite, tests
- [x] Reveal, TypeIn, RollingNumber, Spotlight and ArrowLink, each with tests
- [x] Every test covers reduced motion, and (TypeIn, RollingNumber) the real text in the DOM
- [x] No `next/*` import anywhere in the registry (a grep test)
- [x] Motion CSS in `globals.css` and the docs copy
- [x] Principle 6 rewritten in CLAUDE.md

**Done when** `entrepta add reveal` in a clean project copies `reveal.tsx` and `lib/motion.ts`,
installs `motion`, and the build passes.

**Notes from the work**

- `motion` 13 came out during this work, and the CLI installs deps by bare name, so the test
  project got 13.4.4. The registry moved to `motion` ^13 too: its only breaking change is
  dropping the optional `@emotion/is-prop-valid` dependency, which entrepta does not use, and
  typecheck and all 297 registry tests pass on it. The manifest keeps deps without versions,
  the same model as shadcn: a copied component is the user's code, and the latest release is
  what they get.
- Manifest names: `motion-lib` (`lib/motion.ts`) and `color-contrast` (`lib/color-contrast.ts`)
  are `lib` items. They go to the `lib` alias and stay out of the interactive picker, together
  with hooks. The picker listed hooks before, and its labels had an em-dash; both are fixed.
- `../lib/<name>` is rewritten to the `lib` alias (`../lib/utils` still goes to the `utils`
  alias).
- ArrowLink has no `"use client"`, imports its icons from `@phosphor-icons/react/dist/ssr`, and
  renders an `<a>` or, with `asChild`, the router link passed in (the affordance goes inside
  it). Its hover color is `--fg-brand-text`, since the label is 12px. It needs no `motion`.
- TypeIn's emphasis uses `--fg-brand-text`, the same ink `<Em>` gets in Phase 5.
- RollingNumber also accepts a formatted string (`"1,024"`): characters that are not digits
  stay still.
- `.skeleton-sweep` came in Phase 3. `dot-glow` lost the portfolio's `--fg-brand-pulse` fallback,
  which nothing in entrepta sets.
- Test setup: `test/media.ts` gives a `matchMedia` whose reduced-motion answer a test can flip
  (`setReducedMotion`), and an `IntersectionObserver` that reports everything in view. Reveal's
  stagger cap is tested by capturing the delay it hands to Motion.
- End to end, in a copy of the sandbox app: `add reveal type-in rolling-number spotlight
  arrow-link` brought `lib/motion.ts` to `lib/` with the imports pointed at `@/lib/motion`, and
  `next build` passed. In Playwright, with and without reduced motion, the Reveal and every
  TypeIn piece ended visible, and the server HTML already had the sentence and the number in
  their `sr-only` copies. Spotlight followed the cursor, and stayed at rest with reduced motion.
- The docs app does not import the motion components yet. Their pages and previews come in
  Phase 6, and `motion` joins the docs dependencies then.

**Visual pass**

- Every component with and without reduced motion (macOS: Accessibility, Display, Reduce motion).
- TypeIn: a long sentence with `by="word"` at 375px; it should wrap where words end.
- Spotlight: sweep the cursor fast across a card while a RollingNumber runs on the same page;
  the counter must not stall.

---

## Phase 5: New components

**Why.** The portfolio built forms, error and loading screens, document pieces and a full editor
chrome (tabs, side rail, outline). That is the IDE metaphor entrepta promises, and today entrepta
only ships its status bar and top nav.

**What changes for users.** Twelve new items, including a full form kit (Switch, Textarea,
Field), ready-made 404, error and loading screens, and the editor frame (Titlebar, Sidebar,
PageOutline). Tabs get the brand underline that travels between tabs.

**Technical**

1. **Framework agnostic.** Nothing in the registry imports `next/*`. Where the portfolio uses
   `Link` or `usePathname`, the registry takes `asChild`, a `renderLink`, or an `active` flag per
   item. What counts as a route stays in the user's project.
2. **Forms and states**
   - `Switch`: a native `<input type="checkbox" role="switch">`, styled with `peer-*`
   - `Textarea`: Inter (it holds prose), mono placeholder, an error state
   - `Field`, `FieldLabel` (with `◆` and a required `*`), `FieldError` (`role="alert"`, `//`)
   - `ChromeMessage`: a `$ command`, an optional output line, a serif title, a `//` note and an
     action; `accent: "brand" | "error"`. No hooks, so it works in a server component. A Next.js
     error boundary built on it becomes a docs recipe, not a component
   - `PageLoading`: CSS only, no JS. The text is in the DOM from the first byte, and the "still
     loading" lines only appear if the wait passes 2.2s
3. **Small pieces**
   - `SectHead`: the `$ command` with a dashed rule and meta on the right, with a wrap contract
   - `doc-parts`: `DocLabel` (`#` and `##`), `Section`, `DisplayH2`, `Prose`, `Em`, `Strong`.
     `Em` uses `--fg-brand-text`, not `--fg-brand` (finding 2)
   - `use-url-filter` and `FilterPill`: `useSyncExternalStore` instead of `useSearchParams`, so
     the content is in the prerendered HTML. `pushState`, keeping the other query params
4. **Editor chrome**
   - `Tabs` and `TabStrip` merged: Radix for tabs that switch a panel in place, `asChild` for
     route tabs; a scroller that fades only where content is hidden, a brand underline that
     travels (`layoutId`), an icon that fills when active, a `×` on the active tab, and a height
     of its own (outside a titlebar the strip used to collapse)
   - `Sidebar`: a 56px rail, the logo, icons with a `◆` that travels to the active item; takes
     `items` and `active`
   - `PageOutline`: an IntersectionObserver scrollspy, sticky from 1100px up; the scroll
     container comes in as a prop
   - `Titlebar`: decorative traffic lights, a `TabStrip`, meta on the right, 40px tall
5. **Every new item** goes into the manifest, has tests, and gets a docs page. The page is
   written in Phase 6, but per CLAUDE.md §11 the item is not done until the page exists.

**Checklist**

- [x] Switch, Textarea, Field
- [x] ChromeMessage, PageLoading (with the `.type-*` CSS from Phase 4)
- [x] SectHead, doc-parts
- [x] use-url-filter and FilterPill
- [x] Tabs with the TabStrip look
- [x] Sidebar, PageOutline, Titlebar
- [x] Manifest: every item with `files`, `deps` and `registryDeps`
- [x] CLAUDE.md §3 and §7 (structure and inventory)

**Done when** a test project assembles a page with Titlebar, Sidebar, PageOutline, a Card with
Reveal and a form with Field, all installed through the local CLI.

**Notes from the work**

- Routes: single-link components take `asChild` (ArrowLink, TabNavLink), lists of links take a
  `linkComponent` (Sidebar), and which item is current is always an `active` prop. Nothing in
  the registry imports `next/*`, and open decision 7 needed no fallback.
- Tabs: the Radix API stays (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) for tabs that
  switch a panel. `TabNav` and `TabNavLink` are the route flavor, a `<nav>` landmark with
  `aria-current="page"`. Both share the fade-only-where-hidden scroller, one `layoutId`
  underline, the ◆ when there is no icon, and an icon that fills when it is a Phosphor
  component. `Tabs` keeps its own copy of the value in a context, so the underline knows which
  tab is active. The × is now a sibling button with a name ("Close home.tsx"), shown on the
  active tab only. Before, it was a `span role="button"` nested inside the trigger. Tabs now
  depends on `motion`, and the docs app has `motion` too.
- Field clones its one control to add `id`, `aria-describedby` (the error, or else the hint) and
  `aria-invalid`. Props already on the control win. The portfolio left that wiring to each
  call site.
- The Switch knob uses `--fg-on-brand` when checked. The portfolio used `--bg-canvas`, which
  flips with the mode instead of following the brand.
- FilterPill styles its pressed state with `aria-pressed:` utilities, not inline styles.
- `use-url-filter` writes to the current path by default; the portfolio needed a `basePath`.
- doc-parts has no built-in `Reveal`, so installing it does not pull in `motion`. `DisplayH2`
  sits on `text-display-md`, instead of the portfolio's `size` and `margin` props that recorded
  three pages drifting apart. `Section` takes `variant="first"` through cva instead of a
  boolean. MetaGrid, MetaCol and Kbd stay in the portfolio.
- PageOutline takes `scrollContainer` and falls back to the window, and a jump updates the hash.
  Found in the end-to-end run and fixed: a short last section never reached the scrollspy's
  band, so clicking "contact" scrolled there and then lit "work". Once the scroll bottoms out,
  the last section in view is current. The portfolio has the same bug.
- Titlebar's window dots are plain spans, hidden from screen readers. The portfolio's were
  `aria-hidden` buttons with an easter egg.
- End to end, in a copy of the sandbox app: every Phase 5 item came in through `add`, with
  `diamond`, `motion-lib` and the imports resolved on their own. An `/editor` page with
  Titlebar, TabNav, Sidebar, PageOutline, SectHead, FilterPill with `use-url-filter`, Cards
  with Reveal and a Field form rendered in both modes at 1440px and 375px. Playwright
  confirmed the outline hides below 1100px, no horizontal overflow at 375px, the Field wiring,
  `?type=film` after the pill, and a 404 through ChromeMessage. There were no console errors
  once the app's `<html>` had `suppressHydrationWarning`. That attribute is needed wherever
  ThemeScript or ModeScript runs, and the Phase 6 docs say so.

**Visual pass**

- Tabs: the underline traveling between tabs, the fade only where tabs are hidden, the `×`.
- Sidebar: the `◆` moving to the active item; at 375px the rail takes 56px of the width.
- PageOutline: hidden below 1100px; the scrollspy follows the scroll.
- Field with an error in dark and light: `--status-error-fg` on the card.

---

## Phase 6: Documentation

**Why.** The docs site is entrepta's showcase, and it still shows the May system: foundations
with the old values, no usage rules, no accessibility page. The portfolio wrote the system's most
useful rules into its own CLAUDE.md, where entrepta users never see them.

**What changes for users.** A page for every new component. Rewritten foundations, with the
contrast of each token computed live for the selected theme. Rules and accessibility pages. A
v2 migration guide.

**Technical**

1. **Foundations**
   - **Color:** the surfaces (canvas, card, surface, overlay, and when to use each), the brand
     accents and the inks (`--fg-on-brand`, `--fg-brand-text`), with contrast computed live
     against what each ink actually sits on. The model is the portfolio's
     [`components/showcase/tokens-section.tsx`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/components/showcase/tokens-section.tsx),
     using `color-contrast.ts`
   - **Typography:** the ten steps, the "a token is a size, the family stays at the call site"
     rule, and why the scale is registered in `cn`
   - **Motion:** tokens, rules and the five components
   - **Accessibility** (new): inks and the numbers the contrast test measures, focus, the skip
     link, reduced motion (CSS and JS), `sr-only` patterns (TypeIn, RollingNumber), and
     `aria-hidden` glyphs
   - **Rules** (new): the do and don't list from the portfolio's
     [`lib/design-tokens.ts`](https://github.com/imnotannamaria/anna.maria.dev/blob/50c055f/lib/design-tokens.ts),
     plus the card rules (the overflow contract, and that a card clips without an ellipsis)
2. **One source for the rules.** `apps/docs/lib/rules.ts` feeds the Rules page _and_ the
   AGENTS.md generator in Phase 7, so the two cannot drift.
3. **Component pages.** One for each item from Phases 3 to 5, with a preview in
   `component-preview.tsx`, and a Next.js error boundary recipe on the ChromeMessage page.
4. **Brand as text in the docs.** Sort the 63 places in the docs app that color text with the
   brand, with the same rule as Phase 3 (finding 2). The eyebrow labels such as "· getting
   started" are small text and move to `--fg-brand-text`.
5. **Docs sidebar.** New sections: Motion, Forms, and the chrome under Layout.
6. **`globals.css` sync.** A test that compares `apps/docs/app/globals.css` with the registry's,
   ignoring only what belongs to the docs (the extra `@source` and the runtime theme blocks)
   (finding 7).
7. **Migration guide** (`/docs/migrating-to-v2`): old sizes to scale steps, lucide to Phosphor
   names, the Card (what changed in the API and the look), `--bg-canvas` as ink to
   `--fg-on-brand`, `--fg-brand` as body text to `--fg-brand-text`, `.t-*` to utilities.
8. **README** with the counts, the icons and the motion dependency.

**Checklist**

- [x] Color, Typography and Motion rewritten; Accessibility and Rules added
- [x] `lib/rules.ts` as the single source
- [x] A page for every new component, with a preview
- [x] The 63 brand-as-text sites in the docs sorted
- [x] Docs sidebar with the new sections
- [x] `globals.css` sync test
- [x] Migration guide
- [x] README

**Done when** every manifest item has a page, and the Accessibility page shows the same numbers
the test measures.


**Notes from the work**

- Phase 7's "one manifest" moved here, because every new page would otherwise have been
  written into six lists. The manifest is `packages/registry/manifest.ts`; the CLI imports it
  by package name and tsup bundles it (`noExternal`), so the published CLI does not load
  TypeScript at runtime. The docs derive the install command, the npm deps (transitively) and
  the Manual tab files from it. That also fixed a coupling: the Manual tab used to build the
  file path from the docs category, which Forms and Motion would have broken.
- Docs data is split in two: `lib/component-index.ts` (slug, title, section, and the whole docs
  nav), small enough for the client sidebar, mobile menu and palette; and `lib/components.ts`
  (description, usage, props), server only. Sections: Primitives, Forms, Layout, Content,
  Feedback, Motion. Input moved to Forms.
- Tests in the docs app: every manifest component has an index entry, page text and a preview;
  nothing has a page the CLI cannot install; every hook and lib file is reached through some
  component; every component is in the nav; every nav page is in the sitemap; and globals.css
  matches the registry's apart from the docs-only `@source` and runtime themes. That sync test
  caught two comment lines Phase 1 had dropped.
- Hooks and lib files are documented on the pages of the components that pull them in
  (`use-url-filter` on FilterPill, `motion-lib` on Motion, `color-contrast` on Accessibility)
  rather than on pages of their own.
- The Color page and the Accessibility page read tokens live and measure contrast with the
  registry's `color-contrast.ts`, for the theme and mode in use. With reduced motion the
  numbers were blank: the reset gives every element a 0.01ms transition, so the probe was read
  mid-transition. The probe now has `transition: none !important`.
- Brand as text in the docs: 70 sites today. 25 moved to `--fg-brand-text` (eyebrows, small
  labels, links, flags, prop names, code in previews). The rest keep `--fg-brand`: `$`, `◆`,
  `//` and arrows, `<em>` in large titles, and the logo's dot.
- Found in the visual pass and fixed:
  - Field marked its control `aria-invalid`, but Input and Textarea only turned red through
    `state="error"`. Both now style `aria-invalid` too (Input through `has-[...]` on its
    wrapper), and `state="error"` sets `aria-invalid`.
  - The status inks (`--status-*-fg`, the 400s) were never redeclared for light mode, where
    they measure 1.6 to 2.9 on white: soft Badges, Toasts, FieldError and the ChromeMessage
    error prompt all failed. Light mode now uses emerald-700, amber-800, rose-700 and
    indigo-700, `[data-surface="dark"]` restores the 400s, and the contrast test checks each
    status ink on the canvas, a card and its own soft tint in all 12 combinations. The
    portfolio has the same gap.
- The scale test reads the docs source too, so size examples cannot be written literally.
  `lib/rules.ts` escapes them inside a plain string; the migration guide builds them by
  interpolation, because Biome's formatter undoes escapes in template literals.
- Theme scripts need `suppressHydrationWarning` on `<html>`: now said on the Accessibility,
  ThemeSwitcher and ModeToggle pages and in the migration guide.
- Visual pass, automated part: every sitemap page (47) at 375px in both modes, with no overflow
  and no errors beyond the Vercel Analytics script, which only exists on Vercel. The
  person-looking part is still open.
- Left for Phase 7: the home page still has em-dashes in three strings and in the install
  snippet.
**Visual pass**

- The foundations pages in all 12 combinations; the live numbers change with the theme.
- Every new preview at 375px.

---

## Phase 7: Home page and the AGENTS.md configurator

**Why.** The home page is the first impression, and today it promises things v2 changes: "no
springy theatrics", a wrong component count, hardcoded color swatches. And anyone using entrepta
with a coding agent needs to give that agent the system's rules. Today that means reading the
whole docs site and summarizing it by hand.

**What changes for users.** The home page shows the system in motion, with the new components.
It also gains a section where you assemble the AGENTS.md for your own project and copy it in one
click.

**Technical**

1. **Home page.**
   - `HERO_STATS` and the per-category counts come from the manifest (finding 6)
   - principles 04 and 06 rewritten (darker zinc, and the motion principle from Phase 4)
   - theme swatches read from `THEMES`, not from a hex array
   - cards on the new Card, with Reveal on the entrances and Spotlight where it fits; the hero
     text stays in the server HTML
2. **One manifest.** Move the manifest to `packages/registry/manifest.ts`. The CLI already
   depends on `@entrepta/registry`, and so does the docs app, so neither needs a new dependency.
   The docs component lists (`app/docs/components/page.tsx` and
   `app/docs/components/[slug]/page.tsx`) derive from it. Each entry gains a `usage` field with a
   one-line snippet.
3. **AGENTS.md configurator**, in its own home page section (`#agents`):
   - **Choices:** framework (Next.js App Router, Next.js Pages, Vite), theme (6), default mode,
     fixed or runtime themes, package manager (npm, pnpm, yarn, bun), components (checkboxes by
     category, from the manifest, with `registryDeps` checked automatically), and the file name
     (`AGENTS.md` by default, or `CLAUDE.md`)
   - **Output:** a live preview in a CodeBlock; copy and download buttons with visible success
     and failure states (the CodeBlock pattern from Phase 3)
   - **State in the URL**, through `use-url-filter` from Phase 5, so a configuration can be
     shared as a link
   - **Pure generator:** `apps/docs/lib/agents-md.ts`, `buildAgentsMd(options): string`.
     Sections: what entrepta is; install commands for the chosen package manager (`init
     --theme=… --themes=…`, `add …`); where files land; token rules (never a hex, `color-mix`
     from `--fg-brand`, which ink goes on which background, card versus surface versus overlay);
     the type scale; motion rules (**only** if a motion component was picked); accessibility;
     a cheat sheet for each picked component (import and a one-line usage); and what the tests
     cannot see
   - **Real controls:** `<input type="checkbox">` and `radio`, a `fieldset` and `legend` per
     group, and the result announced by a short `aria-live` region ("AGENTS.md updated, 7
     components")
4. **Generator tests.** A snapshot per framework; the generated component list matches the
   manifest; no hex in the output; the motion section only appears with a motion component.

**Checklist**

- [x] Stats and counts from the manifest; principles 04 and 06; swatches from `THEMES`
- [x] Home cards on the new Card, with Reveal and Spotlight
- [x] Manifest moved into the registry, with the `usage` field; docs component lists derived from it
- [x] `buildAgentsMd` and its tests
- [x] `#agents` section with controls, preview, copy and download
- [x] State in the URL
- [x] Metadata, and the section's text in the server HTML

**Done when** an AGENTS.md generated for Vite, pnpm, ivy and three components, pasted into a
clean project, lets an agent install and use those components without opening the docs.


**Notes from the work**

- The manifest moved in Phase 6. Here it gained `usage` (one line of JSX) and `exports` (what
  each component's files export, for the import lines). A CLI test checks both: every
  component has them, hooks and lib files do not, and `exports` matches the files exactly.
- Home: hero stats come from the component index, the theme list and a token count read from
  the registry's `globals.css` at build time (93, where the old page said 69). The "what's
  inside" grid is one card per docs section, named and counted from the index, plus a themes
  card painted from `THEMES`. Principles 04 and 06 are rewritten. Cards enter with Reveal; the
  closing card has the Spotlight. The hero and every section's text are server HTML.
- Found and fixed on the home page: links wrapped buttons (`<a><button>`), which is invalid
  and reads badly in screen readers. They are links styled with `buttonVariants`, the reason
  that file has no `"use client"`. Versions said v1.0; they say v2.0.
- Configurator (`#agents`): radio groups and checkboxes in fieldsets with legends; components
  that a picked one needs are checked, locked, and say which one needs them; a short
  `aria-live` line announces the count; the preview is a CodeBlock (its copy button has the
  failure state), and download shows done or failed. The choices live in the URL through
  `use-url-filter` for each single choice and a list hook with the same pattern for
  components, so a configuration is a link. The server renders the default configuration, so
  the generated text is in the HTML.
- Found through the "Done when" test, which followed a generated Vite file in a clean
  `create vite` project, with the local CLI standing in for the unpublished v2:
  - The CLI wrote hooks and lib files to the project root in Vite projects while the imports
    pointed at `src/` (and the components alias read `@/src/components/...`). `init` now
    records `srcDir` in `entrepta.json`, aliases are relative to it, and `add` resolves them
    through it. Old configs without `srcDir` keep working. Tests cover both.
  - The file did not say entrepta needs Tailwind v4, or how to add it per framework. It does
    now, with the exact Vite alias config.
  - Field's usage line used Input, which may not be installed. It uses a native input.
  After that, the Vite app built (typecheck included) and rendered with the ivy brand and the
  scale in place.
- A test now keeps CLAUDE.md and AGENTS.md identical apart from the lines that name the agent,
  and AGENTS.md is committed.
**Visual pass**

- The whole home page in dark and light, with and without reduced motion.
- The configurator at 375px: the component checkboxes and the preview.
- Copying from a non-secure origin shows the failure state. `localhost` counts as secure, so
  open the dev server over plain http on a LAN IP.

---

## Phase 8: Release and adoption

**Why.** v2 is done when it is published, recorded in the repo's own docs, and in use in the
project it came from.

**Checklist: release**

- [x] Changesets: major for `@entrepta/registry` (1.2.0 to 2.0.0) and `@entrepta/cli` (1.1.0 to
      2.0.0), summarizing the breaking changes and linking the migration guide
- [x] entrepta's CLAUDE.md: §2 (Phosphor, motion), §3 (the `motion/` folder, the manifest), §4
      (principle 6), §5 (tokens and inks), §7 (inventory), §10 (decisions: `@theme static`,
      motion as a dependency, Phosphor, a framework-agnostic registry, imports across
      categories, runtime themes in `init`, `--fg-brand-text`). Kept up to date phase by phase,
      and AGENTS.md mirrors it under a sync test
- [ ] `v2` into `main` through a reviewed PR
- [ ] After the merge: check the "Version Packages" PR and the npm publish

**Checklist: adoption in the portfolio**

- [ ] Replace its copies under `app/components/entrepta/` with v2 (`entrepta add --overwrite` or
      by hand), and point its local pieces at the ones that now live in entrepta
- [ ] Rename `--fg-brand-on-tint` to `--fg-brand-text`
- [ ] entrepta light to `#6656ff`

---

## Open decisions

Smaller than the ones above, each with a recommendation.

1. **Fonts.** The registry uses a Google Fonts `@import`, which works in any framework. The
   portfolio uses `next/font`, which avoids a render-blocking request. _Recommendation:_ keep
   the `@import` in the registry and document `next/font` for Next.js projects, with a ready
   snippet.
2. **The Card `data` variant.** It has 2 uses in the docs and no counterpart in the portfolio.
   _Recommendation:_ keep it in v2, restyled on the new tokens.
3. **The animated border as a Card variant.** The portfolio's roadmap cards run a light around
   their border on hover (`@property` plus a `conic-gradient`). That is a card animation, not
   something specific to a roadmap. _Recommendation:_ a `live` Card variant in a minor release
   after v2, outside this plan.
4. **Display tracking in the token.** Tailwind v4 accepts `--text-display-xl--letter-spacing`;
   the portfolio sets the tracking at the call site. _Recommendation:_ put it in the token. The
   old `.t-display-*` classes carried it, and it gets lost if it lives at the call site.
5. **Hover direction in light mode.** In entrepta light the brand darkens on hover; in the other
   five it lightens. _Recommendation:_ make them consistent, and let the contrast test decide
   which direction passes.
6. **StatusBar below `sm`.** The portfolio hides it on phones. _Recommendation:_ entrepta shows
   it at every width, and a project that wants it hidden passes a class.
7. **Framework-agnostic chrome.** If Titlebar and Sidebar get too complex without `next/*`, the
   fallback is to ship both as Next.js only, with a note. _Recommendation:_ try agnostic first and
   decide in the Phase 5 PR.
8. **Next.js 16 in the docs app.** The docs run on 15 and the portfolio on 16.
   _Recommendation:_ a separate PR after v2.
9. **`motion` 13.** Decided: migrate now. See the Phase 4 notes.
10. **Version ranges for deps.** Decided: no versions. The CLI installs the latest release of
    each dep, as shadcn does. The trade-off is that a future major can reach users before the
    registry is tested on it, so a major bump of a dep is worth a quick registry run.

---

## Review round 1 (after Phase 8, from Anna's visual pass)

- [x] Checkbox component, native input, drawn check, description, indeterminate
- [x] AGENTS.md configurator moved out of the home page into a dialog opened from the header,
      kept in `?agents=open` so the link still shares; old `#agents` links still open it
- [x] Docs sidebar: gap between items, hover on a quieter surface than the active item
- [x] Button: icon sizes (`icon-sm`, `icon-md`, `icon-lg`) and icon demos. Badge: `icon` prop
- [x] Dropdown on the overlay surface; the highlighted row takes the brand tint, no edge bar
- [x] Tabs: icon demos with the grow on hover (`scale-115`, as in the portfolio)
- [x] Autofill: reproduced with CDP `Autofill.trigger`. The filled state was already right;
      `:root` now declares `color-scheme: dark` and the autofill rule holds Chrome's fill off
      with a long transition, for the states the inset shadow cannot paint
- [x] Titlebar folded into the tabs as `variant="window"`
- [x] Diamond has no docs page; it arrives with the components that use it
- [x] Toast rebuilt on unstyled sonner: icon tile and corner glow per status, close button
- [x] More room at the end of docs pages and of the sidebar
- [x] Home hero rebuilt: a working editor window made of the components, live theme swatches
- Found on the way: `animate-in` and friends were dead classes (no animation plugin), so no
  overlay animated. Replaced by `motion-fade` and `motion-pop` in `globals.css`. `useTheme`
  instances now stay in step, so the hero swatches and the floating switcher agree

## Review round 2

- [x] AGENTS.md dialog went blank on picking a file name: focusing a hidden radio scrolled the
      clipped frame. Radios stay inside their labels and the frame uses `overflow: clip`
- [x] Overlay family: CommandPalette, Tooltip and the ThemeSwitcher panel follow the Dropdown
      and the Toast. Same surface, same rows, same highlight, `test/overlay-family.test.ts`
- [x] Kbd primitive for every keyboard hint
- [x] ThemeSwitcher and ModeToggle previews show the real components, not copies
- [x] One focus style: `.focus-ring` on the CodeBlock copy button, an inset brand ring on tabs

---

## Out of scope

- UI sound effects
- A Next.js error-boundary component (documented as a recipe on the ChromeMessage page instead)
- The generated cover art and the feed shell from the portfolio
- Pieces that belong to the portfolio as a site: the piano, the activity ring panel, the log
  shelf and rail, the roadmap stepper and cards, the file tree card
- New CLI commands (`entrepta agents`, `diff`, `theme`)

---

## Risks

- **A lot of breaking change at once.** Icons, the Card, sizes and tokens all move together.
  Mitigation: the integration branch, the migration guide and an explicit major.
- **Visual regressions no test catches.** Mitigation: the Phase 0 screenshots and a visual pass
  per phase. No phase is done without its pass.
- **Phosphor and the Next.js build.** Importing the package root from a server file breaks the
  build without naming the file. Mitigation: the grep test in Phase 3.
- **Framework-agnostic chrome costs more than expected.** Mitigation: open decision 7, made in
  the PR rather than up front.
