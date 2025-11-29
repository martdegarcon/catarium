// Утилиты для работы с типами занятости
// Переводы типов занятости

import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";

export type EmploymentType = "full-time" | "part-time" | "contract" | "remote" | "hybrid";

/**
 * Получает переведенный тип занятости
 */
export function translateEmploymentType(
  type: string,
  dictionary: Dictionary
): string {
  const translations = dictionary.pages.laborMarket.labels.employmentTypes;
  if (!translations || typeof translations !== "object") {
    return type; // Fallback если нет переводов
  }
  
  const translated = (translations as Record<string, string>)[type];
  return translated || type;
}

/**
 * Получает все возможные типы занятости с переводами для текущей локали
 */
export function getEmploymentTypesWithTranslations(
  dictionary: Dictionary
): Array<{ key: EmploymentType; label: string }> {
  const types: EmploymentType[] = ["full-time", "part-time", "contract", "remote", "hybrid"];
  
  return types.map((type) => ({
    key: type,
    label: translateEmploymentType(type, dictionary),
  }));
}

/**
 * Ищет тип занятости по переведенному названию (для поиска)
 */
export function findEmploymentTypeByQuery(
  query: string,
  dictionary: Dictionary
): EmploymentType | null {
  const types = getEmploymentTypesWithTranslations(dictionary);
  const queryLower = query.toLowerCase();
  
  // Ищем по переведенному названию
  const found = types.find((type) => 
    type.label.toLowerCase().includes(queryLower) ||
    type.key.toLowerCase().includes(queryLower)
  );
  
  return found?.key || null;
}

