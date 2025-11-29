"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, MapPin, Users, GraduationCap, Shield, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { usePolitician } from "../model/usePoliticians";
import { formatChildren } from "@/lib/utils/format-children";

type PoliticianDetailScreenProps = {
  locale: Locale;
  dictionary: Dictionary;
  politicianId: string;
};

const getLocalImageUrl = (politicianId: string): string => {
  const idNum = parseInt(politicianId.slice(-8), 16) || 0;
  const imageNumber = (idNum % 24) + 1;
  return `/image/${imageNumber}.png`;
};

const formatDate = (dateString: string | null | undefined, locale: Locale): string => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const localeMap: Record<Locale, string> = {
    ru: "ru-RU",
    en: "en-US",
    zh: "zh-CN",
  };
  
  return date.toLocaleDateString(localeMap[locale], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export function PoliticianDetailScreen({ locale, dictionary, politicianId }: PoliticianDetailScreenProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as Locale || locale;

  const { politician, isLoading, error } = usePolitician(politicianId);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl animate-pulse rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.politics.loading}
      </div>
    );
  }

  if (error || !politician) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {dictionary.pages.politics.labels.back}
        </Button>
        <div className="rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
          {dictionary.pages.politics.error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Кнопка "Назад" */}
      <Link href={`/${lang}/politics?tab=persons`}>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {dictionary.pages.politics.labels.back}
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Левая колонка - Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Заголовок и фото */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {politician.avatar_path ? (
                <img
                  src={politician.avatar_path}
                  alt={politician.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-border/50"
                  onError={(e) => {
                    e.currentTarget.src = getLocalImageUrl(politician.uuid);
                  }}
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-border/50 bg-muted/30 flex items-center justify-center">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{politician.name}</h1>
              {politician.gender && (
                <p className="text-lg text-muted-foreground">
                  {dictionary.pages.politics.labels.gender}: {politician.gender.name}
                </p>
              )}
            </div>
          </div>

          {/* Основная информация */}
          <div className="rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Основная информация</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {politician.birthday && (
                <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {dictionary.pages.politics.labels.birthday}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {formatDate(politician.birthday, locale)}
                  </p>
                </div>
              )}

              {politician.province && (
                <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {dictionary.pages.politics.labels.province}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {politician.province.name}
                  </p>
                </div>
              )}

              {politician.is_married !== null && (
                <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {dictionary.pages.politics.labels.isMarried}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {politician.is_married 
                      ? dictionary.pages.politics.labels.marriedStatus 
                      : dictionary.pages.politics.labels.notMarriedStatus}
                  </p>
                </div>
              )}

              {politician.children !== null && (
                <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {dictionary.pages.politics.labels.children}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {locale === "ru" 
                      ? formatChildren(politician.children, locale)
                      : politician.children
                    }
                  </p>
                </div>
              )}

              {politician.military_service !== null && (
                <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {dictionary.pages.politics.labels.militaryService}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {politician.military_service 
                      ? dictionary.pages.politics.labels.militaryServiceYes 
                      : dictionary.pages.politics.labels.militaryServiceNo}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Образование */}
          {politician.education && politician.education.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 space-y-4">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                {dictionary.pages.politics.labels.education}
              </h2>
              <div className="space-y-3">
                {politician.education.map((edu, index) => (
                  <div
                    key={edu.uuid}
                    className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4"
                  >
                    {edu.education_level && (
                      <p className="font-semibold text-foreground mb-1">
                        {edu.education_level}
                      </p>
                    )}
                    {edu.university && (
                      <p className="text-muted-foreground">
                        {edu.university.name}
                        {edu.university.is_foreign && (
                          <span className="ml-2 text-xs">(зарубежное)</span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Партии */}
          {politician.parties && politician.parties.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 space-y-4">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                {dictionary.pages.politics.labels.politicalParty}
              </h2>
              <div className="space-y-3">
                {politician.parties.map((member) => (
                  <div
                    key={member.uuid}
                    className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-4"
                  >
                    {member.political_party && (
                      <p className="font-semibold text-foreground mb-1">
                        {member.political_party.name}
                      </p>
                    )}
                    {member.position && (
                      <p className="text-sm text-muted-foreground">
                        {dictionary.pages.politics.labels.position}: {member.position.name}
                      </p>
                    )}
                    {member.is_active !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {member.is_active 
                          ? dictionary.pages.politics.labels.isActive 
                          : "Неактивен"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Правая колонка - Дополнительная информация */}
        <div className="space-y-6">
          {/* Министерства */}
          {politician.ministries && politician.ministries.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6">
              <h3 className="text-lg font-semibold mb-3">
                {dictionary.pages.politics.labels.ministryMembers}
              </h3>
              <div className="space-y-2">
                {politician.ministries.map((member) => (
                  <div
                    key={member.uuid}
                    className="rounded-lg border border-border/50 bg-muted/40 p-3 text-sm"
                  >
                    {member.ministry && (
                      <p className="font-medium">{member.ministry.name}</p>
                    )}
                    {member.position && (
                      <p className="text-xs text-muted-foreground">
                        {member.position.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Правительство */}
          {politician.government && politician.government.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6">
              <h3 className="text-lg font-semibold mb-3">
                {dictionary.pages.politics.labels.governmentMembers}
              </h3>
              <div className="space-y-2">
                {politician.government.map((gov) => (
                  <div
                    key={gov.uuid}
                    className="rounded-lg border border-border/50 bg-muted/40 p-3 text-sm"
                  >
                    {gov.position && (
                      <p className="font-medium">{gov.position.name}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

