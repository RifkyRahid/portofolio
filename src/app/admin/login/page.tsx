"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, LockKey } from "@phosphor-icons/react";
import { loginAdminAction } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/public/ThemeToggle";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null);

  return (
    <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center p-6">
      <main className="w-full max-w-md rounded-md border border-border bg-surface p-6 md:p-8">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-display font-semibold uppercase tracking-wider text-primary hover:text-accent"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>
          <ThemeToggle locale="id" />
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-sm bg-primary text-bg">
            <LockKey size={20} weight="fill" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-text-primary">
              Masuk ke Panel Admin
            </h1>
            <p className="text-xs text-text-secondary">
              Kelola profil, proyek, pengalaman, dan tulisan portofolio.
            </p>
          </div>
        </div>

        {state?.error && (
          <div
            role="alert"
            className="mt-5 rounded-sm border border-accent bg-accent/10 px-3.5 py-2.5 text-xs font-medium text-accent"
          >
            Gagal masuk: {state.error}
          </div>
        )}

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
            >
              Alamat Email Admin
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue="admin@portfolio.local"
              placeholder="admin@portfolio.local"
              className="w-full rounded-sm border border-border bg-bg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary mb-1.5"
            >
              Kata Sandi
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              defaultValue="admin123"
              placeholder="Masukkan kata sandi..."
              className="w-full rounded-sm border border-border bg-bg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-sm bg-primary text-bg font-display text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {isPending ? "Memverifikasi..." : "Masuk ke Panel Admin"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-xs text-text-muted">
          Akun bawaan lokal: <code>admin@portfolio.local</code> / sandi:{" "}
          <code>admin123</code>
        </div>
      </main>
    </div>
  );
}

