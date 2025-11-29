/**
 * API Route для получения только новой hot новости при обновлении
 * 
 * GET /api/news/update?locale=ru
 * 
 * Возвращает только одну новую hot новость (текущий day_number)
 * Используется при обновлении каждую минуту
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createClient } from "@/utils/supabase/server";
import { refreshUserSchedule } from "../lib/schedule";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ru";
    const validLocales = ["ru", "en", "zh"];
    const language = validLocales.includes(locale) ? locale : "ru";

    const supabase = await createClient();
    const userId = session.user.id;

    // Обновляем статусы новостей
    const isTestMode = true;
    await refreshUserSchedule(userId, language, supabase, isTestMode);

    // Получаем currentDay
    const { data: startData } = await supabase
      .from("user_news_start")
      .select("current_day")
      .eq("user_id", userId)
      .eq("language", language)
      .single();

    const currentDay = startData?.current_day || 1;

    // Получаем ВСЕ 180 новостей из расписания пользователя
    const { data: allSchedule } = await supabase
      .from("user_news_schedule")
      .select("news_id, day_number")
      .eq("user_id", userId)
      .eq("language", language)
      .order("day_number", { ascending: true });

    if (!allSchedule || allSchedule.length === 0) {
      return NextResponse.json({
        news: null,
        currentDay,
      });
    }

    // Получаем все news_id
    const allNewsIds = allSchedule.map(s => s.news_id);

    // Получаем полные данные всех новостей из таблицы news
    const { data: allNews, error: newsError } = await supabase
      .from("news")
      .select("id, language, title, content, tags, category, image_url, published_at, reading_time, author")
      .eq("language", language)
      .in("id", allNewsIds);

    if (newsError || !allNews) {
      console.error("Failed to fetch news:", newsError);
      return NextResponse.json({
        news: null,
        currentDay,
      });
    }

    // Создаем мапу для связи news_id с day_number
    const dayNumberMap = new Map(allSchedule.map(s => [s.news_id, s.day_number]));

    // Сортируем все новости по дате от СТАРЫХ к НОВЫМ
    const sortedByDate = [...allNews]
      .sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())
      .map((newsItem, index) => ({
        ...newsItem,
        sorted_order: index + 1, // Порядок в отсортированном списке (1-180)
        day_number: dayNumberMap.get(newsItem.id) || 0,
      }));

    // Hot новость = новость на позиции currentDay в отсортированном списке
    const hotNewsItem = sortedByDate.find(item => item.sorted_order === currentDay);

    if (!hotNewsItem) {
      return NextResponse.json({
        news: null,
        currentDay,
      });
    }

    const result = {
      ...hotNewsItem,
      is_hot: true,
    };

    return NextResponse.json({
      news: [result], // Возвращаем массив с одной новостью для совместимости
      currentDay,
    });
    
  } catch (error) {
    console.error("Unexpected update news fetch error:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching update news." },
      { status: 500 }
    );
  }
}

