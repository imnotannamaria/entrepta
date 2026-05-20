"use client";

import { DEFAULT_MODE, DEFAULT_THEME, STORAGE_KEY_PREFIX, THEMES } from "@/lib/theme";
import { ThemeSwitcher as RegistryThemeSwitcher } from "@entrepta/registry/layout/theme-switcher";

export function ThemeSwitcher() {
  return (
    <RegistryThemeSwitcher
      themes={THEMES}
      defaultTheme={DEFAULT_THEME}
      defaultMode={DEFAULT_MODE}
      storageKey={STORAGE_KEY_PREFIX}
    />
  );
}
