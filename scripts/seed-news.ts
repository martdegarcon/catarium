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
  },
};

const IMAGES = Array.from(
  { length: 20 },
  (_, i) => `https://picsum.photos/seed/${i + 1}/400/200`,
);

function getRandomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDate() {
  const today = new Date();
  const past = new Date(today);
  past.setMonth(past.getMonth() - 6);
  return new Date(
    past.getTime() + Math.random() * (today.getTime() - past.getTime()),
  );
}

function generateTitle(language: Language): string {
  const t = TRANSLATIONS[language];
  const subject = getRandomElement(t.subjects);
  const action = getRandomElement(t.actions);
  const object = getRandomElement(t.objects);
  return `${subject} ${action} ${object}`;
}

function generateContent(language: Language): string {
  const t = TRANSLATIONS[language];
  return Array.from({ length: 5 }, () => getRandomElement(t.sentences)).join(
    " ",
  );
}

function generateTags(language: Language): string[] {
  const t = TRANSLATIONS[language];
  return Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => getRandomElement(t.tags),
  );
}

function generateCategory(language: Language, tag: string): string {
  const t = TRANSLATIONS[language];
  return t.categories[tag as keyof typeof t.categories] || tag;
}

function generateReadingTime(language: Language): string {
  const minutes = Math.floor(Math.random() * 10) + 1;
  const t = TRANSLATIONS[language];
  return `${minutes} ${t.readingTimeUnit}`;
}

async function seedNews(count: number = 10000) {
  console.log(
    `Начинаем генерацию ${count} новостей на ${LANGUAGES.length} языках...`,
  );
  console.log(
    `Будет создано: ${count} новостей × ${LANGUAGES.length} языков = ${count * LANGUAGES.length} записей`,
  );

  // Сначала очищаем таблицу (опционально, можно закомментировать)
  console.log("Очистка существующих новостей...");
  await supabase.from("news").delete().neq("id", 0);

  const batchSize = 100; // Увеличиваем размер батча для больших объемов
  let newsId = 1; // Счетчик для id новостей
  const startTime = Date.now();

  for (let i = 0; i < count; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, count - i);
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
    }> = [];

    // Для каждой новости создаем версии на всех языках
    for (let j = 0; j < currentBatchSize; j++) {
      const publishedDate = generateRandomDate().toISOString().split("T")[0];
      const imageUrl = getRandomElement(IMAGES);

      // Создаем новость на каждом языке с одинаковым id
      for (const lang of LANGUAGES) {
        const tags = generateTags(lang);
        batch.push({
          id: newsId,
          language: lang,
          title: generateTitle(lang),
          content: generateContent(lang),
          tags,
          category: generateCategory(lang, tags[0]),
          image_url: imageUrl, // Одинаковое изображение для всех языков
          published_at: publishedDate, // Одинаковая дата для всех языков
          reading_time: generateReadingTime(lang),
        });
      }
      newsId++;
    }

    const { error } = await supabase.from("news").insert(batch);
    if (error) {
      console.error(
        `Ошибка при вставке батча ${Math.floor(i / batchSize) + 1}:`,
        error,
      );
    } else {
      const insertedNews = (i + currentBatchSize) * LANGUAGES.length;
      const totalNews = count * LANGUAGES.length;
      const progress = ((insertedNews / totalNews) * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `[${progress}%] Вставлено: ${insertedNews}/${totalNews} записей (${i + currentBatchSize}/${count} новостей) | Время: ${elapsed}с`,
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("Генерация новостей завершена!");
  console.log(
    `Всего создано: ${count} новостей × ${LANGUAGES.length} языков = ${count * LANGUAGES.length} записей`,
  );
  console.log(`Время выполнения: ${totalTime} секунд`);
}

// Запуск на 10к новостей (будет создано 30к записей: 10к × 3 языка)
seedNews(10000);
