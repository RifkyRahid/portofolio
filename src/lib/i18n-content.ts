export type LocalizedText = {
  id?: string;
  en?: string;
};

export type LocaleCode = "id" | "en";

// Fallback to ID when EN translation is empty, per spec 02-layout-content.md §4.
export function getLocalized(
  field: unknown,
  locale: LocaleCode
): string {
  if (!field || typeof field !== "object") {
    return typeof field === "string" ? field : "";
  }
  const obj = field as Record<string, unknown>;
  const primary = typeof obj[locale] === "string" ? obj[locale].trim() : "";
  if (primary) return primary;
  const fallback = typeof obj.id === "string" ? obj.id.trim() : "";
  if (fallback) return fallback;
  const enFallback = typeof obj.en === "string" ? obj.en.trim() : "";
  return enFallback;
}

export function isUsingFallbackLanguage(
  field: unknown,
  locale: LocaleCode
): boolean {
  if (locale === "id" || !field || typeof field !== "object") return false;
  const obj = field as Record<string, unknown>;
  const enVal = typeof obj.en === "string" ? obj.en.trim() : "";
  const idVal = typeof obj.id === "string" ? obj.id.trim() : "";
  return !enVal && Boolean(idVal);
}

