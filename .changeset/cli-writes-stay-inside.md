---
"@entrepta/cli": patch
---

Every file the CLI writes now resolves inside the project, symlinks included. `add` checked the path as written, so a folder in a cloned repo that was a symlink to somewhere else still received the write, and `init` did not check at all. Both now resolve the path on disk first and refuse a symlink, or a dangling one, that points out of the project.
