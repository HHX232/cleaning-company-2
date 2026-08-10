import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session) redirect("/");

  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/",
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect("/login?error=1");
      }
      throw err;
    }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />
      <div className="flex justify-center px-4 py-14 sm:py-20">
        <form action={login} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
          <h1 className="mb-6 text-xl font-extrabold text-ink">Вход в личный кабинет</h1>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              Неверный email или пароль.
            </p>
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
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary"
          >
            Войти
          </button>

          <p className="mt-5 text-center text-sm text-muted">
            Нет аккаунта?{" "}
            <Link href="/register" className="font-semibold text-primary">
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
      <Footer id="order" />
    </div>
  );
}
