"use client";

import { useState, KeyboardEvent } from "react";
import { X, UploadSimple, Plus } from "@phosphor-icons/react";
import type { UploadKind } from "@/lib/upload";

// 1. Origin UI style TagInput for Tech Stack & Blog Tags
export function TagInput({
  id,
  label,
  tags,
  onChange,
  placeholder = "Ketik nama teknologi lalu tekan Enter...",
}: {
  id: string;
  label: string;
  tags: string[];
  onChange: (nextTags: string[]) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState("");

  function addCurrentTag() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCurrentTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(tagToRemove: string) {
    onChange(tags.filter((t) => t !== tagToRemove));
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
      >
        {label}
      </label>
      <div className="rounded-sm border border-border bg-bg p-2 focus-within:border-primary">
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center gap-1 rounded-sm bg-primary-soft border border-primary/25 px-2.5 py-1 text-xs font-display font-medium text-primary"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Hapus tag ${tag}`}
                  className="inline-flex items-center justify-center w-5 h-5 rounded-sm hover:bg-primary hover:text-bg"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-2 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={addCurrentTag}
            className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1 rounded-sm border border-border bg-surface text-xs font-display font-semibold text-text-primary hover:border-primary hover:text-primary"
          >
            <Plus size={14} aria-hidden="true" />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Origin UI style File / Image Upload Dropzone with Crop Ratio Preview
export function FileUploadField({
  id,
  label,
  kind,
  value,
  onChange,
  helperText,
  aspectClass = "aspect-[16/10] w-48",
}: {
  id: string;
  label: string;
  kind: UploadKind;
  value: string;
  onChange: (url: string) => void;
  helperText: string;
  aspectClass?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal mengunggah file.");
      } else if (json.url) {
        onChange(json.url);
      }
    } catch {
      setError("Gagal menghubungi server saat mengunggah file.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
      >
        {label}
      </label>
      <p className="text-xs text-text-muted mb-2">{helperText}</p>

      <div className="flex flex-wrap items-start gap-4">
        {value && kind !== "cv" && (
          <div className="relative overflow-hidden rounded-md border border-border bg-surface p-1">
            <img
              src={value}
              alt={label}
              width={320}
              height={200}
              className={`${aspectClass} object-cover rounded-sm`}
            />
          </div>
        )}

        <div className="flex-1 min-w-[220px] space-y-2">
          <input
            id={`${id}-url`}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              kind === "cv"
                ? "/uploads/cv-anda.pdf"
                : "/uploads/nama-gambar.webp"
            }
            aria-label={`${label} URL`}
            className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
          />

          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor={id}
              className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-sm border border-primary bg-primary-soft text-primary hover:bg-primary hover:text-bg text-xs font-display font-semibold transition-colors"
            >
              <UploadSimple size={16} aria-hidden="true" />
              <span>
                {uploading ? "Memproses & Kompres WebP..." : "Pilih File dari Komputer"}
              </span>
            </label>
            <input
              id={id}
              type="file"
              accept={kind === "cv" ? ".pdf,application/pdf" : "image/*"}
              onChange={handleFileSelect}
              disabled={uploading}
              className="sr-only"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center min-h-[44px] px-3 py-2 rounded-sm border border-border text-xs font-display font-medium text-text-secondary hover:text-accent hover:border-accent"
              >
                Kosongkan
              </button>
            )}
          </div>

          {error && (
            <p role="alert" className="text-xs font-medium text-accent">
              Gagal: {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. Language Tab Switcher (ID / EN) for Admin Forms
export function LocalizedTabHeader({
  activeTab,
  onSelect,
}: {
  activeTab: "id" | "en";
  onSelect: (tab: "id" | "en") => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Bahasa input konten"
      className="inline-flex rounded-sm border border-border bg-surface p-1 mb-4"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "id"}
        onClick={() => onSelect("id")}
        className={`min-h-[36px] px-3.5 py-1.5 rounded-sm font-display text-xs font-semibold transition-colors ${
          activeTab === "id"
            ? "bg-primary text-bg"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Bahasa Indonesia (Utama)
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "en"}
        onClick={() => onSelect("en")}
        className={`min-h-[36px] px-3.5 py-1.5 rounded-sm font-display text-xs font-semibold transition-colors ${
          activeTab === "en"
            ? "bg-primary text-bg"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        English (Opsional, Fallback ke ID)
      </button>
    </div>
  );
}

