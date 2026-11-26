import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const serviceRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.service.findMany({
            orderBy: [{ isPopular: "desc" }, { priceFrom: "asc" }],
        });
    }),

    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.service.findUnique({
                where: { slug: input.slug },
            });
        }),
});
