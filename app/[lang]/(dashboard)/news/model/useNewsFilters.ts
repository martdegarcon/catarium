"use client";

import { useMemo } from "react";
import type { NewsItem } from "./types";
import type { TabCategory } from "@/components/features/news/utils";
import { createCategoryMapping, getNewsCategory } from "@/components/features/news/utils";
import type { Dictionary } from "@/types/dictionary";

type UseNewsFiltersProps = {
  data: NewsItem[];
  selectedTab: TabCategory;
  totalArchive: number;
  loadedArchive: number;
  dictionary: Dictionary;
};

export function useNewsFilters({
  data,
  selectedTab,
  totalArchive,
  loadedArchive,
  dictionary,
}: UseNewsFiltersProps) {
  const categoryMapping = useMemo(
    () => createCategoryMapping(dictionary),
    [dictionary]
  );

  const getNewsCategoryMemo = useMemo(
    () => (item: NewsItem) => getNewsCategory(item, categoryMapping),
    [categoryMapping]
  );

  // Разделяем hot и archive новости
  const { allHotNews, allArchiveNews } = useMemo(() => {
    if (!data || data.length === 0) {
      return { allHotNews: null, allArchiveNews: [] };
    }
    
    const hot = data.find((item) => (item as any).is_hot === true) || null;
    const archive = data.filter((item) => !(item as any).is_hot);
    
    return {
      allHotNews: hot,
      allArchiveNews: archive,
    };
  }, [data]);

  // Фильтруем hot и archive по выбранной категории
  const { hotNews, archiveNews, hasMoreArchive } = useMemo(() => {
    const hot =
      allHotNews &&
      (selectedTab === "all" || getNewsCategoryMemo(allHotNews) === selectedTab)
        ? [allHotNews]
        : [];

    const archive =
      selectedTab === "all"
        ? allArchiveNews
        : allArchiveNews.filter((item) => getNewsCategoryMemo(item) === selectedTab);

    const sortedArchive = [...archive].sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );

    const hasMore = selectedTab === "all" ? loadedArchive < totalArchive : false;

    return {
      hotNews: hot,
      archiveNews: sortedArchive,
      hasMoreArchive: hasMore,
    };
  }, [
    allHotNews,
    allArchiveNews,
    selectedTab,
    getNewsCategoryMemo,
    loadedArchive,
    totalArchive,
  ]);

  return {
    hotNews,
    archiveNews,
    hasMoreArchive,
  };
}

