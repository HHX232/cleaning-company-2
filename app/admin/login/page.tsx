import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log('=== SERVER ACTION LOGIN ===');
    console.log('Email:', email);
    console.log('Password length:', password?.length);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (result && !result.error) {
        redirect("/admin");
      } else {
        // Если есть ошибка
        console.error('SignIn error:', result?.error);
        redirect("/admin/login?error=1");
      }
    } catch (err) {
      console.error('=== AUTH ERROR ===');
      console.error('Error type:', typeof err);
      console.error('Error:', err);

      if (err instanceof AuthError) {
        console.error('AuthError type:', err.type);
        console.error('AuthError message:', err.message);
        redirect(`/admin/login?error=${err.type || '1'}`);
      }

      redirect("/admin/login?error=1");
    }
  }

  // Определяем сообщение об ошибке на основе кода
  const getErrorMessage = (errorCode?: string) => {
    switch (errorCode) {
      case 'CredentialsSignin':
        return 'Неверный email или пароль.';
      case '1':
        return 'Неверный email или пароль.';
      default:
        return 'Ошибка входа. Попробуйте еще раз.';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form action={login} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="mb-6 text-xl font-extrabold text-ink">Вход в админку</h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {getErrorMessage(error)}
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
