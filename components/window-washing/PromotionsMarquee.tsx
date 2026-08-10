import PromoMarquee from "@/components/ui/PromoMarquee";
import { promos } from "@/lib/windowWashingContent";

export default function PromotionsMarquee() {
  return (
    <section className="bg-surface py-6 pb-10 sm:pb-14">
      <h2 className="mb-6 px-4 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:px-6 sm:text-[30px] lg:px-10">
        Акции на мойку витрин
      </h2>
      <PromoMarquee items={promos} />
    </section>
  );
}
