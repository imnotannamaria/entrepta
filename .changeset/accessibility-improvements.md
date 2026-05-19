---
"@entrepta/registry": patch
---

Accessibility improvements:

- **Tabs**: the close × on closable tabs is now announced as a "Close tab" button by screen readers (previously it had `aria-hidden` and was invisible to assistive tech). `TabsContent` gains a visible focus ring when reached via keyboard.
- **Dropdown**: focused menu items now show a brand-colored inset bar in addition to the elevated background, so keyboard users see where they are even on themes with subtle elevation.
- **CommandPalette**: the input gets a default `aria-label="Search commands"` so screen-reader users hear a name on focus when no label is provided.
