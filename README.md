# Website Portofolio Pribadi & Panel Admin

Aplikasi portofolio dua kolom berbasis **Next.js 15 (App Router)**, **Tailwind CSS**, **Prisma + PostgreSQL**, **`next-intl` (ID/EN)**, **`sharp`**, **`@dnd-kit/sortable`**, dan **`Phosphor Icons`**, mengikuti spesifikasi di `../docs/` serta standar kualitas `antislop` (mode **DURING**).

## 1. Persiapan & Instalasi di Lokal

Pastikan **Node.js** dan **PostgreSQL** sudah berjalan di komputer lokal.

```bash
cd portfolio
npm install
```

Salin `.env.example` ke `.env` bila belum ada, lalu sesuaikan `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:admin123@127.0.0.1:5432/portfolio_db?schema=public"
AUTH_SECRET="portfolio-local-dev-secret-key-2026-rifky-32chars"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## 2. Buat Skema Database & Jalankan Seed Awal

```bash
npm run db:setup
```

Perintah `npm run db:setup` menjalankan `prisma db push` dan `tsx prisma/seed.ts` yang otomatis menyiapkan:
- Akun admin awal:
  - **Email:** `admin@portfolio.local`
  - **Kata Sandi:** `admin123`
- Data contoh berlabel placeholder jujur (`[PLACEHOLDER ...]`) untuk Profil, Skills, Pengalaman, Proyek (dengan dan tanpa halaman studi kasus), serta Blog dalam Bahasa Indonesia dan Inggris.

## 3. Menjalankan Server Lokal

```bash
npm run dev
```

- **Halaman Utama (Bahasa Indonesia):** `http://localhost:3000`
- **Halaman Utama (English):** `http://localhost:3000/en`
- **Arsip Semua Proyek:** `http://localhost:3000/projects`
- **Panel Admin:** `http://localhost:3000/admin` (login di `http://localhost:3000/admin/login`)

## 4. Mengganti Email / Kata Sandi Admin

Untuk mengubah email atau kata sandi admin, ubah kredensial di `prisma/seed.ts` lalu jalankan `npm run db:seed`, atau perbarui langsung di tabel `admin_users`.

## 5. Kredit

Inspirasi tata letak dari [Brittany Chiang](https://brittanychiang.com), dirancang ulang dan dibangun dari nol.


