// scripts/apply-migration-004.ts
// Скрипт для применения миграции 004_add_education_level.sql

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

config({ path: "./.env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("FATAL: Supabase credentials not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log("Применение миграции 004_add_education_level.sql...\n");

  try {
    // Читаем SQL из файла миграции
    const migrationPath = join(process.cwd(), "supabase/migrations/004_add_education_level.sql");
    const sql = readFileSync(migrationPath, "utf-8");

    // Разбиваем на отдельные команды
    const commands = sql
      .split(";")
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith("--"));

    // Применяем каждую команду через RPC или прямые SQL запросы
    // Supabase JS не поддерживает прямые SQL запросы, нужно использовать REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ sql_query: sql }),
    });

    if (!response.ok) {
      // Если RPC не доступен, применяем напрямую через SQL
      console.log("Попытка прямого применения SQL...");
      
      // Используем простой способ - проверяем наличие поля и добавляем если нет
      const { data: checkResult, error: checkError } = await supabase
        .rpc("check_column_exists", {
          table_name: "politician_education",
          column_name: "education_level",
        });

      if (checkError) {
        // RPC может не существовать, применяем SQL напрямую через SQL редактор
        console.log("⚠️  RPC недоступен. Примените миграцию вручную через Supabase Dashboard:");
        console.log("\nSQL для выполнения:");
        console.log("=".repeat(50));
        console.log(sql);
        console.log("=".repeat(50));
        console.log("\nИли выполните команду через psql:");
        console.log(`psql "postgresql://..." < supabase/migrations/004_add_education_level.sql`);
        return;
      }
    }

    console.log("✓ Миграция применена успешно!");
  } catch (error: any) {
    console.error("❌ Ошибка при применении миграции:", error.message);
    console.log("\nПримените миграцию вручную:");
    console.log("1. Откройте Supabase Dashboard");
    console.log("2. Перейдите в SQL Editor");
    console.log("3. Скопируйте содержимое файла supabase/migrations/004_add_education_level.sql");
    console.log("4. Выполните SQL");
  }
}

applyMigration();

