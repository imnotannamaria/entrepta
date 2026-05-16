# @entrepta/registry

The component registry for [entrepta](https://github.com/imnotannamaria/entrepta), a dark-first design system.

This package is the source of truth for entrepta's components, themes, and tokens. The [`@entrepta/cli`](https://www.npmjs.com/package/@entrepta/cli) reads from it.

## You probably do not want to install this directly

Components are copy-paste. Use the CLI:

```bash
npx entrepta init
npx entrepta add button card
```

Or open the [docs](https://github.com/imnotannamaria/entrepta) and copy any component by hand via its **Manual** tab.

## What's inside

```
@entrepta/registry/
├── styles/                  globals.css + 6 theme presets
├── lib/                     cn helper
├── primitives/              button, badge, input, card, dialog, dropdown, tooltip, tabs
├── layout/                  status-bar, top-nav
├── feedback/                toast, skeleton, command-palette
├── content/                 code-block
└── hooks/                   use-command-palette
```

All files ship as raw `.tsx` / `.ts`. Consumers compile via their own TypeScript config.

## License

MIT. Built by Anna Maria.
