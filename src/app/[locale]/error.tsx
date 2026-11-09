"use client";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center p-6">
      <div
        role="alert"
        className="max-w-md w-full rounded-md border border-accent bg-surface p-6"
      >
        <h2 className="font-display text-lg font-bold text-text-primary">
          Gagal memuat halaman
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          {error.message ||
            "Terjadi kendala saat mengambil data dari database. Pastikan PostgreSQL sedang berjalan."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 inline-flex items-center min-h-[44px] px-4 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold hover:bg-primary/90"
        >
          Coba Muat Ulang
        </button>
      </div>
    </div>
  );
}

