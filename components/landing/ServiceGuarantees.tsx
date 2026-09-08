import type { IconCard } from "@/lib/homeContentData";
import { ClockIcon, HeartIcon, ShieldCheckIcon, TrophyIcon, WalletIcon } from "@/components/ui/LineIcons";

const icons = {
  clock: ClockIcon,
  trophy: TrophyIcon,
  shield: ShieldCheckIcon,
  wallet: WalletIcon,
  heart: HeartIcon,
};

type ServiceGuaranteesProps = {
  title: string;
  items: IconCard[];
};

export default function ServiceGuarantees({ title, items }: ServiceGuaranteesProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="pointer-events-none absolute top-[-80px] right-[-60px] h-70 w-70 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] left-[-60px] h-80 w-80 rounded-full bg-white/8 blur-3xl" />

      <div className="relative mx-auto max-w-300">
        <h2 className="mb-10 max-w-180 text-[28px] leading-tight font-extrabold text-on-primary sm:mb-12 sm:text-4xl lg:text-[44px]">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {items.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons] ?? ShieldCheckIcon;
            return (
              <div key={item.title} className="rounded-2xl bg-surface p-5 sm:p-6.5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-extrabold text-ink sm:text-lg">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted sm:text-[15px]">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
