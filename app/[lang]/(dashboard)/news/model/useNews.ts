"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { NewsItem } from "./types";
import type { Locale } from "../../../dictionaries";

type NewsResponse = {
  news: NewsItem[];
  currentDay: number;
};

const STORAGE_KEY = (locale: Locale) => `news_${locale}`;

// Загрузка всех новостей (только при первой загрузке)
async function fetchAllNews(locale: Locale): Promise<NewsResponse> {
  const res = await fetch(`/api/news?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке новостей");
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

// Загрузка новостей из localStorage
function loadNewsFromStorage(locale: Locale): NewsItem[] | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY(locale));
    if (stored) {
      return JSON.parse(stored) as NewsItem[];
    }
  } catch (error) {
    console.error("Failed to load news from localStorage:", error);
  }
  return null;
}

export function useNews(locale: Locale) {
  // Загружаем новости из localStorage сразу для мгновенного отображения
  const [cachedNews, setCachedNews] = useState<NewsItem[] | null>(() => 
    loadNewsFromStorage(locale)
  );
  
  // Загружаем все новости только при первой загрузке (если нет в кэше)
  const allNewsQuery = useQuery<NewsResponse, Error>({
    queryKey: ["news", locale, "all"], 
    queryFn: () => fetchAllNews(locale),
    staleTime: Infinity, // Новости не устаревают, они статичны
    refetchOnWindowFocus: false,
    enabled: !cachedNews, // Загружаем только если нет в кэше
  });

  // Загружаем currentDay отдельно (обновляется каждые 30 секунд)
  const currentDayQuery = useQuery<number, Error>({
    queryKey: ["news", locale, "currentDay"], 
    queryFn: () => fetchCurrentDay(locale),
    staleTime: 0, // Всегда обновляем currentDay
    refetchInterval: 30000, // Обновляем каждые 30 секунд
    refetchOnWindowFocus: true,
    enabled: true, // Запускаем сразу
  });

  // Сохраняем новости в localStorage при загрузке
  useEffect(() => {
    if (allNewsQuery.data?.news) {
      try {
        localStorage.setItem(STORAGE_KEY(locale), JSON.stringify(allNewsQuery.data.news));
        setCachedNews(allNewsQuery.data.news);
      } catch (error) {
        console.error("Failed to save news to localStorage:", error);
      }
    }
  }, [allNewsQuery.data?.news, locale]);

  // Используем новости из кэша или из запроса
  const news = cachedNews || allNewsQuery.data?.news || [];
  const currentDay = currentDayQuery.data || allNewsQuery.data?.currentDay || 1;

  // isLoading = true только если нет кэша и идет загрузка
  const isLoading = !cachedNews && allNewsQuery.isLoading;
  const error = allNewsQuery.error || currentDayQuery.error;

  return {
    data: {
      news,
      currentDay,
    },
    isLoading,
    error,
  };
}

