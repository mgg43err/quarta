"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeByPhone, isValidName } from "@/lib/phone";

const INTERESTS = [
  { id: "subscription", label: "Подписка" },
  { id: "order", label: "Разовый заказ" },
  { id: "question", label: "Вопрос" },
];

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; duplicate?: boolean }
  | { kind: "error"; message: string };

type Utm = Record<string, string>;

function collectUtm(): Utm {
  try {
    const fromStorage: Utm = JSON.parse(sessionStorage.getItem("utm") || "{}");
    const params = new URLSearchParams(window.location.search);
    const current: Utm = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "yclid"]) {
      const v = params.get(key);
      if (v) current[key] = v.slice(0, 200);
    }
    const merged = { ...fromStorage, ...current };
    if (Object.keys(current).length > 0) {
      sessionStorage.setItem("utm", JSON.stringify(merged));
    }
    return merged;
  } catch {
    return {};
  }
}

async function postLead(payload: object, signal?: AbortSignal) {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<string>("subscription");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const lastSubmitRef = useRef(0);
  const utmRef = useRef<Utm>({});

  useEffect(() => {
    utmRef.current = collectUtm();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // throttle: не чаще 1 сабмита в секунду
    if (Date.now() - lastSubmitRef.current < 1000) return;
    lastSubmitRef.current = Date.now();

    setPhoneError(null);
    setNameError(null);

    if (!isValidName(name)) {
      setNameError("Как вас зовут? Хотя бы пару букв.");
      return;
    }
    if (!normalizeByPhone(phone)) {
      setPhoneError(
        "Похоже, номер не белорусский мобильный — проверьте +375 (25, 29, 33, 44)"
      );
      return;
    }

    setStatus({ kind: "submitting" });

    const payload = {
      name,
      phone,
      interest,
      comment,
      utm: utmRef.current,
      referrer: document.referrer,
      sourceUrl: window.location.href,
    };

    try {
      let { res, data } = await postLead(payload);
      // 5xx → одна ретрай-попытка через 2 с; 4xx — ошибка пользователя, не ретраим
      if (res.status >= 500) {
        await new Promise((r) => setTimeout(r, 2000));
        ({ res, data } = await postLead(payload));
      }
      if (res.ok || (res.status === 409 && data?.ok)) {
        setStatus({ kind: "success", duplicate: Boolean(data?.duplicate) });
        return;
      }
      setStatus({
        kind: "error",
        message:
          data?.error ?? `Не отправилось (${res.status}). Попробуйте ещё раз.`,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      // одна ретрай-попытка через 2 секунды на сетевую ошибку
      try {
        await new Promise((r) => setTimeout(r, 2000));
        const { res, data } = await postLead(payload);
        if (res.ok) {
          setStatus({ kind: "success", duplicate: Boolean(data?.duplicate) });
          return;
        }
        setStatus({
          kind: "error",
          message:
            data?.error ??
            "Не отправилось. Попробуйте ещё раз или позвоните нам.",
        });
      } catch {
        setStatus({
          kind: "error",
          message:
            "Не отправилось — похоже, нет связи. Попробуйте ещё раз или позвоните нам.",
        });
      }
    }
  };

  if (status.kind === "success") {
    return (
      <div className="rounded-2xl border border-accent/30 bg-paper-deep p-8 text-center">
        <p className="font-display text-2xl">Записали ✍️</p>
        <p className="mt-3 text-ink-soft">
          {status.duplicate
            ? "Заявка от вас уже есть — мы перезвоним, дублей не появится."
            : "Мы перезвоним в течение рабочего дня и всё оформим."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            Имя
          </span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Анна"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`rounded-xl border bg-white px-4 py-3 outline-none transition-colors focus:border-accent ${
              nameError ? "border-accent" : "border-line"
            }`}
          />
          {nameError && <span className="text-sm text-accent">{nameError}</span>}
        </label>

        <label className="grid gap-1.5">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            Телефон
          </span>
          <input
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+375 (29) 123-45-67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`rounded-xl border bg-white px-4 py-3 outline-none transition-colors focus:border-accent ${
              phoneError ? "border-accent" : "border-line"
            }`}
          />
          {phoneError && (
            <span className="text-sm text-accent">{phoneError}</span>
          )}
        </label>
      </div>

      <fieldset>
        <legend className="font-mono text-xs uppercase tracking-widest text-ink-soft">
          Что интересует
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {INTERESTS.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setInterest(it.id)}
              aria-pressed={interest === it.id}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                interest === it.id
                  ? "border-ink bg-ink text-paper"
                  : "border-line hover:border-ink"
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
          Комментарий
        </span>
        <textarea
          name="comment"
          rows={3}
          placeholder="Например: хочется что-то фруктовое, кофе машина капельная"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none rounded-xl border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-accent"
        />
      </label>

      {status.kind === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-accent"
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "submitting"}
        className="justify-self-start rounded-full bg-accent px-8 py-3.5 font-semibold text-paper transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status.kind === "submitting" ? "Отправляем…" : "Отправить заявку"}
      </button>
    </form>
  );
}
