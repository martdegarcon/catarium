"use client";

import { useCompanies } from "../model/useCompanies";
import { useVacancies } from "../model/useVacancies";
import { useLaborMarketNews } from "../model/useLaborMarketNews";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { CompanyCard } from "@/components/features/labor-market/company-card";
import { VacancyCard } from "@/components/features/labor-market/vacancy-card";
import { formatCurrencyRange } from "@/components/features/labor-market/currency-utils";
import Link from "next/link";
import { ArrowRight, TrendingUp, Building2, Briefcase } from "lucide-react";

type HomeTabProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const localeMap: Record<Locale, string> = {
  ru: "ru-RU",
  en: "en-US",
  zh: "zh-CN",
};

const getLocalImageUrl = (newsId: string): string => {
  const idNum = parseInt(newsId.slice(-8), 16) || 0;
  const imageNumber = (idNum % 24) + 1;
  return `/image/${imageNumber}.png`;
};

export function HomeTab({ locale, dictionary }: HomeTabProps) {
  const { companies, isLoading: companiesLoading } = useCompanies(locale);
  const { vacancies, isLoading: vacanciesLoading } = useVacancies(locale);
  const { news, isLoading: newsLoading } = useLaborMarketNews(locale);

  const isLoading = companiesLoading || vacanciesLoading || newsLoading;

  // Берем элементы для bento layout
  const featuredNews = news.slice(0, 1); // Большая новость
  const otherNews = news.slice(1, 3); // Маленькие новости
  const topCompanies = companies.slice(0, 4);
  const featuredVacancies = vacancies.slice(0, 3);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl animate-pulse rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.laborMarket.loading}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3">
        {/* Большая новость - занимает 2x2 */}
        {featuredNews.length > 0 && (
          <Link
            href={`/${locale}/labor-market/news/${featuredNews[0].id}`}
            className="relative col-span-1 md:col-span-2 row-span-2 overflow-hidden rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5"
          >
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">
                    {dictionary.pages.laborMarket.sections.latestNews}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-bold leading-tight text-foreground">
                  {featuredNews[0].title}
                </h3>
                <p className="line-clamp-3 text-sm text-muted-foreground/90">
                  {featuredNews[0].content}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground/80">
                  {new Date(featuredNews[0].published_at).toLocaleDateString(localeMap[locale], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </Link>
        )}

        {/* Статистика компаний - занимает 1x1 */}
        <div className="col-span-1 row-span-1 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
          <div className="relative flex h-full flex-col justify-between">
            <Building2 className="mb-2 h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-3xl font-bold text-foreground">{companies.length}</p>
              <p className="text-sm text-muted-foreground/90">
                {dictionary.pages.laborMarket.sections.topCompanies}
              </p>
            </div>
            <Link
              href={`/${locale}/labor-market?tab=companies`}
              className="mt-2 flex items-center gap-1 text-sm font-medium text-muted-foreground"
            >
              Смотреть все <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Статистика вакансий - занимает 1x1 */}
        <div className="col-span-1 row-span-1 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
          <div className="relative flex h-full flex-col justify-between">
            <Briefcase className="mb-2 h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-3xl font-bold text-foreground">{vacancies.length}</p>
              <p className="text-sm text-muted-foreground/90">
                {dictionary.pages.laborMarket.sections.recentVacancies}
              </p>
            </div>
            <Link
              href={`/${locale}/labor-market?tab=vacancies`}
              className="mt-2 flex items-center gap-1 text-sm font-medium text-muted-foreground"
            >
              Смотреть все <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Две маленькие новости - занимают 1x1 каждая */}
        {otherNews.map((item, idx) => (
          <Link
            key={item.id}
            href={`/${locale}/labor-market/news/${item.id}`}
            className="relative col-span-1 row-span-1 overflow-hidden rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-4 shadow-lg shadow-black/5"
          >
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <h4 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight text-foreground">
                  {item.title}
                </h4>
                <p className="line-clamp-2 text-xs text-muted-foreground/90">
                  {item.content}
                </p>
              </div>
              <span className="mt-2 text-xs text-muted-foreground/80">
                {new Date(item.published_at).toLocaleDateString(localeMap[locale], {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </Link>
        ))}

        {/* Топ компании - занимает 2x1 */}
        <div className="col-span-2 row-span-1 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">{dictionary.pages.laborMarket.sections.topCompanies}</h3>
            <Link
              href={`/${locale}/labor-market?tab=companies`}
              className="flex items-center gap-1 text-sm text-muted-foreground"
            >
              Все <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {topCompanies.slice(0, 4).map((company) => (
              <div
                key={company.id}
                className="rounded-lg border border-border/50 bg-muted/40 backdrop-blur-md p-3"
              >
                <p className="text-sm font-semibold line-clamp-1 text-foreground">{company.name}</p>
                {company.employee_count && (
                  <p className="mt-1 text-xs text-muted-foreground/90">
                    {new Intl.NumberFormat("ru-RU").format(company.employee_count)} сотрудников
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Актуальные вакансии - занимает 2x1 */}
        <div className="col-span-2 row-span-1 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">{dictionary.pages.laborMarket.sections.recentVacancies}</h3>
            <Link
              href={`/${locale}/labor-market?tab=vacancies`}
              className="flex items-center gap-1 text-sm text-muted-foreground"
            >
              Все <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {featuredVacancies.slice(0, 3).map((vacancy) => (
              <div
                key={vacancy.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 backdrop-blur-md p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold line-clamp-1 text-foreground">{vacancy.title}</p>
                  {vacancy.company && (
                    <p className="text-xs text-muted-foreground/90">{vacancy.company.name}</p>
                  )}
                </div>
                {vacancy.salary_min && vacancy.salary_max && (
                  <div className="ml-4 rounded-lg border border-border/50 bg-muted/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground whitespace-nowrap">
                    {formatCurrencyRange(vacancy.salary_min, vacancy.salary_max, locale)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
