import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/i18n-content";
import { BlogManager } from "@/components/admin/BlogManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const serialized = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleId: getLocalized(p.title, "id"),
    titleEn: getLocalized(p.title, "en"),
    excerptId: getLocalized(p.excerpt, "id"),
    excerptEn: getLocalized(p.excerpt, "en"),
    contentId: getLocalized(p.content, "id"),
    contentEn: getLocalized(p.content, "en"),
    coverUrl: p.coverUrl ?? "",
    tags: p.tags,
    status: p.status,
  }));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Kelola Tulisan (Blog)
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Tulis cerita di balik proyek atau catatan belajar teknis. Jika belum ada tulisan yang berstatus Published, bagian Blog otomatis disembunyikan dari halaman utama.
        </p>
      </div>

      <BlogManager initialPosts={serialized} />
    </div>
  );
}

