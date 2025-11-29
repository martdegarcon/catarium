/**
 * API Route для получения персонализированных новостей пользователя
 * 
 * GET /api/news?locale=ru
 * 
 * Логика работы:
 * 1. Проверяет аутентификацию пользователя
 * 2. Генерирует персональное расписание (если его еще нет)
 * 3. Обновляет статусы новостей (если прошло достаточно времени)
 * 4. Возвращает новости со статусами 'hot' и 'archive'
 * 
 * Интервал обновления: 30 секунд (для тестирования, обычно 24 часа)
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "@/utils/supabase/server";
import { generateUserSchedule, refreshUserSchedule } from "./lib/schedule";

/**
 * Обработчик GET запроса для получения новостей
 * 
 * @param request - NextRequest объект с параметрами запроса
 * @returns JSON с массивом новостей (hot + archive)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Проверка аутентификации
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Определение языка из query параметра
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ru";
    const validLocales = ["ru", "en", "zh"];
    const language = validLocales.includes(locale) ? locale : "ru";

    const supabase = await createClient();
    const userId = session.user.id;

    // 3. Генерация расписания (если его еще нет)
    await generateUserSchedule(userId, language, supabase);

    // 4. Обновление статусов новостей (если прошло достаточно времени)
    // TODO: Вернуть обратно на 24 часа после тестирования (изменить isTestMode на false)
    // Для тестирования: isTestMode = true (30 секунд), для продакшена: isTestMode = false (24 часа)
    const isTestMode = true; // Временно для тестирования
    
    await refreshUserSchedule(userId, language, supabase, isTestMode);

    // 5. Получение всех 180 новостей из расписания пользователя (hot + archive + scheduled)
    const { data: schedule } = await supabase
      .from("user_news_schedule")
      .select("news_id, status, day_number")
      .eq("user_id", userId)
      .eq("language", language)
      .order("day_number", { ascending: true }); // От дня 1 до дня 180

    if (!schedule || schedule.length === 0) {
      return NextResponse.json([]);
    }

    // 6. Получение полных данных новостей из таблицы news
    const newsIds = schedule.map(s => s.news_id);
    
    const { data: news, error } = await supabase
      .from("news")
      .select("id, language, title, content, tags, category, image_url, published_at, reading_time, author")
      .eq("language", language)
      .in("id", newsIds);

    if (error) {
      console.error("Failed to fetch news:", error);
      return NextResponse.json(
        { message: "Failed to fetch news." },
        { status: 500 }
      );
    }

    // 7. Получаем current_day для определения, какая новость сейчас hot
    const { data: startData } = await supabase
      .from("user_news_start")
      .select("current_day")
      .eq("user_id", userId)
      .eq("language", language)
      .single();

    const currentDay = startData?.current_day || 1;

    // 8. Формирование результата: объединяем данные расписания с данными новостей
    const newsMap = new Map(news?.map(n => [n.id, n]) || []);
    
    const result = schedule
      .map(s => {
        const newsItem = newsMap.get(s.news_id);
        if (!newsItem) return null;
        return {
          ...newsItem,
          status: s.status as 'hot' | 'archive' | 'scheduled',
          day_number: s.day_number, // Добавляем day_number для определения порядка
        };
      })
      .filter((n): n is NonNullable<typeof n> => n !== null);

    // 9. Возвращаем новости + current_day
    return NextResponse.json({ 
      news: result,
      currentDay 
    });
    
  } catch (error) {
    console.error("Unexpected news fetch error:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching news." },
      { status: 500 }
    );
  }
}
