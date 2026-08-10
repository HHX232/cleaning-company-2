"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calc2State, coefficientsFrom, computeCalc2, labelFor } from "@/lib/calculator";
import { getCalculatorOptions } from "@/lib/calculatorOptionsData";
import { ORDER_KINDS, type OrderKind } from "@/lib/dbEnums";
import { notifyAdmins, siteUrl } from "@/lib/telegramNotify";
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

async function createOrderForUser(userId: string, userAddress: string | null, calc: Calc2State, chatId?: string) {
  const options = await getCalculatorOptions();
  const coefficients = coefficientsFrom(options);
  const { price } = computeCalc2(calc, coefficients);

  const parts = [
    `Тяжесть загрязнения: ${calc.severity}/10`,
    `Состояние: ${labelFor(options.DIRT, calc.dirt)}`,
    `Тип здания: ${labelFor(options.BUILDING_TYPE, calc.buildingType)}`,
  ];
  const extras = Object.keys(calc.extras)
    .filter((key) => calc.extras[key])
    .map((key) => labelFor(options.EXTRA, key));
  if (extras.length > 0) parts.push(`Доп. услуги: ${extras.join(", ")}`);

  const order = await prisma.order.create({
    data: {
      userId,
      kind: resolveOrderKind(calc.objectType),
      title: labelFor(options.OBJECT_TYPE, calc.objectType),
      date: scheduleDate(calc),
      address: userAddress ?? labelFor(options.REGION, calc.region),
      price,
      serviceDetail: parts.join(" · "),
      staff: labelFor(options.STAFF, calc.staff),
      payment: "Ожидает подтверждения",
    },
  });

  if (chatId) {
    await prisma.chatMessage.create({
      data: {
        chatId,
        sender: "USER",
        kind: "ORDER",
        orderId: order.id,
        text: "Заявка на уборку",
        readByUser: true,
        readByAdmin: false,
      },
    });
    await prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });
    revalidatePath("/admin/chats");
  }

  revalidatePath("/profile");
  revalidatePath("/admin/orders");

  notifyAdmins(
    `🧹 <b>Новая заявка на уборку</b>\n${order.title} — ${order.price} руб.\n${formatRuDateTime(order.date)}\n${order.address}\n\n${siteUrl("/admin/orders")}`,
  );

  return order;
}

export async function createOrderFromCalculator(
  calc: Calc2State,
): Promise<
  | { status: "created"; orderId: string }
  | { status: "needs_phone"; phone: string | null; address: string | null }
  | { status: "needs_auth" }
> {
  const session = await auth();
  if (!session?.user.id) {
    return { status: "needs_auth" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return { status: "needs_auth" };
  }
  if (!user.phone || !user.address) {
    return { status: "needs_phone", phone: user.phone, address: user.address };
  }

  const order = await createOrderForUser(user.id, user.address, calc);
  return { status: "created", orderId: order.id };
}

export async function submitPhoneAndCreateOrder(phone: string, address: string, consent: boolean, calc: Calc2State) {
  const session = await auth();
  if (!session?.user.id) {
    return { ok: false, message: "Требуется вход в аккаунт." };
  }
  if (!phone.trim()) {
    return { ok: false, message: "Укажите номер телефона." };
  }
  if (!address.trim()) {
    return { ok: false, message: "Укажите адрес." };
  }
  if (!consent) {
    return { ok: false, message: "Нужно согласие на обработку персональных данных." };
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { phone: phone.trim(), address: address.trim() },
  });

  const order = await createOrderForUser(user.id, user.address, calc);
  return { ok: true, message: "Заявка создана!", orderId: order.id };
}

// Chat-scoped variants used by components/chat/ChatOrderCalculator.tsx — same
// needs_auth/needs_phone/created flow as above, but only the chat's own
// owner may place an order in it (an admin viewing someone else's chat
// never gets the calculator button in the first place, this is defense in
// depth), and the resulting order is also linked as an ORDER-kind
// ChatMessage so it shows up as a preview card for both sides.
export async function createOrderFromCalculatorInChat(
  chatId: string,
  calc: Calc2State,
): Promise<
  | { status: "created"; orderId: string }
  | { status: "needs_phone"; phone: string | null; address: string | null }
  | { status: "needs_auth" }
>{
  const session = await auth();
  if (!session?.user.id) {
    return { status: "needs_auth" };
  }

  const [user, chat] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.chat.findUnique({ where: { id: chatId } }),
  ]);
  if (!user || !chat || chat.userId !== user.id) {
    return { status: "needs_auth" };
  }
  if (!user.phone || !user.address) {
    return { status: "needs_phone", phone: user.phone, address: user.address };
  }

  const order = await createOrderForUser(user.id, user.address, calc, chatId);
  return { status: "created", orderId: order.id };
}

export async function submitPhoneAndCreateOrderInChat(
  chatId: string,
  phone: string,
  address: string,
  consent: boolean,
  calc: Calc2State,
) {
  const session = await auth();
  if (!session?.user.id) {
    return { ok: false, message: "Требуется вход в аккаунт." };
  }
  if (!phone.trim()) {
    return { ok: false, message: "Укажите номер телефона." };
  }
  if (!address.trim()) {
    return { ok: false, message: "Укажите адрес." };
  }
  if (!consent) {
    return { ok: false, message: "Нужно согласие на обработку персональных данных." };
  }

  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat || chat.userId !== session.user.id) {
    return { ok: false, message: "Требуется вход в аккаунт." };
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { phone: phone.trim(), address: address.trim() },
  });

  const order = await createOrderForUser(user.id, user.address, calc, chatId);
  return { ok: true, message: "Заявка создана!", orderId: order.id };
}
