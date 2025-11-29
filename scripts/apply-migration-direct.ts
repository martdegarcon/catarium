// scripts/apply-migration-direct.ts
// Простой скрипт для применения миграции через прямой SQL запрос

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: "./.env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("FATAL: Supabase credentials not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: "public",
  },
});

async function applyMigration() {
  console.log("Применение миграции: добавление поля education_level...\n");

  try {
    // Проверяем, существует ли уже поле
    const { data: existingColumn, error: checkError } = await supabase
      .rpc("sql", {
        query: `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'politician_education' 
          AND column_name = 'education_level';
        `,
      });

    if (checkError) {
      // Пробуем другой способ - через прямой запрос к PostgREST
      console.log("Попытка применения через SQL запрос...");
      
      // К сожалению, Supabase JS client не поддерживает выполнение произвольных SQL
      // Нужно использовать Supabase Dashboard или psql
      
      console.log("\n⚠️  Supabase JS client не поддерживает выполнение произвольных SQL.");
      console.log("Примените миграцию одним из способов:\n");
      console.log("Способ 1: Через Supabase Dashboard");
      console.log("  1. Откройте https://supabase.com/dashboard");
      console.log("  2. Выберите ваш проект");
      console.log("  3. Перейдите в SQL Editor");
      console.log("  4. Скопируйте и выполните SQL из файла:");
      console.log("     supabase/migrations/004_add_education_level.sql\n");
      console.log("Способ 2: Через psql (если есть доступ к БД)");
      console.log("  psql <connection_string> < supabase/migrations/004_add_education_level.sql\n");
      console.log("SQL команда для копирования:");
      console.log("─".repeat(60));
      console.log("ALTER TABLE politician_education");
      console.log("ADD COLUMN IF NOT EXISTS education_level VARCHAR(255);");
      console.log("─".repeat(60));
      return;
    }

    if (existingColumn && existingColumn.length > 0) {
      console.log("✓ Поле education_level уже существует");
      return;
    }

    // Если дошли сюда, поле не существует, но мы не можем его создать через JS client
    console.log("⚠️  Поле не найдено, но нельзя создать через JS client.");
    console.log("Примените миграцию вручную через Supabase Dashboard (см. инструкции выше).");
  } catch (error: any) {
    console.error("❌ Ошибка:", error.message);
    console.log("\nПримените миграцию вручную через Supabase Dashboard (см. инструкции выше).");
  }
}

applyMigration();

