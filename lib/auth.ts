import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Single hardcoded admin — no accounts/DB. Email can be overridden via env,
// but the bcrypt hash is hardcoded rather than read from ADMIN_PASSWORD_HASH
// env/.env: every bcrypt hash starts with "$2b$10$...", and Next.js's
// built-in @next/env loader does $VAR expansion on .env files, silently
// stripping "$2b", "$10", etc. as references to undefined variables and
// corrupting the hash on every server start. Hardcoding it here sidesteps
// that entirely — it's a hash, never the plaintext, so it's safe to commit.
const ADMIN_EMAIL = "speckliningbel@yandex.by";
const ADMIN_PASSWORD_HASH = "$2b$10$MOPQRYsXtmrWwnxirpYWd.HLT4HqW42ephY7l3mWr7K/pGAZfVR3m";

export const ADMIN_SESSION_COOKIE = "admin_session";

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL || ADMIN_EMAIL;
}

// Deterministic token derived from the server secret — no session store
// needed for a single hardcoded admin, and it's safe to compare in
// middleware without a DB round-trip. Rotates automatically whenever
// AUTH_SECRET changes.
export function adminSessionToken(): string {
  const secret = process.env.AUTH_SECRET?.trim() || "insecure-fallback-secret";
  return crypto.createHmac("sha256", secret).update("admin-session-v1").digest("hex");
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  if (email !== adminEmail()) return false;
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export async function createAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, adminSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_SESSION_COOKIE)?.value === adminSessionToken();
}
