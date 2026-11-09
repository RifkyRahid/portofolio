import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/i18n-content";
import { ExperienceManager } from "@/components/admin/ExperienceManager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const serialized = experiences.map((e) => ({
    id: e.id,
    start: e.start,
    end: e.end ?? "",
    roleId: getLocalized(e.role, "id"),
    roleEn: getLocalized(e.role, "en"),
    company: e.company,
    companyUrl: e.companyUrl ?? "",
    descriptionId: getLocalized(e.description, "id"),
    descriptionEn: getLocalized(e.description, "en"),
    tech: e.tech,
  }));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Kelola Pengalaman Kerja
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Tambah atau ubah riwayat pekerjaan dan magang. Jika daftar ini kosong, section Pengalaman otomatis disembunyikan di halaman publik.
        </p>
      </div>

      <ExperienceManager initialItems={serialized} />
    </div>
  );
}

