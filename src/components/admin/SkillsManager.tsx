"use client";

import { useState, useTransition } from "react";
import { Plus, Trash, X } from "@phosphor-icons/react";
import {
  addSkillToGroupAction,
  createSkillGroupAction,
  deleteSkillAction,
  deleteSkillGroupAction,
  reorderSkillGroupsAction,
} from "@/app/admin/actions";
import { SortableList } from "@/components/admin/SortableContainer";

type SkillGroupItem = {
  id: string;
  nameId: string;
  nameEn: string;
  skills: { id: string; name: string }[];
};

export function SkillsManager({
  initialGroups,
}: {
  initialGroups: SkillGroupItem[];
}) {
  const [groups, setGroups] = useState<SkillGroupItem[]>(initialGroups);
  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleAddGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!nameId.trim()) return;
    startTransition(async () => {
      await createSkillGroupAction({ nameId, nameEn });
      setNameId("");
      setNameEn("");
      window.location.reload();
    });
  }

  function handleReorder(nextGroups: SkillGroupItem[]) {
    setGroups(nextGroups);
    startTransition(async () => {
      await reorderSkillGroupsAction(nextGroups.map((g) => g.id));
    });
  }

  function handleAddSkill(groupId: string) {
    const val = (skillInputs[groupId] || "").trim();
    if (!val) return;
    startTransition(async () => {
      await addSkillToGroupAction(groupId, val);
      setSkillInputs((prev) => ({ ...prev, [groupId]: "" }));
      window.location.reload();
    });
  }

  function handleDeleteSkill(skillId: string) {
    startTransition(async () => {
      await deleteSkillAction(skillId);
      window.location.reload();
    });
  }

  function handleDeleteGroup(groupId: string) {
    startTransition(async () => {
      await deleteSkillGroupAction(groupId);
      window.location.reload();
    });
  }

  return (
    <div className="space-y-8">
      {/* Form Tambah Grup Baru */}
      <form
        onSubmit={handleAddGroup}
        className="rounded-md border border-border bg-surface p-5 space-y-4"
      >
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
          Tambah Grup Keahlian Baru
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="new-group-id"
              className="block font-display text-xs font-semibold text-text-primary mb-1"
            >
              Nama Grup (Bahasa Indonesia)
            </label>
            <input
              id="new-group-id"
              type="text"
              required
              value={nameId}
              onChange={(e) => setNameId(e.target.value)}
              placeholder="Contoh: Bahasa Pemrograman"
              className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
            />
          </div>
          <div>
            <label
              htmlFor="new-group-en"
              className="block font-display text-xs font-semibold text-text-primary mb-1"
            >
              Nama Grup (English - Opsional)
            </label>
            <input
              id="new-group-en"
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Programming Languages"
              className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Tambah Grup</span>
        </button>
      </form>

      {/* Daftar Grup Skill */}
      {groups.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-8 text-center text-sm text-text-secondary">
          Belum ada grup keahlian. Buat grup pertama melalui formulir di atas.
        </div>
      ) : (
        <SortableList
          items={groups}
          onReorder={handleReorder}
          renderItem={(group) => (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-bold text-text-primary">
                    {group.nameId}
                  </h3>
                  {group.nameEn && (
                    <p className="text-xs text-text-muted">EN: {group.nameEn}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteGroup(group.id)}
                  disabled={isPending}
                  aria-label={`Hapus grup ${group.nameId}`}
                  className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-accent hover:border-accent"
                >
                  <Trash size={15} aria-hidden="true" />
                  <span>Hapus Grup</span>
                </button>
              </div>

              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-primary-soft border border-primary/25 px-3 py-1 text-xs font-display font-medium text-primary"
                  >
                    <span>{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill.id)}
                      aria-label={`Hapus skill ${skill.name}`}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-sm hover:bg-primary hover:text-bg"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 pt-1">
                <label htmlFor={`add-skill-${group.id}`} className="sr-only">
                  Tambah skill ke {group.nameId}
                </label>
                <input
                  id={`add-skill-${group.id}`}
                  type="text"
                  value={skillInputs[group.id] || ""}
                  onChange={(e) =>
                    setSkillInputs((prev) => ({
                      ...prev,
                      [group.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(group.id);
                    }
                  }}
                  placeholder="Tambah skill baru (mis. PostgreSQL)..."
                  className="flex-1 max-w-xs rounded-sm border border-border bg-bg px-3 py-1.5 text-xs text-text-primary"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(group.id)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-sm border border-primary bg-primary text-bg text-xs font-display font-semibold"
                >
                  <Plus size={14} aria-hidden="true" />
                  <span>Tambah Skill</span>
                </button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}

