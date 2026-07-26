import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PostType } from "@prisma/client";

export const mediaRouter = createTRPCRouter({

    /**
     * 1. ПОЛУЧЕНИЕ ПОТОКА ПУБЛИКАЦИЙ (Лента Медиацентра и Портфолио)
     * Поддерживает фильтрацию по типу контента (ARTICLE, NEWS, CASE_STUDY) и лимиты выгрузки
     */
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
                include: {
                    // Подтягиваем данные связанной услуги, чтобы на карточках кейсов выводить тег
                    service: {
                        select: {
                            title: true,
                            slug: true,
                        },
                    },
                },
            });

            return { items };
        }),

    /**
     * 2. БЕЗОПАСНОЕ ПОЛУЧЕНИЕ МАТЕРИАЛА ПО SLUG
     * Автоматически накручивает +1 к счетчику просмотров при каждом чтении.
     * Если запись не найдена (неправильный URL) — не ломает сервер, а безопасно возвращает null.
     */
    getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
                // Пытаемся атомарно обновить счетчик просмотров и забрать данные
                const updatedPost = await ctx.db.post.update({
                    where: { slug: input.slug },
                    data: { viewCount: { increment: 1 } },
                    include: {
                        // Подтягиваем информацию об услуге для конверсионного b2b-баннера внизу кейса
                        service: {
                            select: {
                                title: true,
                                slug: true,
                            },
                        },
                        // Подтягиваем автора публикации для вывода в метаданных медиацентра
                        author: {
                            select: {
                                name: true,
                            },
                        },
                    },
                });

                return updatedPost;
            } catch {
                // Ловим ошибку Prisma P2025 (Запись для обновления не найдена), чтобы сервер не падал в Runtime
                console.warn(`[tRPC Media Router]: Публикация со slug "${input.slug}" не найдена в PostgreSQL.`);
                return null;
            }
        }),
});
