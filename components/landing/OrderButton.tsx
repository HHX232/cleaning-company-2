"use client";

import { useContactModal } from "./ContactModalProvider";

// "Заказать уборку" CTA — opens the contact/order modal. A tiny client
// component so server components (Hero, etc.) can drop it in without going
// client themselves.
export default function OrderButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const openContactModal = useContactModal();
  return (
    <button type="button" onClick={openContactModal} className={className}>
      {children}
    </button>
  );
}
