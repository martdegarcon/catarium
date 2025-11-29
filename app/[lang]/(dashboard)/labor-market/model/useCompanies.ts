"use client";

import { useQuery } from "@tanstack/react-query";
import type { Company } from "./types";
import type { Locale } from "../../../dictionaries";

type CompaniesResponse = {
  companies: Company[];
};

async function fetchCompanies(locale: Locale): Promise<CompaniesResponse> {
  const res = await fetch(`/api/labor-market/companies?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке компаний");
  }
  return res.json();
}

export function useCompanies(locale: Locale) {
  const query = useQuery<CompaniesResponse, Error>({
    queryKey: ["labor-market", "companies", locale],
    queryFn: () => fetchCompanies(locale),
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
  });

  return {
    companies: query.data?.companies || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

