"use client";

import { useState, useMemo } from "react";
import { useCompanies } from "../model/useCompanies";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import type { Company } from "../model/types";
import { CompanyCard } from "@/components/features/labor-market/company-card";
import { CompanyFilters } from "@/components/features/labor-market/company-filters";
import { CompaniesTabSkeleton } from "@/components/features/labor-market/labor-market-skeleton";

type CompaniesTabProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function CompaniesTab({ locale, dictionary }: CompaniesTabProps) {
  const { companies, isLoading, error } = useCompanies(locale);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companies);

  // Обновляем filteredCompanies когда companies загрузились
  useMemo(() => {
    if (companies.length > 0) {
      setFilteredCompanies(companies);
    }
  }, [companies]);

  if (isLoading) {
    return <CompaniesTabSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
        {dictionary.pages.laborMarket.error}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="w-full rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.laborMarket.emptyState.noCompanies}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <CompanyFilters
        companies={companies}
        onFiltered={setFilteredCompanies}
        dictionary={dictionary}
      />

      {/* Результаты */}
      {filteredCompanies.length === 0 ? (
        <div className="w-full rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Компании не найдены
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Найдено компаний: <span className="font-bold text-foreground">{filteredCompanies.length}</span>
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                locale={locale}
                dictionary={dictionary}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
