"use client";

import Link from "next/link";
import type { Politician } from "@/app/[lang]/(dashboard)/politics/model/types";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { User, Calendar, MapPin, Building2 } from "lucide-react";
import { formatChildren } from "@/lib/utils/format-children";

type PoliticianCardCompactProps = {
  politician: Politician;
  locale: Locale;
  dictionary: Dictionary;
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
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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

export function PoliticianCardCompact({ politician, locale, dictionary }: PoliticianCardCompactProps) {
  const age = calculateAge(politician.birthday);

  return (
    <Link
      href={`/${locale}/politics/persons/${politician.uuid}`}
      className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/50 backdrop-blur-xl p-4 hover:bg-muted/60 transition-colors"
    >
      {/* Аватар */}
      <div className="flex-shrink-0">
        {politician.avatar_path ? (
          <img
            src={politician.avatar_path}
            alt={politician.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-border/50"
            onError={(e) => {
              e.currentTarget.src = getLocalImageUrl(politician.uuid);
            }}
          />
        ) : (
          <div className="h-12 w-12 rounded-full border-2 border-border/50 bg-muted/30 flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Информация в одну строку */}
      <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
        {/* Имя */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3">
          <p className="font-semibold text-foreground truncate">{politician.name}</p>
          {politician.gender && (
            <p className="text-xs text-muted-foreground">{politician.gender.name}</p>
          )}
        </div>

        {/* Дата рождения и возраст */}
        <div className="col-span-6 md:col-span-2 lg:col-span-2">
          {politician.birthday && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {formatDate(politician.birthday, locale)}
                {age !== null && ` (${age})`}
              </span>
            </div>
          )}
        </div>

        {/* Регион */}
        <div className="col-span-6 md:col-span-2 lg:col-span-2">
          {politician.province && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {politician.province.name}
              </span>
            </div>
          )}
        </div>

        {/* Партия */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3">
          {politician.parties && politician.parties.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {politician.parties.slice(0, 2).map((member) =>
                  member.political_party && (
                    <span
                      key={member.uuid}
                      className="inline-flex items-center rounded-md bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                      {member.political_party.name}
                    </span>
                  )
                )}
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>

        {/* Семейное положение */}
        <div className="col-span-6 md:col-span-1 lg:col-span-1">
          {politician.is_married !== null && (
            <span className="text-xs text-muted-foreground">
              {politician.is_married 
                ? dictionary.pages.politics.labels.marriedStatus 
                : dictionary.pages.politics.labels.notMarriedStatus}
            </span>
          )}
        </div>

        {/* Дети */}
        <div className="col-span-6 md:col-span-1 lg:col-span-1">
          {politician.children !== null && politician.children > 0 && (
            <span className="text-xs text-muted-foreground">
              {locale === "ru" 
                ? formatChildren(politician.children, locale)
                : `${politician.children} ${dictionary.pages.politics.labels.children}`
              }
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

