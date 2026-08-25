import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";

export const postRouter = createTRPCRouter({
    // 1. Процедура получения всех секторов (направлений) для выпадающего списка
    getSectors: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.db.serviceSector.findMany({
                orderBy: { priority: "desc" },
                include: { services: true }
            });
        } catch (error) {
            console.error("База данных недоступна при сборке (post:getSectors):", error);
            return [];
        }
    }),

    // Дополнительный алиас для обратной совместимости с фронтендом админки
    getCategories: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.db.serviceSector.findMany({
                orderBy: { priority: "desc" },
                include: { services: true }
            });
        } catch (error) {
            console.error("База данных недоступна при сборке (post:getCategories):", error);
            return [];
        }
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
                metaDescription: z.string().optional(),
                metaDesc: z.string().optional(),
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
                    // Безопасно сопоставляем альтернативные имена полей для предотвращения варнингов
                    metaDesc: input.metaDesc ?? input.metaDescription ?? "",
                    keywords: "",
                    // Строгая типизация к стандартам Prisma v7
                    features: input.features ? (JSON.parse(input.features) as Prisma.InputJsonValue) : [],
                    tariffs: input.tariffs ? (JSON.parse(input.tariffs) as Prisma.InputJsonValue) : [],
                    faq: input.faq ? (JSON.parse(input.faq) as Prisma.InputJsonValue) : [],
                    sectorId: input.sectorId,
                },
            });
        }),

    // 3. Получение услуг конкретного сектора
    getServicesBySector: publicProcedure
        .input(z.object({ sectorId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.service.findMany({
                    where: { sectorId: input.sectorId },
                    orderBy: { createdAt: "desc" },
                });
            } catch (error) {
                console.error("База данных недоступна при сборке (post:getServicesBySector):", error);
                return [];
            }
        }),

    // Дополнительный алиас для совместимости с getServicesByCategory
    getServicesByCategory: publicProcedure
        .input(z.object({ categoryId: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                return await ctx.db.service.findMany({
                    where: { sectorId: input.categoryId },
                    orderBy: { createdAt: "desc" },
                });
            } catch (error) {
                console.error("База данных недоступна при сборке (post:getServicesByCategory):", error);
                return [];
            }
        }),
});
