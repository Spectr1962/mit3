import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const servicesRouter = createTRPCRouter({
    // Получить 7 главных разделов (1-й уровень)
    getRootServices: publicProcedure.query(({ ctx }) => {
        return ctx.db.service.findMany({
            where: { parentId: null, isActive: true },
        });
    }),

    // Получить категорию по slug вместе с её подкатегориями следующего уровня
    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.db.service.findUnique({
                where: { slug: input.slug },
                include: {
                    children: {
                        where: { isActive: true },
                    },
                    parent: true, // Нужно для хлебных крошек
                },
            });
        }),
});
