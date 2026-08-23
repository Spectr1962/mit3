import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const marketingRouter = createTRPCRouter({
    // 1. Получить все направления
    getCategories: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.category.findMany({
            include: {
                services: true,
            },
            orderBy: { title: "asc" },
        });
    }),

    // 🔥 2. МЕТОД ЗАПИСИ НАПРАВЛЕНИЯ ИЗ АДМИНКИ В БАЗУ ДАННЫХ
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
