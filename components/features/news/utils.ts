import type { NewsItem } from "@/app/[lang]/(dashboard)/news/model/types";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";

export type TabCategory = "all" | "politics" | "economy" | "society" | "technology" | "culture";

/**
 * Получает путь к локальному изображению на основе ID новости
 * Использует остаток от деления для распределения по 24 доступным изображениям
 */
export function getLocalImageUrl(newsId: number): string {
  const imageNumber = ((newsId - 1) % 24) + 1;
  return `/image/${imageNumber}.png`;
}

/**
 * Создает маппинг категорий для фильтрации новостей
 */
export function createCategoryMapping(dictionary: Dictionary) {
  const economyCategories = [
    dictionary.pages.news.sections.economy.category,
    "Экономика", "Economy", "经济",
    "экономика", "economy"
  ];
  const technologyCategories = [
    dictionary.pages.news.sections.technology.category,
    "Технологии", "Technology", "技术",
    "технологии", "technology"
  ];
  const societyCategories = [
    dictionary.pages.news.sections.society.category,
    "Общество", "Society", "社会",
    "общество", "society"
  ];
  const politicsCategories = [
    "Политика", "Politics", "政治",
    "политика", "politics"
  ];
  const cultureCategories = [
    "Культура", "Culture", "文化",
    "культура", "culture"
  ];

  return {
    economy: economyCategories,
    technology: technologyCategories,
    society: societyCategories,
    politics: politicsCategories,
    culture: cultureCategories,
  };
}

/**
 * Определяет категорию новости на основе её category поля
 */
export function getNewsCategory(
  item: NewsItem,
  categoryMapping: ReturnType<typeof createCategoryMapping>
): TabCategory {
  if (!item.category) return "all";
  
  const categoryLower = item.category.toLowerCase();
  const categoryExact = item.category;

  if (categoryMapping.politics.some(cat => 
    cat.toLowerCase() === categoryLower || cat === categoryExact
  )) {
    return "politics";
  }

  if (categoryMapping.economy.some(cat => 
    cat.toLowerCase() === categoryLower || cat === categoryExact
  )) {
    return "economy";
  }
  
  if (categoryMapping.society.some(cat => 
    cat.toLowerCase() === categoryLower || cat === categoryExact
  )) {
    return "society";
  }
  
  if (categoryMapping.technology.some(cat => 
    cat.toLowerCase() === categoryLower || cat === categoryExact
  )) {
    return "technology";
  }
  
  if (categoryMapping.culture.some(cat => 
    cat.toLowerCase() === categoryLower || cat === categoryExact
  )) {
    return "culture";
  }
  
  return "all";
}

/**
 * Локальная мапа для форматирования дат
 */
export const localeMap: Record<Locale, string> = {
  ru: "ru-RU",
  en: "en-US",
  zh: "zh-CN",
};

