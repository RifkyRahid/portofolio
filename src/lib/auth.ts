import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "portfolio_admin_session";

function getSecretKey(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET || "portfolio-local-dev-secret-key-2026-rifky-32chars";
  return new TextEncoder().encode(secret);
}

interface RateBucket {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, RateBucket>();
const uploadAttempts = new Map<string, RateBucket>();

function pruneExpiredBuckets(store: Map<string, RateBucket>, now: number) {
  if (store.size < 200) return;
  for (const [key, bucket] of store.entries()) {
    if (now > bucket.resetAt) {
      store.delete(key);
    }
  }
}

export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  pruneExpiredBuckets(loginAttempts, now);

  const entry = loginAttempts.get(identifier);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { allowed: true };
  }
  if (entry.count >= 8) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  entry.count += 1;
  return { allowed: true };
}

export function clearLoginRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}

export function checkUploadRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  pruneExpiredBuckets(uploadAttempts, now);

  const entry = uploadAttempts.get(identifier);
  if (!entry || now > entry.resetAt) {
    uploadAttempts.set(identifier, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return { allowed: true };
  }
  if (entry.count >= 30) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  entry.count += 1;
  return { allowed: true };
}

export async function createAdminSessionToken(payload: {
  id: string;
  email: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(
  token: string | undefined
): Promise<{ id: string; email: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.id === "string" && typeof payload.email === "string") {
      return { id: payload.id, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<{
  id: string;
  email: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export async function setAdminSessionCookie(payload: {
  id: string;
  email: string;
}): Promise<void> {
  const token = await createAdminSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
