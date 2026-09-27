---
"@entrepta/registry": patch
---

`ThemeScript` and `ModeScript` escape `<` in the storage key, so a key that holds `</script>` cannot end the inline script early.
