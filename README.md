# entrepta

A dark-first design system for sites that look like they were built by an engineer.

Copy-paste components. CSS tokens. No SDK. You own the code.

```bash
npx entrepta init
```

## What you get

14 components across 4 categories, all written in React 19 and styled with Tailwind v4 + CSS variables.

- **Primitives**: Button, Badge, Input, Card, Dialog, Dropdown, Tooltip, Tabs
- **Layout**: StatusBar, TopNav
- **Feedback**: Toast, Skeleton, CommandPalette
- **Content**: CodeBlock

Plus 6 theme presets you can switch with one flag: `entrepta`, `blossom`, `marmalade`, `julia`, `ivy`, `bosco`.

## Two ways to install

### With the CLI

```bash
npx entrepta init --theme=ivy
npx entrepta add button card command-palette
```

The CLI writes your `globals.css`, sets up `lib/utils.ts`, installs peer deps, and copies the components into your project.

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
        code="npx entrepta init --theme=ivy"
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
- lucide-react icons (1.5px stroke)

## Project layout

```
entrepta/
├── apps/
│   └── docs/          Next.js site at entrepta.vercel.app
├── packages/
│   ├── cli/           npx entrepta — init, add
│   └── registry/      source of truth for components, tokens, themes
```

## License

MIT. Built by Anna Maria.
