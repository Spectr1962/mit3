import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
    // 1. Процедура получения всех секторов (направлений) для выпадающего списка
    getSectors: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.serviceSector.findMany({
            orderBy: { priority: "desc" },
        });
    }),

    // Дополнительный алиас для обратной совместимости, если в коде админки вызывается getCategories
    getCategories: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.serviceSector.findMany({
            orderBy: { priority: "desc" },
        });
    }),

    // 2. Процедура создания новой коммерческой услуги из админки
    createService: publicProcedure
        .input(
            z.object({
                sectorId: z.string(),
                name: z.string().min(1),
                titleH1: z.string().min(1),
                description: z.string(),
                priceFrom: z.number().positive(),
                metaTitle: z.string(),
                metaDescription: z.string().optional(), // Делаем опциональным, если передается metaDesc
                metaDesc: z.string().optional(),
                features: z.string(),
                tariffs: z.string(),
                faq: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.service.create({
                data: {
                    name: input.name,
                    titleH1: input.titleH1,
                    description: input.description,
                    priceFrom: input.priceFrom,
                    metaTitle: input.metaTitle,
                    // Безопасно сопоставляем альтернативные имена полей
                    metaDesc: input.metaDesc ?? input.metaDescription ?? "",
                    keywords: "",
                    // Парсим строки в JSON, так как в Prisma эти поля имеют тип Json
                    features: input.features ? JSON.parse(input.features) : [],
                    tariffs: input.tariffs ? JSON.parse(input.tariffs) : [],
                    faq: input.faq ? JSON.parse(input.faq) : [],
                    sectorId: input.sectorId,
                },
            });
        }),

    // 3. Получение услуг конкретного сектора (для вывода в каталоге)
    getServicesBySector: publicProcedure
        .input(z.object({ sectorId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.service.findMany({
                where: { sectorId: input.sectorId },
                orderBy: { createdAt: "desc" },
            });
        }),

    // Дополнительный алиас для совместимости с getServicesByCategory
    getServicesByCategory: publicProcedure
        .input(z.object({ categoryId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.service.findMany({
                where: { sectorId: input.categoryId },
                orderBy: { createdAt: "desc" },
            });
        }),
});
