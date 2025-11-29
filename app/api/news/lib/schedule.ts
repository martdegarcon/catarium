/**
 * Функции для работы с расписанием новостей пользователя
 * 
 * Отвечает за:
 * - Генерацию персонального расписания на 180 дней
 * - Обновление статусов новостей (hot/archive/scheduled)
 * - Расчет текущего дня расписания
 */

import { seededShuffle, uuidToSeed } from "./utils";

/**
 * Генерирует персональное расписание новостей для пользователя на 180 дней
 * 
 * Логика:
 * 1. Выбирает 180 новостей из общего пула на нужном языке
 * 2. Перемешивает их детерминированно на основе user_id (одинаковый порядок для одного пользователя)
 * 3. Создает записи в user_news_schedule: каждая новость на свой день
 * 4. Первый день получает статус 'hot', остальные - 'scheduled'
 * 
 * @param userId - ID пользователя
 * @param language - язык новостей ('ru', 'en', 'zh')
 * @param supabase - клиент Supabase
 */
export async function generateUserSchedule(
  userId: string, 
  language: string, 
  supabase: any
) {
  // Проверяем, есть ли уже расписание для этого языка
  const { data: existing } = await supabase
    .from("user_news_start")
    .select("start_date")
    .eq("user_id", userId)
    .eq("language", language)
    .single();

  if (existing) {
    return; // Расписание уже создано для этого языка
  }

  // Получаем все уникальные id новостей (без учета языка)
  // Это гарантирует, что для всех языков будет одинаковый порядок новостей
  const { data: allNewsIds } = await supabase
    .from("news")
    .select("id")
    .eq("language", "ru"); // Используем русский как базовый для получения списка id

  if (!allNewsIds || allNewsIds.length === 0) return;

  // Проверяем, есть ли расписание для другого языка (чтобы синхронизировать current_day)
  const { data: otherLanguageSchedule } = await supabase
    .from("user_news_start")
    .select("start_date, current_day, last_refresh")
    .eq("user_id", userId)
    .neq("language", language)
    .limit(1)
    .single();

  // Генерируем персонализированный порядок на основе user_id
  // Этот порядок будет одинаковым для всех языков
  const seed = uuidToSeed(userId);
  const shuffledNewsIds = seededShuffle(allNewsIds, seed);
  
  // Берем первые 180 id новостей
  // ВАЖНО: Используем ОДИНАКОВЫЕ id для всех языков
  const selectedNewsIds = shuffledNewsIds.slice(0, 180).map((item) => (item as { id: number }).id);
  
  const today = new Date();
  const scheduleData: Array<{
    user_id: string;
    news_id: number;
    language: string;
    day_number: number;
    status: 'hot' | 'scheduled';
  }> = [];
  
  // Создаем расписание: каждая новость на свой день
  // Используем ТОЧНО ТОТ ЖЕ порядок id для всех языков
  for (let day = 1; day <= 180; day++) {
    const newsIndex = day - 1;
    if (newsIndex < selectedNewsIds.length) {
      const newsId = selectedNewsIds[newsIndex];
      // Используем тот же id для всех языков, независимо от того, существует ли новость на этом языке
      scheduleData.push({
        user_id: userId,
        news_id: newsId,
        language,
        day_number: day,
        status: day === 1 ? 'hot' : 'scheduled',
      });
    }
  }

  // Сохраняем расписание батчами (по 50 записей за раз)
  const batchSize = 50;
  for (let i = 0; i < scheduleData.length; i += batchSize) {
    const batch = scheduleData.slice(i, i + batchSize);
    await supabase.from("user_news_schedule").insert(batch);
  }
  
  // Сохраняем дату начала, текущий день и last_refresh
  // Если есть расписание для другого языка, синхронизируем current_day и last_refresh
  const now = new Date();
  await supabase.from("user_news_start").insert({
    user_id: userId,
    language,
    start_date: otherLanguageSchedule?.start_date || today.toISOString().split('T')[0],
    current_day: otherLanguageSchedule?.current_day || 1, // Синхронизируем с другим языком
    last_refresh: otherLanguageSchedule?.last_refresh || now.toISOString(), // Синхронизируем с другим языком
  });
}

