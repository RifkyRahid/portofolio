import { prisma } from "@/lib/prisma";
import { ContactsManager } from "@/components/admin/ContactsManager";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const [settings, socialLinks] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Kontak &amp; Tautan Sosial Media
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Atur alamat email utama dan daftar akun sosial media yang tampil di bawah kolom kiri.
        </p>
      </div>

      <ContactsManager
        initialEmail={settings?.contactEmail ?? ""}
        initialLinks={socialLinks}
      />
    </div>
  );
}

