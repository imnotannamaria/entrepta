---
"@entrepta/registry": patch
---

Button, Input, Textarea, FilterPill, StatusBar and TopNav no longer carry `"use client"`. None of them has state or an effect, so a server page renders them with no client JavaScript, and can pass FilterPill a Phosphor icon component. Button and Input import their icons from `@phosphor-icons/react/dist/ssr`.

`<Button asChild>` works again. The label wrapper and the spinner were handed to Slot along with your element, so it threw `React.Children.only`. With `asChild`, Slot now gets your element alone, and `loading` does not apply.
