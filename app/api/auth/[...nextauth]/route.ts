import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { createClient } from "@/utils/supabase/server";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ) {
            console.error("Supabase environment variables are missing");
            return null;
          }

          if (!credentials?.login || !credentials?.password) {
            return null;
          }

          const supabase = await createClient();

          // Ищем пользователя в Supabase
          const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("login", credentials.login)
            .single();

          if (error || !user) {
            console.log("Пользователь не найден:", error);
            return null;
          }

          // Проверяем пароль
          const isPasswordValid = await compare(
            credentials.password,
            user.password_hash,
          );

          if (!isPasswordValid) {
            console.log("Неверный пароль");
            return null;
          }

          // Возвращаем данные пользователя
          return {
            id: user.id,
            login: user.login,
            email: user.email,
            language: user.language,
          };
        } catch (error) {
          console.log("Ошибка авторизации:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60,
    updateAge: 4 * 60 * 60,
  },

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.login = user.login;
        token.language = user.language;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.login = token.login as string;
        session.user.language = token.language as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
