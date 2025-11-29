"use client";

import Link from "next/link";
import type { Company } from "@/app/[lang]/(dashboard)/labor-market/model/types";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { formatCurrency } from "./currency-utils";
import { Building2, Users, Calendar, TrendingUp, DollarSign } from "lucide-react";

type CompanyCardProps = {
  company: Company;
  locale: Locale;
  dictionary: Dictionary;
};

export function CompanyCard({ company, locale, dictionary }: CompanyCardProps) {
  return (
    <Link
      href={`/${locale}/labor-market/companies/${company.id}`}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5"
    >
      <div className="relative space-y-5">
        {/* Заголовок */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-muted/40 backdrop-blur-sm">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                {company.name}
              </h3>
            </div>
          </div>
          {company.description && (
            <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed">
              {company.description}
            </p>
          )}
        </div>

        {/* Метрики */}
        <div className="grid grid-cols-2 gap-3">
          {company.employee_count && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3.5 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {dictionary.pages.laborMarket.labels.employeeCount}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {new Intl.NumberFormat("ru-RU").format(company.employee_count)}
              </p>
            </div>
          )}

          {company.founded_year && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3.5 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {dictionary.pages.laborMarket.labels.foundedYear}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {company.founded_year}
              </p>
            </div>
          )}

          {company.average_salary && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3.5 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {dictionary.pages.laborMarket.labels.averageSalary}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(company.average_salary, locale)}
              </p>
            </div>
          )}

          {company.net_profit && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3.5 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {dictionary.pages.laborMarket.labels.netProfit}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(company.net_profit, locale)}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
