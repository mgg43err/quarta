import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

/**
 * SQLite-хранилище заявок.
 * На Vercel /tmp — единственная перезаписываемая директория; файл
 * эфемерный per-instance (см. README). Через LEADS_DB_PATH можно указать свой путь.
 */

export type Lead = {
  id: number;
  name: string;
  phone: string;
  interest: string;
  comment: string;
  utm: string | null;
  referrer: string;
  source_url: string;
  created_at: string;
};

const IS_SERVERLESS =
  process.env.VERCEL === "1" || process.env.NETLIFY === "true";

const DB_PATH =
  process.env.LEADS_DB_PATH ??
  (IS_SERVERLESS ? "/tmp/leads.db" : path.join(process.cwd(), "data", "leads.db"));

function initDb(): Database.Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      interest TEXT NOT NULL,
      comment TEXT,
      utm TEXT,
      referrer TEXT,
      source_url TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
  `);
  return db;
}

// Синглтон: переживает HMR, не открывает новое соединение на каждый запрос.
const globalStore = globalThis as unknown as { __quartaDb?: Database.Database };
const db = globalStore.__quartaDb ?? initDb();
globalStore.__quartaDb = db;

export const DEDUP_WINDOW_MS = 10 * 60 * 1000; // 10 минут

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
 * Вставка заявки с проверкой дедупа в одной транзакции.
 * Возвращает ok=false, если за DEDUP_WINDOW_MS от этого же номера уже была заявка.
 */
export function insertLead(lead: InsertLead): { ok: boolean; duplicate: boolean } {
  return db
    .transaction(() => {
      const recent = db
        .prepare(
          `SELECT id FROM leads WHERE phone = ? AND created_at > ? LIMIT 1`
        )
        .get(lead.phone, new Date(Date.now() - DEDUP_WINDOW_MS).toISOString());

      if (recent) return { ok: false, duplicate: true };

      db.prepare(
        `INSERT INTO leads (name, phone, interest, comment, utm, referrer, source_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        lead.name,
        lead.phone,
        lead.interest,
        lead.comment ?? "",
        lead.utm ?? null,
        lead.referrer ?? "",
        lead.sourceUrl ?? "",
        new Date().toISOString()
      );
      return { ok: true, duplicate: false };
    })() as { ok: boolean; duplicate: boolean };
}

export function allLeads(): Lead[] {
  return db
    .prepare(`SELECT * FROM leads ORDER BY created_at DESC`)
    .all() as unknown as Lead[];
}
