"use client";

import { useState, useTransition } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { updateProfileAction } from "@/app/admin/actions";
import {
  FileUploadField,
  LocalizedTabHeader,
} from "@/components/admin/AdminWidgets";

type ProfileFormData = {
  name: string;
  roleId: string;
  roleEn: string;
  taglineId: string;
  taglineEn: string;
  bioId: string;
  bioEn: string;
  photoUrl: string;
  showPhoto: boolean;
  logoUrl: string;
  cvUrlId: string;
  cvUrlEn: string;
  isAvailable: boolean;
};

export function ProfileForm({
  initialData,
}: {
  initialData: ProfileFormData;
}) {
  const [form, setForm] = useState<ProfileFormData>(initialData);
  const [langTab, setLangTab] = useState<"id" | "en">("id");
  const [isPending, startTransition] = useTransition();
  const [savedNotice, setSavedNotice] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavedNotice(false);
    startTransition(async () => {
      await updateProfileAction(form);
      setSavedNotice(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md border border-border bg-surface p-6 space-y-5">
        <div>
          <label
            htmlFor="profile-name"
            className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
          >
            Nama Lengkap (H1)
          </label>
          <input
            id="profile-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Masukkan nama lengkap..."
            className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
          />
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="inline-flex items-center gap-2.5 text-sm font-medium text-text-primary">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm({ ...form, isAvailable: e.target.checked })
              }
              className="w-4 h-4 accent-primary"
            />
            <span>Tampilkan status &ldquo;Terbuka untuk kerja&rdquo;</span>
          </label>

          <label className="inline-flex items-center gap-2.5 text-sm font-medium text-text-primary">
            <input
              type="checkbox"
              checked={form.showPhoto}
              onChange={(e) =>
                setForm({ ...form, showPhoto: e.target.checked })
              }
              className="w-4 h-4 accent-primary"
            />
            <span>Tampilkan Foto Profil di kolom kiri (grayscale ke warna saat hover)</span>
          </label>
        </div>
      </div>

      {/* Localized Fields (ID / EN) */}
      <div className="rounded-md border border-border bg-surface p-6 space-y-4">
        <LocalizedTabHeader activeTab={langTab} onSelect={setLangTab} />

        {langTab === "id" ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="role-id"
                className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
              >
                Role / Jabatan (Bahasa Indonesia)
              </label>
              <input
                id="role-id"
                type="text"
                value={form.roleId}
                onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                placeholder="Contoh: Full-Stack Web Developer"
                className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label
                htmlFor="tagline-id"
                className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
              >
                Tagline Singkat 1 Kalimat (Bahasa Indonesia)
              </label>
              <input
                id="tagline-id"
                type="text"
                value={form.taglineId}
                onChange={(e) =>
                  setForm({ ...form, taglineId: e.target.value })
                }
                placeholder="Maksimal sekitar 80-100 karakter..."
                className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label
                htmlFor="bio-id"
                className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
              >
                Bio Bagian Tentang (Markdown - Bahasa Indonesia)
              </label>
              <p className="text-xs text-text-muted mb-2">
                Gunakan **teks tebal** untuk memberi warna aksen Rust (#733324) pada kata kunci penting.
              </p>
              <textarea
                id="bio-id"
                rows={6}
                value={form.bioId}
                onChange={(e) => setForm({ ...form, bioId: e.target.value })}
                placeholder="Tulis 2-3 paragraf tentang dirimu..."
                className="w-full rounded-sm border border-border bg-bg px-3.5 py-2.5 text-sm text-text-primary leading-relaxed"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="role-en"
                className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
              >
                Role / Title (English)
              </label>
              <input
                id="role-en"
                type="text"
                value={form.roleEn}
                onChange={(e) => setForm({ ...form, roleEn: e.target.value })}
                placeholder="e.g. Full-Stack Web Developer"
                className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label
                htmlFor="tagline-en"
                className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
              >
                One-Line Tagline (English)
              </label>
              <input
                id="tagline-en"
                type="text"
                value={form.taglineEn}
                onChange={(e) =>
                  setForm({ ...form, taglineEn: e.target.value })
                }
                placeholder="Short one-sentence summary..."
                className="w-full rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label
                htmlFor="bio-en"
                className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
              >
                About Bio (Markdown - English)
              </label>
              <textarea
                id="bio-en"
                rows={6}
                value={form.bioEn}
                onChange={(e) => setForm({ ...form, bioEn: e.target.value })}
                placeholder="If left empty, the Indonesian bio will be shown as fallback..."
                className="w-full rounded-sm border border-border bg-bg px-3.5 py-2.5 text-sm text-text-primary leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* Uploads: Photo, Logo, CV */}
      <div className="rounded-md border border-border bg-surface p-6 space-y-6">
        <FileUploadField
          id="upload-avatar"
          label="Foto Profil (1:1)"
          kind="avatar"
          value={form.photoUrl}
          onChange={(url) => setForm({ ...form, photoUrl: url })}
          helperText="Rekomendasi: 800 x 800 px (rasio 1:1). Otomatis di-crop dan dikompres ke WebP."
          aspectClass="aspect-square w-24"
        />

        <FileUploadField
          id="upload-logo"
          label="Logo Pribadi (Opsional)"
          kind="logo"
          value={form.logoUrl}
          onChange={(url) => setForm({ ...form, logoUrl: url })}
          helperText="Rekomendasi: SVG atau PNG transparan 512 x 512 px."
          aspectClass="aspect-square w-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border">
          <FileUploadField
            id="upload-cv-id"
            label="File CV Bahasa Indonesia (PDF)"
            kind="cv"
            value={form.cvUrlId}
            onChange={(url) => setForm({ ...form, cvUrlId: url })}
            helperText="Maksimal 10 MB (PDF). Ditampilkan sebagai tombol unduh di bawah bagian Pengalaman."
          />

          <FileUploadField
            id="upload-cv-en"
            label="File CV English (PDF - Opsional)"
            kind="cv"
            value={form.cvUrlEn}
            onChange={(url) => setForm({ ...form, cvUrlEn: url })}
            helperText="Jika dikosongkan, halaman /en akan memakai file CV Bahasa Indonesia."
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-sm bg-primary text-bg font-display text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-60"
        >
          {isPending ? "Menyimpan Perubahan..." : "Simpan Profil"}
        </button>

        {savedNotice && (
          <span
            role="status"
            className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-primary"
          >
            <CheckCircle size={18} weight="fill" aria-hidden="true" />
            <span>Profil berhasil diperbarui dan halaman publik telah disegarkan.</span>
          </span>
        )}
      </div>
    </form>
  );
}

