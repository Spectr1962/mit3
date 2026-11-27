import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const serviceRouter = createTRPCRouter({
    getCategoriesWithServices: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.serviceCategory.findMany({
            orderBy: { order: "asc" },
            include: {
                services: {
                    orderBy: [{ isPopular: "desc" }, { priceFrom: "asc" }],
                },
            },
        });
    }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.service.findMany({
            orderBy: [{ isPopular: "desc" }, { priceFrom: "asc" }],
            include: {
                category: true,
            },
        });
    }),

    getCategoryBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.serviceCategory.findUnique({
                where: { slug: input.slug },
                include: {
                    services: {
                        orderBy: [{ isPopular: "desc" }, { priceFrom: "asc" }],
                    },
                },
            });
        }),

    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.service.findUnique({
                where: { slug: input.slug },
                include: {
                    category: true,
                },
            });
        }),
});
