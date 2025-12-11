"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsNavbar } from "@/components/features/news/navbar";
import { NewsDetailSkeleton } from "@/components/features/news/news-detail-skeleton";
import type { Locale } from "../../../dictionaries";
import type { Dictionary } from "@/types/dictionary";
import type { NewsItem } from "../model/types";

type NewsDetailScreenProps = {
  locale: Locale;
  dictionary: Dictionary;
  newsId: number;
};

async function fetchNewsDetail(newsId: number, locale: Locale): Promise<NewsItem> {
  const res = await fetch(`/api/news/${newsId}?locale=${locale}`);
  if (!res.ok) {
    throw new Error("Ошибка при загрузке новости");
  }
  return res.json();
}

export function NewsDetailScreen({ locale, dictionary, newsId }: NewsDetailScreenProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as Locale || locale;

  const { data: news, isLoading, error } = useQuery<NewsItem, Error>({
    queryKey: ["news", "detail", newsId, locale],
    queryFn: () => fetchNewsDetail(newsId, locale),
    staleTime: 5 * 60 * 1000, // Кэшируем на 5 минут
  });

  // Функция для получения пути к локальному изображению
  const getLocalImageUrl = (newsId: number): string => {
    const imageNumber = ((newsId - 1) % 24) + 1;
    return `/image/${imageNumber}.png`;
  };

  const localeMap: Record<Locale, string> = {
    ru: "ru-RU",
    en: "en-US",
    zh: "zh-CN",
  };

  if (isLoading) {
    return (
      <>
        <NewsNavbar locale={locale} />
        <NewsDetailSkeleton />
      </>
    );
  }

  if (error || !news) {
    return (
      <>
        <NewsNavbar locale={locale} />
        <div className="w-full space-y-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {dictionary.pages.news.labels?.back || "Назад"}
          </Button>
          <div className="rounded-lg border border-destructive p-6 text-center text-sm text-destructive">
            {dictionary.pages.news.error || "Ошибка при загрузке новости"}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NewsNavbar locale={locale} />
      <div className="w-full space-y-6">
      {/* Кнопка "Назад" */}
      <Link href={`/${lang}/news`}>
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {dictionary.pages.news.labels?.back || "Назад к новостям"}
        </Button>
      </Link>

      {/* Заголовок */}
      <h1 className="text-4xl font-bold">{news.title}</h1>

      {/* Метаинформация */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-4">
        {news.category && (
          <span className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-200">
            {news.category}
          </span>
        )}
        <span>
          {new Date(news.published_at).toLocaleDateString(localeMap[locale], {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        {news.author && (
          <span>
            {dictionary.pages.news.labels?.author || "Автор"}: {news.author}
          </span>
        )}
        {news.reading_time && (
          <span>
            {dictionary.pages.news.labels?.readingTime || "Время чтения"}: {news.reading_time}
          </span>
        )}
      </div>

      {/* Изображение */}
      <div className="w-full">
        <img
          src={getLocalImageUrl(news.id)}
          alt={news.title}
          className="w-full h-auto max-h-[500px] rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
        <div className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center hidden">
          <ImageIcon className="w-16 h-16 text-muted-foreground" />
        </div>
      </div>

      {/* Контент */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-base leading-relaxed whitespace-pre-wrap">{news.content}</p>
      </div>

      {/* Теги (если есть) */}
      {news.tags && news.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      </div>
    </>
  );
}

