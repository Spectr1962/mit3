import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const marketingRouter = createTRPCRouter({
    // 1. Процедура, которую вызывает админка для выпадающего списка секторов
    getSectors: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.serviceSector.findMany({
            orderBy: { priority: "desc" },
        });
    }),

    // Оставляем для совместимости старое название, если оно где-то используется
    getCategories: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.serviceSector.findMany({
            orderBy: { priority: "desc" },
        });
    }),

    // 2. Процедура создания новой коммерческой услуги из вашей админки
    createService: publicProcedure
        .input(
            z.object({
                sectorId: z.string(),
                name: z.string().min(1),
                titleH1: z.string().min(1),
                description: z.string(),
                priceFrom: z.number().positive(),
                metaTitle: z.string(),
                metaDesc: z.string(),
                features: z.string(),
                tariffs: z.string(),
                faq: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // SEO-генерация слага: переводим название в нижний регистр, заменяем пробелы на дефисы
            // и очищаем от спецсимволов. Для полноценного транслита кириллицы можно использовать библиотеку или оставить так для латиницы.
            const generatedSlug = input.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_]+/g, "-");

            return await ctx.db.service.create({
                data: {
                    // ДОБАВЛЯЕМ ОБЯЗАТЕЛЬНОЕ ПОЛЕ СЛАГА ДЛЯ PRISMA И SEO ЧПУ:
                    slug: generatedSlug,

                    name: input.name,
                    titleH1: input.titleH1,
                    description: input.description,
                    priceFrom: input.priceFrom,
                    metaTitle: input.metaTitle,
                    metaDesc: input.metaDesc,
                    keywords: "",
                    features: input.features ? JSON.parse(input.features) : [],
                    tariffs: input.tariffs ? JSON.parse(input.tariffs) : [],
                    faq: input.faq ? JSON.parse(input.faq) : [],
                    sectorId: input.sectorId,
                },
            });
        }),

    // 3. Дополнительные процедуры для получения услуг (чтобы админка не ругалась при инвалидации)
    getServicesBySector: publicProcedure
        .input(z.object({ sectorId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.service.findMany({
                where: { sectorId: input.sectorId },
                orderBy: { createdAt: "desc" },
            });
        }),

    getServicesByCategory: publicProcedure
        .input(z.object({ categoryId: z.string() }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.service.findMany({
                where: { sectorId: input.categoryId },
                orderBy: { createdAt: "desc" },
            });
        }),
});
