/**
 * API Route для первоначальной загрузки новостей пользователя
 * 
 * GET /api/news/initial?locale=ru&archiveLimit=10
 * 
 * Возвращает hot новость + первые N архивных новостей (по умолчанию 10)
 * Используется при первой загрузке страницы
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createClient } from "@/utils/supabase/server";
import { generateUserSchedule, refreshUserSchedule } from "../lib/schedule";

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
    const archiveLimit = parseInt(searchParams.get("archiveLimit") || "10", 10);

    const supabase = await createClient();
    const userId = session.user.id;

    // Генерируем расписание (если его еще нет)
    await generateUserSchedule(userId, language, supabase);

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
        news: [],
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

    if (newsError) {
      console.error("Failed to fetch news:", newsError);
      return NextResponse.json(
        { message: "Failed to fetch news." },
        { status: 500 }
      );
    }

    // Создаем мапу для связи news_id с day_number (из расписания)
    const dayNumberMap = new Map(allSchedule.map(s => [s.news_id, s.day_number]));

    // ВАЖНО: Сортируем все новости по дате от СТАРЫХ к НОВЫМ
    // Это гарантирует правильную хронологию
    const sortedByDate = [...(allNews || [])]
      .sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())
      .map((newsItem, index) => ({
        ...newsItem,
        sorted_order: index + 1, // Порядок в отсортированном списке (1-180)
        day_number: dayNumberMap.get(newsItem.id) || 0, // Сохраняем day_number для связи с расписанием
      }));

    // Hot новость = новость на позиции currentDay в отсортированном списке (от старых к новым)
    // Archive = все новости до позиции currentDay (более старые)
    // Важно: sortedByDate уже отсортированы от старых к новым по дате
    
    // Разделяем на hot и archive
    const hotNewsItem = sortedByDate.find(item => item.sorted_order === currentDay);
    const archiveNewsItems = sortedByDate.filter(item => item.sorted_order < currentDay);
    
    // Сортируем архив от новых к старым (самая новая из архива первой) для отображения
    const sortedArchive = [...archiveNewsItems].sort((a, b) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
    
    // Берем только первые N архивных новостей
    const limitedArchive = sortedArchive.slice(0, archiveLimit);
    
    // Формируем результат: hot + первые N архивных
    const result: any[] = [];
    
    if (hotNewsItem) {
      result.push({
        ...hotNewsItem,
        is_hot: true,
      });
    }
    
    result.push(...limitedArchive.map(item => ({
      ...item,
      is_hot: false,
    })));

    return NextResponse.json({
      news: result,
      currentDay,
      totalArchive: archiveNewsItems.length, // Общее количество архивных новостей
      loadedArchive: limitedArchive.length, // Загружено архивных новостей
    });
    
  } catch (error) {
    console.error("Unexpected initial news fetch error:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching initial news." },
      { status: 500 }
    );
  }
}

