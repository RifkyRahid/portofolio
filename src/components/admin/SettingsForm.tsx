"use client";

import { useState, useTransition } from "react";
import { CheckCircle, LockKey } from "@phosphor-icons/react";
import {
  updateAdminCredentialsAction,
  updateSiteSettingsAction,
} from "@/app/admin/actions";
import {
  FileUploadField,
  LocalizedTabHeader,
} from "@/components/admin/AdminWidgets";

const ALL_SECTIONS = [
  { id: "about", label: "01. Tentang (About)" },
  { id: "skills", label: "02. Keahlian Teknis (Skills)" },
  { id: "experience", label: "03. Pengalaman Kerja (Experience)" },
  { id: "projects", label: "04. Proyek Pilihan (Projects)" },
  { id: "blog", label: "05. Catatan & Tulisan (Blog)" },
];

type SettingsData = {
  siteTitle: string;
  metaDescriptionId: string;
  metaDescriptionEn: string;
  faviconUrl: string;
  ogImageUrl: string;
  visibleSections: string[];
};

export function SettingsForm({
  currentAdminEmail,
  initialData,
}: {
  currentAdminEmail: string;
  initialData: SettingsData;
}) {
  const [form, setForm] = useState<SettingsData>(initialData);
  const [langTab, setLangTab] = useState<"id" | "en">("id");
  const [savedNotice, setSavedNotice] = useState(false);
  const [isPending, startTransition] = useTransition();

  // State for Admin Credentials form
  const [adminEmail, setAdminEmail] = useState(currentAdminEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [credStatus, setCredStatus] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [isCredPending, startCredTransition] = useTransition();

  function toggleSection(sectionId: string) {
    const exists = form.visibleSections.includes(sectionId);
    const next = exists
      ? form.visibleSections.filter((s) => s !== sectionId)
      : [...form.visibleSections, sectionId];
    setForm({ ...form, visibleSections: next });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavedNotice(false);
    startTransition(async () => {
      await updateSiteSettingsAction(form);
      setSavedNotice(true);
    });
  }

  function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCredStatus(null);
    startCredTransition(async () => {
      const res = await updateAdminCredentialsAction({
        currentPassword,
        newEmail: adminEmail,
        newPassword,
      });
      setCredStatus(res);
      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
      }
    });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Visibilitas Section */}
        <div className="rounded-md border border-border bg-surface p-6 space-y-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
            Visibilitas Section di Halaman Utama
          </h2>
          <p className="text-xs text-text-secondary">
            Section yang dinonaktifkan di sini (atau yang isinya masih kosong) otomatis hilang dari halaman utama dan menu navigasi kiri.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {ALL_SECTIONS.map((sec) => (
              <label
                key={sec.id}
                className="flex items-center gap-2.5 rounded-sm border border-border bg-bg px-3.5 py-2.5 text-sm font-medium text-text-primary"
              >
                <input
                  type="checkbox"
                  checked={form.visibleSections.includes(sec.id)}
                  onChange={() => toggleSection(sec.id)}
                  className="w-4 h-4 accent-primary"
                />
                <span>{sec.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SEO & Judul Situs */}
        <div className="rounded-md border border-border bg-surface p-6 space-y-4">
          <div>
            <label
              htmlFor="site-title"
              className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
            >
              Judul Situs (Browser Title)
            </label>
            <input
              id="site-title"
              type="text"
              required
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
            />
          </div>

          <div className="pt-2 border-t border-border">
            <LocalizedTabHeader activeTab={langTab} onSelect={setLangTab} />

            {langTab === "id" ? (
              <div>
                <label
                  htmlFor="meta-desc-id"
                  className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
                >
                  Meta Description SEO (Bahasa Indonesia)
                </label>
                <textarea
                  id="meta-desc-id"
                  rows={3}
                  value={form.metaDescriptionId}
                  onChange={(e) =>
                    setForm({ ...form, metaDescriptionId: e.target.value })
                  }
                  placeholder="Ringkasan 150-160 karakter untuk mesin pencari..."
                  className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="meta-desc-en"
                  className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
                >
                  Meta Description SEO (English)
                </label>
                <textarea
                  id="meta-desc-en"
                  rows={3}
                  value={form.metaDescriptionEn}
                  onChange={(e) =>
                    setForm({ ...form, metaDescriptionEn: e.target.value })
                  }
                  placeholder="150-160 character summary for search engines..."
                  className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
                />
              </div>
            )}
          </div>
        </div>

        {/* Favicon & OG Image */}
        <div className="rounded-md border border-border bg-surface p-6 space-y-6">
          <FileUploadField
            id="upload-favicon"
            label="Favicon (512 x 512 px)"
            kind="favicon"
            value={form.faviconUrl}
            onChange={(url) => setForm({ ...form, faviconUrl: url })}
            helperText="Rekomendasi: SVG atau PNG 512 x 512 px."
            aspectClass="aspect-square w-14"
          />

          <FileUploadField
            id="upload-og"
            label="Gambar OpenGraph / Social Preview (1200 x 630 px)"
            kind="og"
            value={form.ogImageUrl}
            onChange={(url) => setForm({ ...form, ogImageUrl: url })}
            helperText="Rekomendasi: 1200 x 630 px (muncul saat link dibagikan di WhatsApp, LinkedIn, X)."
            aspectClass="aspect-[1.91/1] w-56"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-sm bg-primary text-bg font-display text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-60"
          >
            {isPending ? "Menyimpan..." : "Simpan Pengaturan Situs"}
          </button>

          {savedNotice && (
            <span
              role="status"
              className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-primary"
            >
              <CheckCircle size={18} weight="fill" aria-hidden="true" />
              <span>Pengaturan berhasil disimpan.</span>
            </span>
          )}
        </div>
      </form>

      {/* Keamanan Akun Admin (Ubah Email & Kata Sandi) */}
      <form
        onSubmit={handleCredentialsSubmit}
        className="rounded-md border border-border bg-surface p-6 space-y-4"
      >
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-primary text-bg">
            <LockKey size={18} weight="fill" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
              Keamanan Akun Admin (Ubah Email &amp; Kata Sandi)
            </h2>
            <p className="text-xs text-text-secondary">
              Ganti email dan kata sandi bawaan dengan kredensial pribadimu yang kuat.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label
              htmlFor="admin-new-email"
              className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
            >
              Email Admin Baru
            </label>
            <input
              id="admin-new-email"
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
            />
          </div>

          <div>
            <label
              htmlFor="admin-current-password"
              className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
            >
              Kata Sandi Saat Ini (Wajib)
            </label>
            <input
              id="admin-current-password"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan sandi lama..."
              className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>

          <div>
            <label
              htmlFor="admin-new-password"
              className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
            >
              Kata Sandi Baru (Min. 8 Karakter)
            </label>
            <input
              id="admin-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Kosongkan jika hanya ganti email"
              className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isCredPending}
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-sm bg-accent text-bg font-display text-xs font-semibold uppercase tracking-wider hover:bg-accent/90 disabled:opacity-60"
          >
            {isCredPending ? "Memperbarui..." : "Perbarui Email & Kata Sandi"}
          </button>

          {credStatus && (
            <span
              role="status"
              className={`text-xs font-display font-semibold ${
                credStatus.ok ? "text-primary" : "text-accent"
              }`}
            >
              {credStatus.message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
