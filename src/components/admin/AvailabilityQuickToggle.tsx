"use client";

import { useState, useTransition } from "react";
import { toggleAvailabilityAction } from "@/app/admin/actions";

export function AvailabilityQuickToggle({
  isAvailable: initialAvailable,
}: {
  isAvailable: boolean;
}) {
  const [available, setAvailable] = useState(initialAvailable);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !available;
    setAvailable(next);
    startTransition(async () => {
      await toggleAvailabilityAction(next);
    });
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-2">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 rounded-full ${
          available ? "bg-primary" : "bg-text-muted"
        }`}
      />
      <span className="font-display text-xs font-semibold text-text-primary">
        Status: {available ? "Terbuka untuk Kerja" : "Tidak Aktif Mencari"}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={available}
        disabled={isPending}
        onClick={handleToggle}
        className="min-h-[36px] px-3 py-1 rounded-sm border border-primary text-xs font-display font-semibold text-primary hover:bg-primary hover:text-bg transition-colors"
      >
        {isPending ? "Menyimpan..." : "Ubah Status"}
      </button>
    </div>
  );
}

