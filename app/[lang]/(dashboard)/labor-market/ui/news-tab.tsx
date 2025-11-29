"use client";

import Link from "next/link";
import { useLaborMarketNews } from "../model/useLaborMarketNews";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { Image as ImageIcon } from "lucide-react";

type NewsTabProps = {
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

export function NewsTab({ locale, dictionary }: NewsTabProps) {
  const { news, isLoading, error } = useLaborMarketNews(locale);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl animate-pulse rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.laborMarket.loading}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
        {dictionary.pages.laborMarket.error}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl rounded-lg border p-6 text-center text-sm text-muted-foreground">
        {dictionary.pages.laborMarket.emptyState.noNews}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <Link
          key={item.id}
          href={`/${locale}/labor-market/news/${item.id}`}
          className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={getLocalImageUrl(item.id)}
              alt={item.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = "flex";
              }}
            />
            <div className="absolute inset-0 hidden items-center justify-center bg-muted">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            {item.category && (
              <div className="absolute top-3 left-3">
                <span 
                  className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
                  style={{ backgroundColor: '#1F299C' }}
                >
                  {item.category}
                </span>
              </div>
            )}
          </div>
          <div className="p-5 space-y-3">
            <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-foreground">
              {item.title}
            </h3>
            <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
              {item.content}
            </p>
            <div className="flex items-center justify-between gap-4 pt-2 border-t text-xs text-muted-foreground">
              <span>
                {new Date(item.published_at).toLocaleDateString(localeMap[locale], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {item.reading_time && <span>{item.reading_time}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
