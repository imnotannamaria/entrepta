# @entrepta/registry

The component registry for [entrepta](https://github.com/imnotannamaria/entrepta), a dark-first design system.

This package is the source of truth for entrepta's components, themes, and tokens. The [`@entrepta/cli`](https://www.npmjs.com/package/@entrepta/cli) reads from it.

## You probably do not want to install this directly

Components are copy-paste. Use the CLI:

```bash
npx @entrepta/cli@latest init
npx @entrepta/cli@latest add button card
```

Or open the [docs](https://entrepta.vercel.app/docs/components) and copy any component by hand from its **Manual** tab.

## What's inside

```
@entrepta/registry/
├── manifest.ts      every component: files, npm deps, registry deps, usage
├── styles/          globals.css and the 6 theme presets
├── lib/             cn, motion constants, color contrast
├── primitives/      button, badge, card, dialog, dropdown, tooltip, kbd, tabs,
│                    input, textarea, checkbox, switch, field, filter-pill
├── layout/          status-bar, top-nav, theme-switcher, mode-toggle, sidebar, page-outline
├── content/         code-block, diamond, sect-head, doc-parts
├── feedback/        toast, skeleton, command-palette, chrome-message, page-loading
├── motion/          reveal, type-in, rolling-number, spotlight, arrow-link
└── hooks/           use-theme, use-mode, use-command-palette, use-url-filter
```

All files ship as raw `.tsx` and `.ts`. Your project compiles them with its own TypeScript config.

Docs for people at [entrepta.vercel.app](https://entrepta.vercel.app), and for agents at [entrepta.vercel.app/llms.txt](https://entrepta.vercel.app/llms.txt).

## License

MIT. Built by [Anna Maria](https://annamaria.app).
