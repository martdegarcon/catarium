"use client";

import type { Vacancy } from "@/app/[lang]/(dashboard)/labor-market/model/types";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { formatCurrencyRange } from "./currency-utils";
import { translateEmploymentType } from "./employment-type-utils";
import { MapPin, Briefcase } from "lucide-react";

type VacancyCardProps = {
  vacancy: Vacancy;
  locale: Locale;
  dictionary: Dictionary;
  onClick?: () => void;
};

export function VacancyCard({ vacancy, locale, dictionary, onClick }: VacancyCardProps) {
  const salary = formatCurrencyRange(vacancy.salary_min, vacancy.salary_max, locale);
  const employmentTypeTranslated = vacancy.employment_type
    ? translateEmploymentType(vacancy.employment_type, dictionary)
    : null;

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 cursor-pointer shadow-lg shadow-black/5"
    >
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold leading-tight text-foreground mb-2">
                {vacancy.title}
              </h3>
              {vacancy.company && (
                <p className="text-sm font-semibold text-muted-foreground/90 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                  {vacancy.company.name}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {vacancy.location && (
                <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/40 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{vacancy.location}</span>
                </div>
              )}

              {employmentTypeTranslated && (
                <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/40 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{employmentTypeTranslated}</span>
                </div>
              )}
            </div>

            {vacancy.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground/90 leading-relaxed">
                {vacancy.description}
              </p>
            )}
          </div>

          {salary && (
            <div className="flex-shrink-0 rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md px-5 py-4 text-foreground shadow-lg min-w-[140px]">
              <div className="text-xs opacity-90 font-medium mb-1">Зарплата</div>
              <div className="text-lg font-bold leading-tight">{salary}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
