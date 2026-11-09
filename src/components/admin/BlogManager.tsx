"use client";

import { useState, useTransition } from "react";
import { Plus, PencilSimple, Trash } from "@phosphor-icons/react";
import { deletePostAction, savePostAction } from "@/app/admin/actions";
import {
  FileUploadField,
  LocalizedTabHeader,
  TagInput,
} from "@/components/admin/AdminWidgets";

type PostAdminItem = {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string;
  excerptEn: string;
  contentId: string;
  contentEn: string;
  coverUrl: string;
  tags: string[];
  status: string;
};

const EMPTY_POST: Omit<PostAdminItem, "id"> & { id?: string } = {
  slug: "",
  titleId: "",
  titleEn: "",
  excerptId: "",
  excerptEn: "",
  contentId: "",
  contentEn: "",
  coverUrl: "",
  tags: [],
  status: "published",
};

export function BlogManager({
  initialPosts,
}: {
  initialPosts: PostAdminItem[];
}) {
  const [editing, setEditing] = useState<
    (Omit<PostAdminItem, "id"> & { id?: string }) | null
  >(null);
  const [langTab, setLangTab] = useState<"id" | "en">("id");
  const [isPending, startTransition] = useTransition();

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
      await savePostAction({
        ...editing,
        slug: autoSlug,
      });
      setEditing(null);
      window.location.reload();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePostAction(id);
      window.location.reload();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="font-display text-xs font-semibold uppercase tracking-wider text-text-muted">
          Total: {initialPosts.length} Tulisan
        </span>
        <button
          type="button"
          onClick={() => {
            setEditing({ ...EMPTY_POST });
            setLangTab("id");
          }}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSave}
          className="rounded-md border border-primary bg-surface p-6 space-y-4"
        >
          <h2 className="font-display text-base font-bold text-text-primary">
            {editing.id ? "Edit Tulisan" : "Tulis Artikel Baru"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="post-slug"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                Slug URL Artikel
              </label>
              <input
                id="post-slug"
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
                htmlFor="post-status"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                Status Publikasi
              </label>
              <select
                id="post-status"
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value })
                }
                className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              >
                <option value="published">Published (Tayang)</option>
                <option value="draft">Draft (Disembunyikan)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <LocalizedTabHeader activeTab={langTab} onSelect={setLangTab} />

            {langTab === "id" ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="post-title-id"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Judul Tulisan (Bahasa Indonesia)
                  </label>
                  <input
                    id="post-title-id"
                    type="text"
                    required
                    value={editing.titleId}
                    onChange={(e) =>
                      setEditing({ ...editing, titleId: e.target.value })
                    }
                    placeholder="Masukkan judul tulisan..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="post-excerpt-id"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Ringkasan Singkat (Bahasa Indonesia)
                  </label>
                  <textarea
                    id="post-excerpt-id"
                    rows={2}
                    required
                    value={editing.excerptId}
                    onChange={(e) =>
                      setEditing({ ...editing, excerptId: e.target.value })
                    }
                    placeholder="1-2 kalimat ringkasan artikel..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="post-content-id"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Isi Artikel (Markdown - Bahasa Indonesia)
                  </label>
                  <textarea
                    id="post-content-id"
                    rows={10}
                    required
                    value={editing.contentId}
                    onChange={(e) =>
                      setEditing({ ...editing, contentId: e.target.value })
                    }
                    placeholder="Tulis isi artikel dalam format Markdown..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2.5 text-sm text-text-primary font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="post-title-en"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Post Title (English - Opsional)
                  </label>
                  <input
                    id="post-title-en"
                    type="text"
                    value={editing.titleEn}
                    onChange={(e) =>
                      setEditing({ ...editing, titleEn: e.target.value })
                    }
                    placeholder="Boleh dikosongkan jika hanya ditulis dalam Bahasa Indonesia..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="post-excerpt-en"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Short Excerpt (English - Opsional)
                  </label>
                  <textarea
                    id="post-excerpt-en"
                    rows={2}
                    value={editing.excerptEn}
                    onChange={(e) =>
                      setEditing({ ...editing, excerptEn: e.target.value })
                    }
                    placeholder="Short summary..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="post-content-en"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Article Content (Markdown - English - Opsional)
                  </label>
                  <textarea
                    id="post-content-en"
                    rows={10}
                    value={editing.contentEn}
                    onChange={(e) =>
                      setEditing({ ...editing, contentEn: e.target.value })
                    }
                    placeholder="Jika dikosongkan, pengunjung /en akan melihat versi Bahasa Indonesia dengan keterangan otomatis..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2.5 text-sm text-text-primary font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <TagInput
            id="post-tags"
            label="Tag Topik Tulisan"
            tags={editing.tags}
            onChange={(tags) => setEditing({ ...editing, tags })}
          />

          <FileUploadField
            id="post-cover"
            label="Gambar Sampul / Cover (16:9 - Opsional)"
            kind="cover"
            value={editing.coverUrl}
            onChange={(url) => setEditing({ ...editing, coverUrl: url })}
            helperText="Rekomendasi: 1600 x 900 px (rasio 16:9)."
            aspectClass="aspect-video w-48"
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center min-h-[44px] px-5 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
            >
              {isPending ? "Menyimpan..." : "Simpan Tulisan"}
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

      {initialPosts.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-secondary">
            Belum ada artikel blog. Bagian Blog di halaman utama otomatis disembunyikan sampai ada artikel yang dipublikasikan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {initialPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-md border border-border bg-surface/70 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[11px] font-display font-semibold ${
                      post.status === "published"
                        ? "bg-primary text-bg"
                        : "bg-border text-text-primary"
                    }`}
                  >
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    /blog/{post.slug}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-base font-bold text-text-primary">
                  {post.titleId}
                </h3>
                <p className="mt-1 text-xs text-text-secondary max-w-xl">
                  {post.excerptId}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing({ ...post });
                    setLangTab("id");
                  }}
                  className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-text-primary hover:border-primary"
                >
                  <PencilSimple size={15} aria-hidden="true" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-accent hover:border-accent"
                >
                  <Trash size={15} aria-hidden="true" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

