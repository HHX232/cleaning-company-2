"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { resendRegistrationOtp, startRegistration, verifyRegistration } from "@/app/register/actions";

const inputClass = "mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink";

export default function RegisterForm() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState<"form" | "code">("form");
  const [submitting, setSubmitting] = useState(false);
  // Held between steps so we can verify and then sign in.
  const [creds, setCreds] = useState<{ email: string; password: string }>({ email: "", password: "" });

  function showDevCode(devCode?: string) {
    if (devCode) {
      toast.info(`Код (SMTP не настроен): ${devCode}`, { duration: 15000 });
    }
  }

  async function onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    setSubmitting(true);
    const toastId = toast.loading("Отправляем код на почту…");
    const result = await startRegistration(email, password, confirmPassword);
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error, { id: toastId });
      return;
    }
    setCreds({ email: email.trim().toLowerCase(), password });
    setStep("code");
    toast.success("Код отправлен на почту. Проверьте входящие.", { id: toastId });
    showDevCode(result.devCode);
  }

  async function onSubmitCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget);
    const code = String(form.get("code") ?? "");

    setSubmitting(true);
    const toastId = toast.loading("Проверяем код…");
    const result = await verifyRegistration(creds.email, code);
    if (!result.ok) {
      toast.error(result.error, { id: toastId });
      setSubmitting(false);
      return;
    }

    // Verified — sign the new user in and refresh the client session so the
    // header updates without a full reload.
    const res = await signIn("credentials", { email: creds.email, password: creds.password, redirect: false });
    if (!res || res.error) {
      toast.success("Аккаунт создан. Войдите в него.", { id: toastId });
      router.push("/login");
      return;
    }
    await update();
    toast.success("Аккаунт подтверждён, вы вошли", { id: toastId });
    router.push("/");
    router.refresh();
  }

  async function onResend() {
    if (submitting) return;
    setSubmitting(true);
    const toastId = toast.loading("Отправляем новый код…");
    const result = await resendRegistrationOtp(creds.email);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error, { id: toastId });
      return;
    }
    toast.success("Новый код отправлен", { id: toastId });
    showDevCode(result.devCode);
  }

  if (step === "code") {
    return (
      <form onSubmit={onSubmitCode} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="mb-2 text-xl font-extrabold text-ink">Подтверждение почты</h1>
        <p className="mb-6 text-sm text-muted">
          Мы отправили 6-значный код на <span className="font-semibold text-ink">{creds.email}</span>. Введите его,
          чтобы завершить регистрацию.
        </p>

        <label className="mb-6 block text-sm font-semibold text-ink">
          Код из письма
          <input
            type="text"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={6}
            required
            autoFocus
            className={`${inputClass} text-center text-lg tracking-[6px]`}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Проверяем…" : "Подтвердить"}
        </button>

        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={onResend}
            disabled={submitting}
            className="font-semibold text-primary disabled:opacity-60"
          >
            Отправить код ещё раз
          </button>
          <button
            type="button"
            onClick={() => setStep("form")}
            className="text-muted hover:text-ink"
          >
            Изменить данные
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmitForm} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Регистрация</h1>

      <label className="mb-3 block text-sm font-semibold text-ink">
        Email
        <input type="email" name="email" required defaultValue={creds.email} className={inputClass} />
      </label>

      <label className="mb-3 block text-sm font-semibold text-ink">
        Пароль
        <input type="password" name="password" required minLength={8} className={inputClass} />
      </label>

      <label className="mb-6 block text-sm font-semibold text-ink">
        Повторите пароль
        <input type="password" name="confirmPassword" required minLength={8} className={inputClass} />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Отправляем код…" : "Зарегистрироваться"}
      </button>

      <p className="mt-5 text-center text-sm text-muted">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Войти
        </Link>
      </p>
    </form>
  );
}
