"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sanitizeExternalUrl } from "@/lib/markdown";
import {
  checkLoginRateLimit,
  clearAdminSessionCookie,
  clearLoginRateLimit,
  getAdminSession,
  setAdminSessionCookie,
} from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Tidak memiliki akses. Silakan login ulang.");
  }
  return session;
}

function revalidateAllPublicPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  revalidatePath("/projects");
  revalidatePath("/en/projects");
  revalidatePath("/blog");
  revalidatePath("/en/blog");
  revalidatePath("/admin", "layout");
}

export async function loginAdminAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  const reqHeaders = await headers();
  const clientIp =
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rateKey = `${clientIp}:${email}`;

  const rate = checkLoginRateLimit(rateKey);
  if (!rate.allowed) {
    return {
      error: `Terlalu banyak percobaan login. Coba lagi dalam ${
        rate.retryAfterSeconds ?? 60
      } detik.`,
    };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || !admin.passwordHash) {
    return { error: "Email atau kata sandi tidak sesuai." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "Email atau kata sandi tidak sesuai." };
  }

  clearLoginRateLimit(rateKey);
  await setAdminSessionCookie({ id: admin.id, email: admin.email });
  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

export async function toggleAvailabilityAction(isAvailable: boolean) {
  await requireAdmin();
  await prisma.profile.updateMany({
    data: { isAvailable },
  });
  revalidateAllPublicPaths();
}

export async function updateProfileAction(data: {
  name: string;
  roleId: string;
  roleEn: string;
  taglineId: string;
  taglineEn: string;
  bioId: string;
  bioEn: string;
  photoUrl: string;
  showPhoto: boolean;
  logoUrl: string;
  cvUrlId: string;
  cvUrlEn: string;
  isAvailable: boolean;
}) {
  await requireAdmin();
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      name: data.name.trim(),
      role: { id: data.roleId.trim(), en: data.roleEn.trim() },
      tagline: { id: data.taglineId.trim(), en: data.taglineEn.trim() },
      bio: { id: data.bioId, en: data.bioEn },
      photoUrl: data.photoUrl.trim() || null,
      showPhoto: data.showPhoto,
      logoUrl: data.logoUrl.trim() || null,
      cvUrlId: data.cvUrlId.trim() || null,
      cvUrlEn: data.cvUrlEn.trim() || null,
      isAvailable: data.isAvailable,
    },
    create: {
      id: 1,
      name: data.name.trim(),
      role: { id: data.roleId.trim(), en: data.roleEn.trim() },
      tagline: { id: data.taglineId.trim(), en: data.taglineEn.trim() },
      bio: { id: data.bioId, en: data.bioEn },
      photoUrl: data.photoUrl.trim() || null,
      showPhoto: data.showPhoto,
      logoUrl: data.logoUrl.trim() || null,
      cvUrlId: data.cvUrlId.trim() || null,
      cvUrlEn: data.cvUrlEn.trim() || null,
      isAvailable: data.isAvailable,
    },
  });
  revalidateAllPublicPaths();
}

// SKILLS ACTIONS
export async function createSkillGroupAction(data: {
  nameId: string;
  nameEn: string;
}) {
  await requireAdmin();
  const count = await prisma.skillGroup.count();
  await prisma.skillGroup.create({
    data: {
      name: { id: data.nameId.trim(), en: data.nameEn.trim() },
      sortOrder: count + 1,
    },
  });
  revalidateAllPublicPaths();
}

export async function updateSkillGroupAction(
  id: string,
  data: { nameId: string; nameEn: string }
) {
  await requireAdmin();
  await prisma.skillGroup.update({
    where: { id },
    data: {
      name: { id: data.nameId.trim(), en: data.nameEn.trim() },
    },
  });
  revalidateAllPublicPaths();
}

export async function deleteSkillGroupAction(id: string) {
  await requireAdmin();
  await prisma.skillGroup.delete({ where: { id } });
  revalidateAllPublicPaths();
}

export async function reorderSkillGroupsAction(orderedIds: string[]) {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, idx) =>
      prisma.skillGroup.update({
        where: { id },
        data: { sortOrder: idx + 1 },
      })
    )
  );
  revalidateAllPublicPaths();
}

export async function addSkillToGroupAction(groupId: string, name: string) {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) return;
  const count = await prisma.skill.count({ where: { groupId } });
  await prisma.skill.create({
    data: {
      groupId,
      name: trimmed,
      sortOrder: count + 1,
    },
  });
  revalidateAllPublicPaths();
}

export async function deleteSkillAction(skillId: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id: skillId } });
  revalidateAllPublicPaths();
}

// EXPERIENCE ACTIONS
export async function saveExperienceAction(data: {
  id?: string;
  start: string;
  end: string;
  roleId: string;
  roleEn: string;
  company: string;
  companyUrl: string;
  descriptionId: string;
  descriptionEn: string;
  tech: string[];
}) {
  await requireAdmin();
  const payload = {
    start: data.start.trim(),
    end: data.end.trim() || null,
    role: { id: data.roleId.trim(), en: data.roleEn.trim() },
    company: data.company.trim(),
    companyUrl: sanitizeExternalUrl(data.companyUrl) || null,
    description: { id: data.descriptionId.trim(), en: data.descriptionEn.trim() },
    tech: data.tech,
  };

  if (data.id) {
    await prisma.experience.update({
      where: { id: data.id },
      data: payload,
    });
  } else {
    const count = await prisma.experience.count();
    await prisma.experience.create({
      data: { ...payload, sortOrder: count + 1 },
    });
  }
  revalidateAllPublicPaths();
}

