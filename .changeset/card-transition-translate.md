---
"@entrepta/registry": patch
---

Card transitions `translate` instead of `transform`. The hover lift still eases, and a card animated by Motion (a `Reveal` entrance, a `layout` move) no longer has every frame of its `transform` smoothed by a 200ms CSS transition, which made entrances land late.
