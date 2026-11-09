export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center p-6">
      <div
        role="status"
        aria-live="polite"
        className="rounded-md border border-border bg-surface px-6 py-4 text-sm font-display font-medium text-text-secondary"
      >
        Memuat konten portofolio...
      </div>
    </div>
  );
}

