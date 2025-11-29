/**
 * API Route для загрузки следующих порций архивных новостей
 * 
 * GET /api/news/archive?locale=ru&offset=10&limit=10
 * 
 * Возвращает следующую порцию архивных новостей с offset
 * Используется для пагинации "Показать еще"
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createClient } from "@/utils/supabase/server";

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
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const supabase = await createClient();
    const userId = session.user.id;

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
        news: [],
        totalArchive: 0,
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

    if (newsError) {
      console.error("Failed to fetch news:", newsError);
      return NextResponse.json(
        { message: "Failed to fetch news." },
        { status: 500 }
      );
    }

    // Создаем мапу для связи news_id с day_number
    const dayNumberMap = new Map(allSchedule.map(s => [s.news_id, s.day_number]));

    // Сортируем все новости по дате от старых к новым
    const sortedByDate = [...(allNews || [])]
      .sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())
      .map((newsItem, index) => ({
        ...newsItem,
        sorted_order: index + 1,
        day_number: dayNumberMap.get(newsItem.id) || 0,
      }));

    // Получаем только архивные новости (sorted_order < currentDay)
    const archiveNewsItems = sortedByDate.filter(item => item.sorted_order < currentDay);
    
    // Сортируем архив от новых к старым (самая новая из архива первой)
    const sortedArchive = [...archiveNewsItems].sort((a, b) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
    
    // Применяем пагинацию
    const paginatedArchive = sortedArchive.slice(offset, offset + limit);

    return NextResponse.json({
      news: paginatedArchive.map(item => ({
        ...item,
        is_hot: false,
      })),
      totalArchive: archiveNewsItems.length,
      loadedArchive: paginatedArchive.length,
    });
    
  } catch (error) {
    console.error("Unexpected archive news fetch error:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching archive news." },
      { status: 500 }
    );
  }
}

