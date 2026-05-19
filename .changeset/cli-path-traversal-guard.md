---
"@entrepta/cli": patch
---

Security hardening of the `add` command:

- **Path traversal guard**: refuse to write components outside the user's project, even if `entrepta.json` aliases (`components`, `hooks`) point at `../../something`. A tampered config can no longer drop files outside the cwd.
- **Import rewrite escape**: the `utils` alias is now validated to not contain quotes, backslashes, backticks, or newlines before being spliced into generated source — that closes a code-injection vector via a malicious config. `$` characters are also escaped so `String.prototype.replace` doesn't interpret `$1`/`$&`/etc as backrefs.

No behavior change for any well-formed config; only malformed ones get a clear error and abort.
