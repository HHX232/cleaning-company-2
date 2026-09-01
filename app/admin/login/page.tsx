import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminCredentials } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (typeof email !== "string" || typeof password !== "string") {
      redirect("/admin/login?error=1");
    }

    const valid = await verifyAdminCredentials(email, password);
    if (!valid) {
      redirect("/admin/login?error=1");
    }

    await createAdminSession();
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form action={login} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="mb-6 text-xl font-extrabold text-ink">Вход в админку</h1>

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
            placeholder="speckliningbel@yandex.by"
          />
        </label>

        <label className="mb-6 block text-sm font-semibold text-ink">
          Пароль
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-on-primary"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
