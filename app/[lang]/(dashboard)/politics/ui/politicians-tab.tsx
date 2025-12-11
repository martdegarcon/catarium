"use client";

import { useState, useMemo } from "react";
import { usePoliticians } from "../model/usePoliticians";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import type { Politician } from "../model/types";
import { PoliticianCardCompact } from "@/components/features/politics/politician-card-compact";
import { PoliticianFilters } from "@/components/features/politics/politician-filters";
import { PoliticiansTabSkeleton } from "@/components/features/politics/politics-skeleton";

type PoliticiansTabProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Render a politicians management tab with filters, results information, and a compact list of politician cards.
 *
 * @param locale - Locale used for formatting and localized components
 * @param dictionary - Localized strings for UI labels, messages, and table headers
 * @returns The politicians tab UI as a React element
 */
export function PoliticiansTab({ locale, dictionary }: PoliticiansTabProps) {
  const { politicians, isLoading, error } = usePoliticians();
  const [filteredPoliticians, setFilteredPoliticians] = useState<Politician[]>(politicians);

  // Обновляем filteredPoliticians когда politicians загрузились
  useMemo(() => {
    if (politicians.length > 0) {
      setFilteredPoliticians(politicians);
    }
  }, [politicians]);

  if (isLoading) {
    return <PoliticiansTabSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
        {dictionary.pages.politics.error}
      </div>
    );
  }

  if (politicians.length === 0) {
    return (
      <div className="w-full rounded-lg border border-border/50 bg-muted/50 p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.politics.emptyState.noPoliticians}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <PoliticianFilters
        politicians={politicians}
        onFiltered={setFilteredPoliticians}
        dictionary={dictionary}
        locale={locale}
      />

      {/* Информация о результатах */}
      {filteredPoliticians.length !== politicians.length && (
        <div className="rounded-lg border border-border/50 bg-muted/50 p-3 text-sm text-muted-foreground">
          {dictionary.pages.politics.messages.foundPoliticians}: <span className="font-semibold text-foreground">{filteredPoliticians.length}</span>
          {filteredPoliticians.length !== politicians.length && (
            <span className="ml-2">({dictionary.pages.politics.messages.outOf} {politicians.length} {dictionary.pages.politics.messages.total})</span>
          )}
        </div>
      )}

      {/* Список политиков - компактный вид */}
      {filteredPoliticians.length === 0 ? (
        <div className="rounded-lg border border-border/50 bg-muted/50 p-6 text-center text-sm text-muted-foreground">
          {dictionary.pages.politics.messages.noPoliticiansFiltered}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Заголовки колонок (десктоп) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground border-b border-border/50">
            <div className="col-span-3">{dictionary.pages.politics.tableHeaders.name}</div>
            <div className="col-span-2">{dictionary.pages.politics.tableHeaders.birthday}</div>
            <div className="col-span-2">{dictionary.pages.politics.tableHeaders.province}</div>
            <div className="col-span-3">{dictionary.pages.politics.tableHeaders.party}</div>
            <div className="col-span-1">{dictionary.pages.politics.tableHeaders.family}</div>
            <div className="col-span-1">{dictionary.pages.politics.tableHeaders.children}</div>
          </div>
          {filteredPoliticians.map((politician) => (
            <PoliticianCardCompact
              key={politician.uuid}
              politician={politician}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>
      )}
    </div>
  );
}
