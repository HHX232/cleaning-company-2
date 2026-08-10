"use client";

import { useEffect, useState } from "react";
import { contactLinks } from "@/lib/content";
import { withPlusPrefix } from "@/lib/phone";
import { submitCallbackRequest } from "@/lib/callbackRequest";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setSubmitted(false);
    setError("");
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSubmitted(false);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await submitCallbackRequest(phone);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-bg p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="mb-2 text-lg font-bold text-ink">Спасибо!</div>
            <p className="text-sm text-muted">Мы свяжемся с вами в ближайшее время.</p>
          </div>
        ) : (
          <>
            <h3 className="mb-2 text-center text-lg font-extrabold text-ink">
              Оставьте заявку на бесплатную консультацию
            </h3>
            <p className="mb-6 text-center text-sm text-muted">Напишите нам в удобный для вас мессенджер</p>

            <div className="mb-5 flex flex-col gap-3">
              <a
                href={contactLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#25d366] px-4 py-3 text-center text-sm font-semibold text-ink transition-colors duration-150 hover:bg-[#25d366]/10"
              >
                Написать в WhatsApp
              </a>
              <a
                href={contactLinks.viber}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#7360f2] px-4 py-3 text-center text-sm font-semibold text-ink transition-colors duration-150 hover:bg-[#7360f2]/10"
              >
                Написать в Viber
              </a>
              <a
                href={contactLinks.telegram}
                className="rounded-full border border-[#33a8e0] px-4 py-3 text-center text-sm font-semibold text-ink transition-colors duration-150 hover:bg-[#33a8e0]/10"
              >
                Написать в Telegram
              </a>
            </div>

            <p className="mb-3 text-center text-sm text-muted">Или оставьте заявку на звонок</p>

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
              <button
                type="submit"
                disabled={!consent || submitting}
                className="rounded-full bg-primary py-3 text-sm font-bold tracking-wide text-on-primary uppercase transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Отправить заявку
              </button>
              <label className="flex items-start gap-2 text-xs leading-snug text-muted">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                Даю согласие на обработку персональных данных и подтверждаю, что ознакомлен с политикой обработки
                персональных данных и условиями пользовательского соглашения.
              </label>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
