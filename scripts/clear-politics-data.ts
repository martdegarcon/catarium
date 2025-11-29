// scripts/clear-politics-data.ts
// Скрипт для очистки данных из таблиц politics (чтобы можно было перезапустить seed)

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

async function clearPoliticsData() {
  console.log("⚠️  ВНИМАНИЕ: Будет удалены все данные из таблиц politics!");
  console.log("Начинаем очистку...\n");

  // Удаляем в правильном порядке (сначала зависимые таблицы)
  const tables = [
    "politician_education",
    "government",
    "ministry_member",
    "political_party_member",
    "politician",
    "ministry_position",
    "ministry",
    "political_party_position",
    "political_party",
    "government_position",
    "dataset_university",
    "dataset_province",
    "dataset_gender",
    "user_group",
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq("uuid", "00000000-0000-0000-0000-000000000000");
    
    if (error) {
      console.error(`❌ Ошибка при очистке таблицы ${table}:`, error);
    } else {
      console.log(`✓ Очищена таблица: ${table}`);
    }
  }

  console.log("\n✓ Все данные очищены! Теперь можно запустить seed-politics.ts заново");
}

async function main() {
  try {
    await clearPoliticsData();
  } catch (error) {
    console.error("\n❌ Ошибка при очистке:", error);
    process.exit(1);
  }
}

main();

