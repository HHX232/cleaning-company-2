"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const { update } = useSession();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    setSubmitting(true);
    const toastId = toast.loading("Выполняется вход…");
    const res = await signIn("credentials", { email, password, redirect: false });

    if (!res || res.error) {
      toast.error("Неверный email или пароль", { id: toastId });
      setSubmitting(false);
      return;
    }

    // Refresh the client session so the header profile button updates without
    // a full page reload, then navigate home.
    await update();
    toast.success("Вы вошли в аккаунт", { id: toastId });
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Вход в личный кабинет</h1>

      <label className="mb-3 block text-sm font-semibold text-ink">
        Email
        <input
          type="email"
          name="email"
          required
          className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink"
        />
      </label>

      <label className="mb-2 block text-sm font-semibold text-ink">
        Пароль
        <input
          type="password"
          name="password"
          required
          className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink"
        />
      </label>

      <Link href="/forgot-password" className="mb-6 inline-block text-sm text-primary">
        Забыли пароль?
      </Link>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Входим…" : "Войти"}
      </button>

      <p className="mt-5 text-center text-sm text-muted">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
