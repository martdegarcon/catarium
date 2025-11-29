"use client";

import { useQuery } from "@tanstack/react-query";
import type { Government } from "./types";

type GovernmentResponse = {
  government: Government[];
};

async function fetchGovernment(): Promise<GovernmentResponse> {
  const res = await fetch(`/api/politics/government`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке правительства");
  }
  return res.json();
}

export function useGovernment() {
  const query = useQuery<GovernmentResponse, Error>({
    queryKey: ["politics", "government"],
    queryFn: fetchGovernment,
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
  });

  return {
    government: query.data?.government || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

