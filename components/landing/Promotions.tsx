import Link from "next/link";
import PromoMarquee, { type PromoCard } from "@/components/ui/PromoMarquee";

export default function Promotions({ promos }: { promos: PromoCard[] }) {
  if (promos.length === 0) return null;

  return (
    <section className="py-6 pb-10 sm:pb-14">
      <h2 className="mb-6 px-4 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:px-6 sm:text-[30px] lg:px-10">
        <Link href="/#calculator" className="transition-colors hover:text-primary">
          Наши акции
        </Link>
      </h2>
      <PromoMarquee items={promos} href="/#calculator" />
    </section>
  );
}
