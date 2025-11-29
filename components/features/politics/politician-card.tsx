"use client";

import Link from "next/link";
import type { Politician } from "@/app/[lang]/(dashboard)/politics/model/types";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { User, Calendar, MapPin } from "lucide-react";
import { formatChildren } from "@/lib/utils/format-children";

type PoliticianCardProps = {
  politician: Politician;
  locale: Locale;
  dictionary: Dictionary;
};

const getLocalImageUrl = (politicianId: string): string => {
  const idNum = parseInt(politicianId.slice(-8), 16) || 0;
  const imageNumber = (idNum % 24) + 1;
  return `/image/${imageNumber}.png`;
};

export function PoliticianCard({ politician, locale, dictionary }: PoliticianCardProps) {
  return (
    <Link
      href={`/${locale}/politics/persons/${politician.uuid}`}
      className="block rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5"
    >
      <div className="space-y-4">
        {/* Аватар и имя */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {politician.avatar_path ? (
              <img
                src={politician.avatar_path}
                alt={politician.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-border/50"
                onError={(e) => {
                  e.currentTarget.src = getLocalImageUrl(politician.uuid);
                }}
              />
            ) : (
              <div className="h-16 w-16 rounded-full border-2 border-border/50 bg-muted/30 flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold leading-tight text-foreground mb-1">
              {politician.name}
            </h3>
            {politician.gender && (
              <p className="text-sm text-muted-foreground">
                {politician.gender.name}
              </p>
            )}
          </div>
        </div>

        {/* Информация */}
        <div className="grid grid-cols-2 gap-3">
          {politician.province && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {dictionary.pages.politics.labels.province}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground line-clamp-1">
                {politician.province.name}
              </p>
            </div>
          )}

          {politician.birthday && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {dictionary.pages.politics.labels.birthday}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {new Date(politician.birthday).toLocaleDateString(locale === "ru" ? "ru-RU" : locale === "en" ? "en-US" : "zh-CN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {politician.is_married !== null && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3">
              <span className="text-xs font-medium text-muted-foreground mb-1 block">
                {dictionary.pages.politics.labels.isMarried}
              </span>
              <p className="text-sm font-semibold text-foreground">
                {politician.is_married 
                  ? dictionary.pages.politics.labels.marriedStatus 
                  : dictionary.pages.politics.labels.notMarriedStatus}
              </p>
            </div>
          )}

          {politician.children !== null && politician.children > 0 && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3">
              <span className="text-xs font-medium text-muted-foreground mb-1 block">
                {dictionary.pages.politics.labels.children}
              </span>
              <p className="text-sm font-semibold text-foreground">
                {locale === "ru" 
                  ? formatChildren(politician.children, locale)
                  : politician.children
                }
              </p>
            </div>
          )}
        </div>

        {/* Партии */}
        {politician.parties && politician.parties.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {dictionary.pages.politics.labels.politicalParty}:
            </p>
            <div className="flex flex-wrap gap-1">
              {politician.parties.slice(0, 2).map((member) => (
                member.political_party && (
                  <span
                    key={member.uuid}
                    className="inline-flex items-center rounded-md bg-muted/40 px-2 py-1 text-xs font-medium text-foreground"
                  >
                    {member.political_party.name}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

