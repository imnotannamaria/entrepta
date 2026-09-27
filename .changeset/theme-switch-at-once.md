---
"@entrepta/registry": minor
---

Switching the theme or the mode now changes the whole page at once. Components eased their own colors on their own clocks (a card over 200ms, a button over 150ms, a badge not at all), so a switch landed piece by piece. `useMode` and `useTheme` now run every switch through `transitionTheme`, exported from `use-mode`. For the length of a switch it sets `data-theme-switching` on `<html>`, which holds every transition, and where the browser has view transitions the page crossfades as one picture over `--motion-slow`. Reduced motion gets the instant switch. The sun and moon in the toggles keep turning through `data-theme-motion`.

Run `init --overwrite` for the new block in `globals.css`, and `add use-mode use-theme --overwrite` for the hooks. Wrap your own attribute changes in `transitionTheme` if you switch the theme some other way.
