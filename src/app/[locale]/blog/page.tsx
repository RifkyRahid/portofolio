import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { getLocalized, LocaleCode } from "@/lib/i18n-content";
import { LanguageToggle } from "@/components/public/LanguageToggle";

export const dynamic = "force-dynamic";

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: LocaleCode = rawLocale === "en" ? "en" : "id";
  const prefix = locale === "en" ? "/en" : "";

  const t = await getTranslations({ locale });

  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="mx-auto max-w-[880px] px-6 md:px-10 py-12 lg:py-20">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border">
          <div>
            <Link
              href={prefix || "/"}
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-display font-semibold uppercase tracking-wider text-primary hover:text-accent transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>{t("actions.backToHome")}</span>
            </Link>
            <h1 className="mt-2 font-display text-[32px] lg:text-[42px] font-bold tracking-[-0.03em] text-text-primary">
              {t("blog.title")}
            </h1>
            <p className="mt-2 text-[15px] text-text-secondary max-w-xl">
              {t("blog.subtitle")}
            </p>
          </div>
          <LanguageToggle currentLocale={locale} />
        </header>

        <main id="main-content" className="mt-10">
          {posts.length === 0 ? (
            <div className="rounded-md border border-border bg-surface p-8 text-center">
              <p className="text-sm text-text-secondary">{t("blog.emptyPosts")}</p>
            </div>
          ) : (
            <ul className="space-y-8">
              {posts.map((post) => {
                const titleText = getLocalized(post.title, locale);
                const excerptText = getLocalized(post.excerpt, locale);
                const yearLabel = post.publishedAt
                  ? new Date(post.publishedAt).getFullYear()
                  : new Date().getFullYear();

                return (
                  <li
                    key={post.id}
                    className="group rounded-md border border-border bg-surface/50 p-6 transition-colors hover:bg-surface"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-display text-text-muted">
                      <span>{yearLabel}</span>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm bg-primary-soft border border-primary/20 px-2 py-0.5 text-primary font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="mt-2 font-display text-xl font-semibold text-text-primary group-hover:text-primary transition-colors">
                      <Link
                        href={`${prefix}/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5"
                      >
                        <span>{titleText}</span>
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </Link>
                    </h2>

                    <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                      {excerptText}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}

