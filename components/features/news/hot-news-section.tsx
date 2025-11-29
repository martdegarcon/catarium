"use client";

import type { NewsItem } from "@/app/[lang]/(dashboard)/news/model/types";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { NewsCard } from "./news-card";

type HotNewsSectionProps = {
  hotNews: NewsItem[];
  locale: Locale;
  dictionary: Dictionary;
};

export function HotNewsSection({ hotNews, locale, dictionary }: HotNewsSectionProps) {
  if (hotNews.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
          🔥 HOT
        </span>
        <h2 className="text-2xl font-bold">
          {dictionary.pages.news.labels?.hotNews || "Горячая новость"}
        </h2>
      </div>
      
      {hotNews.map((item) => (
        <NewsCard
          key={item.id}
          item={item}
          locale={locale}
          dictionary={dictionary}
          variant="hot"
        />
      ))}
    </div>
  );
}

