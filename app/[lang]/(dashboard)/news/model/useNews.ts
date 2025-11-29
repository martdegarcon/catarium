"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { NewsItem } from "./types";
import type { Locale } from "../../../dictionaries";

type NewsResponse = {
  news: NewsItem[];
  currentDay: number;
};

// Загрузка всех новостей до currentDay (первая загрузка)
async function fetchInitialNews(locale: Locale): Promise<NewsResponse> {
  const res = await fetch(`/api/news/initial?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке новостей");
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
              // Данные уже отсортированы на сервере по sorted_order
              const updatedNews = [...oldData.news, newHotNews];
              
              // Сортируем по sorted_order (данные уже отсортированы на сервере)
              updatedNews.sort((a, b) => {
                const orderA = (a as any).sorted_order || 0;
                const orderB = (b as any).sorted_order || 0;
                return orderA - orderB;
              });

              return {
                ...oldData,
                news: updatedNews,
                currentDay: response.currentDay,
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
  const isLoading = initialNewsQuery.isLoading;
  const error = initialNewsQuery.error || currentDayQuery.error;

  return {
    data: {
      news,
      currentDay,
    },
    isLoading,
    error,
  };
}
