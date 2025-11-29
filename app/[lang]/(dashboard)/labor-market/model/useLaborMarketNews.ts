"use client";

import { useQuery } from "@tanstack/react-query";
import type { LaborMarketNews } from "./types";
import type { Locale } from "../../../dictionaries";

type LaborMarketNewsResponse = {
  news: LaborMarketNews[];
};

async function fetchLaborMarketNews(locale: Locale): Promise<LaborMarketNewsResponse> {
  const res = await fetch(`/api/labor-market/news?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке новостей");
  }
  return res.json();
}

export function useLaborMarketNews(locale: Locale) {
  const query = useQuery<LaborMarketNewsResponse, Error>({
    queryKey: ["labor-market", "news", locale],
    queryFn: () => fetchLaborMarketNews(locale),
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
  });

  return {
    news: query.data?.news || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

