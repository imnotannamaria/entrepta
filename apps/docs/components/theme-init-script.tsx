import { MODE_STORAGE_KEY, THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Inline script that runs before React hydrates so the saved theme + mode
 * are applied before first paint. Without it, every page load would flash
 * the default look until the client-side effect ran.
 */
export function ThemeInitScript() {
  const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY
  )});if(t)document.documentElement.setAttribute('data-theme',t);var m=localStorage.getItem(${JSON.stringify(
    MODE_STORAGE_KEY
  )});if(m==='light')document.documentElement.setAttribute('data-mode','light');}catch(e){}})();`;
  // biome-ignore lint/security/noDangerouslySetInnerHtml: the script body is a static string we control; no user input is interpolated.
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
