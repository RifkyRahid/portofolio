"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function LanguageToggle({ currentLocale }: { currentLocale: "id" | "en" }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(targetLocale: "id" | "en") {
    if (targetLocale === currentLocale) return;

    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Strip existing /en or /id prefix if present
    let cleanPath = pathname.replace(/^\/(en|id)(?=\/|$)/, "");
    if (!cleanPath) cleanPath = "/";

    const nextPath =
      targetLocale === "en"
        ? cleanPath === "/"
          ? "/en"
          : `/en${cleanPath}`
        : cleanPath;

    startTransition(() => {
      router.push(nextPath);
      router.refresh();
    });
  }

  return (
    <div className="inline-flex items-center gap-2">
      <ThemeToggle locale={currentLocale} />
      <div
        role="group"
        aria-label={
          currentLocale === "en" ? "Language selector" : "Pemilih bahasa"
        }
        className="inline-flex items-center rounded-full border border-border bg-bg/95 p-1 text-xs font-display font-semibold tracking-wider"
      >
        <button
          type="button"
          onClick={() => switchLocale("id")}
          disabled={isPending}
          aria-pressed={currentLocale === "id"}
          className={`min-h-[36px] min-w-[44px] px-3 py-1.5 rounded-full transition-colors duration-150 ${
            currentLocale === "id"
              ? "bg-primary text-bg"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          ID
        </button>
        <button
          type="button"
          onClick={() => switchLocale("en")}
          disabled={isPending}
          aria-pressed={currentLocale === "en"}
          className={`min-h-[36px] min-w-[44px] px-3 py-1.5 rounded-full transition-colors duration-150 ${
            currentLocale === "en"
              ? "bg-primary text-bg"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
