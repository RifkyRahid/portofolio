import { NextRequest, NextResponse } from "next/server";
import { checkUploadRateLimit, getAdminSession } from "@/lib/auth";
import { processAndSaveUpload, UploadKind } from "@/lib/upload";

const VALID_KINDS = new Set<UploadKind>([
  "thumbnail",
  "gallery",
  "cover",
  "avatar",
  "logo",
  "favicon",
  "og",
  "cv",
]);

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "Sesi tidak ditemukan. Silakan login kembali." },
      { status: 401 }
    );
  }

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    session.email;
  const rate = checkUploadRateLimit(clientIp);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: `Terlalu banyak permintaan unggah file. Coba lagi dalam ${
          rate.retryAfterSeconds ?? 60
        } detik.`,
      },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kindRaw = String(formData.get("kind") || "thumbnail") as UploadKind;

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Pilih file terlebih dahulu." },
        { status: 400 }
      );
    }

    const kind: UploadKind = VALID_KINDS.has(kindRaw) ? kindRaw : "thumbnail";
    const maxBytes = kind === "cv" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error: `Ukuran file melebihi batas maksimal (${
            kind === "cv" ? "10 MB" : "5 MB"
          }).`,
        },
        { status: 400 }
      );
    }

    const url = await processAndSaveUpload(file, kind);
    return NextResponse.json({ url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal memproses file upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
