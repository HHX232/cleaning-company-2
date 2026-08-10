import { textPromoBlocks } from "@/lib/windowWashingContent";

export default function TextPromoBlocks() {
  return (
    <section className="px-4 pb-8 sm:px-6 sm:pb-10 lg:px-10">
      <div className="mx-auto grid max-w-300 grid-cols-1 gap-5 sm:grid-cols-2">
        {textPromoBlocks.map((block) =>
          block.dark ? (
            <div key={block.title} className="relative overflow-hidden rounded-[22px] bg-dark p-7 sm:p-9">
              <div className="pointer-events-none absolute top-[-40px] left-[-40px] h-45 w-45 rounded-full bg-primary opacity-15" />
              <div className="relative mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase">
                {block.eyebrow}
              </div>
              <h3 className="relative mb-3 text-lg leading-snug font-extrabold text-white sm:text-xl">
                {block.title}
              </h3>
              <p className="relative text-sm leading-relaxed text-[#cfe0d2]">{block.text}</p>
            </div>
          ) : (
            <div key={block.title} className="rounded-[22px] border border-border bg-surface p-7 sm:p-9">
              <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase">
                {block.eyebrow}
              </div>
              <h3 className="mb-3 text-lg leading-snug font-extrabold text-ink sm:text-xl">{block.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{block.text}</p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
