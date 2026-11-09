import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/i18n-content";
import { SkillsManager } from "@/components/admin/SkillsManager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const groups = await prisma.skillGroup.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      skills: { orderBy: { sortOrder: "asc" } },
    },
  });

  const serialized = groups.map((g) => ({
    id: g.id,
    nameId: getLocalized(g.name, "id"),
    nameEn: getLocalized(g.name, "en"),
    skills: g.skills.map((s) => ({
      id: s.id,
      name: s.name,
    })),
  }));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Kelola Keahlian (Skills)
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Kelompokkan keahlian teknis per kategori dan atur urutannya dengan drag &amp; drop atau tombol panah.
        </p>
      </div>

      <SkillsManager initialGroups={serialized} />
    </div>
  );
}

