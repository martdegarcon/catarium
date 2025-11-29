// scripts/update-education-levels.ts
// Скрипт для обновления существующих записей образования с добавлением уровня образования

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

async function updateEducationLevels() {
  console.log("Начинаем обновление уровня образования в существующих записях...");

  const educationLevels = [
    "Бакалавриат",
    "Магистратура",
    "Специалитет",
    "Аспирантура",
    "Докторантура"
  ];

  // Получаем все записи образования без уровня
  const { data: educationRecords, error: fetchError } = await supabase
    .from("politician_education")
    .select("uuid, politician_uuid, sequence_number")
    .is("education_level", null);

  if (fetchError) {
    console.error("❌ Ошибка при получении записей образования:", fetchError);
    throw fetchError;
  }

  if (!educationRecords || educationRecords.length === 0) {
    console.log("✓ Все записи уже имеют уровень образования");
    return 0;
  }

  console.log(`Найдено ${educationRecords.length} записей без уровня образования`);

  // Обновляем каждую запись
  let updated = 0;
  const batchSize = 50;

  for (let i = 0; i < educationRecords.length; i += batchSize) {
    const batch = educationRecords.slice(i, i + batchSize);
    
    for (const record of batch) {
      const seed = parseInt(record.uuid.slice(-8), 16) || parseInt(record.politician_uuid.slice(-8), 16) || 0;
      const educationLevel = getRandomElement(educationLevels, seed * (record.sequence_number || 1));

      const { error: updateError } = await supabase
        .from("politician_education")
        .update({ education_level: educationLevel })
        .eq("uuid", record.uuid);

      if (updateError) {
        console.error(`❌ Ошибка при обновлении записи ${record.uuid}:`, updateError);
      } else {
        updated++;
      }
    }

    console.log(`✓ Обновлено: ${Math.min(i + batchSize, educationRecords.length)}/${educationRecords.length}`);
  }

  console.log(`✓ Всего обновлено ${updated} записей`);
  return updated;
}

async function main() {
  console.log("=== Обновление уровня образования ===\n");

  try {
    await updateEducationLevels();
    console.log("\n=== Обновление завершено успешно! ===");
  } catch (error) {
    console.error("\n❌ Ошибка при обновлении:", error);
    process.exit(1);
  }
}

main();

