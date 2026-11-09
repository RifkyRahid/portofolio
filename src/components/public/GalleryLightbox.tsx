"use client";

import { useEffect, useState } from "react";
import { X, ArrowsOutSimple } from "@phosphor-icons/react";

export function GalleryLightbox({
  images,
  projectTitle,
  enlargeLabel,
  closeLabel,
}: {
  images: string[];
  projectTitle: string;
  enlargeLabel: string;
  closeLabel: string;
}) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUrl) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedUrl(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedUrl]);

  if (images.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((imgUrl, index) => (
          <button
            key={`${imgUrl}-${index}`}
            type="button"
            onClick={() => setSelectedUrl(imgUrl)}
            aria-label={`${enlargeLabel}: ${projectTitle} (${index + 1})`}
            className="group relative block w-full overflow-hidden rounded-md border border-border bg-surface text-left transition-colors duration-150 hover:border-primary"
          >
            <img
              src={imgUrl}
              alt={`${projectTitle} - screenshot ${index + 1}`}
              width={1920}
              height={1200}
              loading="lazy"
              className="w-full h-auto aspect-[16/10] object-cover"
            />
            <span className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-display font-medium text-text-secondary group-hover:text-primary">
              <ArrowsOutSimple size={15} aria-hidden="true" />
              <span>
                {enlargeLabel} #{index + 1}
              </span>
            </span>
          </button>
        ))}
      </div>

      {selectedUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} preview`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2A2E]/85 p-4 md:p-8"
          onClick={() => setSelectedUrl(null)}
        >
          <div
            className="relative max-w-5xl w-full rounded-md bg-bg p-3 border border-border shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-border">
              <span className="text-xs font-display font-semibold uppercase tracking-wider text-text-secondary">
                {projectTitle}
              </span>
              <button
                type="button"
                onClick={() => setSelectedUrl(null)}
                aria-label={closeLabel}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-sm border border-border bg-surface text-text-primary hover:border-primary hover:text-primary text-xs font-display font-semibold"
              >
                <X size={16} aria-hidden="true" />
                <span>{closeLabel}</span>
              </button>
            </div>
            <img
              src={selectedUrl}
              alt={projectTitle}
              width={1920}
              height={1200}
              className="w-full h-auto max-h-[78vh] object-contain rounded-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}

