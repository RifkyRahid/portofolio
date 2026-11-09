"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

export function ThemeToggle({ locale = "id" }: { locale?: "id" | "en" }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const nextDark = !document.documentElement.classList.contains("dark");
    if (nextDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("portfolio_theme", "dark");
      } catch {
        // ignore storage errors
      }
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("portfolio_theme", "light");
      } catch {
        // ignore storage errors
      }
    }
    setIsDark(nextDark);
  }

  const label =
    locale === "en"
      ? isDark
        ? "Switch to light mode"
        : "Switch to dark mode"
      : isDark
      ? "Ganti ke tema terang"
      : "Ganti ke tema gelap";

  const modeText =
    locale === "en"
      ? isDark
        ? "Dark"
        : "Light"
      : isDark
      ? "Gelap"
      : "Terang";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={mounted ? isDark : undefined}
      title={label}
      className="inline-flex items-center gap-2 min-h-[44px] rounded-full border border-border bg-bg/95 px-3.5 py-1.5 text-xs font-display font-semibold tracking-wider text-text-primary hover:border-primary hover:text-primary transition-colors duration-150"
    >
      {mounted && isDark ? (
        <Moon size={16} weight="fill" aria-hidden="true" className="text-primary" />
      ) : (
        <Sun size={16} weight="fill" aria-hidden="true" className="text-accent" />
      )}
      <span>{modeText}</span>
    </button>
  );
}

