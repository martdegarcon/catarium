"use client";

import { useQuery } from "@tanstack/react-query";
import type { NewsItem } from "./types";
import type { Locale } from "../../../dictionaries";

type NewsResponse = {
  news: NewsItem[];
  currentDay: number;
};

async function fetchNews(locale: Locale): Promise<NewsResponse> {
  const res = await fetch(`/api/news?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке новостей");
  }
  return res.json();
}

export function useNews(locale: Locale) {
  return useQuery<NewsResponse, Error>({
    queryKey: ["news", locale], 
    queryFn: () => fetchNews(locale),
    staleTime: 1000 * 60, 
    refetchOnWindowFocus: false,
  });
}

