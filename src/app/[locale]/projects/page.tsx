import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { getLocalized, LocaleCode } from "@/lib/i18n-content";
import { LanguageToggle } from "@/components/public/LanguageToggle";

export const dynamic = "force-dynamic";

export default async function ProjectsArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: LocaleCode = rawLocale === "en" ? "en" : "id";
  const prefix = locale === "en" ? "/en" : "";

  const t = await getTranslations({ locale });

  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-12 lg:py-20">
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
              {t("archive.projectsTitle")}
            </h1>
            <p className="mt-2 text-[15px] text-text-secondary max-w-2xl">
              {t("archive.projectsSubtitle")}
            </p>
          </div>
          <LanguageToggle currentLocale={locale} />
        </header>

        <main id="main-content" className="mt-10">
          {projects.length === 0 ? (
            <div className="rounded-md border border-border bg-surface p-8 text-center">
              <p className="text-sm text-text-secondary">
                {t("archive.emptyProjects")}
              </p>
              <Link
                href="/admin/projects"
                className="mt-4 inline-flex items-center min-h-[44px] px-4 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
              >
                {t("footer.manageInAdmin")}
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop & Tablet Table View */}
              <div className="hidden md:block">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-xs font-display font-semibold uppercase tracking-wider text-text-muted">
                      <th className="py-3.5 pr-4 w-20">{t("archive.year")}</th>
                      <th className="py-3.5 px-4">{t("archive.project")}</th>
                      <th className="py-3.5 px-4">{t("archive.techStack")}</th>
                      <th className="py-3.5 pl-4 text-right">{t("archive.links")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm">
                    {projects.map((project) => {
                      const titleText = getLocalized(project.title, locale);
                      const summaryText = getLocalized(project.summary, locale);
                      const detailHref = `${prefix}/projects/${project.slug}`;

                      return (
                        <tr
                          key={project.id}
                          className="hover:bg-surface/70 transition-colors"
                        >
                          <td className="py-4 pr-4 font-display text-xs font-medium text-text-muted align-top">
                            {project.year}
                          </td>
                          <td className="py-4 px-4 align-top">
                            <div className="font-display font-semibold text-text-primary">
                              {project.hasDetail ? (
                                <Link
                                  href={detailHref}
                                  className="hover:text-primary underline-offset-4 hover:underline"
                                >
                                  {titleText}
                                </Link>
                              ) : (
                                <span>{titleText}</span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-text-secondary max-w-md">
                              {summaryText}
                            </p>
                          </td>
                          <td className="py-4 px-4 align-top">
                            <ul className="flex flex-wrap gap-1.5">
                              {project.tech.map((tag) => (
                                <li
                                  key={tag}
                                  className="rounded-sm bg-primary-soft border border-primary/20 px-2 py-0.5 text-xs font-display font-medium text-primary"
                                >
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-4 pl-4 align-top text-right">
                            <div className="inline-flex flex-wrap justify-end gap-3">
                              {project.hasDetail && (
                                <Link
                                  href={detailHref}
                                  className="inline-flex items-center gap-1 min-h-[44px] text-xs font-display font-semibold text-accent hover:text-primary"
                                >
                                  <span>{t("actions.viewCaseStudy")}</span>
                                </Link>
                              )}
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 min-h-[44px] text-xs font-display font-medium text-primary hover:underline"
                                >
                                  <span>{t("actions.openLiveDemo")}</span>
                                  <ArrowUpRight size={14} aria-hidden="true" />
                                </a>
                              )}
                              {project.repoUrl && (
                                <a
                                  href={project.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 min-h-[44px] text-xs font-display font-medium text-text-secondary hover:text-primary"
                                >
                                  <span>GitHub</span>
                                  <ArrowUpRight size={14} aria-hidden="true" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Reflow Stack (prevents horizontal overflow on narrow screens, R-03) */}
              <ul className="md:hidden space-y-4">
                {projects.map((project) => {
                  const titleText = getLocalized(project.title, locale);
                  const summaryText = getLocalized(project.summary, locale);
                  const detailHref = `${prefix}/projects/${project.slug}`;

                  return (
                    <li
                      key={project.id}
                      className="rounded-md border border-border bg-surface/60 p-4"
                    >
                      <div className="text-xs font-display font-medium text-text-muted">
                        {project.year}
                      </div>
                      <h2 className="mt-1 font-display text-base font-semibold text-text-primary">
                        {titleText}
                      </h2>
                      <p className="mt-1.5 text-sm text-text-secondary">
                        {summaryText}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {project.tech.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-sm bg-primary-soft border border-primary/20 px-2 py-0.5 text-xs font-display font-medium text-primary"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-3 pt-2 border-t border-border/60">
                        {project.hasDetail && (
                          <Link
                            href={detailHref}
                            className="inline-flex items-center min-h-[44px] text-xs font-display font-semibold text-accent"
                          >
                            {t("actions.viewCaseStudy")}
                          </Link>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 min-h-[44px] text-xs font-display font-medium text-primary"
                          >
                            <span>{t("actions.openLiveDemo")}</span>
                            <ArrowUpRight size={14} aria-hidden="true" />
                          </a>
                        )}
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 min-h-[44px] text-xs font-display font-medium text-text-secondary"
                          >
                            <span>GitHub</span>
                            <ArrowUpRight size={14} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

