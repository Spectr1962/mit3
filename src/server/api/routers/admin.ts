import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
    // Запись действия пользователя (вызывается скрыто с фронтенда)
    trackAction: publicProcedure
        .input(z.object({ action: z.string(), path: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.activityLog.create({
                data: {
                    action: input.action,
                    path: input.path,
                    userId: ctx.session?.user?.id || null,
                },
            });
        }),

    // Получение аналитики для Главной админ-панели (только для ADMIN)
    getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.session.user.role !== "ADMIN") {
            throw new TRPCError({ code: "FORBIDDEN", message: "Доступ запрещен" });
        }

        const totalUsers = await ctx.db.user.count({ where: { role: "USER" } });
        const totalLogs = await ctx.db.activityLog.count();
        const recentActivities = await ctx.db.activityLog.findMany({
            take: 15,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });

        return { totalUsers, totalLogs, recentActivities };
    }),
});
