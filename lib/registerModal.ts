"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Same validation as app/register/page.tsx's `register` action, but never
// calls redirect() — a full navigation here would unmount whatever client
// component opened this modal (the homepage calculator) and lose its
// in-memory state. Signing the new user in is left to the caller (the
// modal calls next-auth/react's client-side signIn itself, no navigation).
export async function registerFromModal(email: string, password: string, confirmPassword: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (password.length < 8) {
    return { ok: false, message: "Пароль должен быть не короче 8 символов." };
  }
  if (password !== confirmPassword) {
    return { ok: false, message: "Пароли не совпадают." };
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return { ok: false, message: "Пользователь с такой почтой уже зарегистрирован." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email: normalizedEmail, passwordHash, role: "USER" } });

  return { ok: true };
}