/**
 * Обновляет статусы новостей в расписании пользователя
 * 
 * Логика обновления:
 * - Текущий день (current_day) → статус 'hot'
 * - Предыдущие дни (< current_day) → статус 'archive'
 * - Будущие дни (> current_day) → остаются 'scheduled'
 * 
 * Расчет текущего дня:
 * - В тестовом режиме (isTestMode=true): инкрементально увеличивается каждые 30 секунд
 * - В продакшене (isTestMode=false): считается от start_date (каждый день = +1)
 * 
 * @param userId - ID пользователя
 * @param language - язык новостей
 * @param supabase - клиент Supabase
 * @param isTestMode - режим тестирования (true = 30 сек, false = 24 часа)
 */
export async function refreshUserSchedule(
  userId: string,
  language: string,
  supabase: any,
  isTestMode: boolean = false
) {
  const { data: startData } = await supabase
    .from("user_news_start")
    .select("start_date, last_refresh, current_day")
    .eq("user_id", userId)
    .eq("language", language)
    .single();

  if (!startData) return;

  let currentDay: number;

  // Всегда используем инкрементальную логику на основе current_day и last_refresh
  // Это работает и для тестирования, и для продакшена
  const previousDay = startData.current_day || 1;
  
  if (startData.last_refresh) {
    const lastRefresh = new Date(startData.last_refresh);
    const now = new Date();
    const secondsSinceRefresh = (now.getTime() - lastRefresh.getTime()) / 1000;
    
    // Если расписание только что создано (меньше 5 секунд), не обновляем
    // Это предотвращает скачки current_day при первом создании расписания для нового языка
    if (secondsSinceRefresh < 5) {
      currentDay = previousDay;
      return; // Выходим раньше, не обновляем статусы
    }
    
    if (isTestMode) {
      // Для тестирования: проверяем, прошло ли 30 секунд
      if (secondsSinceRefresh >= 30) {
        currentDay = Math.min(previousDay + 1, 180);
      } else {
        currentDay = previousDay; // Остаемся на текущем дне
        return; // Выходим раньше, не обновляем статусы
      }
    } else {
      // Для продакшена: проверяем, прошло ли 24 часа (86400 секунд)
      if (secondsSinceRefresh >= 86400) {
        // Прошло 24 часа - переходим к следующему дню
        const daysPassed = Math.floor(secondsSinceRefresh / 86400);
        currentDay = Math.min(previousDay + daysPassed, 180);
      } else {
        currentDay = previousDay; // Остаемся на текущем дне
        return; // Выходим раньше, не обновляем статусы
      }
    }
  } else {
    // Если last_refresh нет, начинаем с дня 1 и не обновляем
    currentDay = 1;
    return; // Выходим раньше, не обновляем статусы
  }

  // Обновляем статусы:
  // - Текущий день = 'hot'
  // - Предыдущие дни = 'archive'
  // - Будущие дни остаются 'scheduled'

  // Обновляем статусы для ВСЕХ языков пользователя одновременно
  // Это гарантирует синхронизацию между языками
  
  // Сначала переводим ВСЕ существующие 'hot' в 'archive' для всех языков
  const { error: archiveAllHotError } = await supabase
    .from("user_news_schedule")
    .update({ status: 'archive', updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("status", 'hot');
  
  if (archiveAllHotError) {
    console.error("Ошибка обновления всех hot в archive:", archiveAllHotError);
  }

  // Все предыдущие дни (< currentDay) -> archive для всех языков
  if (currentDay > 1) {
    const { error: archiveError } = await supabase
      .from("user_news_schedule")
      .update({ status: 'archive', updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .lt("day_number", currentDay);
    
    if (archiveError) {
      console.error("Ошибка обновления archive:", archiveError);
    }
  }

  // Текущий день -> hot для всех языков (только одна новость должна быть hot на каждый язык)
  const { error: hotError } = await supabase
    .from("user_news_schedule")
    .update({ status: 'hot', updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("day_number", currentDay);

  if (hotError) {
    console.error("Ошибка обновления hot:", hotError);
  }

  // Обновляем last_refresh и current_day для текущего языка
  await supabase
    .from("user_news_start")
    .update({ 
      last_refresh: new Date().toISOString(),
      current_day: currentDay 
    })
    .eq("user_id", userId)
    .eq("language", language);

  // Синхронизируем current_day и last_refresh для всех остальных языков пользователя
  // Это гарантирует, что все языки будут на одном и том же дне
  await supabase
    .from("user_news_start")
    .update({ 
      last_refresh: new Date().toISOString(),
      current_day: currentDay 
    })
    .eq("user_id", userId)
    .neq("language", language);
}

