// scripts/seed-news.ts
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Подгружаем переменные из .env.local
config({ path: "./.env.local" });

// DEBUG: проверка переменных
console.log("DEBUG ENV:");
console.log(
  "  NEXT_PUBLIC_SUPABASE_URL:",
  !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "<undefined>",
);
console.log(
  "  SUPABASE_SERVICE_ROLE_KEY present:",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Берем URL и ключ для Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error(
    "FATAL: Supabase URL not found. Put NEXT_PUBLIC_SUPABASE_URL into .env.local",
  );
  process.exit(1);
}
if (!supabaseKey) {
  console.error("FATAL: SUPABASE_SERVICE_ROLE_KEY not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Поддерживаемые языки
const LANGUAGES = ["ru", "en", "zh"] as const;
type Language = (typeof LANGUAGES)[number];

// Данные для генерации по языкам
const TRANSLATIONS = {
  ru: {
    tags: ["политика", "экономика", "общество", "технологии", "культура"],
    categories: {
      политика: "Политика",
      экономика: "Экономика",
      общество: "Общество",
      технологии: "Технологии",
      культура: "Культура",
    },
    subjects: ["Правительство", "Компания", "Президент", "Рынок", "Сервис"],
    actions: ["объявил", "запустил", "открыл", "закрыл", "изменил"],
    objects: ["новый закон", "проект", "мероприятие", "инвестицию", "сервис"],
    sentences: [
      "Важное событие произошло в сфере государственного управления.",
      "Эксперты отмечают значительные изменения в экономической политике.",
      "Новые инициативы направлены на улучшение качества жизни граждан.",
      "Современные технологии открывают новые возможности для развития.",
      "Культурные мероприятия привлекают внимание широкой общественности.",
    ],
    readingTimeUnit: "мин",
    authors: [
      "Александр Петров",
      "Мария Иванова",
      "Дмитрий Смирнов",
      "Елена Козлова",
      "Иван Волков",
      "Ольга Новикова",
      "Сергей Лебедев",
      "Анна Морозова",
      "Павел Соколов",
      "Татьяна Павлова",
    ],
  },
  en: {
    tags: ["politics", "economy", "society", "technology", "culture"],
    categories: {
      politics: "Politics",
      economy: "Economy",
      society: "Society",
      technology: "Technology",
      culture: "Culture",
    },
    subjects: ["Government", "Company", "President", "Market", "Service"],
    actions: ["announced", "launched", "opened", "closed", "changed"],
    objects: ["new law", "project", "event", "investment", "service"],
    sentences: [
      "An important event occurred in the field of public administration.",
      "Experts note significant changes in economic policy.",
      "New initiatives are aimed at improving the quality of life for citizens.",
      "Modern technologies open up new opportunities for development.",
      "Cultural events attract the attention of the general public.",
    ],
    readingTimeUnit: "min",
    authors: [
      "Alexander Petrov",
      "Maria Ivanova",
      "Dmitry Smirnov",
      "Elena Kozlova",
      "Ivan Volkov",
      "Olga Novikova",
      "Sergey Lebedev",
      "Anna Morozova",
      "Pavel Sokolov",
      "Tatiana Pavlova",
    ],
  },
  zh: {
    tags: ["政治", "经济", "社会", "技术", "文化"],
    categories: {
      政治: "政治",
      经济: "经济",
      社会: "社会",
      技术: "技术",
      文化: "文化",
    },
    subjects: ["政府", "公司", "总统", "市场", "服务"],
    actions: ["宣布", "启动", "开放", "关闭", "改变"],
    objects: ["新法律", "项目", "活动", "投资", "服务"],
    sentences: [
      "公共管理领域发生了重要事件。",
      "专家注意到经济政策的重大变化。",
      "新举措旨在改善公民的生活质量。",
      "现代技术为发展开辟了新机遇。",
      "文化活动吸引了公众的广泛关注。",
    ],
    readingTimeUnit: "分钟",
    authors: [
      "亚历山大·彼得罗夫",
      "玛丽亚·伊万诺娃",
      "德米特里·斯米尔诺夫",
      "叶莲娜·科兹洛娃",
      "伊万·沃尔科夫",
      "奥尔加·诺维科娃",
      "谢尔盖·列别杰夫",
      "安娜·莫罗佐娃",
      "帕维尔·索科洛夫",
      "塔季扬娜·帕夫洛娃",
    ],
  },
};

// Используем локальные изображения из public/image
// В папке есть 24 изображения (1.png - 24.png)
const IMAGES = Array.from(
  { length: 24 },
  (_, i) => `/image/${i + 1}.png`,
);

// Простой RNG на основе seed для детерминированной генерации
// ВАЖНО: функция должна быть чистой (pure function) - не изменяет входной seed
function seededRandom(seed: number): number {
  const newSeed = (seed * 9301 + 49297) % 233280;
  return newSeed / 233280;
}

function getRandomElement<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function generateRandomDate(newsId: number): string {
  const today = new Date();
  const past = new Date(today);
  past.setMonth(past.getMonth() - 6);
  const daysDiff = Math.floor(seededRandom(newsId * 7) * 180); // 0-180 дней назад
  const date = new Date(past);
  date.setDate(date.getDate() + daysDiff);
  return date.toISOString().split("T")[0];
}

function generateTitle(language: Language, newsId: number): string {
  const t = TRANSLATIONS[language];
  // Используем newsId как seed для выбора элементов
  const subject = getRandomElement(t.subjects, newsId * 3);
  const action = getRandomElement(t.actions, newsId * 5);
  const object = getRandomElement(t.objects, newsId * 7);
  return `${subject} ${action} ${object}`;
}

function generateContent(language: Language, newsId: number): string {
  const t = TRANSLATIONS[language];
  // Генерируем 5 предложений на основе newsId
  const sentences = Array.from({ length: 5 }, (_, i) => 
    getRandomElement(t.sentences, newsId * 11 + i)
  );
  return sentences.join(" ");
}

function generateTags(language: Language, newsId: number): string[] {
  const t = TRANSLATIONS[language];
  // Количество тегов: 1-3, детерминированно на основе newsId
  const tagCount = Math.floor(seededRandom(newsId * 13) * 3) + 1;
  const tags: string[] = [];
  const usedIndices = new Set<number>();
  
  // Защита от бесконечного цикла: если нужно больше тегов, чем есть в массиве
  const maxTags = Math.min(tagCount, t.tags.length);
  
  for (let i = 0; i < maxTags; i++) {
    let index: number;
    let attempts = 0;
    const maxAttempts = 100; // Защита от бесконечного цикла
    
    do {
      index = Math.floor(seededRandom(newsId * 17 + i + attempts) * t.tags.length);
      attempts++;
      if (attempts > maxAttempts) {
        // Если не можем найти уникальный индекс, берем первый доступный
        index = Array.from({ length: t.tags.length }, (_, idx) => idx)
          .find(idx => !usedIndices.has(idx)) ?? 0;
        break;
      }
    } while (usedIndices.has(index));
    
    usedIndices.add(index);
    tags.push(t.tags[index]);
  }
  
  return tags;
}

function generateCategory(language: Language, tag: string): string {
  const t = TRANSLATIONS[language];
  return t.categories[tag as keyof typeof t.categories] || tag;
}

function generateReadingTime(language: Language, newsId: number): string {
  // Время чтения: 1-10 минут, детерминированно на основе newsId
  const minutes = Math.floor(seededRandom(newsId * 19) * 10) + 1;
  const t = TRANSLATIONS[language];
  return `${minutes} ${t.readingTimeUnit}`;
}

function generateAuthor(language: Language, newsId: number): string {
  // Автор: выбираем детерминированно на основе newsId
  const t = TRANSLATIONS[language];
  return getRandomElement(t.authors, newsId * 29);
}

async function seedNews(count: number = 10000) {
  console.log(
    `Начинаем генерацию ${count} новостей на ${LANGUAGES.length} языках...`,
  );
  console.log(
    `Будет создано: ${count} новостей × ${LANGUAGES.length} языков = ${count * LANGUAGES.length} записей`,
  );

  // Проверяем подключение к базе данных
  console.log("Проверка подключения к базе данных...");
  const { data: testData, error: testError } = await supabase
    .from("news")
    .select("id")
    .limit(1);
  
  if (testError) {
    console.error("Ошибка подключения к базе данных:", testError);
    process.exit(1);
  }
  console.log("✓ Подключение к базе данных успешно");

  const batchSize = 50; // Уменьшаем размер батча для стабильности
  let newsId = 1; // Счетчик для id новостей
  const startTime = Date.now();

  for (let i = 0; i < count; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, count - i);
    console.log(`Генерация батча ${Math.floor(i / batchSize) + 1}: новости ${i + 1}-${i + currentBatchSize}...`);
    
    const batch: Array<{
      id: number;
      language: Language;
      title: string;
      content: string;
      tags: string[];
      category: string;
      image_url: string;
      published_at: string;
      reading_time: string;
      author: string;
    }> = [];

    // Для каждой новости создаем версии на всех языках
    // ВАЖНО: Используем newsId как seed, чтобы для одного id генерировались одинаковые данные
    for (let j = 0; j < currentBatchSize; j++) {
      const currentNewsId = newsId;
      const publishedDate = generateRandomDate(currentNewsId);
      // Одинаковое изображение для всех языков одной новости (на основе newsId)
      const imageIndex = Math.floor(seededRandom(currentNewsId * 23) * IMAGES.length);
      const imageUrl = IMAGES[imageIndex];
      
      // Генерируем теги один раз (они будут одинаковыми для всех языков по смыслу)
      // Но переведем их на соответствующий язык
      const baseTagsRu = generateTags("ru", currentNewsId);
      const baseCategoryRu = generateCategory("ru", baseTagsRu[0]);

      // Создаем новость на каждом языке с одинаковым id
      // Используем тот же newsId как seed для всех языков
      for (const lang of LANGUAGES) {
        // Переводим теги и категорию на нужный язык
        const tags = generateTags(lang, currentNewsId);
        const category = generateCategory(lang, tags[0]);
        
        batch.push({
          id: currentNewsId,
          language: lang,
          title: generateTitle(lang, currentNewsId), // Одинаковый seed = одинаковый выбор элементов
          content: generateContent(lang, currentNewsId), // Одинаковый seed = одинаковый выбор предложений
          tags,
          category,
          image_url: imageUrl, // Одинаковое изображение для всех языков
          published_at: publishedDate, // Одинаковая дата для всех языков
          reading_time: generateReadingTime(lang, currentNewsId), // Одинаковое время чтения
          author: generateAuthor(lang, currentNewsId), // Автор (переведенное имя для каждого языка)
        });
      }
      newsId++;
    }

    console.log(`Вставка батча ${Math.floor(i / batchSize) + 1} (${batch.length} записей)...`);
    
    try {
      const { error } = await supabase.from("news").insert(batch);
      if (error) {
        console.error(
          `❌ Ошибка при вставке батча ${Math.floor(i / batchSize) + 1}:`,
          error,
        );
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
        break; // Останавливаем выполнение при ошибке
      } else {
        const insertedNews = (i + currentBatchSize) * LANGUAGES.length;
        const totalNews = count * LANGUAGES.length;
        const progress = ((insertedNews / totalNews) * 100).toFixed(1);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(
          `[${progress}%] ✓ Вставлено: ${insertedNews}/${totalNews} записей (${i + currentBatchSize}/${count} новостей) | Время: ${elapsed}с`,
        );
      }
    } catch (err) {
      console.error(`❌ Неожиданная ошибка при вставке батча ${Math.floor(i / batchSize) + 1}:`, err);
      break;
    }
    
    // Небольшая задержка между батчами, чтобы не перегружать базу данных
    if (i + batchSize < count) {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms задержка
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("Генерация новостей завершена!");
  console.log(
    `Всего создано: ${count} новостей × ${LANGUAGES.length} языков = ${count * LANGUAGES.length} записей`,
  );
  console.log(`Время выполнения: ${totalTime} секунд`);
}

// Запуск: можно передать количество новостей через аргументы командной строки
// Например: npx tsx scripts/seed-news.ts 100 (для тестирования с 100 новостями)
// По умолчанию: 10000 новостей (будет создано 30к записей: 10к × 3 языка)
const newsCount = process.argv[2] ? parseInt(process.argv[2], 10) : 10000;
if (isNaN(newsCount) || newsCount <= 0) {
  console.error("Ошибка: количество новостей должно быть положительным числом");
  process.exit(1);
}
seedNews(newsCount);
