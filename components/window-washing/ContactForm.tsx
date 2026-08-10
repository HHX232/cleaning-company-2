"use client";

import { useState } from "react";
import { contactPerks } from "@/lib/windowWashingContent";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No lead-capture backend yet — becomes a real request once orders ship.
    setSubmitted(true);
  };

  return (
    <section id="order" className="px-4 pb-8 sm:px-6 sm:pb-10 lg:px-10">
      <div className="mx-auto grid max-w-225 grid-cols-1 gap-8 rounded-3xl border border-border bg-surface p-7 sm:p-11 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl leading-snug font-extrabold text-ink sm:text-2xl">
            Оставьте заявку на мойку витрин
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-muted">
            Заполните форму — менеджер свяжется с вами в течение 15 минут и рассчитает точную стоимость.
          </p>
          <div className="flex flex-col gap-2.5 text-[13px] text-muted">
            {contactPerks.map((perk) => (
              <span key={perk}>✓ {perk}</span>
            ))}
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-bg p-8 text-center">
            <div className="text-lg font-bold text-ink">Спасибо!</div>
            <p className="text-sm text-muted">Мы свяжемся с вами в ближайшее время.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="rounded-[10px] border border-border bg-bg px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-primary"
            />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+375 XX XXX-XX-XX"
              className="rounded-[10px] border border-border bg-bg px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-primary"
            />
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Адрес объекта"
              className="rounded-[10px] border border-border bg-bg px-4 py-3.5 text-sm text-ink outline-none transition-colors focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-[10px] bg-primary p-3.5 text-center text-sm font-extrabold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-[0.98]"
            >
              Отправить заявку
            </button>
            <span className="text-center text-[11px] text-muted">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </span>
          </form>
        )}
      </div>
    </section>
  );
}
