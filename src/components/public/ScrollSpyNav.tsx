"use client";

import { useEffect, useState } from "react";

export type NavSectionItem = {
  id: string;
  indexLabel: string;
  label: string;
};

export function ScrollSpyNav({ items }: { items: NavSectionItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: 0.05,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Section navigation" className="hidden lg:block mt-10">
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setActiveId(item.id)}
                aria-current={isActive ? "location" : undefined}
                className="group inline-flex items-center py-2.5 min-h-[44px] text-xs font-display uppercase tracking-[0.08em] transition-colors duration-150"
              >
                <span
                  aria-hidden="true"
                  className={`mr-3 h-[2px] transition-all duration-150 ${
                    isActive
                      ? "w-16 bg-primary"
                      : "w-8 bg-border group-hover:w-12 group-hover:bg-text-secondary"
                  }`}
                />
                <span className="mr-2 text-accent font-semibold">
                  {item.indexLabel}
                </span>
                <span
                  className={
                    isActive
                      ? "text-primary font-semibold"
                      : "text-text-secondary group-hover:text-text-primary font-medium"
                  }
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

