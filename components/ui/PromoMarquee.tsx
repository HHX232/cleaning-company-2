import styles from "./PromoMarquee.module.scss";

export type PromoCard = {
  badge: string;
  title: string;
  text: string;
};

type PromoMarqueeProps = {
  items: readonly PromoCard[];
  href?: string;
};

// Repeated 4x (not just 2x) so the strip has enough width to stay full-bleed
// on wide screens too — translateX(-50%) still lands on an identical visual
// state since it shifts by exactly half the track (an even number of sets).
export default function PromoMarquee({ items, href = "#order" }: PromoMarqueeProps) {
  const loop = [...items, ...items, ...items, ...items].map((p, i) => ({
    ...p,
    tilt: i % 2 === 0 ? -1.5 : 1.5,
  }));

  return (
    <div className={styles.mask}>
      <div className={styles.track}>
        {loop.map((promo, i) => (
          <a
            key={`${promo.title}-${i}`}
            href={href}
            className="block w-75 shrink-0 rounded-2xl border border-border bg-surface p-6 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_16px_32px_rgba(0,0,0,0.14)]"
            style={{ transform: `rotate(${promo.tilt}deg)` }}
          >
            <div className="mb-4 inline-block rounded-[20px] bg-primary px-3.5 py-1.5 text-sm font-extrabold text-on-primary">
              {promo.badge}
            </div>
            <h3 className="mb-2.5 text-lg font-bold text-ink">{promo.title}</h3>
            <p className="text-sm leading-snug text-muted">{promo.text}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
