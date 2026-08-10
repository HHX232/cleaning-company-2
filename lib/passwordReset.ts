"use server";

import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const OTP_TTL_MS = 10 * 60 * 1000;

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    return { ok: false, message: "Пользователь с такой почтой не найден." };
  }

  const otp = String(randomInt(100000, 1000000));
  const resetOtpHash = await bcrypt.hash(otp, 10);
  const resetOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetOtpHash, resetOtpExpiresAt },
  });

  // No email provider configured — the code is handed straight back to the
  // client to show in a toast instead of being sent anywhere. Demo-grade
  // recovery flow only, not secure for real production use.
  return { ok: true, message: `Код подтверждения: ${otp} (действителен 10 минут)` };
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (newPassword.length < 8) {
    return { ok: false, message: "Пароль должен быть не короче 8 символов." };
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user || !user.resetOtpHash || !user.resetOtpExpiresAt) {
    return { ok: false, message: "Сначала запросите код подтверждения." };
  }
  if (user.resetOtpExpiresAt < new Date()) {
    return { ok: false, message: "Код истёк, запросите новый." };
  }

  const valid = await bcrypt.compare(code, user.resetOtpHash);
  if (!valid) {
    return { ok: false, message: "Неверный код." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetOtpHash: null, resetOtpExpiresAt: null },
  });

  return { ok: true, message: "Пароль обновлён, теперь можно войти." };
}
