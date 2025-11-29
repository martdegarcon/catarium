// scripts/seed-labor-market.ts
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Подгружаем переменные из .env.local
config({ path: "./.env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("FATAL: Supabase URL not found. Put NEXT_PUBLIC_SUPABASE_URL into .env.local");
  process.exit(1);
}
if (!supabaseKey) {
  console.error("FATAL: SUPABASE_SERVICE_ROLE_KEY not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const LANGUAGES = ["ru", "en", "zh"] as const;
type Language = (typeof LANGUAGES)[number];

// Русские названия компаний
const COMPANY_NAMES_RU = [
  "Яндекс",
  "Сбербанк",
  "Газпром",
  "Лукойл",
  "Роснефть",
  "Тинькофф Банк",
  "ВТБ",
  "МТС",
  "Мегафон",
  "Билайн",
  "Почта России",
  "РЖД",
  "Аэрофлот",
  "X5 Retail Group",
  "Магнит",
  "Перекресток",
  "Лента",
  "Сбермаркет",
  "Озон",
  "Wildberries",
  "Альфа-Банк",
  "Райффайзенбанк",
  "VK",
  "Mail.ru Group",
  "Авито",
];

// Английские переводы
const COMPANY_NAMES_EN = [
  "Yandex",
  "Sberbank",
  "Gazprom",
  "Lukoil",
  "Rosneft",
  "Tinkoff Bank",
  "VTB",
  "MTS",
  "MegaFon",
  "Beeline",
  "Russian Post",
  "Russian Railways",
  "Aeroflot",
  "X5 Retail Group",
  "Magnit",
  "Perekrestok",
  "Lenta",
  "Sbermarket",
  "Ozon",
  "Wildberries",
  "Alfa-Bank",
  "Raiffeisenbank",
  "VK",
  "Mail.ru Group",
  "Avito",
];

// Китайские переводы
const COMPANY_NAMES_ZH = [
  "Yandex",
  "储蓄银行",
  "俄罗斯天然气工业股份公司",
  "卢克石油",
  "俄罗斯石油公司",
  "Tinkoff银行",
  "外贸银行",
  "MTS",
  "MegaFon",
  "Beeline",
  "俄罗斯邮政",
  "俄罗斯铁路",
  "俄罗斯国际航空公司",
  "X5零售集团",
  "Magnit",
  "Perekrestok",
  "Lenta",
  "Sbermarket",
  "Ozon",
  "Wildberries",
  "阿尔法银行",
  "瑞富森银行",
  "VK",
  "Mail.ru Group",
  "Avito",
];

const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract", "remote", "hybrid"] as const;

// Данные для новостей рынка труда
const LABOR_MARKET_NEWS_DATA = {
  ru: {
    titles: [
      "Рынок труда: новые тренды в IT-индустрии",
      "Удаленная работа становится стандартом",
      "Зарплаты в России: статистика 2024",
      "Новые профессии будущего",
      "Как найти работу мечты",
      "Топ-10 компаний для работы",
      "Карьерный рост в современном мире",
      "Навыки, которые нужны работодателям",
      "Иммиграция и рынок труда",
      "Фриланс vs офисная работа",
    ],
    categories: ["IT", "Экономика", "Карьера", "Образование", "Статистика"],
    tags: ["работа", "карьера", "IT", "зарплата", "трудоустройство"],
  },
  en: {
    titles: [
      "Labor Market: New Trends in IT Industry",
      "Remote Work Becomes Standard",
      "Salaries in Russia: 2024 Statistics",
      "New Professions of the Future",
      "How to Find Your Dream Job",
      "Top 10 Companies to Work For",
      "Career Growth in the Modern World",
      "Skills Employers Need",
      "Immigration and Labor Market",
      "Freelance vs Office Work",
    ],
    categories: ["IT", "Economy", "Career", "Education", "Statistics"],
    tags: ["work", "career", "IT", "salary", "employment"],
  },
  zh: {
    titles: [
      "劳动力市场：IT行业新趋势",
      "远程工作成为标准",
      "俄罗斯薪资：2024年统计数据",
      "未来的新职业",
      "如何找到理想工作",
      "十大最佳雇主公司",
      "现代世界的职业发展",
      "雇主需要的技能",
      "移民与劳动力市场",
      "自由职业vs办公室工作",
    ],
    categories: ["IT", "经济", "职业", "教育", "统计"],
    tags: ["工作", "职业", "IT", "薪资", "就业"],
  },
};

// Простой RNG для детерминированной генерации
function seededRandom(seed: number): number {
  const newSeed = (seed * 9301 + 49297) % 233280;
  return newSeed / 233280;
}

function getRandomElement<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

async function seedCompanies() {
  console.log("Начинаем создание компаний...");

  const companies = COMPANY_NAMES_RU.map((nameRu, index) => {
    const seed = index + 1;
    
    // Финансовые данные в USD (все значения в долларах)
    const employeeCount = Math.floor(seededRandom(seed * 3) * 100000) + 100;
    
    // Все зарплаты и финансовые показатели в USD
    const averageSalaryUSD = Math.floor(seededRandom(seed * 5) * 5000) + 500; // 500-5500 USD
    const foundedYear = Math.floor(seededRandom(seed * 7) * 50) + 1970;
    const authorizedCapitalUSD = Math.floor(seededRandom(seed * 11) * 10000000) + 10000; // 10k-10M USD
    const netProfitUSD = Math.floor(seededRandom(seed * 13) * 5000000) - 1000000; // -1M до 4M USD
    const balanceUSD = Math.floor(seededRandom(seed * 17) * 50000000) + 100000; // 100k-50M USD

    return {
      name: nameRu,
      name_ru: nameRu,
      name_en: COMPANY_NAMES_EN[index] || nameRu,
      name_zh: COMPANY_NAMES_ZH[index] || nameRu,
      description: `Крупная российская компания в сфере технологий и услуг`,
      description_ru: `Крупная российская компания в сфере технологий и услуг`,
      description_en: `Large Russian company in technology and services`,
      description_zh: `大型俄罗斯科技和服务公司`,
      logo_url: null,
      employee_count: employeeCount,
      average_salary: averageSalaryUSD,
      founded_year: foundedYear,
      authorized_capital: authorizedCapitalUSD,
      net_profit: netProfitUSD,
      balance: balanceUSD,
    };
  });

  const { error } = await supabase.from("companies").insert(companies);

  if (error) {
    console.error("❌ Ошибка при создании компаний:", error);
    throw error;
  }

  console.log(`✓ Создано ${companies.length} компаний`);
  return companies.length;
}

async function seedVacancies(companyIds: string[]) {
  console.log("Начинаем создание вакансий...");

  const vacancies: Array<{
    company_id: string;
    title: string;
    title_ru: string;
    title_en: string;
    title_zh: string;
    description: string;
    description_ru: string;
    description_en: string;
    description_zh: string;
    salary_min: number; // В USD
    salary_max: number; // В USD
    location: string;
    location_ru: string;
    location_en: string;
    location_zh: string;
    employment_type: string;
    requirements: string[];
  }> = [];

  const jobTitlesRu = [
    "Frontend разработчик",
    "Backend разработчик",
    "Fullstack разработчик",
    "DevOps инженер",
    "QA инженер",
    "Product Manager",
    "UX/UI дизайнер",
    "Маркетолог",
    "Менеджер по продажам",
    "Аналитик данных",
    "Системный администратор",
    "Бизнес-аналитик",
    "HR менеджер",
    "Финансовый аналитик",
    "Юрист",
  ];

  const jobTitlesEn = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "DevOps Engineer",
    "QA Engineer",
    "Product Manager",
    "UX/UI Designer",
    "Marketer",
    "Sales Manager",
    "Data Analyst",
    "System Administrator",
    "Business Analyst",
    "HR Manager",
    "Financial Analyst",
    "Lawyer",
  ];

  const jobTitlesZh = [
    "前端开发人员",
    "后端开发人员",
    "全栈开发人员",
    "DevOps工程师",
    "QA工程师",
    "产品经理",
    "UX/UI设计师",
    "营销人员",
    "销售经理",
    "数据分析师",
    "系统管理员",
    "业务分析师",
    "人力资源经理",
    "财务分析师",
    "律师",
  ];

  const locationsRu = ["Москва", "Санкт-Петербург", "Екатеринбург", "Новосибирск", "Удаленно"];
  const locationsEn = ["Moscow", "Saint Petersburg", "Yekaterinburg", "Novosibirsk", "Remote"];
  const locationsZh = ["莫斯科", "圣彼得堡", "叶卡捷琳堡", "新西伯利亚", "远程"];

  let vacancyIndex = 0;
  
  // Создаем по 3-5 вакансий на компанию
  for (const companyId of companyIds) {
    const vacanciesCount = Math.floor(seededRandom(vacancyIndex * 3) * 3) + 3; // 3-5 вакансий
    
    for (let i = 0; i < vacanciesCount; i++) {
      const seed = vacancyIndex * 100 + i;
      const titleIndex = Math.floor(seededRandom(seed) * jobTitlesRu.length);
      const locationIndex = Math.floor(seededRandom(seed * 3) * locationsRu.length);
      
      // Все зарплаты в USD
      const salaryMinUSD = Math.floor(seededRandom(seed * 7) * 2000) + 500; // 500-2500 USD
      const salaryMaxUSD = salaryMinUSD + Math.floor(seededRandom(seed * 11) * 2000); // + до 2000 USD

      vacancies.push({
        company_id: companyId,
        title: jobTitlesRu[titleIndex],
        title_ru: jobTitlesRu[titleIndex],
        title_en: jobTitlesEn[titleIndex],
        title_zh: jobTitlesZh[titleIndex],
        description: `Приглашаем на позицию ${jobTitlesRu[titleIndex]}. Опыт работы от 2 лет.`,
        description_ru: `Приглашаем на позицию ${jobTitlesRu[titleIndex]}. Опыт работы от 2 лет.`,
        description_en: `We are looking for a ${jobTitlesEn[titleIndex]}. Experience from 2 years.`,
        description_zh: `我们正在寻找${jobTitlesZh[titleIndex]}。2年以上经验。`,
        salary_min: salaryMinUSD,
        salary_max: salaryMaxUSD,
        location: locationsRu[locationIndex],
        location_ru: locationsRu[locationIndex],
        location_en: locationsEn[locationIndex],
        location_zh: locationsZh[locationIndex],
        employment_type: getRandomElement(EMPLOYMENT_TYPES, seed * 13),
        requirements: ["Опыт работы от 2 лет", "Знание английского языка", "Умение работать в команде"],
      });
      
      vacancyIndex++;
    }
  }

  // Вставляем батчами по 50
  const batchSize = 50;
  for (let i = 0; i < vacancies.length; i += batchSize) {
    const batch = vacancies.slice(i, i + batchSize);
    const { error } = await supabase.from("vacancies").insert(batch);
    
    if (error) {
      console.error(`❌ Ошибка при создании вакансий (батч ${Math.floor(i / batchSize) + 1}):`, error);
      throw error;
    }
    
    console.log(`✓ Создано вакансий: ${Math.min(i + batchSize, vacancies.length)}/${vacancies.length}`);
  }

  console.log(`✓ Всего создано ${vacancies.length} вакансий`);
  return vacancies.length;
}

async function seedLaborMarketNews(count: number = 200) {
  console.log(`Начинаем создание ${count} новостей рынка труда на ${LANGUAGES.length} языках...`);

  const news = [];
  const batchSize = 50;

  for (let i = 0; i < count; i++) {
    const newsId = i + 1;
    
    for (const lang of LANGUAGES) {
      const data = LABOR_MARKET_NEWS_DATA[lang];
      const titleIndex = newsId % data.titles.length;
      
      const publishedDate = new Date();
      publishedDate.setDate(publishedDate.getDate() - Math.floor(seededRandom(newsId * 7) * 180));

      news.push({
        language: lang,
        title: data.titles[titleIndex],
        content: `${data.titles[titleIndex]}. Подробная информация о рынке труда и карьерных возможностях. Актуальные данные и статистика.`,
        tags: [data.tags[0], data.tags[1], data.tags[2]],
        category: data.categories[Math.floor(seededRandom(newsId * 3) * data.categories.length)],
        image_url: `/image/${(newsId % 24) + 1}.png`,
        published_at: publishedDate.toISOString(),
        reading_time: `${Math.floor(seededRandom(newsId * 5) * 10) + 1} мин`,
        author: `Автор ${newsId}`,
      });
    }
  }

  // Вставляем батчами
  for (let i = 0; i < news.length; i += batchSize) {
    const batch = news.slice(i, i + batchSize);
    const { error } = await supabase.from("labor_market_news").insert(batch);
    
    if (error) {
      console.error(`❌ Ошибка при создании новостей (батч ${Math.floor(i / batchSize) + 1}):`, error);
      throw error;
    }
    
    console.log(`✓ Создано новостей: ${Math.min(i + batchSize, news.length)}/${news.length}`);
  }

  console.log(`✓ Всего создано ${count} новостей × ${LANGUAGES.length} языков = ${news.length} записей`);
  return news.length;
}

async function main() {
  console.log("=== Заполнение таблиц Labor Market ===\n");

  try {
    // 1. Создаем компании
    const companiesCount = await seedCompanies();
    
    // 2. Получаем ID созданных компаний
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .select("id")
      .order("created_at", { ascending: true });
    
    if (companiesError || !companies) {
      throw new Error("Не удалось получить список компаний");
    }
    
    const companyIds = companies.map((c) => c.id);
    
    // 3. Создаем вакансии
    await seedVacancies(companyIds);
    
    // 4. Создаем новости (200 штук)
    await seedLaborMarketNews(200);
    
    console.log("\n=== Заполнение завершено успешно! ===");
  } catch (error) {
    console.error("\n❌ Ошибка при заполнении:", error);
    process.exit(1);
  }
}

main();

