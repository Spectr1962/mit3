import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  system: createTRPCRouter({
    health: publicProcedure.query(() => ({ ok: true, service: "mit3" })),
    userCount: publicProcedure.query(() => db.user.count()),
  }),
});

export type AppRouter = typeof appRouter;
