"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Users, Calendar } from "lucide-react";
import type { Politician } from "@/app/[lang]/(dashboard)/politics/model/types";
import type { Dictionary } from "@/types/dictionary";
import type { Locale } from "@/app/[lang]/dictionaries";

type PoliticianFiltersProps = {
  politicians: Politician[];
  onFiltered: (filtered: Politician[]) => void;
  dictionary: Dictionary;
  locale: Locale;
};

type AgeRange = {
  min: number | null;
  max: number | null;
};

export function PoliticianFilters({ politicians, onFiltered, dictionary, locale }: PoliticianFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParties, setSelectedParties] = useState<Set<string>>(new Set());
  const [selectedGenders, setSelectedGenders] = useState<Set<string>>(new Set());
  const [ageRange, setAgeRange] = useState<AgeRange>({ min: null, max: null });

  // Извлекаем уникальные партии
  const parties = useMemo(() => {
    const partySet = new Set<string>();
    politicians.forEach((p) => {
      if (p.parties && p.parties.length > 0) {
        p.parties.forEach((member) => {
          if (member.political_party) {
            partySet.add(member.political_party.uuid);
          }
        });
      }
    });
    return Array.from(partySet);
  }, [politicians]);

  // Получаем названия партий для отображения
  const partyNames = useMemo(() => {
    const names = new Map<string, string>();
    politicians.forEach((p) => {
      if (p.parties && p.parties.length > 0) {
        p.parties.forEach((member) => {
          if (member.political_party) {
            names.set(member.political_party.uuid, member.political_party.name);
          }
        });
      }
    });
    return names;
  }, [politicians]);

  // Извлекаем уникальные полы
  const genders = useMemo(() => {
    const genderSet = new Set<string>();
    politicians.forEach((p) => {
      if (p.gender) {
        genderSet.add(p.gender.uuid);
      }
    });
    return Array.from(genderSet);
  }, [politicians]);

  // Получаем названия полов для отображения
  const genderNames = useMemo(() => {
    const names = new Map<string, string>();
    politicians.forEach((p) => {
      if (p.gender) {
        names.set(p.gender.uuid, p.gender.name);
      }
    });
    return names;
  }, [politicians]);

  // Вычисляем возраст из даты рождения
  const calculateAge = (birthday: string | null | undefined): number | null => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Фильтрация
  const filteredPoliticians = useMemo(() => {
    let filtered = politicians;

    // Поиск по имени
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((politician) =>
        politician.name.toLowerCase().includes(query)
      );
    }

    // Фильтр по партиям
    if (selectedParties.size > 0) {
      filtered = filtered.filter((politician) => {
        if (!politician.parties || politician.parties.length === 0) return false;
        return politician.parties.some((member) =>
          member.political_party && selectedParties.has(member.political_party.uuid)
        );
      });
    }

    // Фильтр по полу
    if (selectedGenders.size > 0) {
      filtered = filtered.filter((politician) =>
        politician.gender && selectedGenders.has(politician.gender.uuid)
      );
    }

    // Фильтр по возрасту
    if (ageRange.min !== null || ageRange.max !== null) {
      filtered = filtered.filter((politician) => {
        const age = calculateAge(politician.birthday);
        if (age === null) return false;
        
        const minMatch = ageRange.min === null || age >= ageRange.min;
        const maxMatch = ageRange.max === null || age <= ageRange.max;
        
        return minMatch && maxMatch;
      });
    }

    return filtered;
  }, [politicians, searchQuery, selectedParties, selectedGenders, ageRange]);

  // Передаем отфильтрованных политиков родителю
  useMemo(() => {
    onFiltered(filteredPoliticians);
  }, [filteredPoliticians, onFiltered]);

  const toggleParty = (partyUuid: string) => {
    const newSet = new Set(selectedParties);
    if (newSet.has(partyUuid)) {
      newSet.delete(partyUuid);
    } else {
      newSet.add(partyUuid);
    }
    setSelectedParties(newSet);
  };

  const toggleGender = (genderUuid: string) => {
    const newSet = new Set(selectedGenders);
    if (newSet.has(genderUuid)) {
      newSet.delete(genderUuid);
    } else {
      newSet.add(genderUuid);
    }
    setSelectedGenders(newSet);
  };

  const handleAgeMinChange = (value: string) => {
    const num = value === "" ? null : parseInt(value, 10);
    setAgeRange((prev) => ({ ...prev, min: num || null }));
  };

  const handleAgeMaxChange = (value: string) => {
    const num = value === "" ? null : parseInt(value, 10);
    setAgeRange((prev) => ({ ...prev, max: num || null }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedParties(new Set());
    setSelectedGenders(new Set());
    setAgeRange({ min: null, max: null });
  };

  const hasActiveFilters =
    searchQuery ||
    selectedParties.size > 0 ||
    selectedGenders.size > 0 ||
    ageRange.min !== null ||
    ageRange.max !== null;

  return (
    <div className="space-y-4 rounded-lg border border-border/50 bg-muted/50 backdrop-blur-xl p-4">
      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
        <Input
          placeholder="Поиск по имени..."
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

      {/* Фильтры по партиям */}
      {parties.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            {dictionary.pages.politics.labels.politicalParty}:
          </div>
          <div className="flex flex-wrap gap-2">
            {parties.map((partyUuid) => (
              <Button
                key={partyUuid}
                variant={selectedParties.has(partyUuid) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleParty(partyUuid)}
              >
                {partyNames.get(partyUuid) || partyUuid}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Фильтры по полу */}
      {genders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {dictionary.pages.politics.labels.gender}:
          </div>
          <div className="flex flex-wrap gap-2">
            {genders.map((genderUuid) => (
              <Button
                key={genderUuid}
                variant={selectedGenders.has(genderUuid) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleGender(genderUuid)}
              >
                {genderNames.get(genderUuid) || genderUuid}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Фильтр по возрасту */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Возраст:
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="От"
            value={ageRange.min === null ? "" : ageRange.min}
            onChange={(e) => handleAgeMinChange(e.target.value)}
            className="w-24 border-border/50 bg-muted/40 backdrop-blur-xl"
            min="0"
            max="120"
          />
          <span className="text-sm text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="До"
            value={ageRange.max === null ? "" : ageRange.max}
            onChange={(e) => handleAgeMaxChange(e.target.value)}
            className="w-24 border-border/50 bg-muted/40 backdrop-blur-xl"
            min="0"
            max="120"
          />
          <span className="text-sm text-muted-foreground">лет</span>
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

