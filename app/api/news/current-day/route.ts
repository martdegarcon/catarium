/**
 * API Route для получения только currentDay (для быстрого обновления)
 * 
 * GET /api/news/current-day?locale=ru
 * 
 * Возвращает только currentDay без загрузки всех новостей
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createClient } from "@/utils/supabase/server";
import { generateUserSchedule, refreshUserSchedule } from "../lib/schedule";

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
    const isTestMode = true; // Временно для тестирования
    await refreshUserSchedule(userId, language, supabase, isTestMode);

    // 5. Получаем только currentDay
    const { data: startData } = await supabase
      .from("user_news_start")
      .select("current_day")
      .eq("user_id", userId)
      .eq("language", language)
      .single();

    const currentDay = startData?.current_day || 1;

    return NextResponse.json({ currentDay });
    
  } catch (error) {
    console.error("Unexpected currentDay fetch error:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching currentDay." },
      { status: 500 }
    );
  }
}

