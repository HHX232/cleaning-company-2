"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { registerFromModal } from "@/lib/registerModal";

type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
  onRegistered: () => void;
};

export default function RegisterModal({ open, onClose, onRegistered }: RegisterModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");

    const result = await registerFromModal(email, password, confirmPassword);
    if (!result.ok) {
      setPending(false);
      setError(result.message ?? "Не удалось зарегистрироваться.");
      return;
    }

    const signInResult = await signIn("credentials", { email, password, redirect: false });
    setPending(false);
    if (signInResult?.error) {
      setError("Аккаунт создан, но не удалось войти. Попробуйте войти вручную.");
      return;
    }

    onRegistered();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-bg p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface"
        >
          ✕
        </button>

        <h3 className="mb-2 text-center text-lg font-extrabold text-ink">Создайте аккаунт</h3>
        <p className="mb-6 text-center text-sm text-muted">
          Чтобы оформить заявку, зарегистрируйтесь — расчёт сохранится
        </p>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-full border border-border px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="rounded-full border border-border px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Повторите пароль"
            className="rounded-full border border-border px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-full bg-primary py-3 text-sm font-bold tracking-wide text-on-primary uppercase transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Зарегистрироваться и продолжить
          </button>
        </form>
      </div>
    </div>
  );
}
