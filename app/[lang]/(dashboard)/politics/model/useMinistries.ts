"use client";

import { useQuery } from "@tanstack/react-query";
import type { Ministry } from "./types";

type MinistriesResponse = {
  ministries: Ministry[];
};

type MinistryResponse = {
  ministry: Ministry;
  members: any[]; // MinistryMember with relations
};

async function fetchMinistries(): Promise<MinistriesResponse> {
  const res = await fetch(`/api/politics/ministries`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке министерств");
  }
  return res.json();
}

async function fetchMinistry(id: string): Promise<MinistryResponse> {
  const res = await fetch(`/api/politics/ministries/${id}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке министерства");
  }
  return res.json();
}

export function useMinistries() {
  const query = useQuery<MinistriesResponse, Error>({
    queryKey: ["politics", "ministries"],
    queryFn: fetchMinistries,
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
  });

  return {
    ministries: query.data?.ministries || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useMinistry(id: string | null) {
  const query = useQuery<MinistryResponse, Error>({
    queryKey: ["politics", "ministry", id],
    queryFn: () => fetchMinistry(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ministry: query.data?.ministry,
    members: query.data?.members || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

