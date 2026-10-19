import path from "node:path";
import fs from "node:fs";

/**
 * Файловое хранилище заявок: append-only NDJSON.
 * На serverless (Vercel/Netlify) /tmp — единственная перезаписываемая
 * директория; файл эфемерный per-instance (ограничение честно описано в README).
 * Выбор простого файла: ноль нативных зависимостей, работает на любом хостинге.
 */

export type Lead = {
  name: string;
  phone: string;
  interest: string;
  comment: string;
  utm: string;
  referrer: string;
  source_url: string;
  created_at: string;
};

const IS_SERVERLESS =
  process.env.VERCEL === "1" ||
  process.env.NETLIFY === "true" ||
  process.env.NETLIFY === "1" ||
  process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;

const DATA_PATH =
  process.env.LEADS_DB_PATH ??
  (IS_SERVERLESS
    ? path.join("/tmp", "leads.ndjson")
    : path.join(process.cwd(), "data", "leads.ndjson"));

export const DEDUP_WINDOW_MS = 10 * 60 * 1000; // 10 минут

function readAll(): Lead[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Lead);
  } catch {
    return [];
  }
}

function append(lead: Lead): void {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.appendFileSync(DATA_PATH, JSON.stringify(lead) + "\n", "utf8");
}

export type InsertLead = {
  name: string;
  phone: string;
  interest: string;
  comment?: string;
  utm?: string | null;
  referrer?: string;
  sourceUrl?: string;
};

/**
 * Проверка дедупа + вставка. Node.js однопоточен: между чтением и записью
 * запрос того же инстанса не может вклиниться — атомарность обеспечена.
 * Возвращает duplicate=true, если за DEDUP_WINDOW_MS от номера уже была заявка.
 */
export function insertLead(input: InsertLead): { ok: boolean; duplicate: boolean } {
  const recent = readAll().find(
    (l) =>
      l.phone === input.phone &&
      Date.parse(l.created_at) > Date.now() - DEDUP_WINDOW_MS
  );
  if (recent) return { ok: false, duplicate: true };

  const lead: Lead = {
    name: input.name,
    phone: input.phone,
    interest: input.interest,
    comment: input.comment ?? "",
    utm: input.utm ?? "",
    referrer: input.referrer ?? "",
    source_url: input.sourceUrl ?? "",
    created_at: new Date().toISOString(),
  };
  append(lead);
  return { ok: true, duplicate: false };
}

export function allLeads(): Lead[] {
  return readAll();
}
