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
- Plain CSS variables for tokens, not Tailwind v4 `@theme`, so the system works
  in any setup and not only Tailwind
- TypeScript strict
- class-variance-authority (cva) for variants
- clsx and tailwind-merge (the `cn` helper) for class composition
- lucide-react for icons (1.5px stroke)
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
│       ├── components/       # site chrome (nav, footer, status bar, palette)
│       └── lib/              # theme.ts, utils.ts
├── packages/
│   ├── cli/                  # @entrepta/cli, bin `entrepta`
│   │   └── src/
│   │       ├── commands/     # init.ts, add.ts
│   │       ├── registry/     # components.ts (manifest), types.ts
│   │       ├── utils/        # config, detect-framework, package-manager, logger, registry
│   │       ├── __tests__/
│   │       └── index.ts
│   └── registry/             # @entrepta/registry, source of truth
│       ├── styles/           # globals.css + themes/*.css
│       ├── primitives/       # button, badge, input, card, dialog, dropdown, tooltip, tabs
│       ├── layout/           # status-bar, top-nav, theme-switcher
│       ├── content/          # code-block
│       ├── feedback/         # toast, skeleton, command-palette
│       ├── hooks/            # use-theme, use-command-palette
│       └── lib/              # utils.ts (cn)
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
6. **Motion subtle or none.** 120 to 320ms, ease-out, no exaggerated spring.

---

## 5. Theme system

### Model

- The user picks one theme out of 6 presets: `npx entrepta init --theme=entrepta`
- The CLI writes the CSS vars for that theme into `app/globals.css`
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

Each preset only overrides the brand tokens (`--fg-brand`, `--fg-brand-hover`,
`--bg-surface-brand`, `--ring`). Everything else (zinc neutrals, status colors,
spacing, type) is shared, which keeps the IDE personality in any color.

### Semantic tokens

Source of truth is `packages/registry/styles/globals.css`. Short version:

```css
:root {
  /* surfaces */
  --bg-canvas: #09090B;          /* zinc-950 */
  --bg-surface: #18181B;         /* zinc-900 */
  --bg-surface-elevated: rgba(39, 39, 42, 0.6);
  --bg-surface-brand: <by theme>;

  /* foreground */
  --fg-primary: #FAFAFA;         /* zinc-50 */
  --fg-secondary: #A1A1AA;       /* zinc-400 */
  --fg-muted: #71717A;           /* zinc-500 */
  --fg-brand: <by theme>;

  /* borders */
  --border-subtle: #27272A;      /* zinc-800 */
  --border-strong: #3F3F46;      /* zinc-700 */

  /* status */
  --status-success: #10B981;
  --status-warning: #F59E0B;
  --status-error: #F43F5E;
  --status-info: #818CF8;
}
```

Radius, spacing, motion, fonts, type utilities and the light mode block all live
in the same file.

`apps/docs/app/globals.css` and `sandbox/wirst-test/app/globals.css` are copies.
Any token change has to land in all three.

---

## 6. CLI

Published as `@entrepta/cli` with the bin `entrepta`.

| Command                       | What it does                                          |
| ----------------------------- | ----------------------------------------------------- |
| `npx entrepta init`           | Sets up the project, prompts for the theme            |
| `npx entrepta init --theme=X` | Same, skipping the theme prompt                       |
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

The component manifest lives in `packages/cli/src/registry/components.ts`. A new
registry component is not installable until it is listed there with its `files`,
`deps` and `registryDeps`.

### `entrepta.json` in the user project

```json
{
  "$schema": "https://entrepta.dev/schema.json",
  "theme": "entrepta",
  "tsx": true,
  "rsc": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "zinc"
  },
  "aliases": {
    "components": "@/components/entrepta",
    "lib": "@/lib",
    "utils": "@/lib/utils"
  }
}
```

---

## 7. Component inventory

### Foundations (CSS, not components)

- `styles/globals.css`, reset, tokens, fonts, type utilities, light mode
- `styles/themes/*.css`, the 6 presets

### Primitives (8)

| Component | Radix                           | Notes                                   |
| --------- | ------------------------------- | --------------------------------------- |
| Button    | `@radix-ui/react-slot`          | 4 variants, 3 sizes, loading state       |
| Badge     | no                              | solid/soft/outline across 6 colors       |
| Input     | no                              | text, search, command (⌘K)               |
| Card      | no                              | default/featured/terminal/data           |
| Dialog    | `@radix-ui/react-dialog`        | base for modals                          |
| Dropdown  | `@radix-ui/react-dropdown-menu` | context menus, theme switcher            |
| Tooltip   | `@radix-ui/react-tooltip`       | hover info, keyboard hints               |
| Tabs      | `@radix-ui/react-tabs`          | editor style file tabs                   |

### Layout (3)

| Component     | Notes                                            |
| ------------- | ------------------------------------------------ |
| StatusBar     | fixed bottom bar in the brand color              |
| TopNav        | top nav with logo, breadcrumb and menu           |
| ThemeSwitcher | floating preset and dark/light button, uses `use-theme` |

### Content (1)

| Component | Notes                                     |
| --------- | ----------------------------------------- |
| CodeBlock | code with filename header and copy button |

### Feedback (3)

| Component      | Lib     | Notes                              |
| -------------- | ------- | ---------------------------------- |
| Toast          | `sonner`| success/warning/error/info          |
| Skeleton       | no      | shimmer, respects reduced motion    |
| CommandPalette | `cmdk`  | ⌘K, search, groups, shortcuts       |

### Hooks (2)

- `use-theme`, controls preset and dark/light
- `use-command-palette`, controls open state and command registration

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

# release
pnpm release
```

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
- Tokens: plain CSS variables, not Tailwind `@theme`
- Distribution: copy-paste through the CLI, not an npm component package
- Themes: 6 fixed presets, no theme generator
- Lint: Biome, not ESLint plus Prettier
- Monorepo: pnpm workspaces and Turborepo
- Light mode is implemented, dark stays the default
- Packages are published: `@entrepta/cli` and `@entrepta/registry`
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
