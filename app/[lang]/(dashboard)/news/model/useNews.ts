"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { NewsItem } from "./types";
import type { Locale } from "../../../dictionaries";

type NewsResponse = {
  news: NewsItem[];
  currentDay: number;
  totalArchive?: number;
  loadedArchive?: number;
};

type ArchiveResponse = {
  news: NewsItem[];
  totalArchive: number;
  loadedArchive: number;
};

// Загрузка hot + первых 10 архивных новостей (первая загрузка)
async function fetchInitialNews(locale: Locale): Promise<NewsResponse> {
  const res = await fetch(`/api/news/initial?locale=${locale}&archiveLimit=10`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке новостей");
  }
  return res.json();
}

// Загрузка следующей порции архивных новостей
async function fetchArchiveNews(locale: Locale, offset: number, limit: number = 10): Promise<ArchiveResponse> {
  const res = await fetch(`/api/news/archive?locale=${locale}&offset=${offset}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке архивных новостей");
  }
  return res.json();
}

// Загрузка только новой hot новости (обновление)
async function fetchUpdateNews(locale: Locale): Promise<NewsResponse> {
  const res = await fetch(`/api/news/update?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке обновления");
  }
  return res.json();
}

// Загрузка только currentDay (для быстрого обновления)
async function fetchCurrentDay(locale: Locale): Promise<number> {
  const res = await fetch(`/api/news/current-day?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке currentDay");
  }
  const data = await res.json();
  return data.currentDay;
}

export function useNews(locale: Locale) {
  const queryClient = useQueryClient();

  // Загружаем все новости до currentDay при первой загрузке
  const initialNewsQuery = useQuery<NewsResponse, Error>({
    queryKey: ["news", locale, "initial"], 
    queryFn: () => fetchInitialNews(locale),
    staleTime: Infinity, // Не устаревают, так как новости статичны
    refetchOnWindowFocus: false,
  });

  // Загружаем currentDay отдельно (обновляется каждые 30 секунд)
  const currentDayQuery = useQuery<number, Error>({
    queryKey: ["news", locale, "currentDay"], 
    queryFn: () => fetchCurrentDay(locale),
    staleTime: 0, // Всегда обновляем currentDay
    refetchInterval: 30000, // Обновляем каждые 30 секунд
    refetchOnWindowFocus: true,
    enabled: true,
  });

  // Отслеживаем изменения currentDay и загружаем только новую hot новость
  useEffect(() => {
    const previousDay = initialNewsQuery.data?.currentDay || 1;
    const currentDay = currentDayQuery.data || initialNewsQuery.data?.currentDay || 1;

    // Если currentDay увеличился, загружаем только новую hot новость
    if (currentDay > previousDay && initialNewsQuery.data && currentDay > 1) {
      // Используем React Query для загрузки новой новости (с кэшированием и retry)
      queryClient.fetchQuery<NewsResponse>({
        queryKey: ["news", locale, "update", currentDay],
        queryFn: () => fetchUpdateNews(locale),
        staleTime: Infinity, // Не устаревает, так как это исторические данные
        retry: 2, // Повторяем запрос до 2 раз при ошибке
      }).then((response) => {
        if (response.news && response.news.length > 0) {
          const newHotNews = response.news[0]; // Берем первую (и единственную) новость
          
          // Обновляем кэш: добавляем новую hot новость
          queryClient.setQueryData<NewsResponse>(
            ["news", locale, "initial"],
            (oldData) => {
              if (!oldData) return oldData;

              // Проверяем, есть ли уже эта новость по sorted_order
              const existingIndex = oldData.news.findIndex(
                (n) => (n as any).sorted_order === (newHotNews as any).sorted_order
              );

              if (existingIndex !== -1) {
                // Новость уже есть в кэше, просто обновляем currentDay
                return {
                  ...oldData,
                  currentDay: response.currentDay,
                };
              }

              // Новая новость еще не в списке - добавляем её
              // Старая hot новость переходит в архив (убираем флаг is_hot)
              const oldHotNews = oldData.news.find(item => (item as any).is_hot);
              const existingArchive = oldData.news.filter(item => !(item as any).is_hot);
              
              // Добавляем старую hot в архив (если она есть)
              const updatedArchive = oldHotNews 
                ? [...existingArchive, { ...oldHotNews, is_hot: false }]
                : existingArchive;
              
              // Сортируем архив от новых к старым по дате
              const sortedArchive = [...updatedArchive].sort((a, b) => 
                new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
              );
              
              // Формируем итоговый список: новая hot + архив
              const finalNews = [
                { ...newHotNews, is_hot: true },
                ...sortedArchive
              ];

              return {
                ...oldData,
                news: finalNews,
                currentDay: response.currentDay,
                totalArchive: (oldData.totalArchive || 0) + (oldHotNews ? 1 : 0), // Увеличиваем если старая hot перешла в архив
                loadedArchive: sortedArchive.length,
              };
            }
          );
        }
      }).catch((error) => {
        console.error("Failed to fetch update news:", error);
      });
    }
  }, [currentDayQuery.data, locale, queryClient, initialNewsQuery.data]);

  const news = initialNewsQuery.data?.news || [];
  const currentDay = currentDayQuery.data || initialNewsQuery.data?.currentDay || 1;
  const totalArchive = initialNewsQuery.data?.totalArchive || 0;
  const loadedArchive = initialNewsQuery.data?.loadedArchive || 0;
  const isLoading = initialNewsQuery.isLoading;
  const error = initialNewsQuery.error || currentDayQuery.error;

  // Функция для загрузки следующей порции архивных новостей
  const loadMoreArchive = async (currentLoadedCount: number) => {
    const limit = 10;
    const response = await queryClient.fetchQuery<ArchiveResponse>({
      queryKey: ["news", locale, "archive", currentLoadedCount],
      queryFn: () => fetchArchiveNews(locale, currentLoadedCount, limit),
      staleTime: Infinity,
      retry: 2,
    });

    // Обновляем кэш, добавляя новые архивные новости
    queryClient.setQueryData<NewsResponse>(
      ["news", locale, "initial"],
      (oldData) => {
        if (!oldData) return oldData;
        
        // Добавляем новые архивные новости к существующим
        const existingArchive = oldData.news.filter(item => !(item as any).is_hot);
        const newArchive = response.news;
        const allArchive = [...existingArchive, ...newArchive];
        
        // Сохраняем hot новость отдельно
        const hotNews = oldData.news.find(item => (item as any).is_hot);
        
        return {
          ...oldData,
          news: hotNews ? [hotNews, ...allArchive] : allArchive,
          loadedArchive: allArchive.length,
        };
      }
    );

    return response;
  };

  return {
    data: {
      news,
      currentDay,
      totalArchive,
      loadedArchive,
    },
    isLoading,
    error,
    loadMoreArchive,
  };
}
