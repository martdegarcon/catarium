"use client";

import { useQuery } from "@tanstack/react-query";
import type { Vacancy } from "./types";
import type { Locale } from "../../../dictionaries";

type VacanciesResponse = {
  vacancies: Vacancy[];
};

type VacancyResponse = {
  vacancy: Vacancy;
};

async function fetchVacancies(locale: Locale): Promise<VacanciesResponse> {
  const res = await fetch(`/api/labor-market/vacancies?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке вакансий");
  }
  return res.json();
}

async function fetchVacancy(id: string, locale: Locale): Promise<VacancyResponse> {
  const res = await fetch(`/api/labor-market/vacancies/${id}?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке вакансии");
  }
  return res.json();
}

export function useVacancies(locale: Locale) {
  const query = useQuery<VacanciesResponse, Error>({
    queryKey: ["labor-market", "vacancies", locale],
    queryFn: () => fetchVacancies(locale),
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
  });

  return {
    vacancies: query.data?.vacancies || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useVacancy(id: string | null, locale: Locale) {
  const query = useQuery<VacancyResponse, Error>({
    queryKey: ["labor-market", "vacancy", id, locale],
    queryFn: () => fetchVacancy(id!, locale),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    vacancy: query.data?.vacancy,
    isLoading: query.isLoading,
    error: query.error,
  };
}

