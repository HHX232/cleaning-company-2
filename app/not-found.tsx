import Link from "next/link";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <Header />
      <Nav />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-4 text-7xl font-extrabold text-primary sm:text-8xl">404</div>
        <h1 className="mb-2 text-xl font-extrabold text-ink sm:text-2xl">Страница не найдена</h1>
        <p className="mb-8 max-w-100 text-sm text-muted">
          Такой страницы не существует или она была перемещена. Попробуйте вернуться на главную.
        </p>
        <Link
          href="/"
          className="rounded-[10px] bg-primary px-6.5 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] active:translate-y-0 active:scale-[0.98]"
        >
          На главную
        </Link>
      </div>
      <Footer id="order" />
    </div>
  );
}
