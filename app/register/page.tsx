import { redirect } from "next/navigation";
import Link from "next/link";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

const errorMessages: Record<string, string> = {
  short: "Пароль должен быть не короче 8 символов.",
  mismatch: "Пароли не совпадают.",
  taken: "Пользователь с такой почтой уже зарегистрирован.",
};

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await auth();
  if (session) redirect("/");

  const { error } = await searchParams;

  async function register(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 8) redirect("/register?error=short");
    if (password !== confirmPassword) redirect("/register?error=mismatch");

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) redirect("/register?error=taken");

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, passwordHash, role: "USER" } });

    try {
      await signIn("credentials", { email, password, redirectTo: "/" });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect("/login");
      }
      throw err;
    }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />
      <div className="flex justify-center px-4 py-14 sm:py-20">
        <form action={register} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
          <h1 className="mb-6 text-xl font-extrabold text-ink">Регистрация</h1>

          {error && errorMessages[error] && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessages[error]}</p>
          )}

          <label className="mb-3 block text-sm font-semibold text-ink">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink"
            />
          </label>

          <label className="mb-3 block text-sm font-semibold text-ink">
            Пароль
            <input
              type="password"
              name="password"
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
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary"
          >
            Зарегистрироваться
          </button>

          <p className="mt-5 text-center text-sm text-muted">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-semibold text-primary">
              Войти
            </Link>
          </p>
        </form>
      </div>
      <Footer id="order" />
    </div>
  );
}
