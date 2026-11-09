"use client";

import { useState, useTransition } from "react";
import { Plus, PencilSimple, Trash, X } from "@phosphor-icons/react";
import {
  deleteProjectAction,
  reorderProjectsAction,
  saveProjectAction,
} from "@/app/admin/actions";
import {
  FileUploadField,
  LocalizedTabHeader,
  TagInput,
} from "@/components/admin/AdminWidgets";
import { SortableList } from "@/components/admin/SortableContainer";

type ProjectAdminItem = {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  summaryId: string;
  summaryEn: string;
  thumbnailUrl: string;
  tech: string[];
  liveUrl: string;
  repoUrl: string;
  year: string;
  isFeatured: boolean;
  isPublished: boolean;
  hasDetail: boolean;
  contentId: string;
  contentEn: string;
  gallery: string[];
};

const EMPTY_PROJECT: Omit<ProjectAdminItem, "id"> & { id?: string } = {
  slug: "",
  titleId: "",
  titleEn: "",
  summaryId: "",
  summaryEn: "",
  thumbnailUrl: "",
  tech: [],
  liveUrl: "",
  repoUrl: "",
  year: String(new Date().getFullYear()),
  isFeatured: true,
  isPublished: true,
  hasDetail: false,
  contentId: "",
  contentEn: "",
  gallery: [],
};

