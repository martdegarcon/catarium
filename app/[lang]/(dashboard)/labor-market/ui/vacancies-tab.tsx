"use client";

import { useState, useMemo } from "react";
import { useVacancies, useVacancy } from "../model/useVacancies";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import type { Vacancy } from "../model/types";
import { VacancyCard } from "@/components/features/labor-market/vacancy-card";
import { VacancyFilters } from "@/components/features/labor-market/vacancy-filters";
import { VacanciesTabSkeleton } from "@/components/features/labor-market/labor-market-skeleton";
import { formatCurrencyRange } from "@/components/features/labor-market/currency-utils";
import { translateEmploymentType } from "@/components/features/labor-market/employment-type-utils";
import { Button } from "@/components/ui/button";

type VacanciesTabProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const VACANCIES_PER_PAGE = 10;

export function VacanciesTab({ locale, dictionary }: VacanciesTabProps) {
  const { vacancies, isLoading, error } = useVacancies(locale);
  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>(vacancies);
  const [currentPage, setCurrentPage] = useState(1);

  // Обновляем filteredVacancies когда vacancies загрузились
  useMemo(() => {
    if (vacancies.length > 0) {
      setFilteredVacancies(vacancies);
      setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
    }
  }, [vacancies]);

  // Пагинация
  const totalPages = Math.ceil(filteredVacancies.length / VACANCIES_PER_PAGE);
  const startIndex = (currentPage - 1) * VACANCIES_PER_PAGE;
  const endIndex = startIndex + VACANCIES_PER_PAGE;
  const paginatedVacancies = filteredVacancies.slice(startIndex, endIndex);

  const { vacancy: selectedVacancy } = useVacancy(selectedVacancyId, locale);

  // Сбрасываем страницу при изменении фильтров
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredVacancies.length]);

  if (isLoading) {
    return <VacanciesTabSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
        {dictionary.pages.laborMarket.error}
      </div>
    );
  }

  if (vacancies.length === 0) {
    return (
      <div className="w-full rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.laborMarket.emptyState.noVacancies}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <VacancyFilters
        vacancies={vacancies}
        onFiltered={setFilteredVacancies}
        dictionary={dictionary}
        locale={locale}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Список вакансий */}
        <div className="lg:col-span-2 space-y-4">
          {filteredVacancies.length === 0 ? (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              Вакансии не найдены
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Найдено вакансий: <span className="font-bold text-foreground">{filteredVacancies.length}</span>
                  {filteredVacancies.length !== vacancies.length && (
                    <span className="ml-2 text-muted-foreground">(из {vacancies.length} всего)</span>
                  )}
                </p>
              </div>
              
              {/* Список вакансий на текущей странице */}
              <div className="space-y-4">
              {paginatedVacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  locale={locale}
                  dictionary={dictionary}
                  onClick={() => setSelectedVacancyId(vacancy.id)}
                />
              ))}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Назад
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Показываем только текущую страницу и соседние
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page}>...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Вперед
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Боковая панель с деталями */}
        {selectedVacancy && (
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 space-y-6 shadow-lg shadow-black/5">
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedVacancy.title}</h2>
                {selectedVacancy.company && (
                  <p className="text-muted-foreground">{selectedVacancy.company.name}</p>
                )}
              </div>

              {selectedVacancy.salary_min && selectedVacancy.salary_max && (
                <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4 shadow-md">
                  <h3 className="font-semibold mb-2 text-muted-foreground">{dictionary.pages.laborMarket.labels.salary}</h3>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrencyRange(selectedVacancy.salary_min, selectedVacancy.salary_max, locale)}
                  </p>
                </div>
              )}

              {selectedVacancy.location && (
                <div>
                  <h3 className="font-semibold mb-2">{dictionary.pages.laborMarket.labels.location}</h3>
                  <p>{selectedVacancy.location}</p>
                </div>
              )}

              {selectedVacancy.employment_type && (
                <div>
                  <h3 className="font-semibold mb-2">{dictionary.pages.laborMarket.labels.employmentType}</h3>
                  <p>{translateEmploymentType(selectedVacancy.employment_type, dictionary)}</p>
                </div>
              )}

              {selectedVacancy.description && (
                <div>
                  <h3 className="font-semibold mb-2">{dictionary.pages.laborMarket.labels.requirements}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedVacancy.description}
                  </p>
                </div>
              )}

              {selectedVacancy.company && (
                <div className="pt-4 border-t border-border/50">
                  <h3 className="font-semibold mb-3">{dictionary.pages.laborMarket.labels.companyOverview}</h3>
                  <div className="space-y-2 text-sm">
                    {selectedVacancy.company.employee_count && (
                      <div>
                        <span className="text-muted-foreground">
                          {dictionary.pages.laborMarket.labels.employeeCount}:
                        </span>
                        <span className="ml-2">
                          {new Intl.NumberFormat("ru-RU").format(selectedVacancy.company.employee_count)}
                        </span>
                      </div>
                    )}
                    {selectedVacancy.company.founded_year && (
                      <div>
                        <span className="text-muted-foreground">
                          {dictionary.pages.laborMarket.labels.foundedYear}:
                        </span>
                        <span className="ml-2">{selectedVacancy.company.founded_year}</span>
                      </div>
                    )}
                    {selectedVacancy.company.description && (
                      <p className="text-muted-foreground text-xs line-clamp-3">
                        {selectedVacancy.company.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
