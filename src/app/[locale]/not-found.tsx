import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function LocaleNotFound() {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center p-6">
      <main className="max-w-md w-full rounded-md border border-border bg-surface p-8 text-center">
        <div className="font-display text-xs font-semibold uppercase tracking-wider text-accent">
          404 / Tidak Ditemukan
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-text-primary">
          Halaman Tidak Tersedia
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Halaman yang kamu cari tidak ditemukan atau studi kasus untuk proyek ini tidak diaktifkan.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-sm bg-primary text-bg font-display text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Kembali ke Halaman Utama</span>
        </Link>
      </main>
    </div>
  );
}

