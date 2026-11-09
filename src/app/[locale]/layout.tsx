import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CursorSpotlight } from "@/components/public/CursorSpotlight";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "id" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-bg focus:rounded-sm focus:font-display focus:text-sm focus:font-semibold"
      >
        {locale === "en" ? "Skip to main content" : "Lewati ke konten utama"}
      </a>
      <CursorSpotlight />
      {children}
    </NextIntlClientProvider>
  );
}
