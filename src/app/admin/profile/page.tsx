import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/i18n-content";
import { ProfileForm } from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Profil, Foto, Logo & CV
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Atur identitas di kolom kiri dan teks bagian Tentang (mendukung Markdown).
        </p>
      </div>

      <ProfileForm
        initialData={{
          name: profile?.name ?? "",
          roleId: getLocalized(profile?.role, "id"),
          roleEn: getLocalized(profile?.role, "en"),
          taglineId: getLocalized(profile?.tagline, "id"),
          taglineEn: getLocalized(profile?.tagline, "en"),
          bioId: getLocalized(profile?.bio, "id"),
          bioEn: getLocalized(profile?.bio, "en"),
          photoUrl: profile?.photoUrl ?? "",
          showPhoto: profile?.showPhoto ?? false,
          logoUrl: profile?.logoUrl ?? "",
          cvUrlId: profile?.cvUrlId ?? "",
          cvUrlEn: profile?.cvUrlEn ?? "",
          isAvailable: profile?.isAvailable ?? true,
        }}
      />
    </div>
  );
}