export async function deleteExperienceAction(id: string) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidateAllPublicPaths();
}

export async function reorderExperiencesAction(orderedIds: string[]) {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, idx) =>
      prisma.experience.update({
        where: { id },
        data: { sortOrder: idx + 1 },
      })
    )
  );
  revalidateAllPublicPaths();
}

// PROJECTS ACTIONS
export async function saveProjectAction(data: {
  id?: string;
  slug: string;
  titleId: string;
  titleEn: string;
  summaryId: string;
  summaryEn: string;
  thumbnailUrl: string;
  tech: string[];
  liveUrl: string;
  repoUrl: string;
  year: string;
  isFeatured: boolean;
  isPublished: boolean;
  hasDetail: boolean;
  contentId: string;
  contentEn: string;
  gallery: string[];
}) {
  await requireAdmin();
  const cleanSlug = data.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-");

  const payload = {
    slug: cleanSlug,
    title: { id: data.titleId.trim(), en: data.titleEn.trim() },
    summary: { id: data.summaryId.trim(), en: data.summaryEn.trim() },
    thumbnailUrl: data.thumbnailUrl.trim() || null,
    tech: data.tech,
    liveUrl: sanitizeExternalUrl(data.liveUrl) || null,
    repoUrl: sanitizeExternalUrl(data.repoUrl) || null,
    year: data.year.trim() || String(new Date().getFullYear()),
    isFeatured: data.isFeatured,
    isPublished: data.isPublished,
    hasDetail: data.hasDetail,
    content: { id: data.contentId, en: data.contentEn },
    gallery: data.gallery,
  };

  if (data.id) {
    await prisma.project.update({
      where: { id: data.id },
      data: payload,
    });
  } else {
    const count = await prisma.project.count();
    await prisma.project.create({
      data: { ...payload, sortOrder: count + 1 },
    });
  }
  revalidateAllPublicPaths();
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidateAllPublicPaths();
}

export async function reorderProjectsAction(orderedIds: string[]) {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, idx) =>
      prisma.project.update({
        where: { id },
        data: { sortOrder: idx + 1 },
      })
    )
  );
  revalidateAllPublicPaths();
}

// BLOG ACTIONS
export async function savePostAction(data: {
  id?: string;
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string;
  excerptEn: string;
  contentId: string;
  contentEn: string;
  coverUrl: string;
  tags: string[];
  status: string;
}) {
  await requireAdmin();
  const cleanSlug = data.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-");

  const payload = {
    slug: cleanSlug,
    title: { id: data.titleId.trim(), en: data.titleEn.trim() },
    excerpt: { id: data.excerptId.trim(), en: data.excerptEn.trim() },
    content: { id: data.contentId, en: data.contentEn },
    coverUrl: data.coverUrl.trim() || null,
    tags: data.tags,
    status: data.status === "published" ? "published" : "draft",
  };

  if (data.id) {
    await prisma.post.update({
      where: { id: data.id },
      data: payload,
    });
  } else {
    await prisma.post.create({
      data: { ...payload, publishedAt: new Date() },
    });
  }
  revalidateAllPublicPaths();
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidateAllPublicPaths();
}

// CONTACTS & SOCIAL LINKS ACTIONS
export async function updateContactEmailAction(contactEmail: string) {
  await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: { contactEmail: contactEmail.trim() },
    create: {
      id: 1,
      siteTitle: "Portofolio",
      metaDescription: { id: "", en: "" },
      contactEmail: contactEmail.trim(),
      visibleSections: ["about", "skills", "experience", "projects", "blog"],
    },
  });
  revalidateAllPublicPaths();
}

export async function saveSocialLinkAction(data: {
  id?: string;
  platform: string;
  url: string;
  isVisible: boolean;
}) {
  await requireAdmin();
  const payload = {
    platform: data.platform.trim(),
    url: sanitizeExternalUrl(data.url),
    isVisible: data.isVisible,
  };
  if (data.id) {
    await prisma.socialLink.update({
      where: { id: data.id },
      data: payload,
    });
  } else {
    const count = await prisma.socialLink.count();
    await prisma.socialLink.create({
      data: { ...payload, sortOrder: count + 1 },
    });
  }
  revalidateAllPublicPaths();
}

export async function deleteSocialLinkAction(id: string) {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidateAllPublicPaths();
}

export async function reorderSocialLinksAction(orderedIds: string[]) {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, idx) =>
      prisma.socialLink.update({
        where: { id },
        data: { sortOrder: idx + 1 },
      })
    )
  );
  revalidateAllPublicPaths();
}

// SITE SETTINGS ACTIONS
export async function updateSiteSettingsAction(data: {
  siteTitle: string;
  metaDescriptionId: string;
  metaDescriptionEn: string;
  faviconUrl: string;
  ogImageUrl: string;
  visibleSections: string[];
}) {
  await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      siteTitle: data.siteTitle.trim(),
      metaDescription: {
        id: data.metaDescriptionId.trim(),
        en: data.metaDescriptionEn.trim(),
      },
      faviconUrl: data.faviconUrl.trim() || null,
      ogImageUrl: data.ogImageUrl.trim() || null,
      visibleSections: data.visibleSections,
    },
    create: {
      id: 1,
      siteTitle: data.siteTitle.trim(),
      metaDescription: {
        id: data.metaDescriptionId.trim(),
        en: data.metaDescriptionEn.trim(),
      },
      faviconUrl: data.faviconUrl.trim() || null,
      ogImageUrl: data.ogImageUrl.trim() || null,
      visibleSections: data.visibleSections,
    },
  });
  revalidateAllPublicPaths();
}

