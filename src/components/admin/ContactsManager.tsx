"use client";

import { useState, useTransition } from "react";
import { Plus, Trash, CheckCircle } from "@phosphor-icons/react";
import {
  deleteSocialLinkAction,
  reorderSocialLinksAction,
  saveSocialLinkAction,
  updateContactEmailAction,
} from "@/app/admin/actions";
import { SortableList } from "@/components/admin/SortableContainer";

type SocialLinkAdmin = {
  id: string;
  platform: string;
  url: string;
  isVisible: boolean;
};

export function ContactsManager({
  initialEmail,
  initialLinks,
}: {
  initialEmail: string;
  initialLinks: SocialLinkAdmin[];
}) {
  const [email, setEmail] = useState(initialEmail);
  const [links, setLinks] = useState<SocialLinkAdmin[]>(initialLinks);
  const [platform, setPlatform] = useState("GitHub");
  const [url, setUrl] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailSaved(false);
    startTransition(async () => {
      await updateContactEmailAction(email);
      setEmailSaved(true);
    });
  }

  function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    startTransition(async () => {
      await saveSocialLinkAction({
        platform,
        url,
        isVisible: true,
      });
      setUrl("");
      window.location.reload();
    });
  }

  function handleToggleVisible(item: SocialLinkAdmin) {
    startTransition(async () => {
      await saveSocialLinkAction({
        id: item.id,
        platform: item.platform,
        url: item.url,
        isVisible: !item.isVisible,
      });
      window.location.reload();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSocialLinkAction(id);
      window.location.reload();
    });
  }

  function handleReorder(nextLinks: SocialLinkAdmin[]) {
    setLinks(nextLinks);
    startTransition(async () => {
      await reorderSocialLinksAction(nextLinks.map((l) => l.id));
    });
  }

  return (
    <div className="space-y-8">
      {/* Email Kontak Utama */}
      <form
        onSubmit={handleSaveEmail}
        className="rounded-md border border-border bg-surface p-6 space-y-4"
      >
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
          Alamat Email Kontak Utama (mailto:)
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="contact-email" className="sr-only">
            Alamat Email Kontak
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@domain.com"
            className="flex-1 min-w-[240px] max-w-md rounded-sm border border-border bg-bg px-3.5 py-2 text-sm text-text-primary"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center min-h-[44px] px-5 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
          >
            Simpan Email
          </button>
          {emailSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-display font-semibold text-primary">
              <CheckCircle size={16} weight="fill" aria-hidden="true" />
              <span>Email tersimpan.</span>
            </span>
          )}
        </div>
      </form>

      {/* Tambah Sosmed Baru */}
      <form
        onSubmit={handleAddLink}
        className="rounded-md border border-border bg-surface p-6 space-y-4"
      >
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
          Tambah Tautan Sosial Media
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="social-platform"
              className="block font-display text-xs font-semibold text-text-primary mb-1"
            >
              Platform
            </label>
            <select
              id="social-platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-text-primary"
            >
              <option value="GitHub">GitHub</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="X">X (Twitter)</option>
              <option value="YouTube">YouTube</option>
              <option value="Dribbble">Dribbble</option>
              <option value="Website">Website Lainnya</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="social-url"
              className="block font-display text-xs font-semibold text-text-primary mb-1"
            >
              URL Profil Lengkap
            </label>
            <input
              id="social-url"
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username"
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
          <span>Tambah Sosial Media</span>
        </button>
      </form>

      {/* Daftar Sosmed */}
      {links.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-8 text-center text-sm text-text-secondary">
          Belum ada tautan sosial media.
        </div>
      ) : (
        <SortableList
          items={links}
          onReorder={handleReorder}
          renderItem={(item) => (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-text-primary">
                    {item.platform}
                  </span>
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[11px] font-display font-semibold ${
                      item.isVisible
                        ? "bg-primary-soft text-primary"
                        : "bg-border text-text-primary"
                    }`}
                  >
                    {item.isVisible ? "Tampil" : "Tersembunyi"}
                  </span>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-secondary hover:text-primary underline"
                >
                  {item.url}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleVisible(item)}
                  className="min-h-[38px] px-3 py-1.5 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-text-primary hover:border-primary"
                >
                  {item.isVisible ? "Sembunyikan" : "Tampilkan"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
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

