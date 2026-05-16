# @entrepta/cli

The CLI for [entrepta](https://github.com/imnotannamaria/entrepta), a dark-first design system.

## Install

You do not install this package globally. Use `npx`:

```bash
npx entrepta init
```

## Commands

### `entrepta init`

Bootstraps a project. Writes `globals.css`, `lib/utils.ts`, and `entrepta.json`. Prompts for a theme.

```bash
npx entrepta init
npx entrepta init --theme=ivy
npx entrepta init --overwrite
```

Options:

- `-t, --theme <preset>` — pick one of `entrepta`, `blossom`, `marmalade`, `julia`, `ivy`, `bosco`
- `--overwrite` — replace existing files without asking

### `entrepta add <component>`

Copies one or more components into your project. Resolves dependencies automatically.

```bash
npx entrepta add button
npx entrepta add button card command-palette
npx entrepta add               # interactive picker
```

Options:

- `--overwrite` — replace existing files without asking

## What gets written

After `init`:

```
your-app/
├── app/globals.css           CSS tokens, reset, fonts
├── entrepta.json             Theme + paths
└── lib/utils.ts              cn helper
```

After `add button`:

```
your-app/
└── components/entrepta/button.tsx
```

## Manual install

Don't want the CLI? Every component has a Manual tab in the docs with its dependency list and copy-pasteable source.

## License

MIT. Built by Anna Maria.
