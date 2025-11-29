"use client";

import Link from "next/link";
import type { PoliticalParty } from "@/app/[lang]/(dashboard)/politics/model/types";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { Building2, Users } from "lucide-react";

type PartyCardProps = {
  party: PoliticalParty;
  locale: Locale;
  dictionary: Dictionary;
  memberCount?: number;
};

export function PartyCard({ party, locale, dictionary, memberCount }: PartyCardProps) {
  return (
    <Link
      href={`/${locale}/politics/parties/${party.uuid}`}
      className="block rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6 shadow-lg shadow-black/5"
    >
      <div className="space-y-4">
        {/* Заголовок */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-muted/40 backdrop-blur-sm flex-shrink-0">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold leading-tight text-foreground mb-1">
              {party.name}
            </h3>
            {party.description && (
              <p className="text-sm text-muted-foreground/90 line-clamp-2">
                {party.description}
              </p>
            )}
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-3">
          {memberCount !== undefined && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {dictionary.pages.politics.labels.membersCount}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {memberCount}
              </p>
            </div>
          )}

          {party.is_active !== null && party.is_active !== undefined && (
            <div className="rounded-xl border border-border/50 bg-muted/40 backdrop-blur-md p-3">
              <span className="text-xs font-medium text-muted-foreground mb-1 block">
                Статус
              </span>
              <p className="text-sm font-semibold text-foreground">
                {party.is_active ? dictionary.pages.politics.labels.isActive : "Неактивна"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

