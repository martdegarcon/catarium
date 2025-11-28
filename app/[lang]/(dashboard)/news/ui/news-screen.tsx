"use client";

import { useMemo } from "react";
import { useNews } from "../model/useNews";
import type { NewsItem } from "../model/types";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";

type NewsScreenProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function NewsScreen({ locale, dictionary }: NewsScreenProps) {
  const { data, isLoading, error } = useNews(locale);

  // Разделяем новости на hot и archive
  const { hotNews, archiveNews } = useMemo(() => {
    if (!data) return { hotNews: [], archiveNews: [] };
    
    const hot = data.filter(item => item.status === 'hot');
    const archive = data.filter(item => item.status === 'archive');
    
    return { hotNews: hot, archiveNews: archive };
  }, [data]);

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
      <div className="mx-auto w-full max-w-5xl rounded-lg border p-6 text-center text-sm text-muted-foreground">
        Новостей пока нет
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
      
      {/* Горячая новость - показываем отдельно */}
      {hotNews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
              🔥 HOT
            </span>
            <h2 className="text-2xl font-bold">Горячая новость</h2>
          </div>
          
          {hotNews.map((item) => (
            <div key={item.id} className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/20 p-6">
              <h2 className="text-2xl font-bold">{item.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {new Date(item.published_at).toLocaleDateString(localeMap[locale])}
              </p>
              <p className="mt-4 text-base">{item.content}</p>
              {item.reading_time && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Время чтения: {item.reading_time}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Архивные новости - показываем списком */}
      {archiveNews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Архив новостей</h2>
          <div className="grid gap-4">
            {archiveNews.map((item) => (
              <div key={item.id} className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {new Date(item.published_at).toLocaleDateString(localeMap[locale])}
                </p>
                <p className="mt-2 text-sm">{item.content.slice(0, 200)}...</p>
                {item.reading_time && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.reading_time}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
