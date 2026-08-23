import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const marketingRouter = createTRPCRouter({
    // 1. Получить все направления со всеми услугами
    getCategories: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.category.findMany({
            include: {
                services: true,
            },
            orderBy: { title: "asc" },
        });
    }),

    // 2. Создать Направление
    createCategory: publicProcedure
        .input(
            z.object({
                title: z.string().min(2),
                slug: z.string().min(2),
                description: z.string().optional(),
                h1: z.string().optional(),
                seoTitle: z.string().optional(),
                seoDescription: z.string().optional(),
                seoKeywords: z.string().optional(),
                ogTitle: z.string().optional(),
                ogImage: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.category.create({
                data: {
                    title: input.title,
                    slug: input.slug.toLowerCase().trim(),
                    description: input.description,
                    h1: input.h1,
                    seoTitle: input.seoTitle,
                    seoDescription: input.seoDescription,
                    seoKeywords: input.seoKeywords,
                    ogTitle: input.ogTitle,
                    ogImage: input.ogImage,
                },
            });
        }),

    // 📁 3. ОБНОВИТЬ НАПРАВЛЕНИЕ (РЕДАКТИРОВАНИЕ)
    updateCategory: publicProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(2),
                slug: z.string().min(2),
                description: z.string().optional(),
                h1: z.string().optional(),
                seoTitle: z.string().optional(),
                seoDescription: z.string().optional(),
                seoKeywords: z.string().optional(),
                ogTitle: z.string().optional(),
                ogImage: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            return await ctx.db.category.update({
                where: { id },
                data: {
                    ...data,
                    slug: data.slug.toLowerCase().trim(),
                    description: data.description ?? null,
                    h1: data.h1 ?? null,
                    seoTitle: data.seoTitle ?? null,
                    seoDescription: data.seoDescription ?? null,
                    seoKeywords: data.seoKeywords ?? null,
                    ogTitle: data.ogTitle ?? null,
                    ogImage: data.ogImage ?? null,
                },
            });
        }),

    // 4. Создать Конечную Услугу
    createService: publicProcedure
        .input(
            z.object({
                title: z.string().min(2),
                slug: z.string().min(2),
                categoryId: z.string().min(2),
                priceFrom: z.number().min(0),
                seoDescription: z.string().min(2),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.service.create({
                data: {
                    title: input.title,
                    slug: input.slug.toLowerCase().trim(),
                    categoryId: input.categoryId,
                    priceFrom: input.priceFrom,
                    seoDescription: input.seoDescription,
                },
            });
        }),

    // 💼 5. ОБНОВИТЬ КОНЕЧНУЮ УСЛУГУ (РЕДАКТИРОВАНИЕ)
    updateService: publicProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(2),
                slug: z.string().min(2),
                categoryId: z.string().min(2),
                priceFrom: z.number().min(0),
                seoDescription: z.string().min(2),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            return await ctx.db.service.update({
                where: { id },
                data: {
                    ...data,
                    slug: data.slug.toLowerCase().trim(),
                },
            });
        }),

    getPosts: publicProcedure.query(() => {
        return [];
    }),

    createLead: publicProcedure
        .input(
            z.object({
                name: z.string().min(2),
                phone: z.string().optional(),
                contact: z.string().optional(),
                email: z.string().email().optional(),
                serviceId: z.string().optional(),
                message: z.string().optional(),
            })
        )
        .mutation(async () => {
            return { success: true, message: "Заявка успешно принята!" };
        }),
});
