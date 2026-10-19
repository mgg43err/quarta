import { LRU } from "./lru";

/**
 * Простой in-memory rate limiter (fixed window + LRU-вытеснение).
 * Per-instance: деградирует при горизонтальном масштабировании —
 * для лендинга с десятками заявок в неделю этого достаточно.
 */

const buckets = new LRU<{ count: number; windowStart: number }>(1000);

export type RateResult = { ok: boolean; retryAfterSec?: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now }, windowMs);
    return { ok: true };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((bucket.windowStart + windowMs - now) / 1000),
    };
  }
  return { ok: true };
}

export const IP_LIMIT_PER_MIN = 20;
export const PHONE_LIMIT_PER_HOUR = 5;
export const IP_WINDOW_MS = 60_000;
export const PHONE_WINDOW_MS = 3_600_000;

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : null) ?? "unknown";
}
