"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-md border border-accent bg-surface p-6 space-y-3"
    >
      <h2 className="font-display text-lg font-bold text-text-primary">
        Terjadi kendala di Panel Admin
      </h2>
      <p className="text-sm text-text-secondary">
        {error.message || "Gagal memproses permintaan. Silakan coba lagi."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-sm bg-primary text-bg font-display text-xs font-semibold"
      >
        Muat Ulang Halaman
      </button>
    </div>
  );
}

