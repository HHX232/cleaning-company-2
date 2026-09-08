import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { adminEmail, destroyAdminSession, isAdminAuthenticated } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  // /admin/login has no session (middleware guarantees this is the only
  // reachable page in that state) — it renders its own centered form, no
  // nav chrome needed.
  if (!authenticated) {
    return <>{children}</>;
  }

  async function logout() {
    "use server";
    await destroyAdminSession();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg text-ink lg:flex">
      <aside className="border-b border-border p-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="mb-5 flex items-center justify-between gap-2 lg:flex-col lg:items-stretch">
          <span className="text-sm font-extrabold text-ink">Админка</span>
          <form action={logout}>
            <button type="submit" className="text-xs whitespace-nowrap text-muted hover:text-ink">
              Выйти ({adminEmail()})
            </button>
          </form>
        </div>
        <AdminNav />
      </aside>
      <main className="min-w-0 flex-1 p-6">{children}</main>
    </div>
  );
}
