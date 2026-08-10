// The SQLite Prisma provider has no native enum type, so these columns are
// plain strings in the schema. These const arrays + union types recover the
// compile-time safety and give a runtime whitelist for validating form input
// (the DB itself won't reject an out-of-range string).

export const ORDER_KINDS = [
  "GENERAL",
  "WINDOWS",
  "RENOVATION",
  "SUPPORT",
  "STANDARD",
  "DEATH",
  "FLOOD",
  "FIRE",
] as const;
export type OrderKind = (typeof ORDER_KINDS)[number];

export const USER_ROLES = ["ADMIN", "USER", "BANNED"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SERVICE_BLOCK_SIZES = ["BIG", "SMALL"] as const;
export type ServiceBlockSize = (typeof SERVICE_BLOCK_SIZES)[number];

export const CALCULATOR_FIELDS = [
  "OBJECT_TYPE",
  "DIRT",
  "BUILDING_TYPE",
  "REGION",
  "URGENCY",
  "STAFF",
  "EXTRA",
] as const;
export type CalculatorField = (typeof CALCULATOR_FIELDS)[number];

export const CHAT_SENDERS = ["USER", "ADMIN", "BOT"] as const;
export type ChatSender = (typeof CHAT_SENDERS)[number];

export const CHAT_MESSAGE_KINDS = ["TEXT", "ORDER"] as const;
export type ChatMessageKind = (typeof CHAT_MESSAGE_KINDS)[number];
