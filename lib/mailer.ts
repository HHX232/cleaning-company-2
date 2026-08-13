import { domainToASCII } from "node:url";
import nodemailer, { type Transporter } from "nodemailer";
import { company } from "@/lib/content";

// The mailbox lives on an IDN domain (специализированный-клининг.бел); hoster's
// SMTP expects the login in punycode. Normalise the domain so the .env can hold
// either the Cyrillic or the ASCII form and auth still succeeds.
function toAsciiEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at === -1) return email;
  const domain = email.slice(at + 1);
  return `${email.slice(0, at)}@${domainToASCII(domain) || domain}`;
}

// SMTP config comes from env (smtp.hoster.by). Port 465 → implicit TLS
// (secure), 587 → STARTTLS. When credentials are absent (e.g. local dev
// without a mailbox) the mailer degrades gracefully: callers can fall back to
// showing the code on screen instead of failing the whole flow.
const host = process.env.SMTP_HOST?.trim();
const port = Number(process.env.SMTP_PORT ?? 465);
const user = process.env.SMTP_USER ? toAsciiEmail(process.env.SMTP_USER.trim()) : undefined;
const pass = process.env.SMTP_PASSWORD;

export function isMailerConfigured(): boolean {
  return Boolean(host && user && pass);
}

let cached: Transporter | null = null;
function transporter(): Transporter {
  if (!cached) {
    cached = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // implicit TLS on 465, STARTTLS on 587
      auth: { user, pass },
    });
  }
  return cached;
}

type SendArgs = { to: string; subject: string; html: string; text: string };

// Sends a message. Returns whether it actually went out over SMTP — false when
// the mailer isn't configured, so callers can decide on a dev fallback.
export async function sendMail({ to, subject, html, text }: SendArgs): Promise<boolean> {
  if (!isMailerConfigured()) {
    console.warn(`[mailer] SMTP not configured — skipping email to ${to} (${subject})`);
    return false;
  }
  await transporter().sendMail({
    from: `"${company.name}" <${user}>`,
    to,
    subject,
    text,
    html,
  });
  return true;
}

// Registration OTP email. Kept plain and minimal so it renders in any client.
export async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  const subject = `Код подтверждения: ${code}`;
  const text = `Ваш код подтверждения регистрации на сайте ${company.name}: ${code}\n\nКод действует 10 минут. Если вы не регистрировались — просто проигнорируйте это письмо.`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1a1a1a">
      <h2 style="margin:0 0 12px">Подтверждение регистрации</h2>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#555">
        Вы регистрируетесь на сайте <b>${company.name}</b>. Введите этот код, чтобы завершить регистрацию:
      </p>
      <div style="font-size:32px;font-weight:800;letter-spacing:6px;text-align:center;padding:16px;background:#f4f6f5;border-radius:12px;color:#111">
        ${code}
      </div>
      <p style="margin:16px 0 0;font-size:13px;color:#888">
        Код действует 10 минут. Если вы не регистрировались — просто проигнорируйте это письмо.
      </p>
    </div>`;
  return sendMail({ to, subject, html, text });
}
