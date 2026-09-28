# entrepta

> Project context for Claude Code. Read this file before any task in this repo.
> Keep it updated when decisions change.

---

## Rules

- You can commit, but never push.
- Before committing, run lint, typecheck, tests and build. All must pass.
- Commit messages in English, following `feat(package): message`.
- Copy written for users (docs pages, labels, CLI output) is English only,
  short sentences, no em-dashes.

---

## 1. What entrepta is

entrepta is a design system and copy-paste component library, same model as
shadcn/ui. It is Anna Maria's personal design system, shipped as a public
open source library (MIT).

The difference from shadcn is personality. entrepta is dark-first with an IDE
metaphor: tabs, command palette, status bar, file paths, shell prompts, inline
comments. Editorial typography (serif italic) mixed with mono is the signature
contrast.

### Positioning

- Not a corporate or multi-purpose design system.
- An opinionated library for personal sites, open source landing pages,
  technical dashboards, and anything that should look like an engineer built it.
- References: shadcn/ui (distribution model), Linear and Cursor (IDE metaphor),
  Vercel and Resend (editorial type).

### Who consumes it

- **portfolio** ([annamaria.app](https://annamaria.app)), personal site posed as an IDE.
- **wristkit** ([wristkit-web.vercel.app](https://wristkit-web.vercel.app)), a CLI that
  injects Apple Health React components into Next.js.

These are the first consumers and act as real test cases, but the design system
is generic. Anyone can use it.

---

## 2. Stack

### Components (what the user copies)

- React 19 and Next.js 15 (App Router) as the reference setup
- Tailwind v4 for utility classes
- Radix UI primitives where a11y logic matters (Dialog, Dropdown, Tooltip, Tabs)
- Plain CSS variables for tokens. The one exception is the type scale, declared
  in a Tailwind v4 `@theme static` block so it generates `text-*` utilities
- TypeScript strict
- class-variance-authority (cva) for variants
- clsx and tailwind-merge (the `cn` helper) for class composition
- Phosphor (`@phosphor-icons/react`) for icons, using the `*Icon` names. A file
  without `"use client"` imports from `@phosphor-icons/react/dist/ssr`: the
  package root is the client build and breaks `next build` from a server file
- cmdk for the command palette, sonner for toasts

### Repo tooling

- pnpm workspaces (monorepo)
- Turborepo for parallel tasks
- Biome for lint and format
- Vitest and Testing Library for tests
- Changesets for versioning
- Husky and lint-staged on pre-commit
- GitHub Actions for CI (`.github/workflows/ci.yml`)

### Fonts

- Newsreader (serif display), Google Fonts, variable
- JetBrains Mono (mono), Google Fonts
- Inter (sans body), Google Fonts

---

## 3. Repo structure

```
entrepta/
├── apps/
│   └── docs/                 # docs site (Next.js 15), entrepta.vercel.app
│       ├── app/
│       │   ├── page.tsx      # landing
│       │   ├── docs/         # installation, cli, themes, foundations, components
│       │   ├── md/           # the .md twin of each page (rewritten from /docs/*.md)
│       │   ├── llms.txt/, llms-full.txt/  # the agent index and the whole site
│       │   ├── opengraph-image.tsx, twitter-image.tsx
│       │   ├── not-found.tsx, error.tsx   # on ChromeMessage
│       │   ├── globals.css   # copy of the registry tokens
│       │   ├── sitemap.ts
│       │   └── robots.ts
│       ├── assets/fonts/     # TTFs for the share images (OFL)
│       ├── components/       # site chrome (nav, nav groups, footer, status bar, palette),
│       │                     # home sections, agents configurator, agent actions
│       ├── lib/              # component-index.ts (nav), components.ts (page text),
│       │                     # docs-data.ts (other pages' content), markdown.ts, og.tsx,
│       │                     # manifest.ts, agents-md.ts, rules.ts, theme.ts, links.ts
│       └── public/schema.json  # the entrepta.json schema the CLI points at
├── packages/
│   ├── cli/                  # @entrepta/cli, bin `entrepta`
│   │   └── src/
│   │       ├── commands/     # init.ts, add.ts
│   │       ├── registry/     # re-exports the manifest from @entrepta/registry
│   │       ├── utils/        # config (validated on read), detect-framework,
│   │       │                 # package-manager, logger, registry
│   │       ├── __tests__/
│   │       └── index.ts
│   └── registry/             # @entrepta/registry, source of truth
│       ├── manifest.ts       # every installable item: files, deps, registryDeps, usage, exports
│       ├── styles/           # globals.css + themes/*.css
│       ├── primitives/       # button, badge, avatar, input, card, dialog, sheet, popover,
│       │                     # dropdown, tooltip, tabs, kbd, checkbox, switch, textarea, field,
│       │                     # filter-pill, money-input
│       ├── data/             # amount
│       ├── charts/           # chart (not in the manifest until v3 phase 7)
│       ├── layout/           # status-bar, top-nav, theme-switcher, mode-toggle,
│       │                     # sidebar, page-outline
│       ├── content/          # code-block, diamond, sect-head, doc-parts
│       ├── feedback/         # toast, skeleton, command-palette, chrome-message, page-loading
│       ├── motion/           # reveal, type-in, rolling-number, spotlight, arrow-link
│       ├── hooks/            # use-theme, use-mode, use-command-palette, use-url-filter,
│       │                     # use-copy, use-format
│       └── lib/              # utils.ts (cn), motion.ts, overlay.ts, color-contrast.ts, format.ts
├── sandbox/
│   └── wirst-test/           # local Next.js app to test the CLI output (gitignored)
├── scripts/release.sh
├── biome.json
├── turbo.json
├── pnpm-workspace.yaml
└── CLAUDE.md
```

### Path conventions

- Registry components live in `packages/registry/<category>/<component>.tsx`
- Every component has a `<component>.test.tsx` next to it
- When the CLI copies a file it goes to
  `<user-project>/components/entrepta/<component>.tsx`
- CSS tokens go to `<user-project>/app/globals.css` or the equivalent
- The `cn` helper goes to `<user-project>/lib/utils.ts`

---

## 4. Design principles

1. **Dark-first.** Light mode exists but dark is the default and the priority.
2. **Editor as metaphor.** Tabs, command palette, status bar, file paths, inline
   comments, shell prompts, mono metadata.
3. **Deliberate type contrast.** Serif italic for proper nouns, mono for UI,
   sans only for long prose.
4. **Color used sparingly.** Brand accent only on CTAs, focus and featured
   states. Status colors only for status. Everything else is black, white and
   cool gray.
5. **High density, clear hierarchy.** 12 column grid, 24px gutters, 1280px max.
6. **Motion with a job.** Entrances, counters and light that follows the cursor,
   each one earning its place. UI feedback stays at 120 to 320ms, ease-out.
   Every animation has a reduced-motion path, including the ones driven by JS,
   which the global CSS reset cannot reach.

---

## 5. Theme system

### Model

- The user picks one theme out of 6 presets: `npx entrepta init --theme=entrepta`
- `init` also asks whether the project wants that one theme fixed
  (`--themes=single`) or all six switchable at runtime (`--themes=all`)
- `single` writes the chosen theme's vars into `app/globals.css`. `all` writes
  the six under `:root[data-theme="<id>"]`, with the chosen one also on bare
  `:root` as the default. The `ThemeSwitcher` only works with `all`
- Any later customization is done by editing those vars in the user project.
  There is no runtime theme provider.
- Dark and light mode is separate from the preset. Any preset works in both.
  Light mode is activated by `data-mode="light"` on `<html>`, handled by the
  `use-theme` hook.

### The 6 presets

| Preset    | Brand color  | Hex       | Vibe                            |
| --------- | ------------ | --------- | ------------------------------- |
| entrepta  | violet       | `#7C6BFF` | Default, personal, IDE feel     |
| blossom   | cherry red   | `#CC2E36` | Bold, confident                 |
| marmalade | warm orange  | `#FF8213` | Editorial, energetic            |
| julia     | warm pink    | `#E85A8A` | Soft, expressive                |
| ivy       | forest green | `#35A365` | Calm, grounded                  |
| bosco     | deep blue    | `#2563EB` | Technical, steady               |

Light mode uses a darker shade of each brand (entrepta light is `#6656FF`).

Each preset only overrides the brand tokens (`--fg-brand`, `--fg-brand-hover`,
`--fg-on-brand`, `--fg-brand-text`, `--bg-surface-brand`, `--ring`). Everything
else (zinc neutrals, status colors, spacing, type) is shared, which keeps the
IDE personality in any color.

### Which brand token for which job

| Token              | Use it for                                                      |
| ------------------ | --------------------------------------------------------------- |
| `--fg-brand`       | Fills, borders, glyphs (`◆`, `$`), and text 24px and up         |
| `--fg-on-brand`    | Text on a `--fg-brand` fill: primary button, solid badge, status bar |
| `--fg-brand-text`  | Brand-colored text below 24px, on the canvas, a card or the tint |
| `--bg-surface-brand` | The brand tint behind soft badges and selected items          |

`--fg-brand` as body text fails AA in 4 of 12 theme and mode combinations. The
inks cannot be derived from the brand, so every theme file sets them.
`styles/themes.contrast.test.ts` measures every pair in all 12 combinations
straight from the CSS: 4.5 for `--fg-on-brand` on the brand, 4.5 for
`--fg-brand-text` on canvas and card, 5.0 on the tint, and 4.5 for
`--fg-muted` on canvas, card and overlay and for each `--status-*-fg` on the
canvas, a card and its own soft tint, and each `--chart-*` color at 3:1 on a
card and on its own tile, inside sRGB. Light mode sets darker status inks
(emerald-700, amber-800, rose-700, indigo-700); the 400s only work on dark.
Change a hex and that test says whether it still holds.

### Semantic tokens

Source of truth is `packages/registry/styles/globals.css`. Short version:

```css
:root {
  /* surfaces */
  --bg-canvas: #09090B;          /* zinc-950, the page */
  --bg-card: #0B0B0E;            /* cards, a hair above the canvas */
  --bg-card-hover: #121216;
  --bg-surface: #18181B;         /* zinc-900, small fills only, never an area */
  --bg-overlay: #0E0E10;         /* menus, tooltips, code, dialogs, toasts */
  --bg-field: var(--bg-overlay); /* inputs, textareas, checkbox and switch boxes */
  --bg-surface-elevated: rgba(39, 39, 42, 0.6);
  --bg-surface-brand: <by theme>;

  /* foreground */
  --fg-primary: #FAFAFA;         /* zinc-50 */
  --fg-secondary: #A1A1AA;       /* zinc-400 */
  --fg-muted: #8A8A92;           /* passes AA; light mode is #68686F */
  --fg-brand: <by theme>;

  /* borders */
  --border-subtle: #27272A;      /* zinc-800 */
  --border-strong: #3F3F46;      /* zinc-700 */

  /* brand accents, color-mix of --fg-brand, so they follow every theme */
  --border-brand: 35%;  --border-brand-strong: 60%;
  --shadow-brand: 20%;  --fg-brand-glow: 50%;  --bg-spotlight: 15% (26% light);

  /* shadows */
  --shadow-card-hover, --shadow-lift-brand, --shadow-overlay

  /* status */
  --status-success: #10B981;
  --status-warning: #F59E0B;
  --status-error: #F43F5E;
  --status-info: #818CF8;
}
```

Radius, spacing, motion, fonts and the light mode block all live in the same
file. Every token that differs between modes is also redeclared in
`[data-surface="dark"]`, or a dark surface inside a light page inherits the
light value.

### Type scale

Ten steps in a `@theme static` block, each with its line height:

| Step       | Size / leading | Step      | Size / leading |
| ---------- | -------------- | --------- | -------------- |
| display-xl | 80 / 0.95      | body-lg   | 16 / 1.6       |
| display-lg | 64 / 1         | body-md   | 14 / 1.5       |
| display-md | 40 / 1.1       | mono-md   | 14 / 1.5       |
| heading-lg | 24 / 1.3       | mono-sm   | 12 / 1.4       |
| heading-md | 18 / 1.4       | mono-xs   | 10 / 1.3       |

The display steps also carry their tracking. Use them as utilities
(`text-mono-sm`) or as variables (`var(--text-mono-sm)`). A step sets size and
leading, never the family: pair it with `font-serif`, `font-sans` or
`font-mono`. No arbitrary sizes (`text-[13px]`) and no Tailwind default steps
(`text-sm`). `styles/type-scale.test.ts` enforces both. Inline `fontSize` is
only for glyphs such as `◆`, at 18px or less.

The scale is registered in `cn` (`lib/utils.ts`) so tailwind-merge does not read
`text-mono-sm` as a color and drop it.

`apps/docs/app/globals.css` and `sandbox/wirst-test/app/globals.css` are copies.
Any token change has to land in all three.

---

## 6. CLI

Published as `@entrepta/cli` with the bin `entrepta`.

| Command                       | What it does                                          |
| ----------------------------- | ----------------------------------------------------- |
| `npx entrepta init`           | Sets up the project, prompts for the theme            |
| `npx entrepta init --theme=X` | Same, skipping the prompts, with one fixed theme      |
| `--themes=single\|all`         | On `init`: one fixed theme, or all six at runtime     |
| `npx entrepta add <comp...>`  | Copies one or more components into the project        |
| `npx entrepta add`            | Interactive mode, lists components to pick            |
| `--overwrite`                 | Flag on both commands, allows replacing existing files |

`diff` and `theme` are not implemented yet.

### Behavior

- Detects the framework (Next.js App Router, Pages, Vite) and adjusts paths
- Never overwrites existing files without `--overwrite`
- Resolves registry dependencies, so adding `card` also pulls what it needs
- Updates `package.json` with the npm deps a component needs
- Reads `entrepta.json` from the project root for custom paths

The manifest lives in `packages/registry/manifest.ts`. The CLI imports it by
package name and tsup bundles it; the docs derive their navigation, install
commands, npm deps and the AGENTS.md cheat sheet from it. A new registry
component is not installable until it is listed there with its `files`, `deps`,
`registryDeps`, a one-line `usage` and its `exports` (a test checks them against
the file). Hooks and lib files have neither `usage` nor `exports`.

`entrepta.json` carries `srcDir` when `@/` points at a folder, such as `src` in
Vite. Aliases are relative to it, and `add` writes each file under it.

### `entrepta.json` in the user project

```json
{
  "$schema": "https://entrepta.dev/schema.json",
  "theme": "entrepta",
  "themes": "single",
  "tsx": true,
  "rsc": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "zinc"
  },
  "aliases": {
    "components": "@/components/entrepta",
    "lib": "@/lib",
    "utils": "@/lib/utils",
    "hooks": "@/hooks"
  }
}
```

---

## 7. Component inventory

### Foundations (CSS, not components)

- `styles/globals.css`, reset, tokens, fonts, type utilities, light mode
- `styles/themes/*.css`, the 6 presets

### Primitives (18)

| Component | Radix                           | Notes                                   |
| --------- | ------------------------------- | --------------------------------------- |
| Button    | `@radix-ui/react-slot`          | 4 variants, 3 sizes, 3 square icon sizes, loading state |
| Badge     | no                              | solid/soft/outline across 6 colors, a dot or an `icon` |
| Avatar    | no                              | image over server-rendered initials, presence dot, `AvatarGroup` with `+N` |
| Input     | no                              | text, search, command (⌘K)               |
| Card      | no                              | default/featured/terminal/data, sm/md/xl |
| Dialog    | `@radix-ui/react-dialog`        | base for modals                          |
| Sheet     | `@radix-ui/react-dialog`        | from the edge, bottom below 640px, `dirty` asks before closing |
| Popover   | `@radix-ui/react-popover`       | anchored panel on the overlay surface     |
| Dropdown  | `@radix-ui/react-dropdown-menu` | on the overlay surface, highlighted row in the brand tint |
| Tooltip   | `@radix-ui/react-tooltip`       | hover info on the overlay surface, a Kbd for shortcuts |
| Kbd       | no                              | every keyboard hint, chip or plain, brand in a highlighted row |
| Tabs      | `@radix-ui/react-tabs`          | in place (Tabs) or routes (TabNav), travelling underline, × on the active tab, icons that grow on hover, `variant="window"` is the title bar |
| Checkbox  | no                              | native checkbox, drawn check, description, indeterminate |
| Switch    | no                              | native checkbox with `role="switch"`     |
| Textarea  | no                              | sans prose, mono placeholder, error state |
| Field     | no                              | label, control, error or hint, wires `aria-describedby` and `aria-invalid` |
| FilterPill | no                             | `aria-pressed` toggle, pairs with `use-url-filter` |
| MoneyInput | no                             | cash-machine or free entry, any pasted format, minor units |

### Data (1)

| Component | Notes                                                     |
| --------- | --------------------------------------------------------- |
| Amount    | minor units, mono and tabular, real minus, muted symbol, reads `FormatProvider` |

### Layout (6)

| Component     | Notes                                            |
| ------------- | ------------------------------------------------ |
| StatusBar     | bottom bar in the brand color, `fixed` or `static` |
| TopNav        | top nav with logo, breadcrumb and menu           |
| ThemeSwitcher | floating preset and dark/light button, uses `use-theme` |
| ModeToggle    | dark/light only, inline or floating, uses `use-mode` |
| Sidebar       | 56px icon rail, a ◆ travels to the active item, `linkComponent` for routers |
| PageOutline   | sticky scrollspy outline from 1100px, `scrollContainer` prop |

### Content (4)

| Component | Notes                                                    |
| --------- | -------------------------------------------------------- |
| CodeBlock | code with filename header, copy button, visible failure  |
| Diamond   | the `◆` before a label, `aria-hidden`. No docs page: it comes with what uses it |
| SectHead  | the `$ command` rule that opens a section                |
| doc-parts | DocLabel, Section, DisplayH2, Prose, Em, Strong          |

Card, Dialog, Field, Tabs and PageOutline import Diamond from `content/`. CardLabel, DialogLabel and Field take an `icon` that replaces the ◆ when the label names a kind of thing. The CLI rewrites
an import between categories (`../content/diamond`) to a sibling (`./diamond`),
and `registryDeps` makes sure the file is copied. A manifest test checks that
every such import is covered.

### Feedback (5)

| Component      | Lib     | Notes                              |
| -------------- | ------- | ---------------------------------- |
| Toast          | `sonner`| unstyled sonner, status as an icon tile and a corner glow |
| Skeleton       | no      | shimmer, respects reduced motion    |
| CommandPalette | `cmdk`  | ⌘K, rows highlight like a dropdown, Kbd hints |
| ChromeMessage  | no      | 404 and error screens, server safe  |
| PageLoading    | no      | CSS only, extra lines only on a long wait |

### Motion (5)

`motion` is a dependency of the four items that animate through JS. The
rest of the system does not need it, and ArrowLink is CSS only.

| Component     | Notes                                                          |
| ------------- | -------------------------------------------------------------- |
| Reveal        | rise and fade in once on screen, `useReveal` for motion elements |
| TypeIn        | text assembling piece by piece, full sentence always in the DOM |
| RollingNumber | odometer digits, `useRollOnHover` spends the entrance delay once |
| Spotlight     | brand glow trailing the cursor on a spring, moved by transform  |
| ArrowLink     | arrow that travels, brand rule that wipes in, `asChild` for routers |

Rules they follow: `whileInView` with `once`, never `animate`; every one calls
`useReducedMotion()`; the real text is always in the DOM (`sr-only` copies, not
`aria-label` on a span); nothing in the registry imports `next/*`. The CSS side
(`.type-line`, `.type-fade`, `.type-caret`, `.type-late`, the load dots) lives
in `globals.css` for what must move before hydration. `lib/motion.ts` holds
`EASE_OUT`, `revealViewport` and `STAGGER_LIMIT`, and the CLI copies it to the
`lib` alias.

### Hooks (6)

- `use-theme`, controls preset and dark/light, built on `use-mode`
- `use-mode`, controls dark/light only, and exports `transitionTheme`
- `use-command-palette`, controls open state and command registration
- `use-url-filter`, a filter kept in the URL query, prerender safe; `useUrlFilterList` for several values
- `use-copy`, copies text and reports copied or failed
- `use-format`, `FormatProvider` and `useFormat`: locale, currency and time zone for every formatting component

---

## 8. Commands

```bash
# install everything
pnpm install

# docs in dev
pnpm dev --filter docs

# build everything
pnpm build

# lint and format
pnpm lint
pnpm check
pnpm format

# typecheck
pnpm typecheck

# tests
pnpm test

# changeset before a PR
pnpm changeset
pnpm changeset:status

# release, manual fallback only, see below
pnpm release
```

Releases are automated. A push to `main` carrying changesets makes
`.github/workflows/release.yml` open a "Version Packages" PR with the bumps and
the CHANGELOG. Merging that PR publishes both packages to npm and pushes the
tags. `pnpm release` is the manual path, for when the workflow is broken.

Publishing authenticates through npm trusted publishing (OIDC). Both packages
name this repo and `release.yml` as their trusted publisher, so there is no npm
token in the repo secrets. Renaming or moving that workflow file breaks the
release until the trusted publisher is updated on npmjs.com.

Running the local CLI in another project:

```bash
cd ../some-test-project
# absolute path, pnpm dlx runs in a temp dir and relative paths break
pnpm dlx file:"$(pwd)/../entrepta/packages/cli" init
```

---

## 9. Code conventions

- TypeScript strict, no `any`
- Function components only
- Forwarded refs on every primitive
- `asChild` (via Radix Slot) on composable primitives
- Variants through cva, never boolean style props
- Names in English (components, props, tokens)
- Comments in English, and only where the code cannot explain itself. No
  comments that restate the next line.
- Absolute imports through aliases (`@/lib/utils`)
- One file per component (`button.tsx`), no big barrel exports
- Every component ships a test file next to it
- No Storybook, the docs site is the showcase

---

## 10. Decisions made

- Stack: Next.js 15, React 19, Tailwind v4, Radix UI
- Tokens: plain CSS variables. The type scale is the exception: a
  `@theme static` block, so it generates `text-*` utilities and still emits
  every variable on `:root` for plain CSS. `globals.css` already imports
  `tailwindcss`, so this costs no compatibility. The old `.t-*` classes are gone
- Font sizes come only from the ten scale steps, enforced by a test
- `init` copies `lib/utils.ts` from the registry, so `cn` has one source
- Brand ink: `--fg-on-brand` for text on a brand fill and `--fg-brand-text` for
  brand-colored text, set per theme and checked by a contrast test. `--fg-brand`
  stays for fills, borders, glyphs and large text
- `init --themes=all` writes the six themes under `data-theme`, so the
  ThemeSwitcher works in user projects. `init --theme=x` alone stays
  non-interactive and writes one theme
- Icons: Phosphor, not lucide. A source test fails if a file without
  `"use client"` imports the Phosphor root, or if `lucide-react` comes back
- Registry files may import across categories; the CLI flattens them into one
  folder and rewrites the paths
- The registry typechecks with `moduleResolution: "Bundler"`, like the projects
  that consume it. NodeNext cannot read Phosphor's type declarations
- Motion: `motion` is a dependency only of the items that use it. Principle 6
  became "motion with a job", with a reduced-motion path for everything
- The registry imports nothing from `next/*`; routes stay in the user's project.
  A source test enforces it
- Routes stay in the user's project. Single-link components take `asChild`,
  lists of links take `linkComponent`, and which item is current is an `active`
  prop. doc-parts carries no entrance, so it does not pull in `motion`
- One manifest, in the registry. The CLI bundles it, the docs derive from it,
  and the home page's AGENTS.md configurator builds its cheat sheet from it
- The docs keep a small client-safe index (`lib/component-index.ts`) and the
  long page text server side (`lib/components.ts`), with tests tying manifest,
  index, text, previews, nav and sitemap together
- Vite and other `src/` layouts: `entrepta.json` records `srcDir` and aliases are
  relative to it, so hooks and lib files land in `src/` like everything else
- Distribution: copy-paste through the CLI, not an npm component package
- Themes: 6 fixed presets, no theme generator
- Lint: Biome, not ESLint plus Prettier
- Monorepo: pnpm workspaces and Turborepo
- Light mode is implemented, dark stays the default
- Packages are published: `@entrepta/cli` and `@entrepta/registry`
- Publishing runs on CI through the Changesets action, with a version PR in
  between. `scripts/release.sh` stays as the manual fallback
- npm auth is trusted publishing (OIDC), no stored token. This is what forced
  pnpm to the 10 line, since OIDC publishing does not exist in pnpm 9
- CI publishes with `scripts/npm-publish-ci.sh`, not `changeset publish`
  directly. `changeset publish` always shells out to `pnpm publish` when it
  finds a pnpm-lock.yaml, and that command's own passthrough to npm does not
  reliably complete npm's OIDC handshake (confirmed against this repo: it
  404s). The script packs with `pnpm pack`, which still does the workspace:*
  rewrite, then publishes the resulting tarball with plain `npm publish`,
  where OIDC works
- No colored bar on the edge of a highlighted or hovered item, anywhere. A
  highlighted menu row takes the brand tint, a toast carries its status in an
  icon tile, a nav item gets a surface and a dot
- The title bar is a variant of the tabs (`variant="window"`), not a component
  of its own: two tab rows that differ only by window dots were one component
- Overlays animate with plain CSS (`motion-fade`, `motion-pop` in
  `globals.css`), not an animation plugin, so a copied component needs nothing
  else. `:root` declares `color-scheme: dark` for native controls and autofill
- Overlays are one family: Dropdown, CommandPalette, Tooltip, Dialog, the
  ThemeSwitcher panel and Toast share `--bg-overlay` and `--shadow-overlay`, and
  every list of rows has the same size and brand tint highlight. Every keyboard
  hint is a `Kbd`. `test/overlay-family.test.ts` holds them together, so
  improving one means improving the rest
- Every surface has the toast's finish: near black underneath, the `.sheen`
  class for a brand glow in the top-left corner, and `--edge-light`, a line of
  light on the top edge (inside `--shadow-card` and `--shadow-overlay`). Fields
  sit on `--bg-field`. No component paints an area in `--bg-surface`
  (zinc-900); the family test fails if one does. The glow is 9% of the brand in
  dark and 4% in light. Light `--fg-muted` is #68686F, not zinc-500, which had
  no margin on a hovered card under the glow. The contrast test measures labels
  on the glow's brightest point over the card, the hovered card and the overlay
- The docs are readable by agents. Every page with content has a Markdown twin at
  the same URL plus `.md` (a rewrite to `app/md/[...path]`), declared with
  `<link rel="alternate" type="text/markdown">`, and `/llms.txt` indexes them
  (llmstxt.org) with `/llms-full.txt` joining them. The Markdown is built in
  `lib/markdown.ts` from the same data the pages render (`lib/docs-data.ts`,
  the manifest, `lib/components.ts`), never written twice. A page's content
  goes in data first; `lib/markdown.test.ts` fails if a component has no twin
  or llms.txt misses a page
- Share images are generated per page (`opengraph-image.tsx` for the site and
  for each component) from `lib/og.tsx`. Its fonts are TTFs in
  `apps/docs/assets/fonts`, because satori reads no woff2 and the build must not
  need the network. The README hero is the site's image, in `.github/assets`
- Overlay classes live once, in `lib/overlay.ts` (`OVERLAY_SURFACE`,
  `MENU_ROW`, `MENU_LABEL`, `MENU_SEPARATOR`), copied by the CLI as `overlay-lib`
  with the six components that use them. The row's highlighted state stays in
  each component, because Radix, cmdk and plain buttons mark it differently
- `entrepta.json` is validated when the CLI reads it (`configProblems`): its
  aliases end up in import lines, and the file can come from a cloned repo.
  `apps/docs/public/schema.json` states the same rules for editors, and a test
  keeps it in line with the CLI's config type
- Home and docs pages are built from shared pieces: `HomeSection`,
  `SectionHead` and `SpecList` on the home page, `DocPageHeader` and
  `DocSubhead` on every docs page, `NavGroups` for the sidebar and the mobile
  menu. Cards that link somewhere use a stretched link on their title, so a
  preview inside can hold real controls
- A theme or mode switch lands in one frame. `transitionTheme` (in `use-mode`,
  used by both hooks) sets `data-theme-switching` on `<html>` for its length,
  `globals.css` holds every transition under it, and where the browser has view
  transitions the page crossfades as one picture (`--motion-slow`, ease-out).
  Reduced motion gets the instant switch. Components keep their color
  transitions for hover; the switch is the one place they are held. Something
  meant to move during it, the sun and moon dial, opts out with
  `data-theme-motion` and must not transition a color
- Avatar layers its image over initials that are in the server HTML, so nothing
  waits for JavaScript and a failed image leaves the initials. An image that
  settled before hydration is read off the element (`complete`,
  `naturalWidth`), since its load event had no listener yet
- A caller retunes a component for the surface under it through a scoped
  variable with a fallback, not by reaching into it: `--toast-glow`,
  `--avatar-cutout` (the ring that cuts a dot or an overlap out of a card)
- The chart palette has no fixed color. `--chart-1` is the brand's hue and the
  other seven turn it by 45° with CSS relative color
  (`oklch(from var(--fg-brand) var(--chart-l) var(--chart-c) calc(h + N))`), at
  one lightness and chroma per mode. The chroma is the highest that stays in
  sRGB for every hue of all six brands. Even `--chart-1` is not the raw brand,
  which falls under 3:1 on a tile in marmalade light and on a dark surface in a
  light page. Results above and below zero use the status colors and a sign
- Docs live at https://entrepta.vercel.app/

---

## 11. How Claude should work here

- Read this whole file before editing.
- Before creating a component, check whether it already exists in the registry.
- Before adding a dependency, justify why it cannot be done without one.
- Always use cva for variants, `cn` for className, forwardRef on primitives.
- Never hardcode hex colors in components, always go through a CSS var.
- Never add custom Tailwind config, everything goes through CSS vars.
- A new registry component is only done when it is registered in the CLI
  manifest, has tests, and has a docs page.
- When a new decision is made, add it to section 10 and commit.

---

## 12. Code review

When asked to review a branch or PR, review the full diff against `main`. Keep
these in mind while writing code too.

The checks below are the ones this codebase has been bitten by. Read them as
prompts to look, not as a list to tick. A diff that touches none of them still
deserves a read, and a rule that does not apply to the diff in front of you is
not a finding.

### Security first

entrepta ships a CLI that writes files and installs packages in someone else's
project, and source that people run without reading. Read every diff for this
before anything else.

- **Every write stays in the project.** A path the CLI builds, from an alias,
  `srcDir` or a file name, resolves inside `cwd` before `writeFile`, and a new
  write path goes through that check. `--overwrite` is the only way to replace a
  file.
- **entrepta.json is input, not trust.** It can come from a cloned repo, and its
  aliases are written into import lines. `configProblems` in
  `packages/cli/src/utils/config.ts` rejects anything that is not a plain path
  before it is used; a new field gets a rule there.
- **Names come from the manifest.** A component name from the command line is
  matched against the manifest before it becomes a path. npm package names come
  only from the manifest's `deps`, never from user input, and installs spawn with
  `shell: false`.
- **Nothing runs on install.** No `postinstall`, no network call from the CLI
  beyond the package manager it spawns, no code downloaded and executed. The
  published CLI is `dist/` only (`files` in its `package.json`), and the registry
  ships source without its tests (`.npmignore`).
- **Deps install without versions**, so a new major of a dependency reaches
  users before the registry is tested on it. A diff that adds a dependency says
  why it cannot be done without one.
- **The registry holds no surprises.** No `eval` or `new Function`, no network
  calls, no telemetry, no `dangerouslySetInnerHTML` beyond the static theme
  scripts, no `next/*` (a test enforces the last one).
- **The docs keep their CSP.** A URL param is matched against a list of allowed
  values before use; a new external host (script, style, font, image) needs a
  reason in the diff; `upgrade-insecure-requests` and HSTS stay Vercel only.
- **Releases publish from CI.** Trusted publishing with provenance, no npm token
  in the repo. Renaming `release.yml` breaks it until npmjs.com is updated.

### Everything else

**Reuse before invention.** Read the diff twice for this one. A component that
hand-rolls a surface, a menu row, a keyboard hint or a `◆` is re-implementing
something the registry has: the overlay classes in `lib/overlay.ts`, `Kbd`,
`Diamond`, `Card`. In the docs, a page that hand-rolls a header or a section
rule is re-implementing `DocPageHeader` and `DocSubhead`.

**Standardization.** Reuse asks "does this already exist?". This asks the
harder question: does this page, or this component, look like it belongs to the
same system? Two failures, and the second is the one that gets missed.

- *Divergence:* a piece that solves a solved problem its own way. Overlays share
  one surface and one row highlight. Every surface has the finish (near black,
  `.sheen`, `--edge-light`). Mono is the default, Inter only for long text, serif
  for titles and names. A section that invents its own header rhythm or its own
  surface is drifting, even when every line of it is fine on its own.
- *Duplication:* the same thing living in more than one place. The second copy
  is a warning, the third is a bug. When a diff adds copy number two, say so in
  the review even if extracting is out of scope; that note is what makes the
  extraction cheap later.

Two questions catch most of it: if this pattern had to change, how many files
would you edit? And could a reader tell which component a screenshot came from
for the right reasons, rather than because one of them is styled differently?

**Motion.** Every rule in §7 came out of a bug that shipped. The expensive ones
to miss: an entrance on `animate` instead of `whileInView` (or a `useInView`
gate), a trigger on an element with no area, anything animated through JS that
never asks `useReducedMotion`, and a heading whose visible text waits for
JavaScript. Text that must be seen at first paint animates in CSS.

**Server and client.** A component with `"use client"` only receives
serializable props from a server file. A Phosphor component is a function and
cannot cross; that broke `next build` for `<Badge icon={...}>` in a server page.
Icon props take an element too (`IconProp` in `lib/icon.tsx`), and a component
with no state or effect stays without `"use client"`. The way to see it is a
production build of a real app, not a unit test: install through the local CLI
into a clean Next.js app and run `next build`.

**Accessibility.** Real semantics over roles on divs; `aria-pressed` or
`aria-expanded` on toggles; screen-reader text for glyph-only information;
hover-only affordances mirrored on `focus-visible`; no two links or buttons
sharing a name and doing different things; and contrast wherever text sits on
`--fg-brand` or the `.sheen` glow. The contrast test measures the tokens, not a
new pairing the diff invents.

**Theme reactivity.** Grep the diff for hex values. Every accent derives from
`--fg-brand`. Fixed colors belong only in theme files, in the share image
renderer, and in docs text that names a color.

**SEO and the docs.** Metadata on new pages, the content in the server HTML
(`useSyncExternalStore` for the URL, not `useSearchParams`, which makes
prerender emit a fallback). A page with content has its Markdown twin in
`lib/markdown.ts`, built from the same data the page renders.

**Performance.** Per-frame work that repaints rather than composites (a
gradient rebuilt on every frame, a filter animated); large blurs animated;
client components where a server one would do; JavaScript shipped for what CSS
can do.

**Responsive.** Reason about 375px first. Wide tables scroll rather than
reflow; grid tracks use `min(Npx, 100%)`; a long single word, such as a
component name, needs a way to wrap. Playwright is fine for overflow and
console errors at every width; the judgement of how it looks stays with a
person.

**Class merging.** Any class the diff invents outside Tailwind's vocabulary
(`sheen`, `motion-pop`, `focus-ring`): check twMerge will not misfile it, and
that a new size step is registered in `TYPE_SCALE` in `lib/utils.ts`. Read
`cn()` calls as the merged string: `cn(base, className)` is where a component's
own styling gets silently dropped, in either direction. `cva`'s own
`className` option concatenates without merging; pass classes through `cn`.

**Overflow contracts.** For every row the diff adds or touches with two
children and `justify-between`: what happens when they stop fitting? "They fit"
is not an answer. Especially inside a Card, which clips.

**Overriding a component from its caller.** Classes in a consumer that undo
what the component sets, or reach into it with `[&>div]` selectors. The fix is
almost always in the component: entrepta is owned code, and a prop is cheaper
than a caller fighting the styles.

**Type scale.** Sizes come from the ten `@theme` steps: no `text-[Npx]`, no
`text-[clamp(...)]`, no Tailwind default step, no inline `fontSize` above glyph
size. `styles/type-scale.test.ts` enforces them, so a diff that needs an
exception argues for it in the diff (the share image renderer is the one today).

**Tests that hold the system.** The contrast test, the overlay family test, the
scale test, the source rules and the docs coverage tests are the contract. A
diff that edits one of them to pass needs a reason stronger than "it failed".
