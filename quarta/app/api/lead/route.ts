import { NextRequest } from "next/server";
import { normalizeByPhone, isValidName } from "@/lib/phone";
import { insertLead } from "@/lib/db";
import {
  rateLimit,
  clientIp,
  IP_LIMIT_PER_MIN,
  IP_WINDOW_MS,
  PHONE_LIMIT_PER_HOUR,
  PHONE_WINDOW_MS,
} from "@/lib/ratelimit";
import { notifyTelegram } from "@/lib/telegram";

const INTERESTS = new Set(["subscription", "order", "question"]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, error: "Некорректный запрос" },
      { status: 400 }
    );
  }

  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name : "";
  const phoneRaw = typeof b.phone === "string" ? b.phone : "";
  const interest = typeof b.interest === "string" ? b.interest : "";
  const comment = typeof b.comment === "string" ? b.comment : "";
  const utm =
    typeof b.utm === "object" && b.utm !== null
      ? JSON.stringify(b.utm)
      : "";
  const referrer = typeof b.referrer === "string" ? b.referrer : "";
  const sourceUrl = typeof b.sourceUrl === "string" ? b.sourceUrl : "";

  // Rate limit по IP
  const ip = clientIp(req);
  const ipRate = rateLimit(`ip:${ip}`, IP_LIMIT_PER_MIN, IP_WINDOW_MS);
  if (!ipRate.ok) {
    return Response.json(
      { ok: false, error: "Слишком много запросов, попробуйте позже" },
      { status: 429, headers: { "retry-after": String(ipRate.retryAfterSec ?? 60) } }
    );
  }

  // Валидация
  const phone = normalizeByPhone(phoneRaw);
  if (!isValidName(name)) {
    return Response.json(
      { ok: false, error: "Напишите имя — хотя бы пару букв" },
      { status: 400 }
    );
  }
  if (!phone) {
    return Response.json(
      {
        ok: false,
        error:
          "Похоже, номер не белорусский мобильный. Проверьте: он начинается с +375 (25, 29, 33, 44)?",
      },
      { status: 400 }
    );
  }
  if (!INTERESTS.has(interest)) {
    return Response.json(
      { ok: false, error: "Выберите, что вас интересует" },
      { status: 400 }
    );
  }

  // Rate limit по телефону (не 10 заявок в час с одного номера)
  const phoneRate = rateLimit(`phone:${phone}`, PHONE_LIMIT_PER_HOUR, PHONE_WINDOW_MS);
  if (!phoneRate.ok) {
    return Response.json(
      { ok: false, error: "Слишком часто, попробуйте позже" },
      { status: 429, headers: { "retry-after": String(phoneRate.retryAfterSec ?? 60) } }
    );
  }

  // Дедуп внутри транзакции
  const result = insertLead({
    name: name.trim(),
    phone,
    interest,
    comment: comment.trim(),
    utm,
    referrer,
    sourceUrl,
  });

  if (result.ok) {
    void notifyTelegram({ name, phone, interest, comment, utm });
    return Response.json({ ok: true, duplicate: false });
  }
  // Дубль: клиенту отдаём «успех» с пояснением — повторный клик не должен пугать
  return Response.json({
    ok: true,
    duplicate: true,
    message: "Заявка уже принята — мы перезвоним",
  });
}
