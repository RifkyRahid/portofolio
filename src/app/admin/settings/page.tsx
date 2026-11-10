import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getLocalized } from "@/lib/i18n-content";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, session] = await Promise.all([
    prisma.siteSettings.findFirst(),
    getAdminSession(),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Pengaturan Situs, SEO &amp; Keamanan Akun
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Atur judul situs, deskripsi meta SEO, visibilitas section, serta ubah email dan kata sandi login admin.
        </p>
      </div>

      <SettingsForm
        currentAdminEmail={session?.email ?? "admin@portfolio.local"}
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
