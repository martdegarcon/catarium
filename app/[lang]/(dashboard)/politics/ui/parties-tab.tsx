"use client";

import { usePoliticalParties } from "../model/usePoliticalParties";
import { usePoliticsStatistics } from "../model/usePoliticsStatistics";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { PartyCard } from "@/components/features/politics/party-card";
import { PartiesTabSkeleton } from "@/components/features/politics/politics-skeleton";

type PartiesTabProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Render a responsive list of political parties with loading, error, and empty states.
 *
 * Renders a loading skeleton while data is loading, an error message if fetching fails,
 * an empty-state message when no parties are available, or a grid of PartyCard components
 * annotated with member counts when data is present.
 *
 * @param locale - Locale used for formatting and language-specific presentation
 * @param dictionary - Localized strings used for UI messages within the component
 * @returns A React element showing the loading skeleton, error message, empty state, or a grid of parties
 */
export function PartiesTab({ locale, dictionary }: PartiesTabProps) {
  const { parties, isLoading, error } = usePoliticalParties();
  const { statistics } = usePoliticsStatistics();

  // Создаем мапу количество членов по партиям
  const memberCountMap = new Map<string, number>();
  statistics?.partyCounts.forEach((party) => {
    memberCountMap.set(party.uuid, party.count);
  });

  if (isLoading) {
    return <PartiesTabSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
        {dictionary.pages.politics.error}
      </div>
    );
  }

  if (parties.length === 0) {
    return (
      <div className="w-full rounded-lg border border-border/50 bg-muted/50 p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.politics.emptyState.noParties}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {parties.map((party) => (
        <PartyCard
          key={party.uuid}
          party={party}
          locale={locale}
          dictionary={dictionary}
          memberCount={memberCountMap.get(party.uuid)}
        />
      ))}
    </div>
  );
}
