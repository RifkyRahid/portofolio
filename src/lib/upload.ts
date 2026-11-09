import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export type UploadKind =
  | "thumbnail"
  | "gallery"
  | "cover"
  | "avatar"
  | "logo"
  | "favicon"
  | "og"
  | "cv";

const DIMENSIONS: Record<
  Exclude<UploadKind, "cv">,
  { width: number; height: number; fit: "cover" | "inside" }
> = {
  thumbnail: { width: 1600, height: 1000, fit: "cover" },
  gallery: { width: 1920, height: 1200, fit: "inside" },
  cover: { width: 1600, height: 900, fit: "cover" },
  avatar: { width: 800, height: 800, fit: "cover" },
  logo: { width: 512, height: 512, fit: "inside" },
  favicon: { width: 512, height: 512, fit: "cover" },
  og: { width: 1200, height: 630, fit: "cover" },
};

export async function processAndSaveUpload(
  file: File,
  kind: UploadKind
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const safeBaseName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .slice(0, 40);
  const timestamp = Date.now();

  if (kind === "cv") {
    // Validate PDF magic header (%PDF-) to prevent disguised script/HTML uploads
    const headerAscii = buffer.subarray(0, 5).toString("ascii");
    if (headerAscii !== "%PDF-") {
      throw new Error("File CV harus berupa dokumen PDF asli yang valid.");
    }
    const fileName = `${kind}-${safeBaseName}-${timestamp}.pdf`;
    await fs.writeFile(path.join(uploadsDir, fileName), buffer);
    return `/uploads/${fileName}`;
  }

  // Re-encode all images (including SVG/PNG/JPEG) through sharp into WebP.
  // This strips EXIF metadata and neutralizes any embedded SVG <script> XSS payloads.
  const spec = DIMENSIONS[kind];
  const fileName = `${kind}-${safeBaseName}-${timestamp}.webp`;
  const outputPath = path.join(uploadsDir, fileName);

  await sharp(buffer)
    .resize(spec.width, spec.height, {
      fit: spec.fit,
      withoutEnlargement: spec.fit === "inside",
    })
    .webp({ quality: 84 })
    .toFile(outputPath);

  return `/uploads/${fileName}`;
}
