---
"@entrepta/registry": patch
"@entrepta/cli": patch
---

`npx @entrepta/cli` installs one package for the registry instead of 33. The registry listed cmdk, sonner, clsx and tailwind-merge as dependencies and React as a required peer, so every CLI run downloaded React, Radix and the rest just to copy text files. They are dev dependencies now, and the React peers are optional. Your project still installs what each component needs when you `add` it.
