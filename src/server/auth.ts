import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import EmailProvider from "next-auth/providers/nodemailer";
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
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            maxAge: 10 * 60,
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

        signIn({ user }) {
            return user.email === "larionov.igor1987@yandex.ru";
        },
    },
    // Страница, куда перенаправлять при ошибках авторизации
    pages: {
        signIn: "/admin",
        error: "/admin",
    },
});
