import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />
      <div className="flex justify-center px-4 py-14 sm:py-20">
        <RegisterForm />
      </div>
      <Footer id="order" />
    </div>
  );
}
