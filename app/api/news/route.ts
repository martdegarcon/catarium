import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "@/utils/supabase/server";

// Детерминированный shuffle на основе seed
function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let rng = seed;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    rng = (rng * 1664525 + 1013904223) % 2**32;
    const j = rng % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

function uuidToSeed(uuid: string): number {
  return parseInt(uuid.replace(/-/g, '').slice(0, 8), 16);
}

// Генерация расписания на 180 дней
async function generateUserSchedule(
  userId: string, 
  language: string, 
  supabase: any
) {
  // Проверяем, есть ли уже расписание
  const { data: existing } = await supabase
    .from("user_news_start")
    .select("start_date")
    .eq("user_id", userId)
    .eq("language", language)
    .single();

  if (existing) {
    return; // Расписание уже создано
  }

  // Получаем все новости на нужном языке
  const { data: allNews } = await supabase
    .from("news")
    .select("id")
    .eq("language", language);

  if (!allNews || allNews.length === 0) return;

  // Генерируем персонализированный порядок
  const seed = uuidToSeed(userId);
  const shuffledNews = seededShuffle(allNews, seed);
  
  // Берем первые 180 новостей
  const selectedNews = shuffledNews.slice(0, 180);
  
  const today = new Date();
  const scheduleData: Array<{
    user_id: string;
    news_id: number;
    language: string;
    day_number: number;
    status: 'hot' | 'scheduled';
  }> = [];
  
  // Создаем расписание: каждая новость на свой день
  for (let day = 1; day <= 180; day++) {
    const newsIndex = day - 1;
    if (newsIndex < selectedNews.length) {
      const newsItem = selectedNews[newsIndex] as { id: number };
      scheduleData.push({
        user_id: userId,
        news_id: newsItem.id,
        language,
        day_number: day,
        status: day === 1 ? 'hot' : 'scheduled',
      });
    }
  }

  // Сохраняем расписание батчами
  const batchSize = 50;
  for (let i = 0; i < scheduleData.length; i += batchSize) {
    const batch = scheduleData.slice(i, i + batchSize);
    await supabase.from("user_news_schedule").insert(batch);
  }
  
  // Сохраняем дату начала и текущий день
  await supabase.from("user_news_start").insert({
    user_id: userId,
    language,
    start_date: today.toISOString().split('T')[0],
    current_day: 1, // Начинаем с первого дня
  });
}

