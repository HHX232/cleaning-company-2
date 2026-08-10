import { whatsIncluded } from "@/lib/windowWashingContent";

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<(typeof whatsIncluded)[number]["icon"], React.ReactNode> = {
  glass: (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="14" rx="1" />
      <path d="M3 10h18" />
    </svg>
  ),
  frame: (
    <svg {...iconProps}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 9h16M4 15h16" />
    </svg>
  ),
  sign: (
    <svg {...iconProps}>
      <path d="M4 8h16l-2 10H6z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </svg>
  ),
  polish: (
    <svg {...iconProps}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
};

export default function WhatsIncluded() {
  return (
    <section className="px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">
        Что входит в мойку витрин
      </h2>
      <div className="mx-auto grid max-w-300 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4.5 lg:grid-cols-4">
        {whatsIncluded.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-surface p-6 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.1)]"
          >
            <div className="mb-3.5 text-primary">{icons[item.icon]}</div>
            <div className="mb-2 text-[15px] font-bold text-ink">{item.title}</div>
            <div className="text-[13px] leading-relaxed text-muted">{item.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
