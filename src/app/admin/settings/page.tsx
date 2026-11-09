import { prisma } from "@/lib/prisma";
import { getLocalized } from "@/lib/i18n-content";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Pengaturan Situs, SEO &amp; Section
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Atur judul situs, deskripsi meta SEO, gambar pratinjau OG, serta tampil/sembunyikan tiap section di halaman utama.
        </p>
      </div>

      <SettingsForm
        initialData={{
          siteTitle: settings?.siteTitle ?? "Portofolio",
          metaDescriptionId: getLocalized(settings?.metaDescription, "id"),
          metaDescriptionEn: getLocalized(settings?.metaDescription, "en"),
          faviconUrl: settings?.faviconUrl ?? "",
          ogImageUrl: settings?.ogImageUrl ?? "",
          visibleSections: settings?.visibleSections ?? [
            "about",
            "skills",
            "experience",
            "projects",
            "blog",
          ],
        }}
      />
    </div>
  );
}

