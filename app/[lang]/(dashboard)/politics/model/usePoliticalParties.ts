"use client";

import { useQuery } from "@tanstack/react-query";
import type { PoliticalParty } from "./types";

type PartiesResponse = {
  parties: PoliticalParty[];
};

type PartyResponse = {
  party: PoliticalParty;
  members: any[]; // PoliticalPartyMember with relations
};

async function fetchParties(): Promise<PartiesResponse> {
  const res = await fetch(`/api/politics/parties`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке партий");
  }
  return res.json();
}

async function fetchParty(id: string): Promise<PartyResponse> {
  const res = await fetch(`/api/politics/parties/${id}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке партии");
  }
  return res.json();
}

export function usePoliticalParties() {
  const query = useQuery<PartiesResponse, Error>({
    queryKey: ["politics", "parties"],
    queryFn: fetchParties,
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
  });

  return {
    parties: query.data?.parties || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function usePoliticalParty(id: string | null) {
  const query = useQuery<PartyResponse, Error>({
    queryKey: ["politics", "party", id],
    queryFn: () => fetchParty(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    party: query.data?.party,
    members: query.data?.members || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

