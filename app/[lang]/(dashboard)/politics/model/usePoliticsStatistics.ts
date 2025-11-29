"use client";

import { useQuery } from "@tanstack/react-query";

type PartyCount = {
  name: string;
  count: number;
  uuid: string;
};

type GenderCount = {
  name: string;
  count: number;
};

type TopPolitician = {
  uuid: string;
  name: string;
  avatar_path?: string | null;
  gender?: string | null;
};

type StatisticsResponse = {
  statistics: {
    totalPoliticians: number;
    activeParties: number;
    totalMinistries: number;
    governmentMembers: number;
    partyCounts: PartyCount[];
    genderCounts: GenderCount[];
    topPoliticians: TopPolitician[];
  };
};

async function fetchStatistics(): Promise<StatisticsResponse> {
  const res = await fetch(`/api/politics/statistics`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке статистики");
  }
  return res.json();
}

export function usePoliticsStatistics() {
  const query = useQuery<StatisticsResponse, Error>({
    queryKey: ["politics", "statistics"],
    queryFn: fetchStatistics,
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
  });

  return {
    statistics: query.data?.statistics,
    isLoading: query.isLoading,
    error: query.error,
  };
}

