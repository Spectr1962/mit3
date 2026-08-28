import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "~/server/db";

/**
 * Расширение типов для сессии
 */
declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

/**
 * Главная конфигурация NextAuth для твоего проекта
 */
export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        login: { label: "Логин", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const login = String(credentials?.login ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!login || !password) {
          return null;
        }

        const user = await db.user.findUnique({ where: { login } });
        if (
          !user?.passwordHash ||
          !(await bcrypt.compare(password, user.passwordHash))
        ) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET, // Обязательный секрет для шифрования куки локально
  callbacks: {
    jwt: ({ token, user }) => ({
      ...token,
      ...(user?.id ? { userId: user.id } : {}),
      ...(user?.role ? { role: user.role } : {}),
    }),
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: String(token.userId ?? token.sub ?? ""),
        role: String(token.role ?? "user"),
      },
    }),
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;
