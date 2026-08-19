"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Calc2State, coefficientsFrom, computeCalc2, labelFor } from "@/lib/calculator";
import { getCalculatorOptions } from "@/lib/calculatorOptionsData";
import { ORDER_KINDS, type OrderKind } from "@/lib/dbEnums";
import { notifyAdmin, siteUrl } from "@/lib/telegramNotify";
import { formatRuDateTime } from "@/lib/orderStatus";

// objectType is now an admin-editable CalculatorOption key, so it isn't
// guaranteed to match one of the fixed OrderKind values (e.g. an admin
// could add a new "Тип объекта" option with an arbitrary key) — fall back
// to STANDARD rather than store an out-of-range kind.
function resolveOrderKind(objectType: string): OrderKind {
  const upper = objectType.toUpperCase();
  return (ORDER_KINDS as readonly string[]).includes(upper) ? (upper as OrderKind) : "STANDARD";
}

function scheduleDate(calc: Calc2State): Date {
  if (calc.desiredDate) {
    return new Date(`${calc.desiredDate}T${calc.desiredTime || "00:00"}`);
  }
  const date = new Date();
  if (calc.urgency === "tomorrow") date.setDate(date.getDate() + 1);
  if (calc.urgency === "planned") date.setDate(date.getDate() + 3);
  return date;
}

// Guest order creation — no account involved, the order is identified by
// phone alone (address is optional). Triggered from the homepage calculator
// once the customer fills in the phone+address modal.
export async function createOrderFromCalculator(
  phone: string,
  address: string,
  consent: boolean,
  calc: Calc2State,
): Promise<{ ok: boolean; message: string; orderId?: string }> {
  const trimmedPhone = phone.trim();
  if (!trimmedPhone) {
    return { ok: false, message: "Укажите номер телефона." };
  }
  if (!consent) {
    return { ok: false, message: "Нужно согласие на обработку персональных данных." };
  }

  const options = await getCalculatorOptions();
  const coefficients = coefficientsFrom(options);
  const { price } = computeCalc2(calc, coefficients);

  const parts = [
    `Площадь: ${calc.area >= 50 ? "50+" : calc.area} м²`,
    `Состояние: ${labelFor(options.DIRT, calc.dirt)}`,
    `Тип здания: ${labelFor(options.BUILDING_TYPE, calc.buildingType)}`,
  ];
  const extras = Object.keys(calc.extras)
    .filter((key) => calc.extras[key])
    .map((key) => labelFor(options.EXTRA, key));
  if (extras.length > 0) parts.push(`Доп. услуги: ${extras.join(", ")}`);

  const trimmedAddress = address.trim();

  const order = await prisma.order.create({
    data: {
      phone: trimmedPhone,
      address: trimmedAddress || null,
      kind: resolveOrderKind(calc.objectType),
      title: labelFor(options.OBJECT_TYPE, calc.objectType),
      date: scheduleDate(calc),
      price,
      serviceDetail: parts.join(" · "),
      staff: labelFor(options.STAFF, calc.staff),
      payment: "Ожидает подтверждения",
    },
  });

  revalidatePath("/admin/orders");

  notifyAdmin(
    `🧹 <b>Новая заявка на уборку</b>\n${order.title} — ${order.price} руб.\n${formatRuDateTime(order.date)}\n${order.address ?? trimmedPhone}\n\n${siteUrl("/admin/orders")}`,
  );

  return { ok: true, message: "Заявка создана!", orderId: order.id };
}
