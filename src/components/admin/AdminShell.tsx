"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  House,
  UserCircle,
  Wrench,
  Briefcase,
  FolderOpen,
  NotePencil,
  AddressBook,
  GearSix,
  SignOut,
  ArrowUpRight,
  List,
  X,
} from "@phosphor-icons/react";
import { logoutAdminAction } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/public/ThemeToggle";

const NAV_LINKS = [
  { href: "/admin", label: "Ringkasan", icon: House },
  { href: "/admin/profile", label: "Profil & CV", icon: UserCircle },
  { href: "/admin/skills", label: "Keahlian (Skills)", icon: Wrench },
  { href: "/admin/experience", label: "Pengalaman", icon: Briefcase },
  { href: "/admin/projects", label: "Proyek", icon: FolderOpen },
  { href: "/admin/blog", label: "Tulisan (Blog)", icon: NotePencil },
  { href: "/admin/contacts", label: "Kontak & Sosmed", icon: AddressBook },
  { href: "/admin/settings", label: "Pengaturan Situs", icon: GearSix },
];

export function AdminShell({
  adminEmail,
  children,
}: {
  adminEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col lg:flex-row">
      {/* Mobile Top Bar with explicit "Menu" label (antislop-layoutmobile R-03) */}
      <header className="lg:hidden flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div>
          <span className="font-display text-sm font-bold text-text-primary">
            Panel Admin Portofolio
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle locale="id" />
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 min-h-[44px] px-3 py-1.5 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-primary"
          >
            <span>Lihat Situs</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="admin-mobile-nav"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-text-primary"
          >
            {mobileMenuOpen ? (
              <X size={16} aria-hidden="true" />
            ) : (
              <List size={16} aria-hidden="true" />
            )}
            <span>Menu</span>
          </button>
        </div>
      </header>

      {/* Sidebar (Desktop fixed width + Mobile collapsible) */}
      <aside
        id="admin-mobile-nav"
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:flex lg:w-64 lg:flex-col lg:justify-between border-b lg:border-b-0 lg:border-r border-border bg-surface p-5 shrink-0`}
      >
        <div>
          <div className="hidden lg:block pb-4 mb-4 border-b border-border">
            <h1 className="font-display text-base font-bold text-text-primary">
              Panel Admin
            </h1>
            <p className="mt-0.5 text-xs text-text-muted truncate">
              {adminEmail}
            </p>
          </div>

          <nav aria-label="Menu Admin">
            <ul className="space-y-1">
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-2.5 min-h-[44px] px-3 py-2 rounded-sm font-display text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-primary text-bg"
                          : "text-text-secondary hover:bg-bg hover:text-text-primary"
                      }`}
                    >
                      <Icon size={18} weight={isActive ? "fill" : "regular"} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-border space-y-2">
          <div className="hidden lg:flex items-center justify-between pb-1">
            <span className="text-xs font-display font-medium text-text-muted">
              Tema Tampilan
            </span>
            <ThemeToggle locale="id" />
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between min-h-[44px] px-3 py-2 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-primary hover:border-primary"
          >
            <span>Buka Halaman Publik</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-sm border border-border bg-bg text-xs font-display font-semibold text-accent hover:border-accent"
            >
              <SignOut size={16} aria-hidden="true" />
              <span>Keluar (Logout)</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 p-6 md:p-8 lg:p-10 max-w-5xl">
        {children}
      </main>
    </div>
  );
}

