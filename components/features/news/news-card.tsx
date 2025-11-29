"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import type { NewsItem } from "@/app/[lang]/(dashboard)/news/model/types";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Dictionary } from "@/types/dictionary";
import { getLocalImageUrl, localeMap } from "./utils";

type NewsCardProps = {
  item: NewsItem;
  locale: Locale;
  dictionary: Dictionary;
  variant?: "hot" | "archive";
};

export function NewsCard({ item, locale, dictionary, variant = "archive" }: NewsCardProps) {
  const isHot = variant === "hot";
  
  const cardClasses = isHot
    ? "block rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/20 p-6 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
    : "block rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer";

  const imageSize = isHot ? "w-[150px] h-[150px]" : "w-[150px] h-[150px]";
  const titleSize = isHot ? "text-2xl" : "text-lg";
  const contentSize = isHot ? "text-base" : "text-sm";
  const metaSize = isHot ? "text-sm" : "text-xs";

  return (
    <Link href={`/${locale}/news/${item.id}`} className={cardClasses}>
      <div className="flex gap-4">
        {/* Картинка слева */}
        <div className="flex-shrink-0">
          <img
            src={getLocalImageUrl(item.id)}
            alt={item.title}
            className={`${imageSize} rounded-lg object-cover`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
          <div className={`${imageSize} bg-muted rounded-lg flex items-center justify-center hidden`}>
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        
        {/* Контент справа */}
        <div className="flex-1 space-y-2">
          <h2 className={`${titleSize} font-bold`}>{item.title}</h2>
          
          <p className={`${contentSize} ${isHot ? 'leading-relaxed' : 'text-muted-foreground leading-relaxed'}`}>
            {isHot ? item.content : `${item.content.slice(0, 200)}...`}
          </p>
          
          {item.category && (
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-200">
                {item.category}
              </span>
            </div>
          )}
          
          {item.author && (
            <div>
              <span className={`${metaSize} font-semibold text-muted-foreground`}>
                {dictionary.pages.news.labels?.author || "Автор"}: 
              </span>
              <span className={`${metaSize} font-medium`}> {item.author}</span>
            </div>
          )}
          
          <div className={`flex items-center gap-4 ${metaSize} text-muted-foreground`}>
            <span>
              {new Date(item.published_at).toLocaleDateString(localeMap[locale], {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {item.reading_time && (
              <span>
                {dictionary.pages.news.labels?.readingTime || "Время чтения"}: {item.reading_time}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

