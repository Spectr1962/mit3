import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PostType } from "@prisma/client";

export const mediaRouter = createTRPCRouter({
    // Получение публикаций с фильтрацией по типу (ARTICLE / CASE_STUDY)
    getInfiniteFeed: publicProcedure
        .input(
            z.object({
                type: z.nativeEnum(PostType).optional(),
                limit: z.number().min(1).max(50).default(10),
            })
        )
        .query(async ({ ctx, input }) => {
            const items = await ctx.db.post.findMany({
                take: input.limit,
                where: {
                    isPublished: true,
                    ...(input.type ? { type: input.type } : {}),
                },
                orderBy: { publishedAt: "desc" },
            });

            return { items };
        }),

    // Получение статьи/кейса по slug с инкрементом просмотров
    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.post.update({
                where: { slug: input.slug },
                data: { viewCount: { increment: 1 } },
            });
        }),
});
