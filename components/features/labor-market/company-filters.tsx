"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowUpDown } from "lucide-react";
import type { Company } from "@/app/[lang]/(dashboard)/labor-market/model/types";
import type { Dictionary } from "@/types/dictionary";

type CompanyFiltersProps = {
  companies: Company[];
  onFiltered: (filtered: Company[]) => void;
  dictionary: Dictionary;
};

type SortOrder = "lowest" | "highest" | null;

export function CompanyFilters({ companies, onFiltered, dictionary }: CompanyFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Фильтрация и сортировка
  const filteredCompanies = useMemo(() => {
    let filtered = [...companies];

    // Поиск по названию
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.description?.toLowerCase().includes(query)
      );
    }

    // Сортировка по средней зарплате
    if (sortOrder) {
      filtered = filtered.filter((company) => company.average_salary !== null && company.average_salary !== undefined);
      
      filtered.sort((a, b) => {
        const salaryA = a.average_salary || 0;
        const salaryB = b.average_salary || 0;
        
        if (sortOrder === "lowest") {
          return salaryA - salaryB;
        } else {
          return salaryB - salaryA;
        }
      });
    }

    return filtered;
  }, [companies, searchQuery, sortOrder]);

  // Передаем отфильтрованные компании родителю
  useMemo(() => {
    onFiltered(filteredCompanies);
  }, [filteredCompanies, onFiltered]);

  const clearFilters = () => {
    setSearchQuery("");
    setSortOrder(null);
  };

  const hasActiveFilters = searchQuery || sortOrder;

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
        <Input
          placeholder="Поиск по названию компании..."
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

      {/* Сортировка по зарплате */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Сортировка по средней зарплате:</span>
        <div className="flex gap-2">
          <Button
            variant={sortOrder === "lowest" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortOrder(sortOrder === "lowest" ? null : "lowest")}
          >
            От самой низкой
          </Button>
          <Button
            variant={sortOrder === "highest" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortOrder(sortOrder === "highest" ? null : "highest")}
          >
            От самой высокой
          </Button>
        </div>
      </div>

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
