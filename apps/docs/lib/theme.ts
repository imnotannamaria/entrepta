export const THEMES = [
  { id: "entrepta", color: "#7C6BFF", lightColor: "#6B5BFF", label: "entrepta" },
  { id: "blossom", color: "#CC2E36", lightColor: "#B8262E", label: "blossom" },
  { id: "marmalade", color: "#FF8213", lightColor: "#D96B00", label: "marmalade" },
  { id: "julia", color: "#E85A8A", lightColor: "#D33A72", label: "julia" },
  { id: "ivy", color: "#35A365", lightColor: "#1E8350", label: "ivy" },
  { id: "bosco", color: "#2563EB", lightColor: "#1D4ED8", label: "bosco" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export type Mode = "dark" | "light";

export const DEFAULT_THEME: ThemeId = "entrepta";
export const DEFAULT_MODE: Mode = "dark";

/** Prefix for the localStorage keys (`<prefix>:theme`, `<prefix>:mode`). */
export const STORAGE_KEY_PREFIX = "entrepta";
