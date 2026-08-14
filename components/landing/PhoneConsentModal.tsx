"use client";

import { useEffect, useState } from "react";
import { withPlusPrefix } from "@/lib/phone";

type PhoneConsentModalProps = {
  open: boolean;
  onClose: () => void;
  initialPhone?: string;
  initialAddress?: string;
  onSubmit: (phone: string, address: string, consent: boolean) => Promise<{ ok: boolean; message: string }>;
};

export default function PhoneConsentModal({
  open,
  onClose,
  initialPhone = "",
  initialAddress = "",
  onSubmit,
}: PhoneConsentModalProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [consent, setConsent] = useState(false);
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

    const result = await onSubmit(phone, address, consent);
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onClose();
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

        <h3 className="mb-2 text-center text-lg font-extrabold text-ink">Укажите контакты</h3>
        <p className="mb-6 text-center text-sm text-muted">Чтобы менеджер мог связаться и подтвердить заявку</p>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(withPlusPrefix(e.target.value))}
            placeholder="Ваш номер телефона"
            className="rounded-full border border-border px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Адрес уборки (необязательно)"
            className="rounded-full border border-border px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
          <button
            type="submit"
            disabled={!consent || pending}
            className="rounded-full bg-primary py-3 text-sm font-bold tracking-wide text-on-primary uppercase transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Отправить заявку
          </button>
          <label className="flex items-start gap-2 text-xs leading-snug text-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 shrink-0 accent-primary"
            />
            <span className="min-w-0">
              Даю согласие на обработку персональных данных и подтверждаю, что ознакомлен с{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="underline hover:text-ink"
              >
                политикой обработки персональных данных
              </a>{" "}
              и условиями{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="underline hover:text-ink"
              >
                пользовательского соглашения
              </a>
              .
            </span>
          </label>
        </form>
      </div>
    </div>
  );
}
