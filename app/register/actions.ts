"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isMailerConfigured, sendOtpEmail } from "@/lib/mailer";

// `devCode` is only ever populated when SMTP isn't configured (local dev), so
// the flow stays testable without a mailbox. In production it's always absent.
export type StartResult = { ok: true; devCode?: string } | { ok: false; error: string };
export type VerifyResult = { ok: true } | { ok: false; error: string };

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

const messages = {
  short: "Пароль должен быть не короче 8 символов.",
  mismatch: "Пароли не совпадают.",
  taken: "Пользователь с такой почтой уже зарегистрирован.",
  sendFailed: "Не удалось отправить письмо с кодом. Попробуйте позже.",
  noPending: "Заявка не найдена. Зарегистрируйтесь заново.",
  expired: "Срок действия кода истёк. Запросите новый.",
  tooMany: "Слишком много попыток. Запросите новый код.",
  wrong: "Неверный код. Проверьте письмо и попробуйте ещё раз.",
};

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

// Step 1: validate, stash a hashed password + hashed OTP, email the code.
export async function startRegistration(
  email: string,
  password: string,
  confirmPassword: string,
): Promise<StartResult> {
  const normalized = email.trim().toLowerCase();

  if (password.length < 8) return { ok: false, error: messages.short };
  if (password !== confirmPassword) return { ok: false, error: messages.mismatch };

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) return { ok: false, error: messages.taken };

  const code = generateCode();
  const [passwordHash, codeHash] = await Promise.all([
    bcrypt.hash(password, 10),
    bcrypt.hash(code, 10),
  ]);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.emailVerification.upsert({
    where: { email: normalized },
    update: { passwordHash, codeHash, expiresAt, attempts: 0 },
    create: { email: normalized, passwordHash, codeHash, expiresAt, attempts: 0 },
  });

  try {
    const sent = await sendOtpEmail(normalized, code);
    // No mailbox configured (dev): surface the code so the flow is testable.
    if (!sent) return { ok: true, devCode: code };
  } catch (err) {
    console.error("[register] failed to send OTP email:", err);
    if (isMailerConfigured()) return { ok: false, error: messages.sendFailed };
    return { ok: true, devCode: code };
  }

  return { ok: true };
}

// Step 2: check the code, create the real user, clear the pending row.
export async function verifyRegistration(email: string, code: string): Promise<VerifyResult> {
  const normalized = email.trim().toLowerCase();
  const pending = await prisma.emailVerification.findUnique({ where: { email: normalized } });
  if (!pending) return { ok: false, error: messages.noPending };

  if (pending.expiresAt.getTime() < Date.now()) {
    await prisma.emailVerification.delete({ where: { email: normalized } });
    return { ok: false, error: messages.expired };
  }
  if (pending.attempts >= MAX_ATTEMPTS) {
    await prisma.emailVerification.delete({ where: { email: normalized } });
    return { ok: false, error: messages.tooMany };
  }

  const valid = await bcrypt.compare(code.trim(), pending.codeHash);
  if (!valid) {
    await prisma.emailVerification.update({
      where: { email: normalized },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, error: messages.wrong };
  }

  // Race guard: someone may have registered this email meanwhile.
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (!existing) {
    await prisma.user.create({
      data: { email: normalized, passwordHash: pending.passwordHash, role: "USER" },
    });
  }
  await prisma.emailVerification.delete({ where: { email: normalized } });
  return { ok: true };
}

// Regenerate + resend the code for an in-progress registration.
export async function resendRegistrationOtp(email: string): Promise<StartResult> {
  const normalized = email.trim().toLowerCase();
  const pending = await prisma.emailVerification.findUnique({ where: { email: normalized } });
  if (!pending) return { ok: false, error: messages.noPending };

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  await prisma.emailVerification.update({
    where: { email: normalized },
    data: { codeHash, expiresAt: new Date(Date.now() + OTP_TTL_MS), attempts: 0 },
  });

  try {
    const sent = await sendOtpEmail(normalized, code);
    if (!sent) return { ok: true, devCode: code };
  } catch (err) {
    console.error("[register] failed to resend OTP email:", err);
    if (isMailerConfigured()) return { ok: false, error: messages.sendFailed };
    return { ok: true, devCode: code };
  }

  return { ok: true };
}
