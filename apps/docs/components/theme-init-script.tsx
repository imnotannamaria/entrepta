import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Inline script that runs before React hydrates so the saved theme is
 * applied before first paint. Without it, every page load would flash
 * the default theme until the client-side effect ran.
 */
export function ThemeInitScript() {
  const script = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY
  )});if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
  // biome-ignore lint/security/noDangerouslySetInnerHtml: the script body is a static string we control; no user input is interpolated.
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
