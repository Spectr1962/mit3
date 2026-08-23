import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const marketingRouter = createTRPCRouter({
    // 1. Получить все направления (категории) для меню и главной страницы
    getCategories: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.category.findMany({
            include: {
                services: true,
            },
            orderBy: { title: "asc" },
        });
    }),

    // 2. Заглушка для старого метода блогов (чтобы главная страница не падала)
    getPosts: publicProcedure.query(() => {
        return [];
    }),

    // 3. Обработка входящих заявок (Пока возвращает успех, далее настроим Telegram)
    createLead: publicProcedure
        .input(
            z.object({
                name: z.string().min(2),
                phone: z.string().optional(),     // 👈 СДЕЛАЛИ ОПЦИОНАЛЬНЫМ
                contact: z.string().optional(),   // 👈 ДОБАВИЛИ ДЛЯ СОВМЕСТИМОСТИ С ФРОНТЕНДОМ
                email: z.string().email().optional(),
                serviceId: z.string().optional(),
                message: z.string().optional(),
            })
        )
        .mutation(async () => {
            return { success: true, message: "Заявка успешно принята!" };
        }),

});
