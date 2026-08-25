import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

export const marketingRouter = createTRPCRouter({
    // 1. Безопасное получение секторов для админки и главной страницы
    getSectors: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.db.serviceSector.findMany({
                orderBy: { priority: "desc" },
                include: { services: true } // Подгружаем вложенные услуги для главной страницы
            });
        } catch (error) {
            console.error("База данных недоступна при сборке (marketing:getSectors):", error);
            return []; // Возвращаем пустой массив, чтобы Docker успешно завершил билд
        }
    }),

    // Алиас для обратной совместимости с главной страницей
    getCategories: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.db.serviceSector.findMany({
                orderBy: { priority: "desc" },
                include: { services: true }
            });
        } catch (error) {
            console.error("База данных недоступна при сборке (marketing:getCategories):", error);
            return [];
        }
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
            // Автоматическая SEO-генерация ЧПУ слага из имени услуги
            const generatedSlug = input.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_]+/g, "-");

            return await ctx.db.service.create({
                data: {
                    slug: generatedSlug,
                    name: input.name,
                    titleH1: input.titleH1,
                    description: input.description,
                    priceFrom: input.priceFrom,
                    metaTitle: input.metaTitle,
                    metaDesc: input.metaDesc,
                    keywords: "",
                    // Безопасное приведение к InputJsonValue под новые стандарты строгого линтинга в Docker
                    features: input.features ? (JSON.parse(input.features) as Prisma.InputJsonValue) : [],
                    tariffs: input.tariffs ? (JSON.parse(input.tariffs) as Prisma.InputJsonValue) : [],
                    faq: input.faq ? (JSON.parse(input.faq) as Prisma.InputJsonValue) : [],
                    sectorId: input.sectorId,
                },
            });
        }),

    // 3. Получение услуг конкретного сектора (для вывода в каталоге)
    getServicesBySector: publicProcedure
        .input(z.object({ sectorId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.service.findMany({
                    where: { sectorId: input.sectorId },
                    orderBy: { createdAt: "desc" },
                });
            } catch (error) {
                console.error("База данных недоступна при сборке (marketing:getServicesBySector):", error);
                return [];
            }
        }),

    // Алиас для обратной совместимости с фронтендом, если вызывается getServicesByCategory
    getServicesByCategory: publicProcedure
        .input(z.object({ categoryId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.service.findMany({
                    where: { sectorId: input.categoryId },
                    orderBy: { createdAt: "desc" },
                });
            } catch (error) {
                console.error("База данных недоступна при сборке (marketing:getServicesByCategory):", error);
                return [];
            }
        }),
});
