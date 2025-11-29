"use client";

import { useQuery } from "@tanstack/react-query";
import type { Politician } from "./types";

type PoliticiansResponse = {
  politicians: Politician[];
};

type PoliticianResponse = {
  politician: Politician;
};

async function fetchPoliticians(): Promise<PoliticiansResponse> {
  const res = await fetch(`/api/politics/politicians`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке политиков");
  }
  return res.json();
}

async function fetchPolitician(id: string): Promise<PoliticianResponse> {
  const res = await fetch(`/api/politics/politicians/${id}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке политика");
  }
  return res.json();
}

export function usePoliticians() {
  const query = useQuery<PoliticiansResponse, Error>({
    queryKey: ["politics", "politicians"],
    queryFn: fetchPoliticians,
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
  });

  return {
    politicians: query.data?.politicians || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function usePolitician(id: string | null) {
  const query = useQuery<PoliticianResponse, Error>({
    queryKey: ["politics", "politician", id],
    queryFn: () => fetchPolitician(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    politician: query.data?.politician,
    isLoading: query.isLoading,
    error: query.error,
  };
}

