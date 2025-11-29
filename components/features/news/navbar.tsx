"use client";

import Link from "next/link";
import { useDictionary } from "@/hooks/use-dictionary";
import type { Locale } from "@/app/[lang]/dictionaries";

type TopBarItem = {
  icon?: string;
  text: string;
  change?: number;
};

export function NewsNavbar({ locale }: { locale: Locale }) {
  const { dictionary } = useDictionary();

  // Форматируем текущую дату
  const formatDate = () => {
    const now = new Date();
    const days = dictionary.newsNavbar?.days || ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const dayName = days[now.getDay()];
    
    const dateStr = now.toLocaleDateString(locale === "ru" ? "ru-RU" : locale === "zh" ? "zh-CN" : "en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    
    return `${dayName}, ${dateStr}`;
  };

  // Данные для топ-бара
  const topBarItems: TopBarItem[] = [
    {
      icon: "/icons/SVG.svg",
      text: formatDate(),
    },
    {
      icon: "/icons/dollar.svg",
      text: dictionary.newsNavbar?.currency?.usd || "USD: 75.34 ₽",
      change: -0.42,
    },
    {
      icon: "/icons/euro.svg",
      text: dictionary.newsNavbar?.currency?.eur || "EUR: 82.16 ₽",
      change: -0.18,
    },
    {
      icon: "/icons/rmb.svg",
      text: dictionary.newsNavbar?.currency?.cny || "CNY: 10.45 ₽",
      change: 0.05,
    },
    {
      icon: "/icons/Sun.svg",
      text: dictionary.newsNavbar?.weather || "Москва: +22°C, облачно",
    },
  ];

  return (
    <header className="mb-[50px] mx-auto">
      {/* Topbar */}
      <div className="flex justify-center items-center" id="topbar">
        <div className="flex flex-row space-x-6 w-full py-2.5 justify-center items-center bg-black">
          {topBarItems.map((it, i) => (
            <div
              key={i}
              className="flex items-center text-sm dark:text-neutral-300"
            >
              {it.icon && <img src={it.icon} alt="" className="w-4 h-4 mr-2" />}
              <span>{it.text}</span>
              {typeof it.change === "number" && (
                <span
                  className={`ml-2 text-xs ${it.change > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {it.change > 0
                    ? `+${it.change.toFixed(2)}`
                    : it.change.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logo */}
      <div className="flex justify-center items-center py-2">
        <Link href={`/${locale}`}>
          <img src="/icons/logo.svg" alt="Logo" className="w-[130px] h-[90px]" />
        </Link>
      </div>
    </header>
  );
}

