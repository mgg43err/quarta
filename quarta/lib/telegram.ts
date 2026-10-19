/**
 * Дублирование заявки в Telegram. Env-driven:
 * TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID. Нет токена — тихо пропускаем.
 */
export async function notifyTelegram(lead: {
  name: string;
  phone: string;
  interest: string;
  comment?: string;
  utm?: string | null;
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    `☕️ Новая заявка`,
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Интерес: ${lead.interest}`,
    lead.comment ? `Комментарий: ${lead.comment}` : null,
    lead.utm ? `UTM: ${lead.utm}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch {
    // Telegram не критичен: заявка уже сохранена, деградируем молча
  }
}
