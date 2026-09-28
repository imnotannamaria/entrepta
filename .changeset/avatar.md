---
"@entrepta/registry": minor
"@entrepta/cli": minor
---

New component: Avatar, with AvatarGroup. `npx @entrepta/cli@latest add avatar`.

A person or a thing, as an image over its initials. The initials are in the server HTML and the image covers them once it loads, so nothing waits for JavaScript and a broken image leaves the initials. Four sizes, a circle for people and a square for things, a neutral fill or the brand tint, an `icon` in place of the initials, a brand ring for the active profile, and a presence dot that screen readers hear with the name. AvatarGroup overlaps them as a list and folds the rest into `+N`. Set `--avatar-cutout` on a parent that is not the canvas, such as a Card, so the dot and the overlaps cut out of its color.
