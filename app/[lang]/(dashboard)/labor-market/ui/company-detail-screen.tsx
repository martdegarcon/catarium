"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Users, Calendar, DollarSign, TrendingUp, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import type { Company, Vacancy } from "../model/types";
import { formatCurrency } from "@/components/features/labor-market/currency-utils";
import { formatCurrencyRange } from "@/components/features/labor-market/currency-utils";
import { translateEmploymentType } from "@/components/features/labor-market/employment-type-utils";

type CompanyDetailScreenProps = {
  locale: Locale;
  dictionary: Dictionary;
  companyId: string;
};

type CompanyDetailResponse = {
  company: Company;
  vacancies: Vacancy[];
};

async function fetchCompanyDetail(companyId: string, locale: Locale): Promise<CompanyDetailResponse> {
  const res = await fetch(`/api/labor-market/companies/${companyId}?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке компании");
  }
  return res.json();
}

export function CompanyDetailScreen({ locale, dictionary, companyId }: CompanyDetailScreenProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as Locale || locale;

  const { data, isLoading, error } = useQuery<CompanyDetailResponse, Error>({
    queryKey: ["company", "detail", companyId, locale],
    queryFn: () => fetchCompanyDetail(companyId, locale),
    staleTime: 5 * 60 * 1000, // Кэшируем на 5 минут
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl animate-pulse rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.laborMarket.loading}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {dictionary.pages.laborMarket.labels?.back || "Назад"}
        </Button>
        <div className="rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
          {dictionary.pages.laborMarket.error || "Ошибка при загрузке компании"}
        </div>
      </div>
    );
  }

  const { company, vacancies } = data;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Кнопка "Назад" */}
      <Link href={`/${lang}/labor-market?tab=companies`}>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {dictionary.pages.laborMarket.labels?.back || "Назад к компаниям"}
        </Button>
      </Link>

      {/* Заголовок компании */}
      <div className="flex items-start gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border/50 bg-muted/40 backdrop-blur-sm">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
          {company.description && (
            <p className="text-lg text-muted-foreground">{company.description}</p>
          )}
        </div>
      </div>

      {/* Информация о компании */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {company.employee_count && (
          <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {dictionary.pages.laborMarket.labels.employeeCount}
              </span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {new Intl.NumberFormat("ru-RU").format(company.employee_count)}
            </p>
          </div>
        )}

        {company.founded_year && (
          <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {dictionary.pages.laborMarket.labels.foundedYear}
              </span>
            </div>
            <p className="text-xl font-semibold text-foreground">{company.founded_year}</p>
          </div>
        )}

        {company.average_salary && (
          <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {dictionary.pages.laborMarket.labels.averageSalary}
              </span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(company.average_salary, locale)}
            </p>
          </div>
        )}

        {company.authorized_capital && (
          <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {dictionary.pages.laborMarket.labels.authorizedCapital}
              </span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(company.authorized_capital, locale)}
            </p>
          </div>
        )}

        {company.net_profit && (
          <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {dictionary.pages.laborMarket.labels.netProfit}
              </span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(company.net_profit, locale)}
            </p>
          </div>
        )}

        {company.balance && (
          <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {dictionary.pages.laborMarket.labels.balance}
              </span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(company.balance, locale)}
            </p>
          </div>
        )}
      </div>

      {/* Вакансии компании */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          {dictionary.pages.laborMarket.labels?.viewVacancies || "Вакансии компании"}
        </h2>
        
        {vacancies.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-muted/50 backdrop-blur-xl p-6 text-center text-sm text-muted-foreground">
            {dictionary.pages.laborMarket.labels?.noVacancies || "У компании пока нет вакансий"}
          </div>
        ) : (
          <div className="grid gap-4">
            {vacancies.map((vacancy) => (
              <Link
                key={vacancy.id}
                href={`/${lang}/labor-market?tab=vacancies`}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5"
              >
                <div className="relative space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1.5">{vacancy.title}</h3>
                    {vacancy.description && (
                      <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed">{vacancy.description}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {vacancy.location && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/40 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{vacancy.location}</span>
                      </div>
                    )}

                    {vacancy.employment_type && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/40 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                        <span>{translateEmploymentType(vacancy.employment_type, dictionary)}</span>
                      </div>
                    )}

                    {vacancy.salary_min && vacancy.salary_max && (
                      <div className="rounded-xl border border-white/30 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-md px-4 py-2 text-xs font-medium text-foreground shadow-sm">
                        {formatCurrencyRange(vacancy.salary_min, vacancy.salary_max, locale)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
