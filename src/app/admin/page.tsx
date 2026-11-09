import Link from "next/link";
import {
  FolderOpen,
  NotePencil,
  UserCircle,
  Wrench,
  Briefcase,
  GearSix,
} from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { AvailabilityQuickToggle } from "@/components/admin/AvailabilityQuickToggle";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    profile,
    publishedProjects,
    draftProjects,
    publishedPosts,
    draftPosts,
    skillGroupsCount,
    experiencesCount,
  ] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.project.count({ where: { isPublished: false } }),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.skillGroup.count(),
    prisma.experience.count(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Ringkasan Konten Portofolio
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Kelola isi halaman utama, proyek, dan pengaturan status kerja langsung dari sini.
          </p>
        </div>
        <AvailabilityQuickToggle isAvailable={profile?.isAvailable ?? true} />
      </div>

      {/* Real content status overview (no invented analytics/charts per antislop-ui) */}
      <section aria-label="Status isi konten">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-md border border-border bg-surface p-5">
            <div className="text-xs font-display font-semibold uppercase tracking-wider text-text-muted">
              Proyek Tayang
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-primary">
              {publishedProjects} Proyek
            </div>
            <div className="mt-1 text-xs text-text-secondary">
              {draftProjects} tersimpan sebagai draf
            </div>
            <Link
              href="/admin/projects"
              className="mt-4 inline-flex items-center gap-1.5 min-h-[44px] text-xs font-display font-semibold text-primary hover:text-accent underline underline-offset-4"
            >
              <FolderOpen size={15} aria-hidden="true" />
              <span>Kelola Proyek</span>
            </Link>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <div className="text-xs font-display font-semibold uppercase tracking-wider text-text-muted">
              Tulisan Blog
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-primary">
              {publishedPosts} Artikel
            </div>
            <div className="mt-1 text-xs text-text-secondary">
              {draftPosts} draf belum dipublikasikan
            </div>
            <Link
              href="/admin/blog"
              className="mt-4 inline-flex items-center gap-1.5 min-h-[44px] text-xs font-display font-semibold text-primary hover:text-accent underline underline-offset-4"
            >
              <NotePencil size={15} aria-hidden="true" />
              <span>Kelola Tulisan</span>
            </Link>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <div className="text-xs font-display font-semibold uppercase tracking-wider text-text-muted">
              Kategori Keahlian
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">
              {skillGroupsCount} Grup
            </div>
            <div className="mt-1 text-xs text-text-secondary">
              Dikelompokkan per jenis teknologi
            </div>
            <Link
              href="/admin/skills"
              className="mt-4 inline-flex items-center gap-1.5 min-h-[44px] text-xs font-display font-semibold text-primary hover:text-accent underline underline-offset-4"
            >
              <Wrench size={15} aria-hidden="true" />
              <span>Atur Skills</span>
            </Link>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <div className="text-xs font-display font-semibold uppercase tracking-wider text-text-muted">
              Riwayat Pengalaman
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-text-primary">
              {experiencesCount} Entri
            </div>
            <div className="mt-1 text-xs text-text-secondary">
              Otomatis tersembunyi jika kosong
            </div>
            <Link
              href="/admin/experience"
              className="mt-4 inline-flex items-center gap-1.5 min-h-[44px] text-xs font-display font-semibold text-primary hover:text-accent underline underline-offset-4"
            >
              <Briefcase size={15} aria-hidden="true" />
              <span>Atur Pengalaman</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions-heading" className="pt-2">
        <h2
          id="quick-actions-heading"
          className="font-display text-sm font-semibold uppercase tracking-wider text-text-primary mb-4"
        >
          Pintasan Pengelolaan
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-sm bg-primary text-bg font-display text-xs font-semibold hover:bg-primary/90"
          >
            <UserCircle size={17} aria-hidden="true" />
            <span>Edit Profil, Foto & CV</span>
          </Link>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-sm border border-primary bg-primary-soft text-primary font-display text-xs font-semibold hover:bg-primary hover:text-bg transition-colors"
          >
            <FolderOpen size={17} aria-hidden="true" />
            <span>Tambah / Edit Proyek</span>
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-sm border border-border bg-surface text-text-primary font-display text-xs font-semibold hover:border-primary"
          >
            <GearSix size={17} aria-hidden="true" />
            <span>Atur Visibilitas Section & SEO</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

