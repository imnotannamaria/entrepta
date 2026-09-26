# @entrepta/cli

The CLI for [entrepta](https://github.com/imnotannamaria/entrepta), a dark-first design system.

## Install

You do not install this package globally. Use `npx`:

```bash
npx @entrepta/cli@latest init
```

## Commands

### `init`

Bootstraps a project. Writes the global CSS, `lib/utils.ts` and `entrepta.json`. Prompts for a theme, and for one fixed theme or all six.

```bash
npx @entrepta/cli@latest init
npx @entrepta/cli@latest init --theme=ivy
npx @entrepta/cli@latest init --theme=ivy --themes=all
npx @entrepta/cli@latest init --overwrite
```

Options:

- `-t, --theme <preset>`: one of `entrepta`, `blossom`, `marmalade`, `julia`, `ivy`, `bosco`. Skips the prompts
- `--themes <single|all>`: one fixed theme, or all six switchable with `data-theme`
- `--overwrite`: replace existing files without asking

### `add <component>`

Copies one or more components into your project, with every file they import, and installs their npm packages.

```bash
npx @entrepta/cli@latest add button
npx @entrepta/cli@latest add button card command-palette
npx @entrepta/cli@latest add               # interactive picker
```

Options:

- `--overwrite`: replace existing files without asking

## What gets written

After `init`:

```
your-app/
├── app/globals.css           tokens, reset, fonts, the type scale
├── entrepta.json             theme, paths, aliases
└── lib/utils.ts              the cn helper
```

After `add button`:

```
your-app/
├── components/entrepta/button.tsx
└── components/entrepta/button-variants.ts
```

In Vite projects everything lands under `src/`.

## Manual install

Every component has a Manual tab in the [docs](https://entrepta.vercel.app/docs/components) with its dependencies and the source. For a coding agent, the same docs are Markdown at [entrepta.vercel.app/llms.txt](https://entrepta.vercel.app/llms.txt).

## License

MIT. Built by [Anna Maria](https://annamaria.app).
