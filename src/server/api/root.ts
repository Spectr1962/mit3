import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const appRouter = createTRPCRouter({
  system: createTRPCRouter({
    health: publicProcedure.query(() => ({ ok: true, service: "mit3" })),
    userCount: publicProcedure.query(() => db.user.count()),
    items: publicProcedure.query(() => db.dashboardItem.findMany({ orderBy: { createdAt: "asc" } })),
    toggleItem: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
      const item = await db.dashboardItem.findUniqueOrThrow({ where: { id: input.id } });
      return db.dashboardItem.update({ where: { id: input.id }, data: { completed: !item.completed } });
    }),
  }),
});

export type AppRouter = typeof appRouter;
