import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, FilePdf, FolderOpen, NotePencil } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { getLocalized, LocaleCode } from "@/lib/i18n-content";
import { renderMarkdown } from "@/lib/markdown";
import { LanguageToggle } from "@/components/public/LanguageToggle";
import { ScrollSpyNav, NavSectionItem } from "@/components/public/ScrollSpyNav";
import { SocialBar } from "@/components/public/SocialBar";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: LocaleCode = rawLocale === "en" ? "en" : "id";
  const prefix = locale === "en" ? "/en" : "";

  const t = await getTranslations({ locale });

  const [profile, settings, skillGroups, experiences, featuredProjects, recentPosts, socialLinks] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.siteSettings.findFirst(),
      prisma.skillGroup.findMany({
        orderBy: { sortOrder: "asc" },
        include: { skills: { orderBy: { sortOrder: "asc" } } },
      }),
      prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.project.findMany({
        where: { isPublished: true, isFeatured: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.post.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.socialLink.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

  const visibleSet = new Set(
    settings?.visibleSections ?? ["about", "skills", "experience", "projects", "blog"]
  );

  const bioMarkdown = getLocalized(profile?.bio, locale);
  const bioHtml = renderMarkdown(bioMarkdown);

  const showAbout = visibleSet.has("about") && Boolean(bioMarkdown.trim());
  const nonEmptySkillGroups = skillGroups.filter((g) => g.skills.length > 0);
  const showSkills = visibleSet.has("skills") && nonEmptySkillGroups.length > 0;
  const showExperience = visibleSet.has("experience") && experiences.length > 0;
  const showProjects = visibleSet.has("projects") && featuredProjects.length > 0;
  const showBlog = visibleSet.has("blog") && recentPosts.length > 0;

  const navItems: NavSectionItem[] = [];
  let sectionCounter = 1;
  const nextIndex = () => String(sectionCounter++).padStart(2, "0");

  const aboutIndex = showAbout ? nextIndex() : "";
  if (showAbout) {
    navItems.push({ id: "about", indexLabel: aboutIndex, label: t("nav.about") });
  }
  const skillsIndex = showSkills ? nextIndex() : "";
  if (showSkills) {
    navItems.push({ id: "skills", indexLabel: skillsIndex, label: t("nav.skills") });
  }
  const experienceIndex = showExperience ? nextIndex() : "";
  if (showExperience) {
    navItems.push({
      id: "experience",
      indexLabel: experienceIndex,
      label: t("nav.experience"),
    });
  }
  const projectsIndex = showProjects ? nextIndex() : "";
  if (showProjects) {
    navItems.push({
      id: "projects",
      indexLabel: projectsIndex,
      label: t("nav.projects"),
    });
  }
  const blogIndex = showBlog ? nextIndex() : "";
  if (showBlog) {
    navItems.push({ id: "blog", indexLabel: blogIndex, label: t("nav.blog") });
  }

  const cvUrl =
    locale === "en"
      ? profile?.cvUrlEn || profile?.cvUrlId
      : profile?.cvUrlId || profile?.cvUrlEn;

  return (
    <div className="min-h-screen bg-bg text-text-primary relative">
      {/* Top bar for Language Toggle */}
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-12 pt-5 lg:pt-0">
        <div className="flex justify-end lg:fixed lg:top-6 lg:right-8 lg:z-40">
          <LanguageToggle currentLocale={locale} />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-12">
        <div className="lg:flex lg:justify-between lg:gap-12">
          {/* LEFT COLUMN (Sticky on Desktop >= 1024px) */}
          <header className="pt-8 pb-12 lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[44%] lg:flex-col lg:justify-between lg:py-10 xl:py-14">
            <div>
              {profile?.showPhoto && profile?.photoUrl && (
                <div className="mb-4">
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    width={96}
                    height={96}
                    fetchPriority="high"
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-md object-cover border border-border grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                {profile?.logoUrl && (
                  <img
                    src={profile.logoUrl}
                    alt={`${profile.name} logo`}
                    width={36}
                    height={36}
                    className="w-9 h-9 object-contain"
                  />
                )}
                <h1 className="font-display text-[34px] leading-[1.1] lg:text-[42px] font-bold tracking-[-0.03em] text-text-primary">
                  {profile?.name ?? "Rifky"}
                </h1>
              </div>

              <p className="mt-2 font-display text-[17px] lg:text-[19px] font-medium text-primary">
                {getLocalized(profile?.role, locale)}
              </p>

              <p className="mt-2.5 max-w-md text-[14px] lg:text-[15px] leading-[1.6] text-text-secondary">
                {getLocalized(profile?.tagline, locale)}
              </p>

              {/* Availability Status Indicator (static dot per R-19, no endless pulse) */}
              <div className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-display font-medium text-text-primary">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ${
                    profile?.isAvailable ? "bg-primary" : "bg-text-muted"
                  }`}
                />
                <span>
                  {profile?.isAvailable
                    ? t("status.available")
                    : t("status.unavailable")}
                </span>
              </div>

              <ScrollSpyNav items={navItems} />
            </div>

            <div className="mt-6 lg:mt-4">
              <SocialBar
                links={socialLinks}
                email={settings?.contactEmail}
                emailLabel={t("actions.sendEmail")}
              />
            </div>
          </header>

          {/* RIGHT COLUMN (Scrolling Content) */}
          <main
            id="main-content"
            className="pb-20 lg:w-[56%] lg:py-10 xl:py-14 space-y-16 lg:space-y-24"
          >
            {/* 01 ABOUT */}
            {showAbout && (
              <section id="about" aria-labelledby="heading-about" className="scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-bg/95 border-b border-border/60 lg:static lg:mx-0 lg:px-0 lg:py-0 lg:bg-transparent lg:border-0 mb-6">
                  <h2
                    id="heading-about"
                    className="flex items-center gap-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-text-primary"
                  >
                    <span className="text-accent">{aboutIndex}</span>
                    <span>{t("sections.about")}</span>
                    <span aria-hidden="true" className="ml-2 h-[1px] flex-1 bg-border" />
                  </h2>
                </div>
                <div
                  className="prose-editorial text-[15px] lg:text-[16px]"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              </section>
            )}

            {/* 02 SKILLS */}
            {showSkills && (
              <section id="skills" aria-labelledby="heading-skills" className="scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-bg/95 border-b border-border/60 lg:static lg:mx-0 lg:px-0 lg:py-0 lg:bg-transparent lg:border-0 mb-6">
                  <h2
                    id="heading-skills"
                    className="flex items-center gap-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-text-primary"
                  >
                    <span className="text-accent">{skillsIndex}</span>
                    <span>{t("sections.skills")}</span>
                    <span aria-hidden="true" className="ml-2 h-[1px] flex-1 bg-border" />
                  </h2>
                </div>

                <div className="space-y-6">
                  {nonEmptySkillGroups.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-md border border-border/80 bg-surface/50 p-4 md:p-5"
                    >
                      <h3 className="font-display text-sm font-semibold text-text-primary mb-3">
                        {getLocalized(group.name, locale)}
                      </h3>
                      <ul className="flex flex-wrap gap-2">
                        {group.skills.map((skill) => (
                          <li
                            key={skill.id}
                            className="inline-flex items-center rounded-sm bg-primary-soft border border-primary/25 px-3 py-1.5 text-xs font-display font-medium text-primary"
                          >
                            {skill.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 03 EXPERIENCE */}
            {showExperience && (
              <section
                id="experience"
                aria-labelledby="heading-experience"
                className="scroll-mt-24"
              >
                <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-bg/95 border-b border-border/60 lg:static lg:mx-0 lg:px-0 lg:py-0 lg:bg-transparent lg:border-0 mb-6">
                  <h2
                    id="heading-experience"
                    className="flex items-center gap-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-text-primary"
                  >
                    <span className="text-accent">{experienceIndex}</span>
                    <span>{t("sections.experience")}</span>
                    <span aria-hidden="true" className="ml-2 h-[1px] flex-1 bg-border" />
                  </h2>
                </div>

                <ol className="group/list space-y-12">
                  {experiences.map((exp) => {
                    const roleText = getLocalized(exp.role, locale);
                    const descText = getLocalized(exp.description, locale);
                    const endLabel =
                      exp.end && exp.end.trim()
                        ? exp.end
                        : locale === "en"
                        ? "Present"
                        : "Sekarang";

                    return (
                      <li
                        key={exp.id}
                        className="group relative rounded-md p-4 -mx-4 transition-all duration-150 hover:bg-surface lg:group-hover/list:opacity-60 lg:hover:!opacity-100"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                          <div className="text-xs font-display font-medium uppercase tracking-wider text-text-muted pt-1">
                            {exp.start} &ndash; {endLabel}
                          </div>
                          <div className="md:col-span-3">
                            <h3 className="font-display text-[16px] font-semibold text-text-primary group-hover:text-primary transition-colors">
                              {exp.companyUrl ? (
                                <a
                                  href={exp.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5"
                                >
                                  <span>
                                    {roleText} &middot; {exp.company}
                                  </span>
                                  <ArrowUpRight
                                    size={15}
                                    aria-hidden="true"
                                    className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  />
                                </a>
                              ) : (
                                <span>
                                  {roleText} &middot; {exp.company}
                                </span>
                              )}
                            </h3>

                            {descText && (
                              <p className="mt-2 text-[15px] leading-[1.7] text-text-secondary">
                                {descText}
                              </p>
                            )}

                            {exp.tech.length > 0 && (
                              <ul className="mt-3 flex flex-wrap gap-1.5">
                                {exp.tech.map((tag) => (
                                  <li
                                    key={tag}
                                    className="rounded-sm bg-primary-soft border border-primary/20 px-2.5 py-1 text-xs font-display font-medium text-primary"
                                  >
                                    {tag}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {cvUrl && (
                  <div className="mt-8">
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-sm bg-primary text-bg font-display text-xs font-semibold tracking-wide hover:bg-primary/90 transition-colors"
                    >
                      <FilePdf size={18} aria-hidden="true" />
                      <span>{t("actions.viewResume")}</span>
                    </a>
                  </div>
                )}
              </section>
            )}

            {/* 04 PROJECTS */}
            {showProjects && (
              <section
                id="projects"
                aria-labelledby="heading-projects"
                className="scroll-mt-24"
              >
                <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-bg/95 border-b border-border/60 lg:static lg:mx-0 lg:px-0 lg:py-0 lg:bg-transparent lg:border-0 mb-6">
                  <h2
                    id="heading-projects"
                    className="flex items-center gap-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-text-primary"
                  >
                    <span className="text-accent">{projectsIndex}</span>
                    <span>{t("sections.projects")}</span>
                    <span aria-hidden="true" className="ml-2 h-[1px] flex-1 bg-border" />
                  </h2>
                </div>

                <ul className="group/list space-y-12">
                  {featuredProjects.map((project, idx) => {
                    const titleText = getLocalized(project.title, locale);
                    const summaryText = getLocalized(project.summary, locale);
                    const detailHref = `${prefix}/projects/${project.slug}`;
                    const externalHref = project.liveUrl || project.repoUrl || "#projects";

                    return (
                      <li
                        key={project.id}
                        className="group relative rounded-md p-4 -mx-4 transition-all duration-150 hover:bg-surface lg:group-hover/list:opacity-60 lg:hover:!opacity-100"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 items-start">
                          {project.thumbnailUrl && (
                            <div className="md:col-span-4">
                              <img
                                src={project.thumbnailUrl}
                                alt={titleText}
                                width={320}
                                height={200}
                                fetchPriority={idx === 0 ? "high" : "auto"}
                                loading={idx === 0 ? "eager" : "lazy"}
                                className="w-full h-auto aspect-[16/10] rounded-md border border-border object-cover bg-surface"
                              />
                            </div>
                          )}

                          <div
                            className={
                              project.thumbnailUrl ? "md:col-span-8" : "md:col-span-12"
                            }
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-display font-medium text-text-muted">
                                {project.year}
                              </span>
                              {project.hasDetail && (
                                <span className="rounded-sm bg-accent/10 border border-accent/30 px-2 py-0.5 text-[11px] font-display font-semibold text-accent">
                                  {t("actions.viewCaseStudy")}
                                </span>
                              )}
                            </div>

                            <h3 className="mt-1 font-display text-[16px] font-semibold text-text-primary group-hover:text-primary transition-colors">
                              {project.hasDetail ? (
                                <Link
                                  href={detailHref}
                                  className="inline-flex items-center gap-1.5"
                                >
                                  <span>{titleText}</span>
                                  <ArrowUpRight
                                    size={15}
                                    aria-hidden="true"
                                    className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  />
                                </Link>
                              ) : (
                                <a
                                  href={externalHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5"
                                >
                                  <span>{titleText}</span>
                                  <ArrowUpRight
                                    size={15}
                                    aria-hidden="true"
                                    className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  />
                                </a>
                              )}
                            </h3>

                            <p className="mt-2 text-[15px] leading-[1.65] text-text-secondary">
                              {summaryText}
                            </p>

                            {project.tech.length > 0 && (
                              <ul className="mt-3 flex flex-wrap gap-1.5">
                                {project.tech.map((tag) => (
                                  <li
                                    key={tag}
                                    className="rounded-sm bg-primary-soft border border-primary/20 px-2.5 py-1 text-xs font-display font-medium text-primary"
                                  >
                                    {tag}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Explicit action links with 44px touch height */}
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              {project.hasDetail && (
                                <Link
                                  href={detailHref}
                                  className="inline-flex items-center gap-1 min-h-[44px] text-xs font-display font-semibold text-primary hover:text-accent underline underline-offset-4"
                                >
                                  <span>{t("actions.viewCaseStudy")}</span>
                                </Link>
                              )}
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 min-h-[44px] text-xs font-display font-medium text-text-secondary hover:text-primary underline underline-offset-4"
                                >
                                  <span>{t("actions.openLiveDemo")}</span>
                                  <ArrowUpRight size={13} aria-hidden="true" />
                                </a>
                              )}
                              {project.repoUrl && (
                                <a
                                  href={project.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 min-h-[44px] text-xs font-display font-medium text-text-secondary hover:text-primary underline underline-offset-4"
                                >
                                  <span>{t("actions.openRepo")}</span>
                                  <ArrowUpRight size={13} aria-hidden="true" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8">
                  <Link
                    href={`${prefix}/projects`}
                    className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-sm border border-primary text-primary hover:bg-primary hover:text-bg font-display text-xs font-semibold tracking-wide transition-colors"
                  >
                    <FolderOpen size={17} aria-hidden="true" />
                    <span>{t("actions.viewAllProjects")}</span>
                  </Link>
                </div>
              </section>
            )}

            {/* 05 BLOG */}
            {showBlog && (
              <section id="blog" aria-labelledby="heading-blog" className="scroll-mt-24">
                <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-bg/95 border-b border-border/60 lg:static lg:mx-0 lg:px-0 lg:py-0 lg:bg-transparent lg:border-0 mb-6">
                  <h2
                    id="heading-blog"
                    className="flex items-center gap-2.5 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-text-primary"
                  >
                    <span className="text-accent">{blogIndex}</span>
                    <span>{t("sections.blog")}</span>
                    <span aria-hidden="true" className="ml-2 h-[1px] flex-1 bg-border" />
                  </h2>
                </div>

                <ul className="group/list space-y-6">
                  {recentPosts.map((post) => {
                    const postTitle = getLocalized(post.title, locale);
                    const postExcerpt = getLocalized(post.excerpt, locale);
                    const yearLabel = post.publishedAt
                      ? new Date(post.publishedAt).getFullYear()
                      : new Date().getFullYear();

                    return (
                      <li
                        key={post.id}
                        className="group rounded-md p-4 -mx-4 transition-all duration-150 hover:bg-surface lg:group-hover/list:opacity-60 lg:hover:!opacity-100"
                      >
                        <div className="flex items-baseline gap-3">
                          <span className="text-xs font-display font-medium text-text-muted shrink-0">
                            {yearLabel}
                          </span>
                          <div>
                            <h3 className="font-display text-[16px] font-semibold text-text-primary group-hover:text-primary transition-colors">
                              <Link
                                href={`${prefix}/blog/${post.slug}`}
                                className="inline-flex items-center gap-1.5"
                              >
                                <span>{postTitle}</span>
                                <ArrowUpRight
                                  size={15}
                                  aria-hidden="true"
                                  className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                              </Link>
                            </h3>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">
                              {postExcerpt}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6">
                  <Link
                    href={`${prefix}/blog`}
                    className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-sm border border-border text-text-primary hover:border-primary hover:text-primary font-display text-xs font-semibold tracking-wide transition-colors"
                  >
                    <NotePencil size={16} aria-hidden="true" />
                    <span>{t("actions.viewAllPosts")}</span>
                  </Link>
                </div>
              </section>
            )}

            {/* FOOTER */}
            <footer className="pt-8 border-t border-border text-xs text-text-muted flex flex-wrap items-center justify-between gap-4">
              <p>
                &copy; {new Date().getFullYear()} {profile?.name ?? "Rifky"} &middot;{" "}
                {t("footer.inspiredBy")}{" "}
                <a
                  href="https://brittanychiang.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary underline underline-offset-4 transition-colors"
                >
                  Brittany Chiang
                </a>
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

