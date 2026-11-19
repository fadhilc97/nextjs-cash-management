export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Resolves a stored theme preference. Only the exact value "dark" opts into
 * dark mode; everything else is light-first. System preference is never read.
 */
export function resolveTheme(value: string | null | undefined): Theme {
  return value === "dark" ? "dark" : "light";
}

/**
 * Inline script that applies the saved theme before first paint so the page
 * never flashes the light theme while hydrating.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;
