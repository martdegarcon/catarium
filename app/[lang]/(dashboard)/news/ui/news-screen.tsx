"use client";

import { useMemo, useState } from "react";
import { useNews } from "../model/useNews";
import type { NewsItem } from "../model/types";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

type NewsScreenProps = {
  locale: Locale;
  dictionary: Dictionary;
};

type TabCategory = "all" | "politics" | "economy" | "society" | "technology" | "culture";

export function NewsScreen({ locale, dictionary }: NewsScreenProps) {
  const { data: newsResponse, isLoading, error } = useNews(locale);
  const [selectedTab, setSelectedTab] = useState<TabCategory>("all");
  
  // Извлекаем новости и currentDay из ответа
  const data = newsResponse?.news || [];
  const currentDay = newsResponse?.currentDay || 1;

  const tabs: TabCategory[] = ["all", "politics", "economy", "society", "technology", "culture"];

  // Функция для получения пути к локальному изображению на основе ID новости
  // Игнорируем image_url из БД, используем только локальные файлы из public/image/
  const getLocalImageUrl = (newsId: number): string => {
    // У нас есть 24 изображения (1.png - 24.png), используем остаток от деления
    const imageNumber = ((newsId - 1) % 24) + 1;
    return `/image/${imageNumber}.png`;
  };

  // Маппинг категорий для фильтрации
  const categoryMapping = useMemo(() => {
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
  }, [dictionary]);

  // Функция для определения категории новости
  const getNewsCategory = useMemo(() => {
    return (item: NewsItem): TabCategory => {
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
    };
  }, [categoryMapping]);

  // Сначала сортируем все новости от старых к новым по дате публикации
  // Это дает нам последовательный порядок всех 180 новостей
  const sortedAllNews = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Сортируем все новости от старых к новым по дате
    return [...data].sort((a, b) => 
      new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
    );
  }, [data]);

  // Определяем hot и archive среди всех новостей (до фильтрации по категориям)
  // Hot: новость на позиции currentDay - 1 в отсортированном списке (день 1 = индекс 0)
  // Archive: все новости до currentDay
  const { allHotNews, allArchiveNews } = useMemo(() => {
    if (!sortedAllNews || sortedAllNews.length === 0) return { allHotNews: null, allArchiveNews: [] };
    
    const hotIndex = currentDay - 1;
    const hot = hotIndex >= 0 && hotIndex < sortedAllNews.length ? sortedAllNews[hotIndex] : null;
    const archive = hotIndex > 0 ? sortedAllNews.slice(0, hotIndex) : [];
    
    return { 
      allHotNews: hot, 
      allArchiveNews: archive 
    };
  }, [sortedAllNews, currentDay]);

  // Фильтрация новостей по выбранной вкладке
  const filteredData = useMemo(() => {
    if (!sortedAllNews || sortedAllNews.length === 0) return [];
    
    return selectedTab === "all" 
      ? sortedAllNews 
      : sortedAllNews.filter(item => getNewsCategory(item) === selectedTab);
  }, [sortedAllNews, selectedTab, getNewsCategory]);

  // Фильтруем hot и archive по выбранной категории
  const { hotNews, archiveNews } = useMemo(() => {
    // Hot новость: если она попадает в выбранную категорию, показываем её
    const hot = allHotNews && (
      selectedTab === "all" || getNewsCategory(allHotNews) === selectedTab
    ) ? [allHotNews] : [];
    
    // Archive: фильтруем по категории
    const archive = selectedTab === "all" 
      ? allArchiveNews 
      : allArchiveNews.filter(item => getNewsCategory(item) === selectedTab);
    
    return { hotNews: hot, archiveNews: archive };
  }, [allHotNews, allArchiveNews, selectedTab, getNewsCategory]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl animate-pulse rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.news.loading}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
        {dictionary.pages.news.error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{dictionary.pages.news.title}</h1>
        <div className="mx-auto w-full max-w-5xl rounded-lg border p-6 text-center text-sm text-muted-foreground">
          {dictionary.pages.news.emptyState?.noNews || "Новостей пока нет"}
        </div>
      </div>
    );
  }

  // Проверяем, есть ли новости после фильтрации
  if (filteredData.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{dictionary.pages.news.title}</h1>
        
        {/* Вкладки для фильтрации по категориям */}
        <div className="flex flex-wrap gap-2 border-b pb-4">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? "default" : "ghost"}
              onClick={() => setSelectedTab(tab)}
              className={selectedTab === tab ? "font-semibold" : ""}
            >
              {dictionary.pages.news.tabs[tab]}
            </Button>
          ))}
        </div>
        
        <div className="mx-auto w-full max-w-5xl rounded-lg border p-6 text-center text-sm text-muted-foreground">
          {dictionary.pages.news.emptyState?.noNewsInCategory || "Новостей в этой категории пока нет"}
        </div>
      </div>
    );
  }

  const localeMap: Record<Locale, string> = {
    ru: "ru-RU",
    en: "en-US",
    zh: "zh-CN",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{dictionary.pages.news.title}</h1>
      
      {/* Вкладки для фильтрации по категориям */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? "default" : "ghost"}
            onClick={() => setSelectedTab(tab)}
            className={selectedTab === tab ? "font-semibold" : ""}
          >
            {dictionary.pages.news.tabs[tab]}
          </Button>
        ))}
      </div>
      
      {/* Горячая новость - показываем отдельно */}
      {hotNews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
              🔥 HOT
            </span>
            <h2 className="text-2xl font-bold">{dictionary.pages.news.labels?.hotNews || "Горячая новость"}</h2>
          </div>
          
          {hotNews.map((item) => (
            <div key={item.id} className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/20 p-6">
              <div className="flex gap-4">
                {/* Картинка слева */}
                <div className="flex-shrink-0">
                  <img
                    src={getLocalImageUrl(item.id)}
                    alt={item.title}
                    className="w-[150px] h-[150px] rounded-lg object-cover"
                    onError={(e) => {
                      // Если изображение не загрузилось, заменяем на плейсхолдер
                      e.currentTarget.style.display = 'none';
                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  <div className="w-[150px] h-[150px] bg-muted rounded-lg flex items-center justify-center hidden">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                
                {/* Контент справа */}
                <div className="flex-1 space-y-3">
                  {/* Заголовок */}
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                  
                  {/* Контент */}
                  <p className="text-base leading-relaxed">{item.content}</p>
                  
                  {/* Категория - стилизованная как теги */}
                  {item.category && (
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-200">
                        {item.category}
                      </span>
                    </div>
                  )}
                  
                  {/* Автор */}
                  {item.author && (
                    <div>
                      <span className="text-sm font-semibold text-muted-foreground">{dictionary.pages.news.labels?.author || "Автор"}: </span>
                      <span className="text-sm font-medium">{item.author}</span>
                    </div>
                  )}
                  
                  {/* Дата публикации */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {new Date(item.published_at).toLocaleDateString(localeMap[locale], {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {item.reading_time && (
                      <span>{dictionary.pages.news.labels?.readingTime || "Время чтения"}: {item.reading_time}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Архивные новости - показываем списком */}
      {archiveNews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{dictionary.pages.news.labels?.archiveNews || "Архив новостей"}</h2>
          <div className="grid gap-4">
            {archiveNews.map((item) => (
              <div key={item.id} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="flex gap-4">
                  {/* Картинка слева */}
                  <div className="flex-shrink-0">
                    <img
                      src={getLocalImageUrl(item.id)}
                      alt={item.title}
                      className="w-[150px] h-[150px] rounded-lg object-cover"
                      onError={(e) => {
                        // Если изображение не загрузилось, заменяем на плейсхолдер
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <div className="w-[150px] h-[150px] bg-muted rounded-lg flex items-center justify-center hidden">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                  
                  {/* Контент справа */}
                  <div className="flex-1 space-y-2">
                    {/* Заголовок */}
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    
                    {/* Контент (первые 200 символов) */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.content.slice(0, 200)}...
                    </p>
                    
                    {/* Категория - стилизованная как теги */}
                    {item.category && (
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-200">
                          {item.category}
                        </span>
                      </div>
                    )}
                    
                    {/* Автор */}
                    {item.author && (
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">{dictionary.pages.news.labels?.author || "Автор"}: </span>
                        <span className="text-xs font-medium">{item.author}</span>
                      </div>
                    )}
                    
                    {/* Дата публикации */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {new Date(item.published_at).toLocaleDateString(localeMap[locale], {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {item.reading_time && (
                        <span>{dictionary.pages.news.labels?.readingTime || "Время чтения"}: {item.reading_time}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
