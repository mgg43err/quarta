const BY_MOBILE_PREFIXES = ["25", "29", "33", "44"] as const;
export const BY_COUNTRY_CODE = "375";

/** Нормализует белорусский номер к формату +375XXXXXXXXX или null. */
export function normalizeByPhone(input: string): string | null {
  let digits = (input ?? "").replace(/\D/g, "");

  if (digits.startsWith(BY_COUNTRY_CODE)) {
    digits = digits.slice(3);
  } else if (digits.startsWith("8") && digits.length === 11) {
    digits = digits.slice(1);
  } else if (digits.startsWith("8") && digits.length === 12) {
    digits = digits.slice(1);
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (digits.length !== 9) return null;
  if (!BY_MOBILE_PREFIXES.includes((digits[0] + digits[1]) as "25" | "29" | "33" | "44")) {
    return null;
  }
  return `+375${digits}`;
}

/** Форматирует нормализованный номер для отображения: +375 (29) 123-45-67 */
export function formatByPhone(e164: string | null): string {
  if (!e164) return "";
  const d = e164.slice(4); // 9 цифр
  return `+375 (${d.slice(0, 2)}) ${d.slice(2, 5)}-${d.slice(5, 7)}-${d.slice(7, 9)}`;
}

export function isValidName(name: string): boolean {
  return (name ?? "").trim().length >= 2;
}
