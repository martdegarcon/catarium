// Утилиты для работы с валютами
// Все значения в БД хранятся в USD, конвертируем при отображении

import type { Locale } from "@/app/[lang]/dictionaries";

export type DisplayCurrency = "USD" | "RUB" | "CNY";

// Курсы валют (1 USD = X валюты)
const EXCHANGE_RATES: Record<DisplayCurrency, number> = {
  USD: 1,
  RUB: 91,  // 1 USD = 91 RUB
  CNY: 7.2, // 1 USD = 7.2 CNY
};

/**
 * Определяет валюту для отображения на основе языка
 */
export function getDisplayCurrency(locale: Locale): DisplayCurrency {
  switch (locale) {
    case "ru":
      return "RUB";
    case "zh":
      return "CNY";
    case "en":
    default:
      return "USD";
  }
}

/**
 * Конвертирует значение из USD в целевую валюту
 */
export function convertFromUSD(value: number, toCurrency: DisplayCurrency): number {
  const rate = EXCHANGE_RATES[toCurrency] || 1;
  return value * rate;
}

/**
 * Получает символ валюты
 */
export function getCurrencySymbol(currency: DisplayCurrency): string {
  switch (currency) {
    case "USD":
      return "$";
    case "RUB":
      return "₽";
    case "CNY":
      return "¥";
    default:
      return "$";
  }
}

/**
 * Форматирует значение в зависимости от языка
 * Все значения в БД в USD, конвертируем при отображении
 */
export function formatCurrency(
  value: number | null | undefined,
  locale: Locale
): string {
  if (!value) return "-";
  
  const currency = getDisplayCurrency(locale);
  const convertedValue = convertFromUSD(value, currency);
  const symbol = getCurrencySymbol(currency);
  
  // Форматирование числа в зависимости от валюты
  const localeMap: Record<DisplayCurrency, string> = {
    USD: "en-US",
    RUB: "ru-RU",
    CNY: "zh-CN",
  };
  
  return `${new Intl.NumberFormat(localeMap[currency], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedValue)} ${symbol}`;
}

/**
 * Форматирует диапазон значений (для зарплат)
 */
export function formatCurrencyRange(
  min: number | null | undefined,
  max: number | null | undefined,
  locale: Locale
): string {
  if (!min && !max) return "-";
  
  const currency = getDisplayCurrency(locale);
  const symbol = getCurrencySymbol(currency);
  const localeMap: Record<DisplayCurrency, string> = {
    USD: "en-US",
    RUB: "ru-RU",
    CNY: "zh-CN",
  };
  
  if (min && max) {
    const minConverted = convertFromUSD(min, currency);
    const maxConverted = convertFromUSD(max, currency);
    return `${new Intl.NumberFormat(localeMap[currency], {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(minConverted)} - ${new Intl.NumberFormat(localeMap[currency], {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(maxConverted)} ${symbol}`;
  }
  
  if (min) {
    const minConverted = convertFromUSD(min, currency);
    return `от ${new Intl.NumberFormat(localeMap[currency], {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(minConverted)} ${symbol}`;
  }
  
  if (max) {
    const maxConverted = convertFromUSD(max, currency);
    return `до ${new Intl.NumberFormat(localeMap[currency], {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(maxConverted)} ${symbol}`;
  }
  
  return "-";
}
