import { describe, it, expect } from "vitest";
import { normalizeByPhone, formatByPhone, isValidName } from "@/lib/phone";

describe("normalizeByPhone", () => {
  const valid = [
    ["+375291234567", "+375291234567"],
    ["375291234567", "+375291234567"],
    ["80291234567", "+375291234567"],
    ["8-029 123-45-67", "+375291234567"],
    ["0291234567", "+375291234567"],
    ["29 123 45 67", "+375291234567"],
    ["+375 (44) 777-88-99", "+375447778899"],
    ["+375251112233", "+375251112233"],
    ["+375331112233", "+375331112233"],
    ["телефон: +375291234567, звоните", "+375291234567"],
  ] as const;

  for (const [input, expected] of valid) {
    it(`${JSON.stringify(input)} → ${expected}`, () => {
      expect(normalizeByPhone(input)).toBe(expected);
    });
  }

  const invalid = [
    "",
    "нуля",
    "+37511122333", // не мобильный префикс
    "+375221234567",
    "+3752912345", // 8 цифр
    "+3752912345670", // 10 цифр
    "13021234567",
    "8 903 123-45-67", // российский
    "+375111112233",
  ];

  for (const input of invalid) {
    it(`${JSON.stringify(input)} → null`, () => {
      expect(normalizeByPhone(input)).toBeNull();
    });
  }
});

describe("formatByPhone", () => {
  it("форматирует для человека", () => {
    expect(formatByPhone("+375291234567")).toBe("+375 (29) 123-45-67");
  });
  it("пустота → пустая строка", () => {
    expect(formatByPhone(null)).toBe("");
  });
});

describe("isValidName", () => {
  it("принимает нормальные имена", () => {
    expect(isValidName("Анна")).toBe(true);
    expect(isValidName(" Ли ")).toBe(true);
  });
  it("отклоняет пустое и однобуквенное", () => {
    expect(isValidName("")).toBe(false);
    expect(isValidName("   ")).toBe(false);
    expect(isValidName("Л")).toBe(false);
  });
});
