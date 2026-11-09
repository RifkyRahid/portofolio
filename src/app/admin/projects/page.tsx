import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/i18n-content";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const serialized = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleId: getLocalized(p.title, "id"),
    titleEn: getLocalized(p.title, "en"),
    summaryId: getLocalized(p.summary, "id"),
    summaryEn: getLocalized(p.summary, "en"),
    thumbnailUrl: p.thumbnailUrl ?? "",
    tech: p.tech,
    liveUrl: p.liveUrl ?? "",
    repoUrl: p.repoUrl ?? "",
    year: p.year,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    hasDetail: p.hasDetail,
    contentId: getLocalized(p.content, "id"),
    contentEn: getLocalized(p.content, "en"),
    gallery: p.gallery,
  }));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Kelola Proyek Portofolio
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Atur proyek unggulan (Featured), status publikasi, dan saklar opsional &ldquo;Punya halaman detail&rdquo; per proyek.
        </p>
      </div>

      <ProjectsManager initialProjects={serialized} />
    </div>
  );
}

