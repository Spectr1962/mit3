import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/nodemailer";
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
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        secure: Number(process.env.EMAIL_SERVER_PORT ?? 587) === 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60,
    }),
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

    signIn({ user }) {
      return user.email === "larionov.igor1987@yandex.ru";
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
} satisfies NextAuthConfig;
