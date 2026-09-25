# entrepta

A dark-first design system for sites that look like they were built by an engineer.

Copy-paste components. CSS tokens. No SDK. You own the code.

```bash
npx @entrepta/cli@latest init
```

## What you get

33 components across 6 sections, written in React 19 and styled with Tailwind v4 and CSS variables.

- **Primitives**: Button, Badge, Card, Dialog, Dropdown, Tooltip, Tabs
- **Forms**: Input, Textarea, Switch, Field, FilterPill
- **Layout**: StatusBar, TopNav, ThemeSwitcher, ModeToggle, Titlebar, Sidebar, PageOutline
- **Content**: CodeBlock, Diamond, SectHead, doc parts
- **Feedback**: Toast, Skeleton, CommandPalette, ChromeMessage, PageLoading
- **Motion**: Reveal, TypeIn, RollingNumber, Spotlight, ArrowLink

Plus 6 theme presets: `entrepta`, `blossom`, `marmalade`, `julia`, `ivy`, `bosco`. Pick one, or install all six and switch at runtime. Every text color clears WCAG AA in all 12 theme and mode combinations, and a test measures it on every change.

## Two ways to install

### With the CLI

```bash
npx @entrepta/cli@latest init --theme=ivy
npx @entrepta/cli@latest add button card command-palette

# all six themes, switchable at runtime
npx @entrepta/cli@latest init --theme=ivy --themes=all
```

The CLI writes your `globals.css`, sets up `lib/utils.ts`, installs peer deps, and copies the components into your project, along with anything they import.

### By hand

If you want to skip the CLI:

1. Install peer deps: `pnpm add clsx tailwind-merge class-variance-authority`
2. Copy `packages/registry/styles/globals.css` into your project, then append one theme file from `packages/registry/styles/themes/`
3. Copy `lib/utils.ts` with the `cn` helper
4. Copy any component file from `packages/registry/` into `components/entrepta/`

Each component page in the docs has a **Manual** tab with its own dependency list and copy-pasteable source.

## Quick usage

```tsx
import { Button } from "@/components/entrepta/button";
import { CodeBlock } from "@/components/entrepta/code-block";

export function Hero() {
  return (
    <>
      <Button variant="primary">Ship</Button>
      <CodeBlock
        code="npx @entrepta/cli@latest init --theme=ivy"
        variant="terminal"
        filename="terminal · zsh"
        language="bash"
      />
    </>
  );
}
```

## Stack

- React 19 + Next.js 15 (App Router) as the reference setup
- Tailwind v4 for utility classes
- Radix UI primitives for behavior and a11y
- CSS variables for all design tokens
- TypeScript strict
- class-variance-authority for variants
- Phosphor icons
- `motion`, only for the four components that animate through JavaScript

## Project layout

```
entrepta/
├── apps/
│   └── docs/          Next.js site at entrepta.vercel.app
├── packages/
│   ├── cli/           npx @entrepta/cli@latest: init, add
│   └── registry/      source of truth for components, tokens, themes
```

## License

MIT. Built by Anna Maria.
