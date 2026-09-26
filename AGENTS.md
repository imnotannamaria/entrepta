# entrepta

> Project context for Codex. Read this file before any task in this repo.
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

- **portfolio** (anna-maria-dev.vercel.app), personal site posed as an IDE.
- **wristkit**, a CLI that injects Apple Health React components into Next.js.

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
│       │   ├── globals.css   # copy of the registry tokens
│       │   ├── sitemap.ts
│       │   └── robots.ts
│       ├── components/       # site chrome (nav, footer, status bar, palette), agents configurator
│       └── lib/              # component-index.ts (nav), components.ts (page text),
│                             # manifest.ts, agents-md.ts, rules.ts, theme.ts
├── packages/
│   ├── cli/                  # @entrepta/cli, bin `entrepta`
│   │   └── src/
│   │       ├── commands/     # init.ts, add.ts
│   │       ├── registry/     # re-exports the manifest from @entrepta/registry
│   │       ├── utils/        # config, detect-framework, package-manager, logger, registry
│   │       ├── __tests__/
│   │       └── index.ts
│   └── registry/             # @entrepta/registry, source of truth
│       ├── manifest.ts       # every installable item: files, deps, registryDeps, usage, exports
│       ├── styles/           # globals.css + themes/*.css
│       ├── primitives/       # button, badge, input, card, dialog, dropdown, tooltip, tabs,
│       │                     # kbd, checkbox, switch, textarea, field, filter-pill
│       ├── layout/           # status-bar, top-nav, theme-switcher, mode-toggle,
│       │                     # sidebar, page-outline
│       ├── content/          # code-block, diamond, sect-head, doc-parts
│       ├── feedback/         # toast, skeleton, command-palette, chrome-message, page-loading
│       ├── motion/           # reveal, type-in, rolling-number, spotlight, arrow-link
│       ├── hooks/            # use-theme, use-mode, use-command-palette, use-url-filter
│       └── lib/              # utils.ts (cn), motion.ts, color-contrast.ts
├── sandbox/
│   └── wirst-test/           # local Next.js app to test the CLI output (gitignored)
├── scripts/release.sh
├── biome.json
├── turbo.json
├── pnpm-workspace.yaml
└── AGENTS.md
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
canvas, a card and its own soft tint. Light mode sets darker status inks
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
  --bg-surface: #18181B;         /* zinc-900, what sits above a card */
  --bg-overlay: #0E0E10;         /* dialogs and the command palette */
  --bg-surface-elevated: rgba(39, 39, 42, 0.6);
  --bg-surface-brand: <by theme>;

  /* foreground */
  --fg-primary: #FAFAFA;         /* zinc-50 */
  --fg-secondary: #A1A1AA;       /* zinc-400 */
  --fg-muted: #8A8A92;           /* passes AA; light mode keeps zinc-500 */
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

### Primitives (14)

| Component | Radix                           | Notes                                   |
| --------- | ------------------------------- | --------------------------------------- |
| Button    | `@radix-ui/react-slot`          | 4 variants, 3 sizes, 3 square icon sizes, loading state |
| Badge     | no                              | solid/soft/outline across 6 colors, a dot or an `icon` |
| Input     | no                              | text, search, command (⌘K)               |
| Card      | no                              | default/featured/terminal/data, sm/md/xl |
| Dialog    | `@radix-ui/react-dialog`        | base for modals                          |
| Dropdown  | `@radix-ui/react-dropdown-menu` | on the overlay surface, highlighted row in the brand tint |
| Tooltip   | `@radix-ui/react-tooltip`       | hover info on the overlay surface, a Kbd for shortcuts |
| Kbd       | no                              | every keyboard hint, chip or plain, brand in a highlighted row |
| Tabs      | `@radix-ui/react-tabs`          | in place (Tabs) or routes (TabNav), travelling underline, × on the active tab, icons that grow on hover, `variant="window"` is the title bar |
| Checkbox  | no                              | native checkbox, drawn check, description, indeterminate |
| Switch    | no                              | native checkbox with `role="switch"`     |
| Textarea  | no                              | sans prose, mono placeholder, error state |
| Field     | no                              | label, control, error or hint, wires `aria-describedby` and `aria-invalid` |
| FilterPill | no                             | `aria-pressed` toggle, pairs with `use-url-filter` |

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

### Hooks (4)

- `use-theme`, controls preset and dark/light, built on `use-mode`
- `use-mode`, controls dark/light only
- `use-command-palette`, controls open state and command registration
- `use-url-filter`, a filter kept in the URL query, prerender safe

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
  dark and 4% in light, the most light mode allows before `--fg-muted` drops
  under AA, and the contrast test measures labels on its brightest point
- Docs live at https://entrepta.vercel.app/

---

## 11. How Codex should work here

- Read this whole file before editing.
- Before creating a component, check whether it already exists in the registry.
- Before adding a dependency, justify why it cannot be done without one.
- Always use cva for variants, `cn` for className, forwardRef on primitives.
- Never hardcode hex colors in components, always go through a CSS var.
- Never add custom Tailwind config, everything goes through CSS vars.
- A new registry component is only done when it is registered in the CLI
  manifest, has tests, and has a docs page.
- When a new decision is made, add it to section 10 and commit.
