"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { usePoliticalParty } from "../model/usePoliticalParties";

type PartyDetailScreenProps = {
  locale: Locale;
  dictionary: Dictionary;
  partyId: string;
};

const getLocalImageUrl = (politicianId: string): string => {
  const idNum = parseInt(politicianId.slice(-8), 16) || 0;
  const imageNumber = (idNum % 24) + 1;
  return `/image/${imageNumber}.png`;
};

export function PartyDetailScreen({ locale, dictionary, partyId }: PartyDetailScreenProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as Locale || locale;

  const { party, members, isLoading, error } = usePoliticalParty(partyId);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl animate-pulse rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.politics.loading}
      </div>
    );
  }

  if (error || !party) {
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
      <Link href={`/${lang}/politics?tab=parties`}>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {dictionary.pages.politics.labels.back}
        </Button>
      </Link>

      {/* Заголовок и описание */}
      <div className="rounded-2xl border border-border/50 bg-muted/50 backdrop-blur-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border/50 bg-muted/40 backdrop-blur-sm flex-shrink-0">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{party.name}</h1>
            {party.description && (
              <p className="text-base text-muted-foreground leading-relaxed">
                {party.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                {party.is_active 
                  ? dictionary.pages.politics.labels.isActive 
                  : dictionary.pages.politics.labels.notActive}
              </span>
              {members && (
                <span>{dictionary.pages.politics.labels.membersCount}: {members.length}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Список членов партии */}
      {members && members.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Users className="h-6 w-6" />
            {dictionary.pages.politics.labels.partyMembers}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member: any) => {
              const politician = member.politician;
              if (!politician) return null;

              return (
                <Link
                  key={member.uuid}
                  href={`/${lang}/politics/persons/${politician.uuid}`}
                  className="block rounded-xl border border-border/50 bg-muted/50 backdrop-blur-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    {politician.avatar_path || true ? (
                      <img
                        src={politician.avatar_path || getLocalImageUrl(politician.uuid)}
                        alt={politician.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-border/50 flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = getLocalImageUrl(politician.uuid);
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full border-2 border-border/50 bg-muted/30 flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground mb-1 line-clamp-1">
                        {politician.name}
                      </p>
                      {member.position && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {member.position.name}
                        </p>
                      )}
                      {member.is_active !== null && (
                        <p className="text-xs text-muted-foreground">
                          {member.is_active 
                            ? dictionary.pages.politics.labels.isActive 
                            : "Неактивен"}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border/50 bg-muted/50 p-6 text-center text-sm text-muted-foreground">
          {dictionary.pages.politics.emptyState.noPoliticians}
        </div>
      )}
    </div>
  );
}

