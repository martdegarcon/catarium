/**
 * Форматирует количество детей с правильным склонением для русского языка
 */
export function formatChildren(count: number, locale: string): string {
  if (locale !== "ru") {
    return `${count}`;
  }

  // Русское склонение
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${count} детей`;
  }

  if (lastDigit === 1) {
    return `${count} ребёнок`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${count} ребёнка`;
  }

  return `${count} детей`;
}

