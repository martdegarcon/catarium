"use client";

import { useState } from "react";
import { useNews } from "../model/useNews";
import { useNewsFilters } from "../model/useNewsFilters";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { NewsNavbar } from "@/components/features/news/navbar";
import { NewsTabs } from "@/components/features/news/news-tabs";
import { HotNewsSection } from "@/components/features/news/hot-news-section";
import { ArchiveNewsList } from "@/components/features/news/archive-news-list";
import { NewsScreenSkeleton } from "@/components/features/news/news-skeleton";
import type { TabCategory } from "@/components/features/news/utils";

type NewsScreenProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const TABS: TabCategory[] = ["all", "politics", "economy", "society", "technology", "culture"];

export function NewsScreen({ locale, dictionary }: NewsScreenProps) {
  const { data: newsResponse, isLoading, error, loadMoreArchive } = useNews(locale);
  const [selectedTab, setSelectedTab] = useState<TabCategory>("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const data = newsResponse?.news || [];
  const totalArchive = newsResponse?.totalArchive || 0;
  const loadedArchive = newsResponse?.loadedArchive || 0;

  const { hotNews, archiveNews, hasMoreArchive } = useNewsFilters({
    data,
    selectedTab,
    totalArchive,
    loadedArchive,
    dictionary,
  });

  const handleLoadMore = async () => {
    if (!loadMoreArchive || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await loadMoreArchive(loadedArchive);
    } catch (error) {
      console.error("Failed to load more archive news:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Состояния загрузки и ошибок
  if (isLoading) {
    return (
      <>
        <NewsNavbar locale={locale} />
        <NewsScreenSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NewsNavbar locale={locale} />
        <div className="w-full rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
          {dictionary.pages.news.error}
        </div>
      </>
    );
  }

  if (!data || data.length === 0) {
    return (
      <>
        <NewsNavbar locale={locale} />
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">{dictionary.pages.news.title}</h1>
          <div className="w-full rounded-lg border p-6 text-center text-sm text-muted-foreground">
            {dictionary.pages.news.emptyState?.noNews || "Новостей пока нет"}
          </div>
        </div>
      </>
    );
  }

  // Проверяем, есть ли новости после фильтрации
  if (hotNews.length === 0 && archiveNews.length === 0 && !isLoading) {
    return (
      <>
        <NewsNavbar locale={locale} />
        <div className="space-y-8">
          <h1 className="text-3xl font-bold">{dictionary.pages.news.title}</h1>
          <NewsTabs
            tabs={TABS}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            dictionary={dictionary}
          />
          <div className="w-full rounded-lg border p-6 text-center text-sm text-muted-foreground">
            {dictionary.pages.news.emptyState?.noNewsInCategory ||
              "Новостей в этой категории пока нет"}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NewsNavbar locale={locale} />
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">{dictionary.pages.news.title}</h1>

        <NewsTabs
          tabs={TABS}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          dictionary={dictionary}
        />

        {/* Hot новости */}
        <HotNewsSection hotNews={hotNews} locale={locale} dictionary={dictionary} />

        {/* Архивные новости */}
        <ArchiveNewsList
          archiveNews={archiveNews}
          locale={locale}
          dictionary={dictionary}
          hasMoreArchive={hasMoreArchive}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </>
  );
}
