import { STORAGE_KEY_PREFIX } from "@/lib/theme";
import { ThemeScript } from "@entrepta/registry/layout/theme-switcher";

/**
 * Inline script that runs before React hydrates so the saved theme + mode
 * are applied before first paint. Without it, every page load would flash
 * the default look until the client-side effect ran.
 */
export function ThemeInitScript() {
  return <ThemeScript storageKey={STORAGE_KEY_PREFIX} />;
}
