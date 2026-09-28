---
"@entrepta/registry": patch
---

An inactive icon tab keeps its name on phones. The label was `hidden` below `sm`, which also removed it from the accessibility tree, so screen readers and Lighthouse saw links with no name. It is `sr-only` there now: still off screen, still announced.
