// Next.js calls register() once when the server process boots (both
// `next dev` and `next start`) — the ideal place to start the Telegram bot's
// long-polling loop exactly once, since this app runs as a persistent Node
// process rather than serverless/edge (see lib/telegramBot.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { startTelegramBot } = await import("@/lib/telegramBot");
  startTelegramBot();
}
