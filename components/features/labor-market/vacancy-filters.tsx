"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, MapPin } from "lucide-react";
import type { Vacancy } from "@/app/[lang]/(dashboard)/labor-market/model/types";
import type { Dictionary } from "@/types/dictionary";
import { translateEmploymentType, findEmploymentTypeByQuery, getEmploymentTypesWithTranslations } from "./employment-type-utils";
import type { Locale } from "@/app/[lang]/dictionaries";

type VacancyFiltersProps = {
  vacancies: Vacancy[];
  onFiltered: (filtered: Vacancy[]) => void;
  dictionary: Dictionary;
  locale: Locale;
};

export function VacancyFilters({ vacancies, onFiltered, dictionary, locale }: VacancyFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<Set<string>>(new Set());

  // Получаем типы занятости с переводами
  const employmentTypesWithTranslations = useMemo(
    () => getEmploymentTypesWithTranslations(dictionary),
    [dictionary]
  );

  // Извлекаем уникальные локации
  const locations = useMemo(() => {
    const locs = new Set<string>();
    vacancies.forEach((v) => {
      if (v.location) locs.add(v.location);
    });
    return Array.from(locs).sort();
  }, [vacancies]);

  // Фильтрация
  const filteredVacancies = useMemo(() => {
    let filtered = vacancies;

    // Поиск по названию, компании, описанию и типу занятости
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      // Проверяем, не является ли запрос поиском по типу занятости
      const employmentTypeMatch = findEmploymentTypeByQuery(query, dictionary);
      
      filtered = filtered.filter((vacancy) => {
        // Обычный поиск
        const matchesBasicSearch =
          vacancy.title.toLowerCase().includes(query) ||
          vacancy.company?.name.toLowerCase().includes(query) ||
          vacancy.description?.toLowerCase().includes(query) ||
          vacancy.location?.toLowerCase().includes(query);
        
        // Поиск по типу занятости
        const matchesEmploymentType =
          employmentTypeMatch &&
          vacancy.employment_type === employmentTypeMatch;
        
        // Поиск по переведенному типу занятости
        const translatedType = vacancy.employment_type
          ? translateEmploymentType(vacancy.employment_type, dictionary).toLowerCase()
          : "";
        const matchesTranslatedType = translatedType.includes(query);
        
        return matchesBasicSearch || matchesEmploymentType || matchesTranslatedType;
      });
    }

    // Фильтр по локациям
    if (selectedLocations.size > 0) {
      filtered = filtered.filter(
        (vacancy) => vacancy.location && selectedLocations.has(vacancy.location)
      );
    }

    // Фильтр по типу занятости
    if (selectedEmploymentTypes.size > 0) {
      filtered = filtered.filter(
        (vacancy) =>
          vacancy.employment_type && selectedEmploymentTypes.has(vacancy.employment_type)
      );
    }

    return filtered;
  }, [vacancies, searchQuery, selectedLocations, selectedEmploymentTypes, dictionary]);

  // Передаем отфильтрованные вакансии родителю
  useMemo(() => {
    onFiltered(filteredVacancies);
  }, [filteredVacancies, onFiltered]);

  const toggleLocation = (location: string) => {
    const newSet = new Set(selectedLocations);
    if (newSet.has(location)) {
      newSet.delete(location);
    } else {
      newSet.add(location);
    }
    setSelectedLocations(newSet);
  };

  const toggleEmploymentType = (type: string) => {
    const newSet = new Set(selectedEmploymentTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedEmploymentTypes(newSet);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocations(new Set());
    setSelectedEmploymentTypes(new Set());
  };

  const hasActiveFilters = searchQuery || selectedLocations.size > 0 || selectedEmploymentTypes.size > 0;

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
        <Input
          placeholder="Поиск по названию, компании, описанию, типу занятости..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 border-border/50 bg-muted/40 backdrop-blur-xl"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Фильтры по локациям */}
      {locations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            {dictionary.pages.laborMarket.labels.location}:
          </div>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Button
                key={location}
                variant={selectedLocations.has(location) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleLocation(location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Фильтры по типу занятости */}
      {employmentTypesWithTranslations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            {dictionary.pages.laborMarket.labels.employmentType}:
          </div>
          <div className="flex flex-wrap gap-2">
            {employmentTypesWithTranslations.map(({ key, label }) => (
              <Button
                key={key}
                variant={selectedEmploymentTypes.has(key) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleEmploymentType(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка очистки фильтров */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} size="sm">
          <X className="mr-2 h-4 w-4" />
          Очистить фильтры
        </Button>
      )}
    </div>
  );
}
