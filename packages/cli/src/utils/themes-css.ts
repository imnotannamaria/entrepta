export const THEMES = ["entrepta", "blossom", "marmalade", "julia", "ivy", "bosco"] as const;
export type Theme = (typeof THEMES)[number];
export type ThemesMode = "single" | "all";

const DARK = ":root {";
const LIGHT = ':root[data-mode="light"] {';

/**
 * Rewrites one theme file so its blocks apply under `data-theme="<id>"`.
 * The default theme also keeps bare `:root`, so a page with no `data-theme`
 * still gets it.
 */
export function scopeTheme(css: string, id: Theme, isDefault: boolean): string {
  if (!css.includes(DARK) || !css.includes(LIGHT)) {
    throw new Error(`Theme "${id}" is missing its :root or light block.`);
  }
  const dark = `:root[data-theme="${id}"] {`;
  const light = `:root[data-theme="${id}"][data-mode="light"] {`;
  return css
    .replace(LIGHT, isDefault ? `:root[data-mode="light"],\n${light}` : light)
    .replace(DARK, isDefault ? `:root,\n${dark}` : dark);
}

/**
 * All six themes, switchable at runtime through `data-theme` on <html>.
 *
 * The default theme comes first. Its light block, `:root[data-mode="light"]`,
 * has the same specificity as another theme's dark block,
 * `:root[data-theme="x"]`. Emitting the default first means the chosen theme
 * wins that tie for any token its own light block leaves out.
 */
export function buildThemesCss(files: Record<Theme, string>, defaultTheme: Theme): string {
  const order = [defaultTheme, ...THEMES.filter((t) => t !== defaultTheme)];
  return order.map((id) => scopeTheme(files[id], id, id === defaultTheme).trim()).join("\n\n");
}
