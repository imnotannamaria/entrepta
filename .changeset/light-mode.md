---
"@entrepta/registry": minor
---

Light mode support across the registry.

The registry now ships dual-mode styling. Dark is still the default (no opt-in needed); to switch a project to light, set `data-mode="light"` on `<html>` and the surface, foreground, border and brand tokens flip. Every existing component adapts automatically because they were already token-driven.

Highlights:

- **New tokens**: `--bg-hover-soft` / `--bg-hover-strong` (replace hardcoded `bg-white/X` overlays so they flip to black overlays in light mode), `--bg-chrome` (recessed chrome surface used by CodeBlock head + CardTerminalBar — dark overlay in dark mode, subtle dark overlay in light mode).
- **`[data-surface="dark"]` scope**: a reusable selector that pins every semantic token to its dark value within the marked element. The terminal-style `Card` variant, `Tooltip`, and `CodeBlock` chrome bars use this so they stay IDE-dark even in light mode pages (the design intent: terminal feels like a terminal).
- **Per-theme light brand**: each of the six theme files (entrepta, blossom, marmalade, julia, ivy, bosco) gets a slightly darker brand color for `data-mode="light"` so contrast stays AA on white surfaces.
- **Components updated**: Button (ghost/secondary hovers), Badge (soft neutral), Dialog (close-button hover), Tabs (close × hover), Card (`variant="terminal"` now carries `data-surface="dark"`), Tooltip (`data-surface="dark"`), CodeBlock (chrome bar uses `--bg-chrome`).
