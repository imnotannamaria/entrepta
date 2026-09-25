---
"@entrepta/registry": major
"@entrepta/cli": major
---

entrepta 2.0. Tokens, icons, the Card, text sizes and token values all change at once. Read the migration guide before updating: https://entrepta.vercel.app/docs/migrating-to-v2

Breaking:

- Font sizes come from ten scale steps (`text-mono-sm`, `text-heading-lg`…). The `.t-*` classes are gone, heading-md is 18px and mono-xs is 10px.
- Icons are Phosphor. `lucide-react` is no longer a dependency.
- The Card is rebuilt: near black, a border that lights up on hover, sizes `sm`, `md` and `xl`, and a header that wraps.
- Text on a brand fill uses `--fg-on-brand`, and brand-colored text below 24px uses `--fg-brand-text`. entrepta light is `#6656ff`, and four light brands shifted slightly.
- Dialog and CommandPalette sit on `--bg-overlay`. Dark `--fg-muted` is lighter, and light mode status inks are darker, so every ink clears WCAG AA.
- Tabs put the close button next to the tab, on the active tab only, and now depend on `motion`.
- Dropdown, Toast, Tooltip, CommandPalette and the ThemeSwitcher panel sit on `--bg-overlay` and highlight rows the same way. A highlighted menu row takes the brand tint instead of an edge bar, and a toast shows its status as an icon tile. The Toaster renders sonner unstyled and adds a close button.

New:

- Components: Kbd, Checkbox, Switch, Textarea, Field, FilterPill, ChromeMessage, PageLoading, SectHead, doc parts, Diamond, Sidebar, PageOutline, TabNav with a window variant for the title bar, and the motion set: Reveal, TypeIn, RollingNumber, Spotlight, ArrowLink.
- Button icon sizes (`icon-sm`, `icon-md`, `icon-lg`) and an `icon` prop on Badge.
- Tokens for cards, overlays, brand accents and shadows, and a contrast test over all 12 theme and mode combinations.
- `init --themes=all` installs the six themes for runtime switching, and ThemeSwitchers on one page stay in step.
- Menus, tooltips and dialogs animate open and closed with plain CSS in `globals.css`, and `:root` declares `color-scheme: dark` so native controls and Chrome's autofill match.
- The CLI copies what a component imports from other folders, routes lib files to the `lib` alias, and records `srcDir` so Vite projects get every file under `src/`.