export function ProjectsManager({
  initialProjects,
}: {
  initialProjects: ProjectAdminItem[];
}) {
  const [projects, setProjects] = useState<ProjectAdminItem[]>(initialProjects);
  const [editing, setEditing] = useState<
    (Omit<ProjectAdminItem, "id"> & { id?: string }) | null
  >(null);
  const [langTab, setLangTab] = useState<"id" | "en">("id");
  const [galleryUploadUrl, setGalleryUploadUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  function startNew() {
    setEditing({ ...EMPTY_PROJECT });
    setLangTab("id");
  }

  function startEdit(item: ProjectAdminItem) {
    setEditing({ ...item });
    setLangTab("id");
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const autoSlug =
      editing.slug.trim() ||
      editing.titleId
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-");

    startTransition(async () => {
      await saveProjectAction({
        ...editing,
        slug: autoSlug,
      });
      setEditing(null);
      window.location.reload();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProjectAction(id);
      window.location.reload();
    });
  }

  function handleReorder(nextItems: ProjectAdminItem[]) {
    setProjects(nextItems);
    startTransition(async () => {
      await reorderProjectsAction(nextItems.map((p) => p.id));
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="font-display text-xs font-semibold uppercase tracking-wider text-text-muted">
          Total: {projects.length} Proyek ({projects.filter((p) => p.isFeatured).length} Featured di Beranda)
        </span>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSave}
          className="rounded-md border border-primary bg-surface p-6 space-y-5"
        >
          <h2 className="font-display text-base font-bold text-text-primary">
            {editing.id ? "Edit Proyek" : "Tambah Proyek Baru"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="proj-slug"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                Slug URL Proyek
              </label>
              <input
                id="proj-slug"
                type="text"
                value={editing.slug}
                onChange={(e) =>
                  setEditing({ ...editing, slug: e.target.value })
                }
                placeholder="otomatis-dari-judul-jika-kosong"
                className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label
                htmlFor="proj-year"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                Tahun Pembuatan
              </label>
              <input
                id="proj-year"
                type="text"
                required
                value={editing.year}
                onChange={(e) =>
                  setEditing({ ...editing, year: e.target.value })
                }
                placeholder="2026"
                className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              />
            </div>
          </div>

          {/* Toggles: Featured, Published, Has Detail Page */}
          <div className="flex flex-wrap gap-6 rounded-sm border border-border bg-bg p-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                checked={editing.isPublished}
                onChange={(e) =>
                  setEditing({ ...editing, isPublished: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <span>Published (Tayang di situs)</span>
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                checked={editing.isFeatured}
                onChange={(e) =>
                  setEditing({ ...editing, isFeatured: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <span>Featured (Tampil di Halaman Utama, disarankan 3-5)</span>
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <input
                type="checkbox"
                checked={editing.hasDetail}
                onChange={(e) =>
                  setEditing({ ...editing, hasDetail: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <span>Punya Halaman Detail / Studi Kasus (/projects/[slug])</span>
            </label>
          </div>

          {/* Localized Title & Summary */}
          <div className="pt-2 border-t border-border">
            <LocalizedTabHeader activeTab={langTab} onSelect={setLangTab} />

            {langTab === "id" ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="proj-title-id"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Judul Proyek (Bahasa Indonesia)
                  </label>
                  <input
                    id="proj-title-id"
                    type="text"
                    required
                    value={editing.titleId}
                    onChange={(e) =>
                      setEditing({ ...editing, titleId: e.target.value })
                    }
                    placeholder="Masukkan nama proyek..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="proj-summary-id"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Ringkasan Singkat 2-3 Kalimat (Bahasa Indonesia)
                  </label>
                  <textarea
                    id="proj-summary-id"
                    rows={3}
                    required
                    value={editing.summaryId}
                    onChange={(e) =>
                      setEditing({ ...editing, summaryId: e.target.value })
                    }
                    placeholder="Jelaskan masalah yang diselesaikan dan hasil utamanya..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>

                {editing.hasDetail && (
                  <div>
                    <label
                      htmlFor="proj-content-id"
                      className="block font-display text-xs font-semibold text-primary mb-1"
                    >
                      Isi Studi Kasus Lengkap (Markdown - Bahasa Indonesia)
                    </label>
                    <textarea
                      id="proj-content-id"
                      rows={8}
                      value={editing.contentId}
                      onChange={(e) =>
                        setEditing({ ...editing, contentId: e.target.value })
                      }
                      placeholder="## Latar Belakang&#10;&#10;Ceritakan arsitektur, peranmu, dan tantangan teknis..."
                      className="w-full rounded-sm border border-border bg-bg px-3 py-2.5 text-sm text-text-primary font-mono"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="proj-title-en"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Project Title (English)
                  </label>
                  <input
                    id="proj-title-en"
                    type="text"
                    value={editing.titleEn}
                    onChange={(e) =>
                      setEditing({ ...editing, titleEn: e.target.value })
                    }
                    placeholder="Falls back to Indonesian if empty..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="proj-summary-en"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Short Summary (English)
                  </label>
                  <textarea
                    id="proj-summary-en"
                    rows={3}
                    value={editing.summaryEn}
                    onChange={(e) =>
                      setEditing({ ...editing, summaryEn: e.target.value })
                    }
                    placeholder="2-3 sentences describing the project..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>

                {editing.hasDetail && (
                  <div>
                    <label
                      htmlFor="proj-content-en"
                      className="block font-display text-xs font-semibold text-primary mb-1"
                    >
                      Full Case Study Content (Markdown - English)
                    </label>
                    <textarea
                      id="proj-content-en"
                      rows={8}
                      value={editing.contentEn}
                      onChange={(e) =>
                        setEditing({ ...editing, contentEn: e.target.value })
                      }
                      placeholder="## Background&#10;&#10;Describe architecture, your role, and challenges..."
                      className="w-full rounded-sm border border-border bg-bg px-3 py-2.5 text-sm text-text-primary font-mono"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Links & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="proj-live"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                URL Demo / Situs Langsung (Opsional)
              </label>
              <input
                id="proj-live"
                type="url"
                value={editing.liveUrl}
                onChange={(e) =>
                  setEditing({ ...editing, liveUrl: e.target.value })
                }
                placeholder="https://example.com"
                className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label
                htmlFor="proj-repo"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                URL Repository GitHub (Opsional)
              </label>
              <input
                id="proj-repo"
                type="url"
                value={editing.repoUrl}
                onChange={(e) =>
                  setEditing({ ...editing, repoUrl: e.target.value })
                }
                placeholder="https://github.com/username/repo"
                className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              />
            </div>
          </div>

          <TagInput
            id="proj-tech"
            label="Tag Teknologi (Tech Stack)"
            tags={editing.tech}
            onChange={(tech) => setEditing({ ...editing, tech })}
          />

          <FileUploadField
            id="proj-thumb"
            label="Thumbnail Proyek (Rasio 16:10)"
            kind="thumbnail"
            value={editing.thumbnailUrl}
            onChange={(url) => setEditing({ ...editing, thumbnailUrl: url })}
            helperText="Rekomendasi: 1600 x 1000 px (rasio 16:10). Otomatis di-crop dan dikompres ke WebP."
          />

          {editing.hasDetail && (
            <div className="pt-4 border-t border-border space-y-4">
              <FileUploadField
                id="proj-gallery-upload"
                label="Tambah Gambar ke Galeri Studi Kasus (1920 x 1200 px)"
                kind="gallery"
                value={galleryUploadUrl}
                onChange={(url) => {
                  if (url) {
                    setEditing({
                      ...editing,
                      gallery: [...editing.gallery, url],
                    });
                    setGalleryUploadUrl("");
                  }
                }}
                helperText="Setiap gambar yang diunggah langsung masuk ke daftar galeri di bawah."
              />

              {editing.gallery.length > 0 && (
                <div>
                  <span className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-2">
                    Gambar Galeri Saat Ini ({editing.gallery.length})
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {editing.gallery.map((gUrl, idx) => (
                      <div
                        key={`${gUrl}-${idx}`}
                        className="relative rounded-sm border border-border bg-bg p-1.5"
                      >
                        <img
                          src={gUrl}
                          alt={`Galeri ${idx + 1}`}
                          width={320}
                          height={200}
                          className="w-full h-auto aspect-[16/10] object-cover rounded-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              gallery: editing.gallery.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          aria-label={`Hapus gambar galeri ${idx + 1}`}
                          className="mt-1.5 w-full inline-flex items-center justify-center gap-1 py-1 rounded-sm bg-accent text-bg text-xs font-display font-semibold"
                        >
                          <X size={12} aria-hidden="true" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center min-h-[44px] px-5 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
            >
              {isPending ? "Menyimpan..." : "Simpan Proyek"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-sm border border-border bg-bg font-display text-xs font-semibold text-text-secondary"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-secondary">
            Belum ada proyek. Klik tombol &ldquo;Tambah Proyek Baru&rdquo; untuk menampilkan karya pertamamu.
          </p>
        </div>
      ) : (
        <SortableList
          items={projects}
          onReorder={handleReorder}
          renderItem={(project) => (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {project.thumbnailUrl && (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.titleId}
                    width={120}
                    height={75}
                    className="w-28 h-auto aspect-[16/10] rounded-sm border border-border object-cover hidden sm:block"
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-display font-semibold text-text-muted">
                      {project.year}
                    </span>
                    {project.isFeatured && (
                      <span className="rounded-sm bg-primary text-bg px-2 py-0.5 text-[11px] font-display font-semibold">
                        Featured
                      </span>
                    )}
                    {!project.isPublished && (
                      <span className="rounded-sm bg-border text-text-primary px-2 py-0.5 text-[11px] font-display font-semibold">
                        Draf
                      </span>
                    )}
                    {project.hasDetail && (
                      <span className="rounded-sm bg-accent/15 text-accent border border-accent/30 px-2 py-0.5 text-[11px] font-display font-semibold">
                        Halaman Detail Aktif
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 font-display text-base font-bold text-text-primary">
                    {project.titleId}
                  </h3>
                  <p className="mt-1 text-xs text-text-secondary max-w-xl">
                    {project.summaryId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(project)}
                  className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-text-primary hover:border-primary"
                >
                  <PencilSimple size={15} aria-hidden="true" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.id)}
                  className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-accent hover:border-accent"
                >
                  <Trash size={15} aria-hidden="true" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}

