import { marketingRouter } from "~/server/api/routers/marketing";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * Главный роутер сервера. Сюда подключен только наш маркетинг.
 */
export const appRouter = createTRPCRouter({
  marketing: marketingRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
