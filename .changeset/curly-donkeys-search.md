---
"@entrepta/registry": minor
"@entrepta/cli": minor
---

Add ModeToggle, a dark/light only switch, plus the use-mode hook behind it.

ModeToggle renders inline by default and can float in any corner with
`position`. It ships icon and labeled variants, two sizes, and a `ModeScript`
helper for pre-paint mode restore. `useTheme` now composes `useMode`, so there
is a single implementation of the mode logic. Install it with
`npx @entrepta/cli@latest add mode-toggle`.
