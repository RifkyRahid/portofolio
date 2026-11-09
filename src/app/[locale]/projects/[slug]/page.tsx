import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { getLocalized, LocaleCode } from "@/lib/i18n-content";
import { renderMarkdown } from "@/lib/markdown";
import { LanguageToggle } from "@/components/public/LanguageToggle";
import { GalleryLightbox } from "@/components/public/GalleryLightbox";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: LocaleCode = rawLocale === "en" ? "en" : "id";
  const prefix = locale === "en" ? "/en" : "";

  const t = await getTranslations({ locale });

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project || !project.isPublished || !project.hasDetail) {
    notFound();
  }

  const titleText = getLocalized(project.title, locale);
  const summaryText = getLocalized(project.summary, locale);
  const contentMd = getLocalized(project.content, locale);
  const contentHtml = renderMarkdown(contentMd);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="mx-auto max-w-[920px] px-6 md:px-10 py-12 lg:py-20">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={prefix || "/"}
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-display font-semibold uppercase tracking-wider text-primary hover:text-accent transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>{t("actions.backToHome")}</span>
            </Link>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <Link
              href={`${prefix}/projects`}
              className="inline-flex items-center min-h-[44px] text-xs font-display font-medium text-text-secondary hover:text-primary"
            >
              {t("actions.backToProjects")}
            </Link>
          </div>
          <LanguageToggle currentLocale={locale} />
        </header>

        <main id="main-content" className="mt-10">
          <div className="text-xs font-display font-semibold uppercase tracking-wider text-accent">
            {t("projectDetail.year")}: {project.year}
          </div>

          <h1 className="mt-2 font-display text-[32px] lg:text-[44px] leading-[1.15] font-bold tracking-[-0.03em] text-text-primary">
            {titleText}
          </h1>

          <p className="mt-4 text-[16px] lg:text-[18px] leading-relaxed text-text-secondary">
            {summaryText}
          </p>

          {/* Tech stack & external links */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border">
            <div>
              <div className="text-xs font-display font-semibold uppercase tracking-wider text-text-muted mb-2">
                {t("projectDetail.techStack")}
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {project.tech.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-sm bg-primary-soft border border-primary/25 px-3 py-1 text-xs font-display font-medium text-primary"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  <span>{t("actions.openLiveDemo")}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-sm border border-border bg-surface text-text-primary font-display text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
                >
                  <span>{t("actions.openRepo")}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Hero thumbnail with fetchpriority="high" and explicit dimensions (R-40) */}
          {project.thumbnailUrl && (
            <div className="mt-8">
              <img
                src={project.thumbnailUrl}
                alt={titleText}
                width={1600}
                height={1000}
                fetchPriority="high"
                className="w-full h-auto aspect-[16/10] rounded-md border border-border object-cover bg-surface"
              />
            </div>
          )}

          {/* Case study Markdown content */}
          {contentHtml && (
            <article
              className="mt-10 prose-editorial text-[16px] lg:text-[17px]"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}

          {/* Gallery Lightbox */}
          {project.gallery.length > 0 && (
            <section className="mt-14 pt-8 border-t border-border">
              <h2 className="font-display text-lg font-semibold text-text-primary mb-6">
                {t("projectDetail.gallery")}
              </h2>
              <GalleryLightbox
                images={project.gallery}
                projectTitle={titleText}
                enlargeLabel={t("projectDetail.enlargeImage")}
                closeLabel={t("projectDetail.closeImage")}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

