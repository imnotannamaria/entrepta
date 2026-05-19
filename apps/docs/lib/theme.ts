export const THEMES = [
  { id: "entrepta", color: "#7C6BFF", label: "entrepta" },
  { id: "blossom", color: "#CC2E36", label: "blossom" },
  { id: "marmalade", color: "#FF8213", label: "marmalade" },
  { id: "julia", color: "#E85A8A", label: "julia" },
  { id: "ivy", color: "#35A365", label: "ivy" },
  { id: "bosco", color: "#2563EB", label: "bosco" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME: ThemeId = "entrepta";
export const THEME_STORAGE_KEY = "entrepta:theme";

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEMES.some((t) => t.id === value);
}
