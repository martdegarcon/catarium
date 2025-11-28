import { hash } from "bcryptjs";

async function generateHash() {
  const password = "admin123";
  const hashedPassword = await hash(password, 12);
  console.log("Пароль:", password);
  console.log("Хеш пароля:", hashedPassword);
}

generateHash();
