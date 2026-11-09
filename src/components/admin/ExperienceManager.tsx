"use client";

import { useState, useTransition } from "react";
import { Plus, PencilSimple, Trash } from "@phosphor-icons/react";
import {
  deleteExperienceAction,
  reorderExperiencesAction,
  saveExperienceAction,
} from "@/app/admin/actions";
import {
  LocalizedTabHeader,
  TagInput,
} from "@/components/admin/AdminWidgets";
import { SortableList } from "@/components/admin/SortableContainer";

type ExperienceItem = {
  id: string;
  start: string;
  end: string;
  roleId: string;
  roleEn: string;
  company: string;
  companyUrl: string;
  descriptionId: string;
  descriptionEn: string;
  tech: string[];
};

const EMPTY_FORM: Omit<ExperienceItem, "id"> & { id?: string } = {
  start: "2025",
  end: "",
  roleId: "",
  roleEn: "",
  company: "",
  companyUrl: "",
  descriptionId: "",
  descriptionEn: "",
  tech: [],
};

export function ExperienceManager({
  initialItems,
}: {
  initialItems: ExperienceItem[];
}) {
  const [items, setItems] = useState<ExperienceItem[]>(initialItems);
  const [editing, setEditing] = useState<
    (Omit<ExperienceItem, "id"> & { id?: string }) | null
  >(null);
  const [isCurrentJob, setIsCurrentJob] = useState(true);
  const [langTab, setLangTab] = useState<"id" | "en">("id");
  const [isPending, startTransition] = useTransition();

  function startNew() {
    setEditing({ ...EMPTY_FORM });
    setIsCurrentJob(true);
    setLangTab("id");
  }

  function startEdit(item: ExperienceItem) {
    setEditing({ ...item });
    setIsCurrentJob(!item.end);
    setLangTab("id");
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    startTransition(async () => {
      await saveExperienceAction({
        ...editing,
        end: isCurrentJob ? "" : editing.end,
      });
      setEditing(null);
      window.location.reload();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteExperienceAction(id);
      window.location.reload();
    });
  }

  function handleReorder(nextItems: ExperienceItem[]) {
    setItems(nextItems);
    startTransition(async () => {
      await reorderExperiencesAction(nextItems.map((i) => i.id));
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="font-display text-xs font-semibold uppercase tracking-wider text-text-muted">
          Total: {items.length} Pengalaman
        </span>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Tambah Pengalaman</span>
        </button>
      </div>

      {editing && (
        <form
          onSubmit={handleSave}
          className="rounded-md border border-primary bg-surface p-6 space-y-4"
        >
          <h2 className="font-display text-base font-bold text-text-primary">
            {editing.id ? "Edit Pengalaman Kerja" : "Tambah Pengalaman Kerja Baru"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="exp-company"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                Nama Perusahaan / Instansi
              </label>
              <input
                id="exp-company"
                type="text"
                required
                value={editing.company}
                onChange={(e) =>
                  setEditing({ ...editing, company: e.target.value })
                }
                placeholder="Masukkan nama perusahaan..."
                className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label
                htmlFor="exp-company-url"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                URL Situs Perusahaan (Opsional)
              </label>
              <input
                id="exp-company-url"
                type="url"
                value={editing.companyUrl}
                onChange={(e) =>
                  setEditing({ ...editing, companyUrl: e.target.value })
                }
                placeholder="https://example.com"
                className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label
                htmlFor="exp-start"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                Periode Mulai
              </label>
              <input
                id="exp-start"
                type="text"
                required
                value={editing.start}
                onChange={(e) =>
                  setEditing({ ...editing, start: e.target.value })
                }
                placeholder="Contoh: 2024 atau Jan 2024"
                className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
              />
            </div>

            <div>
              <label
                htmlFor="exp-end"
                className="block font-display text-xs font-semibold text-text-primary mb-1"
              >
                Periode Selesai
              </label>
              <input
                id="exp-end"
                type="text"
                disabled={isCurrentJob}
                value={isCurrentJob ? "" : editing.end}
                onChange={(e) =>
                  setEditing({ ...editing, end: e.target.value })
                }
                placeholder={isCurrentJob ? "Sekarang / Present" : "Contoh: Des 2025"}
                className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary disabled:opacity-50"
              />
            </div>

            <div className="pb-2">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
                <input
                  type="checkbox"
                  checked={isCurrentJob}
                  onChange={(e) => setIsCurrentJob(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span>Masih bekerja di sini</span>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <LocalizedTabHeader activeTab={langTab} onSelect={setLangTab} />

            {langTab === "id" ? (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="exp-role-id"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Jabatan / Role (Bahasa Indonesia)
                  </label>
                  <input
                    id="exp-role-id"
                    type="text"
                    required
                    value={editing.roleId}
                    onChange={(e) =>
                      setEditing({ ...editing, roleId: e.target.value })
                    }
                    placeholder="Contoh: Full-Stack Web Developer"
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="exp-desc-id"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Deskripsi Singkat (Bahasa Indonesia)
                  </label>
                  <textarea
                    id="exp-desc-id"
                    rows={3}
                    value={editing.descriptionId}
                    onChange={(e) =>
                      setEditing({ ...editing, descriptionId: e.target.value })
                    }
                    placeholder="Jelaskan tanggung jawab dan dampak pekerjaan..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="exp-role-en"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Role / Title (English)
                  </label>
                  <input
                    id="exp-role-en"
                    type="text"
                    value={editing.roleEn}
                    onChange={(e) =>
                      setEditing({ ...editing, roleEn: e.target.value })
                    }
                    placeholder="e.g. Full-Stack Web Developer"
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="exp-desc-en"
                    className="block font-display text-xs font-semibold text-text-primary mb-1"
                  >
                    Short Description (English)
                  </label>
                  <textarea
                    id="exp-desc-en"
                    rows={3}
                    value={editing.descriptionEn}
                    onChange={(e) =>
                      setEditing({ ...editing, descriptionEn: e.target.value })
                    }
                    placeholder="If left empty, falls back to Indonesian..."
                    className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
                  />
                </div>
              </div>
            )}
          </div>

          <TagInput
            id="exp-tech"
            label="Teknologi yang Digunakan"
            tags={editing.tech}
            onChange={(tech) => setEditing({ ...editing, tech })}
          />

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center min-h-[44px] px-5 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
            >
              {isPending ? "Menyimpan..." : "Simpan Pengalaman"}
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

      {items.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-secondary">
            Belum ada pengalaman kerja. Karena daftar ini kosong, section Pengalaman otomatis disembunyikan di halaman utama.
          </p>
          <button
            type="button"
            onClick={startNew}
            className="mt-4 inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
          >
            <Plus size={15} aria-hidden="true" />
            <span>Tambah Pengalaman Pertama</span>
          </button>
        </div>
      ) : (
        <SortableList
          items={items}
          onReorder={handleReorder}
          renderItem={(exp) => (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-display font-medium text-text-muted">
                  {exp.start} &ndash; {exp.end || "Sekarang"}
                </div>
                <h3 className="font-display text-base font-bold text-text-primary">
                  {exp.roleId} &middot; {exp.company}
                </h3>
                <p className="mt-1 text-xs text-text-secondary max-w-2xl">
                  {exp.descriptionId}
                </p>
                {exp.tech.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <li
                        key={t}
                        className="rounded-sm bg-primary-soft border border-primary/20 px-2 py-0.5 text-xs font-display font-medium text-primary"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(exp)}
                  className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-text-primary hover:border-primary"
                >
                  <PencilSimple size={15} aria-hidden="true" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
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

