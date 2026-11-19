"use client";

import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { resolveTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
    </svg>
  );
}

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("storage", onChange);

  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Theme {
  return resolveTheme(
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.classList.toggle("dark", next === "dark");

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable in private contexts; the class still applies.
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Ganti tema"
      aria-pressed={theme === "dark"}
      onClick={toggleTheme}
      className={className}
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
