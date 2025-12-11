"use client";

import { useGovernment } from "../model/useGovernment";
import { useMinistries } from "../model/useMinistries";
import { usePoliticsStatistics } from "../model/usePoliticsStatistics";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { Building2, Users, Shield, ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";

type PoliticalStructureTabProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Render the political structure tab for the Politics page.
 *
 * Renders overview statistics, grouped government positions, ministries (up to six with an optional "show all" link), and an informational description; displays a localized loading placeholder while underlying data is being fetched.
 *
 * @param locale - Locale code used to construct internal links (e.g., routing segments)
 * @param dictionary - Localized strings for labels, headings, and messages used in the UI
 * @returns A JSX element that renders the political structure UI for the given locale and dictionary
 */
export function PoliticalStructureTab({ locale, dictionary }: PoliticalStructureTabProps) {
  const { government, isLoading: governmentLoading } = useGovernment();
  const { ministries, isLoading: ministriesLoading } = useMinistries();
  const { statistics, isLoading: statsLoading } = usePoliticsStatistics();

  const isLoading = governmentLoading || ministriesLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="w-full animate-pulse rounded-lg border border-border/50 bg-muted/50 p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.politics.loading}
      </div>
    );
  }

  // Группируем правительство по позициям
  const governmentByPosition = new Map<string, any[]>();
  government.forEach((member: any) => {
    if (member.position) {
      const positionName = member.position.name;
      if (!governmentByPosition.has(positionName)) {
        governmentByPosition.set(positionName, []);
      }
      governmentByPosition.get(positionName)!.push(member);
    }
  });

  return (
    <div className="space-y-8">
      {/* Общая информация */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-6 w-6 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{dictionary.pages.politics.labels.government}</h3>
          </div>
          <p className="text-3xl font-bold">{statistics?.governmentMembers || 0}</p>
          <p className="text-sm text-muted-foreground">{dictionary.pages.politics.stats.members}</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="h-6 w-6 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{dictionary.pages.politics.labels.ministries}</h3>
          </div>
          <p className="text-3xl font-bold">{statistics?.totalMinistries || 0}</p>
          <p className="text-sm text-muted-foreground">{dictionary.pages.politics.stats.totalMinistries}</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-6 w-6 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{dictionary.pages.politics.labels.parties}</h3>
          </div>
          <p className="text-3xl font-bold">{statistics?.activeParties || 0}</p>
          <p className="text-sm text-muted-foreground">{dictionary.pages.politics.stats.activeParties}</p>
        </div>
      </div>

      {/* Схема власти */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{dictionary.pages.politics.labels.politicalStructure}</h2>

        {/* Правительство */}
        {government.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {dictionary.pages.politics.labels.government}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from(governmentByPosition.entries()).map(([positionName, members]) => (
                <div
                  key={positionName}
                  className="rounded-xl border border-border/50 bg-muted/50 backdrop-blur-xl p-4"
                >
                  <h4 className="font-semibold mb-3 text-foreground">{positionName}</h4>
                  <div className="space-y-2">
                    {members.map((member: any) => (
                      <Link
                        key={member.uuid}
                        href={`/${locale}/politics/persons/${member.politician_uuid}`}
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {member.politician?.name || "Неизвестно"}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Министерства */}
        {ministries.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {dictionary.pages.politics.labels.ministries}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ministries.slice(0, 6).map((ministry: any) => (
                <Link
                  key={ministry.uuid}
                  href={`/${locale}/politics/ministries/${ministry.uuid}`}
                  className="block rounded-xl border border-border/50 bg-muted/50 backdrop-blur-xl p-4 hover:bg-muted/60 transition-colors"
                >
                  <h4 className="font-semibold mb-2 text-foreground">{ministry.name}</h4>
                  {ministry.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ministry.description}
                    </p>
                  )}
                  {ministry.numbers !== null && ministry.numbers !== undefined && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {dictionary.pages.politics.labels.membersCount}: {ministry.numbers}
                    </p>
                  )}
                </Link>
              ))}
            </div>
            {ministries.length > 6 && (
              <div className="text-center">
                <Link
                  href={`/${locale}/politics?tab=ministries`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {dictionary.pages.politics.labels.showAllMinistries} ({ministries.length})
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Информационное сообщение */}
        <div className="rounded-lg border border-border/50 bg-muted/50 backdrop-blur-xl p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Политическое устройство представляет собой систему государственного управления, 
            включающую правительство, министерства и политические партии. 
            Правительство формирует общую политику, министерства отвечают за конкретные 
            направления деятельности, а партии представляют различные политические взгляды.
          </p>
        </div>
      </div>
    </div>
  );
}
