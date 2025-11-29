"use client";

import { Button } from "@/components/ui/button";
import type { NewsItem } from "@/app/[lang]/(dashboard)/news/model/types";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { NewsCard } from "./news-card";

type ArchiveNewsListProps = {
  archiveNews: NewsItem[];
  locale: Locale;
  dictionary: Dictionary;
  hasMoreArchive?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
};

export function ArchiveNewsList({
  archiveNews,
  locale,
  dictionary,
  hasMoreArchive = false,
  isLoadingMore = false,
  onLoadMore,
}: ArchiveNewsListProps) {
  if (archiveNews.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {dictionary.pages.news.labels?.archiveNews || "Архив новостей"}
      </h2>
      
      <div className="grid gap-4">
        {archiveNews.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            locale={locale}
            dictionary={dictionary}
            variant="archive"
          />
        ))}
      </div>
      
      {hasMoreArchive && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="min-w-[200px]"
          >
            {isLoadingMore
              ? dictionary.pages.news.loading || "Загрузка..."
              : dictionary.pages.news.labels?.showMore || "Показать еще"
            }
          </Button>
        </div>
      )}
    </div>
  );
}

