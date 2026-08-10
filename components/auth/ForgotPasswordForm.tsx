"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { requestPasswordReset, resetPassword } from "@/lib/passwordReset";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function handleRequest(formData: FormData) {
    setPending(true);
    const id = toast.loading("Отправляем код…");
    const emailValue = String(formData.get("email") ?? "").trim();
    const result = await requestPasswordReset(emailValue);
    setPending(false);

    if (!result.ok) {
      toast.error(result.message, { id });
      return;
    }
    setEmail(emailValue);
    toast.success(result.message, { id });
    setStep("reset");
  }

  async function handleReset(formData: FormData) {
    const code = String(formData.get("code") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают.");
      return;
    }

    setPending(true);
    const id = toast.loading("Сохраняем новый пароль…");
    const result = await resetPassword(email, code, newPassword);
    setPending(false);

    if (!result.ok) {
      toast.error(result.message, { id });
      return;
    }
    toast.success(result.message, { id });
    router.push("/login");
  }

  if (step === "request") {
    return (
      <form action={handleRequest} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="mb-2 text-xl font-extrabold text-ink">Восстановление пароля</h1>
        <p className="mb-6 text-sm text-muted">Введите email — мы сгенерируем код подтверждения.</p>

        <label className="mb-6 block text-sm font-semibold text-ink">
          Email
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary disabled:opacity-60"
        >
          Получить код
        </button>

        <p className="mt-5 text-center text-sm text-muted">
          Вспомнили пароль?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Войти
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form action={handleReset} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
      <h1 className="mb-2 text-xl font-extrabold text-ink">Новый пароль</h1>
      <p className="mb-6 text-sm text-muted">Код подтверждения показан во всплывающем уведомлении.</p>

      <label className="mb-3 block text-sm font-semibold text-ink">
        Код подтверждения
        <input
          type="text"
          name="code"
          required
          inputMode="numeric"
          className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink"
        />
      </label>

      <label className="mb-3 block text-sm font-semibold text-ink">
        Новый пароль
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink"
        />
      </label>

      <label className="mb-6 block text-sm font-semibold text-ink">
        Повторите пароль
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary disabled:opacity-60"
      >
        Сохранить пароль
      </button>
    </form>
  );
}
