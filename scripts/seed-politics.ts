// scripts/seed-politics.ts
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

// Простой RNG для детерминированной генерации
function seededRandom(seed: number): number {
  const newSeed = (seed * 9301 + 49297) % 233280;
  return newSeed / 233280;
}

function getRandomElement<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function getRandomDate(seed: number, minYear: number = 1950, maxYear: number = 1995): string {
  const year = Math.floor(seededRandom(seed) * (maxYear - minYear + 1)) + minYear;
  const month = Math.floor(seededRandom(seed * 2) * 12) + 1;
  const day = Math.floor(seededRandom(seed * 3) * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ============================================================================
// СПРАВОЧНИКИ
// ============================================================================

async function seedDatasetGender() {
  console.log("Начинаем создание справочника полов...");

  const genders = [
    { name: "Мужской" },
    { name: "Женский" },
  ];

  const { error } = await supabase.from("dataset_gender").insert(genders);

  if (error) {
    console.error("❌ Ошибка при создании справочника полов:", error);
    throw error;
  }

  console.log(`✓ Создано ${genders.length} записей в справочнике полов`);
  return genders.length;
}

async function seedDatasetProvince() {
  console.log("Начинаем создание справочника регионов...");

  const provinces = [
    { name: "Москва" },
    { name: "Санкт-Петербург" },
    { name: "Московская область" },
    { name: "Ленинградская область" },
    { name: "Новосибирская область" },
    { name: "Екатеринбург" },
    { name: "Казань" },
    { name: "Нижний Новгород" },
    { name: "Челябинск" },
    { name: "Самара" },
    { name: "Омск" },
    { name: "Ростов-на-Дону" },
    { name: "Уфа" },
    { name: "Красноярск" },
    { name: "Воронеж" },
  ];

  const { error } = await supabase.from("dataset_province").insert(provinces);

  if (error) {
    console.error("❌ Ошибка при создании справочника регионов:", error);
    throw error;
  }

  console.log(`✓ Создано ${provinces.length} записей в справочнике регионов`);
  return provinces.length;
}

async function seedDatasetUniversity() {
  console.log("Начинаем создание справочника университетов...");

  const universities = [
    { name: "Московский государственный университет", is_foreign: false },
    { name: "Санкт-Петербургский государственный университет", is_foreign: false },
    { name: "Московский государственный институт международных отношений", is_foreign: false },
    { name: "Московский государственный технический университет", is_foreign: false },
    { name: "Высшая школа экономики", is_foreign: false },
    { name: "Российский экономический университет", is_foreign: false },
    { name: "Московский государственный юридический университет", is_foreign: false },
    { name: "Санкт-Петербургский государственный экономический университет", is_foreign: false },
    { name: "Новосибирский государственный университет", is_foreign: false },
    { name: "Казанский федеральный университет", is_foreign: false },
    { name: "Гарвардский университет", is_foreign: true },
    { name: "Оксфордский университет", is_foreign: true },
    { name: "Кембриджский университет", is_foreign: true },
    { name: "Сорбонна", is_foreign: true },
    { name: "МГИМО", is_foreign: false },
  ];

  const { error } = await supabase.from("dataset_university").insert(universities);

  if (error) {
    console.error("❌ Ошибка при создании справочника университетов:", error);
    throw error;
  }

  console.log(`✓ Создано ${universities.length} записей в справочнике университетов`);
  return universities.length;
}

// ============================================================================
// ПОЛИТИКИ
// ============================================================================

async function seedPoliticians(count: number = 100) {
  console.log(`Начинаем создание ${count} политиков...`);

  // Получаем справочники
  const { data: genders } = await supabase.from("dataset_gender").select("uuid");
  const { data: provinces } = await supabase.from("dataset_province").select("uuid");

  if (!genders || genders.length === 0 || !provinces || provinces.length === 0) {
    throw new Error("Справочники не заполнены. Запустите сначала seed справочников.");
  }

  const firstNames = [
    "Иван", "Александр", "Дмитрий", "Сергей", "Андрей", "Алексей", "Максим", "Владимир",
    "Михаил", "Николай", "Елена", "Мария", "Анна", "Ольга", "Татьяна", "Наталья",
    "Екатерина", "Светлана", "Ирина", "Юлия"
  ];

  const lastNames = [
    "Иванов", "Петров", "Смирнов", "Козлов", "Попов", "Соколов", "Лебедев", "Новikov",
    "Морозов", "Волков", "Алексеев", "Лебедева", "Семенов", "Егоров", "Павлов", "Козлова",
    "Степанов", "Николаев", "Орлов", "Андреев"
  ];

  const politicians = [];

  for (let i = 0; i < count; i++) {
    const seed = i + 1;
    const firstName = getRandomElement(firstNames, seed);
    const lastName = getRandomElement(lastNames, seed * 2);
    const fullName = `${firstName} ${lastName}`;
    
    const gender = getRandomElement(genders, seed * 3);
    const province = getRandomElement(provinces, seed * 5);

    politicians.push({
      name: fullName,
      source_name: `${fullName.toLowerCase().replace(/\s/g, '_')}_${seed}`,
      avatar_path: `/image/${(seed % 24) + 1}.png`,
      birthday: getRandomDate(seed * 7),
      is_married: seededRandom(seed * 11) > 0.3,
      children: seededRandom(seed * 13) > 0.5 ? Math.floor(seededRandom(seed * 17) * 4) : 0,
      military_service: seededRandom(seed * 19) > 0.6,
      gender_uuid: gender.uuid,
      province_uuid: province.uuid,
    });
  }

  // Вставляем батчами по 50
  const batchSize = 50;
  for (let i = 0; i < politicians.length; i += batchSize) {
    const batch = politicians.slice(i, i + batchSize);
    const { error } = await supabase.from("politician").insert(batch);
    
    if (error) {
      console.error(`❌ Ошибка при создании политиков (батч ${Math.floor(i / batchSize) + 1}):`, error);
      throw error;
    }
    
    console.log(`✓ Создано политиков: ${Math.min(i + batchSize, politicians.length)}/${politicians.length}`);
  }

  console.log(`✓ Всего создано ${politicians.length} политиков`);
  return politicians.length;
}

// ============================================================================
// ПОЛИТИЧЕСКИЕ ПАРТИИ
// ============================================================================

async function seedPoliticalPartyPositions() {
  console.log("Начинаем создание должностей в партиях...");

  const positions = [
    { name: "Председатель" },
    { name: "Заместитель председателя" },
    { name: "Член президиума" },
    { name: "Секретарь" },
    { name: "Член партии" },
    { name: "Координатор" },
  ];

  const { error } = await supabase.from("political_party_position").insert(positions);

  if (error) {
    console.error("❌ Ошибка при создании должностей в партиях:", error);
    throw error;
  }

  console.log(`✓ Создано ${positions.length} должностей в партиях`);
  return positions.length;
}

async function seedPoliticalParties() {
  console.log("Начинаем создание политических партий...");

  const parties = [
    { name: "Единая Россия", description: "Всероссийская политическая партия", numbers: 324, is_active: true, reveal_day: 1 },
    { name: "Коммунистическая партия", description: "Коммунистическая партия Российской Федерации", numbers: 57, is_active: true, reveal_day: 1 },
    { name: "ЛДПР", description: "Либерально-демократическая партия России", numbers: 23, is_active: true, reveal_day: 1 },
    { name: "Справедливая Россия", description: "Политическая партия Справедливая Россия", numbers: 27, is_active: true, reveal_day: 1 },
    { name: "Новые люди", description: "Политическая партия Новые люди", numbers: 15, is_active: true, reveal_day: 1 },
    { name: "Партия Роста", description: "Партия роста", numbers: 1, is_active: true, reveal_day: 1 },
    { name: "Гражданская платформа", description: "Политическая партия Гражданская платформа", numbers: 1, is_active: true, reveal_day: 1 },
  ];

  const { error } = await supabase.from("political_party").insert(parties);

  if (error) {
    console.error("❌ Ошибка при создании политических партий:", error);
    throw error;
  }

  console.log(`✓ Создано ${parties.length} политических партий`);
  return parties.length;
}

async function seedPoliticalPartyMembers() {
  console.log("Начинаем создание членства в партиях...");

  // Получаем политиков и партии
  const { data: politicians } = await supabase.from("politician").select("uuid").limit(100);
  const { data: parties } = await supabase.from("political_party").select("uuid");
  const { data: positions } = await supabase.from("political_party_position").select("uuid");

  if (!politicians || !parties || !positions) {
    throw new Error("Не удалось получить данные для создания членства");
  }

  const members = [];
  
  // Каждый политик может быть членом 0-2 партий
  for (const politician of politicians) {
    const seed = parseInt(politician.uuid.slice(-8), 16) || 0;
    const partiesCount = Math.floor(seededRandom(seed) * 3); // 0-2 партии
        
    const usedParties = new Set<string>();
    
    for (let i = 0; i < partiesCount; i++) {
      const party = getRandomElement(parties, seed * (i + 1));
      
      if (usedParties.has(party.uuid)) continue;
      usedParties.add(party.uuid);
      
      const position = seededRandom(seed * (i + 3)) > 0.3 
        ? getRandomElement(positions, seed * (i + 5))
        : null;

      members.push({
        politician_uuid: politician.uuid,
        political_party_uuid: party.uuid,
        position_uuid: position?.uuid || null,
        is_active: seededRandom(seed * (i + 7)) > 0.2,
        reveal_day: Math.floor(seededRandom(seed * (i + 11)) * 365) + 1,
      });
    }
  }

  // Вставляем батчами
  const batchSize = 50;
  for (let i = 0; i < members.length; i += batchSize) {
    const batch = members.slice(i, i + batchSize);
    const { error } = await supabase.from("political_party_member").insert(batch);
    
    if (error) {
      console.error(`❌ Ошибка при создании членства (батч ${Math.floor(i / batchSize) + 1}):`, error);
      throw error;
    }
    
    console.log(`✓ Создано членств: ${Math.min(i + batchSize, members.length)}/${members.length}`);
  }

  console.log(`✓ Всего создано ${members.length} членств в партиях`);
  return members.length;
}

// ============================================================================
// МИНИСТЕРСТВА
// ============================================================================

async function seedMinistryPositions() {
  console.log("Начинаем создание должностей в министерствах...");

  const positions = [
    { name: "Министр" },
    { name: "Заместитель министра" },
    { name: "Первый заместитель министра" },
    { name: "Статс-секретарь" },
    { name: "Директор департамента" },
    { name: "Заместитель директора департамента" },
  ];

  const { error } = await supabase.from("ministry_position").insert(positions);

  if (error) {
    console.error("❌ Ошибка при создании должностей в министерствах:", error);
    throw error;
  }

  console.log(`✓ Создано ${positions.length} должностей в министерствах`);
  return positions.length;
}

async function seedMinistries() {
  console.log("Начинаем создание министерств...");

  const ministries = [
    { name: "Министерство внутренних дел", description: "МВД России", numbers: 50, is_active: true, reveal_day: 1 },
    { name: "Министерство обороны", description: "Минобороны России", numbers: 45, is_active: true, reveal_day: 1 },
    { name: "Министерство иностранных дел", description: "МИД России", numbers: 30, is_active: true, reveal_day: 1 },
    { name: "Министерство финансов", description: "Минфин России", numbers: 35, is_active: true, reveal_day: 1 },
    { name: "Министерство экономического развития", description: "Минэкономразвития России", numbers: 40, is_active: true, reveal_day: 1 },
    { name: "Министерство образования", description: "Минобрнауки России", numbers: 25, is_active: true, reveal_day: 1 },
    { name: "Министерство здравоохранения", description: "Минздрав России", numbers: 28, is_active: true, reveal_day: 1 },
    { name: "Министерство культуры", description: "Минкультуры России", numbers: 20, is_active: true, reveal_day: 1 },
    { name: "Министерство спорта", description: "Минспорт России", numbers: 15, is_active: true, reveal_day: 1 },
    { name: "Министерство транспорта", description: "Минтранс России", numbers: 22, is_active: true, reveal_day: 1 },
  ];

  const { error } = await supabase.from("ministry").insert(ministries);

  if (error) {
    console.error("❌ Ошибка при создании министерств:", error);
    throw error;
  }

  console.log(`✓ Создано ${ministries.length} министерств`);
  return ministries.length;
}

async function seedMinistryMembers() {
  console.log("Начинаем создание членства в министерствах...");

  const { data: politicians } = await supabase.from("politician").select("uuid").limit(100);
  const { data: ministries } = await supabase.from("ministry").select("uuid");
  const { data: positions } = await supabase.from("ministry_position").select("uuid");

  if (!politicians || !ministries || !positions) {
    throw new Error("Не удалось получить данные для создания членства");
  }

  const members = [];
  
  // Каждый политик может быть членом 0-1 министерства
  for (const politician of politicians) {
    const seed = parseInt(politician.uuid.slice(-8), 16) || 0;
    
    if (seededRandom(seed) > 0.7) { // 30% вероятность быть в министерстве
      const ministry = getRandomElement(ministries, seed * 3);
      const position = getRandomElement(positions, seed * 5);

      members.push({
        politician_uuid: politician.uuid,
        ministry_uuid: ministry.uuid,
        position_uuid: position.uuid,
        is_active: seededRandom(seed * 7) > 0.2,
        reveal_day: Math.floor(seededRandom(seed * 11) * 365) + 1,
      });
    }
  }

  // Вставляем батчами
  const batchSize = 50;
  for (let i = 0; i < members.length; i += batchSize) {
    const batch = members.slice(i, i + batchSize);
    const { error } = await supabase.from("ministry_member").insert(batch);
    
    if (error) {
      console.error(`❌ Ошибка при создании членства (батч ${Math.floor(i / batchSize) + 1}):`, error);
      throw error;
    }
    
    console.log(`✓ Создано членств: ${Math.min(i + batchSize, members.length)}/${members.length}`);
  }

  console.log(`✓ Всего создано ${members.length} членств в министерствах`);
  return members.length;
}

// ============================================================================
// ПРАВИТЕЛЬСТВО
// ============================================================================

async function seedGovernmentPositions() {
  console.log("Начинаем создание должностей в правительстве...");

  const positions = [
    { name: "Премьер-министр" },
    { name: "Первый заместитель премьер-министра" },
    { name: "Заместитель премьер-министра" },
    { name: "Министр" },
    { name: "Заместитель министра" },
  ];

  const { error } = await supabase.from("government_position").insert(positions);

  if (error) {
    console.error("❌ Ошибка при создании должностей в правительстве:", error);
    throw error;
  }

  console.log(`✓ Создано ${positions.length} должностей в правительстве`);
  return positions.length;
}

async function seedGovernment() {
  console.log("Начинаем создание состава правительства...");

  const { data: politicians } = await supabase.from("politician").select("uuid").limit(100);
  const { data: positions } = await supabase.from("government_position").select("uuid");

  if (!politicians || !positions) {
    throw new Error("Не удалось получить данные для создания правительства");
  }

  const government = [];
  
  // Выбираем 15-20 политиков для правительства
  const selectedPoliticians = politicians.slice(0, Math.min(20, politicians.length));
  
  for (let i = 0; i < selectedPoliticians.length; i++) {
    const politician = selectedPoliticians[i];
    const seed = parseInt(politician.uuid.slice(-8), 16) || 0;
    const position = getRandomElement(positions, seed * 3);

    government.push({
      politician_uuid: politician.uuid,
      position_uuid: position.uuid,
      is_active: true,
      reveal_day: Math.floor(seededRandom(seed * 5) * 365) + 1,
    });
  }

  const { error } = await supabase.from("government").insert(government);

  if (error) {
    console.error("❌ Ошибка при создании правительства:", error);
    throw error;
  }

  console.log(`✓ Создано ${government.length} должностей в правительстве`);
  return government.length;
}

// ============================================================================
// ОБРАЗОВАНИЕ
// ============================================================================

async function seedPoliticianEducation() {
  console.log("Начинаем создание образования политиков...");

  const { data: politicians } = await supabase.from("politician").select("uuid").limit(100);
  const { data: universities } = await supabase.from("dataset_university").select("uuid");

  if (!politicians || !universities) {
    throw new Error("Не удалось получить данные для создания образования");
  }

  const educationLevels = [
    "Бакалавриат",
    "Магистратура",
    "Специалитет",
    "Аспирантура",
    "Докторантура"
  ];

  const education = [];
  
  // Каждый политик может иметь 1-3 образования
  for (const politician of politicians) {
    const seed = parseInt(politician.uuid.slice(-8), 16) || 0;
    const educationCount = Math.floor(seededRandom(seed) * 3) + 1; // 1-3 образования
    
    for (let i = 0; i < educationCount; i++) {
      const university = getRandomElement(universities, seed * (i + 1));
      const educationLevel = getRandomElement(educationLevels, seed * (i + 2));

      education.push({
        politician_uuid: politician.uuid,
        university_uuid: university.uuid,
        education_level: educationLevel,
        sequence_number: i + 1,
      });
    }
  }

  // Вставляем батчами
  const batchSize = 50;
  for (let i = 0; i < education.length; i += batchSize) {
    const batch = education.slice(i, i + batchSize);
    const { error } = await supabase.from("politician_education").insert(batch);
    
    if (error) {
      console.error(`❌ Ошибка при создании образования (батч ${Math.floor(i / batchSize) + 1}):`, error);
      throw error;
    }
    
    console.log(`✓ Создано записей образования: ${Math.min(i + batchSize, education.length)}/${education.length}`);
  }

  console.log(`✓ Всего создано ${education.length} записей образования`);
  return education.length;
}

// ============================================================================
// ПОЛЬЗОВАТЕЛИ
// ============================================================================

async function seedUserGroups() {
  console.log("Начинаем создание групп пользователей...");

  const groups = [
    { name: "Администраторы", start_date: "2020-01-01", end_date: null },
    { name: "Модераторы", start_date: "2020-01-01", end_date: null },
    { name: "Редакторы", start_date: "2021-01-01", end_date: null },
    { name: "Пользователи", start_date: "2021-01-01", end_date: null },
  ];

  const { error } = await supabase.from("user_group").insert(groups);

  if (error) {
    console.error("❌ Ошибка при создании групп пользователей:", error);
    throw error;
  }

  console.log(`✓ Создано ${groups.length} групп пользователей`);
  return groups.length;
}

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ
// ============================================================================

async function main() {
  console.log("=== Заполнение таблиц Politics ===\n");

  try {
    // 1. Справочники
    await seedDatasetGender();
    await seedDatasetProvince();
    await seedDatasetUniversity();
    
    // 2. Политики
    await seedPoliticians(100);
    
    // 3. Политические партии
    await seedPoliticalPartyPositions();
    await seedPoliticalParties();
    await seedPoliticalPartyMembers();
    
    // 4. Министерства
    await seedMinistryPositions();
    await seedMinistries();
    await seedMinistryMembers();
    
    // 5. Правительство
    await seedGovernmentPositions();
    await seedGovernment();
    
    // 6. Образование
    await seedPoliticianEducation();
    
    // 7. Группы пользователей
    await seedUserGroups();
    
    console.log("\n=== Заполнение завершено успешно! ===");
  } catch (error) {
    console.error("\n❌ Ошибка при заполнении:", error);
    process.exit(1);
  }
}

main();

