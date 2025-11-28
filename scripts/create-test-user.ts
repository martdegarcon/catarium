import { createClient } from "@supabase/supabase-js";
import { hashPassword } from "../processes/auth/lib/password";

const supabase = createClient(
  "https://naxowwyrzdcuzcwwuwdc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5heG93d3lyemRjdXpjd3d1d2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTA4OTAsImV4cCI6MjA3ODk2Njg5MH0.yIH3q6ZyNJQFev8iX_SMSQkn71hWKj8BI57ceM_XB58",
);

async function createTestUser() {
  try {
    const passwordHash = await hashPassword("admin123");

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          login: "admin",
          email: "admin@test.com",
          password_hash: passwordHash,
          language: "ru",
        },
      ])
      .select();

    if (error) {
      console.error("Ошибка создания пользователя:", error);
      return;
    }

    console.log("✅ Тестовый пользователь создан:");
    console.log("Логин: admin");
    console.log("Пароль: admin123");
    console.log("Email: admin@test.com");
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

createTestUser();
