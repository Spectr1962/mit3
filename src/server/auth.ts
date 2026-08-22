import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { db } from "~/server/db";

/**
 * Расширение типов (Module Augmentation) для next-auth.
 * Позволяет TypeScript знать, что в объекте session.user гарантированно есть id.
 */
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}
/**
 * Основная конфигурация NextAuth.js
 * Настраивает адаптер Prisma, провайдер GitHub и защитные проверки.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(db),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        // Привязываем ID пользователя из базы к сессии фронтенда
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),

        // ГЛАВНЫЙ ФИЛЬТР БЕЗОПАСНОСТИ АДМИНКИ:
        signIn({ user }) {
            const adminEmail = "larionov.igor1987@yandex.ru"; // 👈 УКАЖИ ЗДЕСЬ СВОЙ РЕАЛЬНЫЙ EMAIL НА GITHUB

            if (user.email === adminEmail) {
                return true; // Пропускаем в админку только тебя
            }

            console.log(`🔒 Заблокирована попытка входа с чужого email: ${user.email}`);
            return false; // Всех остальных пользователей разворачиваем на входе
        },
    },
    // Страница, куда перенаправлять при ошибках авторизации
    pages: {
        signIn: "/admin",
        error: "/admin",
    },
});
