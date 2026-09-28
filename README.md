<p align="center">
  <img src=".github/assets/entrepta.png" alt="entrepta: a design system posed as an IDE" width="100%" />
</p>

<p align="center">
  <a href="https://entrepta.vercel.app">Docs</a> ·
  <a href="https://entrepta.vercel.app/docs/components">Components</a> ·
  <a href="https://entrepta.vercel.app/llms.txt">llms.txt</a> ·
  <a href="https://www.npmjs.com/package/@entrepta/cli">npm</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@entrepta/cli"><img src="https://img.shields.io/npm/v/@entrepta/cli?color=7c6bff&label=%40entrepta%2Fcli" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/WCAG-AA%20in%2012%20themes%20%C3%97%20modes-7c6bff" alt="WCAG AA in 12 theme and mode combinations" />
  <img src="https://img.shields.io/badge/license-MIT-7c6bff" alt="MIT license" />
</p>

# entrepta

A dark-first design system for sites that look like an engineer built them. Tabs, a command palette, a status bar, shell prompts, serif italic next to mono.

Components are copied into your repo as source, in the shadcn model. No SDK, no runtime. You own the code.

```bash
npx @entrepta/cli@latest init
npx @entrepta/cli@latest add button card command-palette
```

## What you get

70 components across 8 sections, in React 19, Tailwind v4 and CSS variables.

| Section    | Components |
| ---------- | ---------- |
| Primitives | Button, Badge, Avatar, IconTile, Card, Dialog, Sheet, Popover, Accordion, Dropdown, Tooltip, Kbd, Tabs, Progress, Stepper |
| Forms      | Input, Textarea, Checkbox, Switch, Field, MoneyInput, Select, Combobox, SegmentedControl, ChoiceCard, SwatchPicker, SecretField, FileDropzone, Calendar, DatePicker, DateNavigator, FilterPill |
| Layout     | StatusBar, TopNav, ThemeSwitcher, ModeToggle, Sidebar, MobileNav, BentoGrid, PageOutline |
| Content    | CodeBlock, SectHead, Doc parts |
| Data       | Amount, Metric, Delta, Sparkline, Chart, BarList, ContributionGrid, Redact, ListRow, Table, DataTable, FilterBuilder |
| Chat       | PromptInput, ChatThread |
| Feedback   | Alert, EmptyState, Toast, Skeleton, CommandPalette, ChromeMessage, PageLoading |
| Motion     | Reveal, TypeIn, RollingNumber, Spotlight, SpotlightCard, ArrowLink |

Six theme presets: `entrepta`, `blossom`, `marmalade`, `julia`, `ivy` and `bosco`. Pick one, or install all six and switch at runtime. Every text color clears WCAG AA in all 12 theme and mode combinations, and a test measures it on every change.

New in 3: components for products, from money and dates to tables, filters, charts and chat, with nothing in 2.x broken. [What's new in v3](https://entrepta.vercel.app/docs/whats-new-in-v3) lists them and the one command to update. Upgrading from 1.x? The [migration guide](https://entrepta.vercel.app/docs/migrating-to-v2) lists every change, and copies as one Markdown file for your agent.

## Built for coding agents

entrepta is meant to be installed and used by Claude Code, Cursor or Codex as much as by people.

- **An AGENTS.md for your project.** The AGENTS.md button on the site builds one: pick the framework, theme and components, and it says how to install, where things live, which token goes where and how each component is used. It also writes CLAUDE.md.
- **Every docs page in Markdown.** Add `.md` to any docs URL, such as [`/docs/components/button.md`](https://entrepta.vercel.app/docs/components/button.md). Each page also has a copy for agent button.
- **[`/llms.txt`](https://entrepta.vercel.app/llms.txt)** indexes every page in the llmstxt.org format, and **[`/llms-full.txt`](https://entrepta.vercel.app/llms-full.txt)** is the whole site in one file.

## Install

### With the CLI

```bash
npx @entrepta/cli@latest init --theme=ivy

# all six themes, switchable at runtime
npx @entrepta/cli@latest init --theme=ivy --themes=all

npx @entrepta/cli@latest add button card field
```

`init` writes the tokens, the `cn` helper and `entrepta.json`. `add` copies each component with everything it imports and installs its npm packages. It works in Next.js (App or Pages Router) and Vite, and never overwrites a file without `--overwrite`.

### By hand

1. Install `clsx`, `tailwind-merge` and `class-variance-authority`
2. Copy `packages/registry/styles/globals.css` into your project, then append one file from `packages/registry/styles/themes/`
3. Copy `packages/registry/lib/utils.ts` for the `cn` helper
4. Copy any component from `packages/registry/` into `components/entrepta/`

Every component page has a **Manual** tab with its dependencies and the source, imports already rewritten.

## Use it

```tsx
import { Button } from "@/components/entrepta/button"
import { Card, CardHeader, CardLabel, CardTitle } from "@/components/entrepta/card"

export function Launch() {
  return (
    <Card variant="featured">
      <CardHeader>
        <CardLabel>launch</CardLabel>
      </CardHeader>
      <CardTitle>
        Ship it <em>tonight.</em>
      </CardTitle>
      <Button>deploy</Button>
    </Card>
  )
}
```

## Principles

1. **Dark-first.** Light mode exists; dark is the default.
2. **Editor as metaphor.** Tabs, a command palette, a status bar, file paths, comments.
3. **Deliberate type contrast.** Serif italic for names, mono for UI, sans for prose.
4. **Color used sparingly.** The brand only on actions, focus and featured states.
5. **High density, clear hierarchy.** A 12 column grid, 1280px wide.
6. **Motion with a job.** Every animation has a reduced-motion path, the JavaScript ones included.

## Built with entrepta

- [annamaria.app](https://annamaria.app), a personal site posed as an IDE, where entrepta started
- [wristkit](https://wristkit-web.vercel.app), Apple Health components for Next.js

## Stack

React 19, Next.js 15 as the reference setup, Tailwind v4, Radix UI, CSS variables, TypeScript strict, class-variance-authority, Phosphor icons, and `motion` for the components that animate through JavaScript. A few components bring a library for a job worth one: cmdk for the command palette, sonner for toasts, react-day-picker for the calendar, TanStack Table for the data table and Recharts for charts. Each installs only with the component that needs it.

## Repo

```
entrepta/
├── apps/docs/            the site at entrepta.vercel.app
└── packages/
    ├── cli/              @entrepta/cli: init and add
    └── registry/         @entrepta/registry: components, tokens, themes, the manifest
```

```bash
pnpm install
pnpm dev --filter docs
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## License

MIT. Built by [Anna Maria](https://annamaria.app).
