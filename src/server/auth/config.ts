import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { db } from "~/server/db";

/**
 * Расширение типов для сессии
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Главная конфигурация NextAuth для твоего проекта
 */
export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  ],
  secret: process.env.AUTH_SECRET, // Обязательный секрет для шифрования куки локально
  callbacks: {
    // Привязываем ID из базы к сессии фронтенда
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),

    // НАДЕЖНАЯ ЗАЩИТА ПО USERNAME GITHUB:
    signIn({ user }) {
      const adminId = 104278065;

      // 👇 ВСТАВЬ ЭТУ СТРОЧКУ СЮДА:
      console.log("👉 REAL USER ID FROM GITHUB IS:", user.id);

      if (Number(user.id) == adminId) {
        return true;
      }
      return false;
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
} satisfies NextAuthConfig;
