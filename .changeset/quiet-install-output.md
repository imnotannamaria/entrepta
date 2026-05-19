---
"@entrepta/cli": patch
---

Pass `--no-audit --no-fund` to npm during install so the CLI doesn't surface security warnings and funding notices from packages it didn't add. pnpm/yarn/bun don't audit on install, so they're unaffected.
