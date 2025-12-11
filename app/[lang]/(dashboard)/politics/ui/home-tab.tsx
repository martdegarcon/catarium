"use client";

import Link from "next/link";
import { usePoliticians } from "../model/usePoliticians";
import { usePoliticalParties } from "../model/usePoliticalParties";
import { usePoliticsStatistics } from "../model/usePoliticsStatistics";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { PoliticianCard } from "@/components/features/politics/politician-card";
import { HomeTabSkeleton } from "@/components/features/politics/politics-skeleton";
import { 
  Users, 
  Building2, 
  TrendingUp, 
  ArrowRight, 
  User, 
  Shield,
  Briefcase,
  PieChart
} from "lucide-react";

type HomeTabProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const getLocalImageUrl = (politicianId: string): string => {
  const idNum = parseInt(politicianId.slice(-8), 16) || 0;
  const imageNumber = (idNum % 24) + 1;
  return `/image/${imageNumber}.png`;
};

/**
 * Render the home/dashboard tab showing political statistics, active parties, and top politicians.
 *
 * Renders a skeleton placeholder while underlying data (politicians, parties, statistics) is loading.
 *
 * @param locale - Locale code used to build localized routes and links
 * @param dictionary - Localized text strings used for headings, labels, and link text
 * @returns The JSX element for the politics Home tab layout
 */
export function HomeTab({ locale, dictionary }: HomeTabProps) {
  const { politicians, isLoading: politiciansLoading } = usePoliticians();
  const { parties, isLoading: partiesLoading } = usePoliticalParties();
  const { statistics, isLoading: statsLoading } = usePoliticsStatistics();

  const isLoading = politiciansLoading || partiesLoading || statsLoading;

  // Берем элементы для bento layout
  const topPoliticians = politicians.slice(0, 3);
  const topParties = statistics?.partyCounts.slice(0, 4) || [];

  if (isLoading) {
    return <HomeTabSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-4">
        {/* Общая статистика - занимает 2x2 */}
        <div className="col-span-1 md:col-span-2 row-span-2 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">
                  {dictionary.pages.politics.sections.statistics}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-4xl font-bold text-foreground">
                    {statistics?.totalPoliticians || 0}
                  </p>
                  <p className="text-sm text-muted-foreground/90">
                    {dictionary.pages.politics.stats.totalPoliticians}
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground">
                    {statistics?.activeParties || 0}
                  </p>
                  <p className="text-sm text-muted-foreground/90">
                    {dictionary.pages.politics.stats.activeParties}
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground">
                    {statistics?.totalMinistries || 0}
                  </p>
                  <p className="text-sm text-muted-foreground/90">
                    {dictionary.pages.politics.stats.totalMinistries}
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-foreground">
                    {statistics?.governmentMembers || 0}
                  </p>
                  <p className="text-sm text-muted-foreground/90">
                    {dictionary.pages.politics.stats.governmentMembers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика партий - занимает 1x2 */}
        <div className="col-span-1 row-span-2 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5 overflow-y-auto">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">
              {dictionary.pages.politics.sections.activeParties}
            </span>
          </div>
          <div className="space-y-3">
            {topParties.map((party) => (
              <div
                key={party.uuid}
                className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3"
              >
                <p className="text-sm font-semibold text-foreground mb-1">
                  {party.name}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-foreground">
                    {party.count}
                  </p>
                  <span className="text-xs text-muted-foreground">{dictionary.pages.politics.stats.members}</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href={`/${locale}/politics?tab=parties`}
            className="mt-4 flex items-center gap-1 text-sm font-medium text-muted-foreground"
          >
            {dictionary.pages.politics.stats.viewAllParties} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Топ политиков - занимает 1x1 */}
        <div className="col-span-1 row-span-1 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
          <div className="flex h-full flex-col justify-between">
            <Users className="mb-2 h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-3xl font-bold text-foreground">
                {statistics?.totalPoliticians || 0}
              </p>
              <p className="text-sm text-muted-foreground/90">
                {dictionary.pages.politics.sections.topPoliticians}
              </p>
            </div>
            <Link
              href={`/${locale}/politics?tab=persons`}
              className="mt-2 flex items-center gap-1 text-sm font-medium text-muted-foreground"
            >
              {dictionary.pages.politics.stats.viewAll} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Статистика по полу - занимает 1x1 */}
        <div className="col-span-1 row-span-1 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
          <div className="flex h-full flex-col justify-between">
            <User className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="space-y-2">
              {statistics?.genderCounts.map((gender) => (
                <div key={gender.name} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{gender.name}</span>
                  <span className="text-lg font-bold text-foreground">{gender.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Министерства - занимает 1x1 */}
        <div className="col-span-1 row-span-1 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
          <div className="flex h-full flex-col justify-between">
            <Briefcase className="mb-2 h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-3xl font-bold text-foreground">
                {statistics?.totalMinistries || 0}
              </p>
              <p className="text-sm text-muted-foreground/90">
                {dictionary.pages.politics.stats.totalMinistries}
              </p>
            </div>
            <Link
              href={`/${locale}/politics?tab=political-structure`}
              className="mt-2 flex items-center gap-1 text-sm font-medium text-muted-foreground"
            >
              {dictionary.pages.politics.stats.moreDetails} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Правительство - занимает 1x1 */}
        <div className="col-span-1 row-span-1 rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
          <div className="flex h-full flex-col justify-between">
            <Shield className="mb-2 h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-3xl font-bold text-foreground">
                {statistics?.governmentMembers || 0}
              </p>
              <p className="text-sm text-muted-foreground/90">
                {dictionary.pages.politics.stats.governmentMembers}
              </p>
            </div>
            <Link
              href={`/${locale}/politics?tab=political-structure`}
              className="mt-2 flex items-center gap-1 text-sm font-medium text-muted-foreground"
            >
              {dictionary.pages.politics.stats.moreDetails} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Топ политики */}
      {topPoliticians.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              {dictionary.pages.politics.sections.topPoliticians}
            </h2>
            <Link
              href={`/${locale}/politics?tab=persons`}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground"
            >
              {dictionary.pages.politics.stats.viewAllPoliticians} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topPoliticians.map((politician) => (
              <PoliticianCard
                key={politician.uuid}
                politician={politician}
                locale={locale}
                dictionary={dictionary}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