// Обновление статусов новостей
// Для тестирования: каждые 30 секунд = новый день
// Для продакшена: каждые 24 часа = новый день
async function refreshUserSchedule(
  userId: string,
  language: string,
  supabase: any,
  isTestMode: boolean = true // Для тестирования: true = 30 секунд, false = 24 часа
) {
  const { data: startData } = await supabase
    .from("user_news_start")
    .select("start_date, last_refresh, current_day")
    .eq("user_id", userId)
    .eq("language", language)
    .single();

  if (!startData) return;

  let currentDay: number;

  if (isTestMode) {
    // Для тестирования: инкрементально увеличиваем день каждые 30 секунд
    // Если last_refresh есть, начинаем с него, иначе с start_date
    const referenceDate = startData.last_refresh 
      ? new Date(startData.last_refresh)
      : new Date(startData.start_date);
    
    const now = new Date();
    const secondsSinceReference = (now.getTime() - referenceDate.getTime()) / 1000;
    
    // Если прошло >= 30 секунд, переходим к следующему дню
    if (secondsSinceReference >= 30) {
      // Начинаем с дня 1, если current_day не установлен
      const previousDay = startData.current_day || 1;
      currentDay = Math.min(previousDay + 1, 180);
    } else {
      // Еще не прошло 30 секунд, остаемся на текущем дне
      currentDay = startData.current_day || 1;
    }
    
    console.log(`[TEST MODE] Текущий день: ${currentDay}, секунд с последнего обновления: ${secondsSinceReference.toFixed(0)}`);
  } else {
    // Для продакшена: считаем дни от start_date
    const startDate = new Date(startData.start_date);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    currentDay = Math.min(daysDiff + 1, 180);
  }

  // Обновляем статусы:
  // - Текущий день = 'hot'
  // - Предыдущие дни = 'archive'
  // - Будущие дни остаются 'scheduled'

  // Все предыдущие дни -> archive
  if (currentDay > 1) {
    const { error: archiveError } = await supabase
      .from("user_news_schedule")
      .update({ status: 'archive', updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("language", language)
      .lt("day_number", currentDay);
    
    if (archiveError) {
      console.error("Ошибка обновления archive:", archiveError);
    }
  }

  // Текущий день -> hot
  const { error: hotError } = await supabase
    .from("user_news_schedule")
    .update({ status: 'hot', updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("language", language)
    .eq("day_number", currentDay);

  if (hotError) {
    console.error("Ошибка обновления hot:", hotError);
  }

  // Обновляем last_refresh и current_day
  await supabase
    .from("user_news_start")
    .update({ 
      last_refresh: new Date().toISOString(),
      current_day: currentDay 
    })
    .eq("user_id", userId)
    .eq("language", language);
}

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

    // Генерируем расписание, если его нет
    await generateUserSchedule(userId, language, supabase);

    // Обновляем статусы (проверяем, прошло ли 30 секунд - для тестирования)
    // TODO: Изменить обратно на 24 часа после тестирования
    const { data: startData } = await supabase
      .from("user_news_start")
      .select("last_refresh")
      .eq("user_id", userId)
      .eq("language", language)
      .single();

    if (startData?.last_refresh) {
      const lastRefresh = new Date(startData.last_refresh);
      const now = new Date();
      const secondsSinceRefresh = (now.getTime() - lastRefresh.getTime()) / 1000;
      
      if (secondsSinceRefresh >= 30) {
        // 30 секунд для тестирования (было: hoursSinceRefresh >= 24)
        console.log(`[TEST MODE] Обновление расписания. Прошло секунд: ${secondsSinceRefresh.toFixed(0)}`);
        await refreshUserSchedule(userId, language, supabase, true); // true = тестовый режим (30 сек)
      } else {
        console.log(`[TEST MODE] Еще рано обновлять. Прошло секунд: ${secondsSinceRefresh.toFixed(0)}`);
      }
    } else {
      // Первый запуск - обновляем сразу
      console.log(`[TEST MODE] Первый запуск - создаем расписание`);
      await refreshUserSchedule(userId, language, supabase, true);
    }

    // Получаем новости пользователя: только hot + archive (ВСЕ архивные)
    const { data: schedule } = await supabase
      .from("user_news_schedule")
      .select("news_id, status, day_number")
      .eq("user_id", userId)
      .eq("language", language)
      .in("status", ["hot", "archive"])
      .order("day_number", { ascending: false }); // Сначала новые (hot), потом старые

    if (!schedule || schedule.length === 0) {
      return NextResponse.json([]);
    }

    const newsIds = schedule.map(s => s.news_id);
    
    // Получаем полные данные новостей
    const { data: news, error } = await supabase
      .from("news")
      .select("id, language, title, content, tags, category, image_url, published_at, reading_time")
      .eq("language", language)
      .in("id", newsIds);

    if (error) {
      console.error("Failed to fetch news:", error);
      return NextResponse.json(
        { message: "Failed to fetch news." },
        { status: 500 }
      );
    }

    // Создаем мапу для быстрого доступа
    const newsMap = new Map(news?.map(n => [n.id, n]) || []);
    
    // Формируем результат: hot сначала, потом archive
    const result = schedule
      .map(s => {
        const newsItem = newsMap.get(s.news_id);
        if (!newsItem) return null;
        return {
          ...newsItem,
          status: s.status as 'hot' | 'archive',
        };
      })
      .filter((n): n is NonNullable<typeof n> => n !== null);

    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Unexpected news fetch error:", error);
    return NextResponse.json(
      { message: "Unexpected error while fetching news." },
      { status: 500 }
    );
  }
}
