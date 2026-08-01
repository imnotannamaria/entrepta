# @entrepta/cli

## 1.1.0

### Minor Changes

- 3756c4c: Add ModeToggle, a dark/light only switch, plus the use-mode hook behind it.

  ModeToggle renders inline by default and can float in any corner with
  `position`. It ships icon and labeled variants, two sizes, and a `ModeScript`
  helper for pre-paint mode restore. `useTheme` now composes `useMode`, so there
  is a single implementation of the mode logic. Install it with
  `npx @entrepta/cli@latest add mode-toggle`.

### Patch Changes

- Updated dependencies [3756c4c]
  - @entrepta/registry@1.2.0

## 1.0.2

### Patch Changes

- 190c94a: Security hardening of the `add` command:

  - **Path traversal guard**: refuse to write components outside the user's project, even if `entrepta.json` aliases (`components`, `hooks`) point at `../../something`. A tampered config can no longer drop files outside the cwd.
  - **Import rewrite escape**: the `utils` alias is now validated to not contain quotes, backslashes, backticks, or newlines before being spliced into generated source — that closes a code-injection vector via a malicious config. `$` characters are also escaped so `String.prototype.replace` doesn't interpret `$1`/`$&`/etc as backrefs.

  No behavior change for any well-formed config; only malformed ones get a clear error and abort.

- 544d034: Pass `--no-audit --no-fund` to npm during install so the CLI doesn't surface security warnings and funding notices from packages it didn't add. pnpm/yarn/bun don't audit on install, so they're unaffected.
- 55f7a1f: New `ThemeSwitcher` layout component + `useTheme` hook.

  The floating theme switcher that ships on the docs site is now a generic registry component any consumer can drop into their app.

  - **`hooks/use-theme.ts`**: persists theme + mode in localStorage and drives the `data-theme` / `data-mode` attributes on `<html>`. Configurable storage key, default theme, default mode, and a `disableMode` opt-out for dark-only sites.
  - **`layout/theme-switcher.tsx`**: the floating UI. Accepts a `themes` array, supports four anchor positions, can hide the mode toggle, and closes on outside click / Escape. Also exports `ThemeScript` — the inline pre-paint snippet that prevents the default-theme flash.
  - **CLI**: both items are registered (`use-theme` as a hook, `theme-switcher` in layout with `use-theme` as a registry dep). `rewriteImports` was extended so the relative `../hooks/<name>` import in registry components becomes the consumer's `hooks` alias on copy.

- Updated dependencies [f8ccf22]
- Updated dependencies [d225728]
- Updated dependencies [55f7a1f]
  - @entrepta/registry@1.1.0

## 1.0.1

### Patch Changes

- a1fd53a: Update README to reflect `npx @entrepta/cli@latest` command pattern
- Updated dependencies [a1fd53a]
  - @entrepta/registry@1.0.1

## 1.0.0

### Major Changes

- 04a2101: update README to reflect npx @entrepta/cli@latest comman
- 26d369a: First version

### Patch Changes

- Updated dependencies [04a2101]
- Updated dependencies [26d369a]
  - @entrepta/registry@1.0.0
