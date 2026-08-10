import { statusPresentation, formatRuDateTime, type OrderStatus } from "@/lib/orderStatus";

export type OrderPreviewDto = {
  id: string;
  title: string;
  price: number;
  date: string;
  address: string;
  serviceDetail: string;
  staff: string;
  status: OrderStatus;
};

export default function OrderPreviewCard({ order }: { order: OrderPreviewDto | null }) {
  if (!order) {
    return <p className="text-xs text-muted italic">Заказ удалён</p>;
  }

  const presentation = statusPresentation[order.status];

  return (
    <div className="flex min-w-0 flex-col gap-2 text-[13px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-extrabold">{order.title}</span>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${presentation.bgClass} ${presentation.textClass}`}>
          {presentation.label}
        </span>
      </div>
      <div className="text-lg leading-none font-extrabold">{order.price} руб.</div>
      <div className="flex flex-col gap-0.5 opacity-80">
        <span>{formatRuDateTime(new Date(order.date))}</span>
        <span className="wrap-break-word">{order.address}</span>
        <span>{order.staff}</span>
      </div>
    </div>
  );
}
