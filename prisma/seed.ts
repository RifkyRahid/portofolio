import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@portfolio.local" },
    update: { passwordHash },
    create: {
      email: "admin@portfolio.local",
      passwordHash,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteTitle: "Rifky | Portofolio Pengembang Web",
      metaDescription: {
        id: "[PLACEHOLDER SEO] Portofolio pengembang web dan arsip proyek teknis. Ubah deskripsi ini di Panel Admin.",
        en: "[PLACEHOLDER SEO] Web developer portfolio and technical project archive. Update this description in the Admin Panel.",
      },
      contactEmail: "email@example.com",
      visibleSections: ["about", "skills", "experience", "projects", "blog"],
    },
  });

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Rifky [NAMA LENGKAP]",
      role: {
        id: "Full-Stack Web Developer [CONTOH ROLE]",
        en: "Full-Stack Web Developer [SAMPLE ROLE]",
      },
      tagline: {
        id: "Membangun aplikasi web yang rapi, cepat, dan mudah dipelihara dengan fokus pada kebutuhan nyata.",
        en: "Building clean, fast, and maintainable web applications focused on real needs.",
      },
      bio: {
        id: "**[PLACEHOLDER BIO - UBAH DI PANEL ADMIN]** Paragraf ini adalah contoh tata letak bagian Tentang. Kamu bisa mengedit teks ini langsung dari menu **Profil** di halaman admin menggunakan format Markdown.\n\nFokus utamaku adalah merancang dan membangun aplikasi web dari skema database **PostgreSQL** hingga antarmuka pengguna dengan **Next.js** dan **Tailwind CSS**.\n\nSaat ini aku juga mengelola layanan mandiri di **VPS Linux** menggunakan Nginx, Prisma, dan PM2.",
        en: "**[BIO PLACEHOLDER - EDIT IN ADMIN PANEL]** This paragraph shows how the About section reads on screen. You can replace this text anytime from the **Profile** menu inside the admin panel using Markdown.\n\nMy main focus is designing and building web applications from **PostgreSQL** database schemas up to user interfaces with **Next.js** and **Tailwind CSS**.\n\nI also manage self-hosted deployments on **Linux VPS** using Nginx, Prisma, and PM2.",
      },
      photoUrl: "/uploads/placeholder-avatar.svg",
      showPhoto: true,
      logoUrl: "",
      cvUrlId: "",
      cvUrlEn: "",
      isAvailable: true,
    },
  });

  await prisma.skillGroup.deleteMany({});

  const langGroup = await prisma.skillGroup.create({
    data: {
      name: { id: "Bahasa Pemrograman", en: "Programming Languages" },
      sortOrder: 1,
      skills: {
        create: [
          { name: "TypeScript", sortOrder: 1 },
          { name: "JavaScript", sortOrder: 2 },
          { name: "SQL", sortOrder: 3 },
          { name: "HTML & CSS", sortOrder: 4 },
        ],
      },
    },
  });

  const fwGroup = await prisma.skillGroup.create({
    data: {
      name: { id: "Framework & Library", en: "Frameworks & Libraries" },
      sortOrder: 2,
      skills: {
        create: [
          { name: "Next.js", sortOrder: 1 },
          { name: "React", sortOrder: 2 },
          { name: "Tailwind CSS", sortOrder: 3 },
          { name: "Node.js", sortOrder: 4 },
        ],
      },
    },
  });

  const dbToolsGroup = await prisma.skillGroup.create({
    data: {
      name: { id: "Database & Infrastruktur", en: "Database & Infrastructure" },
      sortOrder: 3,
      skills: {
        create: [
          { name: "PostgreSQL", sortOrder: 1 },
          { name: "Prisma ORM", sortOrder: 2 },
          { name: "Nginx", sortOrder: 3 },
          { name: "PM2 & Linux VPS", sortOrder: 4 },
          { name: "Git", sortOrder: 5 },
        ],
      },
    },
  });

  void langGroup;
  void fwGroup;
  void dbToolsGroup;

  await prisma.experience.deleteMany({});
  await prisma.experience.createMany({
    data: [
      {
        start: "2024",
        end: null,
        role: {
          id: "[CONTOH POSISI] Pengembang Web Freelance",
          en: "[SAMPLE ROLE] Freelance Web Developer",
        },
        company: "[NAMA PERUSAHAAN / KLIEN]",
        companyUrl: "https://example.com",
        description: {
          id: "[PLACEHOLDER PENGALAMAN] Ganti dengan riwayat pekerjaan atau proyek klien aslimu melalui menu Pengalaman di panel admin. Jika dikosongkan, bagian ini otomatis disembunyikan.",
          en: "[EXPERIENCE PLACEHOLDER] Replace with your actual work history or client projects in the Experience menu inside the admin panel. If left empty, this section hides automatically.",
        },
        tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Nginx"],
        sortOrder: 1,
      },
    ],
  });

  await prisma.project.deleteMany({});
  await prisma.project.createMany({
    data: [
      {
        slug: "katalog-mobil-contoh",
        title: {
          id: "[CONTOH PROYEK 01] Katalog Mobil Baru & Bekas",
          en: "[SAMPLE PROJECT 01] New & Used Car Catalog",
        },
        summary: {
          id: "[PLACEHOLDER PROYEK DENGAN HALAMAN DETAIL] Contoh proyek yang mengaktifkan halaman studi kasus. Klik kartu ini untuk melihat halaman detail proyek beserta galeri gambar.",
          en: "[PROJECT PLACEHOLDER WITH CASE STUDY] Sample project with the detailed case study page enabled. Click this item to view the full case study layout and image gallery.",
        },
        thumbnailUrl: "/uploads/placeholder-project-1.svg",
        tech: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Nginx"],
        liveUrl: "https://example.com",
        repoUrl: "https://github.com",
        year: "2026",
        isFeatured: true,
        isPublished: true,
        hasDetail: true,
        content: {
          id: "## Latar Belakang\n\n**[PLACEHOLDER STUDI KASUS]** Ini adalah contoh isi halaman detail proyek yang ditulis dengan Markdown di panel admin. Kamu bisa menonaktifkan halaman detail per proyek jika ingin klik kartu langsung menuju tautan situs.\n\n## Peran & Arsitektur\n\n- Merancang skema database relasional di **PostgreSQL** menggunakan **Prisma ORM**.\n- Menyiapkan pencarian dan penyaringan spesifikasi kendaraan.\n- Mengatur proses *deployment* mandiri di VPS dengan **Nginx** dan **PM2**.\n\n## Hasil\n\nTulis hasil nyata yang terukur di sini setelah proyek selesai (atau hapus bagian ini jika belum ada metrik yang diukur).",
          en: "## Background\n\n**[CASE STUDY PLACEHOLDER]** This is a sample project case study written in Markdown from the admin panel. You can disable the detail page per project if you prefer clicking the card to open the live URL directly.\n\n## Role & Architecture\n\n- Designed the relational database schema in **PostgreSQL** using **Prisma ORM**.\n- Built vehicle specification search and filtering.\n- Configured self-hosted VPS deployment with **Nginx** and **PM2**.\n\n## Outcome\n\nWrite verifiable outcomes here once measured (or remove this section if no metrics were recorded).",
        },
        gallery: [
          "/uploads/placeholder-project-1.svg",
          "/uploads/placeholder-project-2.svg",
        ],
        sortOrder: 1,
      },
      {
        slug: "arsitektur-vps-deployment",
        title: {
          id: "[CONTOH PROYEK 02] Otomasi Deploy Multi-Aplikasi di VPS",
          en: "[SAMPLE PROJECT 02] Multi-App VPS Deployment Setup",
        },
        summary: {
          id: "[PLACEHOLDER PROYEK TANPA HALAMAN DETAIL] Contoh proyek dengan opsi halaman detail nonaktif. Klik judul proyek ini akan langsung membuka tautan eksternal di tab baru.",
          en: "[PROJECT PLACEHOLDER WITHOUT DETAIL PAGE] Sample project with the detail page turned off. Clicking this project opens its external link directly in a new tab.",
        },
        thumbnailUrl: "/uploads/placeholder-project-2.svg",
        tech: ["Linux VPS", "Nginx", "PM2", "PostgreSQL", "Bash"],
        liveUrl: "https://github.com",
        repoUrl: "https://github.com",
        year: "2026",
        isFeatured: true,
        isPublished: true,
        hasDetail: false,
        content: { id: "", en: "" },
        gallery: [],
        sortOrder: 2,
      },
    ],
  });

  await prisma.post.deleteMany({});
  await prisma.post.create({
    data: {
      slug: "catatan-setup-postgresql-dan-pm2-di-vps",
      title: {
        id: "[CONTOH TULISAN] Cara Menjalankan Beberapa Aplikasi Next.js dan PostgreSQL di Satu VPS",
        en: "[SAMPLE POST] Running Multiple Next.js and PostgreSQL Apps on a Single VPS",
      },
      excerpt: {
        id: "[PLACEHOLDER BLOG] Contoh artikel catatan belajar teknis. Jika kamu menghapus atau menjadikan draf semua tulisan di admin, menu Blog akan otomatis disembunyikan dari halaman utama.",
        en: "[BLOG PLACEHOLDER] Sample technical learning note. If you unpublish or delete all posts in the admin panel, the Writing section automatically hides from the homepage.",
      },
      content: {
        id: "**[PLACEHOLDER ISI BLOG]** Tulisan ini adalah contoh bagaimana artikel teknis tampil di portofolio kamu.\n\n## Isolasi Database dan Port\n\nSaat menjalankan lebih dari satu aplikasi di satu VPS, pisahkan masing-masing aplikasi menggunakan:\n\n1. Database dan pengguna PostgreSQL terpisah.\n2. Port lokal tersendiri yang dikelola oleh PM2.\n3. Konfigurasi *server block* terpisah di Nginx.\n\n```bash\npm2 start npm --name \"portfolio-web\" -- start\npm2 save\n```",
        en: "**[BLOG CONTENT PLACEHOLDER]** This post shows how technical articles render on your portfolio.\n\n## Database and Port Isolation\n\nWhen running more than one application on a single VPS, isolate each app using:\n\n1. Separate PostgreSQL databases and users.\n2. Dedicated local ports managed by PM2.\n3. Separate Nginx server blocks.\n\n```bash\npm2 start npm --name \"portfolio-web\" -- start\npm2 save\n```",
      },
      coverUrl: "/uploads/placeholder-project-2.svg",
      tags: ["VPS", "Nginx", "PostgreSQL", "Next.js"],
      status: "published",
    },
  });

  await prisma.socialLink.deleteMany({});
  await prisma.socialLink.createMany({
    data: [
      {
        platform: "GitHub",
        url: "https://github.com",
        isVisible: true,
        sortOrder: 1,
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com",
        isVisible: true,
        sortOrder: 2,
      },
      {
        platform: "Instagram",
        url: "https://instagram.com",
        isVisible: true,
        sortOrder: 3,
      },
    ],
  });

  console.log("Seed selesai dijalankan.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

