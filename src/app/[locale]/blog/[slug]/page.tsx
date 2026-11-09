import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import {
  getLocalized,
  isUsingFallbackLanguage,
  LocaleCode,
} from "@/lib/i18n-content";
import { renderMarkdown } from "@/lib/markdown";
import { LanguageToggle } from "@/components/public/LanguageToggle";

export const dynamic = "force-dynamic";

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: LocaleCode = rawLocale === "en" ? "en" : "id";
  const prefix = locale === "en" ? "/en" : "";

  const t = await getTranslations({ locale });

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || post.status !== "published") {
    notFound();
  }

  const titleText = getLocalized(post.title, locale);
  const contentMd = getLocalized(post.content, locale);
  const contentHtml = renderMarkdown(contentMd);
  const fallbackUsed = isUsingFallbackLanguage(post.content, locale);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="mx-auto max-w-[780px] px-6 md:px-10 py-12 lg:py-20">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={prefix || "/"}
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-display font-semibold uppercase tracking-wider text-primary hover:text-accent"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>{t("actions.backToHome")}</span>
            </Link>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <Link
              href={`${prefix}/blog`}
              className="inline-flex items-center min-h-[44px] text-xs font-display font-medium text-text-secondary hover:text-primary"
            >
              {t("actions.backToBlog")}
            </Link>
          </div>
          <LanguageToggle currentLocale={locale} />
        </header>

        <main id="main-content" className="mt-10">
          {fallbackUsed && (
            <div className="mb-6 rounded-sm border border-accent/30 bg-accent/10 px-4 py-3 text-xs font-medium text-accent">
              {t("blog.onlyInOtherLang")}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-primary-soft border border-primary/20 px-2.5 py-0.5 text-xs font-display font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-[30px] lg:text-[40px] leading-[1.18] font-bold tracking-[-0.03em] text-text-primary">
            {titleText}
          </h1>

          {post.coverUrl && (
            <div className="mt-8">
              <img
                src={post.coverUrl}
                alt={titleText}
                width={1600}
                height={900}
                fetchPriority="high"
                className="w-full h-auto aspect-[16/9] rounded-md border border-border object-cover bg-surface"
              />
            </div>
          )}

          <article
            className="mt-10 prose-editorial text-[17px] leading-[1.8] max-w-[68ch]"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </main>
      </div>
    </div>
  );
}

