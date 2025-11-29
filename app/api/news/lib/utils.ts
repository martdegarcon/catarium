/**
 * Утилиты для работы с новостями
 * 
 * Содержит вспомогательные функции:
 * - seededShuffle: детерминированная перестановка массива на основе seed
 * - uuidToSeed: преобразование UUID в числовой seed для генерации
 */

/**
 * Детерминированный shuffle на основе seed
 * Гарантирует одинаковый порядок элементов при одинаковом seed
 * 
 * @param array - массив для перемешивания
 * @param seed - числовой seed для генерации случайного порядка
 * @returns перемешанный массив
 */
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let rng = seed;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    rng = (rng * 1664525 + 1013904223) % 2**32;
    const j = rng % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Преобразует UUID пользователя в числовой seed
 * Используется для генерации персонализированного порядка новостей
 * 
 * @param uuid - UUID пользователя
 * @returns числовой seed
 */
export function uuidToSeed(uuid: string): number {
  return parseInt(uuid.replace(/-/g, '').slice(0, 8), 16);
}

